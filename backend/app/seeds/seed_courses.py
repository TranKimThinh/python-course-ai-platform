from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Iterable

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.ai_pipeline_model import LessonSummary, LessonTranscript
from app.models.courses_model import (
    ContentStatus,
    Course,
    CourseLevel,
    CourseSection,
    Lesson,
)
from app.models.users_model import User, UserRole, UserStatus


DEFAULT_STATUS = ContentStatus.published


class SeedDataError(ValueError):
    """Raised when the input seed file is invalid."""


def enum_value(enum_cls: type, value: Any, field_name: str):
    """Convert a raw string/value to the matching Enum value used by SQLAlchemy models."""
    if value is None:
        raise SeedDataError(f"Missing required field: {field_name}")

    if isinstance(value, enum_cls):
        return value

    raw_value = str(value).strip()
    for member in enum_cls:
        if raw_value == member.name or raw_value == str(member.value):
            return member

    allowed = ", ".join(str(member.value) for member in enum_cls)
    raise SeedDataError(f"Invalid {field_name}: {value}. Allowed values: {allowed}")


def optional_status(value: Any) -> ContentStatus:
    if value is None or str(value).strip() == "":
        return DEFAULT_STATUS
    return enum_value(ContentStatus, value, "status")


def get_required_str(data: dict[str, Any], key: str) -> str:
    value = data.get(key)
    if value is None or str(value).strip() == "":
        raise SeedDataError(f"Missing required field: {key}")
    return str(value).strip()


def get_optional_str(data: dict[str, Any], key: str, default: str = "") -> str:
    value = data.get(key)
    if value is None:
        return default
    return str(value).strip()


def get_optional_int(data: dict[str, Any], key: str, default: int = 0) -> int:
    value = data.get(key, default)
    if value is None or value == "":
        return default
    return int(value)


def get_optional_float(data: dict[str, Any], key: str, default: float = 0.0) -> float:
    value = data.get(key, default)
    if value is None or value == "":
        return default
    return float(value)


def get_optional_bool(data: dict[str, Any], key: str, default: bool = False) -> bool:
    value = data.get(key, default)
    if isinstance(value, bool):
        return value
    if value is None or value == "":
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "y", "on"}


def load_courses_from_json(file_path: Path) -> list[dict[str, Any]]:
    if not file_path.exists():
        raise SeedDataError(f"Seed file not found: {file_path}")

    with file_path.open("r", encoding="utf-8") as file:
        payload = json.load(file)

    if isinstance(payload, list):
        courses = payload
    elif isinstance(payload, dict) and isinstance(payload.get("courses"), list):
        courses = payload["courses"]
    else:
        raise SeedDataError("Seed JSON must be a list of courses or an object with a 'courses' list.")

    if not all(isinstance(course, dict) for course in courses):
        raise SeedDataError("Each course item in the seed JSON must be an object.")

    return courses


def find_admin(db: Session, admin_id: int | None = None) -> User:
    if admin_id is not None:
        admin = db.query(User).filter(User.id == admin_id).first()
        if not admin:
            raise SeedDataError(f"Admin user with id={admin_id} was not found.")
        return admin

    admin = (
        db.query(User)
        .filter(User.role == UserRole.admin, User.status == UserStatus.active)
        .order_by(User.id.asc())
        .first()
    )
    if not admin:
        raise SeedDataError(
            "No active admin user was found. Create an admin first or pass --admin-id <id>."
        )
    return admin


def upsert_course(db: Session, data: dict[str, Any], admin: User) -> Course:
    slug = get_required_str(data, "slug")
    title = get_required_str(data, "title")

    course = db.query(Course).filter(Course.slug == slug).first()
    if not course:
        course = Course(slug=slug, created_by=admin.id)
        db.add(course)

    course.slug = slug
    course.title = title
    course.description = get_optional_str(data, "description")
    course.thumbnail_url = data.get("thumbnailUrl", data.get("thumbnail_url"))
    course.level = enum_value(CourseLevel, data.get("level", "beginner"), "level")
    course.price = get_optional_float(data, "price", 0.0)
    course.status = optional_status(data.get("status"))
    course.created_by = int(data.get("createdBy", data.get("created_by", admin.id)))

    db.flush()
    return course


def upsert_section(db: Session, course: Course, data: dict[str, Any], default_sort_order: int) -> CourseSection:
    title = get_required_str(data, "title")
    sort_order = get_optional_int(data, "sortOrder", get_optional_int(data, "sort_order", default_sort_order))

    section = (
        db.query(CourseSection)
        .filter(CourseSection.course_id == course.id, CourseSection.title == title)
        .first()
    )
    if not section:
        section = CourseSection(course_id=course.id, title=title)
        db.add(section)

    section.course_id = course.id
    section.title = title
    section.sort_order = sort_order

    db.flush()
    return section


def upsert_lesson(
    db: Session,
    course: Course,
    section: CourseSection,
    data: dict[str, Any],
    default_sort_order: int,
) -> Lesson:
    title = get_required_str(data, "title")
    sort_order = get_optional_int(data, "sortOrder", get_optional_int(data, "sort_order", default_sort_order))

    lesson = (
        db.query(Lesson)
        .filter(Lesson.section_id == section.id, Lesson.title == title)
        .first()
    )
    if not lesson:
        lesson = Lesson(course_id=course.id, section_id=section.id, title=title)
        db.add(lesson)

    lesson.course_id = course.id
    lesson.section_id = section.id
    lesson.title = title
    lesson.description = get_optional_str(data, "description")
    lesson.duration_seconds = get_optional_int(
        data,
        "durationSeconds",
        get_optional_int(data, "duration_seconds", 0),
    )
    lesson.sort_order = sort_order
    lesson.is_free = get_optional_bool(data, "isFree", get_optional_bool(data, "is_free", False))
    lesson.status = optional_status(data.get("status"))

    db.flush()
    return lesson


