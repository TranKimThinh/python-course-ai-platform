import { apiFetch } from "../config/api";

export interface AdminDashboardStats {
  totalStudents: number;
  totalCourses: number;
  aiVideosProcessed: number;
  aiQuestionsCount: number;
}

export interface AdminDashboardActivity {
  id: string | number;
  time: string; // ISO string, page tự format
  subject: string;
  subjectType: "user" | "video";
  action: string;
  status: string;
}

export interface AdminAiProcessingBreakdown {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  recentActivity: AdminDashboardActivity[];
  aiProcessing: AdminAiProcessingBreakdown;
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const payload = await apiFetch<{ data?: AdminDashboardData } | AdminDashboardData>("/admin/dashboard/");
  const data = "data" in payload ? payload.data : payload as AdminDashboardData;
  if (!data?.stats || !data.aiProcessing || !Array.isArray(data.recentActivity)) {
    throw new Error("Chưa nhận được dữ liệu dashboard hợp lệ.");
  }
  return data;
}
