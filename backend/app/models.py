from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime, Float, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, index=True)
    password = Column(String)  # hashed
    created_at = Column(DateTime, default=datetime.now)
    disabled = Column(Boolean, default=False)

    # relationships
    invoices_sent = relationship("Invoice", back_populates="business", foreign_keys="Invoice.business_id")
    invoices_received = relationship("Invoice", back_populates="customer", foreign_keys="Invoice.customer_id")
    user_stats = relationship("UserStats", back_populates="user")


class UserStats(Base):
    __tablename__ = "user_stats"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_invoices_sent = Column(Integer, default=0)
    total_invoices_received = Column(Integer, default=0)
    total_amount_paid_in = Column(Float, default=0.0)
    total_amount_paid_out = Column(Float, default=0.0)
    

    # relationships
    user = relationship("User", back_populates="user_stats")
    
class InvoiceStatus(enum.Enum):
    sent = "sent"
    paid = "paid"
    overdue = "overdue"
    cancelled = "cancelled"


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    invoice_number = Column(String, nullable=False, unique=True, index=True)
    business_name = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    due_date = Column(DateTime, nullable=False)
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.sent, nullable=False)
    notes = Column(String, default="")

    # relationships
    business = relationship("User", foreign_keys=[business_id], back_populates="invoices_sent")
    customer = relationship("User", foreign_keys=[customer_id], back_populates="invoices_received")
    line_items = relationship("LineItem", back_populates="invoice", cascade="all, delete-orphan")



class LineItem(Base):
    __tablename__ = "line_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    product_name = Column(String, nullable=False)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    transaction_value = Column(Float, nullable=False)

    # relationships
    invoice = relationship("Invoice", back_populates="line_items")