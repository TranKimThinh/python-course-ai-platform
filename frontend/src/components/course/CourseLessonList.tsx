import { Lock, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type CourseLesson } from "./courseDetailTypes";

interface CourseLessonListProps {
  courseId: string;
  lessons: CourseLesson[];
  isAuthenticated: boolean;
}

function CourseLessonList({ courseId, lessons, isAuthenticated }: CourseLessonListProps) {
  const navigate = useNavigate();

  if (lessons.length === 0) {
    return (
      <section className="rounded-[26px] border border-slate-200 bg-white p-6 text-center text-sm font-medium text-slate-500 shadow-card">
        Khóa học này chưa có bài học.
      </section>
    );
  }

  const handleOpenLesson = (lessonId: string, isFree?: boolean) => {
    const learningPath = `/learning/${courseId}/${lessonId}`;

    if (!isAuthenticated && !isFree) {
      navigate("/login", {
        state: {
          from: { pathname: learningPath },
        },
      });
      return;
    }

    navigate(learningPath);
  };

  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-extrabold text-slate-950">Danh sách bài học</h2>
        <p className="mt-1 text-sm text-slate-500">{lessons.length} bài học trong khóa học này.</p>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <button
            key={lesson.id}
            type="button"
            onClick={() => handleOpenLesson(lesson.id, lesson.isFree)}
            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <PlayCircle size={20} aria-hidden={true} />
              </span>

              <span className="min-w-0">
                <span className="block font-semibold text-slate-900">
                  Bài {index + 1}: {lesson.title}
                </span>

                {lesson.description && (
                  <span className="mt-1 block text-sm leading-6 text-slate-500">{lesson.description}</span>
                )}

                {lesson.duration && (
                  <span className="mt-1 block text-xs font-medium text-slate-400">{lesson.duration}</span>
                )}
              </span>
            </div>

            {!lesson.isFree && !isAuthenticated && <Lock size={18} className="shrink-0 text-slate-400" aria-hidden={true} />}
          </button>
        ))}
      </div>
    </section>
  );
}

export default CourseLessonList;
