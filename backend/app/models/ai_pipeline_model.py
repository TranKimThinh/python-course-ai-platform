<<<<<<< HEAD
import enum
from sqlalchemy import Column, ForeignKey, BigInteger, String, Enum, Integer, Float, DateTime, JSON, Text, text
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy.dialects.mysql import LONGTEXT

class ChatSender(str, enum.Enum):
    user = "user"
    assistant = "assistant"

class LessonTranscript(Base):
    __tablename__ = "lesson_transcripts"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    transcript_text = Column(LONGTEXT, nullable=False)
    language = Column(String(20), default="vi")
    generated_by = Column(String(100), nullable=True)
    status = Column(Enum("pending", "processing", "completed", "failed"), default="pending")
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    lesson = relationship("Lesson", back_populates="transcripts")
    chunks = relationship("TranscriptChunk", back_populates="transcript", cascade="all, delete-orphan")

class LessonSummary(Base):
    __tablename__ = "lesson_summaries"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    summary_text = Column(Text, nullable=False)
    key_points = Column(JSON, nullable=True)
    generated_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    lesson = relationship("Lesson", back_populates="summaries")

class TranscriptChunk(Base):
    __tablename__ = "transcript_chunks"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    transcript_id = Column(BigInteger, ForeignKey("lesson_transcripts.id", ondelete="CASCADE"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    chunk_text = Column(Text, nullable=False)
    vector_id = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    lesson = relationship("Lesson", back_populates="chunks")
    transcript = relationship("LessonTranscript", back_populates="chunks")
    retrieval_logs = relationship("AIRetrievalLog", back_populates="chunk", cascade="all, delete-orphan")

class AIChatSession(Base):
    __tablename__ = "ai_chat_sessions"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False, default="Đoạn hội thoại mới")
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="chat_sessions")
    course = relationship("Course", back_populates="chat_sessions")
    lesson = relationship("Lesson", back_populates="chat_sessions")
    messages = relationship("AIChatMessage", back_populates="session", cascade="all, delete-orphan")

class AIChatMessage(Base):
    __tablename__ = "ai_chat_messages"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    session_id = Column(BigInteger, ForeignKey("ai_chat_sessions.id", ondelete="CASCADE"), nullable=False)
    sender = Column(Enum(ChatSender), nullable=False)
    message_text = Column(Text, nullable=False)
    model_name = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    session = relationship("AIChatSession", back_populates="messages")
    retrieval_logs = relationship("AIRetrievalLog", back_populates="message", cascade="all, delete-orphan")

class AIRetrievalLog(Base):
    __tablename__ = "ai_retrieval_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    message_id = Column(BigInteger, ForeignKey("ai_chat_messages.id", ondelete="CASCADE"), nullable=False)
    chunk_id = Column(BigInteger, ForeignKey("transcript_chunks.id", ondelete="CASCADE"), nullable=False)
    similarity_score = Column(Float, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    message = relationship("AIChatMessage", back_populates="retrieval_logs")
    chunk = relationship("TranscriptChunk", back_populates="retrieval_logs")
=======
import enum
from sqlalchemy import Column, ForeignKey, BigInteger, String, Enum, Integer, Float, DateTime, JSON, Text, text
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy.dialects.mysql import LONGTEXT

class ChatSender(str, enum.Enum):
    user = "user"
    assistant = "assistant"

class LessonTranscript(Base):
    __tablename__ = "lesson_transcripts"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    transcript_text = Column(LONGTEXT, nullable=False)
    language = Column(String(20), default="vi")
    generated_by = Column(String(100), nullable=True)
    status = Column(Enum("pending", "processing", "completed", "failed"), default="pending")
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    lesson = relationship("Lesson", back_populates="transcripts")
    chunks = relationship("TranscriptChunk", back_populates="transcript", cascade="all, delete-orphan")

class LessonSummary(Base):
    __tablename__ = "lesson_summaries"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    summary_text = Column(Text, nullable=False)
    key_points = Column(JSON, nullable=True)
    generated_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    lesson = relationship("Lesson", back_populates="summaries")

class TranscriptChunk(Base):
    __tablename__ = "transcript_chunks"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    transcript_id = Column(BigInteger, ForeignKey("lesson_transcripts.id", ondelete="CASCADE"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    chunk_text = Column(Text, nullable=False)
    vector_id = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    lesson = relationship("Lesson", back_populates="chunks")
    transcript = relationship("LessonTranscript", back_populates="chunks")
    retrieval_logs = relationship("AIRetrievalLog", back_populates="chunk", cascade="all, delete-orphan")

class AIChatSession(Base):
    __tablename__ = "ai_chat_sessions"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False, default="Đoạn hội thoại mới")
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="chat_sessions")
    course = relationship("Course", back_populates="chat_sessions")
    lesson = relationship("Lesson", back_populates="chat_sessions")
    messages = relationship("AIChatMessage", back_populates="session", cascade="all, delete-orphan")

class AIChatMessage(Base):
    __tablename__ = "ai_chat_messages"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    session_id = Column(BigInteger, ForeignKey("ai_chat_sessions.id", ondelete="CASCADE"), nullable=False)
    sender = Column(Enum(ChatSender), nullable=False)
    message_text = Column(Text, nullable=False)
    model_name = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    session = relationship("AIChatSession", back_populates="messages")
    retrieval_logs = relationship("AIRetrievalLog", back_populates="message", cascade="all, delete-orphan")

class AIRetrievalLog(Base):
    __tablename__ = "ai_retrieval_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    message_id = Column(BigInteger, ForeignKey("ai_chat_messages.id", ondelete="CASCADE"), nullable=False)
    chunk_id = Column(BigInteger, ForeignKey("transcript_chunks.id", ondelete="CASCADE"), nullable=False)
    similarity_score = Column(Float, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    message = relationship("AIChatMessage", back_populates="retrieval_logs")
    chunk = relationship("TranscriptChunk", back_populates="retrieval_logs")
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
