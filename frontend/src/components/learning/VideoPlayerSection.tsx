import { useCallback, useEffect, useMemo, useRef } from "react";
import { Play } from "lucide-react";
import {
  updateLessonProgress,
  type LessonProgressData,
} from "../../services/progress.service";
import { registerProgressFlush } from "../../stores/progressSyncStore";
import {
  getYouTubeEmbedUrl,
  isDirectVideoUrl,
  isYouTubeUrl,
} from "../../utils/video";

declare global {
  interface Window {
    YT?: {
      Player?: new (
        element: HTMLElement | string,
        options: {
          videoId?: string;
          playerVars?: Record<string, any>;
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YouTubePlayer;
      PlayerState?: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YouTubePlayer {
  getCurrentTime?: () => number;
  getDuration?: () => number;
  seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
  destroy?: () => void;
}

interface VideoPlayerSectionProps {
  videoUrl: string | null;
  embedUrl: string | null;
  provider: string | null;
  title: string;
  courseId: string;
  lessonId: string;
  durationSeconds: number;
  lessonProgress: LessonProgressData | null;
  onProgressChange: (progress: LessonProgressData) => void;
  onEnded: (durationSeconds: number) => void;
}

function VideoPlayerSection({
  videoUrl,
  embedUrl,
  provider,
  title,
  courseId,
  lessonId,
  durationSeconds,
  lessonProgress,
  onProgressChange,
  onEnded,
}: VideoPlayerSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const youtubeContainerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const lessonProgressRef = useRef<LessonProgressData | null>(lessonProgress);
  const onEndedRef = useRef(onEnded);
  const hasRestoredRef = useRef(false);
  const lastSavedAtRef = useRef(0);
  const saveInFlightRef = useRef(false);

  // Tách lấy YouTube Video ID chuẩn xác
  const youtubeVideoId = useMemo(() => {
    const targetUrl = embedUrl || videoUrl;
    if (!targetUrl) return null;

    if (provider?.toLowerCase() === "youtube" || isYouTubeUrl(targetUrl)) {
      const match = targetUrl.match(/(?:embed\/|v=|v\/|vi\/|youtu\.be\/|\/v\/|shorts\/)([^#&?]*)/);
      return match && match[1] ? match[1] : null;
    }
    return null;
  }, [embedUrl, provider, videoUrl]);

  useEffect(() => {
    hasRestoredRef.current = false;
    lastSavedAtRef.current = 0;
    saveInFlightRef.current = false;
  }, [lessonId, videoUrl, youtubeVideoId]);

  useEffect(() => {
    lessonProgressRef.current = lessonProgress;
  }, [lessonProgress]);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  const persistProgress = useCallback(
    async (currentTime: number, duration: number, options: { keepalive?: boolean } = {}) => {
      if (!courseId || !lessonId || saveInFlightRef.current || lessonProgressRef.current?.isCompleted) return;
      if (duration <= 0) return;

      const progressPercent = Math.min(99, Math.round((currentTime / duration) * 100));
      saveInFlightRef.current = true;

      try {
        const response = await updateLessonProgress(
          lessonId,
          {
            courseId,
            lastPositionSeconds: currentTime,
            watchedSeconds: currentTime,
            durationSeconds: duration,
            progressPercent,
          },
          options,
        );
        const data = "data" in response && response.data ? response.data : response;
        onProgressChange(data as LessonProgressData);
      } finally {
        saveInFlightRef.current = false;
      }
    },
    [courseId, lessonId, onProgressChange],
  );

  const saveProgress = useCallback(async (options: { keepalive?: boolean } = {}) => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = Math.floor(video.currentTime || 0);
    const duration = Math.floor(video.duration || durationSeconds || lessonProgress?.durationSeconds || 0);
    await persistProgress(currentTime, duration, options);
  }, [durationSeconds, lessonProgress?.durationSeconds, persistProgress]);

  const stopYoutubeProgressTimer = useCallback(() => {
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const saveYoutubeProgress = useCallback(async (options: { keepalive?: boolean } = {}) => {
    const player = playerRef.current;
    if (!player) return;

    const currentTime = Math.floor(player.getCurrentTime?.() ?? 0);
    const duration = Math.floor(player.getDuration?.() || durationSeconds || lessonProgressRef.current?.durationSeconds || 0);
    await persistProgress(currentTime, duration, options);
  }, [durationSeconds, persistProgress]);

  const saveYoutubeProgressRef = useRef(saveYoutubeProgress);
  useEffect(() => {
    saveYoutubeProgressRef.current = saveYoutubeProgress;
  }, [saveYoutubeProgress]);

  const flushCurrentProgress = useCallback(async (options: { keepalive?: boolean } = {}) => {
    if (playerRef.current) {
      await saveYoutubeProgress(options);
      return;
    }

    await saveProgress(options);
  }, [saveProgress, saveYoutubeProgress]);

  const startYoutubeProgressTimer = useCallback(() => {
    if (progressTimerRef.current) return;

    progressTimerRef.current = window.setInterval(() => {
      saveYoutubeProgressRef.current().catch((error) => {
        console.warn("Khong the luu tien do YouTube:", error);
      });
    }, 10000);
  }, []);

  // KHỞI TẠO YOUTUBE PLAYER BẰNG CONTAINER DIV
  useEffect(() => {
    if (!youtubeVideoId || !youtubeContainerRef.current) return undefined;

    let cancelled = false;

    const setupPlayer = () => {
      if (cancelled || !window.YT?.Player || !youtubeContainerRef.current) return;

      // Xóa sạch nội dung bên trong container trước khi gắn player mới
      youtubeContainerRef.current.innerHTML = '<div id="yt-player-element" class="w-full h-full"></div>';

      playerRef.current = new window.YT.Player("yt-player-element", {
        videoId: youtubeVideoId,
        playerVars: {
          enablejsapi: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            const currentProgress = lessonProgressRef.current;
            const savedSeconds = currentProgress?.lastPositionSeconds ?? 0;
            const duration = Math.floor(event.target.getDuration?.() || durationSeconds || currentProgress?.durationSeconds || 0);

            if (!currentProgress?.isCompleted && savedSeconds > 0 && duration > 0 && savedSeconds < duration - 5) {
              setTimeout(() => {
                try {
                  event.target.seekTo?.(savedSeconds, true);
                } catch (e) {
                  console.warn("Lỗi seek YouTube:", e);
                }
              }, 500);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState?.PLAYING) {
              startYoutubeProgressTimer();
            }

            if (event.data === window.YT?.PlayerState?.PAUSED) {
              saveYoutubeProgressRef.current().catch((error) => {
                console.warn("Khong the luu tien do YouTube khi pause:", error);
              });
              stopYoutubeProgressTimer();
            }

            if (event.data === window.YT?.PlayerState?.ENDED) {
              const duration = Math.floor(
                playerRef.current?.getDuration?.() || durationSeconds || lessonProgressRef.current?.durationSeconds || 0,
              );

              saveYoutubeProgressRef.current().catch((error) => {
                console.warn("Khong the luu tien do YouTube khi ket thuc:", error);
              });
              stopYoutubeProgressTimer();
              onEndedRef.current(duration);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      setupPlayer();
    } else {
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        setupPlayer();
      };

      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      stopYoutubeProgressTimer();
      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy();
        } catch {}
      }
      playerRef.current = null;
    };
  }, [lessonId, youtubeVideoId, durationSeconds, startYoutubeProgressTimer, stopYoutubeProgressTimer]);

  useEffect(() => {
    const handlePageHide = () => {
      flushCurrentProgress({ keepalive: true }).catch(() => {});
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushCurrentProgress({ keepalive: true }).catch(() => {});
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      flushCurrentProgress({ keepalive: true }).catch(() => {});
    };
  }, [flushCurrentProgress]);

  useEffect(() => {
    return registerProgressFlush(flushCurrentProgress);
  }, [flushCurrentProgress]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || hasRestoredRef.current) return;

    const savedSeconds = lessonProgress?.lastPositionSeconds ?? 0;
    const duration = Math.floor(video.duration || durationSeconds || lessonProgress?.durationSeconds || 0);

    if (!lessonProgress?.isCompleted && savedSeconds > 0 && savedSeconds < duration - 5) {
      video.currentTime = savedSeconds;
    }

    hasRestoredRef.current = true;
  };

  const handleTimeUpdate = () => {
    const now = Date.now();
    if (now - lastSavedAtRef.current < 10000) return;

    lastSavedAtRef.current = now;
    saveProgress().catch((error) => {
      console.warn("Không thể lưu tiến độ video:", error);
    });
  };

  const handlePause = () => {
    saveProgress().catch((error) => {
      console.warn("Không thể lưu tiến độ khi pause:", error);
    });
  };

  const handleEnded = () => {
    const video = videoRef.current;
    const duration = Math.floor(video?.duration || durationSeconds || lessonProgress?.durationSeconds || 0);
    onEnded(duration);
  };

  return (
    <section className="overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl shadow-slate-200">
      <div className="relative aspect-video bg-slate-950">
        {youtubeVideoId ? (
          <div
            key={`yt-container-${lessonId}-${youtubeVideoId}`}
            ref={youtubeContainerRef}
            className="h-full w-full bg-black"
          />
        ) : videoUrl && isDirectVideoUrl(videoUrl) ? (
          <video
            key={`video-${lessonId}-${videoUrl}`}
            ref={videoRef}
            className="h-full w-full bg-black object-contain"
            controls
            preload="auto"
            src={videoUrl}
            title={title}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPause={handlePause}
            onEnded={handleEnded}
          />
        ) : videoUrl ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <h2 className="text-lg font-extrabold">Không thể phát video này.</h2>
            <p className="mt-2 max-w-md text-sm text-slate-300">
              Vui lòng kiểm tra lại định dạng video URL.
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
              <Play size={28} className="ml-1" />
            </span>
            <h2 className="text-lg font-extrabold">Bài học này chưa có video.</h2>
          </div>
        )}
      </div>
    </section>
  );
}

export default VideoPlayerSection;