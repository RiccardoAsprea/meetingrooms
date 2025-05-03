from fastapi import Depends
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas.meetingroom import MeetingRoomResponse
from app.schemas.meeting import MeetingResponse
from app.services.meetingroom_service import list_rooms, get_available_rooms
from app.services.meeting_service import get_meetings_by_room, get_meetings_by_user
from typing import List
from app.schemas.auth import LoginRequest, AuthResponse

router = APIRouter()

@router.post("/api/auth/login", response_model=AuthResponse)
async def login(login_data: LoginRequest):
    # Simulazione login
    if login_data.username and login_data.password:
        return {"access_token": "fake-token", "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Credenziali non valide")

@router.get("/meetingrooms/allRooms", response_model=List[MeetingRoomResponse])
async def get_all_rooms(session: AsyncSession = Depends(get_db)):
    return await list_rooms(session)

@router.post("/meetingrooms/avaibleroom", response_model=List[MeetingRoomResponse])
async def available_rooms(data: dict, session: AsyncSession = Depends(get_db)):
    return await get_available_rooms(session, data)

@router.get("/meeting/room/{room_name}", response_model=List[MeetingResponse])
async def meetings_by_room(room_name: str, session: AsyncSession = Depends(get_db)):
    return await get_meetings_by_room(session, room_name)

@router.get("/meeting/organizer/{username}", response_model=List[MeetingResponse])
async def meetings_by_user(username: str, session: AsyncSession = Depends(get_db)):
    return await get_meetings_by_user(session, username)