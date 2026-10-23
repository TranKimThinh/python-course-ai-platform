import { apiFetch } from "../config/api";

export interface QuizOption { id?: number; label: string; content: string }
export interface QuizQuestion {
  id?: number;
  question: string;
  code?: string | null;
  difficulty: "easy" | "medium" | "hard";
  options: QuizOption[];
  correctLabel?: string;
  explanation?: string;
  selectedOptionId?: number | null;
  isCorrect?: boolean;
}
export interface LessonQuiz {
  id: number;
  lessonId: number;
  courseId: number;
  lessonTitle: string;
  title: string;
  status: string;
  durationSeconds: number;
  totalQuestions: number;
  questions?: QuizQuestion[];
  lastAttempt?: { id: number; scorePercent: number } | null;
}
export interface QuizDraft { title: string; durationSeconds: number; questions: QuizQuestion[] }
export interface QuizStart { quiz: LessonQuiz; attemptToken: string; deadline: string; serverTime: string }
export interface QuizResult { id: number; quiz: LessonQuiz; scorePercent: number; correctAnswers: number; totalQuestions: number }
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await apiFetch<{ data: T }>(path, options);
  return response.data;
}
const json = (method: string, body?: unknown): RequestInit => ({ method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
export const getLessonQuiz = (lessonId: string) => request<LessonQuiz | null>(`/lessons/${encodeURIComponent(lessonId)}/quiz`);
export const startQuiz = (id: number) => request<QuizStart>(`/quizzes/${id}/start`, json("POST"));
export const submitQuiz = (id: number, attemptToken: string, answers: Record<string, number>) => request<QuizResult>(`/quizzes/${id}/submit`, json("POST", {
  attemptToken, answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId: Number(questionId), optionId })),
}));
export const getQuizResult = (id: string) => request<QuizResult>(`/quiz-attempts/${encodeURIComponent(id)}`);
export const listAdminQuizzes = (lessonId: string) => request<LessonQuiz[]>(`/admin/quizzes?lessonId=${encodeURIComponent(lessonId)}`);
export const getAdminQuiz = (id: number) => request<LessonQuiz>(`/admin/quizzes/${id}`);
export const generateQuiz = (lessonId: string, count: number, durationSeconds: number) => request<LessonQuiz>(`/admin/lessons/${encodeURIComponent(lessonId)}/quiz/generate`, json("POST", { count, durationSeconds }));
export const saveQuizDraft = (lessonId: string, draft: QuizDraft, id?: number) => request<LessonQuiz>(id ? `/admin/quizzes/${id}` : `/admin/lessons/${encodeURIComponent(lessonId)}/quiz`, json(id ? "PUT" : "POST", draft));
export const publishQuiz = (id: number) => request<LessonQuiz>(`/admin/quizzes/${id}/publish`, json("POST"));
