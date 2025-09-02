from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TokenType(BaseModel):
    access_token: str
    username: str
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
    phone_number: str
    full_name: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Line Item ----------
class LineItemCreate(BaseModel):
    product_name: str
    unit_price: float
    quantity: int
    
class LineItemOut(LineItemCreate):
    transaction_value: float
    
    class Config:
        from_attributes = True

# ---------- Invoice ----------
class InvoiceBase(BaseModel):
    total_amount: float
    due_date: datetime
    status: str

class InvoiceCustomer(BaseModel):
    phone_number: str
    username: Optional[str] = None
    full_name: Optional[str] = None
    
class InvoiceUpdate(InvoiceBase):
    line_items: List[LineItemCreate]
    notes: Optional[str] = None

class InvoiceCreate(InvoiceUpdate):
    business_name: str
    username: str
    customer: InvoiceCustomer
    
    
class InvoiceOut(InvoiceUpdate):
    business_name: str
    customer: UserOut
    invoice_number: str
    created_at: datetime
    line_items: List[LineItemOut]

    class Config:
        from_attributes = True

class InvoiceDelete(BaseModel):
    invoice_number: str
    status: str