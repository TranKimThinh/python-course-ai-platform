import { apiFetch } from "../config/api";
import type { ApiUser, LoginPayload, RegisterPayload } from "./auth.types";

function extractToken(data: unknown): string {
  if (typeof data === "string" && data.length > 0) return data;

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const payload = obj.data && typeof obj.data === "object" ? (obj.data as Record<string, unknown>) : obj;

    if (typeof payload.accessToken === "string") return payload.accessToken;
    if (typeof payload.access_token === "string") return payload.access_token;
    if (typeof payload.token === "string") return payload.token;
  }

  throw new Error("API đăng nhập không trả access token.");
}

export const authService = {
  async login(payload: LoginPayload): Promise<string> {
    const data = await apiFetch<unknown>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return extractToken(data);
  },

  async register(payload: RegisterPayload): Promise<unknown> {
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async loginWithGoogle(idToken: string): Promise<string> {
    const data = await apiFetch<unknown>("/auth/google-login", {
      method: "POST",
      body: JSON.stringify({ id_token_str: idToken }),
    });
    return extractToken(data);
  },

  async getMe(token: string): Promise<ApiUser> {
    const data = await apiFetch<{ data?: ApiUser } | ApiUser>("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data && typeof data === "object" && "data" in data && data.data) {
      return data.data;
    }
    return data as ApiUser;
  },
};

export function parseApiError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Đã có lỗi xảy ra, vui lòng thử lại.";
}
