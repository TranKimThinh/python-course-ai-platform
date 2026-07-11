from pydantic import BaseModel, EmailStr
from typing import Optional

class UserUpdateInput(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
 
class UserUpdatePassword(BaseModel):
    old_password:  str 
    new_password:  str