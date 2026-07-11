import { useCallback, useEffect, useRef, useState } from "react";
import { Download, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AIAssistantPanel from "../../components/learning/AIAssistantPanel";
import LessonInfoSection from "../../components/learning/LessonInfoSection";
import LessonSidebar from "../../components/learning/LessonSidebar";
import LessonTabs from "../../components/learning/LessonTabs";
import VideoPlayerSection from "../../components/learning/VideoPlayerSection";
import {
  type ChatMessage,
  type Lesson,
  type LessonDetail,
  type LessonSummary,
  type LessonTab,
  type TranscriptSegment,
} from "../../components/learning/learningTypes";
import { getCourseLessons } from "../../services/course.service";
import { getLessonById, getLessonResources } from "../../services/lesson.service";
import { askAI } from "../../services/chat.service";
import {
  completeLesson,
  getCourseProgress,
  getLessonProgress,
  type CourseProgressData,
  type LessonCompleteData,
  type LessonProgressData,
  unwrapProgressData,
} from "../../services/progress.service";

const suggestedQuestions = ["Tóm tắt bài học này", "Giải thích phần khó hiểu nhất", "Cho ví dụ dễ hiểu hơn"];

// Lưu lịch sử chat AI riêng theo từng bài học (localStorage), vì backend chưa có API lưu lịch sử.
const CHAT_HISTORY_PREFIX = "pyai_lesson_chat:";

function getDefaultChatMessages(): ChatMessage[] {
  return [
    {
      id: "message-welcome",
      role: "ai",
      content: "Chào bạn! Tôi là AI Assistant. Bạn có câu hỏi nào về bài học này không?",
    },
  ];
}

function loadChatHistory(lessonId: string): ChatMessage[] {
  try {
    const stored = window.localStorage.getItem(`${CHAT_HISTORY_PREFIX}${lessonId}`);
    if (!stored) return getDefaultChatMessages();

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultChatMessages();
  } catch (error) {
    console.warn("Không thể đọc lịch sử chat đã lưu:", error);
    return getDefaultChatMessages();
  }
}

function saveChatHistory(lessonId: string, messages: ChatMessage[]) {
  try {
    window.localStorage.setItem(`${CHAT_HISTORY_PREFIX}${lessonId}`, JSON.stringify(messages));
  } catch (error) {
    console.warn("Không thể lưu lịch sử chat:", error);
  }
}

function LearningPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LessonTab>("overview");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressData | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const isCompletingRef = useRef(false);
  const completedLessonRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);
  const [errorMessage, setErrorMessage] = useState("");

  const loadCourseProgress = useCallback(async () => {
    if (!courseId) return null;

    try {
      const response = await getCourseProgress(courseId);
      const progress = unwrapProgressData<CourseProgressData>(response);
      setCourseProgress(progress);
      return progress;
    } catch (error) {
      console.warn("Không thể tải tiến độ khóa học:", error);
      return null;
    }
  }, [courseId]);

  const loadLearningData = useCallback(async () => {
    if (!courseId || !lessonId) {
      requestIdRef.current += 1;
      setLesson(null);
      setLessons([]);
      setLessonProgress(null);
      setErrorMessage("Không tìm thấy khóa học hoặc bài học.");
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      setIsLoading(true);
      setErrorMessage("");
      setLesson(null);
      setLessonProgress(null);

      const resourcesPromise = getLessonResources(lessonId)
        .then((resourcesResponse) => unwrapApiData(resourcesResponse))
        .catch((error) => {
          console.warn("Resources API chưa sẵn sàng:", error);
          return null;
        });
      const progressPromise = getLessonProgress(lessonId)
        .then((progressResponse) => unwrapProgressData<LessonProgressData>(progressResponse))
        .catch((error) => {
          console.warn("Không thể tải tiến độ bài học:", error);
          return null;
        });
      const courseProgressPromise = getCourseProgress(courseId)
        .then((progressResponse) => unwrapProgressData<CourseProgressData>(progressResponse))
        .catch((error) => {
          console.warn("Không thể tải tiến độ khóa học:", error);
          return null;
        });
      const [lessonResponse, resourcesData, lessonsResponse, progressData, courseProgressData] = await Promise.all([
        getLessonById(lessonId),
        resourcesPromise,
        getCourseLessons(courseId),
        progressPromise,
        courseProgressPromise,
      ]);
      if (requestId !== requestIdRef.current) return;

      const mappedLesson = mapLessonDetail(unwrapApiData(lessonResponse), resourcesData);

      setLesson(mappedLesson);
      setLessonProgress(progressData);
      setCourseProgress(courseProgressData);
      setLessons(applyCourseProgress(extractLessons(lessonsResponse), courseProgressData));
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      console.error("Load learning data failed:", error);
      setLesson(null);
      setLessons([]);
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải dữ liệu bài học.");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    loadLearningData();
  }, [loadLearningData]);

  useEffect(() => {
    completedLessonRef.current = null;
    isCompletingRef.current = false;
    setIsCompleting(false);
  }, [lessonId]);

  // Mỗi khi chuyển sang bài học khác, nạp lại lịch sử chat riêng của bài học đó
  useEffect(() => {
    if (!lessonId) return;
    setChatMessages(loadChatHistory(lessonId));
    setChatInput("");
    setIsAiReplying(false);
  }, [lessonId]);

  // Lưu lại lịch sử chat mỗi khi có thay đổi
  useEffect(() => {
    if (!lessonId || chatMessages.length === 0) return;
    saveChatHistory(lessonId, chatMessages);
  }, [chatMessages, lessonId]);

  const handleSelectLesson = (nextLessonId: string) => {
    if (!courseId) return;
    navigate(`/learning/${courseId}/${nextLessonId}`);
  };

  const handleVideoProgressChange = (nextProgress: LessonProgressData) => {
    setLessonProgress(nextProgress);
    setLessons((current) =>
      current.map((item) =>
        item.id === String(nextProgress.lessonId)
          ? {
              ...item,
              status: nextProgress.isCompleted ? "completed" : "available",
              progressPercent: nextProgress.progressPercent,
              lastPositionSeconds: nextProgress.lastPositionSeconds,
            }
          : item,
      ),
    );
  };

  const reloadCourseProgress = useCallback(async () => {
    const nextCourseProgress = await loadCourseProgress();
    if (nextCourseProgress) {
      setLessons((current) => applyCourseProgress(current, nextCourseProgress));
    }

    return nextCourseProgress;
  }, [loadCourseProgress]);

  const handleCompleteLesson = useCallback(
    async (completedDurationSeconds?: number) => {
      if (
        !courseId ||
        !lessonId ||
        isCompletingRef.current ||
        completedLessonRef.current === lessonId ||
        lessonProgress?.isCompleted
      ) {
        return;
      }

      const finalDuration = Math.floor(
        completedDurationSeconds ?? lesson?.durationSeconds ?? lessonProgress?.durationSeconds ?? 0,
      );

      try {
        isCompletingRef.current = true;
        completedLessonRef.current = lessonId;
        setIsCompleting(true);
        const response = await completeLesson(lessonId, {
          courseId,
          durationSeconds: finalDuration,
        });
        const completeData = unwrapProgressData<LessonCompleteData>(response);
        const nextProgress = completeData.lessonProgress;
        const completedProgress: LessonProgressData = {
          ...nextProgress,
          lessonId,
          isCompleted: true,
          progressPercent: 100,
          lastPositionSeconds: nextProgress.lastPositionSeconds ?? finalDuration,
          watchedSeconds: nextProgress.watchedSeconds ?? finalDuration,
          durationSeconds: nextProgress.durationSeconds ?? finalDuration,
        };

        handleVideoProgressChange(completedProgress);
        if (completeData.courseProgress) {
          setCourseProgress(completeData.courseProgress);
          setLessons((current) => applyCourseProgress(current, completeData.courseProgress));
        } else {
          setCourseProgress((current) => mergeCompletedLessonProgress(current, completedProgress));
          setLessons((current) =>
            current.map((item) =>
              item.id === String(lessonId)
                ? { ...item, status: "completed", progressPercent: 100, lastPositionSeconds: completedProgress.lastPositionSeconds }
                : item,
            ),
          );
        }
        await reloadCourseProgress();
      } catch (error) {
        completedLessonRef.current = null;
        console.error("Không thể đánh dấu hoàn thành bài học:", error);
      } finally {
        isCompletingRef.current = false;
        setIsCompleting(false);
      }
    },
    [
      courseId,
      lesson?.durationSeconds,
      lessonId,
      lessonProgress?.durationSeconds,
      lessonProgress?.isCompleted,
      reloadCourseProgress,
    ],
  );

  const handleVideoEnded = useCallback(
    async (completedDurationSeconds: number) => {
      if (lessonProgress?.isCompleted) return;
      await handleCompleteLesson(completedDurationSeconds);
    },
    [handleCompleteLesson, lessonProgress?.isCompleted],
  );

  const handleSendMessage = async () => {
    const trimmedInput = chatInput.trim();
    if (!trimmedInput || isAiReplying) return;

    const userMessage: ChatMessage = {
      id: `message-${Date.now()}-user`,
      role: "user",
      content: trimmedInput,
    };

    setChatMessages((current) => [...current, userMessage]);
    setChatInput("");
    setIsAiReplying(true);

    try {
      // Dùng transcript/tóm tắt bài học làm ngữ cảnh để AI trả lời đúng nội dung đang học
      const lessonContext = lesson?.transcript || lesson?.summary?.summaryText || lesson?.description || null;
      const answer = await askAI({
        question: trimmedInput,
        lessonId: lesson?.id,
        context: lessonContext,
      });

      setChatMessages((current) => [
        ...current,
        { id: `message-${Date.now()}-ai`, role: "ai", content: answer },
      ]);
    } finally {
      setIsAiReplying(false);
    }
  };

  const handleSelectSuggestedQuestion = (question: string) => {
    setChatInput(question);
  };

  if (isLoading) {
    return <LearningPageSkeleton />;
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <h3 className="text-lg font-bold text-red-700">Không thể tải dữ liệu bài học</h3>
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          <button
            type="button"
            onClick={loadLearningData}
            className="focus-ring mt-5 inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-600">
          Không tìm thấy bài học.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)_360px] lg:px-8">
        <LessonSidebar
          lessons={lessons}
          selectedLessonId={lesson.id}
          courseProgress={courseProgress}
          onSelectLesson={handleSelectLesson}
        />

        <div className="min-w-0 space-y-6">
          <VideoPlayerSection
            key={`${lesson.id}-${lesson.videoUrl ?? lesson.embedUrl ?? "no-video"}`}
            videoUrl={lesson.videoUrl}
            embedUrl={lesson.embedUrl}
            provider={lesson.videoProvider}
            title={lesson.title}
            courseId={courseId || lesson.courseId}
            lessonId={lesson.id}
            durationSeconds={lesson.durationSeconds}
            lessonProgress={lessonProgress}
            onProgressChange={handleVideoProgressChange}
            onEnded={handleVideoEnded}
          />
          <LessonSlideCard slideFile={lesson.slideFile} />
          <LessonInfoSection
            title={lesson.title}
            description={lesson.description}
            isCompleted={Boolean(lessonProgress?.isCompleted)}
            isCompleting={isCompleting}
            onComplete={() => handleCompleteLesson()}
          />
          <LessonTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            lessonId={lesson.id}
            transcript={lesson.transcript}
            transcriptStatus={lesson.transcriptStatus}
            transcriptErrorMessage={lesson.transcriptErrorMessage}
            summary={lesson.summary}
            transcriptSegments={lesson.transcriptSegments}
          />
        </div>

        <AIAssistantPanel
          messages={chatMessages}
          input={chatInput}
          suggestedQuestions={suggestedQuestions}
          isSending={isAiReplying}
          onInputChange={setChatInput}
          onSend={handleSendMessage}
          onSelectSuggestedQuestion={handleSelectSuggestedQuestion}
        />
      </main>
    </div>
  );
}

