import { Camera, GraduationCap, Mail, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const roleLabel: Record<string, string> = {
  student: "Học viên",
  instructor: "Giảng viên",
  admin: "Quản trị viên",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(-2)
    .toUpperCase();

interface ProfileHeaderCardProps {
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
}

function ProfileHeaderCard({ fullName, email, role, avatarUrl }: ProfileHeaderCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-100 blur-2xl" />
      <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <div className="relative">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-3xl font-extrabold text-white shadow-xl shadow-indigo-200">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              getInitials(fullName)
            )}
          </div>
          <button
            type="button"
            className="focus-ring absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-indigo-600 shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-50"
            aria-label="Chỉnh sửa avatar"
          >
            <Camera size={17} />
          </button>
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold text-slate-950">{fullName}</h2>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-sm text-slate-500 sm:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <Mail size={16} className="text-indigo-600" />
              {email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap size={16} className="text-indigo-600" />
              {roleLabel[role] ?? role}
            </span>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-center sm:justify-start">
            <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-700">
              {roleLabel[role] ?? role}
            </span>
            <Link
              to="/my-progress"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
            >
              <TrendingUp size={16} />
              Xem tiến độ học tập
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileHeaderCard;