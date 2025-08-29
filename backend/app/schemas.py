from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    username: str | None = None

class LoginRequest(BaseModel):
    phone_number: str
    password: str  # BUSINESS or CUSTOMER


class UserBase(BaseModel):
    phone_number: str


class UserCreate(UserBase):
    full_name: str
    password: str


class UserOut(BaseModel):
    id: int
    phone_number: str
    full_name: Optional[str] = None
    username: str
    created_at: datetime

    class Config:
        orm_mode = True


# ---------- Line Item ----------
class LineItemCreate(BaseModel):
    product_name: str
    unit_price: float
    quantity: int

# ---------- Invoice ----------
class InvoiceBase(BaseModel):
    business_name: str
    total_amount: float

class InvoiceCustomer(BaseModel):
    phone_number: str
    username: Optional[str] = None
    full_name: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    username: str
    customer: InvoiceCustomer
    line_items: List[LineItemCreate]

class InvoiceOut(InvoiceBase):
    customer: InvoiceCustomer
    line_items: List[LineItemCreate]

    class Config:
        orm_mode = True