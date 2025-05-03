from app.db import get_db
from fastapi import Depends
from fastapi import APIRouter, HTTPException
from app.schemas.user import UserResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.user_service import get_user_by_username

router = APIRouter()

@router.get("/users/{username}", response_model=UserResponse)
def get_user(username: str):
    try:
        return get_user_by_username(username)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

from app.schemas.user import UserCreate
from app.models.user import User

@router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, session: AsyncSession = Depends(get_db)):
    new_user = User(**user.dict())
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return new_user

@router.put("/users/{username}", response_model=UserResponse)
async def update_user(username: str, user_data: UserCreate, session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    for key, value in user_data.dict().items():
        setattr(user, key, value)
    await session.commit()
    await session.refresh(user)
    return user

@router.delete("/users/{username}")
async def delete_user(username: str, session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    await session.delete(user)
    await session.commit()
    return {"detail": "Utente eliminato"}