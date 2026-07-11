import { ArrowRight, Code2, PlayCircle, Route, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import CourseStatsBar from "./CourseStatsBar";
import { type CourseDetail } from "./courseDetailTypes";

interface CourseHeroProps {
  course: CourseDetail;
}

function CourseHero({ course }: CourseHeroProps) {
  const nextLessonId = course.currentLessonId ?? course.firstLessonId;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-indigo-200/50 blur-3xl" />
      <div className="absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />

      <div className="page-container relative grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-16 xl:py-20">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm backdrop-blur">
            <PlayCircle size={16} />
            Khóa học được đề xuất
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {course.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{course.description}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {nextLessonId ? (
              <Link
                to={`/learning/${course.id}/${nextLessonId}`}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700"
              >
                Bắt đầu học ngay
                <ArrowRight size={18} />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center rounded-2xl bg-slate-300 px-6 py-3.5 text-sm font-bold text-white"
              >
                Khóa học chưa có bài học
              </button>
            )}
            <a
              href="#course-content"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700"
            >
              <Route size={18} />
              Xem lộ trình
            </a>
          </div>

          <div className="mt-10">
            <CourseStatsBar course={course} />
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 p-6 text-white shadow-2xl shadow-indigo-200">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-white/10" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-400/30 blur-3xl" />
            <div className="relative">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">AI classroom</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1.15fr_.85fr]">
                <div className="rounded-3xl bg-slate-950/70 p-5 font-mono text-xs leading-6 shadow-inner">
                  <div className="mb-3 flex items-center gap-2 text-slate-400">
                    <Code2 size={15} />
                    lesson.py
                  </div>
                  <p><span className="text-fuchsia-300">topic</span> = <span className="text-emerald-300">course.title</span></p>
                  <p><span className="text-blue-300">for</span> lesson <span className="text-blue-300">in</span> course:</p>
                  <p className="pl-5">ai_mentor.explain(lesson)</p>
                  <p className="pl-5 text-blue-300">practice()</p>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl bg-white p-5 text-slate-950">
                    <p className="text-sm font-extrabold">AI Robot</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      Mình sẽ giúp bạn hiểu từng khái niệm trong khóa học bằng ví dụ trực quan.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                    <p className="text-sm font-bold text-blue-100">Transcript + Summary</p>
                    <div className="mt-3 space-y-2">
                      <span className="block h-2 rounded bg-white/20" />
                      <span className="block h-2 w-4/5 rounded bg-white/20" />
                      <span className="block h-2 w-2/3 rounded bg-blue-300/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {course.studentsThisMonth && (
            <div className="absolute -bottom-6 left-6 max-w-[260px] rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <TrendingUp size={22} />
                </span>
                <div>
                  <p className="font-extrabold text-slate-950">{course.studentsThisMonth}</p>
                  <p className="text-xs font-medium text-slate-500">Tham gia trong tháng này</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CourseHero;
