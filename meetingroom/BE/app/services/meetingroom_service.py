from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.meetingroom import MeetingRoom
from app.schemas.meetingroom import MeetingRoomCreate, MeetingRoomResponse


# Recupera l'elenco di tutte le sale riunioni
async def list_rooms(session: AsyncSession):
    result = await session.execute(select(MeetingRoom))
    rooms = result.scalars().all()
    return [MeetingRoomResponse(**r.__dict__) for r in rooms]


# Crea una nuova sala riunione nel database
async def create_room(session: AsyncSession, room: MeetingRoomCreate):
    try:
        print(">>> Creo la sala:", room.dict())

        result = await session.execute(
            select(MeetingRoom).where(MeetingRoom.room_name == room.name)
        )
        existing = result.scalar_one_or_none()

        if existing:
            raise HTTPException(status_code=400, detail="Il nome della sala esiste già")

        new_room = MeetingRoom(
            room_name=room.name,
            location=room.location,
            seating_capacity=room.capacity,
            active=True
        )

        print(">>> Aggiungo al DB:", new_room.__dict__)

        session.add(new_room)
        await session.commit()
        await session.refresh(new_room)

        print(">>> Sala creata con ID:", new_room.room_id)

        return MeetingRoomResponse(
            id=new_room.room_id,
            name=new_room.room_name,
            location=new_room.location,
            capacity=new_room.seating_capacity
        )

    except Exception as e:
        print(">>> ERRORE durante create_room:", e)
        raise HTTPException(status_code=500, detail="Errore interno")

from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import and_, or_
from app.models.meeting import Meeting
from app.models.meetingroom import MeetingRoom
from datetime import datetime

async def get_available_rooms(session, data):
    start_time = datetime.fromisoformat(data["start_time"])
    end_time = datetime.fromisoformat(data["end_time"])
    capacity = data.get("capacity", 0)

    subquery = (
        select(Meeting.room_id)
        .where(
            or_(
                and_(Meeting.start_time <= start_time, Meeting.end_time > start_time),
                and_(Meeting.start_time < end_time, Meeting.end_time >= end_time),
                and_(Meeting.start_time >= start_time, Meeting.end_time <= end_time)
            )
        )
    )

    result = await session.execute(
        select(MeetingRoom)
        .options(joinedload(MeetingRoom.meetings))
        .where(
            MeetingRoom.seating_capacity >= capacity,
            MeetingRoom.room_id.not_in(subquery)
        )
    )
    return result.scalars().all()