import enum
from sqlalchemy import Column, ForeignKey, BigInteger, String, Enum, Boolean, DateTime, Text, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    student = "student"
    admin = "admin"

class UserStatus(str, enum.Enum):
    active = "active"
    blocked = "blocked"
    inactive = "inactive"

class ThemeOption(str, enum.Enum):
    light = "light"
    dark = "dark"
    system = "system"

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True, index=True)
    email = Column(String(150), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    full_name = Column(String(100), nullable=True)
    avatar_url = Column(Text, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)
    status = Column(Enum(UserStatus), default=UserStatus.active, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    # Relationships
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")
    courses_created = relationship("Course", back_populates="creator")
    chat_sessions = relationship("AIChatSession", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("LessonProgress", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("LearningActivity", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AdminAuditLog", back_populates="admin", cascade="all, delete-orphan")

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="tokens")

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    two_factor_enabled = Column(Boolean, default=False)
    save_ai_history = Column(Boolean, default=True)
    learning_reminder_enabled = Column(Boolean, default=True)
    theme = Column(Enum(ThemeOption), default=ThemeOption.system, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="settings")