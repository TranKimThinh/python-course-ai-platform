import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type CourseProgress } from "./progressTypes";
import { getCourseContinue, unwrapProgressData } from "../../services/progress.service";

interface MyCourseProgressCardProps {
  course: CourseProgress;
}

function MyCourseProgressCard({ course }: MyCourseProgressCardProps) {
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      const response = await getCourseContinue(course.id);
      const continueData = unwrapProgressData(response);
      navigate(`/learning/${course.id}/${continueData.lessonId}`);
    } catch (error) {
      console.warn("Không thể lấy bài học tiếp tục:", error);
      navigate(`/courses/${course.id}`);
    }
  };

  return (
    <article
      className={`overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft ${
        course.isMuted ? "opacity-75 grayscale-[0.35]" : ""
      }`}
    >
      <div className="grid gap-0 md:grid-cols-[180px_1fr]">
        <div className="min-h-40 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-5 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-extrabold backdrop-blur">
            Py
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-950">{course.title}</h3>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Đã hoàn thành {course.completedLessons}/{course.totalLessons} bài học
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-extrabold text-indigo-700">
              {course.progress}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="focus-ring mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Tiếp tục học
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default MyCourseProgressCard;
