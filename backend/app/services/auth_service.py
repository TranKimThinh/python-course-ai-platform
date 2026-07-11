# backend/app/services/auth_service.py
import os
import uuid
from dotenv import load_dotenv
load_dotenv()
from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
from sqlalchemy.orm import Session
from app.models.users_model import User, UserRole
from google.oauth2 import id_token
from google.auth.transport import requests

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440)) # Mặc định 1 ngày

GOOGLE_CLIENT_ID = os.getenv("CLIENT_ID")

class AuthService:
    
    @staticmethod
    def hash_password(password: str) -> str:
        print(f"🧨 BẮT BUG - Password từ Schema: '{password}'")
        """Mã hóa mật khẩu thô thành chuỗi hash an toàn để lưu vào DB"""
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, password_hash: str) -> bool:
        if not plain_password:
            return False
        safe_password = plain_password[:72]
        if not password_hash or not isinstance(password_hash, str):
            return False
            
        try:
            return pwd_context.verify(safe_password, password_hash)
        except Exception as e:
            print(f"❌ Lỗi verify chi tiết: {e}")
            return False
        
    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
        """Tạo chuỗi JWT Access Token chứa thông tin định danh định kỳ"""
        to_encode = data.copy()
        
        # Thiết lập thời gian hết hạn cho Token
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def register_user(user_data, db: Session) -> User:
        """Xử lý logic đăng ký tài khoản mới (user_data nhận vào từ Pydantic Schema)"""
        existing_user = db.query(User).filter(
            (User.email == user_data.email) 
        ).first()
        
        if existing_user:
            return None # Trả về None để tầng Route biết và bốc lỗi HTTPException phù hợp

        hashed_pwd = AuthService.hash_password(user_data.password)
        
        new_user = User(
            username = user_data.username,
            email = user_data.email,
            password_hash = hashed_pwd,
            full_name = user_data.full_name or "",
            role = UserRole.student 
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def authenticate_user(username, password, db: Session) -> dict | None:
        """Xử lý logic xác thực đăng nhập và trả về token cùng thông tin cơ bản"""
        user = db.query(User).filter((User.username == username) | (User.email == username)).first()
        if not user:
            return None   
        if not AuthService.verify_password(password, user.password_hash):
            return None
            
        token_data = {
            "sub": str(user.id),
            "username": user.username,
            "role": user.role.value 
        }
        
        access_token = AuthService.create_access_token(data=token_data)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
        
    @staticmethod
    def google_login(login_input, db: Session):
        # Xác thực token
        idinfo = id_token.verify_oauth2_token(
            login_input.id_token_str, requests.Request(), GOOGLE_CLIENT_ID
        )

        email = idinfo['email']
        name = idinfo.get('name', '')
        
        # tạo mk giả, vì login = gg ko cần mk
        random_password = str(uuid.uuid4())
        dummy_password_hash = AuthService.hash_password(random_password)
        
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                email=email, 
                username=email,
                password_hash = dummy_password_hash,
                full_name=name, 
                role=UserRole.student
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        token_data = {"sub": str(user.id), "username": user.username, "role": user.role.value}
        access_token = AuthService.create_access_token(data=token_data)
        
        # Chỉ trả về dữ liệu cần thiết, không cần bọc status ở đây
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
