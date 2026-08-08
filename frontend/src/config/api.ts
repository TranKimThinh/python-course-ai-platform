export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  //"https://python-course-ai-platform-backend.onrender.com/api/v1"
  "http://127.0.0.1:3000/api/v1"
).replace(/\/+$/, "");

const TOKEN_STORAGE_KEY = "accessToken";
const LEGACY_TOKEN_STORAGE_KEY = "python_ai_learning_token";

function getStoredToken() {
  return (
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    localStorage.getItem("pyai_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY)
  );
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;
  const token = getStoredToken();
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);

  headers.set("Accept", headers.get("Accept") || "application/json");

  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Không thể tải dữ liệu từ máy chủ.");
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn hoặc bạn chưa đăng nhập.");
    }

    if (response.status === 403) {
      throw new Error("Bạn không có quyền truy cập chức năng quản trị.");
    }

    let message = `API lỗi ${response.status}`;

    if (contentType.includes("application/json")) {
      const errorBody = await response.json().catch(() => null);
      message =
        errorBody?.message ||
        errorBody?.detail?.message ||
        (typeof errorBody?.detail === "string" ? errorBody.detail : undefined) ||
        errorBody?.error ||
        message;
    } else {
      const text = await response.text().catch(() => "");
      if (text) message = text.slice(0, 200);
    }

    throw new Error(normalizeApiErrorMessage(message));
  }

  if (!contentType.includes("application/json")) {
    throw new Error("API không trả về JSON.");
  }

  return response.json();
}

function normalizeApiErrorMessage(message: string) {
  const trimmed = message.trim();

  if (!trimmed || trimmed === "Failed to fetch") {
    return "Không thể tải dữ liệu từ máy chủ.";
  }

  const labels: Record<string, string> = {
    "Vui long dang nhap.": "Vui lòng đăng nhập.",
    "Token khong hop le.": "Token không hợp lệ.",
    "Nguoi dung khong ton tai.": "Người dùng không tồn tại.",
    "Ban khong co quyen truy cap.": "Bạn không có quyền truy cập chức năng quản trị.",
  };

  return labels[trimmed] ?? trimmed;
}
