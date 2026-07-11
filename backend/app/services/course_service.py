import math
import re
import unicodedata
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.models.courses_model import ContentStatus, Course, Lesson


DEFAULT_AI_FEATURES = [
    {
        "id": "transcript",
        "title": "Transcript tự động",
        "description": "AI chuyển nội dung video thành văn bản.",
    },
    {
        "id": "summary",
        "title": "Tóm tắt bài học",
        "description": "AI rút ra các ý chính trong bài học.",
    },
    {
        "id": "qa",
        "title": "Hỏi đáp theo bài học",
        "description": "Chatbot trả lời dựa trên nội dung bài học.",
    },
]

COURSE_OBJECTIVES = {
    "python-co-ban-tich-hop-ai": [
        "Nắm được cú pháp Python cơ bản.",
        "Hiểu biến, kiểu dữ liệu, điều kiện và vòng lặp.",
        "Biết ứng dụng AI Assistant để tăng hiệu suất viết code.",
    ],
    "rag-fastapi-advanced": [
        "Nắm kiến trúc tổng quan của hệ thống RAG.",
        "Biết cách kết hợp vector database với FastAPI.",
        "Xây dựng API trợ lý thông minh dựa trên nội dung bài học.",
    ],
}


class CoursesService:
    # ============ PHẦN CŨ: PUBLIC / HỌC VIÊN (giữ nguyên, không đổi) ============

    @staticmethod
    def get_all_published_courses(
        db: Session,
        keyword: Optional[str] = None,
        level: Optional[str] = None,
        page: int = 1,
        page_size: int = 12,
    ):
        page = max(page, 1)
        page_size = min(max(page_size, 1), 100)

        query = db.query(Course).filter(Course.status == ContentStatus.published)

        if keyword:
            keyword_like = f"%{keyword.strip()}%"
            query = query.filter(
                (Course.title.ilike(keyword_like)) | (Course.description.ilike(keyword_like))
            )

        if level:
            query = query.filter(Course.level == level)

        total_items = query.count()
        courses = (
            query.options(selectinload(Course.lessons))
            .order_by(Course.created_at.desc(), Course.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return {
            "items": [CoursesService.serialize_course_list_item(course) for course in courses],
            "pagination": {
                "page": page,
                "pageSize": page_size,
                "totalItems": total_items,
                "totalPages": math.ceil(total_items / page_size) if total_items else 0,
            },
        }

    @staticmethod
    def get_featured_courses(db: Session, limit: int = 6):
        courses = (
            db.query(Course)
            .options(selectinload(Course.lessons))
            .filter(Course.status == ContentStatus.published)
            .order_by(Course.created_at.desc(), Course.id.desc())
            .limit(limit)
            .all()
        )
        return [CoursesService.serialize_featured_course(course) for course in courses]

    @staticmethod
    def get_course_by_identifier(identifier: str, db: Session):
        query = (
            db.query(Course)
            .options(
                selectinload(Course.lessons),
            )
            .filter(Course.status == ContentStatus.published)
        )

        if identifier.isdigit():
            course = query.filter(Course.id == int(identifier)).first()
        else:
            course = query.filter(Course.slug == identifier).first()

        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Không tìm thấy khóa học.",
                    "errorCode": "COURSE_NOT_FOUND",
                    "details": None,
                },
            )

        return course

    @staticmethod
    def serialize_course_detail(course: Course):
        published_lessons = CoursesService._published_lessons(course.lessons)
        lessons_count = len(published_lessons)
        duration_seconds = sum((lesson.duration_seconds or 0) for lesson in published_lessons)
        first_lesson = (
            min(published_lessons, key=lambda lesson: lesson.sort_order or 0)
            if published_lessons
            else None
        )

        return {
            "id": int(course.id),
            "slug": course.slug,
            "title": course.title,
            "description": course.description or "",
            "thumbnailUrl": course.thumbnail_url,
            "level": CoursesService._enum_value(course.level),
            "price": float(course.price or 0),
            "status": CoursesService._enum_value(course.status),
            "lessonsCount": lessons_count,
            "durationSeconds": duration_seconds,
            "hasAI": True,
            "studentsThisMonth": "+1,200 học viên",
            "firstLessonId": int(first_lesson.id) if first_lesson else None,
            "currentLessonId": int(first_lesson.id) if first_lesson else None,
            "objectives": COURSE_OBJECTIVES.get(course.slug, []),
            "aiFeatures": DEFAULT_AI_FEATURES,
        }

    @staticmethod
    def get_course_lessons(identifier: str, db: Session):
        course = CoursesService.get_course_by_identifier(identifier, db)
        lessons = (
            db.query(Lesson)
            .filter(
                Lesson.course_id == course.id,
                Lesson.status == ContentStatus.published,
            )
            .order_by(Lesson.sort_order.asc(), Lesson.id.asc())
            .all()
        )

        return [CoursesService.serialize_lesson(lesson) for lesson in lessons]

    @staticmethod
    def serialize_course_list_item(course: Course):
        published_lessons = CoursesService._published_lessons(course.lessons)
        return {
            "id": int(course.id),
            "slug": course.slug,
            "title": course.title,
            "description": course.description or "",
            "thumbnailUrl": course.thumbnail_url,
            "level": CoursesService._enum_value(course.level),
            "price": float(course.price or 0),
            "status": CoursesService._enum_value(course.status),
            "lessonsCount": len(published_lessons),
            "durationSeconds": sum((lesson.duration_seconds or 0) for lesson in published_lessons),
            "hasAI": True,
            "isLearning": False,
            "progress": 0,
            "currentLessonId": None,
        }

    @staticmethod
    def serialize_featured_course(course: Course):
        item = CoursesService.serialize_course_list_item(course)
        return {
            "id": item["id"],
            "slug": item["slug"],
            "title": item["title"],
            "description": item["description"],
            "level": item["level"],
            "lessonsCount": item["lessonsCount"],
            "durationSeconds": item["durationSeconds"],
            "hasAI": item["hasAI"],
        }

    @staticmethod
    def serialize_lesson(lesson: Lesson):
        duration_seconds = lesson.duration_seconds or 0
        return {
            "id": int(lesson.id),
            "courseId": int(lesson.course_id),
            "sectionId": int(lesson.section_id) if lesson.section_id else None,
            "title": lesson.title,
            "description": lesson.description or "",
            "durationSeconds": duration_seconds,
            "duration": CoursesService._format_duration(duration_seconds),
            "status": "available",
            "isFree": bool(lesson.is_free),
            "sortOrder": lesson.sort_order or 0,
        }

    @staticmethod
    def _published_lessons(lessons):
        return [lesson for lesson in lessons if lesson.status == ContentStatus.published]

    @staticmethod
    def _format_duration(duration_seconds: int):
        minutes, seconds = divmod(max(duration_seconds, 0), 60)
        return f"{minutes:02d}:{seconds:02d}"

    @staticmethod
    def _format_minutes(duration_seconds: int):
        minutes = max(1, math.ceil(max(duration_seconds, 0) / 60)) if duration_seconds else 0
        return f"{minutes} phút"

    @staticmethod
    def _enum_value(value):
        return getattr(value, "value", value)

    # ============ PHẦN MỚI: ADMIN QUẢN LÝ KHÓA HỌC ============
    # Định danh (identifier) chấp nhận cả ID số hoặc slug, giống hệt cách
    # get_course_by_identifier ở trên đã làm cho phía học viên — chỉ khác là
    # KHÔNG giới hạn status = published (admin cần thấy cả draft/hidden).

    @staticmethod
    def get_all_courses_admin(db: Session, keyword: Optional[str] = None):
        query = db.query(Course).options(
            selectinload(Course.lessons), selectinload(Course.enrollments)
        )

        if keyword:
            keyword_like = f"%{keyword.strip()}%"
            query = query.filter(
                (Course.title.ilike(keyword_like)) | (Course.slug.ilike(keyword_like))
            )

        courses = query.order_by(Course.created_at.desc(), Course.id.desc()).all()
        return [CoursesService.serialize_course_admin_item(course) for course in courses]

    @staticmethod
    def serialize_course_admin_item(course: Course):
        return {
            "id": int(course.id),
            "slug": course.slug,
            "title": course.title,
            "description": course.description or "",
            "thumbnailUrl": course.thumbnail_url,
            "level": CoursesService._enum_value(course.level),
            "price": float(course.price or 0),
            "status": CoursesService._enum_value(course.status),
            "lessonsCount": len(course.lessons or []),
            "studentsCount": len(course.enrollments or []),
            "createdAt": course.created_at.isoformat() if course.created_at else None,
        }

    @staticmethod
    def get_course_for_admin(identifier: str, db: Session) -> Course:
        query = db.query(Course)
        if identifier.isdigit():
            course = query.filter(Course.id == int(identifier)).first()
        else:
            course = query.filter(Course.slug == identifier).first()

        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Không tìm thấy khóa học.",
                    "errorCode": "COURSE_NOT_FOUND",
                    "details": None,
                },
            )
        return course

    @staticmethod
    def create_course(db: Session, payload, created_by: int) -> Course:
        requested_slug = (getattr(payload, "slug", None) or "").strip()

        if requested_slug and not db.query(Course).filter(Course.slug == requested_slug).first():
            slug = requested_slug
        else:
            slug = CoursesService._generate_unique_slug(db, payload.title)

        course = Course(
            title=payload.title,
            slug=slug,
            description=payload.description,
            thumbnail_url=payload.thumbnail_url,
            level=payload.level,
            price=payload.price,
            status=payload.status,
            created_by=created_by,
        )
        db.add(course)
        db.commit()
        db.refresh(course)
        return course

    @staticmethod
    def update_course(db: Session, identifier: str, payload) -> Course:
        course = CoursesService.get_course_for_admin(identifier, db)

        if payload.title is not None:
            course.title = payload.title
        if payload.description is not None:
            course.description = payload.description
        if payload.thumbnail_url is not None:
            course.thumbnail_url = payload.thumbnail_url
        if payload.level is not None:
            course.level = payload.level
        if payload.price is not None:
            course.price = payload.price
        if payload.status is not None:
            course.status = payload.status

        db.commit()
        db.refresh(course)
        return course

    @staticmethod
    def delete_course(db: Session, identifier: str):
        course = CoursesService.get_course_for_admin(identifier, db)
        db.delete(course)
        db.commit()

    @staticmethod
    def _generate_unique_slug(db: Session, title: str) -> str:
        base_slug = CoursesService._slugify(title)
        slug = base_slug
        counter = 1
        while db.query(Course).filter(Course.slug == slug).first() is not None:
            counter += 1
            slug = f"{base_slug}-{counter}"
        return slug

    @staticmethod
    def _slugify(value: str) -> str:
        value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
        value = re.sub(r"[^\w\s-]", "", value).strip().lower()
        return re.sub(r"[-\s]+", "-", value) or "khoa-hoc"