import {
  ArrowLeft,
  Award,
  Bot,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  History,
  MessageCircle,
  PlayCircle,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProfileActivities,
  type ActivityItem,
  type ActivityStats,
  type ActivityUser,
  type Pagination,
  type ProfileActivitiesData,
} from "../../services/activity.service";
import { unwrapProgressData } from "../../services/progress.service";

type ActivityGroup = "Hôm nay" | "Hôm qua" | "Cũ hơn";

const activityIconByType: Record<string, LucideIcon> = {
  lesson_completed: PlayCircle,
  lesson_watched: PlayCircle,
  lesson_started: PlayCircle,
  quiz_completed: CheckCircle2,
  ai_question: Bot,
  profile_updated: UserRound,
  certificate_received: Award,
  course_started: GraduationCap,
  course_continued: GraduationCap,
};

const activityClassByType: Record<string, string> = {
  lesson_completed: "bg-blue-50 text-blue-600",
  lesson_watched: "bg-blue-50 text-blue-600",
  lesson_started: "bg-blue-50 text-blue-600",
  quiz_completed: "bg-emerald-50 text-emerald-600",
  ai_question: "bg-indigo-50 text-indigo-600",
  profile_updated: "bg-slate-100 text-slate-600",
  certificate_received: "bg-amber-50 text-amber-600",
  course_started: "bg-violet-50 text-violet-600",
  course_continued: "bg-violet-50 text-violet-600",
};

function ProfileActivitiesPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [user, setUser] = useState<ActivityUser | null>(null);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("all");
  const [timeRange, setTimeRange] = useState("all");

  const loadActivities = useCallback(
    async (page = 1, append = false) => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await getProfileActivities({
          keyword,
          type,
          timeRange,
          page,
          pageSize: 10,
        });
        const data = unwrapProgressData(response) as ProfileActivitiesData;

        setUser(data.user ?? null);
        setStats(data.stats ?? null);
        setPagination(data.pagination ?? null);
        setItems((current) => (append ? [...current, ...(data.items ?? [])] : data.items ?? []));
      } catch (error) {
        console.error("Load activities failed:", error);
        if (!append) setItems([]);
        setErrorMessage(error instanceof Error ? error.message : "Không thể tải hoạt động.");
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, timeRange, type],
  );

  useEffect(() => {
    loadActivities(1, false);
  }, [loadActivities]);

  const groupedActivities = useMemo(() => groupActivities(items), [items]);
  const hasMore = pagination ? pagination.page < pagination.totalPages : false;
  const initials = getInitials(user?.fullName ?? "");

  const resetFilters = () => {
    setKeyword("");
    setType("all");
    setTimeRange("all");
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <div className="page-container py-10 sm:py-14">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <nav className="flex items-center gap-2 text-sm font-medium text-[#464555]" aria-label="Breadcrumb">
              <Link to="/profile" className="transition hover:text-[#3525cd]">
                Hồ sơ cá nhân
              </Link>
              <span aria-hidden={true}>/</span>
              <span className="text-[#3525cd]">Hoạt động</span>
            </nav>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Toàn bộ hoạt động</h1>
            <p className="mt-3 text-lg leading-8 text-[#464555]">
              Xem lại lịch sử học tập, quiz và tương tác AI của bạn trên hệ thống.
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#c7c4d8] bg-white px-5 py-3 font-bold transition hover:border-[#3525cd] hover:text-[#3525cd]"
          >
            <ArrowLeft size={19} aria-hidden={true} />
            Quay lại hồ sơ
          </Link>
        </div>

        <div className="grid gap-7 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-3">
            <section className="card-elevation-1 rounded-2xl border border-[#c7c4d8]/70 bg-white p-6 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#e2dfff] bg-[#3525cd] text-2xl font-extrabold text-white">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" /> : initials}
              </div>
              <h2 className="mt-4 text-xl font-extrabold">{user?.fullName ?? ""}</h2>
              <p className="mt-1 break-all text-sm text-[#464555]">{user?.email ?? ""}</p>
              <span className="mt-3 inline-flex rounded-full bg-[#e5eeff] px-3 py-1 text-xs font-bold text-[#3525cd]">
                {user?.role === "admin" ? "Quản trị viên" : "Học viên"}
              </span>

              <div className="mt-6 space-y-3">
                <ProfileStat icon={BookOpen} label="Bài học" value={String(stats?.lessons ?? 0)} />
                <ProfileStat icon={CheckCircle2} label="Quiz" value={String(stats?.quizzes ?? 0)} />
                <ProfileStat icon={MessageCircle} label="Hỏi AI" value={String(stats?.aiQuestions ?? 0)} />
              </div>
            </section>
          </aside>

          <main className="lg:col-span-9">
            <section className="card-elevation-1 rounded-2xl border border-[#c7c4d8]/70 bg-white p-4 sm:p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_190px_180px_auto_auto]">
                <div className="relative transition focus-within:scale-[1.01]">
                  <Search
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#777587]"
                    aria-hidden={true}
                  />
                  <input
                    type="search"
                    name="activitySearch"
                    autoComplete="off"
                    aria-label="Tìm hoạt động"
                    placeholder="Tìm hoạt động..."
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#c7c4d8] bg-[#f8f9ff] pl-11 pr-4 outline-none transition focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15"
                  />
                </div>

                <select
                  id="activityType"
                  name="activityType"
                  aria-label="Lọc theo loại hoạt động"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="h-12 rounded-xl border border-[#c7c4d8] bg-white px-3 outline-none transition focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15"
                >
                  <option value="all">Loại: Tất cả</option>
                  <option value="lesson_completed">Bài học</option>
                  <option value="quiz_completed">Quiz</option>
                  <option value="ai_question">Tương tác AI</option>
                  <option value="profile_updated">Tài khoản</option>
                  <option value="certificate_received">Chứng nhận</option>
                </select>

                <select
                  id="timeRange"
                  name="timeRange"
                  aria-label="Lọc theo thời gian"
                  value={timeRange}
                  onChange={(event) => setTimeRange(event.target.value)}
                  className="h-12 rounded-xl border border-[#c7c4d8] bg-white px-3 outline-none transition focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15"
                >
                  <option value="all">Thời gian: Tất cả</option>
                  <option value="today">Hôm nay</option>
                  <option value="yesterday">Hôm qua</option>
                  <option value="week">7 ngày qua</option>
                  <option value="month">30 ngày qua</option>
                </select>

                <button
                  type="button"
                  onClick={() => loadActivities(1, false)}
                  disabled={isLoading}
                  className="h-12 rounded-xl bg-[#3525cd] px-5 font-bold text-white transition hover:bg-[#2d1fb7] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Lọc
                </button>
                <button
                  type="button"
                  aria-label="Làm mới bộ lọc"
                  onClick={resetFilters}
                  className="flex h-12 items-center justify-center rounded-xl border border-[#c7c4d8] bg-white px-4 text-[#464555] transition hover:border-[#3525cd] hover:text-[#3525cd] active:scale-95"
                >
                  <RefreshCw size={20} aria-hidden={true} />
                </button>
              </div>
            </section>

            {errorMessage ? (
              <section className="card-elevation-1 mt-7 rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-red-700">
                <h2 className="text-xl font-extrabold">Không thể tải hoạt động.</h2>
                <p className="mt-2 text-sm">{errorMessage}</p>
              </section>
            ) : isLoading && items.length === 0 ? (
              <section className="card-elevation-1 mt-7 rounded-2xl border border-[#c7c4d8]/70 bg-white px-6 py-10 font-semibold text-[#464555]">
                Đang tải hoạt động...
              </section>
            ) : items.length > 0 ? (
              <div className="mt-7 space-y-8">
                {groupedActivities.map(({ group, activities }) => (
                  <section key={group}>
                    <h2 className="mb-4 text-lg font-extrabold text-[#3525cd]">{group}</h2>
                    <div className="timeline-line relative space-y-4">
                      {activities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                      ))}
                    </div>
                  </section>
                ))}

                {hasMore && (
                  <button
                    type="button"
                    onClick={() => loadActivities((pagination?.page ?? 1) + 1, true)}
                    disabled={isLoading}
                    className="mx-auto flex items-center gap-2 rounded-xl border border-[#c7c4d8] bg-white px-6 py-3 font-bold text-[#464555] transition hover:bg-[#e5eeff] hover:text-[#3525cd] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ChevronDown size={20} aria-hidden={true} />
                    {isLoading ? "Đang tải..." : "Tải thêm hoạt động"}
                  </button>
                )}
              </div>
            ) : (
              <section className="card-elevation-1 mt-7 rounded-2xl border border-[#c7c4d8]/70 bg-white px-6 py-14 text-center">
                <History size={48} className="mx-auto text-[#777587]" aria-hidden={true} />
                <h2 className="mt-5 text-2xl font-bold">Chưa có hoạt động nào.</h2>
                <p className="mx-auto mt-3 max-w-lg leading-7 text-[#464555]">
                  Khi bạn học bài, làm quiz hoặc hỏi AI, hoạt động sẽ xuất hiện tại đây.
                </p>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#eff4ff] px-4 py-3 text-left">
      <Icon size={20} className="text-[#3525cd]" aria-hidden={true} />
      <span className="flex-1 text-sm font-medium text-[#464555]">{label}</span>
      <strong className="text-[#3525cd]">{value}</strong>
    </div>
  );
}