function LessonSlideCard({ slideFile }: { slideFile: Lesson["slideFile"] | null }) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <FileText size={24} aria-hidden={true} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold text-slate-950">Slide bài học</h2>
          {slideFile ? (
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">{slideFile.fileName}</p>
                <p className="mt-1 text-xs text-slate-500">{slideFile.fileSize}</p>
              </div>
              <a
                href={slideFile.fileUrl}
                download
                className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
              >
                <Download size={17} aria-hidden={true} />
                Tải xuống
              </a>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-500">Bài học này chưa có slide để tải xuống.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function LearningPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)_360px] lg:px-8">
        <div className="h-[520px] animate-pulse rounded-[26px] bg-white shadow-card" />
        <div className="space-y-6">
          <div className="aspect-video animate-pulse rounded-[28px] bg-slate-200" />
          <div className="h-32 animate-pulse rounded-[26px] bg-white shadow-card" />
          <div className="h-40 animate-pulse rounded-[26px] bg-white shadow-card" />
        </div>
        <div className="h-[520px] animate-pulse rounded-[26px] bg-white shadow-card" />
      </main>
    </div>
  );
}

function mapLessonDetail(lessonData: unknown, resourcesData?: unknown): LessonDetail {
  const data = asRecord(lessonData);
  const resources = asRecord(resourcesData);
  const video = asRecord(getValue(resources.video, data.video, null));
  const transcriptResource = asRecord(getValue(resources.transcript, data.transcript, null));

  return {
    id: String(getValue(data.id, "")),
    courseId: String(getValue(data.courseId, data.course_id, "")),
    title: String(getValue(data.title, "Chưa có tiêu đề bài học")),
    description: String(getValue(data.description, "")),
    durationSeconds: Number(getValue(data.durationSeconds, data.duration_seconds, 0)),
    videoUrl: getStringOrNull(
      video.videoUrl,
      video.video_url,
      resources.videoUrl,
      resources.video_url,
      data.videoUrl,
      data.video_url,
    ),
    embedUrl: getStringOrNull(
      video.embedUrl,
      video.embed_url,
      resources.embedUrl,
      resources.embed_url,
      data.embedUrl,
      data.embed_url,
    ),
    videoProvider: getStringOrNull(
      video.provider,
      video.storageProvider,
      video.storage_provider,
      resources.provider,
      resources.storageProvider,
      resources.storage_provider,
      data.provider,
      data.storageProvider,
      data.storage_provider,
    ),
    slideFile: mapSlideFile(getValue(resources.slideFile, resources.slide_file, data.slideFile, data.slide_file)),
    transcript: getStringOrNull(
      transcriptResource.text,
      transcriptResource.transcriptText,
      transcriptResource.transcript_text,
      resources.transcriptText,
      resources.transcript_text,
      data.transcriptText,
      data.transcript_text,
    ),
    transcriptStatus: mapTranscriptStatus(
      getStringOrNull(
        transcriptResource.status,
        resources.transcriptStatus,
        resources.transcript_status,
        data.transcriptStatus,
        data.transcript_status,
      ),
    ),
    transcriptErrorMessage: getStringOrNull(
      transcriptResource.errorMessage,
      transcriptResource.error_message,
      resources.transcriptErrorMessage,
      resources.transcript_error_message,
      data.transcriptErrorMessage,
      data.transcript_error_message,
    ),
    summary: mapLessonSummary(resources, data),
    transcriptSegments: extractTranscriptSegments(resources, data),
  };
}

