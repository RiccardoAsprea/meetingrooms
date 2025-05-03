
from sqlalchemy import Column, Integer, String, Text
from app.db import Base

class TemplateMail(Base):
    __tablename__ = "template_mail"

    id = Column(Integer, primary_key=True)
    body_mail = Column(Text)
    type_mail = Column(String(255), nullable=False)
