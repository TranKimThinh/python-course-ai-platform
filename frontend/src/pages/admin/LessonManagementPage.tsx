import { FormEvent, useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  createAdminLesson,
  deleteAdminLesson,
  generateLessonSummary,
  generateLessonTranscript,
  getAdminLessons,
  updateAdminLesson,
} from "../../services/adminLesson.service";
import { getCoursesAdmin } from "../../services/course.service";

interface CourseOption { id: number; title: string }
interface LessonItem {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  description: string;
  durationSeconds: number;
  sortOrder: number;
  isFree: boolean;
  status: string;
  video: { id: number; provider: string; processingStatus: string } | null;
  hasSlide: boolean;
  transcriptStatus: string;
  summaryStatus: string;
}

const emptyForm = { courseId: "", title: "", description: "", durationSeconds: 0, sortOrder: 0, isFree: false, status: "draft" };
const pageSize = 10;

export default function LessonManagementPage() {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [courseId, setCourseId] = useState("all");
  const [status, setStatus] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<LessonItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { void loadCourses(); }, []);
  useEffect(() => { void loadLessons(); }, [page, courseId, status]);

  async function loadCourses() {
    try {
      const response = await getCoursesAdmin();
      const data = unwrap(response);
      setCourses((data.items ?? data ?? []).map((course: any) => ({ id: Number(course.id), title: course.title })));
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải danh sách khóa học."));
    }
  }

  async function loadLessons(nextPage = page) {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminLessons({ courseId, keyword, status, page: nextPage, pageSize });
      const data = unwrap(response);
      setLessons(data.items ?? []);
      setPagination(data.pagination ?? pagination);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải bài học."));
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(lesson: LessonItem) {
    setEditing(lesson);
    setForm({
      courseId: String(lesson.courseId),
      title: lesson.title,
      description: lesson.description,
      durationSeconds: lesson.durationSeconds,
      sortOrder: lesson.sortOrder,
      isFree: lesson.isFree,
      status: lesson.status,
    });
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!form.courseId || !form.title.trim()) {
      setError("Vui lòng chọn khóa học và nhập tên bài học.");
      return;
    }
    try {
      const payload = { ...form, courseId: Number(form.courseId), durationSeconds: Number(form.durationSeconds), sortOrder: Number(form.sortOrder) };
      if (editing) await updateAdminLesson(String(editing.id), payload);
      else await createAdminLesson(payload);
      setMessage(editing ? "Đã cập nhật bài học." : "Đã tạo bài học.");
      resetForm();
      await loadLessons();
    } catch (err) {
      setError(getErrorMessage(err, "Không thể lưu bài học."));
    }
  }

  async function handleArchive(lesson: LessonItem) {
    setError("");
    setMessage("");
    try {
      await deleteAdminLesson(String(lesson.id));
      setMessage("Đã lưu trữ bài học.");
      await loadLessons();
    } catch (err) {
      setError(getErrorMessage(err, "Không thể xóa bài học."));
    }
  }

  async function runAction(action: () => Promise<unknown>, done: string) {
    try {
      await action();
      setMessage(done);
      await loadLessons();
    } catch (err) {
      setError(getErrorMessage(err, "Thao tác thất bại."));
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold">Quản lý bài học</h1>
          <p className="text-sm text-on-surface-variant">Quản lý bài học, tạo Transcript và Tóm tắt AI từ dữ liệu backend.</p>
        </div>

        <div className="mb-5 grid gap-3 rounded-xl border bg-white p-4 lg:grid-cols-[1fr_220px_180px_auto]">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm kiếm bài học" className="rounded-lg border px-3 py-2 text-sm" />
          <select value={courseId} onChange={(e) => { setCourseId(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Tất cả khóa học</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="published">Đã xuất bản</option>
            <option value="archived">Đã lưu trữ</option>
            <option value="hidden">Đã ẩn</option>
          </select>
          <button onClick={() => { setPage(1); void loadLessons(1); }} className="rounded-lg bg-primary px-5 py-2 text-white">Tìm kiếm</button>
        </div>

        {(error || message) && <div className={`mb-4 rounded-lg p-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{error || message}</div>}

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-xl border bg-white">
            {loading ? <StateText text="Đang tải dữ liệu..." /> : lessons.length === 0 ? <StateText text="Chưa có bài học nào." /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                    <tr>
                      <th className="px-4 py-3">Bài học</th>
                      <th className="px-4 py-3">Khóa học</th>
                      <th className="px-4 py-3">Thứ tự</th>
                      <th className="px-4 py-3">Video</th>
                      <th className="px-4 py-3">Transcript</th>
                      <th className="px-4 py-3">Tóm tắt AI</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {lessons.map((lesson) => (
                      <tr key={lesson.id}>
                        <td className="px-4 py-3"><p className="font-semibold">{lesson.title}</p><p className="text-xs text-on-surface-variant">{formatDuration(lesson.durationSeconds)}</p></td>
                        <td className="px-4 py-3">{lesson.courseTitle}</td>
                        <td className="px-4 py-3">{lesson.sortOrder}</td>
                        <td className="px-4 py-3">{lesson.video ? `${labelProvider(lesson.video.provider)} / ${labelStatus(lesson.video.processingStatus)}` : "Chưa có"}</td>
                        <td className="px-4 py-3"><Badge value={lesson.transcriptStatus} /></td>
                        <td className="px-4 py-3"><Badge value={lesson.summaryStatus} /></td>
                        <td className="px-4 py-3"><Badge value={lesson.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => startEdit(lesson)} className="rounded border px-2 py-1">Chỉnh sửa</button>
                            <button onClick={() => void handleArchive(lesson)} className="rounded border px-2 py-1 text-red-600">Xóa</button>
                            <button onClick={() => void runAction(() => generateLessonTranscript(String(lesson.id)), "Đã bắt đầu tạo Transcript.")} className="rounded border px-2 py-1 text-primary">Tạo Transcript</button>
                            <button disabled={lesson.transcriptStatus !== "completed"} onClick={() => void runAction(() => generateLessonSummary(String(lesson.id)), "Đã tạo Tóm tắt AI.")} className="rounded border px-2 py-1 text-primary disabled:opacity-40">Tạo Tóm tắt AI</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination pagination={pagination} page={page} setPage={setPage} />
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5">
            <h2 className="mb-4 text-lg font-bold">{editing ? "Chỉnh sửa bài học" : "Tạo bài học"}</h2>
            <div className="space-y-3">
              <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="">Chọn khóa học</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Tên bài học" className="w-full rounded-lg border px-3 py-2 text-sm" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả" rows={3} className="w-full rounded-lg border px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={form.durationSeconds} onChange={(e) => setForm({ ...form, durationSeconds: Number(e.target.value) })} placeholder="Thời lượng giây" className="rounded-lg border px-3 py-2 text-sm" />
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} placeholder="Thứ tự" className="rounded-lg border px-3 py-2 text-sm" />
              </div>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
                <option value="archived">Đã lưu trữ</option>
              </select>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} /> Bài miễn phí</label>
              <div className="flex gap-2">
                <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white">Lưu</button>
                <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm">Hủy</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

function StateText({ text }: { text: string }) {
  return <div className="p-8 text-center text-on-surface-variant">{text}</div>;
}

function Badge({ value }: { value: string }) {
  return <span className="rounded-full bg-surface-container-low px-2 py-1 text-xs font-bold">{labelStatus(value)}</span>;
}

function Pagination({ pagination, page, setPage }: any) {
  return <div className="flex justify-between border-t px-4 py-3 text-sm"><span>{pagination.totalItems} bài học</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Trước</button><button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Tiếp</button></div></div>;
}

function unwrap(response: any) {
  return response?.data ?? response;
}

function labelStatus(value: string) {
  const labels: Record<string, string> = {
    pending: "Đang chờ",
    processing: "Đang xử lý",
    completed: "Hoàn thành",
    failed: "Thất bại",
    draft: "Bản nháp",
    published: "Đã xuất bản",
    archived: "Đã lưu trữ",
    hidden: "Đã ẩn",
  };
  return labels[value] ?? value;
}

function labelProvider(value: string) {
  const labels: Record<string, string> = {
    youtube: "YouTube",
    local: "Nội bộ",
    cloud: "Đám mây",
    cloudflare: "Cloudflare",
  };
  return labels[value.toLowerCase()] ?? value;
}

function formatDuration(durationSeconds: number) {
  return `${durationSeconds || 0} giây`;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
