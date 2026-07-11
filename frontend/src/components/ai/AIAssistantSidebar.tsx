import { CheckCircle2, GraduationCap, PlayCircle, Radio, Sparkles } from "lucide-react";
import { type LearningProgressItem } from "./aiTypes";

interface AIAssistantSidebarProps {
  progressItems: LearningProgressItem[];
}

function AIAssistantSidebar({ progressItems }: AIAssistantSidebarProps) {
  return (
    <aside className="space-y-5">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <GraduationCap size={24} />
          </span>
          <h2 className="text-lg font-extrabold text-slate-950">Thông tin học tập</h2>
        </div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Khóa học hiện tại</p>
        <p className="mt-2 font-extrabold leading-6 text-slate-950">Lập trình Python từ cơ bản đến nâng cao</p>
        <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            AI Assistant: Sẵn sàng
          </div>
          <p className="mt-1 text-xs font-semibold text-emerald-600">V1.4.2</p>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-950">Tiến độ bài học</h2>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            Cấu trúc điều khiển
          </span>
        </div>
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600">Hoàn thành</span>
          <span className="font-extrabold text-indigo-600">65%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-indigo-600 to-blue-500" />
        </div>

        <div className="mt-5 space-y-3">
          {progressItems.map((item) => {
            const Icon =
              item.status === "completed" ? CheckCircle2 : item.status === "current" ? PlayCircle : Radio;
            const color =
              item.status === "completed"
                ? "text-emerald-600 bg-emerald-50"
                : item.status === "current"
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-slate-400 bg-slate-100";

            return (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${color}`}>
                  <Icon size={18} />
                </span>
                <p className="text-sm font-bold text-slate-700">{item.title}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-sm font-bold text-white">
          <Sparkles size={18} />
          AI gợi ý luyện tập sau mỗi bài học.
        </div>
      </section>
    </aside>
  );
}

export default AIAssistantSidebar;
