import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getAdminDashboard,
  type AdminDashboardActivity,
  type AdminDashboardData,
} from "../../services/dashboard.service";

interface StatCardConfig {
  key: keyof AdminDashboardData["stats"];
  label: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}

const statCardConfigs: StatCardConfig[] = [
  {
    key: "totalStudents",
    label: "Tổng học viên",
    icon: "group",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    key: "totalCourses",
    label: "Tổng khóa học",
    icon: "auto_stories",
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
  },
  {
    key: "aiVideosProcessed",
    label: "Video đã xử lý AI",
    icon: "movie",
    iconColor: "text-on-secondary-fixed-variant",
    iconBg: "bg-surface-container-highest/50",
  },
  {
    key: "aiQuestionsCount",
    label: "Lượt hỏi AI",
    icon: "bolt",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatRelativeTime(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function ActivityRow({ row }: { row: AdminDashboardActivity }) {
  return (
    <tr className="hover:bg-surface-container/30 transition-colors">
      <td className="px-4 py-2.5 text-xs text-on-surface-variant whitespace-nowrap">
        {formatRelativeTime(row.time)}
      </td>
      <td className="px-4 py-2.5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {row.subjectType === "user" ? (
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
              {getInitial(row.subject)}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[14px]">video_library</span>
            </div>
          )}
          <span className="text-xs font-medium text-on-surface">{row.subject}</span>
        </div>
      </td>
      <td className="px-4 py-2.5 text-xs text-on-surface whitespace-nowrap">{row.action}</td>
      <td className="px-4 py-2.5 whitespace-nowrap">
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700">
          {row.status}
        </span>
      </td>
    </tr>
  );
}

function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setData(await getAdminDashboard());
    } catch (error) {
      setData(null);
      setError(error instanceof Error ? error.message : "Không thể tải dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const aiProcessingItems = data
    ? [
        { label: "Chưa xử lý", count: data.aiProcessing.pending, color: "bg-outline", pulse: false, isError: false },
        { label: "Đang xử lý", count: data.aiProcessing.processing, color: "bg-blue-500", pulse: data.aiProcessing.processing > 0, isError: false },
        { label: "Hoàn thành", count: data.aiProcessing.completed, color: "bg-green-500", pulse: false, isError: false },
        { label: "Lỗi hệ thống", count: data.aiProcessing.failed, color: "bg-error", pulse: false, isError: true },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Dashboard quản trị</h2>
            <p className="text-on-surface-variant text-sm mt-1">
              Chào mừng quay trở lại — đây là tóm tắt hoạt động hôm nay.
            </p>
          </div>
        </div>

        {error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error} <button onClick={loadDashboard} className="underline">Thử lại</button></div>}
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCardConfigs.map((config) => (
            <div
              key={config.key}
              className="bg-white/90 backdrop-blur-sm border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 ${config.iconBg} rounded-xl`}>
                  <span className={`material-symbols-outlined ${config.iconColor}`}>{config.icon}</span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant font-medium">{config.label}</p>
              <p className="text-3xl font-bold mt-1 text-on-surface">
                {isLoading ? "..." : (data ? formatNumber(data.stats[config.key]) : "—")}
              </p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: recent activity table */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-xl overflow-hidden">
              <div className="p-3.5 border-b border-outline-variant/10 flex justify-between items-center">
                <h4 className="font-semibold text-sm text-on-surface">Hoạt động gần đây</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container/50">
                    <tr>
                      {["Thời gian", "Học viên / Đối tượng", "Hành động", "Trạng thái"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2 text-[10px] font-bold text-outline uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-xs text-on-surface-variant">
                          Đang tải hoạt động gần đây...
                        </td>
                      </tr>
                    ) : data && data.recentActivity.length > 0 ? (
                      data.recentActivity.map((row) => <ActivityRow key={row.id} row={row} />)
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-xs text-on-surface-variant">
                          Chưa có hoạt động nào gần đây.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right sidebar: AI processing status */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm border-l-4 border-primary border border-slate-200/80 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    neurology
                  </span>
                </div>
                <h4 className="font-bold text-on-surface">Trạng thái xử lý AI</h4>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-on-surface-variant">Đang tải...</p>
                ) : (
                  aiProcessingItems.map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${item.color} ${item.pulse ? "animate-pulse" : ""}`} />
                        <span className="text-sm text-on-surface-variant">{item.label}</span>
                      </div>
                      <span className={`font-bold text-sm ${item.isError ? "text-error" : "text-on-surface"}`}>
                        {item.count}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboardPage;