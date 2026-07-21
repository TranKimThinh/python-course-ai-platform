import os
import shutil
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[2]
TEMP_STORAGE_DIR = BACKEND_ROOT / "storage" / "temp"
SUPPORTED_VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov", ".mkv", ".avi", ".m4v"}


class AudioService:
    """
    Lớp dịch vụ cung cấp các công cụ xử lý file đa phương tiện,
    bao gồm tải video từ internet, trích xuất âm thanh và quản lý file tạm.
    """
    @staticmethod
    def extract_audio_from_video(video_path: str, output_path: str) -> str:
        
        """
        Sử dụng FFmpeg để trích xuất âm thanh từ file video sang định dạng .wav 
        với thông số kỹ thuật chuẩn (16kHz, mono).
        
        Args:
            video_path (str): Đường dẫn tới file video gốc.
            output_path (str): Đường dẫn lưu file âm thanh đầu ra.
            
        Returns:
            str: Đường dẫn của file âm thanh sau khi trích xuất.
            
        Raises:
            RuntimeError: Nếu không tìm thấy ffmpeg hoặc quá trình trích xuất thất bại.
        """
        
        AudioService.ensure_binary_available("ffmpeg", "ffmpeg chua duoc cai dat hoac chua co trong PATH.")
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)

        command = [
            "ffmpeg",
            "-y",
            "-i",
            video_path,
            "-vn",
            "-acodec",
            "pcm_s16le",
            "-ar",
            "16000",
            "-ac",
            "1",
            output_path,
        ]
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return output_path

    @staticmethod
    def prepare_video_source(video_url: str, lesson_id: int, storage_provider: str | None = None) -> tuple[str, list[Path]]:
        
        """
        Chuẩn bị nguồn video bằng cách tải xuống từ URL (YouTube hoặc link trực tiếp)
        hoặc xác thực đường dẫn cục bộ, sẵn sàng cho quá trình xử lý tiếp theo.
        
        Args:
            video_url (str): URL hoặc đường dẫn file video.
            lesson_id (int): ID bài học để đặt tên file tạm độc nhất.
            storage_provider (str | None): Nhà cung cấp lưu trữ (VD: "youtube").
            
        Returns:
            tuple[str, list[Path]]: Đường dẫn video đã tải về và danh sách các file tạm đã tạo.
            
        Raises:
            ValueError/PermissionError/FileNotFoundError: Nếu URL không hợp lệ hoặc thiếu quyền.
        """
        
        if not video_url:
            raise ValueError("Bai hoc chua co video de tao transcript.")

        parsed = urllib.parse.urlparse(video_url)
        provider = (storage_provider or "").lower()
        temp_files: list[Path] = []

        if provider == "youtube" or "youtube.com" in parsed.netloc.lower() or "youtu.be" in parsed.netloc.lower():
            if os.getenv("ALLOW_YOUTUBE_TRANSCRIPT", "false").lower() not in {"1", "true", "yes"}:
                raise PermissionError("YouTube transcript bi tat. Chi bat khi he thong co quyen xu ly video nay.")
            AudioService.ensure_binary_available("yt-dlp", "yt-dlp chua duoc cai dat hoac chua co trong PATH.")
            output_path = TEMP_STORAGE_DIR / f"lesson_{lesson_id}_youtube.%(ext)s"
            command = ["yt-dlp", "--no-playlist", "-f", "bestaudio/best", "-o", str(output_path), video_url]
            subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            downloaded_files = sorted(TEMP_STORAGE_DIR.glob(f"lesson_{lesson_id}_youtube.*"))
            if not downloaded_files:
                raise RuntimeError("Khong tai duoc audio/video tu YouTube.")
            temp_files.extend(downloaded_files)
            return str(downloaded_files[0]), temp_files

        if parsed.scheme in {"http", "https"}:
            suffix = Path(parsed.path).suffix.lower()
            if suffix not in SUPPORTED_VIDEO_EXTENSIONS:
                raise ValueError("URL video khong phai file video truc tiep duoc ho tro.")
            local_path = TEMP_STORAGE_DIR / f"lesson_{lesson_id}_source{suffix}"
            AudioService.download_file(video_url, local_path)
            temp_files.append(local_path)
            return str(local_path), temp_files

        local_path = AudioService.resolve_local_path(video_url)
        if not local_path.exists():
            raise FileNotFoundError(f"Khong tim thay file video: {video_url}")
        return str(local_path), temp_files

    @staticmethod
    def download_file(url: str, output_path: Path) -> Path:
        
        """
        Tải file từ URL từ xa về máy chủ cục bộ bằng thư viện urllib.
        
        Args:
            url (str): URL của tài nguyên cần tải.
            output_path (Path): Đường dẫn đích để lưu file.
            
        Returns:
            Path: Đường dẫn tới file đã tải về.
        """
        
        output_path.parent.mkdir(parents=True, exist_ok=True)
        request = urllib.request.Request(url, headers={"User-Agent": "python-course-ai-platform/1.0"})
        with urllib.request.urlopen(request, timeout=120) as response:
            with output_path.open("wb") as output_file:
                shutil.copyfileobj(response, output_file)
        return output_path

    @staticmethod
    def resolve_local_path(video_url: str) -> Path:
        
        """
        Phân giải đường dẫn cục bộ cho video dựa trên cấu trúc thư mục của dự án.
        
        Args:
            video_url (str): Đường dẫn tương đối hoặc tuyệt đối tới video.
            
        Returns:
            Path: Đối tượng Path đã được phân giải chính xác.
        """
        
        parsed = urllib.parse.urlparse(video_url)
        path = urllib.parse.unquote(parsed.path if parsed.scheme == "file" else video_url)
        candidate = Path(path)
        if candidate.is_absolute():
            return candidate

        for base in (BACKEND_ROOT, BACKEND_ROOT.parent, Path.cwd()):
            resolved = (base / candidate).resolve()
            if resolved.exists():
                return resolved

        return (BACKEND_ROOT / candidate).resolve()

    @staticmethod
    def cleanup(paths: list[Path | str]) -> None:
        
        """
        Dọn dẹp các file tạm sau khi đã xử lý xong để giải phóng không gian lưu trữ.
        
        Args:
            paths (list[Path | str]): Danh sách đường dẫn các file cần xóa.
        """
        
        for path in paths:
            try:
                Path(path).unlink(missing_ok=True)
            except OSError:
                pass

    @staticmethod
    def ensure_binary_available(binary_name: str, message: str) -> None:
        
        """
        Kiểm tra xem một chương trình (binary) đã được cài đặt trong hệ thống hay chưa.
        
        Args:
            binary_name (str): Tên chương trình (VD: "ffmpeg").
            message (str): Thông báo lỗi nếu chương trình không tồn tại.
        """
        
        if not shutil.which(binary_name):
            raise RuntimeError(message)
