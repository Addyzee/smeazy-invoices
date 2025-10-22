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
    password: str 


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
    description: Optional[str]
    type: Optional[str]  # e.g., "service" or "product"
    
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
    phone_number: Optional[str]
    full_name: str
    
class InvoiceUpdate(InvoiceBase):
    line_items: List[LineItemCreate]
    notes: Optional[str] = None

class InvoiceCreate(InvoiceUpdate):
    business_name: str
    username: str
    customer: InvoiceCustomer | None = None
    customer_name: str
    customer_phone: Optional[str]
    
    
class InvoiceOut(BaseModel):
    business_name: str
    customer: Optional[UserOut]
    customer_name: str
    customer_phone: Optional[str]
    invoice_number: str
    created_at: datetime
    line_items: List[LineItemOut]
    notes: Optional[str] 
    total_amount: float
    due_date: datetime
    status: str

    class Config:
        from_attributes = True

class InvoiceDelete(BaseModel):
    invoice_number: str
    status: str