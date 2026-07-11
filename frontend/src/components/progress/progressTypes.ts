export interface StudentProfile {
  name: string;
  email: string;
  level: string;
  avatarUrl?: string;
}

export interface ProgressStat {
  id: string;
  label: string;
  value: string | number;
  icon: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  time: string;
  icon: string;
  type: "view" | "quiz" | "ai";
}

export interface CourseProgress {
  id: string;
  title: string;
  completedLessons: number;
  totalLessons: number;
  progress: number;
  imageUrl?: string;
  isMuted?: boolean;
}
