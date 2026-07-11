import { Bot, BookOpen, CheckCircle2, Star } from "lucide-react";
import { type ProgressStat } from "./progressTypes";

interface ProgressStatsGridProps {
  stats: ProgressStat[];
}

const statIcons = {
  menu_book: BookOpen,
  check_circle: CheckCircle2,
  grade: Star,
  smart_toy: Bot,
};

function ProgressStatsGrid({ stats }: ProgressStatsGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = statIcons[stat.icon as keyof typeof statIcons] ?? BookOpen;

        return (
          <article
            key={stat.id}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Icon size={23} />
            </span>
            <p className="text-3xl font-extrabold text-slate-950">{stat.value}</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">{stat.label}</p>
          </article>
        );
      })}
    </section>
  );
}

export default ProgressStatsGrid;
