import { Bot, RotateCcw, Sparkles } from "lucide-react";
import { type ReactNode } from "react";
import { type CourseLevel } from "./CourseCard";

export type DurationFilter = "Dưới 5 giờ" | "5 - 15 giờ" | "Trên 15 giờ";

interface CourseFilterSidebarProps {
  selectedLevels: CourseLevel[];
  selectedDuration: DurationFilter | "";
  onToggleLevel: (level: CourseLevel) => void;
  onSelectDuration: (duration: DurationFilter) => void;
  onReset: () => void;
}

const levels: CourseLevel[] = ["Cơ bản", "Trung cấp", "Nâng cao"];
const durations: DurationFilter[] = ["Dưới 5 giờ", "5 - 15 giờ", "Trên 15 giờ"];

function CourseFilterSidebar({
  selectedLevels,
  selectedDuration,
  onToggleLevel,
  onSelectDuration,
  onReset,
}: CourseFilterSidebarProps) {
  return (
    <aside className="space-y-5">
      <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-950">Bộ lọc</h2>
          <button
            type="button"
            onClick={onReset}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-xs font-bold text-indigo-600 transition hover:text-indigo-800"
          >
            <RotateCcw size={14} />
            Làm mới
          </button>
        </div>

        <FilterGroup title="Trình độ">
          {levels.map((level) => (
            <label key={level} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm text-slate-600 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={selectedLevels.includes(level)}
                onChange={() => onToggleLevel(level)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              {level}
            </label>
          ))}
        </FilterGroup>

        <FilterGroup title="Thời lượng">
          {durations.map((duration) => (
            <label key={duration} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm text-slate-600 transition hover:bg-slate-50">
              <input
                type="radio"
                name="duration"
                checked={selectedDuration === duration}
                onChange={() => onSelectDuration(duration)}
                className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              {duration}
            </label>
          ))}
        </FilterGroup>

        <button
          type="button"
          onClick={onReset}
          className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          <RotateCcw size={16} />
          Làm mới bộ lọc
        </button>
      </div>

      {/* <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-indigo-600 to-blue-600 p-5 text-white shadow-soft">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
        <div className="relative">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Bot size={24} />
          </span>
          <h3 className="text-lg font-extrabold">Ưu đãi AI Pro</h3>
          <p className="mt-2 text-sm leading-6 text-indigo-50">
            Nâng cấp tài khoản để truy cập đầy đủ các dự án thực tế.
          </p>
          <button
            type="button"
            className="focus-ring mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Sparkles size={16} />
            Tìm hiểu thêm
          </button>
        </div>
      </div> */}
    </aside>
  );
}

interface FilterGroupProps {
  title: string;
  children: ReactNode;
}

function FilterGroup({ title, children }: FilterGroupProps) {
  return (
    <div className="border-t border-slate-100 py-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-sm font-extrabold text-slate-900">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default CourseFilterSidebar;
