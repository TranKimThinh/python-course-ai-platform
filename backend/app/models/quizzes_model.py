import enum
from sqlalchemy import Column, ForeignKey, BigInteger, String, Enum, Numeric, Integer, Boolean, CHAR, DateTime, Text, text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.courses_model import ContentStatus

class DifficultyLevel(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    time_limit_seconds = Column(Integer, default=0)
    status = Column(Enum(ContentStatus), default=ContentStatus.draft, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    lesson = relationship("Lesson", back_populates="quizzes")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")
    activities = relationship("LearningActivity", back_populates="quiz")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    quiz_id = Column(BigInteger, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    code_snippet = Column(Text, nullable=True)
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.easy, nullable=False)
    explanation = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("QuizOption", back_populates="question", cascade="all, delete-orphan")
    attempt_answers = relationship("QuizAttemptAnswer", back_populates="question", cascade="all, delete-orphan")

class QuizOption(Base):
    __tablename__ = "quiz_options"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    question_id = Column(BigInteger, ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False)
    option_label = Column(CHAR(1), nullable=False) # A, B, C, D
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)

    question = relationship("QuizQuestion", back_populates="options")
    attempt_answers = relationship("QuizAttemptAnswer", back_populates="option")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    quiz_id = Column(BigInteger, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    total_questions = Column(Integer, default=0, nullable=False)
    correct_answers = Column(Integer, default=0, nullable=False)
    score = Column(Numeric(5, 2), default=0.00, nullable=False)
    started_at = Column(DateTime, nullable=False)
    submitted_at = Column(DateTime, nullable=False)

    quiz = relationship("Quiz", back_populates="attempts")
    user = relationship("User", back_populates="quiz_attempts")
    answers = relationship("QuizAttemptAnswer", back_populates="attempt", cascade="all, delete-orphan")

class QuizAttemptAnswer(Base):
    __tablename__ = "quiz_attempt_answers"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    attempt_id = Column(BigInteger, ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(BigInteger, ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False)
    selected_option_id = Column(BigInteger, ForeignKey("quiz_options.id", ondelete="SET NULL"), nullable=True)
    is_correct = Column(Boolean, default=False)
    
    attempt = relationship("QuizAttempt", back_populates="answers")
    question = relationship("QuizQuestion", back_populates="attempt_answers")
    option = relationship("QuizOption", back_populates="attempt_answers")