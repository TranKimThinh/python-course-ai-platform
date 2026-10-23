import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLessonQuiz, type LessonQuiz } from "../../services/quiz.service";

export default function LessonQuizTab({ lessonId }: { lessonId: string }) {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<LessonQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setQuiz(null);
    getLessonQuiz(lessonId).then(data => { if (active) setQuiz(data); })
      .catch(error => { if (active) setError(error instanceof Error ? error.message : "Không thể tải quiz."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [lessonId, reload]);
  return <div className="space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
    {loading ? <p role="status">Đang tải bài kiểm tra...</p> : error ? <p role="alert" className="text-red-700">{error} <button className="underline" onClick={() => setReload(n => n + 1)}>Thử lại</button></p> : quiz ? <>
      <h2 className="font-extrabold text-slate-950">{quiz.title}</h2>
      <p className="text-sm text-slate-600">{quiz.totalQuestions} câu hỏi · {quiz.durationSeconds ? `${Math.ceil(quiz.durationSeconds / 60)} phút` : "Không giới hạn thời gian"}</p>
      {quiz.lastAttempt && <p>Điểm gần nhất: <strong>{quiz.lastAttempt.scorePercent}%</strong> · <Link className="text-indigo-700 underline" to={`/quiz/${lessonId}/result?attempt=${quiz.lastAttempt.id}`}>Xem kết quả</Link></p>}
      <Link className="inline-block rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white" to={`/quiz/${lessonId}`}>{quiz.lastAttempt ? "Làm lại bài kiểm tra" : "Bắt đầu làm bài"}</Link>
    </> : <p>Bài học này chưa có bài kiểm tra.</p>}
    {user?.role === "admin" && <Link className="block text-sm font-bold text-indigo-700 underline" to={`/admin/quiz?lessonId=${encodeURIComponent(lessonId)}`}>Tạo và quản lý quiz cho bài học</Link>}
  </div>;
}
