import {
  Bot,
  Brain,
  ChevronDown,
  GraduationCap,
  Headset,
  HelpCircle,
  MessageCircle,
  PlayCircle,
  Search,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const quickGuides = [
  {
    title: "Tạo tài khoản",
    description: "Đăng ký nhanh chóng.",
    icon: UserPlus,
    to: "/register",
  },
  {
    title: "Đăng ký khóa học",
    description: "Bắt đầu lộ trình của bạn.",
    icon: GraduationCap,
    to: "/courses",
  },
  {
    title: "Học qua video",
    description: "Xem bài giảng chất lượng.",
    icon: PlayCircle,
    to: "/courses/python-basic",
  },
  {
    title: "Hỏi AI Assistant",
    description: "Giải đáp thắc mắc 24/7.",
    icon: Bot,
    to: "/ai-assistant",
  },
];

const learningSteps = [
  {
    title: "Đăng ký / Đăng nhập",
    description: "Người học tạo tài khoản hoặc đăng nhập để bắt đầu sử dụng hệ thống.",
  },
  {
    title: "Chọn khóa học Python",
    description: "Xem danh sách khóa học và chọn khóa học phù hợp với trình độ.",
  },
  {
    title: "Xem video bài giảng",
    description: "Học viên xem bài giảng theo từng chương, từng bài học.",
  },
  {
    title: "Sử dụng transcript và tóm tắt",
    description: "Hệ thống AI hỗ trợ tạo transcript và tóm tắt nội dung chính của bài học.",
  },
  {
    title: "Hỏi AI khi chưa hiểu",
    description: "AI Assistant trả lời câu hỏi dựa trên nội dung bài giảng và transcript.",
  },
  {
    title: "Làm quiz và theo dõi tiến độ",
    description: "Học viên làm bài kiểm tra sau bài học và xem tiến độ học tập của mình.",
  },
];

const faqs = [
  {
    question: "Làm sao để xem khóa học?",
    answer: "Bạn có thể truy cập mục Khóa học trên thanh menu chính, chọn một khóa học bất kỳ và nhấn Bắt đầu học ngay.",
  },
  {
    question: "Làm sao để tiếp tục bài học đang học?",
    answer: "Hệ thống tự động lưu tiến độ. Bạn chỉ cần vào Dashboard hoặc vào lại trang bài học để tiếp tục.",
  },
  {
    question: "AI Assistant trả lời dựa trên đâu?",
    answer: "AI được xây dựng để hỗ trợ dựa trên nội dung bài giảng, transcript video và tài liệu học tập liên quan.",
  },
  {
    question: "Transcript bài học dùng để làm gì?",
    answer: "Transcript giúp bạn theo dõi nội dung video bằng văn bản, dễ dàng tìm kiếm từ khóa và hỗ trợ AI phân tích bài học.",
  },
  {
    question: "Làm sao để xem kết quả quiz?",
    answer: "Sau khi nộp bài, hệ thống sẽ hiển thị điểm số và đáp án chi tiết ngay lập tức để bạn đối chiếu.",
  },
  {
    question: "Làm sao để xem tiến độ học tập?",
    answer: "Truy cập mục Tiến độ hoặc Hồ sơ cá nhân để xem phần trăm hoàn thành khóa học và lộ trình tiếp theo.",
  },
];

const aiTips = [
  "Đặt câu hỏi rõ ràng, trực tiếp vào vấn đề.",
  "Nêu tên bài học hoặc đoạn code cần hỏi.",
  "Dùng AI để ôn tập sau mỗi bài học.",
];

const suggestedQuestions = ["Tóm tắt bài học này", "Giải thích đoạn code này", "Tạo câu hỏi ôn tập"];

function GuidePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30]">
      <section className="page-container py-14 text-center sm:py-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e5eeff] px-4 py-2 text-sm font-bold text-[#3525cd]">
          <HelpCircle size={17} aria-hidden={true} />
          Trung tâm hướng dẫn
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Hướng dẫn sử dụng Python AI Learning
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#464555]">
          Tìm hiểu cách học Python, sử dụng AI Assistant, xem transcript, làm quiz và theo dõi tiến độ học tập trên hệ
          thống.
        </p>

        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-[#c7c4d8]/70 bg-white p-2 shadow-lg shadow-indigo-100 transition duration-200 focus-within:scale-[1.02] focus-within:border-[#3525cd]">
          <div className="flex items-center gap-3 rounded-xl bg-[#eff4ff] px-4 py-3">
            <Search size={21} className="shrink-0 text-[#3525cd]" aria-hidden={true} />
            <input
              type="search"
              name="guideSearch"
              autoComplete="off"
              aria-label="Tìm nội dung hướng dẫn"
              placeholder="Tìm nội dung hướng dẫn..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full bg-transparent text-base text-[#0b1c30] outline-none placeholder:text-[#777587]"
            />
          </div>
        </div>
      </section>

      <section className="page-container pb-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickGuides.map((guide) => {
            const Icon = guide.icon;

            return (
              <Link key={guide.title} to={guide.to} className="card-elevation group rounded-2xl bg-white p-6">
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#eff4ff] text-[#3525cd] transition-colors group-hover:bg-[#3525cd] group-hover:text-white">
                  <Icon size={26} aria-hidden={true} />
                </span>
                <h2 className="mt-5 text-lg font-bold">{guide.title}</h2>
                <p className="mt-2 text-[#464555]">{guide.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-container py-14">
        <div className="mb-8 flex items-center gap-4">
          <span className="h-10 w-1.5 rounded-full bg-[#3525cd]" aria-hidden={true} />
          <h2 className="text-3xl font-bold tracking-tight">Lộ trình 6 bước bắt đầu học tập</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {learningSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-[#c7c4d8]/70 bg-white p-6 shadow-sm transition hover:bg-[#eff4ff]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3525cd] text-lg font-extrabold text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 leading-7 text-[#464555]">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-container py-14">
        <h2 className="text-center text-3xl font-bold tracking-tight">Câu hỏi thường gặp</h2>
        <div className="mx-auto mt-9 max-w-4xl space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeFaqIndex === index;
            const buttonId = `guide-faq-button-${index}`;
            const panelId = `guide-faq-panel-${index}`;

            return (
              <article key={faq.question} className="overflow-hidden rounded-2xl border border-[#c7c4d8]/70 bg-white">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  onClick={() => setActiveFaqIndex(isActive ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold transition hover:bg-[#eff4ff] sm:px-6"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={21}
                    className={`shrink-0 text-[#3525cd] transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
                    aria-hidden={true}
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`accordion-content ${isActive ? "active" : ""}`}
                >
                  <p className="px-5 pb-5 leading-7 text-[#464555] sm:px-6">{faq.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-container py-14">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#3525cd] p-6 text-white shadow-2xl shadow-indigo-200 sm:p-8 lg:p-10">
          <Brain
            size={180}
            className="absolute -bottom-12 -right-8 text-white/10"
            aria-hidden={true}
          />

          <div className="relative grid gap-8 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <Bot size={32} aria-hidden={true} />
                <h2 className="text-3xl font-bold">Làm chủ AI Assistant</h2>
              </div>

              <div className="glass-effect mt-7 space-y-4 rounded-2xl border border-white/20 bg-white/10 p-5">
                <div className="ml-auto max-w-[88%] rounded-2xl bg-white px-4 py-3 text-[#0b1c30]">
                  Tóm tắt nội dung bài học về Vòng lặp For giúp tôi.
                </div>
                <div className="max-w-[92%] rounded-2xl bg-white/15 px-4 py-3 leading-7">
                  <p className="font-bold">AI Assistant:</p>
                  <p className="mt-2">Bài học bao gồm 3 ý chính:</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5">
                    <li>Cú pháp vòng lặp for i in range()...</li>
                    <li>Duyệt qua danh sách (list)...</li>
                    <li>Sử dụng break và continue.</li>
                  </ol>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Tóm tắt bài học", "Giải thích code", "Cho ví dụ"].map((chip) => (
                    <span key={chip} className="rounded-full bg-white/15 px-3 py-1.5 text-sm">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-bold">Mẹo nhỏ</h3>
              <ul className="mt-4 space-y-3">
                {aiTips.map((tip) => (
                  <li key={tip} className="flex gap-3 leading-7">
                    <Sparkles size={19} className="mt-1 shrink-0 text-[#adc6ff]" aria-hidden={true} />
                    {tip}
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-xl font-bold">Gợi ý câu hỏi</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pb-16 pt-8">
        <div className="rounded-[2rem] border border-[#c7c4d8] bg-[#dce9ff] px-6 py-12 text-center shadow-sm">
          <Headset size={42} className="mx-auto text-[#3525cd]" aria-hidden={true} />
          <h2 className="mt-4 text-3xl font-bold">Bạn vẫn cần hỗ trợ?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-[#464555]">
            Đội ngũ kỹ thuật của chúng tôi luôn sẵn sàng hỗ trợ bạn giải quyết các vấn đề phát sinh trong quá trình học
            tập.
          </p>
          <Link
            to="/contact"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#3525cd] px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition hover:scale-105 active:scale-95"
          >
            <Headset size={20} aria-hidden={true} />
            Liên hệ hỗ trợ
          </Link>
        </div>
      </section>
    </div>
  );
}

export default GuidePage;
