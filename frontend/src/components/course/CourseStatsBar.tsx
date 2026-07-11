import { BookOpen, Bot, Clock3, Signal } from "lucide-react";
import { type CourseDetail } from "./courseDetailTypes";

interface CourseStatsBarProps {
  course: CourseDetail;
}

function CourseStatsBar({ course }: CourseStatsBarProps) {
  const stats = [
    { label: "Trình độ", value: course.level, icon: Signal },
    { label: "Bài học", value: `${course.lessonsCount} bài`, icon: BookOpen },
    { label: "Thời lượng", value: course.duration, icon: Clock3 },
    { label: "AI hỗ trợ", value: course.hasAI ? "Có" : "Không", icon: Bot },
  ];

  return (
    <div className="grid gap-3 rounded-[26px] border border-white/70 bg-white/70 p-3 shadow-card backdrop-blur md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div key={stat.label} className="rounded-2xl bg-white/80 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{stat.label}</p>
            <p className="mt-1 font-extrabold text-slate-950">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}

export default CourseStatsBar;
