import {
  BookOpen,
  Check,
  CheckCircle2,
  CheckSquare,
  Circle,
  Copy,
  Info,
  Lightbulb,
  Medal,
  RefreshCw,
  Rocket,
  Terminal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface QuizResultSummary {
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
  courseName: string;
  lessonName: string;
  messageTitle: string;
  messageDescription: string;
}

type QuestionStatus = "correct" | "incorrect";

interface ReviewAnswer {
  id: string;
  content: string;
  isCorrect?: boolean;
  isUserChoice?: boolean;
}

interface ReviewQuestion {
  id: string;
  number: number;
  status: QuestionStatus;
  difficulty: "DỄ" | "TRUNG BÌNH" | "NÂNG CAO";
  question: string;
  code?: string;
  answers: ReviewAnswer[];
  explanation?: string;
}

interface ConfettiParticle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
}

const quizSummary: QuizResultSummary = {
  totalQuestions: 5,
  correctAnswers: 4,
  scorePercent: 80,
  courseName: "Python cơ bản",
  lessonName: "Cấu trúc dữ liệu Python",
  messageTitle: "Tuyệt vời! Bạn đã hoàn thành.",
  messageDescription:
    "Bạn đã nắm vững phần lớn kiến thức về Cấu trúc dữ liệu Python. Chỉ cần một chút luyện tập nữa là hoàn hảo!",
};

const reviewQuestions: ReviewQuestion[] = [
  {
    id: "review-1",
    number: 1,
    status: "correct",
    difficulty: "DỄ",
    question: "Hàm nào dùng để thêm một phần tử vào cuối List trong Python?",
    answers: [
      { id: "append", content: "append()", isCorrect: true, isUserChoice: true },
      { id: "insert", content: "insert()" },
    ],
  },
  {
    id: "review-2",
    number: 2,
    status: "incorrect",
    difficulty: "TRUNG BÌNH",
    question: "Sự khác biệt chính giữa List và Tuple là gì?",
    answers: [
      {
        id: "user-answer",
        content: "List có kích thước cố định, Tuple có thể thay đổi.",
        isUserChoice: true,
      },
      {
        id: "correct-answer",
        content: "List là mutable (có thể sửa), Tuple là immutable (không thể sửa).",
        isCorrect: true,
      },
    ],
    explanation:
      "Trong Python, List cho phép bạn thêm, xóa hoặc thay đổi giá trị của các phần tử sau khi tạo. Ngược lại, Tuple sau khi được tạo ra thì không thể thay đổi nội dung, giúp bảo vệ dữ liệu và tối ưu hiệu suất bộ nhớ.",
  },
  {
    id: "review-3",
    number: 3,
    status: "correct",
    difficulty: "NÂNG CAO",
    question: "Kết quả của đoạn code sau là gì?",
    code: 'my_dict = {"a": 1, "b": 2}\nprint(my_dict.get("c", 0))',
    answers: [{ id: "zero", content: "0", isCorrect: true, isUserChoice: true }],
  },
];

const difficultyStyles: Record<ReviewQuestion["difficulty"], string> = {
  DỄ: "bg-emerald-100 text-emerald-700",
  "TRUNG BÌNH": "bg-amber-100 text-amber-700",
  "NÂNG CAO": "bg-violet-100 text-violet-700",
};

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const colors = ["#3525cd", "#0058be", "#4f46e5", "#adc6ff"];
    let animationFrameId = 0;
    let isRunning = true;
    let particles: ConfettiParticle[] = [];

    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const createParticles = () => {
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight,
        width: 6 + Math.random() * 7,
        height: 10 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 1.5 + Math.random() * 3,
        drift: -1 + Math.random() * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: -0.08 + Math.random() * 0.16,
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((particle) => {
        particle.y += particle.speed;
        particle.x += particle.drift;
        particle.rotation += particle.rotationSpeed;

        if (particle.y > window.innerHeight + particle.height) {
          particle.y = -particle.height;
          particle.x = Math.random() * window.innerWidth;
        }

        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillStyle = particle.color;
        context.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
        context.restore();
      });

      if (isRunning) animationFrameId = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    createParticles();
    window.addEventListener("resize", resizeCanvas);
    animationFrameId = window.requestAnimationFrame(draw);

    const stopTimer = window.setTimeout(() => {
      isRunning = false;
      window.cancelAnimationFrame(animationFrameId);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }, 5000);

    return () => {
      isRunning = false;
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(stopTimer);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed left-0 top-0 z-10 h-full w-full"
      aria-hidden={true}
    />
  );
}

