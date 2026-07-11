import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import { mapApiUserToAuthUser, type AuthUser, type RegisterPayload } from "../services/auth.types";
import { flushAllProgress } from "../stores/progressSyncStore";

const TOKEN_STORAGE_KEY = "accessToken";
const TOKEN_STORAGE_KEYS = [TOKEN_STORAGE_KEY, "pyai_token", "token", "authToken", "python_ai_learning_token"];

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<AuthUser>;
  loginWithGoogle: (idToken: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  // isLoading = true khi đang khôi phục phiên đăng nhập từ token đã lưu (lúc load lại trang)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function hydrateFromStoredToken() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const apiUser = await authService.getMe(token);
        if (isMounted) setUser(mapApiUserToAuthUser(apiUser));
      } catch {
        // Token hết hạn hoặc không hợp lệ -> đăng xuất
        removeStoredTokens();
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    hydrateFromStoredToken();
    return () => {
      isMounted = false;
    };
    // Chỉ chạy 1 lần khi mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (identifier: string, password: string): Promise<AuthUser> => {
    const newToken = await authService.login({ username: identifier, password });
    removeStoredTokens();
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);

    const apiUser = await authService.getMe(newToken);
    const authUser = mapApiUserToAuthUser(apiUser);
    setUser(authUser);
    localStorage.setItem("user", JSON.stringify(authUser));
    return authUser;
  };

  const loginWithGoogle = async (idToken: string): Promise<AuthUser> => {
    const newToken = await authService.loginWithGoogle(idToken);
    removeStoredTokens();
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);

    const apiUser = await authService.getMe(newToken);
    const authUser = mapApiUserToAuthUser(apiUser);
    setUser(authUser);
    localStorage.setItem("user", JSON.stringify(authUser));
    return authUser;
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    await authService.register(payload);
    // Đăng ký xong không tự đăng nhập luôn (backend không trả token ở bước này),
    // điều hướng người dùng sang trang đăng nhập ở component gọi hàm này.
  };

  const refreshUser = async (): Promise<void> => {
    if (!token) return;
    const apiUser = await authService.getMe(token);
    setUser(mapApiUserToAuthUser(apiUser));
  };

  const logout = async () => {
    try {
      await flushAllProgress();
    } finally {
      removeStoredTokens();
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, token, isLoading, login, loginWithGoogle, register, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  return ctx;
}

function removeStoredTokens() {
  TOKEN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem("user");
}

function getStoredToken() {
  return TOKEN_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find((value): value is string => Boolean(value)) ?? null;
}
