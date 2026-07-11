import { apiFetch } from "../config/api";

export interface AskAIPayload {
  question: string;
  lessonId?: string;
  context?: string | null;
}

const AI_CHAT_ENDPOINT = "/chat/ask";

export async function askAI({ question, lessonId, context }: AskAIPayload): Promise<string> {
  const data = await apiFetch<{ answer?: string; response?: string; message?: string }>(AI_CHAT_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      question,
      lesson_id: lessonId,
      context: context ?? undefined,
    }),
  });

  return (
    data?.answer ??
    data?.response ??
    data?.message ??
    "AI không trả về nội dung."
  );
}
