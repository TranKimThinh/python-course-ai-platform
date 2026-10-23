import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAdminLessons } from "../../services/adminLesson.service";
import { generateQuiz, getAdminQuiz, listAdminQuizzes, publishQuiz, saveQuizDraft, type LessonQuiz, type QuizDraft, type QuizQuestion } from "../../services/quiz.service";

const blankQuestion = (): QuizQuestion => ({ question: "", code: "", difficulty: "easy", correctLabel: "A", explanation: "", options: ["A", "B", "C", "D"].map(label => ({ label, content: "" })) });
const emptyDraft = (): QuizDraft => ({ title: "", durationSeconds: 600, questions: [blankQuestion()] });
const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 disabled:bg-slate-100";
interface LessonChoice { id: number; title: string }
function readLessons(raw: unknown): LessonChoice[] {
  const data = (raw as { data?: unknown })?.data ?? raw;
  const items = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? [];
  return items.map(item => { const row = item as LessonChoice; return { id: row.id, title: row.title }; });
}

export default function LessonQuizManagementPage() {
  const [search, setSearch] = useSearchParams();
  const lessonId = search.get("lessonId") || "";
  const [lessonInput, setLessonInput] = useState(lessonId);
  const [lessons, setLessons] = useState<LessonChoice[]>([]);
  const [keyword, setKeyword] = useState("");
  const [quizzes, setQuizzes] = useState<LessonQuiz[]>([]);
  const [selected, setSelected] = useState<LessonQuiz | null>(null);
  const [draft, setDraft] = useState<QuizDraft>(emptyDraft);
  const [count, setCount] = useState(5);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const generation = useRef(0);
  const locked = busy || loading || selected?.status === "published";

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      getAdminLessons({ keyword, pageSize: 100 }).then(data => { if (active) setLessons(readLessons(data)); })
        .catch(() => { if (active) setLessons([]); });
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [keyword]);

  useEffect(() => {
    const request = ++generation.current;
    setLessonInput(lessonId); setSelected(null); setDraft(emptyDraft()); setQuizzes([]); setError(""); setMessage(""); setBusy(false); setLoading(false);
    if (!lessonId) return;
    setLoading(true);
    listAdminQuizzes(lessonId).then(data => { if (generation.current === request) setQuizzes(data); })
      .catch(error => { if (generation.current === request) setError(error instanceof Error ? error.message : "Không thể tải quiz."); })
      .finally(() => { if (generation.current === request) setLoading(false); });
    return () => { generation.current += 1; };
  }, [lessonId]);

  const applyQuiz = (quiz: LessonQuiz) => {
    setSelected(quiz);
    setDraft({ title: quiz.title, durationSeconds: quiz.durationSeconds, questions: quiz.questions ?? [] });
  };
  const updateQuizList = (quiz: LessonQuiz) => setQuizzes(current =>
    [quiz, ...current.filter(item => item.id !== quiz.id)].sort((a, b) => b.id - a.id),
  );
  const edit = async (id: number) => {
    const request = generation.current;
    setBusy(true); setError(""); setMessage("");
    try { const quiz = await getAdminQuiz(id); if (generation.current === request) applyQuiz(quiz); }
    catch (error) { if (generation.current === request) setError(error instanceof Error ? error.message : "Không thể mở quiz."); }
    finally { if (generation.current === request) setBusy(false); }
  };
  const generate = async () => {
    if (!lessonId || busy) return;
    const request = generation.current;
    setBusy(true); setError(""); setMessage("");
    try {
      const quiz = await generateQuiz(lessonId, count, draft.durationSeconds);
      if (generation.current !== request) return;
      applyQuiz(quiz);
      updateQuizList(quiz);
      setMessage("Đã tạo bản nháp. Hãy kiểm tra câu hỏi và đáp án trước khi công khai.");
    } catch (error) { if (generation.current === request) setError(error instanceof Error ? error.message : "Không thể tạo quiz."); }
    finally { if (generation.current === request) setBusy(false); }
  };
  const save = async (publish = false) => {
    if (!lessonId || locked) return;
    const request = generation.current;
    setBusy(true); setError(""); setMessage("");
    try {
      let quiz = await saveQuizDraft(lessonId, draft, selected?.id);
      if (generation.current !== request) return;
      applyQuiz(quiz);
      if (publish) {
        quiz = await publishQuiz(quiz.id);
        if (generation.current !== request) return;
        applyQuiz(quiz);
      }
      updateQuizList(quiz);
      setMessage(publish ? "Đã công khai quiz cho học viên." : "Đã lưu bản nháp.");
    } catch (error) { if (generation.current === request) setError(error instanceof Error ? error.message : "Không thể lưu quiz."); }
    finally { if (generation.current === request) setBusy(false); }
  };
  const updateQuestion = (index: number, patch: Partial<QuizQuestion>) => setDraft(current => ({ ...current, questions: current.questions.map((q, i) => i === index ? { ...q, ...patch } : q) }));

  return <AdminLayout><div className="mx-auto max-w-5xl space-y-6 p-6">
    <h1 className="text-2xl font-extrabold">Quiz theo bài học</h1>
    <p>Tạo câu hỏi từ transcript hoặc nhập thủ công, duyệt bản nháp rồi công khai cho học viên.</p>
    <section className="space-y-3 rounded-2xl border bg-white p-5">
      <label className="block font-bold">Tìm bài học<input disabled={busy} value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Nhập tên bài học..." className={inputClass} /></label>
      <label className="block">Chọn bài học<select disabled={busy} className={inputClass} value={lessons.some(l => String(l.id) === lessonId) ? lessonId : ""} onChange={e => { if (e.target.value) setSearch({ lessonId: e.target.value }); }}><option value="">Chọn một bài học</option>{lessons.map(l => <option key={l.id} value={l.id}>#{l.id} · {l.title}</option>)}</select></label>
      <form className="flex flex-wrap items-end gap-2" onSubmit={e => { e.preventDefault(); if (/^[1-9]\d*$/.test(lessonInput)) setSearch({ lessonId: lessonInput }); }}><label>ID bài học<input disabled={busy} type="number" min={1} value={lessonInput} onChange={e => setLessonInput(e.target.value)} className={inputClass} required /></label><button disabled={busy} className="rounded-xl border px-4 py-2">Tải quiz</button></form>
    </section>
    {error && <p role="alert" className="whitespace-pre-wrap rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    {message && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-800">{message}</p>}
    {lessonId && <>
      <section className="space-y-4 rounded-2xl border bg-white p-5">
        <h2 className="font-bold">Bài học #{lessonId}</h2>
        {loading && <p role="status">Đang tải quiz...</p>}
        <div className="flex flex-wrap items-end gap-3"><label>Số câu AI<input type="number" min={1} max={10} value={count} disabled={busy} onChange={e => setCount(Number(e.target.value))} className={inputClass} /></label><button type="button" disabled={busy || loading} onClick={generate} className="rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white disabled:opacity-50">{busy ? "Đang xử lý..." : "Tạo quiz bằng AI"}</button><button type="button" disabled={busy} onClick={() => { setSelected(null); setDraft(emptyDraft()); setMessage(""); }} className="rounded-xl border px-4 py-3">Tạo bản nháp thủ công</button></div>
        <p className="text-sm text-slate-500">Mỗi lần tạo bằng AI sử dụng API. Quiz được lưu để học viên làm lại mà không gọi AI.</p>
        <div className="space-y-2">{quizzes.map(q => <button type="button" key={q.id} disabled={busy} onClick={() => edit(q.id)} className={`block w-full rounded-xl border p-3 text-left ${selected?.id === q.id ? "border-indigo-600 bg-indigo-50" : ""}`}>{q.title} · {q.totalQuestions} câu · {q.status === "published" ? "Đã công khai" : "Bản nháp"}</button>)}</div>
      </section>
      <section className="space-y-5 rounded-2xl border bg-white p-5">
        <h2 className="text-xl font-bold">{selected ? `Quiz #${selected.id}` : "Bản nháp mới"}</h2>
        {selected?.status === "published" && <p>Quiz này đã công khai và chỉ được xem. Tạo bản nháp mới nếu muốn thay câu hỏi.</p>}
        <label className="block font-bold">Tên quiz<input className={inputClass} disabled={locked} value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} /></label>
        <label className="block">Thời gian (phút, 0 = không giới hạn)<input type="number" min={0} max={120} disabled={locked} value={draft.durationSeconds / 60} step={1} onChange={e => setDraft(d => ({ ...d, durationSeconds: Number(e.target.value) * 60 }))} className={inputClass} /></label>
        {draft.questions.map((q, index) => <fieldset key={index} disabled={locked} className="space-y-3 rounded-xl border p-4">
          <legend className="px-2 font-bold">Câu {index + 1}</legend>
          <label className="block">Câu hỏi<textarea className={inputClass} rows={3} value={q.question} onChange={e => updateQuestion(index, { question: e.target.value })} /></label>
          <label className="block">Code minh họa (nếu có)<textarea className={`${inputClass} font-mono text-sm`} rows={3} value={q.code ?? ""} onChange={e => updateQuestion(index, { code: e.target.value })} /></label>
          {q.options.map((o, i) => <label className="block" key={o.label}>Lựa chọn {o.label}<input className={inputClass} value={o.content} onChange={e => updateQuestion(index, { options: q.options.map((option, j) => j === i ? { ...option, content: e.target.value } : option) })} /></label>)}
          <label className="block">Đáp án đúng<select className={inputClass} value={q.correctLabel ?? "A"} onChange={e => updateQuestion(index, { correctLabel: e.target.value })}>{["A", "B", "C", "D"].map(label => <option key={label}>{label}</option>)}</select></label>
          <label className="block">Độ khó<select className={inputClass} value={q.difficulty} onChange={e => updateQuestion(index, { difficulty: e.target.value as QuizQuestion["difficulty"] })}><option value="easy">Dễ</option><option value="medium">Trung bình</option><option value="hard">Khó</option></select></label>
          <label className="block">Giải thích<textarea className={inputClass} rows={3} value={q.explanation ?? ""} onChange={e => updateQuestion(index, { explanation: e.target.value })} /></label>
          <button type="button" disabled={draft.questions.length <= 1} onClick={() => setDraft(d => ({ ...d, questions: d.questions.filter((_, i) => i !== index) }))} className="text-red-700 underline disabled:opacity-40">Xóa câu hỏi</button>
        </fieldset>)}
        <QuizSaveStatus published={selected?.status === "published"} busy={busy} message={message} error={error} />
        {selected?.status === "published" ? <div className="flex flex-wrap gap-3">
          <Link className="rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white" to={`/quiz/${lessonId}`}>Xem bài kiểm tra</Link>
          <button disabled={busy} onClick={() => { setSelected(null); setMessage(""); setError(""); }} className="rounded-xl border px-4 py-3">Tạo bản nháp mới từ quiz này</button>
        </div> : <div className="flex flex-wrap gap-3"><button disabled={locked || draft.questions.length >= 20} onClick={() => setDraft(d => ({ ...d, questions: [...d.questions, blankQuestion()] }))} className="rounded-xl border px-4 py-3 disabled:opacity-50">Thêm câu hỏi</button><button disabled={locked} onClick={() => save()} className="rounded-xl border px-4 py-3 disabled:opacity-50">{busy ? "Đang xử lý..." : "Lưu nháp"}</button><button disabled={locked} onClick={() => save(true)} className="rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white disabled:opacity-50">{busy ? "Đang xử lý..." : "Lưu và công khai"}</button></div>}
      </section>
    </>}
  </div></AdminLayout>;
}

export function QuizSaveStatus({ published, busy, message, error }: { published: boolean; busy: boolean; message: string; error: string }) {
  if (busy) return <p role="status" className="rounded-xl bg-indigo-50 p-4 text-indigo-700">Đang xử lý quiz, vui lòng chờ...</p>;
  if (error) return <p role="alert" className="whitespace-pre-wrap rounded-xl bg-red-50 p-4 text-red-700">{error}</p>;
  if (published) return <p role="status" className="rounded-xl bg-emerald-50 p-4 font-bold text-emerald-800">Đã công khai. Học viên có thể làm quiz này. Nội dung đang ở chế độ chỉ xem; hãy tạo bản nháp mới nếu muốn chỉnh sửa.</p>;
  return message ? <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-800">{message}</p> : null;
}
