import { CheckCircle2, Lightbulb, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import CodeExampleBlock from "./CodeExampleBlock";
import { type SummaryData } from "./lessonTypes";

interface AISummaryContentProps {
  summary: SummaryData;
  courseId: string;
  lessonId: string;
}

function AISummaryContent({ summary, courseId, lessonId }: AISummaryContentProps) {
  return (
    <div className="space-y-7">
      <section>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Sparkles size={20} />
          </span>
          <h2 className="text-xl font-extrabold text-slate-950">Điểm then chốt bài học</h2>
        </div>
        <div className="space-y-3">
          {summary.keyPoints.map((point) => (
            <div key={point} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />
              <p className="text-sm leading-6 text-slate-700">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-extrabold text-slate-950">Các khái niệm quan trọng</h2>
        <div className="flex flex-wrap gap-2">
          {summary.concepts.map((concept) => (
            <span key={concept} className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
              {concept}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-extrabold text-slate-950">Cú pháp mẫu</h2>
        <CodeExampleBlock code={summary.codeExample} />
      </section>

      <section className="rounded-2xl bg-blue-50 p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Lightbulb size={20} />
          </span>
          <h2 className="font-extrabold text-slate-950">Gợi ý ôn tập</h2>
        </div>
        <p className="text-sm leading-7 text-slate-700">{summary.reviewSuggestion}</p>
      </section>

      <Link
        to="/ai-assistant"
        className="focus-ring inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
      >
        <MessageCircle size={18} />
        Hỏi AI về bài học này
      </Link>
    </div>
  );
}

export default AISummaryContent;
