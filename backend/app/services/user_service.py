<<<<<<< HEAD
from fastapi import Header, status, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.users_model import User
from app.services.auth_service import AuthService
from app.schemas.user import UserUpdateInput, UserUpdatePassword

from jose import jwt, JWTError
import os
from app.core.database import get_db
from sqlalchemy import or_

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")

class UserService:
    
    @staticmethod
    def serialize_user(user: User):
        if not user:
            return None
        return {
            "id": int(user.id),
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone,
            "avatar_url": user.avatar_url,
            "role": user.role.value if hasattr(user.role, 'value') else user.role,
            "status": user.status.value if hasattr(user.status, 'value') else user.status,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }
    
    @staticmethod
    def verify_current_user(token: str, db: Session):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            
            if not user_id:
                return None
            user = db.query(User).filter(User.id == int(user_id)).first()
            return user
            
        except JWTError:
            return None
    
    @staticmethod
    def get_total_users(db: Session) : 
        return db.query(User).count()
    
    @staticmethod
    def get_user_by_name(name: str, db: Session) : 
        if not name: 
            return []
        search_keyword = f"%{name}%"    
        users = db.query(User).filter(
            or_(
                # .ilike ko phân biệt chữ hoa-thường (.like thì có)
                User.username.ilike(search_keyword),
                User.full_name.ilike(search_keyword)
            )
        ).all()
        return users
    
    @staticmethod
    def get_user_by_id(id: int, db: Session) : 
        user = db.query(User).filter(User.id == id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy người dùng có id: {id}"
            )
        return user
    
    @staticmethod
    def get_current_user(
        authorization: str = Header(...), # Bắt buộc phải có Header Authorization
        db: Session = Depends(get_db)      
    ) -> User:
        
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Header Authorization phải có định dạng 'Bearer <token>'"
            )
        
        token = authorization.split(" ")[1]
        
        user = UserService.verify_current_user(token, db)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token không hợp lệ hoặc người dùng không tồn tại"
            )
            
        return user
    
    @staticmethod
    def update_user(id: int, user_input: UserUpdateInput, db: Session):
        user = UserService.get_user_by_id(id=id, db=db)
        update_data = user_input.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def update_user_password(id: int, user_password: UserUpdatePassword, db: Session):
        user = UserService.get_user_by_id(id=id, db=db)
        # tự quăng raise 404 nếu k tìm thấy!
        
        old_password = user_password.old_password
        new_password = user_password.new_password
        if (old_password == new_password):
            raise HTTPException(status_code=400, detail="Yêu cầu mật khẩu khác!")

        if(AuthService.verify_password(old_password, user.password_hash)):
            new_valid_password = AuthService.hash_password(new_password)
            user.password_hash = new_valid_password 
            db.commit()
            db.refresh(user)
            
            return user
        else:
            raise HTTPException(status_code=400, detail="Mật khẩu cũ không chính xác!")
            
        

        
    
    
=======
from fastapi import Header, status, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.users_model import User
from app.services.auth_service import AuthService
from app.schemas.user import UserUpdateInput, UserUpdatePassword

from jose import jwt, JWTError
import os
from app.core.database import get_db
from sqlalchemy import or_

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")

class UserService:
    
    @staticmethod
    def serialize_user(user: User):
        if not user:
            return None
        return {
            "id": int(user.id),
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone,
            "avatar_url": user.avatar_url,
            "role": user.role.value if hasattr(user.role, 'value') else user.role,
            "status": user.status.value if hasattr(user.status, 'value') else user.status,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }
    
    @staticmethod
    def verify_current_user(token: str, db: Session):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            
            if not user_id:
                return None
            user = db.query(User).filter(User.id == int(user_id)).first()
            return user
            
        except JWTError:
            return None
    
    @staticmethod
    def get_total_users(db: Session) : 
        return db.query(User).count()
    
    @staticmethod
    def get_user_by_name(name: str, db: Session) : 
        if not name: 
            return []
        search_keyword = f"%{name}%"    
        users = db.query(User).filter(
            or_(
                # .ilike ko phân biệt chữ hoa-thường (.like thì có)
                User.username.ilike(search_keyword),
                User.full_name.ilike(search_keyword)
            )
        ).all()
        return users
    
    @staticmethod
    def get_user_by_id(id: int, db: Session) : 
        user = db.query(User).filter(User.id == id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy người dùng có id: {id}"
            )
        return user
    
    @staticmethod
    def get_current_user(
        authorization: str = Header(...), # Bắt buộc phải có Header Authorization
        db: Session = Depends(get_db)      
    ) -> User:
        
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Header Authorization phải có định dạng 'Bearer <token>'"
            )
        
        token = authorization.split(" ")[1]
        
        user = UserService.verify_current_user(token, db)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token không hợp lệ hoặc người dùng không tồn tại"
            )
            
        return user
    
    @staticmethod
    def update_user(id: int, user_input: UserUpdateInput, db: Session):
        user = UserService.get_user_by_id(id=id, db=db)
        update_data = user_input.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def update_user_password(id: int, user_password: UserUpdatePassword, db: Session):
        user = UserService.get_user_by_id(id=id, db=db)
        # tự quăng raise 404 nếu k tìm thấy!
        
        old_password = user_password.old_password
        new_password = user_password.new_password
        if (old_password == new_password):
            raise HTTPException(status_code=400, detail="Yêu cầu mật khẩu khác!")

        if(AuthService.verify_password(old_password, user.password_hash)):
            new_valid_password = AuthService.hash_password(new_password)
            user.password_hash = new_valid_password 
            db.commit()
            db.refresh(user)
            
            return user
        else:
            raise HTTPException(status_code=400, detail="Mật khẩu cũ không chính xác!")
            
        

        
    
    
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
    