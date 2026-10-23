import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import AccountActions from "../../components/profile/AccountActions";
import ProfileHeaderCard from "../../components/profile/ProfileHeaderCard";
import ProfileInfoForm from "../../components/profile/ProfileInfoForm";
import SecurityForm from "../../components/profile/SecurityForm";
import {
  type PasswordFormData,
  type PasswordFormErrors,
  type ProfileFormData,
} from "../../components/profile/profileTypes";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import { Link } from "react-router-dom";
import { parseApiError } from "../../services/authService";

function ProfilePage() {
  const { user, token, refreshUser } = useAuth();

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordFormErrors>({});

  // Đổ dữ liệu user thật vào form ngay khi có (hoặc khi user thay đổi)
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone ?? "",
      });
    }
  }, [user]);

  // Tự động ẩn thông báo sau 4 giây
  useEffect(() => {
    if (!profileMessage) return;
    const timer = window.setTimeout(() => setProfileMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [profileMessage]);

  const handleProfileSubmit = async () => {
    if (!user || !token) return;

    setIsSavingProfile(true);
    setProfileMessage(null);

    try {
      await profileService.updateProfile(user.id, {
        full_name: profileForm.fullName,
        email: profileForm.email,
        phone: profileForm.phone,
      });
      await refreshUser(); // load lại thông tin mới nhất, đồng bộ với Header
      setProfileMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
    } catch (error) {
      setProfileMessage({ type: "error", text: parseApiError(error) });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSecuritySubmit = async () => {
    const nextErrors: PasswordFormErrors = {};
    const hasNewPassword = Boolean(passwordForm.newPassword || passwordForm.confirmPassword);

    if (hasNewPassword && !passwordForm.currentPassword) {
      nextErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
    }

    if (passwordForm.newPassword && passwordForm.newPassword.length < 6) {
      nextErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    }

    if (hasNewPassword && passwordForm.confirmPassword !== passwordForm.newPassword) {
      nextErrors.confirmPassword = "Xác nhận mật khẩu không khớp.";
    }

    setPasswordErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0 && hasNewPassword) {
      try {
        if (!user) return;

        await profileService.updatePassword(user.id, {
            old_password: passwordForm.currentPassword,
            new_password: passwordForm.newPassword,
        });
        alert("Đổi mật khẩu thành công!");
      
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        
      } catch (error) {
        // Hứng lỗi từ Backend trả về (Ví dụ: 400 Mật khẩu cũ không đúng)
        console.error("Lỗi từ server:", error);
        alert("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.");
      }
    }
};

  if (!user) return null; // ProtectedRoute đảm bảo có user, phòng hờ render trước khi hydrate xong

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
          <div className="page-container py-10 sm:py-14">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Hồ sơ cá nhân</h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Quản lý thông tin tài khoản và theo dõi tiến trình học tập của bạn.
            </p>
          </div>
        </section>

        <section className="page-container grid gap-7 py-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-10">
          <div className="space-y-7">
            <ProfileHeaderCard
              fullName={user.fullName}
              email={user.email}
              role={user.role}
              avatarUrl={user.avatarUrl}
            />

            <ProfileInfoForm data={profileForm} onChange={setProfileForm} onSubmit={handleProfileSubmit} />
            {isSavingProfile && <p className="text-sm font-medium text-slate-500">Đang lưu...</p>}
            {profileMessage && (
              <div
                className={`flex items-center gap-3 rounded-2xl border p-4 text-sm font-semibold shadow-sm transition ${
                  profileMessage.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {profileMessage.type === "success" ? (
                  <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
                ) : (
                  <XCircle size={20} className="shrink-0 text-rose-600" />
                )}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <SecurityForm
              data={passwordForm}
              errors={passwordErrors} 
              onChange={(nextData) => {
                setPasswordForm(nextData);
                setPasswordErrors({});
              }}
              onSubmit={handleSecuritySubmit}
            />
          </div>

          <aside className="space-y-7">
            <Link to="/profile/activities" className="block rounded-2xl border bg-white p-5 font-bold text-indigo-700">Xem hoạt động học tập của bạn</Link>
            <AccountActions />

          </aside>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;
