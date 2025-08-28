from fastapi import FastAPI
from . import models
from .database import engine
from .routers import users, invoices

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SME Invoicing API")

app.include_router(users.router)
app.include_router(invoices.router)

@app.get("/")
def root():
    return {"message": "Welcome to the SME Invoicing Tool API 🚀"}
