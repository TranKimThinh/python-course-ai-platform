from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.database import get_db
from app.models.users_model import User
from app.services.admin_student_service import AdminStudentService

router = APIRouter()


class StudentStatusInput(BaseModel):
    status: str


def success_response(data, message: str = "OK"):
    return {"success": True, "message": message, "data": data}


@router.get("", status_code=status.HTTP_200_OK)
def list_students(
    keyword: str | None = Query(default=None),
    student_status: str | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, alias="pageSize", ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return success_response(AdminStudentService.list_students(db, keyword, student_status, page, page_size))


@router.get("/{student_id}", status_code=status.HTTP_200_OK)
def get_student(student_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    student = AdminStudentService.get_student(db, student_id)
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khong tim thay hoc vien.")
    return success_response(student)


@router.get("/{student_id}/progress", status_code=status.HTTP_200_OK)
def get_student_progress(student_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    progress = AdminStudentService.get_progress(db, student_id)
    if not progress:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khong tim thay hoc vien.")
    return success_response(progress)


@router.patch("/{student_id}/status", status_code=status.HTTP_200_OK)
def update_student_status(student_id: int, payload: StudentStatusInput, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    if payload.status not in {"active", "blocked", "inactive"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Trang thai khong hop le.")
    student = AdminStudentService.update_status(db, student_id, payload.status)
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khong tim thay hoc vien.")
    return success_response(student, "Cap nhat trang thai hoc vien thanh cong.")
