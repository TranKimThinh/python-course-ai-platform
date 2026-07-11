import { ArrowLeft, GraduationCap, Lightbulb, Terminal, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface QuizOption {
  id: string;
  label: "A" | "B" | "C" | "D";
  content: string;
}

interface QuizQuestion {
  id: string;
  questionNumber: number;
  question: string;
  code?: string;
  options: QuizOption[];
  correctOptionId?: string;
}

interface QuizInfo {
  courseName: string;
  lessonName: string;
  totalQuestions: number;
  durationSeconds: number;
}

const quizInfo: QuizInfo = {
  courseName: "Python cơ bản",
  lessonName: "Vòng lặp trong Python",
  totalQuestions: 5,
  durationSeconds: 14 * 60 + 56,
};

const questions: QuizQuestion[] = [
  {
    id: "q1",
    questionNumber: 1,
    question:
      "Trong Python, từ khóa nào được sử dụng để bắt đầu một vòng lặp lặp lại qua một chuỗi (sequence)?",
    code: 'fruits = ["apple", "banana"]\n... fruit in fruits:\n    print(fruit)',
    options: [
      { id: "a", label: "A", content: "vòng_lặp" },
      { id: "b", label: "B", content: "while" },
      { id: "c", label: "C", content: "for" },
      { id: "d", label: "D", content: "repeat" },
    ],
    correctOptionId: "c",
  },
  {
    id: "q2",
    questionNumber: 2,
    question: "Hàm nào thường được dùng để tạo một dãy số cho vòng lặp for?",
    code: "for number in ...(5):\n    print(number)",
    options: [
      { id: "a", label: "A", content: "sequence()" },
      { id: "b", label: "B", content: "range()" },
      { id: "c", label: "C", content: "numbers()" },
      { id: "d", label: "D", content: "list()" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q3",
    questionNumber: 3,
    question: "Từ khóa nào kết thúc ngay vòng lặp hiện tại?",
    options: [
      { id: "a", label: "A", content: "stop" },
      { id: "b", label: "B", content: "exit" },
      { id: "c", label: "C", content: "break" },
      { id: "d", label: "D", content: "return" },
    ],
    correctOptionId: "c",
  },
  {
    id: "q4",
    question: "Từ khóa nào bỏ qua phần còn lại của lần lặp hiện tại và chuyển sang lần tiếp theo?",
    questionNumber: 4,
    options: [
      { id: "a", label: "A", content: "continue" },
      { id: "b", label: "B", content: "skip" },
      { id: "c", label: "C", content: "pass" },
      { id: "d", label: "D", content: "next" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q5",
    questionNumber: 5,
    question: "Vòng lặp while tiếp tục thực thi trong trường hợp nào?",
    options: [
      { id: "a", label: "A", content: "Khi điều kiện là True" },
      { id: "b", label: "B", content: "Khi điều kiện là False" },
      { id: "c", label: "C", content: "Luôn đúng 10 lần" },
      { id: "d", label: "D", content: "Chỉ khi có danh sách" },
    ],
    correctOptionId: "a",
  },
];

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
};

function QuizPage() {
  const navigate = useNavigate();
  const { lessonId = "lesson-4" } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(quizInfo.durationSeconds);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionId = selectedAnswers[currentQuestion.id];
  const progress = ((currentQuestionIndex + 1) / quizInfo.totalQuestions) * 100;

  useEffect(() => {
    if (remainingSeconds === 0) return;

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [remainingSeconds]);

  const selectAnswer = (optionId: string) => {
    setSelectedAnswers((current) => ({
      ...current,
      [currentQuestion.id]: optionId,
    }));
  };

  const submitQuiz = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const shouldSubmit = window.confirm(
      `Bạn đã trả lời ${answeredCount}/${quizInfo.totalQuestions} câu. Bạn có muốn nộp bài?`,
    );

    if (shouldSubmit) navigate(`/quiz/${lessonId}/result`);
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30]">
      <div className="page-container py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-8 lg:col-span-8" aria-labelledby="quiz-title">
            <div className="space-y-3">
              <h1 id="quiz-title" className="text-3xl font-bold tracking-tight sm:text-[32px]">
                Kiểm tra kiến thức
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#464555]">
                <span className="flex items-center gap-1.5 rounded-full bg-[#e5eeff] px-3 py-1.5">
                  <GraduationCap size={18} aria-hidden={true} />
                  Khóa học: {quizInfo.courseName}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-[#e5eeff] px-3 py-1.5">
                  <Terminal size={18} aria-hidden={true} />
                  Bài học: {quizInfo.lessonName}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="font-bold text-[#3525cd]">Tiến độ</span>
                <span className="text-[#464555]">
                  Câu {currentQuestionIndex + 1} / {quizInfo.totalQuestions}
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-[#dce9ff]"
                role="progressbar"
                aria-label="Tiến độ bài kiểm tra"
                aria-valuemin={1}
                aria-valuemax={quizInfo.totalQuestions}
                aria-valuenow={currentQuestionIndex + 1}
              >
                <div
                  className="h-full rounded-full bg-[#0058be] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <article className="quiz-card-shadow rounded-xl border border-[#c7c4d8] bg-white p-5 sm:p-8">
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-sm font-bold tracking-wider text-[#3525cd]">
                    CÂU HỎI {currentQuestion.questionNumber}
                  </span>
                  <h2 className="text-xl font-semibold leading-relaxed sm:text-2xl">{currentQuestion.question}</h2>
                </div>

                {currentQuestion.code && (
                  <pre className="overflow-x-auto whitespace-pre rounded-lg bg-[#213145] p-4 font-mono text-sm leading-5 text-[#dadcde]">
                    <code>{currentQuestion.code}</code>
                  </pre>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => selectAnswer(option.id)}
                        className={`option-transition group flex w-full items-center gap-4 rounded-lg border p-4 text-left hover:border-[#3525cd] hover:bg-[#eff4ff] ${
                          isSelected ? "active-option" : "border-[#c7c4d8]"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold transition-colors group-hover:bg-[#3525cd] group-hover:text-white ${
                            isSelected ? "bg-[#3525cd] text-white" : "bg-[#dce9ff] text-[#3525cd]"
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="text-base">{option.content}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>

            <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((current) => Math.max(0, current - 1))}
                className="order-2 flex items-center justify-center gap-2 rounded-lg border border-[#777587] px-8 py-4 font-bold transition-colors hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-45 sm:order-1 sm:w-auto"
              >
                <ArrowLeft size={20} aria-hidden={true} />
                Câu trước
              </button>

              <div className="order-1 flex flex-col gap-4 sm:order-2 sm:flex-row">
                <button
                  type="button"
                  onClick={submitQuiz}
                  className="rounded-lg border border-[#3525cd] px-8 py-4 font-bold text-[#3525cd] transition-colors hover:bg-[#e5eeff]"
                >
                  Nộp bài
                </button>
                <button
                  type="button"
                  disabled={currentQuestionIndex === questions.length - 1}
                  onClick={() =>
                    setCurrentQuestionIndex((current) => Math.min(questions.length - 1, current + 1))
                  }
                  className="rounded-lg bg-gradient-to-r from-[#3525cd] to-[#0058be] px-8 py-4 font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100"
                >
                  Câu tiếp theo
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-8 lg:col-span-4" aria-label="Thông tin bài kiểm tra">
            <div className="rounded-xl border border-[#c7c4d8] bg-[#eff4ff] p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Timer size={22} className="text-[#3525cd]" aria-hidden={true} />
                  <span className="text-sm font-medium uppercase tracking-wider text-[#464555]">
                    Thời gian còn lại
                  </span>
                </div>
                <span className="text-2xl font-bold text-[#3525cd]" aria-live="polite">
                  {formatTime(remainingSeconds)}
                </span>
              </div>
            </div>

            <div className="quiz-card-shadow rounded-xl border border-[#c7c4d8] bg-white p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#464555]">
                Danh sách câu hỏi
              </h2>
              <div className="grid grid-cols-5 gap-3">
                {questions.map((question, index) => {
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      type="button"
                      aria-label={`Chuyển đến câu hỏi ${question.questionNumber}`}
                      aria-current={isCurrent ? "step" : undefined}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`aspect-square rounded-lg border-2 font-bold transition-all ${
                        isCurrent
                          ? "border-[#3525cd] bg-[#3525cd] text-white ring-2 ring-[#3525cd]/30"
                          : "border-[#c7c4d8] bg-[#eff4ff] text-[#464555] hover:border-[#3525cd] hover:text-[#3525cd]"
                      }`}
                    >
                      {question.questionNumber}
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 space-y-2 border-t border-[#c7c4d8] pt-4 text-sm text-[#464555]">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#3525cd]" aria-hidden={true} />
                  Đang làm
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border border-[#c7c4d8] bg-[#eff4ff]" aria-hidden={true} />
                  Chưa trả lời
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#2170e4]/20 bg-[#2170e4]/10 p-6">
              <div className="flex gap-4">
                <Lightbulb
                  size={23}
                  className="shrink-0 fill-[#0058be] text-[#0058be]"
                  aria-hidden={true}
                />
                <div>
                  <h2 className="text-sm font-bold text-[#0058be]">Mẹo học tập</h2>
                  <p className="mt-1 text-base leading-6 text-[#464555]">
                    Sử dụng <code className="font-mono">for</code> khi bạn biết trước số lần lặp, và{" "}
                    <code className="font-mono">while</code> khi lặp dựa trên một điều kiện.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