function ReviewCard({ question }: { question: ReviewQuestion }) {
  const [copied, setCopied] = useState(false);
  const isCorrect = question.status === "correct";

  const copyCode = async () => {
    if (!question.code) return;
    await navigator.clipboard?.writeText(question.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article
      className={`glass-card rounded-xl border-l-4 p-5 transition-all duration-300 hover:-translate-y-1 sm:p-7 ${
        isCorrect ? "border-l-[#3525cd]" : "border-l-[#ba1a1a]"
      }`}
    >
      <div className="flex gap-4">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isCorrect ? "bg-[#eff4ff] text-[#3525cd]" : "bg-[#ffdad6] text-[#ba1a1a]"
          }`}
        >
          {isCorrect ? <Check size={20} aria-hidden={true} /> : <span className="text-xl font-bold">×</span>}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-sm font-bold ${isCorrect ? "text-[#3525cd]" : "text-[#ba1a1a]"}`}>
              CÂU HỎI {question.number}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${difficultyStyles[question.difficulty]}`}>
              {question.difficulty}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-semibold leading-7 text-[#0b1c30] sm:text-xl">{question.question}</h3>

          {question.code && (
            <div className="group relative mt-5 overflow-hidden rounded-lg bg-[#0f172a]">
              <button
                type="button"
                aria-label="Sao chép đoạn code"
                onClick={copyCode}
                className="absolute right-3 top-3 rounded-md p-2 text-slate-300 opacity-40 transition hover:bg-white/10 hover:text-white group-hover:opacity-100"
              >
                {copied ? <Check size={17} aria-hidden={true} /> : <Copy size={17} aria-hidden={true} />}
              </button>
              <pre className="overflow-x-auto p-5 pr-14 font-mono text-sm leading-6 text-slate-100">
                <code>{question.code}</code>
              </pre>
            </div>
          )}

          <div className="mt-5 space-y-3">
            {question.answers.map((answer) => {
              const isWrongChoice = answer.isUserChoice && !answer.isCorrect;
              const answerClass = answer.isCorrect
                ? "border-[#3525cd] bg-[#eff4ff] text-[#0b1c30]"
                : isWrongChoice
                  ? "border-[#ba1a1a] bg-[#ffdad6]/60 text-[#650008]"
                  : "border-[#c7c4d8] bg-white text-[#464555]";

              return (
                <div
                  key={answer.id}
                  className={`flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-start ${answerClass}`}
                >
                  <div className="flex items-start gap-3">
                    {answer.isCorrect ? (
                      <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#3525cd]" aria-hidden={true} />
                    ) : (
                      <Circle
                        size={20}
                        className={`mt-0.5 shrink-0 ${isWrongChoice ? "text-[#ba1a1a]" : "text-[#777587]"}`}
                        aria-hidden={true}
                      />
                    )}
                    <span className="font-medium leading-6">{answer.content}</span>
                  </div>

                  {(isWrongChoice || (answer.isCorrect && question.status === "incorrect")) && (
                    <span
                      className={`w-fit shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                        isWrongChoice ? "bg-[#ba1a1a] text-white" : "bg-[#3525cd] text-white"
                      }`}
                    >
                      {isWrongChoice ? "LỰA CHỌN CỦA BẠN" : "ĐÁP ÁN ĐÚNG"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {question.explanation && (
            <div className="mt-5 rounded-lg border border-[#adc6ff] bg-[#e5eeff]/70 p-4">
              <div className="flex gap-3">
                <Info size={20} className="mt-0.5 shrink-0 text-[#0058be]" aria-hidden={true} />
                <div>
                  <h4 className="font-bold text-[#0058be]">Giải thích chi tiết:</h4>
                  <p className="mt-1 leading-6 text-[#464555]">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function QuizResultPage() {
  const navigate = useNavigate();
  const { lessonId = "lesson-4" } = useParams();

  return (
    <div className="relative bg-[#f8f9ff] text-[#0b1c30]">
      <ConfettiCanvas />

      <div className="page-container relative z-20 py-12 sm:py-16">
        <section className="mx-auto max-w-3xl text-center" aria-labelledby="result-title">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-[#e5eeff] px-4 py-2 text-sm font-semibold text-[#3525cd]">
            <Lightbulb size={17} aria-hidden={true} />
            {quizSummary.courseName} · {quizSummary.lessonName}
          </div>

          <div className="score-circle relative mx-auto mt-8 h-48 w-48 rounded-full p-3 shadow-xl shadow-indigo-200/70">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white shadow-inner">
              <span className="text-5xl font-extrabold tracking-tight text-[#3525cd]">
                {quizSummary.correctAnswers}/{quizSummary.totalQuestions}
              </span>
              <span className="mt-1 text-sm font-medium text-[#464555]">Câu đúng</span>
            </div>
            <span className="absolute bottom-2 right-1 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#0058be] text-white shadow-lg">
              <Medal size={25} aria-hidden={true} />
            </span>
          </div>

          <h1 id="result-title" className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
            {quizSummary.messageTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#464555] sm:text-lg">
            {quizSummary.messageDescription}
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/learning/python-basic/lesson-4")}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#3525cd] px-6 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 active:scale-95"
            >
              <RefreshCw size={20} aria-hidden={true} />
              Học lại bài này
            </button>
            <button
              type="button"
              onClick={() => navigate("/ai-assistant")}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#3525cd]/30 bg-[#d3e4fe] px-6 py-4 font-bold text-[#3525cd] transition hover:bg-[#e5eeff] active:scale-95"
            >
              <Lightbulb size={20} aria-hidden={true} />
              Hỏi AI giải thích lại
            </button>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl" aria-labelledby="review-title">
          <div className="flex flex-col gap-4 border-b border-[#c7c4d8] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="review-title" className="flex items-center gap-3 text-2xl font-bold">
              <CheckSquare size={25} className="text-[#3525cd]" aria-hidden={true} />
              Xem lại câu sai
            </h2>
            <div className="flex items-center gap-5 text-sm font-medium text-[#464555]">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#3525cd]" aria-hidden={true} />
                Đúng (4)
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ba1a1a]" aria-hidden={true} />
                Sai (1)
              </span>
            </div>
          </div>

          <div className="mt-7 grid gap-5">
            {reviewQuestions.map((question) => (
              <ReviewCard key={question.id} question={question} />
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl" aria-labelledby="next-steps-title">
          <h2 id="next-steps-title" className="text-2xl font-bold">
            Gợi ý cho bạn
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate("/learning/python-basic/lesson-4/transcript")}
              className="rounded-xl bg-[#eff4ff] p-6 text-left transition-colors hover:bg-[#e5eeff]"
            >
              <BookOpen size={28} className="text-[#3525cd]" aria-hidden={true} />
              <h3 className="mt-4 text-lg font-bold">Đọc tài liệu List</h3>
              <p className="mt-2 leading-6 text-[#464555]">Xem lại các phương thức xử lý mảng nâng cao.</p>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/quiz/${lessonId}`)}
              className="rounded-xl bg-[#0058be]/5 p-6 text-left transition-colors hover:bg-[#0058be]/10"
            >
              <Terminal size={28} className="text-[#0058be]" aria-hidden={true} />
              <h3 className="mt-4 text-lg font-bold">Thực hành Code</h3>
              <p className="mt-2 leading-6 text-[#464555]">Làm bài tập thực tế về Dictionary và Tuple.</p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/learning/python-basic/lesson-5")}
              className="rounded-xl bg-[#e2dfff] p-6 text-left text-[#0f0069] transition hover:brightness-95"
            >
              <Rocket size={28} aria-hidden={true} />
              <h3 className="mt-4 text-lg font-bold">Học bài tiếp theo</h3>
              <p className="mt-2 leading-6">Làm quen với Function và Module trong Python.</p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default QuizResultPage;
