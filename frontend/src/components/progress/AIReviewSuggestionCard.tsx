import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AIReviewSuggestionCard() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 to-blue-600 p-6 text-white shadow-soft transition hover:-translate-y-0.5">
      <Bot size={120} className="absolute -right-6 -top-8 text-white/10" />
      <div className="relative">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
          <Sparkles size={24} />
        </span>
        <h2 className="text-xl font-extrabold">Gợi ý ôn tập từ AI</h2>
        <p className="mt-3 text-sm leading-7 text-indigo-50">
          Dựa trên kết quả quiz, bạn nên ôn lại: Vòng lặp while, Hàm trong Python.
        </p>
        <button
          type="button"
          onClick={() => navigate("/ai-assistant")}
          className="focus-ring mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Ôn tập ngay
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}

export default AIReviewSuggestionCard;
