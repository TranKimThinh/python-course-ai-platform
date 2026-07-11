import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CirclePlay,
  Code2,
  FileText,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.12),transparent_26%),radial-gradient(circle_at_85%_30%,rgba(59,130,246,0.12),transparent_25%)]" />
      <div className="page-container relative grid items-center gap-14 py-16 lg:grid-cols-[0.94fr_1.06fr] lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            <Sparkles size={16} />
            Học tập thế hệ mới cùng AI
          </div>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Học Python thông minh hơn với <span className="text-indigo-600">AI</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Nền tảng học Python tích hợp AI hỗ trợ phân tích video bài giảng, tóm tắt nội dung và giải đáp
            thắc mắc theo từng bài học.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/courses"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Bắt đầu học ngay
              <ArrowRight size={19} />
            </Link>
            <Link
              to="/courses"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <CirclePlay size={19} />
              Xem khóa học
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
            {["Lộ trình rõ ràng", "AI hỗ trợ 24/7", "Học theo tiến độ riêng"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <LearningDashboard />
      </div>
    </section>
  );
}

function LearningDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
      <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-indigo-300/30 to-blue-300/30 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 p-3 shadow-soft sm:p-5">
        <div className="mb-4 flex items-center justify-between px-1">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-300">
            Python cơ bản · Bài 08
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-3">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500">
              <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:28px_28px]" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur">
                <CirclePlay size={29} />
              </div>
              <span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                Vòng lặp trong Python
              </span>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 font-mono text-xs leading-6 sm:text-sm">
              <div className="mb-2 flex items-center gap-2 text-slate-400">
                <Code2 size={15} />
                lesson_08.py
              </div>
              <p>
                <span className="text-fuchsia-400">for</span> <span className="text-sky-300">student</span>{" "}
                <span className="text-fuchsia-400">in</span> <span className="text-amber-300">classroom</span>:
              </p>
              <p className="pl-5">
                <span className="text-sky-300">student</span>.<span className="text-emerald-300">learn</span>(
                <span className="text-orange-300">"Python"</span>)
              </p>
            </div>
          </div>

          <div className="flex min-h-64 flex-col rounded-2xl bg-white p-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Bot size={19} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">AI Assistant</p>
                <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Sẵn sàng hỗ trợ
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3 py-4 text-xs leading-5">
              <div className="ml-5 rounded-2xl rounded-tr-sm bg-slate-100 p-3 text-slate-700">
                Giải thích vòng lặp <code>for</code> giúp mình nhé?
              </div>
              <div className="mr-4 rounded-2xl rounded-tl-sm bg-indigo-50 p-3 text-indigo-950">
                Vòng lặp <code>for</code> giúp duyệt lần lượt từng phần tử trong một tập dữ liệu...
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-[11px] text-slate-400">
              <FileText size={14} />
              Hỏi AI về bài học này...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
