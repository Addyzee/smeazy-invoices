from sqlalchemy.orm import Session
from . import models, schemas
from .security import get_password_hash
from app.utils import slugify_name



def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_phone(db: Session, phone_number: str):
    return db.query(models.User).filter(models.User.phone_number == phone_number).first()



def generate_unique_username(db: Session, full_name: str) -> str:
    """Generate a unique username based on the user's full name."""
    base = slugify_name(full_name)
    username = base
    counter = 1

    while db.query(models.User).filter(models.User.username == username).first():
        username = f"{base}{counter}"
        counter += 1

    return username



def create_user(db: Session, user: schemas.UserCreate):
    username = generate_unique_username(db, user.full_name)
    db_user = models.User(
        username=username,
        full_name=user.full_name,
        phone_number=user.phone_number,
        password=get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_invoice(db: Session, invoice: schemas.InvoiceCreate, customer_id: int):
    business_id = db.query(models.User).filter(models.User.username == invoice.username).first().id
    # Create invoice object
    db_invoice = models.Invoice(
        business_id=business_id,
        business_name=invoice.business_name,
        customer_id=customer_id,
        total_amount=invoice.total_amount,
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)

    # Add line items
    for item in invoice.line_items:
        transaction_value = item.unit_price * item.quantity
        db_item = models.LineItem(
            invoice_id=db_invoice.id,
            product_name=item.product_name,
            unit_price=item.unit_price,
            quantity=item.quantity,
            transaction_value=transaction_value
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_invoice)

    return db_invoice


def get_invoices_by_business(db: Session, business_id: int):
    return db.query(models.Invoice).filter(models.Invoice.business_id == business_id).all()


def get_invoices_by_customer(db: Session, customer_id: int):
    return db.query(models.Invoice).filter(models.Invoice.customer_id == customer_id).all()

