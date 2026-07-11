import {
  BarChart3,
  BookOpen,
  Bot,
  Braces,
  CheckCircle2,
  FileText,
  MessageCircle,
  PlayCircle,
  Route,
  Sparkles,
  Terminal,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";

const missionCards = [
  {
    title: "Học dễ hiểu hơn",
    description:
      "Nội dung được trình bày theo lộ trình từ cơ bản đến nâng cao, thiết kế riêng cho người mới bắt đầu.",
    icon: BookOpen,
  },
  {
    title: "AI hỗ trợ tức thì",
    description:
      "Người học có thể hỏi AI khi chưa hiểu nội dung trong video, nhận câu trả lời dựa trên ngữ cảnh bài học.",
    icon: Bot,
  },
  {
    title: "Theo dõi tiến độ",
    description: "Hệ thống giúp học viên biết mình đã học đến đâu và cần ôn tập phần nào một cách trực quan.",
    icon: BarChart3,
  },
];

const valueCards = [
  { title: "Tự động tạo transcript", icon: FileText },
  { title: "Tóm tắt bài học AI", icon: Sparkles },
  { title: "Chatbot theo video", icon: MessageCircle },
  { title: "Quiz kiểm tra", icon: CheckCircle2 },
];

const processSteps = [
  {
    title: "Xem video bài giảng",
    description: "Truy cập kho video chất lượng cao với lộ trình khoa học.",
    icon: Video,
  },
  {
    title: "AI tạo transcript",
    description: "Tự động chuyển âm thanh thành văn bản và tóm tắt ý chính.",
    icon: FileText,
  },
  {
    title: "Hỏi AI khi chưa hiểu",
    description: "Tương tác trực tiếp với trợ lý ảo ngay tại khung phát video.",
    icon: Bot,
  },
  {
    title: "Làm quiz & Tiến độ",
    description: "Củng cố kiến thức và nhìn lại hành trình học tập hàng ngày.",
    icon: Route,
  },
];

const techStack = [
  "Frontend: ReactJS + TypeScript",
  "Backend: Python FastAPI",
  "Database: MySQL",
  "AI Tech: Transcript, Embedding, RAG, Chatbot",
];

function AboutPage() {
  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30]">
      <section className="hero-gradient overflow-hidden">
        <div className="page-container grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e5eeff] px-4 py-2 text-sm font-bold text-[#3525cd]">
              <Sparkles size={17} aria-hidden={true} />
              Tương lai của giáo dục lập trình
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#0b1c30] sm:text-5xl lg:text-6xl">
              Về Python AI Learning
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#464555]">
              Nền tảng học Python tích hợp AI giúp học viên học tập chủ động, hiểu sâu bài giảng và giải đáp
              thắc mắc ngay trong quá trình học.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center rounded-xl bg-[#3525cd] px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 active:scale-95"
              >
                Khám phá khóa học
              </Link>
              <Link
                to="/ai-assistant"
                className="inline-flex items-center justify-center rounded-xl border border-[#3525cd]/25 bg-white/80 px-6 py-3.5 font-bold text-[#3525cd] shadow-sm backdrop-blur transition hover:bg-[#eff4ff] active:scale-95"
              >
                Dùng thử AI Assistant
              </Link>
            </div>
          </div>

          <div className="relative min-h-[420px]" role="img" aria-label="Minh họa học Python với AI Assistant">
            <div className="absolute inset-8 rounded-full bg-[#3525cd]/20 blur-3xl" aria-hidden={true} />
            <div className="floating-anim relative mx-auto max-w-lg rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-2xl shadow-indigo-200/80 backdrop-blur-xl">
              <div className="rounded-3xl bg-[#0f172a] p-5 text-left font-mono text-sm text-slate-100">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex gap-2" aria-hidden={true}>
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs text-slate-400">lesson.py</span>
                </div>
                <pre className="mt-5 whitespace-pre-wrap leading-7">
                  <code>{'for topic in python_course:\n    ai.explain(topic)\n    learner.practice()'}</code>
                </pre>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#eff4ff] p-4">
                  <PlayCircle className="text-[#3525cd]" size={28} aria-hidden={true} />
                  <p className="mt-3 text-sm font-bold text-[#0b1c30]">Video Learning</p>
                  <p className="mt-1 text-xs leading-5 text-[#464555]">Bài giảng rõ ràng, có transcript tự động.</p>
                </div>
                <div className="rounded-2xl bg-[#0058be]/10 p-4">
                  <Bot className="text-[#0058be]" size={28} aria-hidden={true} />
                  <p className="mt-3 text-sm font-bold text-[#0b1c30]">AI Assistant</p>
                  <p className="mt-1 text-xs leading-5 text-[#464555]">Hỏi đáp theo ngữ cảnh từng bài học.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sứ mệnh của chúng tôi</h2>
          <p className="mt-4 text-lg leading-8 text-[#464555]">
            Python AI Learning được xây dựng với mục tiêu giúp người học tiếp cận lập trình Python dễ dàng hơn
            thông qua video bài giảng, transcript tự động, tóm tắt nội dung và chatbot AI hỗ trợ theo từng bài học.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {missionCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="glass-card group rounded-2xl p-6 transition duration-300 hover:shadow-xl hover:shadow-indigo-100"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5eeff] text-[#3525cd] transition duration-300 group-hover:scale-110">
                  <Icon size={25} aria-hidden={true} />
                </span>
                <h3 className="mt-5 text-xl font-bold">{card.title}</h3>
                <p className="mt-3 leading-7 text-[#464555]">{card.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-container py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Giá trị nổi bật</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="rounded-2xl border border-[#c7c4d8]/70 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-md"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#3525cd]">
                  <Icon size={28} aria-hidden={true} />
                </span>
                <h3 className="mt-5 font-bold">{card.title}</h3>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-container py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Cách hệ thống hỗ trợ học viên</h2>
        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-[#c7c4d8] lg:block" aria-hidden={true} />
          <div className="relative grid gap-6 lg:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article key={step.title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                  <span className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#3525cd] text-white shadow-lg shadow-indigo-200">
                    <Icon size={24} aria-hidden={true} />
                  </span>
                  <span className="mt-5 inline-flex rounded-full bg-[#eff4ff] px-3 py-1 text-xs font-bold text-[#3525cd]">
                    Bước {index + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 leading-6 text-[#464555]">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-container grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Dự án học tập ứng dụng AI</h2>
          <p className="mt-5 text-lg leading-8 text-[#464555]">
            Đây là một dự án website khóa học Python tích hợp AI, hướng đến việc mô phỏng một nền tảng học trực
            tuyến hiện đại. Dự án tập trung vào việc tối ưu hóa trải nghiệm học tập thông qua công nghệ trí tuệ
            nhân tạo thế hệ mới.
          </p>
          <div className="mt-7 flex items-center gap-4">
            <div className="flex -space-x-3" aria-hidden={true}>
              {["AI", "FE", "BE"].map((label) => (
                <span
                  key={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#3525cd] to-[#0058be] text-xs font-extrabold text-white"
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="font-semibold text-[#464555]">Phát triển bởi đội ngũ đam mê công nghệ</p>
          </div>
        </div>

        <div className="group relative rounded-[2rem] bg-[#0f172a] p-7 text-white shadow-2xl shadow-slate-900/30">
          <div
            className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#3525cd]/50 blur-2xl transition duration-300 group-hover:scale-125"
            aria-hidden={true}
          />
          <div className="relative">
            <div className="flex items-center gap-3">
              <Terminal size={24} className="text-[#adc6ff]" aria-hidden={true} />
              <h2 className="text-2xl font-bold">Tech Stack</h2>
            </div>
            <div className="mt-6 space-y-3">
              {techStack.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
                  <Braces size={18} className="mt-0.5 shrink-0 text-[#adc6ff]" aria-hidden={true} />
                  <span className="font-mono text-sm leading-6 text-slate-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pb-16 pt-8">
        <div className="rounded-[2rem] bg-[#e2dfff] bg-[radial-gradient(circle_at_top_right,rgba(53,37,205,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(0,88,190,0.14),transparent_35%)] px-6 py-12 text-center text-[#0f0069] sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Sẵn sàng bắt đầu học Python cùng AI?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8">
            Tham gia cùng hàng ngàn học viên để trải nghiệm phương pháp học tập mới mẻ và hiệu quả nhất hiện nay.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 font-bold text-[#3525cd] shadow-lg shadow-indigo-200/60 transition hover:scale-[1.03] active:scale-95"
            >
              Xem khóa học
            </Link>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center justify-center rounded-xl border border-white/80 bg-white/20 px-6 py-3.5 font-bold text-[#0f0069] backdrop-blur transition hover:scale-[1.03] hover:bg-white/35 active:scale-95"
            >
              Trải nghiệm AI Assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
