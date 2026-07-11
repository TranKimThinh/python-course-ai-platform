<<<<<<< HEAD
# backend/app/core/database.py
# ---------------------------------
# | test database connection:      |
# |  1. cd backend                 |
# |  2. python -m app.core.database|
# ---------------------------------

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Tải cấu hình từ file .env nằm ở thư mục backend/
load_dotenv()

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "python_ai_learning_db")

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"

# Khởi tạo Engine và cấu hình Session
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Hàm Dependency dùng cho tầng Router FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CHỈ CHẠY ĐỂ KIỂM TRA KẾT NỐI:
if __name__ == "__main__":
    print("[INFO] Dang kiem tra ket noi va truy van du lieu tu Model...")
    try:
        # ĐƯỢC PHÉP IMPORT Ở ĐÂY: Tránh hoàn toàn lỗi Circular Import
        from app.models.courses_model import Course, ContentStatus
        from app.models.users_model import User
        
        db = SessionLocal()
        
        print("\n--- TEST 1: Lay danh sach khoa hoc tu bang 'courses' ---")
        # Chạy lệnh ORM lấy tất cả khóa học đang được public
        active_courses = db.query(Course).filter(Course.status == ContentStatus.published).all()
        
        if active_courses:
            print(f"[SUCCESS] Tim thay {len(active_courses)} khoa hoc trong MySQL:")
            for course in active_courses:
                print(f" - ID: {course.id} | Ten: {course.title} | Cap do: {course.level.value if hasattr(course.level, 'value') else course.level}")
        else:
            print("[WARNING] Ket noi DB on dinh nhung bang 'courses' dang trong (chua chay file seed_data.sql).")

        print("\n--- TEST 2: Lay thong tin tai khoan admin tu bang 'users' ---")
        admin_user = db.query(User).filter(User.username == "admin_system").first()
        if admin_user:
            print(f"[SUCCESS] Tim thay tai khoan Admin: {admin_user.full_name} ({admin_user.email})")
        else:
            print("[WARNING] Khong tim thay tai khoan 'admin_system' trong bang 'users'.")
            
        db.close()
        print("\n" + "="*50)
        print("[SUCCESS] TOAN BO HE THONG MODEL VA DATABASE DA THONG SUOT TRON TRU!")
        print("="*50 + "\n")
        
    except Exception as e:
        print("\n" + "!"*50)
        print("[ERROR] LOI TRUY VAN MODEL HOAC KET NOI!")
        print(f"Chi tiet: {e}")
=======
# backend/app/core/database.py
# ---------------------------------
# | test database connection:      |
# |  1. cd backend                 |
# |  2. python -m app.core.database|
# ---------------------------------

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Tải cấu hình từ file .env nằm ở thư mục backend/
load_dotenv()

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "python_ai_learning_db")

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"

# Khởi tạo Engine và cấu hình Session
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Hàm Dependency dùng cho tầng Router FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CHỈ CHẠY ĐỂ KIỂM TRA KẾT NỐI:
if __name__ == "__main__":
    print("[INFO] Dang kiem tra ket noi va truy van du lieu tu Model...")
    try:
        # ĐƯỢC PHÉP IMPORT Ở ĐÂY: Tránh hoàn toàn lỗi Circular Import
        from app.models.courses_model import Course, ContentStatus
        from app.models.users_model import User
        
        db = SessionLocal()
        
        print("\n--- TEST 1: Lay danh sach khoa hoc tu bang 'courses' ---")
        # Chạy lệnh ORM lấy tất cả khóa học đang được public
        active_courses = db.query(Course).filter(Course.status == ContentStatus.published).all()
        
        if active_courses:
            print(f"[SUCCESS] Tim thay {len(active_courses)} khoa hoc trong MySQL:")
            for course in active_courses:
                print(f" - ID: {course.id} | Ten: {course.title} | Cap do: {course.level.value if hasattr(course.level, 'value') else course.level}")
        else:
            print("[WARNING] Ket noi DB on dinh nhung bang 'courses' dang trong (chua chay file seed_data.sql).")

        print("\n--- TEST 2: Lay thong tin tai khoan admin tu bang 'users' ---")
        admin_user = db.query(User).filter(User.username == "admin_system").first()
        if admin_user:
            print(f"[SUCCESS] Tim thay tai khoan Admin: {admin_user.full_name} ({admin_user.email})")
        else:
            print("[WARNING] Khong tim thay tai khoan 'admin_system' trong bang 'users'.")
            
        db.close()
        print("\n" + "="*50)
        print("[SUCCESS] TOAN BO HE THONG MODEL VA DATABASE DA THONG SUOT TRON TRU!")
        print("="*50 + "\n")
        
    except Exception as e:
        print("\n" + "!"*50)
        print("[ERROR] LOI TRUY VAN MODEL HOAC KET NOI!")
        print(f"Chi tiet: {e}")
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
        print("!"*50 + "\n")
