import os
from typing import Optional
import google.generativeai as genai
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import Lesson
from app.models import LessonTranscript

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_TRANSCRIBE_MODEL= os.getenv("GEMINI_TRANSCRIBE_MODEL")
genai.configure(api_key=GEMINI_API_KEY)

class ChatbotService:
    
    @staticmethod
    def get_ai_response(lesson_id: Optional[int], message: str, db: Session) -> str:
        """
        Xử lý logic giao tiếp với mô hình AI (Gemini) để sinh ra câu trả lời cho học viên.

        Hàm này sẽ lấy nội dung bài học (transcript) từ database để làm ngữ cảnh, 
        kết hợp với câu hỏi của học viên để tạo ra một Prompt hoàn chỉnh và gửi lên AI.

        Args:
            lesson_id (Optional[int]): ID của bài học hiện tại. Nếu = None thì không lấy transcript.
            message (str): Nội dung câu hỏi mà học viên nhập vào từ giao diện.
            db (Session): Phiên kết nối cơ sở dữ liệu SQLAlchemy.

        Returns:
            str: Trả về chuỗi văn bản (text) là câu trả lời do AI sinh ra.

        Raises:
            HTTPException: Ném ra lỗi 500 nếu mất kết nối mạng, sai API Key, hoặc Google API bị lỗi.
        """
        
        # promt gốc - ko transcript
        system_context = """
        Bạn là một chuyên gia lập trình Python. Hãy trả lời các câu hỏi của người dùng 
        một cách chính xác, ngắn gọn và có kèm ví dụ code minh họa nếu cần.
        """
        
        if lesson_id is not None:
            lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
            if not lesson:
                raise HTTPException(status_code=404, detail="Không tìm thấy bài học!")
            
            # Sửa lại logic query cho đúng với lesson_id
            lesson_record = db.query(LessonTranscript).filter(LessonTranscript.lesson_id == lesson_id).first()
            if not lesson_record:
                raise HTTPException(status_code=404, detail="Không tìm thấy Transcripts của bài học này!")
            
            lesson_transcript = lesson_record.transcript_text
            if not lesson_transcript:
                raise HTTPException(status_code=404, detail="Nội dung Transcripts đang trống!")
            
            # ghi đè lại system_context (có transcript)
            system_context = f"""
            Bạn là một trợ lý AI chuyên giảng dạy lập trình thân thiện.
            Học viên đang hỏi về bài học có nội dung như sau: "{lesson_transcript}"
            Hãy bám sát nội dung này để trả lời.
            """
            
        full_prompt = f"{system_context}\n\nCâu hỏi: {message}"
        
        try:
            model = genai.GenerativeModel(GEMINI_TRANSCRIBE_MODEL)
            response = model.generate_content(full_prompt)
            
            return response.text
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Lỗi kết nối với Trợ lý AI: {str(e)}"
            )