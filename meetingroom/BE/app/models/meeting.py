
from sqlalchemy import Column, Integer, String, Time, Date, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class Meeting(Base):
    __tablename__ = "meeting"

    unique_id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date)
    end_time = Column(Time)
    list_of_member = Column(Text)  # Assunto: JSON in stringa
    organized_by = Column(String(50))
    start_time = Column(Time)
    title = Column(String(50))
    type = Column(Enum("BUSINESS", "CLASSROOMTRAINING", "CONFERENCECALL", "ONLINETRAINING"))
    info_meeting_room_name = Column(String(50))
    version = Column(Integer)
    description = Column(String(255))
    meeting_room_id = Column(Integer, ForeignKey("meetingroom.room_id"))
