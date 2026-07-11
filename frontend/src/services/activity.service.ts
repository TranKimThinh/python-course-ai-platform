import { apiFetch } from "../config/api";

export interface ActivityUser {
  id: number | string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role?: string;
}

export interface ActivityStats {
  lessons: number;
  quizzes: number;
  aiQuestions: number;
}

export interface ActivityItem {
  id: number | string;
  type: string;
  title: string;
  description?: string | null;
  courseId?: number | string | null;
  courseSlug?: string | null;
  lessonId?: number | string | null;
  actionLabel?: string | null;
  actionUrl?: string | null;
  createdAt?: string | null;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ProfileActivitiesData {
  user: ActivityUser;
  stats: ActivityStats;
  items: ActivityItem[];
  pagination: Pagination;
}

export interface GetActivitiesParams {
  keyword?: string;
  type?: string;
  timeRange?: string;
  page?: number;
  pageSize?: number;
}

export function getProfileActivities(params: GetActivitiesParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.keyword?.trim()) searchParams.set("keyword", params.keyword.trim());
  if (params.type && params.type !== "all") searchParams.set("type", params.type);
  if (params.timeRange && params.timeRange !== "all") searchParams.set("timeRange", params.timeRange);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("pageSize", String(params.pageSize ?? 10));

  const query = searchParams.toString();
  return apiFetch<{ success?: boolean; message?: string; data?: ProfileActivitiesData } | ProfileActivitiesData>(
    `/profile/activities${query ? `?${query}` : ""}`,
  );
}
