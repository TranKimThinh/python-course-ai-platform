export function isYouTubeUrl(url?: string | null) {
  if (!url) return false;
  const normalizedUrl = url.toLowerCase();

  return (
    normalizedUrl.includes("youtube.com/watch") ||
    normalizedUrl.includes("youtube.com/embed") ||
    normalizedUrl.includes("youtube-nocookie.com/embed") ||
    normalizedUrl.includes("youtube.com/shorts/") ||
    normalizedUrl.includes("youtu.be/")
  );
}

export function getYouTubeEmbedUrl(url?: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace(/^\/+/, "").split("/")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtube-nocookie.com")) {
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        const videoId = parsedUrl.pathname.replace("/shorts/", "").split("/")[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

export function isDirectVideoUrl(url?: string | null) {
  if (!url) return false;

  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}
