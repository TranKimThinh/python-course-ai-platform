from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.users_model import User
from app.services.progress_service import ProgressService

router = APIRouter()


def success_response(data, message: str = "OK"):
    return {
        "success": True,
        "message": message,
        "data": data,
    }


@router.get("/progress", status_code=status.HTTP_200_OK)
def get_my_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return success_response(ProgressService.get_my_progress(db, current_user))
