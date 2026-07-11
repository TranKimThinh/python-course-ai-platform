import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.chatbot import ChatRequest
import google.generativeai as genai
from app.services.chatbot_service import ChatbotService 

from app.core.database import get_db
from app.models.users_model import User
from app.services.user_service import UserService
from app.utils.response import success_response

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

@router.post("/ask")
async def ask_ai_assistant(
    request: ChatRequest,
    current_user: User = Depends(UserService.get_current_user),
    db: Session = Depends(get_db)
):
    ai_reply = ChatbotService.get_ai_response(
        lesson_id=request.lesson_id,
        message=request.message,
        db=db
    )

    return success_response(
        data={"reply": ai_reply},
        message="AI đã trả lời thành công"
    )