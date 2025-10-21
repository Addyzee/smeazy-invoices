from fastapi import FastAPI
from app import models
from .database import engine
from .routers import users, invoices
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SME Invoicing API",root_path="/invoices-app")
origins = [
    "http://localhost:5173",  # Vite/React dev server
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # Next.js or CRA dev server
    "https://smeazy-invoices.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # allowed domains
    allow_credentials=True,
    allow_methods=["*"],            # allow all HTTP methods (GET, POST, PUT, DELETE...)
    allow_headers=["*"],            # allow all headers
)


app.include_router(users.router)
app.include_router(invoices.router)

@app.get("/")
def root():
    return {"message": "Welcome to the SME Invoicing Tool API 🚀"}
