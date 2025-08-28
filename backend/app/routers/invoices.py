from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, crud, database

router = APIRouter(prefix="/invoices", tags=["invoices"])


@router.post("/", response_model=schemas.InvoiceOut)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(database.get_db)):
    return crud.create_invoice(db=db, invoice=invoice)


@router.get("/business/{business_id}", response_model=List[schemas.InvoiceOut])
def get_business_invoices(business_id: int, db: Session = Depends(database.get_db)):
    return crud.get_invoices_by_business(db, business_id)


@router.get("/customer/{customer_id}", response_model=List[schemas.InvoiceOut])
def get_customer_invoices(customer_id: int, db: Session = Depends(database.get_db)):
    return crud.get_invoices_by_customer(db, customer_id)
