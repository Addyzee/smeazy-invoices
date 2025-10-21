from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud, database
from app.models import User
from app.utils import generate_random_password
from app.deps import get_current_active_user
from fastapi import APIRouter, Depends, HTTPException


router = APIRouter(prefix="/invoices", tags=["invoices"])


@router.post("/create", response_model=schemas.InvoiceOut)
def create_invoice(
    invoice: schemas.InvoiceCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(database.get_db),
):
    if current_user.username != invoice.username:
        return {"error": "Unauthorized"}
    customer_phone = invoice.customer.phone_number if invoice.customer else invoice.customer_phone

    if customer_phone:
        # Check if customer exists by phone number
        customer = (
            db.query(User)
            .filter(User.phone_number == customer_phone)
            .first()
        )
        if customer:
            new_invoice = crud.create_invoice(
                db=db, invoice=invoice, customer_id=customer.id
            )

    if (invoice.customer and not invoice.customer.full_name) and not invoice.customer_name:
        return {"error": "Customer name is required"}

    # create invoice (using customer_id)
    new_invoice = crud.create_invoice(db=db, invoice=invoice)

    return new_invoice

@router.post("/create-anonymous", response_model=schemas.InvoiceOut)
def create_anonymous_invoice(
    invoice: schemas.InvoiceCreate, db: Session = Depends(database.get_db)
):
    # Check if customer exists by phone number
    # TODO: On app startup, create a default anonymous customer if not exists
    customer = db.query(User).filter(User.username == "anonymous_customer").first()
    password_text = None

    if not customer:
        # create new customer with random password
        password_text = generate_random_password()

        customer = crud.create_user(
            db,
            schemas.UserCreate(
                full_name="Anonymous Customer",
                phone_number="0712345678",
                password=password_text,
            ),
        )
    invoice.username = "anonymous_business"
    # create invoice (using customer_id)
    new_invoice = crud.create_invoice(db=db, invoice=invoice, customer_id=customer.id)

    return new_invoice


@router.put("/edit/{invoice_number}", response_model=schemas.InvoiceOut)
def edit_invoice(
    invoice_number: str,
    invoice: schemas.InvoiceUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(database.get_db),
):

    business_id = current_user.id
    existing_invoice = crud.get_business_invoice(
        db, business_id=business_id, invoice_number=invoice_number
    )

    if not existing_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    updated_invoice = crud.update_invoice(
        db, invoice=existing_invoice, invoice_data=invoice
    )
    return updated_invoice


@router.put("/delete/{invoice_number}", response_model=schemas.InvoiceDelete)
def delete_invoice(
    invoice_number: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(database.get_db),
):
    business_id = current_user.id
    existing_invoice = crud.get_business_invoice(
        db, business_id=business_id, invoice_number=invoice_number
    )

    if not existing_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    deleted_invoice = crud.delete_invoice(db, invoice=existing_invoice)
    return deleted_invoice


@router.get("/user/{username}", response_model=List[schemas.InvoiceOut])
def get_user_invoices(
    username: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(database.get_db),
):
    if username != current_user.username:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return crud.get_all_user_invoices(db, username=username)


@router.get("/business/{username}", response_model=List[schemas.InvoiceOut])
def get_business_invoices(
    username: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(database.get_db),
):
    if username != current_user.username:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return crud.get_invoices_by_business(db, business_id=current_user.id)


@router.get("/customer/{username}", response_model=List[schemas.InvoiceOut])
def get_customer_invoices(
    username: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(database.get_db),
):
    if username != current_user.username:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return crud.get_invoices_by_customer(db, customer_id=current_user.id)
