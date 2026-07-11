import { apiFetch } from "../config/api";

export function getAdminLessons(params: {
  courseId?: string;
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const search = new URLSearchParams();
  if (params.courseId && params.courseId !== "all") search.set("courseId", params.courseId);
  if (params.keyword) search.set("keyword", params.keyword);
  if (params.status && params.status !== "all") search.set("status", params.status);
  search.set("page", String(params.page ?? 1));
  search.set("pageSize", String(params.pageSize ?? 10));
  return apiFetch(`/admin/lessons?${search.toString()}`);
}

export function createAdminLesson(payload: any) {
  return apiFetch("/admin/lessons", { method: "POST", body: JSON.stringify(payload) });
}

export function updateAdminLesson(lessonId: string, payload: any) {
  return apiFetch(`/admin/lessons/${lessonId}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function deleteAdminLesson(lessonId: string) {
  return apiFetch(`/admin/lessons/${lessonId}`, { method: "DELETE" });
}

export function generateLessonTranscript(lessonId: string, force = false) {
  return apiFetch(`/admin/lessons/${lessonId}/generate-transcript?force=${force}`, { method: "POST" });
}

export function generateLessonSummary(lessonId: string) {
  return apiFetch(`/admin/lessons/${lessonId}/generate-summary`, { method: "POST" });
}
