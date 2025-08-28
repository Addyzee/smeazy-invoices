from fastapi import FastAPI
from . import models
from .database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SME Invoicing API")

@app.get("/")
def root():
    return {"message": "Welcome to the SME Invoicing Tool API 🚀"}
