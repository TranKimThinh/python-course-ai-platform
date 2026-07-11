# backend/app/main.py
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1.auth import router as auth_router
from app.api.v1.courses import router as courses_router
from app.api.v1.lessons import router as lessons_router
from app.api.v1.admin_lessons import router as admin_lessons_router
from app.api.v1.users import router as users_router
from app.api.v1.progress import router as progress_router
from app.api.v1.activities import router as activities_router
from app.api.v1.admin_courses import router as admin_courses_router
from app.api.v1.admin_students import router as admin_students_router
from app.api.v1.admin_videos import router as admin_videos_router
from app.api.v1.admin_uploads import router as admin_uploads_router
from app.api.v1.chatbot import router as chatbot_router

app = FastAPI(title="Python Course AI Platform")

origins = [
    "http://localhost:5173",      # Port FE mặc định của Vite
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.ngrok-free\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])

app.include_router(courses_router, prefix="/api/v1/courses", tags=["Courses"])
app.include_router(lessons_router, prefix="/api/v1/lessons", tags=["Lessons"])

app.include_router(admin_lessons_router, prefix="/api/v1/admin/lessons", tags=["Admin - Lessons"])
app.include_router(admin_students_router, prefix="/api/v1/admin/students", tags=["Admin - Students"])
app.include_router(admin_videos_router, prefix="/api/v1/admin/videos", tags=["Admin - Videos"])
app.include_router(admin_uploads_router, prefix="/api/v1/admin/upload", tags=["Admin - Upload"])
app.include_router(admin_courses_router, prefix="/api/v1/admin/courses", tags=["Admin - Courses"])

app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
app.include_router(progress_router, prefix="/api/v1/my", tags=["Progress"])
app.include_router(activities_router, prefix="/api/v1/profile", tags=["Activities"])

app.include_router(chatbot_router, prefix="/api/v1/chatbot/", tags=["AI - Chatbot"])

uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "storage", "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=3000, reload=True)
