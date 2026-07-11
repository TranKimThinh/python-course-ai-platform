from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    lesson_id: Optional[int] = None
    message: str