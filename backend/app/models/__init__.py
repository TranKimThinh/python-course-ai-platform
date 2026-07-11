<<<<<<< HEAD
from app.core.database import Base
from app.models.users_model import User, PasswordResetToken, UserSettings
from app.models.courses_model import Course, CourseSection, Lesson, LessonVideo, LessonFile
from app.models.ai_pipeline_model import LessonTranscript, LessonSummary, TranscriptChunk, AIChatSession, AIChatMessage, AIRetrievalLog
from app.models.quizzes_model import Quiz, QuizQuestion, QuizOption, QuizAttempt, QuizAttemptAnswer
=======
from app.core.database import Base
from app.models.users_model import User, PasswordResetToken, UserSettings
from app.models.courses_model import Course, CourseSection, Lesson, LessonVideo, LessonFile
from app.models.ai_pipeline_model import LessonTranscript, LessonSummary, TranscriptChunk, AIChatSession, AIChatMessage, AIRetrievalLog
from app.models.quizzes_model import Quiz, QuizQuestion, QuizOption, QuizAttempt, QuizAttemptAnswer
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
from app.models.system_model import Enrollment, LessonProgress, LearningActivity, ContactMessage, Notification, AdminAuditLog
