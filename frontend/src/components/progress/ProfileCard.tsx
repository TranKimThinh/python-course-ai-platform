import { Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type StudentProfile } from "./progressTypes";

interface ProfileCardProps {
  profile: StudentProfile;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  // Lấy chữ cái đầu của từ đầu và từ cuối (vd "Nguyễn Văn A" -> "NA")
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return `${first}${last}`.toUpperCase();
}

function ProfileCard({ profile }: ProfileCardProps) {
  const navigate = useNavigate();
  const initials = getInitials(profile.name);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-2xl font-extrabold text-white shadow-lg shadow-indigo-200">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <h2 className="mt-4 text-xl font-extrabold text-slate-950">{profile.name}</h2>
      <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
      <span className="mt-4 inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-700">
        {profile.level}
      </span>
      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
      >
        <Edit3 size={16} />
        Chỉnh sửa hồ sơ
      </button>
    </section>
  );
}

export default ProfileCard;