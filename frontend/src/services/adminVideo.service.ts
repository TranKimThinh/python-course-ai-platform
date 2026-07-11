import { apiFetch } from "../config/api";

export function getAdminVideos(params: {
  courseId?: string;
  lessonId?: string;
  provider?: string;
  status?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}) {
  const search = new URLSearchParams();
  if (params.courseId && params.courseId !== "all") search.set("courseId", params.courseId);
  if (params.lessonId && params.lessonId !== "all") search.set("lessonId", params.lessonId);
  if (params.provider && params.provider !== "all") search.set("provider", params.provider);
  if (params.status && params.status !== "all") search.set("status", params.status);
  if (params.keyword) search.set("keyword", params.keyword);
  search.set("page", String(params.page ?? 1));
  search.set("pageSize", String(params.pageSize ?? 10));
  return apiFetch(`/admin/videos?${search.toString()}`);
}

export function createAdminVideo(payload: any) {
  return apiFetch("/admin/videos", { method: "POST", body: JSON.stringify(payload) });
}

export function updateAdminVideo(videoId: string, payload: any) {
  return apiFetch(`/admin/videos/${videoId}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function deleteAdminVideo(videoId: string) {
  return apiFetch(`/admin/videos/${videoId}`, { method: "DELETE" });
}

export function generateVideoTranscript(videoId: string) {
  return apiFetch(`/admin/videos/${videoId}/generate-transcript`, { method: "POST" });
}
