import os
import sys
from sqlalchemy import text

# Thêm thư mục backend vào sys.path để có thể import được app.core.database
# D:\Ikigai\python-course-ai-platform\backend
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(base_dir)

try:
    from app.core.database import engine
except ImportError as e:
    print(f"Lỗi import: Không tìm thấy database engine. Hãy kiểm tra lại đường dẫn. Chi tiết: {e}")
    sys.exit(1)

def run_schema():
    schema_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'schema.sql')
    
    if not os.path.exists(schema_path):
        print(f"Lỗi: Không tìm thấy file {schema_path}")
        return

    print("Đang đọc file schema.sql...")
    with open(schema_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    # Tách các câu lệnh SQL dựa trên dấu chấm phẩy
    # Lưu ý: Cách này hoạt động tốt với các DDL đơn giản, 
    # nếu có các câu lệnh phức tạp chứa dấu ; trong nội dung thì cần xử lý kỹ hơn.
    statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]

    print(f"Tìm thấy {len(statements)} câu lệnh SQL. Đang thực thi...")

    try:
        with engine.begin() as connection:
            for i, stmt in enumerate(statements, 1):
                try:
                    # Bỏ qua dòng USE database nếu không cần thiết, 
                    # vì engine thường đã trỏ vào db rồi
                    if stmt.upper().startswith("USE "):
                        continue
                        
                    connection.execute(text(stmt))
                    print(f"[{i}/{len(statements)}] Thành công.")
                except Exception as e:
                    print(f"[{i}/{len(statements)}] Lỗi tại câu lệnh: {stmt[:50]}...")
                    print(f"Chi tiết lỗi: {e}")
                    # Bạn có thể quyết định raise e hoặc tiếp tục
        print("Hoàn tất thiết lập database!")
    except Exception as e:
        print(f"Lỗi kết nối hoặc thực thi transaction: {e}")

if __name__ == "__main__":
    confirm = input("Bạn có chắc chắn muốn chạy script khởi tạo database (xóa và tạo lại bảng)? (y/n): ")
    if confirm.lower() == 'y':
        run_schema()
    else:
        print("Đã hủy.")