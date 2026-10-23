import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLessonQuiz, startQuiz, submitQuiz, type LessonQuiz, type QuizStart } from "../../services/quiz.service";

interface Attempt extends QuizStart { answers: Record<string, number>; expiresAt: number }
export default function QuizPage() {
  const { lessonId = "" } = useParams();
  const { user } = useAuth();
  return <QuizContent key={`${user?.id}:${lessonId}`} lessonId={lessonId} userId={user?.id ?? 0} />;
}

function QuizContent({ lessonId, userId }: { lessonId: string; userId: number }) {
  const navigate = useNavigate();
  const storageKey = `pyai_quiz:${userId}:${lessonId}`;
  const [quiz, setQuiz] = useState<LessonQuiz | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const submitting = useRef(false);
  const automaticSubmission = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    let active = true;
    alive.current = true;
    getLessonQuiz(lessonId).then(data => {
      if (!active) return;
      setQuiz(data);
      try {
        const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null") as Attempt | null;
        if (saved?.quiz?.id === data?.id && saved?.quiz?.questions?.length && typeof saved.attemptToken === "string" && saved.answers && typeof saved.expiresAt === "number") {
          setAttempt(saved); setSeconds(Math.max(0, Math.ceil((saved.expiresAt - Date.now()) / 1000)));
        }
      } catch { /* Unreadable local drafts can be replaced by a new attempt. */ }
    }).catch(error => { if (active) setError(error instanceof Error ? error.message : "Không thể tải quiz."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; alive.current = false; };
  }, [lessonId, storageKey]);

  useEffect(() => {
    if (!attempt) return;
    try { sessionStorage.setItem(storageKey, JSON.stringify(attempt)); } catch { /* Quiz still works without storage. */ }
    const tick = () => setSeconds(Math.max(0, Math.ceil((attempt.expiresAt - Date.now()) / 1000)));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [attempt, storageKey]);

  const submit = async (automatic = false) => {
    if (!attempt || submitting.current) return;
    if (!automatic && !window.confirm(`Bạn đã trả lời ${Object.keys(attempt.answers).length}/${attempt.quiz.questions?.length ?? 0} câu. Nộp bài?`)) return;
    submitting.current = true; setBusy(true); setError("");
    try {
      const result = await submitQuiz(attempt.quiz.id, attempt.attemptToken, attempt.answers);
      if (!alive.current) return;
      try { sessionStorage.removeItem(storageKey); } catch { /* Result is already saved on the server. */ }
      navigate(`/quiz/${lessonId}/result?attempt=${result.id}`, { replace: true });
    } catch (error) {
      if (alive.current) setError(error instanceof Error ? error.message : "Không thể nộp bài. Hãy thử lại.");
    } finally {
      submitting.current = false;
      if (alive.current) setBusy(false);
    }
  };

  useEffect(() => {
    if (attempt && seconds === 0 && !automaticSubmission.current) {
      automaticSubmission.current = true;
      void submit(true);
    }
  }, [attempt, seconds]);

  const begin = async () => {
    if (!quiz || busy) return;
    setBusy(true); setError("");
    try {
      const data = await startQuiz(quiz.id);
      if (!alive.current) return;
      const expiresAt = Date.now() + Date.parse(data.deadline) - Date.parse(data.serverTime);
      automaticSubmission.current = false; setIndex(0);
      setSeconds(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
      setAttempt({ ...data, answers: {}, expiresAt });
    } catch (error) { if (alive.current) setError(error instanceof Error ? error.message : "Không thể bắt đầu bài kiểm tra."); }
    finally { if (alive.current) setBusy(false); }
  };

  const questions = attempt?.quiz.questions ?? [];
  const question = questions[index];
  return <div className="page-container space-y-6 py-10">
    <h1 className="text-3xl font-extrabold">{quiz?.title ?? "Bài kiểm tra"}</h1>
    {quiz && <Link className="text-indigo-700 underline" to={`/learning/${quiz.courseId}/${lessonId}`}>Quay lại bài: {quiz.lessonTitle}</Link>}
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    {loading ? <p role="status">Đang tải bài kiểm tra...</p> : !quiz ? <p>Bài học này chưa có bài kiểm tra. <Link to="/courses" className="underline">Xem khóa học</Link></p> : !attempt ? <div className="space-y-4 rounded-2xl border bg-white p-6">
      <p>{quiz.totalQuestions} câu hỏi · {quiz.durationSeconds ? `${Math.ceil(quiz.durationSeconds / 60)} phút` : "Không giới hạn thời gian"}. Kết quả sẽ được lưu vào tài khoản của bạn.</p>
      <button disabled={busy} onClick={begin} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? "Đang chuẩn bị..." : "Bắt đầu làm bài"}</button>
    </div> : question && <>
      <div className="flex flex-wrap justify-between gap-3 font-bold"><span>Câu {index + 1}/{questions.length} · Đã trả lời {Object.keys(attempt.answers).length} câu</span>{attempt.quiz.durationSeconds > 0 && <span role="timer">Còn {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span>}</div>
      <div className="space-y-5 rounded-2xl border bg-white p-6">
        <h2 className="whitespace-pre-wrap text-xl font-bold">{question.question}</h2>
        {question.code && <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-white"><code>{question.code}</code></pre>}
        <div className="space-y-3">{question.options.map(option => <button key={option.id} disabled={busy || seconds === 0} aria-pressed={attempt.answers[String(question.id)] === option.id} onClick={() => setAttempt(current => current ? { ...current, answers: { ...current.answers, [String(question.id)]: option.id! } } : current)} className={`block w-full whitespace-pre-wrap rounded-xl border p-4 text-left disabled:opacity-60 ${attempt.answers[String(question.id)] === option.id ? "border-indigo-600 bg-indigo-50" : "hover:bg-slate-50"}`}><strong>{option.label}.</strong> {option.content}</button>)}</div>
      </div>
      <div className="flex flex-wrap gap-2">{questions.map((q, i) => <button key={q.id} aria-current={i === index ? "step" : undefined} className={`rounded-lg border px-3 py-2 ${i === index ? "bg-indigo-600 text-white" : attempt.answers[String(q.id)] !== undefined ? "bg-indigo-100" : "bg-white"}`} onClick={() => setIndex(i)}>{i + 1}</button>)}</div>
      <div className="flex flex-wrap gap-3">
        <button disabled={index === 0} onClick={() => setIndex(i => i - 1)} className="rounded-xl border px-5 py-3 disabled:opacity-40">Câu trước</button>
        <button disabled={index === questions.length - 1} onClick={() => setIndex(i => i + 1)} className="rounded-xl border px-5 py-3 disabled:opacity-40">Câu tiếp</button>
        <button disabled={busy} onClick={() => submit(seconds === 0)} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? "Đang nộp bài..." : "Nộp bài"}</button>
        {seconds === 0 && error && <button disabled={busy} onClick={begin} className="rounded-xl border px-5 py-3">Bắt đầu lượt mới</button>}
      </div>
    </>}
  </div>;
}
