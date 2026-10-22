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

const FALLBACK_DASHBOARD: AdminDashboardData = {
  stats: { totalStudents: 0, totalCourses: 0, aiVideosProcessed: 0, aiQuestionsCount: 0 },
  recentActivity: [],
  aiProcessing: { pending: 0, processing: 0, completed: 0, failed: 0 },
};

// ⚠️ Backend CHƯA có endpoint này — đây là chỗ gọi sẵn, chờ backend làm xong.
// Khi có, chỉ cần đổi lại đúng path bên dưới nếu khác "/admin/dashboard".
export async function getAdminDashboard(): Promise<AdminDashboardData> {
  try {
    const payload = await apiFetch<{ success?: boolean; data?: AdminDashboardData }>("/admin/dashboard/");
    if (payload && typeof payload === "object" && "data" in payload && payload.data) {
      return payload.data;
    }
    return FALLBACK_DASHBOARD;
  } catch (error) {
    console.warn("[dashboard.service] API dashboard chưa sẵn sàng ở backend:", error);
    return FALLBACK_DASHBOARD;
  }
}