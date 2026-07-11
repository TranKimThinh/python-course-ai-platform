import { type FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { parseApiError } from "../../services/authService";
import GoogleLoginButton from "./GoogleLoginButton";

interface LoginFormErrors {
  identifier?: string;
  password?: string;
  submit?: string;
}

function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)
      ?.from;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: LoginFormErrors = {};

    if (!identifier.trim()) {
      nextErrors.identifier = "Vui lòng nhập email hoặc tên đăng nhập.";
    }

    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const authenticatedUser = await login(identifier.trim(), password);

      if (authenticatedUser.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      const studentRedirect =
        redirectTo?.pathname?.startsWith("/admin")
          ? "/courses"
          : redirectTo
            ? `${redirectTo.pathname ?? "/courses"}${redirectTo.search ?? ""}${redirectTo.hash ?? ""}`
            : "/courses";

      navigate(studentRedirect, { replace: true });
    } catch (error) {
      setErrors({ submit: parseApiError(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">Chào mừng trở lại</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Đăng nhập</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          Tiếp tục học Python cùng trợ lý AI thông minh
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="identifier" className="mb-2 block text-sm font-semibold text-slate-700">
            Email hoặc tên đăng nhập
          </label>
          <div className="relative">
            <Mail
              size={19}
              className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                errors.identifier ? "text-rose-500" : "text-slate-400"
              }`}
            />
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(event) => {
                setIdentifier(event.target.value);
                if (errors.identifier || errors.submit) {
                  setErrors((current) => ({ ...current, identifier: undefined, submit: undefined }));
                }
              }}
              placeholder="email@example.com hoặc tên đăng nhập"
              aria-describedby={errors.identifier ? "identifier-error" : undefined}
              className={`h-[52px] w-full rounded-2xl border bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                errors.identifier
                  ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
          </div>
          {errors.identifier && (
            <p id="identifier-error" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.identifier}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
              Mật khẩu
            </label>
            <Link
              to="/forgot-password"
              className="focus-ring rounded text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <LockKeyhole
              size={19}
              className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                errors.password ? "text-rose-500" : "text-slate-400"
              }`}
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
              }}
              placeholder="Nhập mật khẩu"
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`h-[52px] w-full rounded-2xl border bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                errors.password
                  ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.password}
            </p>
          )}
        </div>

        <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Ghi nhớ đăng nhập
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="focus-ring group flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl hover:shadow-indigo-200 disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        {errors.submit && (
          <p className="mt-3 text-center text-sm font-medium text-rose-600">
            {errors.submit}
          </p>
        )}
      </form>

      <div className="my-7 flex items-center gap-3" aria-label="hoặc đăng nhập bằng">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">hoặc đăng nhập bằng</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex justify-center">
        <GoogleLoginButton />
      </div>

      <p className="mt-7 text-center text-sm text-slate-500">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="focus-ring rounded font-bold text-indigo-600 transition hover:text-indigo-800">
          Đăng ký ngay
        </Link>
      </p>

      <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
        Dành cho Học viên, Giảng viên và Quản trị viên
      </p>
    </div>
  );
}

export default LoginForm;