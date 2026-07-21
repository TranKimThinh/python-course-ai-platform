# backend/app/api/v1/users.py
from fastapi import APIRouter, status, Query, Depends, HTTPException
from app.services.user_service import UserService
from app.schemas.user import UserUpdateInput, UserUpdatePassword
from app.models.users_model import User
from app.utils.response import success_response


from app.core.database import get_db

router = APIRouter()

@router.get("/me")
def get_current_user_profile(current_user: User = Depends(UserService.get_current_user)):
    return success_response(current_user)
    
@router.get("/total_users")
def get_total_users(db = Depends(get_db)):
    total_users = UserService.get_total_users(db = db)
    return success_response(total_users)

# vd: GET: /api/v1/users?name=qhuy
@router.get("")
def get_user_by_name(name: str = Query(None), db = Depends(get_db)):
    user_list = UserService.get_user_by_name(name = name, db = db)
    safe_user_list = [UserService.serialize_user(user) for user in user_list]
    return {
        "success": True,
        "count": len(safe_user_list),
        "user_list": safe_user_list
    }

# vd: GET: /api/v1/users/1
@router.get("/{id}")
def get_user_by_id(id: int, db = Depends(get_db)):
    return success_response(UserService.get_user_by_id(id = id, db = db))

# vd: PATCH: /api/v1/users/1
@router.patch("/{id}")
def update_user_by_id(
    id: int, 
    user_input: UserUpdateInput, 
    current_user: User = Depends(UserService.get_current_user), 
    db = Depends(get_db)
):
    if current_user.role.value != "admin" and current_user.id != id:
        raise HTTPException(
            status_code=403, 
            detail="Bạn không có quyền sửa thông tin của người khác!"
        )

    updated_user = UserService.update_user(id=id, user_input=user_input, db=db)
    
    return success_response(updated_user, "cập nhật thông tin thành công!")

# vd: PATCH: /api/v1/users/1/password
@router.patch("/{id}/password")
def update_user_password(
    id: int, 
    user_password: UserUpdatePassword, 
    current_user: User = Depends(UserService.get_current_user), 
    db = Depends(get_db)
):
    if current_user.role.value != "admin" and current_user.id != id:
        raise HTTPException(
            status_code=403, 
            detail="Bạn không có quyền sửa thông tin của người khác!"
        )
    user = UserService.update_user_password(id=id, user_password=user_password, db=db)
    return success_response(user, "cập nhật mật khẩu thành công!!")  

    
