import sys
import asyncio
from app.db import engine, Base
from app.models import meeting, meetingroom, user, bookinginformation, templatemail

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)



if __name__ == "__main__":
    if sys.platform == "darwin" and sys.version_info >= (3, 12):
        asyncio.set_event_loop_policy(asyncio.DefaultEventLoopPolicy())
    asyncio.run(init_db())
