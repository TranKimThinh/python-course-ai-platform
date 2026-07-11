from datetime import datetime, time, timedelta

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.ai_pipeline_model import AIChatMessage, AIChatSession, ChatSender
from app.models.quizzes_model import QuizAttempt
from app.models.system_model import LearningActivity, LessonProgress
from app.models.users_model import User
from app.services.progress_service import ProgressService


class ActivityService:
    TYPE_ALIASES = {
        "lesson_completed": "video",
        "lesson_watched": "video",
        "lesson_started": "video",
        "quiz_completed": "quiz",
        "ai_question": "ai",
        "course_started": "course",
        "course_continued": "course",
        "profile_updated": "account",
        "certificate_received": "certificate",
        "video": "video",
        "quiz": "quiz",
        "ai": "ai",
        "course": "course",
        "account": "account",
        "certificate": "certificate",
    }

    @staticmethod
    def get_profile_activities(
        db: Session,
        user: User,
        keyword: str | None = None,
        activity_type: str | None = None,
        time_range: str = "all",
        page: int = 1,
        page_size: int = 10,
    ):
        user_id = int(user.id)
        query = db.query(LearningActivity).filter(LearningActivity.user_id == user_id)

        if keyword:
            like_keyword = f"%{keyword.strip()}%"
            query = query.filter(
                or_(
                    LearningActivity.title.ilike(like_keyword),
                    LearningActivity.description.ilike(like_keyword),
                )
            )

        db_activity_type = ActivityService.TYPE_ALIASES.get(activity_type or "")
        if db_activity_type:
            query = query.filter(LearningActivity.activity_type == db_activity_type)

        start_at, end_at = ActivityService._time_range_bounds(time_range)
        if start_at:
            query = query.filter(LearningActivity.created_at >= start_at)
        if end_at:
            query = query.filter(LearningActivity.created_at < end_at)

        total_items = query.count()
        total_pages = (total_items + page_size - 1) // page_size if total_items else 0
        items = (
            query.order_by(LearningActivity.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return {
            "user": ProgressService._serialize_user(user),
            "stats": ActivityService._get_stats(db, user_id),
            "items": [ActivityService._serialize_activity(activity) for activity in items],
            "pagination": {
                "page": page,
                "pageSize": page_size,
                "totalItems": total_items,
                "totalPages": total_pages,
            },
        }

    @staticmethod
    def _get_stats(db: Session, user_id: int):
<<<<<<< HEAD
        """
        Tổng hợp thống kê hoạt động học tập của người dùng.
        
        Args:
            db (Session): Phiên kết nối CSDL hiện tại.
            user_id (int): ID của người dùng cần lấy thống kê.
            
        Returns:
            dict: Thống kê bao gồm số lượng bài học đã hoàn thành, 
                  số lần làm bài kiểm tra và số câu hỏi đã đặt cho AI.
        """
=======
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
        lessons = (
            db.query(func.count(LessonProgress.id))
            .filter(LessonProgress.user_id == user_id, LessonProgress.is_completed.is_(True))
            .scalar()
            or 0
        )
        quizzes = db.query(func.count(QuizAttempt.id)).filter(QuizAttempt.user_id == user_id).scalar() or 0
        ai_questions = (
            db.query(func.count(AIChatMessage.id))
            .join(AIChatSession, AIChatSession.id == AIChatMessage.session_id)
            .filter(AIChatSession.user_id == user_id, AIChatMessage.sender == ChatSender.user)
            .scalar()
            or 0
        )
        return {
            "lessons": int(lessons),
            "quizzes": int(quizzes),
            "aiQuestions": int(ai_questions),
        }

    @staticmethod
    def _serialize_activity(activity: LearningActivity):
<<<<<<< HEAD
        """
        Chuyển đổi đối tượng hoạt động học tập thành dạng từ điển (dictionary) có định dạng,
        bao gồm nhãn hành động (actionLabel) và URL dẫn đến trang chi tiết.
        
        Args:
            activity (LearningActivity): Đối tượng hoạt động học tập từ database.
            
        Returns:
            dict: Dữ liệu hoạt động đã được serialize đầy đủ.
        """
=======
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
        payload = ProgressService._serialize_activity(activity)
        payload["actionLabel"] = ActivityService._action_label(payload["type"])
        payload["actionUrl"] = activity.action_url or ActivityService._action_url(payload)
        return payload

    @staticmethod
    def _action_label(activity_type: str):
<<<<<<< HEAD
        """
        Lấy nhãn (label) hiển thị cho nút hành động dựa trên loại hoạt động.
        
        Args:
            activity_type (str): Loại hoạt động (VD: 'lesson_completed', 'ai_question').
            
        Returns:
            str: Nhãn văn bản hiển thị trên UI.
        """
=======
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
        return {
            "lesson_completed": "Xem bài học",
            "lesson_watched": "Xem bài học",
            "quiz_completed": "Xem kết quả",
            "ai_question": "Hỏi lại AI",
            "course_continued": "Học tiếp",
            "profile_updated": "Chỉnh sửa",
            "certificate_received": "Tải chứng nhận",
        }.get(activity_type, "Xem chi tiết")

    @staticmethod
    def _action_url(payload: dict):
<<<<<<< HEAD
        """
        Xác định đường dẫn URL (route) để điều hướng người dùng dựa trên loại hoạt động.
        
        Args:
            payload (dict): Dữ liệu chi tiết của hoạt động.
            
        Returns:
            str | None: Đường dẫn URL tương ứng hoặc None nếu không xác định được.
        """
=======
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
        if payload["type"] in {"lesson_completed", "lesson_watched", "course_continued"}:
            if payload.get("courseSlug") and payload.get("lessonId"):
                return f"/learning/{payload['courseSlug']}/{payload['lessonId']}"
        if payload["type"] == "quiz_completed" and payload.get("lessonId"):
            return f"/quiz/{payload['lessonId']}/result"
        if payload["type"] == "ai_question":
            return "/ai-assistant"
        if payload["type"] == "profile_updated":
            return "/profile"
        return None

    @staticmethod
    def _time_range_bounds(time_range: str):
<<<<<<< HEAD
        """
        Tính toán phạm vi thời gian (ngày bắt đầu và kết thúc) dựa trên tham số khoảng thời gian.
        
        Args:
            time_range (str): Khoảng thời gian yêu cầu (VD: 'today', 'week', 'month').
            
        Returns:
            tuple[datetime | None, datetime | None]: Cặp ngày bắt đầu và kết thúc.
        """
=======
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
        now = datetime.utcnow()
        today = datetime.combine(now.date(), time.min)
        if time_range == "today":
            return today, today + timedelta(days=1)
        if time_range == "yesterday":
            yesterday = today - timedelta(days=1)
            return yesterday, today
        if time_range == "week":
            return today - timedelta(days=7), None
        if time_range == "month":
            return today - timedelta(days=30), None
        return None, None
