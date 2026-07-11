import { ArrowRight, BarChart3, Clock3, Code2, Database, Globe2, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedCourses, mapCourseListItem } from "../../services/course.service";

type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

interface Course {
  id: string;
  title: string;
  level: CourseLevel;
  lessons: number;
  duration: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

const badgeStyles: Record<CourseLevel, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700",
};

function CourseHighlightSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedCourses() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await getFeaturedCourses();
        const mappedCourses = (response.data ?? []).map((course, index) => {
          const mappedCourse = mapCourseListItem(course, index);
          return {
            id: mappedCourse.id,
            title: mappedCourse.title,
            level: mapHomeLevel(mappedCourse.level),
            lessons: mappedCourse.lessons,
            duration: mappedCourse.duration,
            description: mappedCourse.description,
            icon: [Code2, Database, Globe2][index % 3],
            gradient: mappedCourse.gradient,
          };
        });

        if (isMounted) {
          setCourses(mappedCourses);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Không thể tải khóa học nổi bật.");
          setCourses([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFeaturedCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="courses" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="page-container">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Khóa học nổi bật</p>
            <h2 className="section-heading">Lộ trình dành cho mọi cấp độ</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Học từ kiến thức nền tảng đến các ứng dụng Python chuyên sâu trong AI và phát triển web.
            </p>
          </div>
          <Link to="/courses" className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-lg font-bold text-indigo-600 hover:text-indigo-700">
            Xem tất cả
            <ArrowRight size={18} />
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm font-bold text-slate-600">
            Đang tải khóa học nổi bật...
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-sm font-bold text-red-600">
            {errorMessage}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-bold text-slate-500">
            Chưa có khóa học nổi bật.
          </div>
        )}
      </div>
    </section>
  );
}

function mapHomeLevel(level: string): CourseLevel {
  if (level === "Trung cấp") return "Intermediate";
  if (level === "Nâng cao") return "Advanced";
  return "Beginner";
}

function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-soft">
      <div className={`relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${course.gradient}`}>
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/30 bg-white/20 text-white shadow-xl backdrop-blur transition duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon size={38} />
        </div>
        <div className="absolute -bottom-12 -right-8 h-32 w-32 rounded-full bg-white/10" />
      </div>
      <div className="p-6">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${badgeStyles[course.level]}`}>
          {course.level}
        </span>
        <h3 className="mt-4 text-xl font-bold text-slate-950">{course.title}</h3>
        <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{course.description}</p>
        <div className="my-5 flex items-center gap-5 border-y border-slate-100 py-4 text-sm font-medium text-slate-500">
          <span className="flex items-center gap-2">
            <BarChart3 size={17} className="text-indigo-500" />
            {course.lessons} bài học
          </span>
          <span className="flex items-center gap-2">
            <Clock3 size={17} className="text-indigo-500" />
            {course.duration}
          </span>
        </div>
        <Link to={`/courses/${course.id}`} className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-3 font-bold text-indigo-600 transition hover:border-indigo-600 hover:bg-indigo-600 hover:text-white">
          Xem chi tiết
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

export default CourseHighlightSection;
