import { FileText, HelpCircle, ScrollText } from "lucide-react";
import { apiFetch } from "../config/api";
import { type Course } from "../components/course/CourseCard";
import {
  type AIFeature,
  type CourseDetail,
  type CourseLesson,
  type CourseObjective,
} from "../components/course/courseDetailTypes";

interface ApiResponse<T> {
  success?: boolean;
  status?: string;
  message?: string;
  data?: T;
  items?: T;
  errorCode?: string;
  details?: unknown;
}

interface CourseListData {
  items: BackendCourse[];
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

type CoursesResponseData = CourseListData | BackendCourse[];

interface BackendCourse {
  id: number | string;
  slug?: string | null;
  title?: string | null;
  description?: string | null;
  thumbnail_url?: string | null;
  thumbnailUrl?: string | null;
  level?: string | null;
  price?: number | string | null;
  status?: string | null;
  lessons_count?: number | null;
  lessonsCount?: number | null;
  totalLessons?: number | null;
  total_lessons?: number | null;
  duration_seconds?: number | null;
  durationSeconds?: number | null;
  has_ai?: boolean | null;
  hasAI?: boolean | null;
  is_learning?: boolean | null;
  isLearning?: boolean | null;
  progress_percent?: number | null;
  progress?: number | null;
  current_lesson_id?: number | string | null;
  currentLessonId?: number | string | null;
  first_lesson_id?: number | string | null;
  firstLessonId?: number | string | null;
  students_this_month?: string | null;
  studentsThisMonth?: string | null;
  objectives?: Array<string | { id?: string | number; text?: string }> | null;
  ai_features?: Array<{ id?: string; title?: string; description?: string }> | null;
  aiFeatures?: Array<{ id?: string; title?: string; description?: string }> | null;
  // Field bổ sung dùng cho trang Admin (không có ở API public /courses/)
  createdAt?: string | null;
  studentsCount?: number | null;
}

interface BackendLesson {
  id: number | string;
  courseId?: number | string | null;
  course_id?: number | string | null;
  sectionId?: number | string | null;
  section_id?: number | string | null;
  title?: string | null;
  description?: string | null;
  duration_seconds?: number | null;
  durationSeconds?: number | null;
  duration?: string | null;
  status?: "completed" | "available" | "locked" | string | null;
  is_free?: boolean | null;
  isFree?: boolean | null;
  sort_order?: number | null;
  sortOrder?: number | null;
}

interface BackendChapter {
  id: number | string;
  title?: string | null;
  meta?: string | null;
  lessons?: BackendLesson[] | null;
}

const gradients = [
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-indigo-600 via-blue-600 to-cyan-500",
  "from-blue-600 via-indigo-600 to-violet-600",
  "from-purple-600 via-fuchsia-600 to-pink-500",
];

async function requestApi<T>(
  path: string,
  fallbackErrorMessage: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const payload = await apiFetch<ApiResponse<T> | T>(path, options);

    if (Array.isArray(payload)) {
      return {
        success: true,
        message: "OK",
        data: payload as T,
      };
    }

    if (!payload || typeof payload !== "object") {
      throw new Error(fallbackErrorMessage);
    }

    const responsePayload = payload as ApiResponse<T>;
    const isSuccessful =
      responsePayload.success === true ||
      responsePayload.status === "success" ||
      "data" in responsePayload ||
      "items" in responsePayload;

    if (!isSuccessful) {
      throw new Error(responsePayload.message || fallbackErrorMessage);
    }

    return {
      ...responsePayload,
      success: true,
      data: ("data" in responsePayload ? responsePayload.data : responsePayload.items) as T,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || fallbackErrorMessage);
    }
    throw new Error(fallbackErrorMessage);
  }
}

export async function getCourses(params?: {
  keyword?: string;
  level?: string;
  page?: number;
  pageSize?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.keyword) searchParams.set("keyword", params.keyword);
  if (params?.level && params.level !== "all") searchParams.set("level", params.level);
  searchParams.set("page", String(params?.page ?? 1));
  searchParams.set("pageSize", String(params?.pageSize ?? 20));

  const query = searchParams.toString();
  return requestApi<CoursesResponseData>(
    `/courses/${query ? `?${query}` : ""}`,
    "Không thể tải danh sách khóa học.",
  );
}

export async function getFeaturedCourses() {
  return requestApi<BackendCourse[]>("/courses/featured", "Không thể tải khóa học nổi bật.");
}

