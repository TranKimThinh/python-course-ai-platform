import { Bot, UserRound } from "lucide-react";
import CodeBlock from "./CodeBlock";
import { type ChatMessage as ChatMessageType } from "./aiTypes";

interface ChatMessageProps {
  message: ChatMessageType;
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <Bot size={19} />
        </span>
      )}
      <div className={`max-w-[84%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
            isUser
              ? "rounded-tr-md bg-indigo-600 text-white"
              : "rounded-tl-md bg-slate-100 text-slate-700"
          }`}
        >
          <p className="whitespace-pre-line">{message.content}</p>
          {message.code && <CodeBlock code={message.code} />}
          {message.source && (
            <span className="mt-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              {message.source}
            </span>
          )}
        </div>
        <p className="mt-1 px-1 text-xs font-medium text-slate-400">{message.time}</p>
      </div>
      {isUser && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
          <UserRound size={19} />
        </span>
      )}
    </div>
  );
}

export default ChatMessage;
