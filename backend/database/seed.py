# backend/database/seed.py
import os
from sqlalchemy import text
from app.core.database import SessionLocal

def run_seed():
    file_path = os.path.join(os.path.dirname(__file__), "seed_data.sql")
    
    if not os.path.exists(file_path):
        print(f"❌ Không tìm thấy file tại: {file_path}")
        return

    print("⏳ Đang đọc file seed_data.sql...")
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # --- THUẬT TOÁN TỐI ƯU: Loại bỏ sạch comment dòng trước khi gộp chuỗi ---
    clean_lines = []
    for line in lines:
        stripped_line = line.strip()
        # Bỏ qua các dòng trống hoặc các dòng bắt đầu bằng comment dòng của SQL
        if not stripped_line or stripped_line.startswith("--") or stripped_line.startswith("#"):
            continue
        # Nếu dòng có comment ở cuối (ví dụ: INSERT INTO ... -- comment), cắt bỏ phần đuôi comment đi
        if "--" in line:
            line = line.split("--")[0]
        clean_lines.append(line)
    
    # Gộp lại thành một script sạch bóng comment bẫy
    full_sql_script = "".join(clean_lines)

    # Tách các câu lệnh thực sự bằng dấu chấm phẩy
    raw_commands = full_sql_script.split(";")
    
    db = SessionLocal()
    try:
        print("🚀 Đang vô hiệu hóa kiểm tra khóa ngoại trên MySQL...")
        db.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
        
        print("📦 Bắt đầu nạp dữ liệu từng bảng...")
        count = 0
        for command in raw_commands:
            command = command.strip()
            if not command:
                continue
                
            db.execute(text(command))
            count += 1

        print("🔑 Đang kích hoạt lại kiểm tra khóa ngoại...")
        db.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
        
        print("💾 Đang thực hiện COMMIT giao dịch xuống Database...")
        db.commit()
        
        # --- ĐOẠN KIỂM TRA QUYẾT ĐỊNH ---
        print("\n🔍 [KIỂM TRA NGAY SAU COMMIT] Đang đọc trực tiếp dữ liệu từ MySQL...")
        check_query = db.execute(text("SELECT COUNT(*) FROM users;")).fetchone()
        print(f"📊 Số lượng bản ghi tìm thấy trong bảng 'users': {check_query[0]}")
        # ---------------------------------
        
        if check_query[0] > 0:
            print(f"✅ THÀNH CÔNG RỰC RỠ: Đã thực thi {count} câu lệnh SQL thực tế và ghi nhận dữ liệu!")
        else:
            print("⚠️ CẢNH BÁO: Lệnh chạy thành công nhưng dữ liệu vẫn bằng 0. Kiểm tra lại nội dung file SQL.")
            
    except Exception as e:
        db.rollback()
        print("\n" + "!"*50)
        print(f"❌ THAO TÁC THẤT BẠI: {e}")
        print("!"*50 + "\n")
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()