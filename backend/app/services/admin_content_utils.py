import math
from urllib.parse import parse_qs, urlparse


def enum_value(value):
    return getattr(value, "value", value)


def isoformat(value):
    return value.isoformat() if value else None


def pagination(page: int, page_size: int, total_items: int):
    return {
        "page": page,
        "pageSize": page_size,
        "totalItems": total_items,
        "totalPages": math.ceil(total_items / page_size) if total_items else 0,
    }


def build_youtube_embed_url(url: str | None):
    if not url:
        return None

    parsed = urlparse(url)
    netloc = parsed.netloc.lower()

    if "youtu.be" in netloc:
        video_id = parsed.path.strip("/").split("/")[0]
        return f"https://www.youtube.com/embed/{video_id}" if video_id else None

    if "youtube.com" in netloc or "youtube-nocookie.com" in netloc:
        if parsed.path.startswith("/embed/"):
            return url
        if parsed.path.startswith("/shorts/"):
            video_id = parsed.path.replace("/shorts/", "", 1).split("/")[0]
            return f"https://www.youtube.com/embed/{video_id}" if video_id else None
        video_id = parse_qs(parsed.query).get("v", [None])[0]
        if video_id:
            return f"https://www.youtube.com/embed/{video_id}"

    return None


def is_youtube_url(url: str):
    embed_url = build_youtube_embed_url(url)
    return bool(embed_url)


def normalize_provider(provider: str | None):
    value = (provider or "cloud").lower()
    if value in {"youtube", "local", "cloud"}:
        return value
    if value in {"cloudflare", "s3", "media"}:
        return "cloud"
    return value
