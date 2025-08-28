from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, crud, database
from app.models import User
from app.security import verify_password, create_access_token
from app.database import get_db
from app.deps import get_current_user


router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "phone": current_user.phone_number, "role": current_user.role}


@router.post("/business", response_model=schemas.UserOut)
def register_business(user: schemas.BusinessUserCreate, db: Session = Depends(database.get_db)):
    existing = crud.get_user_by_phone(db, phone_number=user.phone_number)
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    return crud.create_business_user(db=db, user=user)


@router.post("/customer", response_model=schemas.UserOut)
def register_customer(user: schemas.CustomerUserCreate, db: Session = Depends(database.get_db)):
    existing = crud.get_user_by_phone(db, phone_number=user.phone_number)
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    return crud.create_customer_user(db=db, user=user)

@router.post("/login")
def login(phone_number: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == phone_number).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}