function mapLessonSummary(...sources: unknown[]): LessonSummary | null {
  for (const source of sources) {
    const record = asRecord(source);
    const summary = asRecord(record.summary);
    const summaryText = getStringOrNull(
      summary.summaryText,
      summary.summary_text,
      record.summaryText,
      record.summary_text,
    );

    if (summaryText) {
      return {
        id: getStringOrNull(summary.id) ?? undefined,
        lessonId: getStringOrNull(summary.lessonId, summary.lesson_id) ?? undefined,
        summaryText,
        keyPoints: extractStringList(summary.keyPoints, summary.key_points),
        generatedBy: getStringOrNull(summary.generatedBy, summary.generated_by),
        createdAt: getStringOrNull(summary.createdAt, summary.created_at),
      };
    }
  }

  return null;
}

function mapSlideFile(slideFile: unknown): Lesson["slideFile"] | null {
  const slide = asRecord(slideFile);
  const fileUrl = getStringOrNull(slide.fileUrl, slide.file_url, slide.url, slide.downloadUrl, slide.download_url);

  if (!fileUrl) return null;

  return {
    fileName: getStringOrNull(slide.fileName, slide.file_name, slide.name, slide.title) ?? "slide.pdf",
    fileUrl,
    fileSize: getStringOrNull(slide.fileSize, slide.file_size, slide.size) ?? "",
  };
}

