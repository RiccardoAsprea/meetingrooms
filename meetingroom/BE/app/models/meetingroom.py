
from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from app.db import Base

class MeetingRoom(Base):
    __tablename__ = "meetingroom"

    room_id = Column(Integer, primary_key=True, autoincrement=True)
    amenities = Column(Text)
    count = Column(Integer)
    credit_per_hour = Column(Float)
    rating = Column(Float)
    rating_count = Column(Integer)
    rating_sum = Column(Integer)
    room_name = Column(String(50), unique=True, nullable=False)
    seating_capacity = Column(Integer)
    active = Column(Boolean, default=True)
