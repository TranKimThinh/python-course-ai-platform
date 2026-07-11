import { type KeyboardEvent, useEffect, useRef } from "react";
import { Mic, Paperclip, Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  isTyping: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

function ChatInput({ value, isTyping, onChange, onSend }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  }, [value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-end gap-2">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
          aria-label="Đính kèm file"
        >
          <Paperclip size={18} />
        </button>
        <textarea
          ref={textareaRef}
          name="message"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Nhập câu hỏi về Python tại đây..."
          className="max-h-36 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 sm:flex"
          aria-label="Ghi âm"
        >
          <Mic size={18} />
        </button>
        <button
          type="button"
          onClick={onSend}
          disabled={isTyping || !value.trim()}
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Gửi câu hỏi"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
