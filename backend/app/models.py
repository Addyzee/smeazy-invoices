from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String, nullable=True)
    phone_number = Column(String, unique=True, index=True)
    password = Column(String)  # store hashed!
    created_at = Column(DateTime, default=datetime.utcnow)

    invoices = relationship("Invoice", back_populates="user")


class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    phone_number = Column(String)
    email = Column(String)
    address = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    invoices = relationship("Invoice", back_populates="customer")


class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    invoice_number = Column(String, index=True)
    total_amount = Column(Numeric(10, 2))
    status = Column(String, default="DRAFT")
    issue_date = Column(DateTime, default=datetime.now)
    due_date = Column(DateTime, nullable=True)
    notes = Column(String)

    user = relationship("User", back_populates="invoices")
    customer = relationship("Customer", back_populates="invoices")
    line_items = relationship("LineItem", back_populates="invoice")


class LineItem(Base):
    __tablename__ = "line_items"
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    product_name = Column(String)
    unit_price = Column(Numeric(10, 2))
    quantity = Column(Integer)
    discount = Column(Numeric(10, 2), nullable=True)
    tax_rate = Column(Numeric(5, 2), nullable=True)

    invoice = relationship("Invoice", back_populates="line_items")
