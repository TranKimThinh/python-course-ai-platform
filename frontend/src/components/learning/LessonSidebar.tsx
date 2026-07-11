import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { type Lesson } from "./learningTypes";
import { type CourseProgressData } from "../../services/progress.service";

interface LessonSidebarProps {
  lessons: Lesson[];
  selectedLessonId: string;
  courseProgress: CourseProgressData | null;
  onSelectLesson: (lessonId: string) => void;
}

function LessonSidebar({ lessons, selectedLessonId, courseProgress, onSelectLesson }: LessonSidebarProps) {
  const progressMap = new Map((courseProgress?.lessons ?? []).map((progress) => [String(progress.lessonId), progress]));
  const completedCount = courseProgress?.completedLessons ?? lessons.filter((lesson) => lesson.status === "completed").length;
  const totalLessons = courseProgress?.totalLessons ?? lessons.length;
  const progressPercent =
    courseProgress?.progressPercent ?? (totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0);

  return (
    <aside className="rounded-[26px] border border-slate-200 bg-white shadow-card lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] lg:overflow-y-auto">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 p-5 backdrop-blur">
        <h2 className="text-lg font-extrabold text-slate-950">Nội dung khóa học</h2>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600">Hoàn thành: {progressPercent}%</span>
          <span className="font-extrabold text-indigo-600">
            {completedCount}/{totalLessons}
          </span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="space-y-2 p-3">
        {lessons.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">Khóa học này chưa có bài học.</p>
        ) : (
          lessons.map((lesson) => {
            const isLocked = lesson.status === "locked";
            const isCurrent = lesson.id === selectedLessonId;
            const progressItem = progressMap.get(String(lesson.id));
            const progressValue = progressItem?.progressPercent ?? lesson.progressPercent ?? 0;
            const isCompleted = progressItem?.isCompleted === true || lesson.status === "completed";
            const isInProgress = !isCompleted && progressValue > 0;
            const statusLabel = isCompleted
              ? "Đã hoàn thành"
              : isCurrent
                ? "Đang học"
                : isInProgress
                  ? `Đang học • ${progressValue}%`
                  : "Chưa học";

            return (
              <button
                key={lesson.id}
                type="button"
                disabled={isLocked}
                onClick={() => onSelectLesson(lesson.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  isCurrent
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm"
                    : isLocked
                      ? "cursor-not-allowed border-transparent bg-slate-50 text-slate-400 opacity-70"
                      : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex gap-3">
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isCurrent
                        ? "bg-indigo-600 text-white"
                        : isCompleted
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isLocked ? <Lock size={17} /> : isCompleted ? <CheckCircle2 size={18} /> : <PlayCircle size={18} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold leading-5">{lesson.title}</span>
                    <span className="mt-1 flex items-center justify-between gap-2 text-xs font-medium">
                      <span>{lesson.duration}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isCurrent
                            ? "bg-indigo-600 text-white"
                            : isCompleted
                              ? "bg-emerald-100 text-emerald-700"
                              : isInProgress
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </span>
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default LessonSidebar;
