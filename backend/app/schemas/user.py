<<<<<<< HEAD
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserUpdateInput(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
 
class UserUpdatePassword(BaseModel):
    old_password:  str 
=======
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserUpdateInput(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
 
class UserUpdatePassword(BaseModel):
    old_password:  str 
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
    new_password:  str