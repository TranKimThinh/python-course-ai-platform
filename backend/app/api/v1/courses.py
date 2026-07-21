# backend/app/api/v1/courses.py
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.users_model import User
from app.services.course_service import CoursesService
from app.services.progress_service import ProgressService
from app.utils.response import success_response


router = APIRouter()

def _get_published_courses_response(
    keyword: str | None = Query(default=None),
    level: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, alias="pageSize", ge=1, le=100),
    db: Session = Depends(get_db),
):
    return success_response(
        CoursesService.get_all_published_courses(
            db=db,
            keyword=keyword,
            level=level,
            page=page,
            page_size=page_size,
        )
    )


@router.get("", status_code=status.HTTP_200_OK, include_in_schema=False)
def get_published_courses_no_slash(
    keyword: str | None = Query(default=None),
    level: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, alias="pageSize", ge=1, le=100),
    db: Session = Depends(get_db),
):
    return _get_published_courses_response(
        keyword=keyword,
        level=level,
        page=page,
        page_size=page_size,
        db=db,
    )


@router.get("/", status_code=status.HTTP_200_OK)
def get_all_published_courses(
    keyword: str | None = Query(default=None),
    level: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, alias="pageSize", ge=1, le=100),
    db: Session = Depends(get_db),
):

    return _get_published_courses_response(
        keyword=keyword,
        level=level,
        page=page,
        page_size=page_size,
        db=db,
    )


@router.get("/featured", status_code=status.HTTP_200_OK)
def get_featured_courses(
    limit: int = Query(default=6, ge=1, le=20),
    db: Session = Depends(get_db),
):
    return success_response(CoursesService.get_featured_courses(db=db, limit=limit))


@router.get("/{identifier}/continue", status_code=status.HTTP_200_OK)
def get_course_continue(
    identifier: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return success_response(ProgressService.get_course_continue(db, int(current_user.id), identifier))


@router.get("/{identifier}/progress", status_code=status.HTTP_200_OK)
def get_course_progress(
    identifier: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return success_response(ProgressService.get_course_progress(db, int(current_user.id), identifier))


@router.get("/{identifier}/lessons", status_code=status.HTTP_200_OK)
def get_course_lessons(identifier: str, db: Session = Depends(get_db)):
    return success_response(CoursesService.get_course_lessons(identifier, db))


@router.get("/{identifier}", status_code=status.HTTP_200_OK)
def get_course_detail(identifier: str, db: Session = Depends(get_db)):
    return success_response(CoursesService.serialize_course_detail(CoursesService.get_course_by_identifier(identifier, db)))