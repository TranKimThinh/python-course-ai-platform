import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getQuizResult, type QuizResult } from "../../services/quiz.service";

export default function QuizResultPage() {
  const { lessonId } = useParams();
  const [search] = useSearchParams();
  const id = search.get("attempt");
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setResult(null); setError(""); setLoading(true);
    if (!id) { setError("Chưa có kết quả bài kiểm tra."); setLoading(false); return; }
    getQuizResult(id).then(data => {
      if (!active) return;
      if (String(data.quiz.lessonId) !== lessonId) setError("Kết quả không thuộc bài học này.");
      else setResult(data);
    }).catch(error => { if (active) setError(error instanceof Error ? error.message : "Không thể tải kết quả."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, lessonId]);
  return <div className="page-container space-y-6 py-10">
    <h1 className="text-3xl font-extrabold">Kết quả bài kiểm tra</h1>
    {loading && <p role="status">Đang tải kết quả...</p>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {result && <>
      <section className="space-y-3 rounded-2xl bg-indigo-50 p-6"><h2 className="text-xl font-bold">{result.quiz.title}</h2><p className="text-3xl font-extrabold text-indigo-700">{result.scorePercent}%</p><p>Đúng {result.correctAnswers}/{result.totalQuestions} câu. Kết quả đã được lưu vào tài khoản.</p></section>
      <div className="flex flex-wrap gap-4"><Link className="text-indigo-700 underline" to={`/learning/${result.quiz.courseId}/${result.quiz.lessonId}`}>Học lại bài này</Link><Link className="text-indigo-700 underline" to={`/quiz/${result.quiz.lessonId}`}>Làm lại quiz</Link><Link className="text-indigo-700 underline" to="/my-progress">Xem tiến độ</Link></div>
      {result.quiz.questions?.map((q, i) => <article key={q.id} className={`space-y-4 rounded-2xl border-l-4 bg-white p-6 shadow-sm ${q.isCorrect ? "border-emerald-500" : "border-red-500"}`}>
        <h2 className="whitespace-pre-wrap font-bold">Câu {i + 1}: {q.question}</h2>
        <p className={q.isCorrect ? "text-emerald-700" : "text-red-700"}>{q.isCorrect ? "Trả lời đúng" : q.selectedOptionId ? "Trả lời chưa đúng" : "Chưa trả lời"}</p>
        {q.code && <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-white"><code>{q.code}</code></pre>}
        {q.options.map(o => <p key={o.id} className={`whitespace-pre-wrap rounded-xl border p-3 ${o.label === q.correctLabel ? "border-emerald-500 bg-emerald-50" : o.id === q.selectedOptionId ? "border-red-400 bg-red-50" : ""}`}><strong>{o.label}.</strong> {o.content} {o.label === q.correctLabel && <strong> · Đáp án đúng</strong>}{o.id === q.selectedOptionId && <span> · Bạn chọn</span>}</p>)}
        <p className="whitespace-pre-wrap rounded-xl bg-blue-50 p-4"><strong>Giải thích: </strong>{q.explanation}</p>
      </article>)}
    </>}
    {!loading && !result && <Link className="text-indigo-700 underline" to={`/quiz/${lessonId}`}>Quay lại bài kiểm tra</Link>}
  </div>;
}
