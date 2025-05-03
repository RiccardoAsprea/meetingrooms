
from sqlalchemy import Column, Integer, String, DateTime, Float, BigInteger, Enum
from app.db import Base

class User(Base):
    __tablename__ = "user"

    userid = Column(Integer, primary_key=True, autoincrement=True)
    credit = Column(Float)
    email = Column(String(50))
    lastloggedin = Column(DateTime)
    name = Column(String(50))
    phone = Column(BigInteger)
    role = Column(Enum("ADMIN", "MANAGER", "MEMBER"))
