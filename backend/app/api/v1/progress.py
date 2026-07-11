from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
<<<<<<< HEAD
from app.utils.response import success_response
=======
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
from app.models.users_model import User
from app.services.progress_service import ProgressService

router = APIRouter()

<<<<<<< HEAD
=======

def success_response(data, message: str = "OK"):
    return {
        "success": True,
        "message": message,
        "data": data,
    }


>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
@router.get("/progress", status_code=status.HTTP_200_OK)
def get_my_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return success_response(ProgressService.get_my_progress(db, current_user))
