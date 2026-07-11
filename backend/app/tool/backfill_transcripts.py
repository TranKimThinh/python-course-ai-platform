import sys
import os
import time
from pathlib import Path

# Lấy đường dẫn lùi lại 2 cấp thư mục (từ app/tool/ lùi ra backend/)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))

# Load biến môi trường (nếu bạn dùng file .env)
from dotenv import load_dotenv
load_dotenv()

from app.core.database import SessionLocal
from app.models.courses_model import LessonVideo
from app.models.ai_pipeline_model import LessonTranscript
from app.services.transcript_service import TranscriptService

def run_backfill():
    db = SessionLocal()
    try:
        # 1. Lấy tất cả video hiện có
        videos = db.query(LessonVideo).all()
        print(f"[*] Tìm thấy tổng cộng {len(videos)} video trong database.")

        # 2. Lấy danh sách lesson_id đã có transcript (để bỏ qua, không chạy lại)
        # Chỉ lấy những bản ghi chưa bị lỗi
        existing_transcripts = db.query(LessonTranscript.lesson_id).filter(
            LessonTranscript.status.in_(['completed', 'processing'])
        ).all()
        
        # Chuyển thành set để tìm kiếm nhanh hơn
        processed_lesson_ids = {t[0] for t in existing_transcripts}

        # 3. Lọc ra những lesson_id chưa được xử lý
        # Dùng set để loại bỏ trùng lặp (trường hợp 1 bài học có 2 video)
        lessons_to_process = list(set([
            v.lesson_id for v in videos if v.lesson_id not in processed_lesson_ids
        ]))

        print(f"[*] Có {len(lessons_to_process)} video/bài học CẦN TẠO transcript.")
        
        if not lessons_to_process:
            print("[*] Mọi thứ đã hoàn tất, không cần chạy gì thêm!")
            return

        # 4. Tiến hành chạy vòng lặp qua từng bài học
        for index, lesson_id in enumerate(lessons_to_process):
            print(f"\n[{index + 1}/{len(lessons_to_process)}] Đang xử lý lesson_id: {lesson_id}...")
            
            try:
                # Gọi trực tiếp hàm xử lý ngầm (đã bao gồm luồng lưu vào DB)
                print('check lesson_id: ', lesson_id)
                TranscriptService.generate_transcript_task(lesson_id)
                print(f" => [THÀNH CÔNG] Đã lưu transcript cho lesson_id {lesson_id}.")
            except Exception as e:
                print(f" => [LỖI] Xảy ra lỗi ở lesson_id {lesson_id}: {e}")
            
            # Tạm nghỉ 2 giây giữa mỗi video để tránh quá tải CPU (nếu dùng Local Whisper)
            # hoặc tránh Rate Limit (nếu dùng Gemini/OpenAI API)
            time.sleep(2)

    except Exception as e:
        print(f"[CRITICAL ERROR] Không thể thực thi script: {e}")
    finally:
        db.close()
        print("\n[*] ĐÃ HOÀN TẤT QUÁ TRÌNH BACKFILL.")

if __name__ == "__main__":
    # Yêu cầu xác nhận trước khi chạy để tránh bấm nhầm
    confirm = input("Bạn có chắc chắn muốn chạy tool tạo Transcript cho các video cũ không? (y/n): ")
    if confirm.lower() == 'y':
        run_backfill()
    else:
        print("Đã hủy.")