def upsert_transcript_if_provided(db: Session, lesson: Lesson, data: dict[str, Any]) -> None:
    transcript_payload = data.get("transcript")
    transcript_text = data.get("transcriptText", data.get("transcript_text"))

    if isinstance(transcript_payload, dict):
        transcript_text = transcript_payload.get("text") or transcript_payload.get("transcriptText") or transcript_payload.get("transcript_text")
        language = transcript_payload.get("language", "vi")
        generated_by = transcript_payload.get("generatedBy", transcript_payload.get("generated_by", "manual"))
        transcript_status = transcript_payload.get("status", "completed")
    else:
        language = data.get("transcriptLanguage", data.get("transcript_language", "vi"))
        generated_by = data.get("transcriptGeneratedBy", data.get("transcript_generated_by", "manual"))
        transcript_status = data.get("transcriptStatus", data.get("transcript_status", "completed"))

    if not transcript_text:
        return

    transcript = db.query(LessonTranscript).filter(LessonTranscript.lesson_id == lesson.id).first()
    if not transcript:
        transcript = LessonTranscript(lesson_id=lesson.id)
        db.add(transcript)

    transcript.transcript_text = str(transcript_text)
    transcript.language = str(language)
    transcript.generated_by = str(generated_by)
    transcript.status = str(transcript_status)


def upsert_summary_if_provided(db: Session, lesson: Lesson, data: dict[str, Any]) -> None:
    summary_payload = data.get("summary")
    summary_text = data.get("summaryText", data.get("summary_text"))
    key_points = data.get("keyPoints", data.get("key_points"))

    if isinstance(summary_payload, dict):
        summary_text = summary_payload.get("text") or summary_payload.get("summaryText") or summary_payload.get("summary_text")
        key_points = summary_payload.get("keyPoints", summary_payload.get("key_points", key_points))
        generated_by = summary_payload.get("generatedBy", summary_payload.get("generated_by", "manual"))
    else:
        generated_by = data.get("summaryGeneratedBy", data.get("summary_generated_by", "manual"))

    if not summary_text:
        return

    if key_points is not None and not isinstance(key_points, list):
        raise SeedDataError("keyPoints/key_points must be a list when provided.")

    summary = db.query(LessonSummary).filter(LessonSummary.lesson_id == lesson.id).first()
    if not summary:
        summary = LessonSummary(lesson_id=lesson.id)
        db.add(summary)

    summary.summary_text = str(summary_text)
    summary.key_points = key_points or []
    summary.generated_by = str(generated_by)


def seed_courses_from_payload(
    db: Session,
    courses: Iterable[dict[str, Any]],
    admin: User,
) -> tuple[int, int, int]:
    course_count = 0
    section_count = 0
    lesson_count = 0

    for course_data in courses:
        course = upsert_course(db, course_data, admin)
        course_count += 1

        raw_sections = course_data.get("sections") or course_data.get("chapters") or []
        if not isinstance(raw_sections, list):
            raise SeedDataError(f"sections/chapters must be a list for course: {course.slug}")

        for section_index, section_data in enumerate(raw_sections, start=1):
            if not isinstance(section_data, dict):
                raise SeedDataError(f"Invalid section item in course: {course.slug}")

            section = upsert_section(db, course, section_data, section_index)
            section_count += 1

            raw_lessons = section_data.get("lessons") or []
            if not isinstance(raw_lessons, list):
                raise SeedDataError(f"lessons must be a list in section: {section.title}")

            for lesson_index, lesson_data in enumerate(raw_lessons, start=1):
                if not isinstance(lesson_data, dict):
                    raise SeedDataError(f"Invalid lesson item in section: {section.title}")

                lesson = upsert_lesson(db, course, section, lesson_data, lesson_index)
                upsert_transcript_if_provided(db, lesson, lesson_data)
                upsert_summary_if_provided(db, lesson, lesson_data)
                lesson_count += 1

    return course_count, section_count, lesson_count


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import real course data into MySQL. This script does not contain sample course data."
    )
    parser.add_argument(
        "--file",
        type=Path,
        help="Path to a JSON file that contains real courses data.",
    )
    parser.add_argument(
        "--admin-id",
        type=int,
        help="Existing admin user id used as created_by when the JSON does not specify createdBy.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate and execute the import without committing changes.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if not args.file:
        print("No --file provided. Skip seeding courses to avoid inserting sample data.")
        print("Usage: python -m app.seeds.seed_courses --file ./data/courses.json")
        return

    courses = load_courses_from_json(args.file)

    db = SessionLocal()
    try:
        admin = find_admin(db, args.admin_id)
        course_count, section_count, lesson_count = seed_courses_from_payload(db, courses, admin)

        if args.dry_run:
            db.rollback()
            print("Dry run completed. No data was committed.")
        else:
            db.commit()
            print("Course data import completed.")

        print(f"Courses upserted: {course_count}")
        print(f"Sections upserted: {section_count}")
        print(f"Lessons upserted: {lesson_count}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
