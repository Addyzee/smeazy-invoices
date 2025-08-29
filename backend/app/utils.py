# import package
import africastalking
from datetime import datetime
import random
import string
import re


# Initialize SDK
username = "smeazy_invoices"    # use 'sandbox' for development in the test environment
api_key = "atsk_28e13f1f258c83c1adad736397c902f3679dd368a094dc97c2b1e83d7addad2280edd39d"      # use your sandbox app API key for development in the test environment
africastalking.initialize(username, api_key)



from datetime import datetime
from sqlalchemy.orm import InstanceState

def format_invoice(invoice) -> str:
    created_at = (
        invoice.created_at.strftime("%d %b %Y, %I:%M %p")
        if isinstance(invoice.created_at, datetime)
        else "N/A"
    )

    lines = []
    lines.append("🧾 INVOICE")
    lines.append(f"Invoice ID: {invoice.id}")
    lines.append(f"Date: {created_at}")
    lines.append("-" * 40)

    # iterate ORM relationship directly
    for item in invoice.line_items:
        lines.append(
            f"{item.product_name} x {item.quantity} @ {item.unit_price}/- = {item.transaction_value}/-"
        )

    lines.append("-" * 40)
    lines.append(f"TOTAL: {invoice.total_amount}/-")
    lines.append("")
    lines.append("Thank you for your business!")

    return "\n".join(lines)

def send_invoice(phone_number: str, invoice_id: int, message: str):
    phone_number = f"+254{phone_number[1:]}"
    response = africastalking.SMS.send(message, [phone_number])
    return response

def slugify_name(full_name: str) -> str:
    """Convert full name to a lowercase, alphanumeric slug (username base)."""
    base = re.sub(r'[^a-z0-9]+', '', full_name.lower())
    return base


def generate_random_password(length: int = 8) -> str:
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))