function extractLessons(response: unknown): Lesson[] {
  const data = unwrapApiData(response);
  const items = Array.isArray(data) ? data : [];
  const lessons: Lesson[] = [];

  const lessonItems = items.every((item) => !Array.isArray(asRecord(item).lessons))
    ? items
    : items.flatMap((chapter) => {
        const chapterRecord = asRecord(chapter);
        return Array.isArray(chapterRecord.lessons) ? chapterRecord.lessons : [];
      });

  lessonItems.forEach((item) => {
    const lesson = asRecord(item);
    lessons.push({
      id: String(getValue(lesson.id, "")),
      title: String(getValue(lesson.title, "Bài học")),
      duration: String(getValue(lesson.duration, formatLessonDuration(Number(getValue(lesson.durationSeconds, lesson.duration_seconds, 0))))),
      status: mapLessonStatus(getStringOrNull(lesson.status)),
      progressPercent: Number(getValue(lesson.progressPercent, lesson.progress_percent, 0)),
      lastPositionSeconds: Number(getValue(lesson.lastPositionSeconds, lesson.last_position_seconds, 0)),
    });
  });

  return lessons.filter((item) => item.id);
}

function applyCourseProgress(lessons: Lesson[], courseProgress: CourseProgressData | null): Lesson[] {
  if (!courseProgress?.lessons?.length) return lessons;

  const progressByLesson = new Map(courseProgress.lessons.map((progress) => [String(progress.lessonId), progress]));

  return lessons.map((lesson) => {
    const progress = progressByLesson.get(lesson.id);
    if (!progress) return lesson;

    return {
      ...lesson,
      status: progress.isCompleted ? "completed" : lesson.status === "locked" ? "locked" : "available",
      progressPercent: progress.progressPercent,
      lastPositionSeconds: progress.lastPositionSeconds,
    };
  });
}

