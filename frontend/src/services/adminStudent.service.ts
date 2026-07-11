import { apiFetch } from "../config/api";

export function getAdminStudents(params: {
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const search = new URLSearchParams();
  if (params.keyword) search.set("keyword", params.keyword);
  if (params.status && params.status !== "all") search.set("status", params.status);
  search.set("page", String(params.page ?? 1));
  search.set("pageSize", String(params.pageSize ?? 10));
  return apiFetch(`/admin/students?${search.toString()}`);
}

export function getAdminStudentDetail(studentId: string) {
  return apiFetch(`/admin/students/${studentId}`);
}

export function getAdminStudentProgress(studentId: string) {
  return apiFetch(`/admin/students/${studentId}/progress`);
}

export function updateAdminStudentStatus(studentId: string, status: string) {
  return apiFetch(`/admin/students/${studentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
