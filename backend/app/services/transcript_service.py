import os
from pathlib import Path

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from google import genai

from app.core.database import SessionLocal
from app.models.ai_pipeline_model import LessonTranscript
from app.models.courses_model import Lesson, LessonVideo
from app.services.audio_service import AudioService, TEMP_STORAGE_DIR


class SpeechToTextProvider:
    """
    Lớp cơ sở (Interface) đại diện cho một bộ cung cấp dịch vụ Chuyển đổi giọng nói thành văn bản.
    Mọi nhà cung cấp dịch vụ mới (như Gemini, Whisper,...) đều phải kế thừa từ lớp này.
    """
    name = "base"

    def transcribe(self, audio_path: str, language: str = "vi") -> str:
        """
        Hàm trừu tượng để thực hiện việc chuyển đổi file âm thanh thành văn bản.
        Các lớp con bắt buộc phải viết đè (override) lại hàm này.
        
        Args:
            audio_path (str): Đường dẫn tới file âm thanh cần chuyển đổi.
            language (str): Mã ngôn ngữ của file âm thanh (mặc định là "vi").
            
        Returns:
            str: Văn bản kết quả sau khi chuyển đổi.
        """
        raise NotImplementedError


class LocalWhisperProvider(SpeechToTextProvider):
    """
    Bộ cung cấp dịch vụ chuyển đổi giọng nói thành văn bản sử dụng thư viện `faster-whisper`
    chạy trực tiếp trên hạ tầng máy chủ cục bộ (Local CPU/GPU).
    """
    name = "local_whisper"
    _models = {}  # Bộ nhớ đệm (Cache) để lưu trữ các model đã tải lên RAM

    def transcribe(self, audio_path: str, language: str = "vi") -> str:
        """
        Thực hiện nhận diện và chuyển đổi file âm thanh cục bộ thành văn bản bằng Faster-Whisper.
        
        Args:
            audio_path (str): Đường dẫn tới file âm thanh cần xử lý (ví dụ: file .wav).
            language (str): Mã ngôn ngữ đích cần nhận diện (mặc định là "vi").
            
        Returns:
            str: Toàn bộ văn bản đã được chuyển đổi và nối lại với nhau.
            
        Raises:
            RuntimeError: Nếu chưa cài đặt thư viện faster-whisper hoặc AI không trả về kết quả.
        """
        try:
            from faster_whisper import WhisperModel
        except ImportError as exc:
            raise RuntimeError("Chua cai faster-whisper. Cai package hoac doi TRANSCRIPT_PROVIDER=gemini.") from exc

        model_name = os.getenv("WHISPER_MODEL", "small")
        device = os.getenv("WHISPER_DEVICE", "cpu")
        compute_type = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
        model_key = (model_name, device, compute_type)
        
        if model_key not in LocalWhisperProvider._models:
            LocalWhisperProvider._models[model_key] = WhisperModel(model_name, device=device, compute_type=compute_type)
        model = LocalWhisperProvider._models[model_key]
        
        segments, _ = model.transcribe(audio_path, language=language)
        text = " ".join(segment.text.strip() for segment in segments if segment.text and segment.text.strip())
        if not text:
            raise RuntimeError("Whisper không trả về nội dung transcript.")
        return text


