import { apiFetch } from "../config/api";

export function getLessonById(lessonId: string) {
  return apiFetch(`/lessons/${encodeURIComponent(lessonId)}`);
}

export function getLessonResources(lessonId: string) {
  return apiFetch(`/lessons/${encodeURIComponent(lessonId)}/resources`);
}

export function getLessonVideo(lessonId: string) {
  return apiFetch(`/lessons/${encodeURIComponent(lessonId)}/video`);
}

export function getLessonSlides(lessonId: string) {
  return apiFetch(`/lessons/${encodeURIComponent(lessonId)}/slides`);
}

export function getLessonTranscript(lessonId: string) {
  return apiFetch(`/lessons/${encodeURIComponent(lessonId)}/transcript`);
}

export function generateLessonTranscript(lessonId: string | number) {
  return apiFetch(`/admin/lessons/${encodeURIComponent(String(lessonId))}/generate-transcript`, {
    method: "POST",
  });
}

export function getLessonSummary(lessonId: string) {
  return apiFetch(`/lessons/${encodeURIComponent(lessonId)}/summary`);
}
