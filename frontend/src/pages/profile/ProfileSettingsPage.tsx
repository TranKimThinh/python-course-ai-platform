import {
  ArrowLeft,
  Bell,
  BookOpenCheck,
  Database,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const settingsSections = [
  {
    title: "Thông tin tài khoản",
    description: "Cập nhật họ tên, email và thông tin liên hệ.",
    icon: UserRound,
  },
  {
    title: "Bảo mật",
    description: "Quản lý mật khẩu và các tùy chọn đăng nhập.",
    icon: LockKeyhole,
  },
  {
    title: "Thông báo",
    description: "Chọn các thông báo học tập bạn muốn nhận.",
    icon: Bell,
  },
  {
    title: "Quyền riêng tư",
    description: "Kiểm soát cách thông tin của bạn được hiển thị.",
    icon: BookOpenCheck,
  },
  {
    title: "Dữ liệu học tập",
    description: "Xem và quản lý dữ liệu tiến độ, quiz và lịch sử AI.",
    icon: Database,
  },
];

function ProfileSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
        <div className="page-container py-10 sm:py-14">
          <nav className="flex items-center gap-2 text-sm font-semibold text-slate-500" aria-label="Breadcrumb">
            <Link to="/profile" className="transition hover:text-indigo-600">
              Hồ sơ cá nhân
            </Link>
            <span aria-hidden={true}>/</span>
            <span className="text-indigo-600">Cài đặt tài khoản</span>
          </nav>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Quản lý các tùy chọn tài khoản, bảo mật và dữ liệu học tập.
          </p>
        </div>
      </section>

      <main className="page-container py-8 sm:py-10">
        <div className="grid gap-4 md:grid-cols-2">
          {settingsSections.map(({ title, description, icon: Icon }) => (
            <section key={title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Icon size={21} aria-hidden={true} />
              </span>
              <h2 className="mt-4 text-lg font-extrabold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </section>
          ))}
        </div>

        <Link
          to="/profile"
          className="focus-ring mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          <ArrowLeft size={18} aria-hidden={true} />
          Quay lại hồ sơ
        </Link>
      </main>
    </div>
  );
}

export default ProfileSettingsPage;
