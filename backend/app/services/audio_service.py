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
    @staticmethod
    def extract_audio_from_video(video_path: str, output_path: str) -> str:
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
            command = ["yt-dlp", "-f", "bestaudio/best", "-o", str(output_path), video_url]
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
        output_path.parent.mkdir(parents=True, exist_ok=True)
        request = urllib.request.Request(url, headers={"User-Agent": "python-course-ai-platform/1.0"})
        with urllib.request.urlopen(request, timeout=120) as response:
            with output_path.open("wb") as output_file:
                shutil.copyfileobj(response, output_file)
        return output_path

    @staticmethod
    def resolve_local_path(video_url: str) -> Path:
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
        for path in paths:
            try:
                Path(path).unlink(missing_ok=True)
            except OSError:
                pass

    @staticmethod
    def ensure_binary_available(binary_name: str, message: str) -> None:
        if not shutil.which(binary_name):
            raise RuntimeError(message)
