from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    phone_number: str
    role: str  # BUSINESS or CUSTOMER


class BusinessUserCreate(UserBase):
    business_name: str
    password: str


class CustomerUserCreate(UserBase):
    password: str


class UserOut(BaseModel):
    id: int
    role: str
    phone_number: str
    business_name: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True


class LineItemBase(BaseModel):
    product_name: str
    unit_price: float
    quantity: int
    transaction_value: float


class LineItemCreate(LineItemBase):
    pass


class LineItemOut(LineItemBase):
    id: int

    class Config:
        orm_mode = True


# ---------- Invoice ----------
class InvoiceBase(BaseModel):
    business_id: int
    customer_id: int
    total_amount: float


class InvoiceCreate(InvoiceBase):
    line_items: List[LineItemCreate]


class InvoiceOut(InvoiceBase):
    id: int
    created_at: datetime
    line_items: List[LineItemOut]

    class Config:
        orm_mode = True
