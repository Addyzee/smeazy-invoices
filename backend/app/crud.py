from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)


def get_user_by_phone(db: Session, phone_number: str):
    return db.query(models.User).filter(models.User.phone_number == phone_number).first()


def create_business_user(db: Session, user: schemas.BusinessUserCreate):
    db_user = models.User(
        role="BUSINESS",
        business_name=user.business_name,
        phone_number=user.phone_number,
        password=get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_customer_user(db: Session, user: schemas.CustomerUserCreate):
    db_user = models.User(
        role="CUSTOMER",
        phone_number=user.phone_number,
        password=get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_invoice(db: Session, invoice: schemas.InvoiceCreate):
    db_invoice = models.Invoice(
        business_id=invoice.business_id,
        customer_id=invoice.customer_id,
        total_amount=invoice.total_amount,
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)

    # add line items
    for item in invoice.line_items:
        db_item = models.LineItem(
            invoice_id=db_invoice.id,
            product_name=item.product_name,
            unit_price=item.unit_price,
            quantity=item.quantity,
            transaction_value=item.transaction_value,
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_invoice)
    return db_invoice


def get_invoices_by_business(db: Session, business_id: int):
    return db.query(models.Invoice).filter(models.Invoice.business_id == business_id).all()


def get_invoices_by_customer(db: Session, customer_id: int):
    return db.query(models.Invoice).filter(models.Invoice.customer_id == customer_id).all()

