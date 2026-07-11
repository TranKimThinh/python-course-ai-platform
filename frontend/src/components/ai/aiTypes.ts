export type MessageRole = "assistant" | "user";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  time: string;
  code?: string;
  source?: string;
}

export interface SuggestedQuestion {
  id: string;
  label: string;
}

export interface LearningProgressItem {
  id: string;
  title: string;
  status: "completed" | "current" | "pending";
}
