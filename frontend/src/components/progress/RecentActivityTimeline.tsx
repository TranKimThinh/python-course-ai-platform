import { Bot, CheckCircle2, Eye } from "lucide-react";
import { type RecentActivity } from "./progressTypes";

interface RecentActivityTimelineProps {
  activities: RecentActivity[];
}

const activityIcon = {
  view: Eye,
  quiz: CheckCircle2,
  ai: Bot,
};

const activityClassName = {
  view: "bg-blue-50 text-blue-600",
  quiz: "bg-emerald-50 text-emerald-600",
  ai: "bg-indigo-50 text-indigo-600",
};

function RecentActivityTimeline({ activities }: RecentActivityTimelineProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card">
      <h2 className="mb-6 text-xl font-extrabold text-slate-950">Hoạt động gần đây</h2>
      {activities.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
          Chưa có hoạt động nào.
        </p>
      ) : (
        <div className="space-y-0">
          {activities.map((activity, index) => {
            const Icon = activityIcon[activity.type];
            const isLast = index === activities.length - 1;

            return (
              <div key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && <span className="absolute left-5 top-11 h-[calc(100%-44px)] w-px bg-slate-200" />}
                <span className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activityClassName[activity.type]}`}>
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                  <p className="mt-1 text-xs font-medium text-slate-400">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RecentActivityTimeline;
