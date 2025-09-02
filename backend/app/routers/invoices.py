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
    db: Session = Depends(database.get_db)
):
    if current_user.username != invoice.username:
        return {"error": "Unauthorized"}
    
    # Check if customer exists by phone number
    customer = db.query(User).filter(
        User.phone_number == invoice.customer.phone_number
    ).first()
    password_text = None

    if not customer:
        if not invoice.customer.full_name:
            return {"error": "Customer name is required for new customer"}
        # create new customer with random password
        password_text = generate_random_password()

        customer = crud.create_user(db, schemas.UserCreate(
            full_name=invoice.customer.full_name,
            phone_number=invoice.customer.phone_number,
            password=password_text
        ))

    # create invoice (using customer_id)
    new_invoice = crud.create_invoice(
        db=db, 
        invoice=invoice, 
        customer_id=customer.id
    )

    # # Step 4: Format invoice message
    # message = format_invoice(new_invoice)

    # if password_text:
    #     message += f"\n\nYour account has been created.\nLogin with password: {password_text}"

    # # Step 5: Send SMS
    # send_invoice(
    #     phone_number=customer.phone_number,
    #     invoice_id=new_invoice.id,
    #     message=message
    # )

    return new_invoice

@router.put("/edit/{invoice_number}", response_model=schemas.InvoiceOut)
def edit_invoice(
    invoice_number: str,
    invoice: schemas.InvoiceUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(database.get_db)
):
    
    business_id = current_user.id
    existing_invoice = crud.get_business_invoice(db, business_id=business_id, invoice_number=invoice_number)
    
    if not existing_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    updated_invoice = crud.update_invoice(db, invoice=existing_invoice, invoice_data=invoice)
    return updated_invoice

@router.put("/delete/{invoice_number}", response_model=schemas.InvoiceDelete)
def delete_invoice(
    invoice_number: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(database.get_db)
):
    business_id = current_user.id
    existing_invoice = crud.get_business_invoice(db, business_id=business_id, invoice_number=invoice_number)

    if not existing_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    deleted_invoice = crud.delete_invoice(db, invoice=existing_invoice)
    return deleted_invoice

@router.get("/business/{username}", response_model=List[schemas.InvoiceOut])
def get_business_invoices(username: str, current_user: User = Depends(get_current_active_user), db: Session = Depends(database.get_db)):
    if username != current_user.username:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return crud.get_invoices_by_business(db, business_id=current_user.id)


@router.get("/customer/{username}", response_model=List[schemas.InvoiceOut])
def get_customer_invoices(username: str, current_user: User = Depends(get_current_active_user), db: Session = Depends(database.get_db)):
    if username != current_user.username:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return crud.get_invoices_by_customer(db, customer_id=current_user.id)
