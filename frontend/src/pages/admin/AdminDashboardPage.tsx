import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";

interface StatCard {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  badge: string;
  badgeColor: string;
}

const stats: StatCard[] = [
  {
    label: "Tổng học viên",
    value: "1,250",
    icon: "group",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    badge: "+12%",
    badgeColor: "text-green-600 bg-green-50",
  },
  {
    label: "Tổng khóa học",
    value: "24",
    icon: "auto_stories",
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
    badge: "Ổn định",
    badgeColor: "text-on-surface-variant bg-surface-container",
  },
  {
    label: "Video đã xử lý AI",
    value: "185",
    icon: "movie",
    iconColor: "text-on-secondary-fixed-variant",
    iconBg: "bg-surface-container-highest/50",
    badge: "+5 mới",
    badgeColor: "text-blue-600 bg-blue-50",
  },
  {
    label: "Lượt hỏi AI",
    value: "4,820",
    icon: "bolt",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    badge: "+48%",
    badgeColor: "text-green-600 bg-green-50",
  },
];

const recentActivity = [
  {
    time: "2 phút trước",
    subject: "Nguyễn Văn A",
    subjectType: "user",
    initial: "A",
    action: "Đã đăng ký khóa học Python Cơ Bản",
    status: "HOÀN THÀNH",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    time: "1 giờ trước",
    subject: "Trần Thị B",
    subjectType: "user",
    initial: "B",
    action: "Đã hỏi AI về 'Hàm trong Python'",
    status: "ĐÃ TRẢ LỜI",
    statusColor: "bg-green-100 text-green-700",
  },
];

const aiProcessing = [
  { label: "Chưa xử lý", count: 0, color: "bg-outline", pulse: false, isError: false },
  { label: "Đang xử lý", count: 2, color: "bg-blue-500", pulse: true, isError: false },
  { label: "Hoàn thành", count: 185, color: "bg-green-500", pulse: false, isError: false },
  { label: "Lỗi hệ thống", count: 1, color: "bg-error", pulse: false, isError: true },
];

const quickActions = [
  { icon: "cloud_upload", label: "Tải Video" },
  { icon: "analytics", label: "Báo cáo AI" },
  { icon: "support_agent", label: "Hỗ trợ" },
  { icon: "settings", label: "Cấu hình" },
];

const barHeights = ["60%", "40%", "75%", "90%", "55%", "85%", "95%"];
const gpuHeights = ["20%", "35%", "60%", "80%", "45%", "90%", "75%", "15%"];
const aiQueryBars = [
  { label: "Python Cơ Bản", pct: 65, color: "bg-primary" },
  { label: "Xử lý dữ liệu", pct: 42, color: "bg-secondary" },
  { label: "AI & Machine Learning", pct: 88, color: "bg-primary-container" },
];

function AdminDashboardPage() {
  const navigate = useNavigate();

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

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/90 backdrop-blur-sm border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 ${s.iconBg} rounded-xl`}>
                  <span className={`material-symbols-outlined ${s.iconColor}`}>{s.icon}</span>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.badgeColor}`}>
                  {s.badge}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant font-medium">{s.label}</p>
              <p className="text-3xl font-bold mt-1 text-on-surface">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Charts area */}
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Activity bar chart */}
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-on-surface">Hoạt động học tập</h4>
                  <select className="text-xs border-none bg-surface-container rounded-lg py-1 px-2 outline-none">
                    <option>7 ngày qua</option>
                    <option>30 ngày qua</option>
                  </select>
                </div>
                <div className="h-44 flex items-end gap-2 px-6 relative">
                  <div className="absolute left-2 inset-y-0 flex flex-col justify-between py-1 text-[10px] text-outline pointer-events-none">
                    <span>200</span><span>150</span><span>100</span><span>50</span><span>0</span>
                  </div>
                  {barHeights.map((h, i) => (
                    <div
                      key={i}
                      style={{ height: h }}
                      className={`flex-1 rounded-t transition-colors ${i === barHeights.length - 1
                          ? "bg-primary"
                          : "bg-primary/20 hover:bg-primary/40"
                        }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-3 px-6 text-[10px] text-outline font-medium">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>

              {/* AI query breakdown */}
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-on-surface">Lượt hỏi đáp AI</h4>
                  <button className="text-outline hover:text-primary">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
                <div className="space-y-5">
                  {aiQueryBars.map((b) => (
                    <div key={b.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>{b.label}</span>
                        <span className="font-semibold">{b.pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full ${b.color} rounded-full transition-all`}
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent activity table */}
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-xl overflow-hidden">
              <div className="p-3.5 border-b border-outline-variant/10 flex justify-between items-center">
                <h4 className="font-semibold text-sm text-on-surface">Hoạt động gần đây</h4>
                <button className="text-primary text-[11px] font-semibold hover:underline">Xem tất cả</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container/50">
                    <tr>
                      {["Thời gian", "Học viên / Đối tượng", "Hành động", "Trạng thái"].map((h) => (
                        <th
                          key={h}
                          // Thêm whitespace-nowrap vào Header để chống rớt dòng
                          className="px-4 py-2 text-[10px] font-bold text-outline uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {recentActivity.map((row, i) => (
                      <tr key={i} className="hover:bg-surface-container/30 transition-colors">
                        {/* Thêm whitespace-nowrap vào Cột Thời gian */}
                        <td className="px-4 py-2.5 text-xs text-on-surface-variant whitespace-nowrap">
                          {row.time}
                        </td>
                        {/* Thêm whitespace-nowrap vào Cột Đối tượng */}
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {row.subjectType === "user" ? (
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                                {row.initial}
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                <span className="material-symbols-outlined text-[14px]">
                                  video_library
                                </span>
                              </div>
                            )}
                            <span className="text-xs font-medium text-on-surface">
                              {row.subject}
                            </span>
                          </div>
                        </td>
                        {/* Thêm whitespace-nowrap vào Cột Hành động */}
                        <td className="px-4 py-2.5 text-xs text-on-surface whitespace-nowrap">{row.action}</td>
                        {/* Thêm whitespace-nowrap vào Cột Trạng thái */}
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${row.statusColor}`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right sidebar widgets */}
          <div className="space-y-6">
            {/* AI processing status */}
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
                {aiProcessing.map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full ${item.color} ${item.pulse ? "animate-pulse" : ""
                          }`}
                      />
                      <span className="text-sm text-on-surface-variant">{item.label}</span>
                    </div>
                    <span
                      className={`font-bold text-sm ${item.isError ? "text-error" : "text-on-surface"}`}
                    >
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* GPU activity mini chart */}
              <div className="mt-6 pt-5 border-t border-outline-variant/10">
                <p className="text-[10px] uppercase font-bold text-outline tracking-widest mb-3">
                  Hoạt động GPU
                </p>
                <div className="flex items-end gap-1 h-10">
                  {gpuHeights.map((h, i) => (
                    <div
                      key={i}
                      style={{ height: h }}
                      className={`flex-1 rounded-t ${i < 2 ? "bg-surface-container" : i < 5 ? "bg-primary/40" : "bg-primary"
                        }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-outline">Tải hệ thống: 78%</span>
                  <span className="text-[10px] text-outline">Nhiệt độ: 62°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboardPage;
