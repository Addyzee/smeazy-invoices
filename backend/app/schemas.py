from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LineItemBase(BaseModel):
    product_name: str
    unit_price: float
    quantity: int
    discount: Optional[float] = None
    tax_rate: Optional[float] = None

class LineItemCreate(LineItemBase):
    pass

class LineItem(LineItemBase):
    id: int
    class Config:
        orm_mode = True


class InvoiceBase(BaseModel):
    invoice_number: str
    total_amount: float
    status: str = "DRAFT"
    issue_date: datetime
    due_date: Optional[datetime] = None
    notes: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    customer_id: int
    line_items: List[LineItemCreate]

class Invoice(InvoiceBase):
    id: int
    line_items: List[LineItem] = []
    class Config:
        orm_mode = True
