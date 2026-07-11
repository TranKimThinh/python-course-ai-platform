import { apiFetch } from "../config/api";

export interface LessonProgressData {
  lessonId: number | string;
  lastPositionSeconds: number;
  watchedSeconds: number;
  durationSeconds: number;
  progressPercent: number;
  isCompleted: boolean;
}

export interface CourseProgressData {
  courseId: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  currentLessonId: number | string | null;
  lessons: LessonProgressData[];
}

export interface CourseContinueData {
  courseId: string;
  lessonId: number | string;
  lastPositionSeconds: number;
  progressPercent: number;
  isCompleted: boolean;
}

export interface MyProgressUser {
  id: number | string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role?: string;
}

export interface MyProgressStats {
  activeCourses: number;
  completedLessons: number;
  averageQuizScore: number;
  aiQuestions: number;
}

export interface MyProgressCourse {
  id: number | string;
  slug: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  level?: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  currentLessonId?: number | string | null;
  lastAccessedAt?: string | null;
}

export interface MyProgressActivity {
  id: number | string;
  type: string;
  title: string;
  description?: string | null;
  courseId?: number | string | null;
  courseSlug?: string | null;
  lessonId?: number | string | null;
  createdAt?: string | null;
}

export interface MyProgressData {
  user: MyProgressUser;
  stats: MyProgressStats;
  courses: MyProgressCourse[];
  recentActivities: MyProgressActivity[];
}

export interface LessonCompleteData {
  lessonProgress: LessonProgressData;
  courseProgress: CourseProgressData;
}

export function getCourseContinue(courseId: string) {
  return apiFetch<{ success?: boolean; message?: string; data?: CourseContinueData } | CourseContinueData>(
    `/courses/${encodeURIComponent(courseId)}/continue`,
  );
}

export function getMyProgress() {
  return apiFetch<{ success?: boolean; message?: string; data?: MyProgressData } | MyProgressData>("/my/progress");
}

export function getCourseProgress(courseId: string) {
  return apiFetch<{ success?: boolean; message?: string; data?: CourseProgressData } | CourseProgressData>(
    `/courses/${encodeURIComponent(courseId)}/progress`,
  );
}

export function getLessonProgress(lessonId: string) {
  return apiFetch<{ success?: boolean; message?: string; data?: LessonProgressData } | LessonProgressData>(
    `/lessons/${encodeURIComponent(lessonId)}/progress`,
  );
}

export function updateLessonProgress(
  lessonId: string,
  payload: {
    courseId: string;
    lastPositionSeconds: number;
    watchedSeconds: number;
    durationSeconds: number;
    progressPercent: number;
  },
  options: { keepalive?: boolean } = {},
) {
  return apiFetch<{ success?: boolean; message?: string; data?: LessonProgressData } | LessonProgressData>(
    `/lessons/${encodeURIComponent(lessonId)}/progress`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      keepalive: options.keepalive,
    },
  );
}

export function completeLesson(
  lessonId: string,
  payload: {
    courseId: string;
    durationSeconds: number;
  },
) {
  return apiFetch<{ success?: boolean; message?: string; data?: LessonCompleteData } | LessonCompleteData>(
    `/lessons/${encodeURIComponent(lessonId)}/complete`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export function unwrapProgressData<T>(payload: { data?: T } | T): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data?: T }).data as T;
  }

  return payload as T;
}
