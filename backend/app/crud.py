from sqlalchemy.orm import Session
from . import models, schemas
from .security import get_password_hash
from .db_utils import generate_unique_username, generate_invoice_number


def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_phone(db: Session, phone_number: str):
    return db.query(models.User).filter(models.User.phone_number == phone_number).first()  



def create_user(db: Session, user: schemas.UserCreate):
    username = generate_unique_username(db, user.full_name)
    db_user = models.User(
        username=username,
        full_name=user.full_name,
        phone_number=user.phone_number,
        password=get_password_hash(user.password),
    )
    db.add(db_user)
    db.flush()  
    db_user_stats = models.UserStats(
        user_id=db_user.id,
        total_invoices_sent=0,
        total_invoices_received=0,
        total_amount_paid_in=0.0,
        total_amount_paid_out=0.0,
    )
    db.add(db_user_stats)

    db.commit()
    db.refresh(db_user)
    db.refresh(db_user_stats)

    return db_user

def get_invoices_by_business(db: Session, business_id: int):
    return db.query(models.Invoice).filter(models.Invoice.business_id == business_id).all()


def get_invoices_by_customer(db: Session, customer_id: int):
    return db.query(models.Invoice).filter(models.Invoice.customer_id == customer_id).all()



def get_business_invoice(db: Session, business_id: int, invoice_number: str):
    return db.query(models.Invoice).filter(
        models.Invoice.business_id == business_id,
        models.Invoice.invoice_number == invoice_number
    ).first()
    



def create_invoice(db: Session, invoice: schemas.InvoiceCreate, customer_id: int):
    # Get business_id
    business = db.query(models.User).filter(models.User.username == invoice.username).first()
    business_id = business.id

    # Create invoice object
    db_invoice = models.Invoice(
        business_id=business_id,
        business_name=invoice.business_name,
        customer_id=customer_id,
        total_amount=invoice.total_amount,
        due_date=invoice.due_date,
        status=invoice.status,
        notes=invoice.notes,
        invoice_number=generate_invoice_number(db, business_id)
    )
    db.add(db_invoice)
    db.flush()  

    # Add line items
    total_amount = 0
    for item in invoice.line_items:
        transaction_value = item.unit_price * item.quantity
        total_amount += transaction_value
        db_item = models.LineItem(
            invoice_id=db_invoice.id,
            product_name=item.product_name,
            unit_price=item.unit_price,
            quantity=item.quantity,
            transaction_value=transaction_value,
        )
        db.add(db_item)

    # Correct total amount if needed
    if total_amount != invoice.total_amount:
        db_invoice.total_amount = total_amount

    # update customer and business stats
    update_customer_stats(db, customer_id, db_invoice)
    update_business_stats(db, business_id, db_invoice)

    db.commit()
    db.refresh(db_invoice)

    return db_invoice

def update_invoice(db: Session, invoice: models.Invoice, invoice_data: schemas.InvoiceUpdate):
    data = invoice_data.model_dump(exclude_unset=True)

    if invoice_data.line_items:
        invoice.line_items.clear()

        total_amount = 0
        for item in invoice_data.line_items:
            transaction_value = item.unit_price * item.quantity
            total_amount += transaction_value
            line_item = models.LineItem(
                product_name=item.product_name,
                unit_price=item.unit_price,
                quantity=item.quantity,
                transaction_value=transaction_value,
            )
            invoice.line_items.append(line_item)

        invoice.total_amount = total_amount

    for field, value in data.items():
        if field != "line_items":
            setattr(invoice, field, value)

    db.commit()
    db.refresh(invoice)
    return invoice

def delete_invoice(db: Session, invoice: models.Invoice):
    invoice_number = invoice.invoice_number
    invoice.line_items.clear()
    db.delete(invoice)
    db.commit()
    return {
        "invoice_number": invoice_number,
        "status": "deleted"
    }


def update_customer_stats(db: Session, customer_id: int, invoice: models.Invoice):
    customer_stats = db.query(models.UserStats).filter(models.UserStats.user_id == customer_id).first()
    if customer_stats:
        customer_stats.total_invoices_received += 1
        if invoice.status == "PAID":
            customer_stats.total_amount_paid_out += invoice.total_amount
    db.commit()

def update_business_stats(db: Session, business_id: int, invoice: models.Invoice):
    business_stats = db.query(models.UserStats).filter(models.UserStats.user_id == business_id).first()
    if business_stats:
        business_stats.total_invoices_sent += 1
        if invoice.status == "PAID":
            business_stats.total_amount_paid_in += invoice.total_amount

    db.commit()

