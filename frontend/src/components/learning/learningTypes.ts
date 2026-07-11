export interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: "completed" | "available" | "locked";
  progressPercent?: number;
  lastPositionSeconds?: number;
  slideFile?: {
    fileName: string;
    fileUrl: string;
    fileSize: string;
  };
}

export interface LessonProgress {
  lessonId: number | string;
  lastPositionSeconds: number;
  watchedSeconds: number;
  durationSeconds: number;
  progressPercent: number;
  isCompleted: boolean;
}

export interface LessonDetail {
  id: string;
  courseId: string;
  title: string;
  description: string;
  durationSeconds: number;
  videoUrl: string | null;
  embedUrl: string | null;
  videoProvider: string | null;
  slideFile: Lesson["slideFile"] | null;
  transcript: string | null;
  transcriptStatus: "pending" | "processing" | "completed" | "failed";
  transcriptErrorMessage?: string | null;
  summary: LessonSummary | null;
  transcriptSegments: TranscriptSegment[];
}

export interface LessonSummary {
  id?: string;
  lessonId?: string;
  summaryText: string;
  keyPoints: string[];
  generatedBy?: string | null;
  createdAt?: string | null;
}

export interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
}

export type LessonTab = "overview" | "transcript" | "summary" | "quiz";

export interface TranscriptSegment {
  time: string;
  title: string;
}