function mergeCompletedLessonProgress(
  courseProgress: CourseProgressData | null,
  lessonProgress: LessonProgressData,
): CourseProgressData | null {
  if (!courseProgress) return null;

  const lessonId = String(lessonProgress.lessonId);
  const wasCompleted =
    courseProgress.lessons?.some((progress) => String(progress.lessonId) === lessonId && progress.isCompleted) ?? false;
  const completedLessons = wasCompleted
    ? courseProgress.completedLessons
    : Math.min(courseProgress.completedLessons + 1, courseProgress.totalLessons);

  return {
    ...courseProgress,
    completedLessons,
    currentLessonId: lessonProgress.lessonId,
    progressPercent:
      courseProgress.totalLessons > 0 ? Math.round((completedLessons / courseProgress.totalLessons) * 100) : 0,
    lessons: [
      ...(courseProgress.lessons ?? []).filter((progress) => String(progress.lessonId) !== lessonId),
      lessonProgress,
    ],
  };
}

function extractTranscriptSegments(...sources: unknown[]): TranscriptSegment[] {
  for (const source of sources) {
    const record = asRecord(source);
    const transcript = asRecord(record.transcript);
    const segments = getValue(record.transcriptSegments, record.transcript_segments, transcript.segments);

    if (Array.isArray(segments)) {
      return segments
        .map((segment) => {
          const item = asRecord(segment);
          const time = getStringOrNull(item.time, item.timestamp, item.startTime, item.start_time) ?? "";
          const title = getStringOrNull(item.title, item.text, item.content) ?? "";
          return time || title ? { time, title } : null;
        })
        .filter((segment): segment is TranscriptSegment => Boolean(segment));
    }
  }

  return [];
}

function extractStringList(...values: unknown[]): string[] {
  for (const value of values) {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }

    if (typeof value === "string" && value.trim().length > 0) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
        }
      } catch {
        return [];
      }
    }
  }

  return [];
}

function unwrapApiData(payload: unknown): unknown {
  const record = asRecord(payload);
  if ("data" in record) return record.data;
  if ("items" in record) return record.items;
  return payload;
}

function mapLessonStatus(status: string | null): Lesson["status"] {
  if (status === "completed" || status === "locked") return status;
  return "available";
}

function mapTranscriptStatus(status: string | null): LessonDetail["transcriptStatus"] {
  if (status === "processing" || status === "completed" || status === "failed") return status;
  return "pending";
}

function formatLessonDuration(durationSeconds: number) {
  const secondsTotal = Math.max(durationSeconds, 0);
  const minutes = Math.floor(secondsTotal / 60);
  const seconds = secondsTotal % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getNested(source: Record<string, unknown>, key: string, nestedKey: string) {
  return asRecord(source[key])[nestedKey];
}

function getStringOrNull(...values: unknown[]) {
  const value = values.find((item) => typeof item === "string" && item.trim().length > 0);
  return typeof value === "string" ? value : null;
}

function getValue<T>(...values: Array<T | null | undefined>): T {
  const value = values.find((item) => item !== null && item !== undefined);
  return value as T;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export default LearningPage;