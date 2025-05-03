
from sqlalchemy import Column, Integer, String, Time, Date, ForeignKey
from app.db import Base

class BookingInformation(Base):
    __tablename__ = "bookinginformation"

    unique_id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date)
    end_time = Column(Time)
    organized_by = Column(String(255))
    start_time = Column(Time)
    room_name = Column(String(50), ForeignKey("meetingroom.room_name"))
    room_id = Column(Integer, ForeignKey("meetingroom.room_id"))
