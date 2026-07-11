import { Bot, CheckCircle2, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { type RecentActivity } from "./profileTypes";

interface RecentActivitiesCardProps {
  activities: RecentActivity[];
}

const iconMap = {
  video: PlayCircle,
  quiz: CheckCircle2,
  ai: Bot,
};

const colorMap = {
  video: "group-hover:bg-blue-600 group-hover:text-white bg-blue-50 text-blue-600",
  quiz: "group-hover:bg-emerald-600 group-hover:text-white bg-emerald-50 text-emerald-600",
  ai: "group-hover:bg-indigo-600 group-hover:text-white bg-indigo-50 text-indigo-600",
};

function RecentActivitiesCard({ activities }: RecentActivitiesCardProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card">
      <h2 className="text-lg font-extrabold text-slate-950">Hoạt động gần đây</h2>
      <p className="mt-1 text-sm text-slate-500">Lịch sử học tập của bạn trong 7 ngày qua</p>

      <div className="mt-5 space-y-3">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];

          return (
            <article key={activity.id} className="group flex gap-3 rounded-2xl p-3 transition hover:bg-slate-50">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${colorMap[activity.type]}`}>
                <Icon size={19} />
              </span>
              <div>
                <p className="text-sm font-bold leading-5 text-slate-800">{activity.title}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">{activity.time}</p>
              </div>
            </article>
          );
        })}
      </div>

      <Link
        to="/profile/activities"
        className="focus-ring mt-5 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
      >
        Xem toàn bộ hoạt động
      </Link>
    </section>
  );
}

export default RecentActivitiesCard;