class GeminiTranscriptProvider(SpeechToTextProvider):
    """
    Bộ cung cấp dịch vụ chuyển đổi giọng nói thành văn bản thông qua Google Gemini API.
    Tận dụng SDK genai mới nhất của Google để tải file lên và yêu cầu trích xuất văn bản.
    """
    name = "gemini"

    def transcribe(self, audio_path: str, language: str = "vi") -> str:
        """
        Tải file âm thanh lên Google Cloud và yêu cầu Gemini chuyển thành văn bản.
        
        Args:
            audio_path (str): Đường dẫn tới file âm thanh cục bộ cần xử lý.
            language (str): Mã ngôn ngữ đích (dùng để tối ưu prompt cho Gemini).
            
        Returns:
            str: Nội dung văn bản được nhận diện từ âm thanh.
            
        Raises:
            RuntimeError: Nếu thiếu API Key hoặc Gemini không trả về kết quả hợp lệ.
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("Thieu GEMINI_API_KEY trong bien moi truong.")

        client = genai.Client(api_key=api_key)
<<<<<<< HEAD
        model_name = os.getenv("GEMINI_TRANSCRIBE_MODEL", "gemini-3.5-flash")
=======
        model_name = os.getenv("GEMINI_TRANSCRIBE_MODEL", "gemini-1.5-flash")
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
        uploaded_file = None
        
        try:
            uploaded_file = client.files.upload(file=audio_path)
<<<<<<< HEAD
            print('check file: ', audio_path)
=======
>>>>>>> 933f572f3b4d331d9f809383fdf702f376f02284
            
            prompt = "Transcribe this audio exactly as spoken. Do not translate. Do not add any comments."
            if language == "vi":
                prompt = "Hãy chuyển đổi âm thanh này thành văn bản tiếng Việt một cách chính xác nhất. Tuyệt đối chỉ trả về nội dung gốc được nói trong file, không thêm bất kỳ bình luận, định dạng hay lời chào nào khác."

            response = client.models.generate_content(
                model=model_name,
                contents=[uploaded_file, prompt]
            )

            text = response.text
            if not text or not text.strip():
                raise RuntimeError("Gemini khong tra ve noi dung transcript.")
            
            return text.strip()
        finally:
            if uploaded_file:
                try:
                    client.files.delete(name=uploaded_file.name)
                except Exception:
                    pass


class TranscriptService:
    """
    Lớp dịch vụ trung tâm (Service Layer) quản lý toàn bộ vòng đời của việc tạo phụ đề.
    Bao gồm tương tác với Database, điều phối xử lý âm thanh và gọi các Provider AI.
    """

    @staticmethod
    def get_provider() -> SpeechToTextProvider:
        """
        Factory Method: Quyết định sử dụng bộ cung cấp AI nào dựa trên cấu hình môi trường.
        
        Returns:
            SpeechToTextProvider: Đối tượng khởi tạo của Gemini hoặc Local Whisper.
            
        Raises:
            ValueError: Nếu tên cấu hình không được hệ thống hỗ trợ.
        """
        provider = os.getenv("TRANSCRIPT_PROVIDER", "local_whisper").lower()
        if provider == "gemini":
            return GeminiTranscriptProvider()
        if provider == "local_whisper":
            return LocalWhisperProvider()
        raise ValueError(f"TRANSCRIPT_PROVIDER không được hỗ trợ: {provider}")

    @staticmethod
    def get_transcript(db: Session, lesson_id: int) -> LessonTranscript | None:
        """
        Truy vấn bản ghi phụ đề (Transcript) mới nhất của một bài học từ Database.
        
        Args:
            db (Session): Phiên kết nối CSDL hiện tại.
            lesson_id (int): ID của bài học cần lấy phụ đề.
            
        Returns:
            LessonTranscript | None: Bản ghi phụ đề nếu có, ngược lại trả về None.
        """
        return (
            db.query(LessonTranscript)
            .filter(LessonTranscript.lesson_id == lesson_id)
            .order_by(LessonTranscript.created_at.desc(), LessonTranscript.id.desc())
            .first()
        )

    @staticmethod
    def get_transcript_response(db: Session, lesson_id: int) -> dict:
        """
        Lấy thông tin phụ đề và định dạng thành JSON chuẩn để trả về cho Client.
        
        Args:
            db (Session): Phiên kết nối CSDL hiện tại.
            lesson_id (int): ID của bài học.
            
        Returns:
            dict: Dữ liệu phụ đề đã được chuẩn hóa.
            
        Raises:
            HTTPException: Báo lỗi 404 nếu bài học không tồn tại.
        """
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bài học.")

        transcript = TranscriptService.get_transcript(db, lesson_id)
        return TranscriptService.serialize_transcript(transcript, lesson_id)

    @staticmethod
    def mark_processing(db: Session, lesson_id: int, language: str = "vi", force: bool = False) -> LessonTranscript:
        """
        Cập nhật trạng thái phụ đề của bài học thành "processing" (đang xử lý).
        
        Args:
            db (Session): Phiên kết nối CSDL hiện tại.
            lesson_id (int): ID của bài học.
            language (str): Ngôn ngữ dự kiến.
            force (bool): Nếu True, bỏ qua trạng thái completed cũ và tạo tiến trình mới.
            
        Returns:
            LessonTranscript: Bản ghi phụ đề đang ở trạng thái xử lý.
        """
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bài học.")

        transcript = TranscriptService.get_transcript(db, lesson_id)
        if transcript and transcript.status == "completed" and not force:
            return transcript

        if not transcript:
            transcript = LessonTranscript(lesson_id=lesson_id, transcript_text="", language=language)
            db.add(transcript)

        transcript.status = "processing"
        transcript.language = language
        transcript.error_message = None
        db.flush()
        return transcript

    @staticmethod
    def save_transcript(db: Session, lesson_id: int, transcript_text: str, language: str = "vi", generated_by: str = "whisper") -> LessonTranscript:
        """
        Lưu văn bản kết quả sau khi AI xử lý thành công vào Database (chuyển status thành completed).
        
        Args:
            db (Session): Phiên kết nối CSDL hiện tại.
            lesson_id (int): ID của bài học.
            transcript_text (str): Nội dung văn bản mà AI trả về.
            language (str): Ngôn ngữ đã được xử lý.
            generated_by (str): Tên của bộ AI đã thực hiện việc chuyển đổi (VD: "gemini").
            
        Returns:
            LessonTranscript: Bản ghi phụ đề đã hoàn tất.
        """
        transcript = TranscriptService.get_transcript(db, lesson_id)
        if not transcript:
            transcript = LessonTranscript(lesson_id=lesson_id)
            db.add(transcript)

        transcript.transcript_text = transcript_text
        transcript.language = language
        transcript.generated_by = generated_by
        transcript.status = "completed"
        transcript.error_message = None
        db.flush()
        return transcript

    @staticmethod
    def mark_failed(db: Session, lesson_id: int, error: Exception | str, language: str = "vi") -> LessonTranscript:
        """
        Đánh dấu trạng thái phụ đề là bị lỗi ("failed") và lưu thông báo lỗi vào hệ thống.
        
        Args:
            db (Session): Phiên kết nối CSDL hiện tại.
            lesson_id (int): ID của bài học gặp lỗi.
            error (Exception | str): Đối tượng lỗi hoặc thông điệp lỗi.
            language (str): Ngôn ngữ của luồng xử lý bị lỗi.
            
        Returns:
            LessonTranscript: Bản ghi phụ đề chứa thông tin lỗi.
        """
        transcript = TranscriptService.get_transcript(db, lesson_id)
        if not transcript:
            transcript = LessonTranscript(lesson_id=lesson_id, transcript_text="", language=language)
            db.add(transcript)

        transcript.status = "failed"
        transcript.language = language
        transcript.error_message = str(error)
        db.flush()
        return transcript

    @staticmethod
    def generate_transcript_task(lesson_id: int, language: str = "vi") -> None:
        """
        Hàm xử lý lõi chạy ngầm (Background Task) điều phối toàn bộ vòng đời chuyển đổi âm thanh.
        Tải video -> Trích xuất âm thanh -> Gọi AI dịch -> Lưu kết quả vào DB -> Dọn dẹp file tạm.
        
        Args:
            lesson_id (int): ID bài học cần tạo phụ đề.
            language (str): Ngôn ngữ dùng để nhận diện.
        """
        db = SessionLocal()
        temp_files: list[Path | str] = []
        try:
            lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
            if not lesson:
                raise RuntimeError("Không tìm thấy bài học.")

            video = (
                db.query(LessonVideo)
                .filter(LessonVideo.lesson_id == lesson_id)
                .order_by(LessonVideo.uploaded_at.desc(), LessonVideo.id.desc())
                .first()
            )
            if not video:
                raise RuntimeError("Bài học chưa có video.")

            video_path, source_temp_files = AudioService.prepare_video_source(video.video_url, lesson_id, video.storage_provider)
            temp_files.extend(source_temp_files)

            audio_path = TEMP_STORAGE_DIR / f"lesson_{lesson_id}_audio.wav"
            temp_files.append(audio_path)
            AudioService.extract_audio_from_video(video_path, str(audio_path))

            provider = TranscriptService.get_provider()
            transcript_text = provider.transcribe(str(audio_path), language=language)
            TranscriptService.save_transcript(db, lesson_id, transcript_text, language=language, generated_by=provider.name)
            db.commit()
        except Exception as exc:
            db.rollback()
            TranscriptService.mark_failed(db, lesson_id, exc, language=language)
            db.commit()
        finally:
            AudioService.cleanup(temp_files)
            db.close()

    @staticmethod
    def serialize_transcript(transcript: LessonTranscript | None, lesson_id: int | None = None) -> dict:
        """
        Định dạng dữ liệu model Database thành dạng Dictionary (JSON-safe) theo cấu trúc chuẩn.
        
        Args:
            transcript (LessonTranscript | None): Bản ghi dữ liệu từ CSDL (nếu có).
            lesson_id (int | None): ID bài học phòng trường hợp transcript truyền vào là None.
            
        Returns:
            dict: Dictionary cấu trúc đầy đủ gửi về cho Frontend.
        """
        if not transcript:
            return {
                "lessonId": int(lesson_id or 0),
                "transcriptText": None,
                "language": "vi",
                "status": "pending",
                "generatedBy": None,
                "errorMessage": None,
                "createdAt": None,
                "updatedAt": None,
            }

        transcript_status = transcript.status or "completed"
        return {
            "lessonId": int(transcript.lesson_id),
            "transcriptText": transcript.transcript_text if transcript_status == "completed" else None,
            "language": transcript.language or "vi",
            "status": transcript_status,
            "generatedBy": transcript.generated_by,
            "errorMessage": transcript.error_message if transcript_status == "failed" else None,
            "createdAt": transcript.created_at.isoformat() if transcript.created_at else None,
            "updatedAt": transcript.updated_at.isoformat() if getattr(transcript, "updated_at", None) else None,
        }