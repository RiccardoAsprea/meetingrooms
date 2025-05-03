from fastapi import Depends
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db

from app.schemas.meeting import MeetingCreate, MeetingResponse
from app.services.meeting_service import create_meeting, get_meetings_by_date

router = APIRouter()

@router.post("/meetings", response_model=MeetingResponse)
async def create(meeting: MeetingCreate, session: AsyncSession = Depends(get_db)):
    try:
        return await create_meeting(meeting, session)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/meetings/{meeting_date}", response_model=List[MeetingResponse])
async def get_by_date(meeting_date: date, session: AsyncSession = Depends(get_db)):
    try:
        return await get_meetings_by_date(session, meeting_date)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Meetings not found")

from fastapi import HTTPException
from app.schemas.meeting import MeetingUpdate
from app.models.meeting import Meeting
from sqlalchemy import select, update, delete

@router.get("/meetings", response_model=List[MeetingResponse])
async def get_all_meetings(session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(Meeting))
    return result.scalars().all()

@router.get("/meetings/id/{meeting_id}", response_model=MeetingResponse)
async def get_meeting_by_id(meeting_id: int, session: AsyncSession = Depends(get_db)):
    meeting = await session.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting non trovato")
    return meeting

@router.put("/meetings/{meeting_id}", response_model=MeetingResponse)
async def update_meeting(meeting_id: int, data: MeetingUpdate, session: AsyncSession = Depends(get_db)):
    db_meeting = await session.get(Meeting, meeting_id)
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting non trovato")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(db_meeting, key, value)
    await session.commit()
    await session.refresh(db_meeting)
    return db_meeting

@router.delete("/meetings/{meeting_id}")
async def delete_meeting(meeting_id: int, session: AsyncSession = Depends(get_db)):
    meeting = await session.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting non trovato")
    await session.delete(meeting)
    await session.commit()
    return {"detail": "Meeting eliminato"}