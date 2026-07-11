import {
  ArrowRight,
  Bot,
  Clock3,
  GraduationCap,
  LogIn,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCourseContinue, unwrapProgressData } from "../../services/progress.service";

export type CourseLevel = "Cơ bản" | "Trung cấp" | "Nâng cao";

export interface Course {
  id: string;
  title: string;
  level: CourseLevel;
  lessons: number;
  duration: string;
  durationHours: number;
  description: string;
  hasAI?: boolean;
  popular?: boolean;
  isLearning?: boolean;
  progress?: number;
  lessonId?: string;
  gradient: string;
}

interface CourseCardProps {
  course: Course;
}

const levelClassName: Record<CourseLevel, string> = {
  "Cơ bản": "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "Trung cấp": "bg-blue-50 text-blue-700 ring-blue-100",
  "Nâng cao": "bg-purple-50 text-purple-700 ring-purple-100",
};

function CourseCard({ course }: CourseCardProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const statusLabel = course.isLearning
    ? "Đang học"
    : course.progress === 100
      ? "Đã hoàn thành"
      : "Chưa đăng ký";

  const handlePrimaryAction = async () => {
    if (!isAuthenticated || !course.isLearning) {
      navigate(`/courses/${course.id}`);
      return;
    }

    try {
      const response = await getCourseContinue(course.id);
      const continueData = unwrapProgressData(response);
      if (continueData.lessonId) {
        navigate(`/learning/${course.id}/${continueData.lessonId}`);
        return;
      }
    } catch (error) {
      console.warn("Không thể lấy bài học tiếp tục:", error);
    }

    if (course.lessonId) {
      navigate(`/learning/${course.id}/${course.lessonId}`);
      return;
    }

    navigate(`/courses/${course.id}`);
  };

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <Link
        to={`/courses/${course.id}`}
        className="focus-ring block rounded-t-[28px]"
        aria-label={`Xem chi tiết khóa học ${course.title}`}
      >
        <div className={`relative min-h-44 overflow-hidden bg-gradient-to-br ${course.gradient} p-5 text-white`}>
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-12 left-8 h-36 w-36 rounded-full bg-slate-950/20 blur-3xl" />

          <div className="relative z-10 flex flex-wrap gap-2">
            {course.hasAI && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm">
                <Bot size={13} aria-hidden={true} />
                AI Support
              </span>
            )}
            {course.popular && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 shadow-sm">
                <Sparkles size={13} aria-hidden={true} />
                Phổ biến nhất
              </span>
            )}
            <span className="inline-flex rounded-full bg-slate-950/25 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              {statusLabel}
            </span>
          </div>

          <div className="relative z-10 mt-9">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <GraduationCap size={28} aria-hidden={true} />
            </div>
            <p className="mt-4 max-w-xs text-lg font-extrabold leading-tight">{course.title}</p>
          </div>
        </div>

        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className={`rounded-full px-3 py-1 ring-1 ${levelClassName[course.level]}`}>{course.level}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
              <PlayCircle size={13} aria-hidden={true} />
              {course.lessons} bài học
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
              <Clock3 size={13} aria-hidden={true} />
              {course.duration}
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-slate-950">{course.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{course.description}</p>
        </div>
      </Link>

      <div className="p-5 pt-0 sm:p-6 sm:pt-0">
        {isAuthenticated && course.isLearning && (
          <div className="mt-5 rounded-2xl bg-indigo-50/80 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">Tiến độ học tập</span>
              <span className="font-extrabold text-indigo-600">{course.progress ?? 0}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500"
                style={{ width: `${course.progress ?? 0}%` }}
              />
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-5 flex items-start gap-2 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <LogIn size={17} className="mt-0.5 shrink-0 text-indigo-600" aria-hidden={true} />
            Đăng nhập để theo dõi tiến độ học tập.
          </div>
        )}

        <button
          type="button"
          onClick={handlePrimaryAction}
          className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 group-hover:shadow-md"
        >
          {isAuthenticated && course.isLearning ? "Học tiếp" : "Xem chi tiết"}
          {isAuthenticated && course.isLearning ? (
            <PlayCircle size={17} aria-hidden={true} />
          ) : (
            <ArrowRight size={17} aria-hidden={true} />
          )}
        </button>
      </div>
    </article>
  );
}

export default CourseCard;
