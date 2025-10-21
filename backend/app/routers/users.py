from fastapi import APIRouter, Depends, HTTPException, status, Depends
from sqlalchemy.orm import Session
from .. import schemas, crud, database
from app.models import User
from app.security import create_access_token
from app.deps import get_current_active_user, authenticate_user
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas import TokenType
from app.security import ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def get_me(current_user: User = Depends(get_current_active_user)):
    return {
        "full_name": current_user.full_name,
        "username": current_user.username,
        "phone_number": current_user.phone_number,
        "created_at": current_user.created_at,
    }


@router.post("/register", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing = crud.get_user_by_phone(db, phone_number=user.phone_number)
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    return crud.create_user(db=db, user=user)


@router.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(database.get_db),
) -> TokenType:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return TokenType(
        access_token=access_token, username=user.username, token_type="bearer"
    )
