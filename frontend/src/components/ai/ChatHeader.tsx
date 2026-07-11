import { Bot, History, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ChatHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-100 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
          <Bot size={24} />
        </span>
        <div>
          <h1 className="font-extrabold text-slate-950">Trợ lý học tập Python</h1>
          <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Đang trực tuyến
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => console.log("Open AI chat history")}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
          aria-label="Lịch sử chat"
        >
          <History size={18} />
        </button>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
          aria-label="Cài đặt"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
