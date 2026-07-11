from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.ai_pipeline_model import AIChatMessage, AIChatSession
from app.models.courses_model import Course, Lesson
from app.models.quizzes_model import QuizAttempt
from app.models.system_model import Enrollment, LessonProgress
from app.models.users_model import User
from app.services.admin_content_utils import enum_value, isoformat, pagination


class AdminStudentService:
    @staticmethod
    def list_students(db: Session, keyword: str | None, status: str | None, page: int, page_size: int):
        query = db.query(User).filter(User.role == "student")
        if keyword:
            like = f"%{keyword.strip()}%"
            query = query.filter(or_(User.full_name.ilike(like), User.email.ilike(like), User.username.ilike(like)))
        if status and status != "all":
            query = query.filter(User.status == status)

        total = query.count()
        users = query.order_by(User.created_at.desc(), User.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
        return {
            "items": [AdminStudentService.serialize_student(db, user) for user in users],
            "pagination": pagination(page, page_size, total),
        }

    @staticmethod
    def get_student(db: Session, student_id: int):
        student = db.query(User).filter(User.id == student_id, User.role == "student").first()
        if not student:
            return None
        return AdminStudentService.serialize_student(db, student)

    @staticmethod
    def get_progress(db: Session, student_id: int):
        student = db.query(User).filter(User.id == student_id, User.role == "student").first()
        if not student:
            return None
        stats = AdminStudentService.student_stats(db, int(student.id))
        enrollments = (
            db.query(Enrollment)
            .join(Course)
            .filter(Enrollment.user_id == student.id)
            .order_by(Enrollment.last_accessed_at.desc(), Enrollment.enrolled_at.desc())
            .all()
        )
        courses = []
        for enrollment in enrollments:
            total_lessons = db.query(func.count(Lesson.id)).filter(Lesson.course_id == enrollment.course_id).scalar() or 0
            completed_lessons = (
                db.query(func.count(LessonProgress.id))
                .filter(
                    LessonProgress.user_id == student.id,
                    LessonProgress.course_id == enrollment.course_id,
                    LessonProgress.is_completed.is_(True),
                )
                .scalar()
                or 0
            )
            course = enrollment.course
            courses.append(
                {
                    "id": int(course.id),
                    "slug": course.slug,
                    "title": course.title,
                    "completedLessons": int(completed_lessons),
                    "totalLessons": int(total_lessons),
                    "progressPercent": int(enrollment.progress_percent or (completed_lessons * 100 / total_lessons if total_lessons else 0)),
                    "currentLessonId": int(enrollment.current_lesson_id) if enrollment.current_lesson_id else None,
                    "lastAccessedAt": isoformat(enrollment.last_accessed_at),
                }
            )
        return {
            "student": {
                "id": int(student.id),
                "fullName": student.full_name or student.username,
                "email": student.email,
            },
            "stats": stats,
            "courses": courses,
        }

    @staticmethod
    def update_status(db: Session, student_id: int, new_status: str):
        student = db.query(User).filter(User.id == student_id, User.role == "student").first()
        if not student:
            return None
        student.status = new_status
        db.commit()
        db.refresh(student)
        return AdminStudentService.serialize_student(db, student)

    @staticmethod
    def serialize_student(db: Session, user: User):
        stats = AdminStudentService.student_stats(db, int(user.id))
        return {
            "id": int(user.id),
            "fullName": user.full_name or user.username,
            "email": user.email,
            "role": enum_value(user.role),
            "status": enum_value(user.status),
            **stats,
            "lastLearningAt": AdminStudentService.last_learning_at(db, int(user.id)),
            "createdAt": isoformat(user.created_at),
        }

    @staticmethod
    def student_stats(db: Session, user_id: int):
        active_courses = db.query(func.count(Enrollment.id)).filter(Enrollment.user_id == user_id, Enrollment.status == "active").scalar() or 0
        completed_lessons = (
            db.query(func.count(LessonProgress.id))
            .filter(LessonProgress.user_id == user_id, LessonProgress.is_completed.is_(True))
            .scalar()
            or 0
        )
        average_score = db.query(func.avg(QuizAttempt.score)).filter(QuizAttempt.user_id == user_id).scalar()
        ai_questions = (
            db.query(func.count(AIChatMessage.id))
            .join(AIChatSession, AIChatMessage.session_id == AIChatSession.id)
            .filter(AIChatSession.user_id == user_id, AIChatMessage.sender == "user")
            .scalar()
            or 0
        )
        return {
            "activeCourses": int(active_courses),
            "completedLessons": int(completed_lessons),
            "averageQuizScore": round(float(average_score), 2) if average_score is not None else None,
            "aiQuestions": int(ai_questions),
        }

    @staticmethod
    def last_learning_at(db: Session, user_id: int):
        last_progress = db.query(func.max(LessonProgress.last_watched_at)).filter(LessonProgress.user_id == user_id).scalar()
        last_enrollment = db.query(func.max(Enrollment.last_accessed_at)).filter(Enrollment.user_id == user_id).scalar()
        values = [value for value in [last_progress, last_enrollment] if value]
        return isoformat(max(values)) if values else None
