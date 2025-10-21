from .utils import slugify_name
from sqlalchemy.orm import Session
from . import models

def generate_unique_username(db: Session, full_name: str) -> str:
    """Generate a unique username based on the user's full name."""
    base = slugify_name(full_name)
    username = base
    counter = 1

    while db.query(models.User).filter(models.User.username == username).first():
        username = f"{base}{counter}"
        counter += 1

    return username

def generate_invoice_number(db: Session, business_id: int) -> str:
    count = db.query(models.UserStats).filter(models.UserStats.user_id == business_id).first().total_invoices_sent
    return f"INV-{business_id}-{count + 1:05d}"