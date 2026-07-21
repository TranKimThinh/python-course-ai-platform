import { type FormEvent, useEffect, useRef, useState } from "react";
import { Bot, MessageSquarePlus, Send, UserRound } from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  time: string;
}

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
}

const initialSessions: ChatSession[] = [
  { id: "list-comprehension", title: "Giải thích list comprehension", time: "10 phút trước" },
  { id: "for-loop", title: "Hỏi về vòng lặp for", time: "Hôm qua" },
  {
    id: "variables",
    title: "Tóm tắt bài học biến và kiểu dữ liệu",
    time: "2 ngày trước",
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: "user-1",
    role: "user",
    content: "List comprehension là gì?",
  },
  {
    id: "assistant-1",
    role: "assistant",
    content:
      "List comprehension là cú pháp ngắn gọn để tạo list mới từ một iterable trong Python.",
  },
];

type MessagesBySession = Record<string, ChatMessage[]>;

const initialMessagesBySession: MessagesBySession = {
  "list-comprehension": initialMessages,
  "for-loop": [
    {
      id: "user-for-loop",
      role: "user",
      content: "Vòng lặp for hoạt động như thế nào?",
    },
    {
      id: "assistant-for-loop",
      role: "assistant",
      content: "Vòng lặp for dùng để duyệt qua iterable như list, tuple hoặc range.",
    },
  ],
  variables: [
    {
      id: "user-variables",
      role: "user",
      content: "Tóm tắt bài biến và kiểu dữ liệu.",
    },
    {
      id: "assistant-variables",
      role: "assistant",
      content: "Bài học giới thiệu biến, kiểu số, chuỗi, boolean và cách gán giá trị.",
    },
  ],
};

function AIAssistantPage() {
  const [sessions, setSessions] = useState(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState(initialSessions[0].id);
  const [messagesBySession, setMessagesBySession] =
    useState<MessagesBySession>(initialMessagesBySession);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const messages = messagesBySession[activeSessionId] ?? [];

  // Tự động cuộn xuống cuối khi có tin nhắn mới hoặc đang gõ
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleNewSession = () => {
    const id = `session-${Date.now()}`;
    const nextSession: ChatSession = {
      id,
      title: "Cuộc trò chuyện mới",
      time: "Vừa xong",
    };

    setSessions((current) => [nextSession, ...current]);
    setMessagesBySession((current) => ({ ...current, [id]: [] }));
    setActiveSessionId(id);
    setInputValue("");
    setIsTyping(false);
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setInputValue("");
    setIsTyping(false);
  };

  // Hàm xử lý gửi câu hỏi lên BE
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = inputValue.trim();
    if (!question || isTyping) return;

    const sessionId = activeSessionId;
    
    // 1. Thêm tin nhắn của User vào UI ngay lập tức
    setMessagesBySession((current) => ({
      ...current,
      [sessionId]: [
        ...(current[sessionId] ?? []),
        { id: `user-${Date.now()}`, role: "user", content: question },
      ],
    }));
    setInputValue("");
    setIsTyping(true);

    // 2. Cập nhật tiêu đề session nếu đây là câu hỏi đầu tiên
    setSessions((current) =>
      current.map((session) =>
        session.id === activeSessionId && session.title === "Cuộc trò chuyện mới"
          ? { ...session, title: question.slice(0, 48), time: "Vừa xong" }
          : session,
      ),
    );

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch("https://cobweb-lunchbox-upcoming.ngrok-free.dev/api/v1/chatbot/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          message: question,
          lesson_id: null 
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi kết nối với máy chủ!");
      }

      const data = await response.json();

      // 4. Lấy kết quả từ API và hiển thị lên UI
      setMessagesBySession((current) => ({
        ...current,
        [sessionId]: [
          ...(current[sessionId] ?? []),
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.data.reply, // Dữ liệu trả về từ format của Backend
          },
        ],
      }));
    } catch (error) {
      console.error("Lỗi:", error);
      // Hiển thị thông báo lỗi nếu API sập
      setMessagesBySession((current) => ({
        ...current,
        [sessionId]: [
          ...(current[sessionId] ?? []),
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: "Xin lỗi, hiện tại không thể kết nối tới AI. Vui lòng thử lại sau.",
          },
        ],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="page-container py-6 lg:py-8">
      <div className="grid min-h-[calc(100vh-210px)] overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-card lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-slate-50/80 p-4 lg:border-b-0 lg:border-r lg:p-5">
          <h1 className="text-lg font-extrabold text-slate-950">Lịch sử trò chuyện</h1>
          <button
            type="button"
            onClick={handleNewSession}
            className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            <MessageSquarePlus size={18} aria-hidden={true} />
            Cuộc trò chuyện mới
          </button>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible">
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;

              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => handleSelectSession(session.id)}
                  className={`focus-ring min-w-64 rounded-2xl px-4 py-3 text-left transition lg:w-full ${
                    isActive
                      ? "bg-indigo-100 text-indigo-950"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="block truncate text-sm font-bold">{session.title}</span>
                  <span className="mt-1 block text-xs text-slate-500">{session.time}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex min-h-[620px] min-w-0 flex-col">
          <header className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="font-extrabold text-slate-950">AI Assistant</h2>
            <p className="mt-1 text-sm text-slate-500">Hỏi đáp nhanh về Python</p>
          </header>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/50 p-4 sm:p-6">
            {messages.length === 0 && (
              <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                  <Bot size={28} aria-hidden={true} />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-slate-950">
                  Bắt đầu cuộc trò chuyện mới
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Nhập câu hỏi về Python để nhận phản hồi AI thực tế.
                </p>
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <Bot size={18} aria-hidden={true} />
                    </span>
                  )}
                  {/* Sử dụng whitespace-pre-wrap để giữ lại định dạng dòng mới (xuống dòng) từ kết quả AI */}
                  <p
                    className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm whitespace-pre-wrap ${
                      isUser
                        ? "rounded-tr-md bg-indigo-600 text-white"
                        : "rounded-tl-md bg-white text-slate-700"
                    }`}
                  >
                    {message.content}
                  </p>
                  {isUser && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                      <UserRound size={18} aria-hidden={true} />
                    </span>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Bot size={18} aria-hidden={true} />
                </span>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  AI đang trả lời
                  <span className="ml-1 animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white p-4 sm:p-5">
            <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100">
              <label htmlFor="ai-question" className="sr-only">
                Câu hỏi dành cho AI Assistant
              </label>
              <textarea
                id="ai-question"
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
                Gửi
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AIAssistantPage;