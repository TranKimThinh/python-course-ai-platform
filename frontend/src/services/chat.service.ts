import { API_BASE_URL } from "../config/api";

export interface ChatSession {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  role: "assistant" | "user";
  content: string;
}

// Hàm lấy token từ nhiều key lưu trữ khác nhau
function getToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("pyai_token") ||
    localStorage.getItem("authToken")
  );
}

// 1. Lấy danh sách lịch sử trò chuyện
export async function getChatSessions(): Promise<ChatSession[]> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/chatbot/sessions`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  });
  
  if (!response.ok) throw new Error("Không thể tải danh sách hội thoại");
  const json = await response.json();
  return json.data;
}

// 2. Lấy chi tiết tin nhắn trong một session
export async function getSessionMessages(sessionId: number): Promise<ChatMessage[]> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/chatbot/sessions/${sessionId}/messages`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  });

  if (!response.ok) throw new Error("Không thể tải tin nhắn");
  const json = await response.json();
  
  return json.data.map((msg: any) => ({
    id: msg.id,
    role: msg.sender,
    content: msg.message_text
  }));
}

// 3. Gửi câu hỏi và nhận phản hồi dạng Stream (Hiệu ứng chữ chạy)
export async function askAI({
  question,
  sessionId,
  lessonId,
  onChunk,
  onSessionIdReceived,
}: {
  question: string;
  sessionId: number | null;
  lessonId?: number | null;
  onChunk: (text: string) => void;
  onSessionIdReceived: (id: number) => void;
}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/chatbot/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({
      message: question,
      lesson_id: lessonId ?? null,
      session_id: sessionId ?? null,
    }),
  });

  if (!response.ok) throw new Error("Lỗi khi kết nối AI stream");

  // Lấy session_id trả về từ Header (nếu là tạo mới session)
  const returnedSessionId = response.headers.get("X-Session-Id");
  if (returnedSessionId) {
    onSessionIdReceived(Number(returnedSessionId));
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  if (reader) {
    let accumulatedText = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      accumulatedText += chunk;
      onChunk(accumulatedText); // Gọi callback mỗi khi có từ mới được bơm về
    }
  }
}