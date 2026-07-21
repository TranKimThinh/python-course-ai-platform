import enum
from sqlalchemy import Column, ForeignKey, BigInteger, Integer, String, Enum, Numeric, Boolean, DateTime, Text, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class CourseLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

class ContentStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    hidden = "hidden"
    archived = "archived"

class Course(Base):
    __tablename__ = "courses"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    thumbnail_url = Column(Text, nullable=True)
    level = Column(Enum(CourseLevel), default=CourseLevel.beginner, nullable=False)
    price = Column(Numeric(12, 2), default=0.00)
    status = Column(Enum(ContentStatus), default=ContentStatus.draft, nullable=False)
    created_by = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    # Relationships
    creator = relationship("User", back_populates="courses_created")
    sections = relationship("CourseSection", back_populates="course", cascade="all, delete-orphan")
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")
    chat_sessions = relationship("AIChatSession", back_populates="course")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    activities = relationship("LearningActivity", back_populates="course")

class CourseSection(Base):
    __tablename__ = "course_sections"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    course = relationship("Course", back_populates="sections")
    lessons = relationship("Lesson", back_populates="section", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    section_id = Column(BigInteger, ForeignKey("course_sections.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    duration_seconds = Column(Integer, default=0)
    sort_order = Column(Integer, default=0)
    is_free = Column(Boolean, default=False)
    status = Column(Enum(ContentStatus), default=ContentStatus.draft, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    course = relationship("Course", back_populates="lessons")
    section = relationship("CourseSection", back_populates="lessons")
    videos = relationship("LessonVideo", back_populates="lesson", cascade="all, delete-orphan")
    transcripts = relationship("LessonTranscript", back_populates="lesson", cascade="all, delete-orphan")
    summaries = relationship("LessonSummary", back_populates="lesson", cascade="all, delete-orphan")
    chunks = relationship("TranscriptChunk", back_populates="lesson", cascade="all, delete-orphan")
    chat_sessions = relationship("AIChatSession", back_populates="lesson")
    quizzes = relationship("Quiz", back_populates="lesson", cascade="all, delete-orphan")
    progress_records = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")
    activities = relationship("LearningActivity", back_populates="lesson")

class LessonVideo(Base):
    __tablename__ = "lesson_videos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    video_url = Column(Text, nullable=False)
    storage_provider = Column(String(50), default="Cloudflare")
    file_name = Column(String(255), nullable=True)
    file_size = Column(BigInteger, nullable=True)
    duration_seconds = Column(Integer, default=0)
    processing_status = Column(Enum("pending", "processing", "completed", "failed"), default="pending")
    uploaded_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    lesson = relationship("Lesson", back_populates="videos")


class LessonFile(Base):
    __tablename__ = "lesson_files"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    mime_type = Column(String(100), nullable=True)
    file_size = Column(BigInteger, nullable=True)
    uploaded_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
