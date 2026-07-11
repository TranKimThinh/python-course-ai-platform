import { useCallback, useEffect, useMemo, useState } from "react";
import { Braces, Download, Menu, Share2, X } from "lucide-react";
import { Link, NavLink, useParams } from "react-router-dom";
import AISummaryContent from "../../components/lesson/AISummaryContent";
import LessonInfoSidebar from "../../components/lesson/LessonInfoSidebar";
import TranscriptList from "../../components/lesson/TranscriptList";
import TranscriptTabs from "../../components/lesson/TranscriptTabs";
import {
  type LessonInfo,
  type SummaryData,
  type TranscriptSegment,
  type TranscriptTab,
} from "../../components/lesson/lessonTypes";
import { getLessonById, getLessonSummary, getLessonTranscript } from "../../services/lesson.service";

const navigation = [
  { label: "Trang chủ", to: "/" },
  { label: "Khóa học", to: "/courses" },
  { label: "AI Assistant", to: "/ai-assistant" },
];

const emptySummary: SummaryData = {
  keyPoints: [],
  concepts: [],
  codeExample: "",
  reviewSuggestion: "",
};

function LessonTranscriptPage() {
  const { courseId, lessonId } = useParams();
  const [activeTab, setActiveTab] = useState<TranscriptTab>("transcript");
  const [searchTerm, setSearchTerm] = useState("");
  const [lessonInfo, setLessonInfo] = useState<LessonInfo>({
    courseName: "",
    lessonName: "",
    duration: "",
    aiStatus: "processing",
  });
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData>(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadLessonContent = useCallback(async () => {
    if (!lessonId) {
      setErrorMessage("Không tìm thấy bài học.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const [lessonResponse, transcriptResponse, summaryResponse] = await Promise.allSettled([
        getLessonById(lessonId),
        getLessonTranscript(lessonId),
        getLessonSummary(lessonId),
      ]);

      if (lessonResponse.status === "fulfilled") {
        setLessonInfo(mapLessonInfo(unwrapApiData(lessonResponse.value), courseId ?? ""));
      } else {
        throw lessonResponse.reason;
      }

      if (transcriptResponse.status === "fulfilled") {
        setTranscriptSegments(mapTranscriptSegments(unwrapApiData(transcriptResponse.value)));
      } else {
        setTranscriptSegments([]);
        console.warn("Transcript API chưa sẵn sàng:", transcriptResponse.reason);
      }

      if (summaryResponse.status === "fulfilled") {
        setSummaryData(mapSummaryData(unwrapApiData(summaryResponse.value)));
      } else {
        setSummaryData(emptySummary);
        console.warn("Summary API chưa sẵn sàng:", summaryResponse.reason);
      }
    } catch (error) {
      console.error("Load lesson transcript failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải dữ liệu bài học.");
      setTranscriptSegments([]);
      setSummaryData(emptySummary);
      setLessonInfo({
        courseName: courseId ? "Khóa học" : "",
        lessonName: "",
        duration: "",
        aiStatus: "failed",
      });
    } finally {
      setIsLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    loadLessonContent();
  }, [loadLessonContent]);

  const filteredTranscripts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return transcriptSegments;

    return transcriptSegments.filter(
      (segment) =>
        segment.title.toLowerCase().includes(normalizedSearch) ||
        segment.content.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm, transcriptSegments]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
          <div className="page-container flex flex-col gap-6 py-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-indigo-600">
                KHÓA HỌC &gt; {lessonInfo.courseName || "BÀI HỌC"}
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                Transcript & Tóm tắt bài học
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => console.log("Download PDF transcript")}
                className="focus-ring inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
              >
                <Download size={17} />
                Tải PDF
              </button>
              <button
                type="button"
                onClick={() => console.log("Share transcript")}
                className="focus-ring inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                <Share2 size={17} />
                Chia sẻ
              </button>
            </div>
          </div>
        </section>

        <section className="page-container grid gap-7 py-10 lg:grid-cols-[300px_minmax(0,1fr)]">
          <LessonInfoSidebar lessonInfo={lessonInfo} courseId={courseId ?? ""} lessonId={lessonId ?? ""} />

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card">
            <TranscriptTabs activeTab={activeTab} onChange={setActiveTab} />
            <div className="p-5 sm:p-7">
              {isLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
                  Đang tải transcript và tóm tắt bài học...
                </div>
              ) : errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm font-semibold text-red-600">
                  {errorMessage}
                </div>
              ) : activeTab === "transcript" ? (
                <TranscriptList
                  searchTerm={searchTerm}
                  segments={filteredTranscripts}
                  onSearchChange={setSearchTerm}
                />
              ) : (
                <AISummaryContent summary={summaryData} courseId={courseId ?? ""} lessonId={lessonId ?? ""} />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function mapLessonInfo(lessonData: unknown, courseId: string): LessonInfo {
  const data = asRecord(lessonData);
  const durationSeconds = Number(getValue(data.durationSeconds, data.duration_seconds, 0));

  return {
    courseName: getStringOrNull(data.courseName, data.course_name, courseId) ?? "Khóa học",
    lessonName: getStringOrNull(data.title, data.lessonTitle, data.lesson_title) ?? "Bài học",
    duration: durationSeconds > 0 ? formatDuration(durationSeconds) : "",
    aiStatus: "processed",
  };
}

function mapTranscriptSegments(payload: unknown): TranscriptSegment[] {
  const data = asRecord(payload);
  const transcript = asRecord(data.transcript);
  const segments = getValue(data.transcriptSegments, data.transcript_segments, transcript.segments);

  if (Array.isArray(segments)) {
    return segments
      .map((segment) => {
        const item = asRecord(segment);
        const time = getStringOrNull(item.time, item.timestamp, item.startTime, item.start_time) ?? "";
        const title = getStringOrNull(item.title, item.text, item.content) ?? "";
        const content = getStringOrNull(item.content, item.text, item.description) ?? "";

        return time || title || content ? { id: String(item.id ?? `${time}-${title}`), time, title, content } : null;
      })
      .filter((segment): segment is TranscriptSegment => Boolean(segment));
  }

  const text = getStringOrNull(
    data.text,
    data.transcriptText,
    data.transcript_text,
    transcript.text,
    transcript.transcriptText,
    transcript.transcript_text,
  );

  return text ? [{ id: "transcript", time: "", title: "Transcript", content: text }] : [];
}

function mapSummaryData(payload: unknown): SummaryData {
  const data = asRecord(payload);
  const summary = asRecord(data.summary);

  return {
    keyPoints: extractStringArray(
      data.keyPoints,
      data.key_points,
      summary.keyPoints,
      summary.key_points,
      summary.points,
      data.points,
    ),
    concepts: extractStringArray(
      data.concepts,
      data.concepts,
      summary.concepts,
      summary.concept,
      summary.keyConcepts,
    ),
    codeExample: getStringOrNull(
      data.codeExample,
      data.code_example,
      summary.codeExample,
      summary.code_example,
      data.code,
      summary.code,
    ) ?? "",
    reviewSuggestion: getStringOrNull(
      data.reviewSuggestion,
      data.review_suggestion,
      summary.reviewSuggestion,
      summary.review_suggestion,
    ) ?? "",
  };
}

function extractStringArray(...sources: unknown[]): string[] {
  for (const source of sources) {
    if (Array.isArray(source)) {
      return source.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  }

  return [];
}

function formatDuration(durationSeconds: number) {
  const totalSeconds = Math.max(Math.round(durationSeconds), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} phút${seconds ? ` ${seconds} giây` : ""}`;
}

function unwrapApiData(payload: unknown): unknown {
  const record = asRecord(payload);
  if ("data" in record) return record.data;
  if ("items" in record) return record.items;
  return payload;
}

function getStringOrNull(...values: unknown[]) {
  const value = values.find((item) => typeof item === "string" && item.trim().length > 0);
  return typeof value === "string" ? value : null;
}

function getValue<T>(...values: Array<T | null | undefined>): T {
  const value = values.find((item) => item !== null && item !== undefined);
  return value as T;
}

function asRecord(value: unknown): Record<string, unknown> {
  return (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
}

function TranscriptNavbar() {
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
          <Link to="/login" className="focus-ring rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600">
            Đăng nhập
          </Link>
          <Link to="/register" className="focus-ring rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700">
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
        <nav className="page-container flex flex-col gap-1 border-t border-slate-100 bg-white py-4 md:hidden">
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
        </nav>
      )}
    </header>
  );
}

function TranscriptFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-container grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <p className="font-extrabold text-slate-950">Python AI Learning</p>
          <p className="mt-2 text-sm text-slate-500">© 2026 Python AI Learning. Nâng tầm tri thức công nghệ Việt.</p>
        </div>
        <FooterGroup title="Học tập" links={["Về chúng tôi", "Hướng dẫn"]} />
        <FooterGroup title="Pháp lý & Liên hệ" links={["Điều khoản dịch vụ", "Chính sách bảo mật", "Liên hệ"]} />
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="mb-3 font-bold text-slate-950">{title}</h3>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <Link key={link} to="/" className="text-sm text-slate-500 transition hover:text-indigo-600">
            {link}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LessonTranscriptPage;
