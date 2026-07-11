import { Check } from "lucide-react";
import { type CourseObjective } from "./courseDetailTypes";

interface CourseObjectivesProps {
  objectives: CourseObjective[];
}

function CourseObjectives({ objectives }: CourseObjectivesProps) {
  return (
    <section className="rounded-[30px] bg-gradient-to-br from-blue-50 to-indigo-50 p-5 sm:p-7">
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Mục tiêu khóa học</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {objectives.length === 0 ? (
          <p className="rounded-2xl bg-white/80 p-4 text-sm leading-6 text-slate-500 shadow-sm backdrop-blur md:col-span-2">
            Khóa học này chưa có mục tiêu học tập.
          </p>
        ) : (
          objectives.map((objective) => (
            <div key={objective.id} className="flex gap-3 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                <Check size={16} strokeWidth={3} />
              </span>
              <p className="text-sm leading-6 text-slate-700">{objective.text}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default CourseObjectives;
