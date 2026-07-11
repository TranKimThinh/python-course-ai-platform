# backend/app/api/v1/admin_courses.py
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.courses_model import ContentStatus, CourseLevel
from app.models.users_model import User
from app.services.course_service import CoursesService

router = APIRouter()


def success_response(data, message: str = "OK"):
    return {"success": True, "message": message, "data": data}


def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Chặn nếu user đã đăng nhập nhưng không có role admin."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "success": False,
                "message": "Bạn không có quyền truy cập chức năng quản trị.",
                "errorCode": "FORBIDDEN_ADMIN_ONLY",
                "details": None,
            },
        )
    return current_user


class CourseCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    slug: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    level: CourseLevel = CourseLevel.beginner
    price: float = 0
    status: ContentStatus = ContentStatus.draft


class CourseUpdateRequest(BaseModel):
    # Tất cả optional — chỉ gửi field nào muốn đổi (đúng kiểu PATCH)
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    level: Optional[CourseLevel] = None
    price: Optional[float] = None
    status: Optional[ContentStatus] = None


# Frontend (course.service.ts) gọi tới "/admin/courses/" — không phân trang, trả thẳng mảng.
# Giữ đúng 2 route (có "/" và không "/") giống style courses.py cũ, tránh lỗi redirect với POST.
@router.get("", status_code=status.HTTP_200_OK, include_in_schema=False)
def list_courses_admin_no_slash(
    keyword: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    return success_response(CoursesService.get_all_courses_admin(db=db, keyword=keyword))


@router.get("/", status_code=status.HTTP_200_OK)
def list_courses_admin(
    keyword: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    return success_response(CoursesService.get_all_courses_admin(db=db, keyword=keyword))


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_course_admin(
    payload: CourseCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    course = CoursesService.create_course(db, payload, created_by=int(current_user.id))
    return success_response(CoursesService.serialize_course_admin_item(course), "Đã tạo khóa học.")


@router.patch("/{course_id}", status_code=status.HTTP_200_OK)
def update_course_admin(
    course_id: str,
    payload: CourseUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    course = CoursesService.update_course(db, course_id, payload)
    return success_response(CoursesService.serialize_course_admin_item(course), "Đã cập nhật khóa học.")


@router.delete("/{course_id}", status_code=status.HTTP_200_OK)
def delete_course_admin(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    CoursesService.delete_course(db, course_id)
    return success_response({"message": "Đã xóa khóa học."}, "Đã xóa khóa học.")