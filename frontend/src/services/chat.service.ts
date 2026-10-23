import { API_BASE_URL, getStoredToken } from "../config/api";

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
  return getStoredToken();
}

// 1. Lấy danh sách lịch sử trò chuyện
export async function getChatSessions(): Promise<ChatSession[]> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/chatbot/sessions`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });
  
  if (!response.ok) throw new Error("Không thể tải danh sách hội thoại");
  const json = await response.json();
  if (!Array.isArray(json.data)) throw new Error("Dữ liệu hội thoại không hợp lệ.");
  return json.data;
}

// 2. Lấy chi tiết tin nhắn trong một session
export async function getSessionMessages(sessionId: number): Promise<ChatMessage[]> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/chatbot/sessions/${sessionId}/messages`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!response.ok) throw new Error("Không thể tải tin nhắn");
  const json = await response.json();
  if (!Array.isArray(json.data)) throw new Error("Dữ liệu tin nhắn không hợp lệ.");
  
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
  signal,
  timeoutMs = 105_000,
}: {
  timeoutMs?: number;
  signal?: AbortSignal;
  question: string;
  sessionId: number | null;
  lessonId?: number | null;
  onChunk: (text: string) => void;
  onSessionIdReceived: (id: number) => void;
}) {
  const token = getToken();
  const controller = new AbortController();
  let timedOut = false;
  const cancel = () => controller.abort();
  signal?.addEventListener("abort", cancel, { once: true });
  if (signal?.aborted) cancel();
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  try {
    const response = await fetch(`${API_BASE_URL}/chatbot/ask`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: question,
        lesson_id: lessonId ?? null,
        session_id: sessionId ?? null,
      }),
    });

    if (!response.ok) throw new Error(`Không thể gọi AI (HTTP ${response.status}). Vui lòng kiểm tra log backend.`);

    // Lấy session_id trả về từ Header (nếu là tạo mới session)
    const returnedSessionId = response.headers.get("X-Session-Id");
    if (returnedSessionId && Number.isFinite(Number(returnedSessionId)) && Number(returnedSessionId) > 0) {
      onSessionIdReceived(Number(returnedSessionId));
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Không nhận được nội dung trả lời từ AI.");
    const decoder = new TextDecoder("utf-8");

    try {
      let accumulatedText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        onChunk(accumulatedText); // Gọi callback mỗi khi có từ mới được bơm về
      }
      const tail = decoder.decode();
      if (tail) { accumulatedText += tail; onChunk(accumulatedText); }
      if (!accumulatedText.trim()) throw new Error("AI chưa trả về câu trả lời. Vui lòng thử lại.");
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    if (timedOut) throw new Error("AI phản hồi quá lâu. Vui lòng thử lại.");
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", cancel);
  }
}
