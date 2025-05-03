from fastapi import Depends
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.schemas.meetingroom import MeetingRoomCreate, MeetingRoomResponse
from app.services.meetingroom_service import create_room, list_rooms
from app.db import get_db

router = APIRouter()

@router.post("/meetingrooms1", response_model=MeetingRoomResponse)
async def create(room: MeetingRoomCreate, session: AsyncSession = Depends(get_db)):
    print("TEST")
    return await create_room(session, room)

@router.get("/meetingrooms", response_model=List[MeetingRoomResponse])
async def get_all(session: AsyncSession = Depends(get_db)):
    return await list_rooms(session)

@router.get("/meetingrooms/{room_id}", response_model=MeetingRoomResponse)
async def get_room_by_id(room_id: int, session: AsyncSession = Depends(get_db)):
    room = await session.get(MeetingRoom, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Sala non trovata")
    return room

@router.put("/meetingrooms/{room_id}", response_model=MeetingRoomResponse)
async def update_room(room_id: int, data: MeetingRoomCreate, session: AsyncSession = Depends(get_db)):
    room = await session.get(MeetingRoom, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Sala non trovata")
    for key, value in data.dict().items():
        setattr(room, key, value)
    await session.commit()
    await session.refresh(room)
    return room

@router.delete("/meetingrooms/{room_id}")
async def delete_room(room_id: int, session: AsyncSession = Depends(get_db)):
    room = await session.get(MeetingRoom, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Sala non trovata")
    await session.delete(room)
    await session.commit()
    return {"detail": "Sala eliminata"}