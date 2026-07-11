import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getAdminStudentProgress,
  getAdminStudents,
  updateAdminStudentStatus,
} from "../../services/adminStudent.service";

interface Student {
  id: number;
  fullName: string;
  email: string;
  status: string;
  activeCourses: number;
  completedLessons: number;
  averageQuizScore: number | null;
  aiQuestions: number;
  lastLearningAt: string | null;
  createdAt: string | null;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export default function StudentManagementPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadStudents();
  }, [page, status]);

  async function loadStudents(nextPage = page) {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminStudents({ keyword, status, page: nextPage, pageSize: 10 });
      const data = unwrap(response);
      setStudents((data.items ?? []) as Student[]);
      setPagination(data.pagination ?? pagination);
      if (!selectedStudent && data.items?.[0]) setSelectedStudent(data.items[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Khong the tai du lieu.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedStudent) {
      setProgress(null);
      return;
    }
    getAdminStudentProgress(String(selectedStudent.id))
      .then((response) => setProgress(unwrap(response)))
      .catch(() => setProgress(null));
  }, [selectedStudent?.id]);

  async function handleStatusChange(student: Student) {
    const nextStatus = student.status === "blocked" ? "active" : "blocked";
    await updateAdminStudentStatus(String(student.id), nextStatus);
    await loadStudents();
  }

  return (
    <AdminLayout>
      <div className="min-h-screen p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Quan ly hoc vien</h1>
            <p className="mt-1 text-sm text-on-surface-variant">Du lieu lay truc tiep tu users, enrollments, progress, quiz va AI chat.</p>
          </div>
        </div>

        <div className="mb-5 grid gap-3 rounded-xl border border-outline-variant/30 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tim theo ten hoac email"
            className="rounded-lg border border-outline-variant/40 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-lg border border-outline-variant/40 px-3 py-2 text-sm">
            <option value="all">Tat ca trang thai</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
          <button onClick={() => { setPage(1); void loadStudents(1); }} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white">
            Tim kiem
          </button>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center text-on-surface-variant">Dang tai du lieu...</div>
        ) : students.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-on-surface-variant">Chua co hoc vien nao.</div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                    <tr>
                      <th className="px-4 py-3">Hoc vien</th>
                      <th className="px-4 py-3">Trang thai</th>
                      <th className="px-4 py-3">Khoa</th>
                      <th className="px-4 py-3">Bai HT</th>
                      <th className="px-4 py-3">Quiz TB</th>
                      <th className="px-4 py-3">AI</th>
                      <th className="px-4 py-3">Gan nhat</th>
                      <th className="px-4 py-3 text-right">Thao tac</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {students.map((student) => (
                      <tr key={student.id} onClick={() => setSelectedStudent(student)} className="cursor-pointer hover:bg-surface-container-low/50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-on-surface">{student.fullName}</p>
                          <p className="text-xs text-on-surface-variant">{student.email}</p>
                          <p className="text-xs text-on-surface-variant">Tao: {formatDate(student.createdAt)}</p>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={student.status} /></td>
                        <td className="px-4 py-3">{student.activeCourses}</td>
                        <td className="px-4 py-3">{student.completedLessons}</td>
                        <td className="px-4 py-3">{student.averageQuizScore ?? "-"}</td>
                        <td className="px-4 py-3">{student.aiQuestions}</td>
                        <td className="px-4 py-3">{formatDate(student.lastLearningAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(event) => { event.stopPropagation(); void handleStatusChange(student); }}
                            className="rounded-lg border border-outline-variant/40 px-3 py-1 text-xs font-semibold text-primary"
                          >
                            {student.status === "blocked" ? "Mo khoa" : "Khoa"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls pagination={pagination} page={page} setPage={setPage} />
            </div>

            <aside className="rounded-xl border border-outline-variant/30 bg-white p-5">
              <h2 className="mb-3 text-lg font-bold">Tien do hoc tap</h2>
              {!selectedStudent ? (
                <p className="text-sm text-on-surface-variant">Chon hoc vien de xem tien do.</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">{selectedStudent.fullName}</p>
                    <p className="text-sm text-on-surface-variant">{selectedStudent.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Metric label="Khoa dang hoc" value={progress?.stats?.activeCourses ?? selectedStudent.activeCourses} />
                    <Metric label="Bai hoan thanh" value={progress?.stats?.completedLessons ?? selectedStudent.completedLessons} />
                    <Metric label="Quiz TB" value={progress?.stats?.averageQuizScore ?? "-"} />
                    <Metric label="Cau hoi AI" value={progress?.stats?.aiQuestions ?? selectedStudent.aiQuestions} />
                  </div>
                  <div className="space-y-2">
                    {(progress?.courses ?? []).map((course: any) => (
                      <div key={course.id} className="rounded-lg bg-surface-container-low p-3 text-sm">
                        <p className="font-semibold">{course.title}</p>
                        <p className="text-on-surface-variant">{course.completedLessons}/{course.totalLessons} bai - {course.progressPercent}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === "active" ? "bg-green-100 text-green-700" : status === "blocked" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-bold ${cls}`}>{status}</span>;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-surface-container-low p-3"><p className="text-xs text-on-surface-variant">{label}</p><p className="text-lg font-bold">{value}</p></div>;
}

function PaginationControls({ pagination, page, setPage }: { pagination: Pagination; page: number; setPage: (page: number) => void }) {
  return (
    <div className="flex items-center justify-between border-t border-outline-variant/20 px-4 py-3 text-sm">
      <span>Trang {pagination.page}/{pagination.totalPages || 1} - {pagination.totalItems} hoc vien</span>
      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Truoc</button>
        <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Sau</button>
      </div>
    </div>
  );
}

function unwrap(response: any) {
  return response?.data ?? response;
}

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString("vi-VN") : "-";
}
