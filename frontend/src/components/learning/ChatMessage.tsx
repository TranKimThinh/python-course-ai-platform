import { Bot, UserRound } from "lucide-react";
import { type ChatMessage as ChatMessageType } from "./learningTypes";

interface ChatMessageProps {
  message: ChatMessageType;
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <Bot size={18} />
        </span>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser
            ? "rounded-tr-md bg-indigo-600 text-white"
            : "rounded-tl-md border border-slate-200 bg-white text-slate-700"
        }`}
      >
        {message.content}
      </div>
      {isUser && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
          <UserRound size={18} />
        </span>
      )}
    </div>
  );
}

export default ChatMessage;
