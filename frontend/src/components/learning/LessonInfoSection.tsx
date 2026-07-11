import { CheckCircle2 } from "lucide-react";

interface LessonInfoSectionProps {
  title: string;
  description: string;
  isCompleted: boolean;
  isCompleting: boolean;
  onComplete: () => void;
}

function LessonInfoSection({
  title,
  description,
  isCompleted,
  isCompleting,
  onComplete,
}: LessonInfoSectionProps) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">{title}</h1>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
          ) : (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">Bài học này chưa có mô tả.</p>
          )}
        </div>
        <button
          type="button"
          onClick={onComplete}
          disabled={isCompleted || isCompleting}
          className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:from-emerald-500 disabled:to-emerald-500 disabled:shadow-emerald-100"
        >
          <CheckCircle2 size={18} />
          {isCompleted ? "Đã hoàn thành" : isCompleting ? "Đang lưu..." : "Đánh dấu hoàn thành"}
        </button>
      </div>
    </section>
  );
}

export default LessonInfoSection;
