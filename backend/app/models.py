from sqlalchemy import Boolean, Integer, String, ForeignKey, DateTime, Float, Enum
from sqlalchemy.orm import relationship, mapped_column, Mapped
from typing import Optional
from datetime import datetime
from .database import Base
import enum



class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    phone_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    password: Mapped[str] = mapped_column(String)  # hashed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    disabled: Mapped[bool] = mapped_column(Boolean, default=False)

    # relationships
    invoices_sent = relationship("Invoice", back_populates="business", foreign_keys="Invoice.business_id")
    invoices_received = relationship("Invoice", back_populates="customer", foreign_keys="Invoice.customer_id")
    user_stats = relationship("UserStats", back_populates="user")


class UserStats(Base):
    __tablename__ = "user_stats"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    total_invoices_sent: Mapped[int] = mapped_column(Integer, default=0)
    total_invoices_received: Mapped[int] = mapped_column(Integer, default=0)
    total_amount_paid_in: Mapped[float] = mapped_column(Float, default=0.0)
    total_amount_paid_out: Mapped[float] = mapped_column(Float, default=0.0)
    

    # relationships
    user = relationship("User", back_populates="user_stats")
    
class InvoiceStatus(enum.Enum):
    sent = "sent"
    paid = "paid"
    overdue = "overdue"
    cancelled = "cancelled"
    draft = "draft"


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    business_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    customer_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name: Mapped[str] = mapped_column(String, nullable=False, default="Anonymous Customer")
    customer_phone: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    invoice_number: Mapped[str] = mapped_column(String, nullable=False, unique=True, index=True)
    business_name: Mapped[str] = mapped_column(String, nullable=False)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    due_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[InvoiceStatus] = mapped_column(Enum(InvoiceStatus), default=InvoiceStatus.sent, nullable=False)
    notes: Mapped[str] = mapped_column(String, default="")

    # relationships
    business = relationship("User", foreign_keys=[business_id], back_populates="invoices_sent")
    customer = relationship("User", foreign_keys=[customer_id], back_populates="invoices_received")
    line_items = relationship("LineItem", back_populates="invoice", cascade="all, delete-orphan")

class LineItemTypeEnum(enum.Enum):
    product = "product"
    service = "service"

class LineItem(Base):
    __tablename__ = "line_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    invoice_id: Mapped[int] = mapped_column(Integer, ForeignKey("invoices.id"), nullable=False)
    product_name: Mapped[str] = mapped_column(String, nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    type: Mapped[LineItemTypeEnum] = mapped_column(Enum(LineItemTypeEnum), default=LineItemTypeEnum.product, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, default=None)
    transaction_value: Mapped[float] = mapped_column(Float, nullable=False)

    # relationships
    invoice = relationship("Invoice", back_populates="line_items")