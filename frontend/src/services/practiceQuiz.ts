export interface QuizOption {
  id: string;
  label: "A" | "B" | "C" | "D";
  content: string;
}

export interface QuizQuestion {
  id: string;
  questionNumber: number;
  question: string;
  code?: string;
  options: QuizOption[];
  correctOptionId?: string;
}

export interface QuizInfo {
  courseName: string;
  lessonName: string;
  totalQuestions: number;
  durationSeconds: number;
}

export const quizInfo: QuizInfo = {
  courseName: "Python cơ bản",
  lessonName: "Vòng lặp trong Python",
  totalQuestions: 5,
  durationSeconds: 14 * 60 + 56,
};

export const questions: QuizQuestion[] = [
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

export interface PracticeResult {
  lessonId: string;
  answers: Record<string, string>;
}
export function scorePractice(answers: Record<string, string>) {
  return questions.filter((question) => answers[question.id] === question.correctOptionId).length;
}
