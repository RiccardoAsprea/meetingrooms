from typing import Optional

from pydantic import BaseModel

class UserResponse(BaseModel):
    username: str
    full_name: str
    email: Optional[str] = None


from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    full_name: str
    email: str