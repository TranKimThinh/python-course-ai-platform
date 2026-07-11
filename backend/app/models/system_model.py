<<<<<<< HEAD
import enum
from sqlalchemy import (
    Column, ForeignKey, BigInteger, Integer, String, Enum, Boolean, DateTime, Text, UniqueConstraint, text
)
from sqlalchemy.orm import relationship
from app.core.database import Base

# --- Enums ---
class EnrollmentStatus(str, enum.Enum):
    active = "active"
    completed = "completed"
    cancelled = "cancelled"

class ContactStatus(str, enum.Enum):
    new = "new"
    processing = "processing"
    resolved = "resolved"

# --- Models ---

# --- Enums cho LearningActivity ---
class ActivityType(str, enum.Enum):
    video = "video"
    quiz = "quiz"
    ai = "ai"
    account = "account"
    certificate = "certificate"
    course = "course"

# --- Model LessonProgress ---
class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "lesson_id", name="unique_user_lesson"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False) # Bắt buộc phải có theo schema
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    
    last_position_seconds = Column(Integer, default=0)
    watched_seconds = Column(Integer, default=0)
    duration_seconds = Column(Integer, default=0)
    progress_percent = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    
    last_watched_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    # Relationships
    user = relationship("User", back_populates="progress_records")
    course = relationship("Course") # Trỏ tới model Course
    lesson = relationship("Lesson", back_populates="progress_records")

# --- Model LearningActivity ---
class LearningActivity(Base):
    __tablename__ = "learning_activities"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    activity_type = Column(Enum(ActivityType), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    related_course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    related_lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    related_quiz_id = Column(BigInteger, ForeignKey("quizzes.id", ondelete="SET NULL"), nullable=True)
    
    action_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    user = relationship("User", back_populates="activities")
    course = relationship("Course")
    lesson = relationship("Lesson")
    quiz = relationship("Quiz")

class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint("user_id", "course_id", name="uq_user_course"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    
    # Đã cập nhật trường này để khớp với schema
    current_lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    
    status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.active, nullable=False)
    progress_percent = Column(Integer, default=0)
    completed_lessons_count = Column(Integer, default=0)
    last_accessed_at = Column(DateTime, nullable=True)
    enrolled_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    current_lesson = relationship("Lesson")

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    subject = Column(String(100), nullable=True)
    message = Column(Text, nullable=False)
    status = Column(Enum(ContactStatus), default=ContactStatus.new, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    type = Column(String(50), default="general")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="notifications")

class AdminAuditLog(Base):
    __tablename__ = "admin_audit_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    admin_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(100), nullable=False)
    target_table = Column(String(50), nullable=True)
    target_id = Column(BigInteger, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

=======
import enum
from sqlalchemy import (
    Column, ForeignKey, BigInteger, Integer, String, Enum, Boolean, DateTime, Text, UniqueConstraint, text
)
from sqlalchemy.orm import relationship
from app.core.database import Base

# --- Enums ---
class EnrollmentStatus(str, enum.Enum):
    active = "active"
    completed = "completed"
    cancelled = "cancelled"

class ContactStatus(str, enum.Enum):
    new = "new"
    processing = "processing"
    resolved = "resolved"

# --- Models ---

# --- Enums cho LearningActivity ---
class ActivityType(str, enum.Enum):
    video = "video"
    quiz = "quiz"
    ai = "ai"
    account = "account"
    certificate = "certificate"
    course = "course"

# --- Model LessonProgress ---
class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "lesson_id", name="unique_user_lesson"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False) # Bắt buộc phải có theo schema
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    
    last_position_seconds = Column(Integer, default=0)
    watched_seconds = Column(Integer, default=0)
    duration_seconds = Column(Integer, default=0)
    progress_percent = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    
    last_watched_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    # Relationships
    user = relationship("User", back_populates="progress_records")
    course = relationship("Course") # Trỏ tới model Course
    lesson = relationship("Lesson", back_populates="progress_records")

# --- Model LearningActivity ---
class LearningActivity(Base):
    __tablename__ = "learning_activities"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    activity_type = Column(Enum(ActivityType), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    related_course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    related_lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    related_quiz_id = Column(BigInteger, ForeignKey("quizzes.id", ondelete="SET NULL"), nullable=True)
    
    action_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    user = relationship("User", back_populates="activities")
    course = relationship("Course")
    lesson = relationship("Lesson")
    quiz = relationship("Quiz")

class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint("user_id", "course_id", name="uq_user_course"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    
    # Đã cập nhật trường này để khớp với schema
    current_lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    
    status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.active, nullable=False)
    progress_percent = Column(Integer, default=0)
    completed_lessons_count = Column(Integer, default=0)
    last_accessed_at = Column(DateTime, nullable=True)
    enrolled_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    current_lesson = relationship("Lesson")

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    subject = Column(String(100), nullable=True)
    message = Column(Text, nullable=False)
    status = Column(Enum(ContactStatus), default=ContactStatus.new, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    type = Column(String(50), default="general")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="notifications")

class AdminAuditLog(Base):
    __tablename__ = "admin_audit_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    admin_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(100), nullable=False)
    target_table = Column(String(50), nullable=True)
    target_id = Column(BigInteger, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
    admin = relationship("User")