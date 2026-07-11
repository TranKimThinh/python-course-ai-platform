import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AccountActions() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      await logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <section className="grid gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-card">
      <button
        type="button"
        onClick={handleLogout}
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
      >
        <LogOut size={17} />
        Đăng xuất
      </button>
    </section>
  );
}

export default AccountActions;