export async function getCourseById(courseId: string) {
  return requestApi<BackendCourse>(
    `/courses/${encodeURIComponent(courseId)}`,
    "Không thể tải chi tiết khóa học.",
  );
}

export async function getCourseLessons(courseId: string) {
  return requestApi<BackendLesson[] | BackendChapter[]>(
    `/courses/${encodeURIComponent(courseId)}/lessons`,
    "Không thể tải nội dung khóa học.",
  );
}

// ==================== ADMIN — Quản lý khóa học ====================

export interface AdminCoursePayload {
  title: string;
  slug?: string;
  description?: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published" | "hidden";
  price?: number;
  thumbnail_url?: string;
}

export async function getCoursesAdmin(params?: { keyword?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.keyword) searchParams.set("keyword", params.keyword);
  const query = searchParams.toString();

  return requestApi<BackendCourse[]>(
    `/admin/courses/${query ? `?${query}` : ""}`,
    "Không thể tải danh sách khóa học (admin).",
  );
}

export async function createCourseAdmin(payload: AdminCoursePayload) {
  return requestApi<BackendCourse>("/admin/courses/", "Không thể tạo khóa học.", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCourseAdmin(courseId: string | number, payload: Partial<AdminCoursePayload>) {
  return requestApi<BackendCourse>(`/admin/courses/${courseId}`, "Không thể cập nhật khóa học.", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteCourseAdmin(courseId: string | number) {
  return requestApi<{ message: string }>(`/admin/courses/${courseId}`, "Không thể xóa khóa học.", {
    method: "DELETE",
  });
}

/**
 * Chuyển 1 khóa học admin (từ API) sang đúng shape `Course` mà CourseManagementPage.tsx dùng để hiển thị bảng.
 * "students" tạm luôn = 0 vì backend hiện chưa có dữ liệu này (xem ghi chú course_admin_service_snippet.py).
 */
export function mapAdminCourseListItem(course: BackendCourse) {
  return {
    id: String(course.slug || course.id),
    title: course.title || "Chưa có tiêu đề",
    level: mapLevel(course.level),
    lessons: Number(getValue(course.lessonsCount, course.lessons_count, 0)),
    students: course.studentsCount ?? 0,
    status: (course.status as "published" | "draft" | "hidden") ?? "draft",
    createdAt: course.createdAt ?? "",
    thumbnail: course.thumbnailUrl || course.thumbnail_url || "",
  };
}

// ==================== Mapping cho phía học viên (giữ nguyên như cũ) ====================

export function mapCourseListItem(course: BackendCourse, index = 0): Course {
  const durationSeconds = Number(getValue(course.durationSeconds, course.duration_seconds, 0));
  const lessonsCount = Number(getValue(course.lessonsCount, course.lessons_count, course.totalLessons, course.total_lessons, 0));
  const hasAI = Boolean(getValue(course.hasAI, course.has_ai, true));
  const isLearning = Boolean(getValue(course.isLearning, course.is_learning, false));
  const progress = Number(getValue(course.progress, course.progress_percent, 0));
  const currentLessonId = getValue(course.currentLessonId, course.current_lesson_id, null);
  const id = String(course.slug || course.id);

  return {
    id,
    title: course.title || "Chưa có tiêu đề",
    level: mapLevel(course.level),
    lessons: lessonsCount,
    duration: formatDuration(durationSeconds),
    durationHours: secondsToHours(durationSeconds),
    description: course.description || "",
    hasAI,
    popular: index === 0,
    isLearning,
    progress,
    lessonId: currentLessonId ? String(currentLessonId) : undefined,
    gradient: gradients[index % gradients.length],
  };
}

export function mapCourseDetail(course: BackendCourse, lessonsData: Array<BackendLesson | BackendChapter> = []): CourseDetail {
  const lessons = extractCourseLessons(lessonsData);
  const mappedLessons = lessons.map(mapCourseLesson);
  const firstLessonId = mappedLessons[0]?.id ?? null;
  const backendFirstLessonIdValue = getValue(course.firstLessonId, course.first_lesson_id, null);
  const currentLessonIdValue = getValue(course.currentLessonId, course.current_lesson_id, null);
  const backendFirstLessonId = backendFirstLessonIdValue ? String(backendFirstLessonIdValue) : null;
  const currentLessonId = currentLessonIdValue ? String(currentLessonIdValue) : backendFirstLessonId ?? firstLessonId;
  const durationSeconds = Number(getValue(course.durationSeconds, course.duration_seconds, 0));
  const lessonsCount =
    Number(getValue(course.lessonsCount, course.lessons_count, course.totalLessons, course.total_lessons, 0)) ||
    mappedLessons.length;

  return {
    id: String(course.slug || course.id),
    firstLessonId: backendFirstLessonId ?? firstLessonId ?? "",
    currentLessonId: currentLessonId ?? undefined,
    title: course.title || "Chưa có tiêu đề",
    description: course.description || "",
    level: mapLevel(course.level),
    lessonsCount,
    duration: formatDuration(durationSeconds),
    hasAI: Boolean(getValue(course.hasAI, course.has_ai, false)),
    studentsThisMonth: getValue(course.studentsThisMonth, course.students_this_month, ""),
    objectives: mapObjectives(course.objectives),
    aiFeatures: mapAIFeatures(getValue(course.aiFeatures, course.ai_features, null)),
  };
}

export function extractCourseLessons(response: unknown): BackendLesson[] {
  const data = unwrapApiData(response);

  if (Array.isArray(data)) {
    const isFlatLessonArray = data.every((item) => {
      const record = asRecord(item);
      return !Array.isArray(record.lessons);
    });

    if (isFlatLessonArray) {
      return data.map((item) => item as BackendLesson);
    }

    return data.flatMap((chapter) => {
      const record = asRecord(chapter);
      return Array.isArray(record.lessons) ? record.lessons.map((item) => item as BackendLesson) : [];
    });
  }

  const record = asRecord(data);
  if (Array.isArray(record.items)) {
    return record.items.map((item) => item as BackendLesson);
  }

  return [];
}

export function mapCourseLesson(lesson: BackendLesson): CourseLesson {
  return {
    id: String(lesson.id),
    courseId: getOptionalString(lesson.courseId, lesson.course_id),
    sectionId: getOptionalString(lesson.sectionId, lesson.section_id),
    title: lesson.title || "Bài học",
    description: lesson.description || "",
    duration: lesson.duration || formatLessonDuration(Number(getValue(lesson.durationSeconds, lesson.duration_seconds, 0))),
    durationSeconds: Number(getValue(lesson.durationSeconds, lesson.duration_seconds, 0)),
    status: mapLessonStatus(lesson.status),
    isFree: Boolean(getValue(lesson.isFree, lesson.is_free, false)),
    sortOrder: Number(getValue(lesson.sortOrder, lesson.sort_order, 0)),
  };
}

function unwrapApiData(payload: unknown): unknown {
  const record = asRecord(payload);
  if ("data" in record) return record.data;
  if ("items" in record) return record.items;
  return payload;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getOptionalString(...values: Array<number | string | null | undefined>) {
  const value = values.find((item) => item !== null && item !== undefined);
  return value === null || value === undefined ? undefined : String(value);
}

function mapObjectives(objectives: BackendCourse["objectives"]): CourseObjective[] {
  if (!objectives?.length) return [];

  return objectives.map((objective, index) =>
    typeof objective === "string"
      ? { id: `objective-${index + 1}`, text: objective }
      : {
          id: String(objective.id ?? `objective-${index + 1}`),
          text: objective.text || "",
        },
  );
}

function mapAIFeatures(features: BackendCourse["aiFeatures"]): AIFeature[] {
  if (!features?.length) return [];
  const iconMap = [ScrollText, FileText, HelpCircle];

  return features.map((feature, index) => ({
    id: feature.id || `ai-feature-${index + 1}`,
    title: feature.title || "AI feature",
    description: feature.description || "",
    icon: iconMap[index % iconMap.length],
  }));
}

function mapLevel(level?: string | null): Course["level"] {
  if (level === "intermediate") return "Trung cấp";
  if (level === "advanced") return "Nâng cao";
  return "Cơ bản";
}

function mapLessonStatus(status?: string | null): "completed" | "available" | "locked" {
  if (status === "completed" || status === "locked") return status;
  return "available";
}

function formatDuration(durationSeconds: number) {
  const hours = Math.max(1, Math.round(durationSeconds / 3600));
  return `${hours} giờ`;
}

function secondsToHours(durationSeconds: number) {
  return Math.round((durationSeconds / 3600) * 10) / 10;
}

function formatLessonDuration(durationSeconds: number) {
  const minutes = Math.floor(Math.max(durationSeconds, 0) / 60);
  const seconds = Math.max(durationSeconds, 0) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getValue<T>(...values: Array<T | null | undefined>): T {
  const value = values.find((item) => item !== null && item !== undefined);
  return value as T;
}