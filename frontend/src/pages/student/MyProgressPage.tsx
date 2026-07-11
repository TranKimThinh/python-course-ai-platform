import { useCallback, useEffect, useMemo, useState } from "react";
import AIReviewSuggestionCard from "../../components/progress/AIReviewSuggestionCard";
import MyCourseProgressList from "../../components/progress/MyCourseProgressList";
import ProfileCard from "../../components/progress/ProfileCard";
import ProgressStatsGrid from "../../components/progress/ProgressStatsGrid";
import RecentActivityTimeline from "../../components/progress/RecentActivityTimeline";
import {
  type CourseProgress,
  type ProgressStat,
  type RecentActivity,
} from "../../components/progress/progressTypes";
import { getMyProgress, type MyProgressActivity, type MyProgressData, unwrapProgressData } from "../../services/progress.service";

function MyProgressPage() {
  const [data, setData] = useState<MyProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadMyProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await getMyProgress();
      setData(unwrapProgressData(response));
    } catch (error) {
      console.error("Load my progress failed:", error);
      setData(null);
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải tiến độ học tập.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyProgress();
  }, [loadMyProgress]);

  const stats = useMemo<ProgressStat[]>(() => {
    const values = data?.stats;
    return [
      { id: "courses", icon: "menu_book", value: values?.activeCourses ?? 0, label: "Khóa học đang học" },
      { id: "lessons", icon: "check_circle", value: values?.completedLessons ?? 0, label: "Bài học đã xong" },
      { id: "quiz", icon: "grade", value: `${values?.averageQuizScore ?? 0}/10`, label: "Điểm quiz TB" },
      { id: "ai", icon: "smart_toy", value: values?.aiQuestions ?? 0, label: "Số lần hỏi AI" },
    ];
  }, [data?.stats]);

  const courses = useMemo<CourseProgress[]>(
    () =>
      (data?.courses ?? []).map((course) => ({
        id: course.slug,
        title: course.title,
        completedLessons: course.completedLessons,
        totalLessons: course.totalLessons,
        progress: course.progressPercent,
        imageUrl: course.thumbnailUrl ?? undefined,
      })),
    [data?.courses],
  );

  const activities = useMemo<RecentActivity[]>(
    () => (data?.recentActivities ?? []).map(mapRecentActivity),
    [data?.recentActivities],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
          <div className="page-container py-10 sm:py-14">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Tiến độ học tập của tôi
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Theo dõi lộ trình học Python AI của bạn
            </p>
          </div>
        </section>

        <section className="page-container grid gap-7 py-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:py-10">
          {isLoading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 font-semibold text-slate-600 shadow-card lg:col-span-2">
              Đang tải tiến độ học tập...
            </div>
          ) : errorMessage ? (
            <div className="rounded-[28px] border border-red-100 bg-red-50 p-6 text-red-700 shadow-card lg:col-span-2">
              <h2 className="font-extrabold">Không thể tải tiến độ học tập.</h2>
              <p className="mt-2 text-sm">{errorMessage}</p>
              <button
                type="button"
                onClick={loadMyProgress}
                className="mt-4 rounded-2xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-7 lg:order-1">
                <ProfileCard
                  profile={{
                    name: data?.user.fullName ?? "",
                    email: data?.user.email ?? "",
                    level: data?.user.role === "admin" ? "Quản trị viên" : "Học viên",
                    avatarUrl: data?.user.avatarUrl ?? undefined,
                  }}
                />
                <div className="hidden lg:block">
                  <AIReviewSuggestionCard />
                </div>
                <div className="hidden lg:block">
                  <RecentActivityTimeline activities={activities} />
                </div>
              </div>

              <div className="space-y-7 lg:order-2">
                <ProgressStatsGrid stats={stats} />
                <div className="lg:hidden">
                  <AIReviewSuggestionCard />
                </div>
                <MyCourseProgressList courses={courses} />
                <div className="lg:hidden">
                  <RecentActivityTimeline activities={activities} />
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function mapRecentActivity(activity: MyProgressActivity): RecentActivity {
  const type = activity.type === "quiz_completed" ? "quiz" : activity.type === "ai_question" ? "ai" : "view";
  return {
    id: String(activity.id),
    title: activity.title,
    time: formatDateTime(activity.createdAt),
    icon: type === "quiz" ? "task_alt" : type === "ai" ? "psychology" : "visibility",
    type,
  };
}

function formatDateTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default MyProgressPage;
