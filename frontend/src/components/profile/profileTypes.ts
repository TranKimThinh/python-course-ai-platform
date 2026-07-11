export interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  time: string;
  icon: string;
  type: "video" | "quiz" | "ai";
}

export type PasswordFormErrors = Partial<Record<keyof PasswordFormData, string>>;
