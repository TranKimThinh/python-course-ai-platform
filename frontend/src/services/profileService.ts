import { apiFetch } from "../config/api";

export interface UpdateProfilePayload {
  full_name: string;
  email: string;
  phone: string;
}

export interface UpdatePasswordPayload {
  old_password: string;
  new_password: string;
}

export const profileService = {
  async updateProfile(userId: number, payload: UpdateProfilePayload): Promise<unknown> {
    return apiFetch(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async updatePassword(userId: number, payload: UpdatePasswordPayload): Promise<unknown> {
    return apiFetch(`/users/${userId}/password`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
