import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAdminLessons } from "../../services/adminLesson.service";
import {
  uploadLessonSlide,
  uploadLessonVideoFile,
  uploadLessonYoutube,
} from "../../services/adminUpload.service";
import { getCoursesAdmin } from "../../services/course.service";

type UploadMode = "video" | "youtube" | "slide";

export default function VideoUploadPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [courseId, setCourseId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [mode, setMode] = useState<UploadMode>("youtube");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [slideFile, setSlideFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { void loadCourses(); }, []);
  useEffect(() => { void loadLessons(); }, [courseId]);

  async function loadCourses() {
    setInitialLoading(true);
    try {
      const response = await getCoursesAdmin();
      const data = unwrap(response);
      setCourses(data.items ?? data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Khong the tai khoa hoc.");
    } finally {
      setInitialLoading(false);
    }
  }

  async function loadLessons() {
    setLessons([]);
    setLessonId("");
    if (!courseId) return;
    const response = await getAdminLessons({ courseId, page: 1, pageSize: 100 });
    setLessons(unwrap(response).items ?? []);
  }

  function onVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && !isAllowed(file.name, [".mp4", ".webm", ".ogg", ".mov"])) {
      setError("Video chi ho tro .mp4, .webm, .ogg, .mov.");
      event.target.value = "";
      setVideoFile(null);
      return;
    }
    setError("");
    setVideoFile(file);
  }

  function onSlideChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && !isAllowed(file.name, [".pdf"])) {
      setError("Slide chi ho tro PDF.");
      event.target.value = "";
      setSlideFile(null);
      return;
    }
    setError("");
    setSlideFile(file);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!lessonId) {
      setError("Vui long chon bai hoc.");
      return;
    }
    try {
      setLoading(true);
      if (mode === "youtube") {
        if (!isYoutubeUrl(videoUrl)) {
          setError("YouTube URL khong hop le.");
          return;
        }
        await uploadLessonYoutube({ lessonId, videoUrl, durationSeconds });
      }
      if (mode === "video") {
        if (!videoFile) {
          setError("Vui long chon video file.");
          return;
        }
        await uploadLessonVideoFile({ lessonId, file: videoFile, durationSeconds });
      }
      if (mode === "slide") {
        if (!slideFile) {
          setError("Vui long chon slide PDF.");
          return;
        }
        await uploadLessonSlide({ lessonId, file: slideFile });
      }
      setMessage("Upload thanh cong.");
      setVideoFile(null);
      setSlideFile(null);
      setVideoUrl("");
      setDurationSeconds(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload that bai.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold">Upload tai nguyen bai hoc</h1>
          <p className="text-sm text-on-surface-variant">Upload video file, YouTube URL hoac slide PDF vao backend storage.</p>
        </div>

        {initialLoading ? (
          <div className="rounded-xl bg-white p-8 text-center text-on-surface-variant">Dang tai du lieu...</div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-5 rounded-xl border bg-white p-6">
            {(error || message) && <div className={`rounded-lg p-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{error || message}</div>}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold">Khoa hoc</label>
                <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
                  <option value="">Chon khoa hoc</option>
                  {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Bai hoc</label>
                <select value={lessonId} onChange={(e) => setLessonId(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
                  <option value="">Chon bai hoc</option>
                  {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Loai upload</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {(["youtube", "video", "slide"] as UploadMode[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold ${mode === item ? "border-primary bg-primary text-white" : "bg-white"}`}
                  >
                    {item === "youtube" ? "YouTube URL" : item === "video" ? "Video file" : "Slide PDF"}
                  </button>
                ))}
              </div>
            </div>

            {mode === "youtube" && (
              <div>
                <label className="mb-1 block text-sm font-semibold">YouTube URL</label>
                <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full rounded-lg border px-3 py-2 text-sm" />
              </div>
            )}

            {mode === "video" && (
              <div>
                <label className="mb-1 block text-sm font-semibold">Video file</label>
                <input type="file" accept=".mp4,.webm,.ogg,.mov,video/*" onChange={onVideoChange} className="w-full rounded-lg border px-3 py-2 text-sm" />
                {videoFile && <p className="mt-2 text-sm text-on-surface-variant">{videoFile.name}</p>}
              </div>
            )}

            {mode === "slide" && (
              <div>
                <label className="mb-1 block text-sm font-semibold">Slide PDF</label>
                <input type="file" accept=".pdf,application/pdf" onChange={onSlideChange} className="w-full rounded-lg border px-3 py-2 text-sm" />
                {slideFile && <p className="mt-2 text-sm text-on-surface-variant">{slideFile.name}</p>}
              </div>
            )}

            {mode !== "slide" && (
              <div>
                <label className="mb-1 block text-sm font-semibold">Thoi luong video (giay)</label>
                <input type="number" value={durationSeconds} onChange={(e) => setDurationSeconds(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2 text-sm" />
              </div>
            )}

            <button disabled={loading} className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {loading ? "Dang upload..." : "Upload"}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}

function unwrap(response: any) {
  return response?.data ?? response;
}

function isAllowed(name: string, extensions: string[]) {
  const lower = name.toLowerCase();
  return extensions.some((ext) => lower.endsWith(ext));
}

function isYoutubeUrl(value: string) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(value.trim());
}
