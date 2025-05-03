
from fastapi import FastAPI
from app.controllers import compatible_controller
from app.controllers import meeting_controller, user_controller, meetingroom_controller

app = FastAPI()

app.include_router(meeting_controller.router)
app.include_router(user_controller.router)
app.include_router(meetingroom_controller.router)

app.include_router(compatible_controller.router)