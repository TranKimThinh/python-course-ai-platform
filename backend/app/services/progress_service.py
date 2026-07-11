from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.courses_model import ContentStatus, Course, Lesson
from app.models.ai_pipeline_model import AIChatMessage, AIChatSession, ChatSender
from app.models.quizzes_model import QuizAttempt
from app.models.system_model import Enrollment, EnrollmentStatus, LearningActivity, LessonProgress
from app.models.users_model import User


class ProgressService:
    @staticmethod
    def get_my_progress(db: Session, user: User):
        user_id = int(user.id)
        enrollments = (
            db.query(Enrollment)
            .join(Course, Course.id == Enrollment.course_id)
            .filter(Enrollment.user_id == user_id, Course.status == ContentStatus.published)
            .order_by(Enrollment.last_accessed_at.desc(), Enrollment.enrolled_at.desc())
            .all()
        )

        courses = []
        for enrollment in enrollments:
            course = enrollment.course
            total_lessons = (
                db.query(func.count(Lesson.id))
                .filter(Lesson.course_id == course.id, Lesson.status == ContentStatus.published)
                .scalar()
                or 0
            )
            completed_lessons = (
                db.query(func.count(LessonProgress.id))
                .join(Lesson, Lesson.id == LessonProgress.lesson_id)
                .filter(
                    LessonProgress.user_id == user_id,
                    LessonProgress.course_id == course.id,
                    LessonProgress.is_completed.is_(True),
                    Lesson.status == ContentStatus.published,
                )
                .scalar()
                or 0
            )
            current_lesson_id = enrollment.current_lesson_id
            if current_lesson_id is None:
                latest_progress = (
                    db.query(LessonProgress)
                    .filter(LessonProgress.user_id == user_id, LessonProgress.course_id == course.id)
                    .order_by(LessonProgress.last_watched_at.desc(), LessonProgress.updated_at.desc())
                    .first()
                )
                current_lesson_id = latest_progress.lesson_id if latest_progress else None
            if current_lesson_id is None:
                first_lesson = ProgressService._get_first_lesson(db, int(course.id))
                current_lesson_id = first_lesson.id if first_lesson else None

            courses.append(
                {
                    "id": int(course.id),
                    "slug": course.slug,
                    "title": course.title,
                    "description": course.description,
                    "thumbnailUrl": course.thumbnail_url,
                    "level": course.level.value if hasattr(course.level, "value") else course.level,
                    "completedLessons": int(completed_lessons),
                    "totalLessons": int(total_lessons),
                    "progressPercent": round((completed_lessons / total_lessons) * 100) if total_lessons else 0,
                    "currentLessonId": int(current_lesson_id) if current_lesson_id else None,
                    "lastAccessedAt": ProgressService._isoformat(enrollment.last_accessed_at),
                }
            )

        completed_lessons_total = (
            db.query(func.count(LessonProgress.id))
            .filter(LessonProgress.user_id == user_id, LessonProgress.is_completed.is_(True))
            .scalar()
            or 0
        )
        average_quiz_score = db.query(func.avg(QuizAttempt.score)).filter(QuizAttempt.user_id == user_id).scalar() or 0
        ai_questions = (
            db.query(func.count(AIChatMessage.id))
            .join(AIChatSession, AIChatSession.id == AIChatMessage.session_id)
            .filter(AIChatSession.user_id == user_id, AIChatMessage.sender == ChatSender.user)
            .scalar()
            or 0
        )
        recent_activities = (
            db.query(LearningActivity)
            .filter(LearningActivity.user_id == user_id)
            .order_by(LearningActivity.created_at.desc())
            .limit(6)
            .all()
        )

        return {
            "user": ProgressService._serialize_user(user),
            "stats": {
                "activeCourses": len([row for row in enrollments if row.status == EnrollmentStatus.active]),
                "completedLessons": int(completed_lessons_total),
                "averageQuizScore": round(float(average_quiz_score), 2),
                "aiQuestions": int(ai_questions),
            },
            "courses": courses,
            "recentActivities": [ProgressService._serialize_activity(activity) for activity in recent_activities],
        }

    @staticmethod
    def get_course_continue(db: Session, user_id: int, course_identifier: str):
        course = ProgressService._get_course(db, course_identifier)
        enrollment = ProgressService._get_enrollment(db, user_id, course.id)
        first_lesson = ProgressService._get_first_lesson(db, course.id)

        lesson_id = enrollment.current_lesson_id if enrollment and enrollment.current_lesson_id else None
        lesson = None
        if lesson_id:
            lesson = ProgressService._get_published_lesson(db, int(lesson_id), course.id, raise_error=False)
        if not lesson:
            lesson = first_lesson
        if not lesson:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khóa học chưa có bài học.")

        progress = ProgressService._get_lesson_progress(db, user_id, lesson.id)
        return {
            "courseId": course.slug,
            "lessonId": int(lesson.id),
            "lastPositionSeconds": int(progress.last_position_seconds or 0) if progress else 0,
            "progressPercent": int(progress.progress_percent or 0) if progress else 0,
            "isCompleted": bool(progress.is_completed) if progress else False,
        }

    @staticmethod
    def get_course_progress(db: Session, user_id: int, course_identifier: str):
        course = ProgressService._get_course(db, course_identifier)
        lessons = ProgressService._get_published_lessons(db, course.id)
        lesson_ids = [lesson.id for lesson in lessons]
        progress_rows = []
        if lesson_ids:
            progress_rows = (
                db.query(LessonProgress)
                .filter(
                    LessonProgress.user_id == user_id,
                    LessonProgress.course_id == course.id,
                    LessonProgress.lesson_id.in_(lesson_ids),
                )
                .all()
            )
        progress_by_lesson = {int(row.lesson_id): row for row in progress_rows}
        completed_count = sum(1 for row in progress_rows if row.is_completed)
        total_count = len(lessons)
        course_percent = round((completed_count / total_count) * 100) if total_count else 0
        enrollment = ProgressService._get_enrollment(db, user_id, course.id)
        current_lesson_id = enrollment.current_lesson_id if enrollment and enrollment.current_lesson_id else None
        if current_lesson_id is None and lessons:
            current_lesson_id = lessons[0].id

        return {
            "courseId": course.slug,
            "progressPercent": course_percent,
            "completedLessons": completed_count,
            "totalLessons": total_count,
            "currentLessonId": int(current_lesson_id) if current_lesson_id else None,
            "lessons": [
                ProgressService._serialize_lesson_progress(lesson.id, progress_by_lesson.get(int(lesson.id)))
                for lesson in lessons
            ],
        }

    @staticmethod
    def get_lesson_progress(db: Session, user_id: int, lesson_id: int):
        lesson = ProgressService._get_published_lesson(db, lesson_id)
        progress = ProgressService._get_lesson_progress(db, user_id, lesson.id)
        return ProgressService._serialize_lesson_progress(lesson.id, progress)

    @staticmethod
    def update_lesson_progress(db: Session, user_id: int, lesson_id: int, payload):
        course = ProgressService._get_course(db, payload.courseId)
        lesson = ProgressService._get_published_lesson(db, lesson_id, course.id)
        enrollment = ProgressService._get_or_create_enrollment(db, user_id, course.id)
        progress = ProgressService._get_lesson_progress(db, user_id, lesson.id)
        now = datetime.utcnow()

        if progress and abs((progress.last_position_seconds or 0) - payload.lastPositionSeconds) < 3:
            enrollment.current_lesson_id = lesson.id
            enrollment.last_accessed_at = now
            progress.last_watched_at = now
            db.commit()
            db.refresh(progress)
            return ProgressService._serialize_lesson_progress(lesson.id, progress)

        if not progress:
            progress = LessonProgress(
                user_id=user_id,
                course_id=course.id,
                lesson_id=lesson.id,
                created_at=now,
            )
            db.add(progress)

        progress.last_position_seconds = payload.lastPositionSeconds
        progress.watched_seconds = max(progress.watched_seconds or 0, payload.watchedSeconds)
        progress.duration_seconds = payload.durationSeconds or lesson.duration_seconds or 0
        progress.progress_percent = min(max(payload.progressPercent, 0), 99) if not progress.is_completed else 100
        progress.last_watched_at = now

        enrollment.current_lesson_id = lesson.id
        enrollment.last_accessed_at = now

        db.commit()
        db.refresh(progress)
        return ProgressService._serialize_lesson_progress(lesson.id, progress)

    @staticmethod
    def complete_lesson(db: Session, user_id: int, lesson_id: int, payload):
        course = ProgressService._get_course(db, payload.courseId)
        lesson = ProgressService._get_published_lesson(db, lesson_id, course.id)
        enrollment = ProgressService._get_or_create_enrollment(db, user_id, course.id)
        progress = ProgressService._get_lesson_progress(db, user_id, lesson.id)
        now = datetime.utcnow()
        duration_seconds = payload.durationSeconds or lesson.duration_seconds or 0

        was_completed = bool(progress and progress.is_completed)
        if not progress:
            progress = LessonProgress(
                user_id=user_id,
                course_id=course.id,
                lesson_id=lesson.id,
                created_at=now,
            )
            db.add(progress)

        progress.last_position_seconds = duration_seconds
        progress.watched_seconds = max(progress.watched_seconds or 0, duration_seconds)
        progress.duration_seconds = duration_seconds
        progress.progress_percent = 100
        progress.is_completed = True
        if not progress.completed_at:
            progress.completed_at = now
        progress.last_watched_at = now

        enrollment.current_lesson_id = lesson.id
        enrollment.last_accessed_at = now
        ProgressService._refresh_enrollment_course_progress(db, enrollment, course.id, user_id)
        if not was_completed:
            ProgressService._record_learning_activity(
                db=db,
                user_id=user_id,
                course=course,
                lesson=lesson,
                title=f"Đã hoàn thành: {lesson.title}",
                description=f"Khóa học: {course.title}",
                activity_type="video",
            )

        db.commit()
        db.refresh(progress)
        return {
            "lessonProgress": ProgressService._serialize_lesson_progress(lesson.id, progress),
            "courseProgress": ProgressService.get_course_progress(db, user_id, str(course.slug or course.id)),
        }

    @staticmethod
    def _refresh_enrollment_course_progress(db: Session, enrollment: Enrollment, course_id: int, user_id: int):
        total_lessons = (
            db.query(func.count(Lesson.id))
            .filter(Lesson.course_id == course_id, Lesson.status == ContentStatus.published)
            .scalar()
            or 0
        )
        completed_lessons = (
            db.query(func.count(LessonProgress.id))
            .join(Lesson, Lesson.id == LessonProgress.lesson_id)
            .filter(
                LessonProgress.user_id == user_id,
                LessonProgress.course_id == course_id,
                LessonProgress.is_completed.is_(True),
                Lesson.status == ContentStatus.published,
            )
            .scalar()
            or 0
        )

        enrollment.completed_lessons_count = int(completed_lessons)
        enrollment.progress_percent = round((completed_lessons / total_lessons) * 100) if total_lessons else 0
        if total_lessons and completed_lessons >= total_lessons:
            enrollment.status = EnrollmentStatus.completed
            enrollment.completed_at = enrollment.completed_at or datetime.utcnow()

    @staticmethod
    def _serialize_lesson_progress(lesson_id: int, progress: LessonProgress | None):
        return {
            "lessonId": int(lesson_id),
            "lastPositionSeconds": int(progress.last_position_seconds or 0) if progress else 0,
            "watchedSeconds": int(progress.watched_seconds or 0) if progress else 0,
            "durationSeconds": int(progress.duration_seconds or 0) if progress else 0,
            "progressPercent": int(progress.progress_percent or 0) if progress else 0,
            "isCompleted": bool(progress.is_completed) if progress else False,
        }

    @staticmethod
    def _get_course(db: Session, identifier: str) -> Course:
        query = db.query(Course).filter(Course.status == ContentStatus.published)
        course = query.filter(Course.id == int(identifier)).first() if str(identifier).isdigit() else query.filter(Course.slug == identifier).first()
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy khóa học.")
        return course

    @staticmethod
    def _get_published_lesson(db: Session, lesson_id: int, course_id: int | None = None, raise_error: bool = True):
        query = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.status == ContentStatus.published)
        if course_id is not None:
            query = query.filter(Lesson.course_id == course_id)
        lesson = query.first()
        if not lesson and raise_error:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bài học.")
        return lesson

    @staticmethod
    def _get_first_lesson(db: Session, course_id: int):
        return (
            db.query(Lesson)
            .filter(Lesson.course_id == course_id, Lesson.status == ContentStatus.published)
            .order_by(Lesson.sort_order.asc(), Lesson.id.asc())
            .first()
        )

    @staticmethod
    def _get_published_lessons(db: Session, course_id: int):
        return (
            db.query(Lesson)
            .filter(Lesson.course_id == course_id, Lesson.status == ContentStatus.published)
            .order_by(Lesson.sort_order.asc(), Lesson.id.asc())
            .all()
        )

    @staticmethod
    def _get_enrollment(db: Session, user_id: int, course_id: int):
        return db.query(Enrollment).filter(Enrollment.user_id == user_id, Enrollment.course_id == course_id).first()

    @staticmethod
    def _get_or_create_enrollment(db: Session, user_id: int, course_id: int):
        enrollment = ProgressService._get_enrollment(db, user_id, course_id)
        if enrollment:
            return enrollment

        enrollment = Enrollment(user_id=user_id, course_id=course_id, status=EnrollmentStatus.active)
        db.add(enrollment)
        return enrollment

    @staticmethod
    def _get_lesson_progress(db: Session, user_id: int, lesson_id: int):
        return db.query(LessonProgress).filter(LessonProgress.user_id == user_id, LessonProgress.lesson_id == lesson_id).first()

    @staticmethod
    def _record_learning_activity(db: Session, user_id: int, course: Course, lesson: Lesson, title: str, description: str, activity_type: str):
        db.add(
            LearningActivity(
                user_id=user_id,
                activity_type=activity_type,
                title=title,
                description=description,
                related_course_id=course.id,
                related_lesson_id=lesson.id,
                action_url=f"/learning/{course.slug}/{lesson.id}",
            )
        )

    @staticmethod
    def _serialize_user(user: User):
        return {
            "id": int(user.id),
            "fullName": user.full_name or user.username,
            "email": user.email,
            "avatarUrl": user.avatar_url,
            "role": user.role.value if hasattr(user.role, "value") else user.role,
        }

    @staticmethod
    def _serialize_activity(activity: LearningActivity):
        course = activity.course
        lesson = activity.lesson
        activity_type = ProgressService._api_activity_type(activity.activity_type)
        return {
            "id": int(activity.id),
            "type": activity_type,
            "title": activity.title,
            "description": activity.description,
            "courseId": int(activity.related_course_id) if activity.related_course_id else None,
            "courseSlug": course.slug if course else None,
            "lessonId": int(activity.related_lesson_id) if activity.related_lesson_id else None,
            "createdAt": ProgressService._isoformat(activity.created_at),
        }

    @staticmethod
    def _api_activity_type(activity_type: str):
        value = activity_type.value if hasattr(activity_type, "value") else activity_type
        return {
            "video": "lesson_completed",
            "quiz": "quiz_completed",
            "ai": "ai_question",
            "course": "course_continued",
            "account": "profile_updated",
            "certificate": "certificate_received",
        }.get(value, value)

    @staticmethod
    def _isoformat(value):
        return value.isoformat() if value else None
