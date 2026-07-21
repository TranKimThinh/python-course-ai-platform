import { type FormEvent, useEffect, useRef, useState } from "react";
import { Bot, MessageSquarePlus, Send, UserRound } from "lucide-react";
import { getChatSessions, getSessionMessages, askAI, ChatSession, ChatMessage } from "../../services/chat.service";

function AIAssistantPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Load danh sách session khi mở trang
  const loadSessions = async () => {
    try {
      const data = await getChatSessions();
      setSessions(data);
    } catch (error) {
      console.error("Lỗi tải danh sách hội thoại:", error);
    }
  };

  // Load tin nhắn khi chọn session
  const loadMessages = async (sessionId: number) => {
    try {
      const data = await getSessionMessages(sessionId);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error("Lỗi tải tin nhắn:", error);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (activeSessionId) {
      loadMessages(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = inputValue.trim();
    if (!question || isTyping) return;

    // 1. Thêm tin nhắn của User
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: question }]);
    setInputValue("");
    setIsTyping(true);
    scrollToBottom();

    // 2. Tạo khung tin nhắn trống cho AI để chuẩn bị nhận hiệu ứng stream
    const aiMsgId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: aiMsgId, role: "assistant", content: "" }]);

    try {
      await askAI({
        question,
        sessionId: activeSessionId,
        onSessionIdReceived: (newId) => {
          if (!activeSessionId) {
            setActiveSessionId(newId);
          }
        },
        onChunk: (text) => {
          // Cập nhật liên tục đoạn text stream vào khung chat của AI
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMsgId ? { ...msg, content: text } : msg))
          );
          scrollToBottom();
        }
      });

      // Load lại sidebar để cập nhật updated_at
      loadSessions();

    } catch (error: any) {
      console.error("Lỗi:", error);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === aiMsgId ? { ...msg, content: "Xin lỗi, đã có lỗi kết nối tới AI." } : msg))
      );
    } finally {
      setIsTyping(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const normalizedString = dateString.endsWith("Z") || dateString.includes("+") ? dateString : dateString + "Z";
    const date = new Date(normalizedString);
    return date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' }) + " " + 
           date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="page-container py-6 lg:py-8">
      <div className="grid h-[calc(100vh-140px)] overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-card lg:grid-cols-[290px_minmax(0,1fr)]">
        
        {/* SIDEBAR */}
        <aside className="border-b border-slate-200 bg-slate-50/80 p-4 lg:border-b-0 lg:border-r lg:p-5 flex flex-col h-full overflow-hidden">
          <h1 className="text-lg font-extrabold text-slate-950 shrink-0">Lịch sử trò chuyện</h1>
          <button
            type="button"
            onClick={() => { setActiveSessionId(null); setMessages([]); }}
            className="focus-ring mt-4 shrink-0 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            <MessageSquarePlus size={18} aria-hidden={true} />
            Cuộc trò chuyện mới
          </button>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-1 lg:flex-col lg:space-y-2 lg:overflow-y-auto custom-scrollbar">
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setActiveSessionId(session.id)}
                  className={`focus-ring shrink-0 min-w-64 rounded-2xl px-4 py-3 text-left transition lg:w-full ${
                    isActive ? "bg-indigo-100 text-indigo-950" : "bg-white text-slate-700 hover:bg-slate-100 shadow-sm border border-slate-100"
                  }`}
                >
                  <span className="block truncate text-sm font-bold">{session.title}</span>
                  <span className="mt-1 block text-xs text-slate-500">{formatDate(session.updated_at || session.created_at)}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* KHUNG CHAT */}
        <section className="flex h-full min-w-0 flex-col overflow-hidden">
          <header className="border-b border-slate-100 px-5 py-4 sm:px-6 shrink-0">
            <h2 className="font-extrabold text-slate-950">AI Assistant</h2>
            <p className="mt-1 text-sm text-slate-500">Hỏi đáp nhanh về Python</p>
          </header>

          <div ref={chatContainerRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 custom-scrollbar">
            {messages.length === 0 && (
              <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                  <Bot size={28} aria-hidden={true} />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-slate-950">Bắt đầu cuộc trò chuyện mới</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Nhập câu hỏi về Python để nhận phản hồi từ AI.</p>
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div key={message.id} className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mt-1">
                      <Bot size={18} aria-hidden={true} />
                    </span>
                  )}
                  <p className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm whitespace-pre-wrap ${
                    isUser ? "rounded-tr-md bg-indigo-600 text-white" : "rounded-tl-md bg-white text-slate-700"
                  }`}>
                    {message.content}
                  </p>
                  {isUser && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 mt-1">
                      <UserRound size={18} aria-hidden={true} />
                    </span>
                  )}
                </div>
              );
            })}

            {isTyping && messages[messages.length - 1]?.content === "" && (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Bot size={18} aria-hidden={true} />
                </span>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm flex items-center gap-1">
                  AI đang suy nghĩ <span className="animate-pulse font-bold">...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white p-4 sm:p-5 shrink-0">
            <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
              <textarea
                rows={1}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Nhập câu hỏi của bạn về Python..."
                className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={17} aria-hidden={true} />
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AIAssistantPage;