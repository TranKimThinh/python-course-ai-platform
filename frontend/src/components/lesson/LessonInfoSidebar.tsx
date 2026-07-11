import { Bot, BookOpen, Clock3, PlayCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { type LessonInfo } from "./lessonTypes";

interface LessonInfoSidebarProps {
  lessonInfo: LessonInfo;
  courseId: string;
  lessonId: string;
}

function LessonInfoSidebar({ lessonInfo, courseId, lessonId }: LessonInfoSidebarProps) {
  const items = [
    { label: "KHÓA HỌC", value: lessonInfo.courseName, icon: BookOpen },
    { label: "BÀI HỌC", value: lessonInfo.lessonName, icon: PlayCircle },
    { label: "THỜI LƯỢNG VIDEO", value: lessonInfo.duration, icon: Clock3 },
  ];

  return (
    <aside className="space-y-5">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="mb-5 text-lg font-extrabold text-slate-950">Thông tin bài học</h2>
        <div className="space-y-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">{item.value}</p>
                </div>
              </div>
            );
          })}

          <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Bot size={20} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">TRẠNG THÁI AI</p>
              <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Đã xử lý
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 to-blue-600 p-5 text-white shadow-soft">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
        <div className="relative">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Sparkles size={24} />
          </span>
          <h2 className="text-lg font-extrabold">Học sâu hơn với AI</h2>
          <p className="mt-2 text-sm leading-6 text-indigo-50">
            Sử dụng AI Assistant để giải đáp mọi thắc mắc về code Python của bạn ngay lập tức.
          </p>
          <Link
            to="/ai-assistant"
            className="focus-ring mt-5 inline-flex rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Bắt đầu ngay
          </Link>
        </div>
      </section>
    </aside>
  );
}

export default LessonInfoSidebar;
