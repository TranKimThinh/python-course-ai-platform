import { Braces, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { label: "Trang chủ", to: "/" },
  { label: "Về chúng tôi", to: "/about" },
  { label: "Khóa học", to: "/courses" },
  { label: "AI Assistant", to: "/ai-assistant" },
  { label: "Liên hệ", to: "/contact" },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(-2)
    .toUpperCase();

function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `focus-ring border-b-2 px-1 py-2 text-sm font-semibold transition-colors ${isActive
      ? "border-indigo-600 text-indigo-600"
      : "border-transparent text-slate-600 hover:text-indigo-600"
    }`;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="page-container flex h-[72px] items-center justify-between gap-4 py-3">
        <Link to="/" className="focus-ring flex shrink-0 items-center gap-2 rounded-lg" aria-label="Python AI Learning">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-200">
            <Braces size={21} strokeWidth={2.5} />
          </span>
          <span className="text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
            Python <span className="text-indigo-600">AI</span> Learning
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Điều hướng chính">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={navClassName}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="focus-ring rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="focus-ring rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <Link
                to={user?.role === "admin" ? "/admin" : "/profile"}
                className="focus-ring inline-flex items-center gap-3 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-xs font-extrabold text-white">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    getInitials(user?.fullName ?? "")
                  )}
                </span>
                <span className="flex flex-col items-start leading-tight">
                  <span>{user?.fullName}</span>
                  {user?.role === "admin" && (
                    <span className="text-[11px] font-medium text-indigo-600">Quản trị viên</span>
                  )}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="focus-ring rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="focus-ring rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="page-container flex flex-col gap-1 border-t border-slate-100 bg-white py-4 md:hidden">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-indigo-50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="rounded-xl border border-slate-200 px-2 py-2.5 text-center text-xs font-semibold text-slate-700">
                  Đăng nhập
                </Link>
                <Link to="/register" className="rounded-xl bg-indigo-600 px-2 py-2.5 text-center text-xs font-semibold text-white">
                  Đăng ký
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={user?.role === "admin" ? "/admin" : "/profile"}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl bg-slate-100 px-2 py-2.5 text-center text-xs font-semibold text-slate-700"
                >
                  {user?.role === "admin" ? "Trang quản trị" : "Hồ sơ"}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="rounded-xl border border-rose-200 bg-white px-2 py-2.5 text-center text-xs font-semibold text-rose-600"
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default AppHeader;
