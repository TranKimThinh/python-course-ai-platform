import { useCallback, useEffect, useState } from "react";
import { Bot, Braces, Building2, Mail, Menu, X } from "lucide-react";
import { Link, NavLink, useParams } from "react-router-dom";
import CourseAIFeatures from "../../components/course/CourseAIFeatures";
import CourseHero from "../../components/course/CourseHero";
import CourseLessonList from "../../components/course/CourseLessonList";
import CourseObjectives from "../../components/course/CourseObjectives";
import CourseSidebar from "../../components/course/CourseSidebar";
import { type CourseDetail, type CourseLesson } from "../../components/course/courseDetailTypes";
import { useAuth } from "../../context/AuthContext";
import { extractCourseLessons, getCourseById, getCourseLessons, mapCourseDetail, mapCourseLesson } from "../../services/course.service";
import {
  getCourseProgress,
  type CourseProgressData,
  unwrapProgressData,
} from "../../services/progress.service";

const navigation = [
  { label: "Trang chủ", to: "/" },
  { label: "Khóa học", to: "/courses" },
  { label: "AI Assistant", to: "/ai-assistant" },
];

function CourseDetailPage() {
  const { courseId } = useParams();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadCourseDetail = useCallback(async () => {
    if (!courseId) {
      setCourse(null);
      setLessons([]);
      setErrorMessage("Không tìm thấy khóa học.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const progressPromise = isAuthenticated
        ? getCourseProgress(courseId)
            .then((response) => unwrapProgressData<CourseProgressData>(response))
            .catch((error) => {
              console.warn("Không thể tải tiến độ khóa học:", error);
              return null;
            })
        : Promise.resolve(null);

      const [courseResponse, lessonsResponse, progressResponse] = await Promise.all([
        getCourseById(courseId),
        getCourseLessons(courseId),
        progressPromise,
      ]);

      if (!courseResponse.data) {
        throw new Error("Không tìm thấy khóa học.");
      }

      const lessonItems = extractCourseLessons(lessonsResponse);
      const mappedLessons = lessonItems.map(mapCourseLesson);
      const mappedCourse = mapCourseDetail(courseResponse.data, lessonItems);

      setCourse(mappedCourse);
      setLessons(mappedLessons);
      setCourseProgress(progressResponse);
    } catch (error) {
      console.error("Load course detail failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải chi tiết khóa học.");
      setCourse(null);
      setLessons([]);
      setCourseProgress(null);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, isAuthenticated]);

  useEffect(() => {
    loadCourseDetail();
  }, [loadCourseDetail]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="page-container py-16">
          <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-card">
            <p className="text-sm font-bold text-slate-600">Đang tải chi tiết khóa học...</p>
          </div>
        </main>
      </div>
    );
  }

  if (errorMessage || !course) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="page-container py-16">
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-10 text-center">
            <h1 className="text-xl font-extrabold text-red-700">Không tìm thấy khóa học.</h1>
            <p className="mt-2 text-sm text-red-600">{errorMessage || "Khóa học không tồn tại hoặc chưa được xuất bản."}</p>
            {courseId && (
              <button
                type="button"
                onClick={loadCourseDetail}
                className="focus-ring mt-5 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Thử lại
              </button>
            )}
            <Link
              to="/courses"
              className="focus-ring mt-5 inline-flex rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-700 transition hover:border-red-300 hover:bg-red-50"
            >
              Quay lại danh sách khóa học
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <CourseHero course={course} />

        <section className="page-container grid gap-8 py-10 lg:grid-cols-[1fr_360px] lg:py-14 xl:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <CourseLessonList courseId={course.id} lessons={lessons} isAuthenticated={isAuthenticated} />
            <CourseObjectives objectives={course.objectives} />
            <CourseAIFeatures features={course.aiFeatures} />
          </div>

          <CourseSidebar
            course={course}
            lessons={lessons}
            isAuthenticated={isAuthenticated}
            courseProgress={courseProgress}
          />
        </section>
      </main>

    </div>
  );
}

function CourseDetailNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="page-container flex h-[72px] items-center justify-between py-3">
        <Link to="/" className="focus-ring flex items-center gap-2 rounded-lg" aria-label="Python AI Learning">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-200">
            <Braces size={21} strokeWidth={2.5} />
          </span>
          <span className="text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
            Python <span className="text-indigo-600">AI</span> Learning
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Điều hướng chính">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `focus-ring rounded px-1 py-2 text-sm font-semibold transition-colors ${
                  isActive || item.to === "/courses"
                    ? "text-indigo-600"
                    : "text-slate-600 hover:text-indigo-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            to="/login"
            className="focus-ring rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="focus-ring rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Đăng ký
          </Link>
        </div>

        <button
          type="button"
          className="focus-ring rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <nav className="page-container flex flex-col gap-1 py-4" aria-label="Điều hướng mobile">
            {navigation.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  item.to === "/courses" ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-indigo-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:hidden">
              <Link
                to="/login"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Đăng ký
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function CourseDetailFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-container py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Braces size={20} />
              </span>
              <span className="font-extrabold text-slate-950">Python AI Learning</span>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Nền tảng đào tạo công nghệ hàng đầu, kết hợp giữa giáo dục truyền thống và trí tuệ nhân tạo để mang
              lại trải nghiệm học tập tối ưu.
            </p>
            <p className="mt-4 text-sm text-slate-500">© 2026 Python AI Learning. Nâng tầm tri thức công nghệ Việt.</p>
          </div>

          <FooterLinkGroup title="Công ty" links={["Về chúng tôi", "Tuyển dụng", "Liên hệ"]} />
          <FooterLinkGroup title="Pháp lý" links={["Điều khoản", "Bảo mật", "Quy định"]} />
          <FooterLinkGroup title="Hỗ trợ" links={["Hướng dẫn", "Trung tâm trợ giúp", "Cộng đồng"]} />
        </div>

        <div className="mt-10 flex gap-3 border-t border-slate-100 pt-7">
          {[Mail, Building2, Bot].map((Icon, index) => (
            <Link
              key={index}
              to="/contact"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-indigo-600 hover:text-white"
              aria-label="Liên kết hỗ trợ"
            >
              <Icon size={18} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkGroupProps {
  title: string;
  links: string[];
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h3 className="mb-4 font-bold text-slate-950">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <Link to="/" className="text-sm text-slate-600 transition hover:text-indigo-600">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseDetailPage;
