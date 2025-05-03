
from pydantic import BaseModel
from typing import Optional

class MeetingRoomCreate(BaseModel):
    name: str
    location: Optional[str] = None
    capacity: Optional[int] = None

class MeetingRoomResponse(MeetingRoomCreate):
    id: int
