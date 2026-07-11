import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  createAdminVideo,
  deleteAdminVideo,
  generateVideoTranscript,
  getAdminVideos,
  updateAdminVideo,
} from "../../services/adminVideo.service";
import { getAdminLessons } from "../../services/adminLesson.service";
import { getCoursesAdmin } from "../../services/course.service";

interface VideoItem {
  id: number;
  lessonId: number;
  lessonTitle: string;
  courseId: number;
  courseTitle: string;
  provider: string;
  videoUrl: string;
  embedUrl: string | null;
  durationSeconds: number;
  processingStatus: string;
  transcriptStatus: string;
  uploadedAt: string | null;
}

const emptyForm = { lessonId: "", provider: "youtube", videoUrl: "", durationSeconds: 0, processingStatus: "completed" };
const pageSize = 10;

export default function VideoManagementPage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [courseId, setCourseId] = useState("all");
  const [lessonId, setLessonId] = useState("all");
  const [provider, setProvider] = useState("all");
  const [status, setStatus] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { void loadCourses(); }, []);
  useEffect(() => { void loadVideos(); }, [page, courseId, lessonId, provider, status]);
  useEffect(() => { void loadLessonsForCourse(courseId); }, [courseId]);

  async function loadCourses() {
    try {
      const response = await getCoursesAdmin();
      const data = unwrap(response);
      setCourses(data.items ?? data ?? []);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải danh sách khóa học."));
    }
  }

  async function loadLessonsForCourse(selectedCourseId: string) {
    if (!selectedCourseId || selectedCourseId === "all") {
      setLessons([]);
      setLessonId("all");
      return;
    }
    try {
      const response = await getAdminLessons({ courseId: selectedCourseId, page: 1, pageSize: 100 });
      setLessons(unwrap(response).items ?? []);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải danh sách bài học."));
      setLessons([]);
    }
  }

  async function loadVideos(nextPage = page) {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminVideos({ courseId, lessonId, provider, status, keyword, page: nextPage, pageSize });
      const data = unwrap(response);
      setVideos(data.items ?? []);
      setPagination(data.pagination ?? pagination);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải video."));
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(video: VideoItem) {
    setEditing(video);
    setForm({ lessonId: String(video.lessonId), provider: video.provider, videoUrl: video.videoUrl, durationSeconds: video.durationSeconds, processingStatus: video.processingStatus });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!form.lessonId || !form.videoUrl.trim()) {
      setError("Vui lòng chọn bài học và nhập URL video.");
      return;
    }
    try {
      const payload = { ...form, lessonId: Number(form.lessonId), durationSeconds: Number(form.durationSeconds) };
      if (editing) await updateAdminVideo(String(editing.id), payload);
      else await createAdminVideo(payload);
      setMessage(editing ? "Đã cập nhật video." : "Đã tạo video.");
      setEditing(null);
      setForm(emptyForm);
      await loadVideos();
    } catch (err) {
      setError(getErrorMessage(err, "Không thể lưu video."));
    }
  }

  async function runAction(action: () => Promise<unknown>, success: string) {
    try {
      await action();
      setMessage(success);
      await loadVideos();
    } catch (err) {
      setError(getErrorMessage(err, "Thao tác thất bại."));
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold">Quản lý video bài học</h1>
            <p className="text-sm text-on-surface-variant">Quản lý video YouTube, nội bộ, đám mây và trạng thái Transcript.</p>
          </div>
          <button onClick={() => navigate("/admin/upload")} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white">Tải lên tài nguyên</button>
        </div>

        <div className="mb-5 grid gap-3 rounded-xl border bg-white p-4 lg:grid-cols-[1fr_180px_180px_150px_170px_auto]">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm video, URL, bài học" className="rounded-lg border px-3 py-2 text-sm" />
          <select value={courseId} onChange={(e) => { setCourseId(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Tất cả khóa học</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
          <select value={lessonId} onChange={(e) => { setLessonId(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Tất cả bài học</option>
            {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
          </select>
          <select value={provider} onChange={(e) => { setProvider(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Nguồn video</option>
            <option value="youtube">YouTube</option>
            <option value="local">Nội bộ</option>
            <option value="cloud">Đám mây</option>
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm">
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Đang chờ</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="failed">Thất bại</option>
          </select>
          <button onClick={() => { setPage(1); void loadVideos(1); }} className="rounded-lg bg-primary px-4 py-2 text-white">Tìm kiếm</button>
        </div>

        {(error || message) && <div className={`mb-4 rounded-lg p-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{error || message}</div>}

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-xl border bg-white">
            {loading ? <State text="Đang tải dữ liệu..." /> : videos.length === 0 ? <State text="Chưa có video nào." /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                    <tr>
                      <th className="px-4 py-3">Video</th>
                      <th className="px-4 py-3">Khóa học / Bài học</th>
                      <th className="px-4 py-3">Nguồn video</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3">Transcript</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {videos.map((video) => (
                      <tr key={video.id}>
                        <td className="px-4 py-3">
                          <p className="font-semibold">#{video.id}</p>
                          <a href={video.videoUrl} target="_blank" rel="noreferrer" className="block max-w-[360px] truncate text-xs text-primary">{video.videoUrl}</a>
                        </td>
                        <td className="px-4 py-3"><p>{video.courseTitle}</p><p className="text-xs text-on-surface-variant">{video.lessonTitle}</p></td>
                        <td className="px-4 py-3"><Badge value={labelProvider(video.provider)} /></td>
                        <td className="px-4 py-3"><Badge value={video.processingStatus} /></td>
                        <td className="px-4 py-3"><Badge value={video.transcriptStatus} /></td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => startEdit(video)} className="rounded border px-2 py-1">Chỉnh sửa</button>
                            <button onClick={() => void runAction(() => deleteAdminVideo(String(video.id)), "Đã xóa video.")} className="rounded border px-2 py-1 text-red-600">Xóa</button>
                            <button onClick={() => void runAction(() => generateVideoTranscript(String(video.id)), "Đã bắt đầu tạo Transcript.")} className="rounded border px-2 py-1 text-primary">Tạo Transcript</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-between border-t px-4 py-3 text-sm">
              <span>{pagination.totalItems} video</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Trước</button>
                <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Tiếp</button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5">
            <h2 className="mb-4 text-lg font-bold">{editing ? "Chỉnh sửa video" : "Thêm URL video"}</h2>
            <div className="space-y-3">
              <select value={form.lessonId} onChange={(e) => setForm({ ...form, lessonId: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="">Chọn bài học</option>
                {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
              </select>
              <select value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="youtube">YouTube</option>
                <option value="local">Nội bộ</option>
                <option value="cloud">Đám mây</option>
              </select>
              <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="URL video hoặc đường dẫn tệp" className="w-full rounded-lg border px-3 py-2 text-sm" />
              <input type="number" value={form.durationSeconds} onChange={(e) => setForm({ ...form, durationSeconds: Number(e.target.value) })} placeholder="Thời lượng giây" className="w-full rounded-lg border px-3 py-2 text-sm" />
              <select value={form.processingStatus} onChange={(e) => setForm({ ...form, processingStatus: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="pending">Đang chờ</option>
                <option value="processing">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="failed">Thất bại</option>
              </select>
              <div className="flex gap-2">
                <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white">Lưu</button>
                <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); }} className="rounded-lg border px-4 py-2 text-sm">Hủy</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

function Badge({ value }: { value: string }) {
  return <span className="rounded-full bg-surface-container-low px-2 py-1 text-xs font-bold">{labelStatus(value)}</span>;
}

function State({ text }: { text: string }) {
  return <div className="p-8 text-center text-on-surface-variant">{text}</div>;
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

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
