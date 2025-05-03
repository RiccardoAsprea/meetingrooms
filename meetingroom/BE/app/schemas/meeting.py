from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class MeetingCreate(BaseModel):
    title: str
    room_id: int
    start_time: datetime
    end_time: datetime
    type: Optional[str] = "INTERNAL"

class MeetingResponse(MeetingCreate):
    id: int


from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MeetingUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    organizer: Optional[str]
    room_id: Optional[int]
    start_time: Optional[datetime]
    end_time: Optional[datetime]