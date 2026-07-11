<<<<<<< HEAD
# backend/app/schemas/auth.py
from pydantic import BaseModel, EmailStr
from typing import Optional

# bắt buộc json gửi về BE phải đủ 5 thành phần, để trống cx đc!
class UserRegisterInput(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str
    role: Optional[str] = "student"

class UserLoginInput(BaseModel):
    username: str
    password: str
    
class GoogleLoginInput(BaseModel):
    id_token_str: str
    
=======
# backend/app/schemas/auth.py
from pydantic import BaseModel, EmailStr
from typing import Optional

# bắt buộc json gửi về BE phải đủ 5 thành phần, để trống cx đc!
class UserRegisterInput(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str
    role: Optional[str] = "student"

class UserLoginInput(BaseModel):
    username: str
    password: str
    
class GoogleLoginInput(BaseModel):
    id_token_str: str
    
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
