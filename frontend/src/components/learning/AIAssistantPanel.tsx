import { type FormEvent } from "react";
import { Bot, Send } from "lucide-react";
import ChatMessage from "./ChatMessage";
import SuggestedQuestions from "./SuggestedQuestions";
import { type ChatMessage as ChatMessageType } from "./learningTypes";

interface AIAssistantPanelProps {
  messages: ChatMessageType[];
  input: string;
  suggestedQuestions: string[];
  isSending?: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onSelectSuggestedQuestion: (question: string) => void;
}

function AIAssistantPanel({
  messages,
  input,
  suggestedQuestions,
  isSending = false,
  onInputChange,
  onSend,
  onSelectSuggestedQuestion,
}: AIAssistantPanelProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;
    onSend();
  };

  return (
    <aside className="flex rounded-[26px] border border-slate-200 bg-white shadow-card lg:max-h-[calc(100vh-116px)] lg:flex-col">
      <div className="border-b border-slate-100 p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Bot size={22} />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
          </span>
          <div>
            <h2 className="font-extrabold text-slate-950">Trợ lý AI bài học</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Hỏi AI nếu bạn chưa hiểu nội dung trong video.
            </p>
          </div>
        </div>
      </div>

      <div className="max-h-[420px] flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4 lg:max-h-none">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isSending && (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Bot size={18} />
            </span>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              AI đang trả lời
              <span className="ml-1 animate-pulse">...</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border-t border-slate-100 p-4">
        <SuggestedQuestions questions={suggestedQuestions} onSelect={onSelectSuggestedQuestion} />
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            name="question"
            autoComplete="off"
            value={input}
            disabled={isSending}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="focus-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            aria-label="Gửi câu hỏi"
          >
            <Send size={19} />
          </button>
        </form>
      </div>
    </aside>
  );
}

export default AIAssistantPanel;