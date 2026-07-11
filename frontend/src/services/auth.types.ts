export type UserRole = "admin" | "student" | "instructor";

/** Dữ liệu thô trả về từ backend (snake_case, đúng theo response JSON thật) */
export interface ApiUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  status?: string;
  avatar_url?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Dữ liệu dùng trong toàn bộ frontend (camelCase, khớp với AppHeader.tsx và các component khác đang có sẵn) */
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  status?: string;
  avatarUrl?: string | null;
  phone?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Chuyển đổi dữ liệu thô từ API sang định dạng camelCase dùng trong app */
export function mapApiUserToAuthUser(apiUser: ApiUser): AuthUser {
  return {
    id: apiUser.id,
    username: apiUser.username,
    email: apiUser.email,
    fullName: apiUser.full_name,
    role: apiUser.role,
    status: apiUser.status,
    avatarUrl: apiUser.avatar_url,
    phone: apiUser.phone,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  };
}

export interface LoginPayload {
  username: string; // Người dùng có thể nhập email hoặc username, backend nhận field "username"
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role: Extract<UserRole, "student" | "instructor">;
}