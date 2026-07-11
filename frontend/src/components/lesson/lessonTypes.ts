export interface LessonInfo {
  courseName: string;
  lessonName: string;
  duration: string;
  aiStatus: "processed" | "processing" | "failed";
}

export interface TranscriptSegment {
  id: string;
  time: string;
  title: string;
  content: string;
}

export interface SummaryData {
  keyPoints: string[];
  concepts: string[];
  codeExample: string;
  reviewSuggestion: string;
}

export type TranscriptTab = "transcript" | "summary";
