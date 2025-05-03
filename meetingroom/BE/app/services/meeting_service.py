from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from datetime import datetime, time, date
from app.models.meeting import Meeting
from app.models.meetingroom import MeetingRoom
from app.models.bookinginformation import BookingInformation
from app.schemas.meeting import MeetingCreate, MeetingResponse


# Crea una nuova riunione
async def create_meeting(meeting: MeetingCreate):
    async with SessionLocal() as session:
        try:
            await validate_conflicts(session, meeting)

            new_meeting = Meeting(
                title=meeting.title,
                start_time=meeting.start_time.time(),
                end_time=meeting.end_time.time(),
                date=meeting.start_time.date(),
                organized_by="placeholder",
                meeting_room_id=meeting.room_id,
                type=meeting.type,
                list_of_member="[]",
            )
            session.add(new_meeting)
            await session.commit()
            await session.refresh(new_meeting)

            return MeetingResponse(
                id=new_meeting.unique_id,
                title=new_meeting.title,
                start_time=meeting.start_time,
                end_time=meeting.end_time,
                room_id=new_meeting.meeting_room_id,
                type=new_meeting.type,
            )
        except SQLAlchemyError:
            raise HTTPException(status_code=500, detail="Errore database")
        except ValueError as ve:
            raise HTTPException(status_code=400, detail=str(ve))

# Verifica conflitti di orario con altre riunioni
async def validate_conflicts(session: AsyncSession, meeting: MeetingCreate):
    q = await session.execute(select(Meeting).where(
        Meeting.date == meeting.start_time.date(),
        Meeting.meeting_room_id == meeting.room_id
    ))
    existing = q.scalars().all()
    new_start = meeting.start_time.time()
    new_end = meeting.end_time.time()

    for m in existing:
        if (m.start_time < new_end and new_start < m.end_time):
            raise ValueError("Orario in conflitto con un'altra riunione")

# Recupera tutte le riunioni in base alla data
async def get_meetings_by_date(session: AsyncSession, meeting_date: date):
    result = await session.execute(select(Meeting).where(Meeting.date == meeting_date))
    meetings = result.scalars().all()
    return [
        MeetingResponse(
            id=m.unique_id,
            title=m.title,
            start_time=datetime.combine(m.date, m.start_time),
            end_time=datetime.combine(m.date, m.end_time),
            room_id=m.meeting_room_id,
            type=m.type
        ) for m in meetings
    ]

from sqlalchemy import select
from app.models.meeting import Meeting

async def get_meetings_by_room(session, room_name: str):
    result = await session.execute(
        select(Meeting).where(Meeting.room_name == room_name)
    )
    return result.scalars().all()

async def get_meetings_by_user(session, username: str):
    result = await session.execute(
        select(Meeting).where(Meeting.organizer == username)
    )
    return result.scalars().all()