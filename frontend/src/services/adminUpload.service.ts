import { apiFetch } from "../config/api";

export function uploadLessonVideoFile(payload: { lessonId: string; file: File; durationSeconds?: number }) {
  const formData = new FormData();
  formData.append("lessonId", payload.lessonId);
  formData.append("file", payload.file);
  if (payload.durationSeconds !== undefined) formData.append("durationSeconds", String(payload.durationSeconds));
  return apiFetch("/admin/upload/video", { method: "POST", body: formData });
}

export function uploadLessonYoutube(payload: { lessonId: string; videoUrl: string; durationSeconds?: number }) {
  return apiFetch("/admin/upload/youtube", { method: "POST", body: JSON.stringify(payload) });
}

export function uploadLessonSlide(payload: { lessonId: string; file: File }) {
  const formData = new FormData();
  formData.append("lessonId", payload.lessonId);
  formData.append("file", payload.file);
  return apiFetch("/admin/upload/slide", { method: "POST", body: formData });
}