function ActivityCard({ activity }: { activity: ActivityItem }) {
  const Icon = activityIconByType[activity.type] ?? History;
  const iconColorClass = activityClassByType[activity.type] ?? "bg-slate-100 text-slate-600";

  return (
    <article className="group relative flex gap-4 pl-1">
      <span
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-[#f8f9ff] ${iconColorClass}`}
      >
        <Icon size={18} aria-hidden={true} />
      </span>
      <div className="card-elevation-1 min-w-0 flex-1 rounded-2xl border border-[#c7c4d8]/70 bg-white p-5 transition group-hover:border-[#3525cd]/35">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-bold leading-6 transition-colors group-hover:text-[#3525cd]">{activity.title}</h3>
            {activity.description && <p className="mt-1 text-sm leading-6 text-[#464555]">{activity.description}</p>}
            <p className="mt-2 text-xs font-semibold text-[#777587]">{formatDateTime(activity.createdAt)}</p>
          </div>
          {activity.actionLabel && activity.actionUrl && (
            <Link
              to={activity.actionUrl}
              className="shrink-0 rounded-lg bg-[#eff4ff] px-3 py-2 text-sm font-bold text-[#3525cd] transition hover:bg-[#e5eeff]"
            >
              {activity.actionLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function groupActivities(items: ActivityItem[]): Array<{ group: ActivityGroup; activities: ActivityItem[] }> {
  const groups: Record<ActivityGroup, ActivityItem[]> = {
    "Hôm nay": [],
    "Hôm qua": [],
    "Cũ hơn": [],
  };

  items.forEach((item) => {
    groups[getActivityGroup(item.createdAt)].push(item);
  });

  return (Object.keys(groups) as ActivityGroup[])
    .map((group) => ({ group, activities: groups[group] }))
    .filter(({ activities }) => activities.length > 0);
}

function getActivityGroup(value?: string | null): ActivityGroup {
  if (!value) return "Cũ hơn";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Cũ hơn";
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startYesterday = startToday - 24 * 60 * 60 * 1000;
  const timestamp = date.getTime();
  if (timestamp >= startToday) return "Hôm nay";
  if (timestamp >= startYesterday) return "Hôm qua";
  return "Cũ hơn";
}

function formatDateTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default ProfileActivitiesPage;
