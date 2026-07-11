import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  UserRound,
  AtSign,
} from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { parseApiError } from "../../services/authService";

type UserRole = "student" | "instructor";

interface RegisterFormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  acceptedTerms: boolean;
}

type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>> & { submit?: string };

interface FormFieldProps {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  value: string;
  placeholder: string;
  autoComplete: string;
  icon: ReactNode;
  error?: string;
  onChange: (value: string) => void;
  trailingAction?: ReactNode;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_.]{3,30}$/;

function FormField({
  id,
  label,
  type,
  value,
  placeholder,
  autoComplete,
  icon,
  error,
  onChange,
  trailingAction,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
            error ? "text-rose-500" : "text-slate-400"
          }`}
        >
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={`h-[50px] w-full rounded-xl border bg-slate-50 py-3 pl-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
            trailingAction ? "pr-12" : "pr-4"
          } ${
            error
              ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
              : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
          }`}
        />
        {trailingAction}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.2c1.9-1.8 3-4.4 3-7.5Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.3l-3.2-2.6c-.9.6-2 1-3.4 1a5.8 5.8 0 0 1-5.5-4H3.2v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.5 14.1a6 6 0 0 1 0-4.2V7.3H3.2a10 10 0 0 0 0 9.4l3.3-2.6Z" />
      <path fill="#EA4335" d="M12 5.9c1.5 0 2.9.5 4 1.5l3-3A10 10 0 0 0 3.2 7.3l3.3 2.6a5.8 5.8 0 0 1 5.5-4Z" />
    </svg>
  );
}

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const clearError = (field: keyof RegisterFormData) => {
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: RegisterFormErrors = {};
    const normalizedEmail = email.trim();
    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
      nextErrors.username = "Vui lòng nhập tên đăng nhập.";
    } else if (!usernamePattern.test(normalizedUsername)) {
      nextErrors.username = "Tên đăng nhập chỉ gồm chữ, số, dấu gạch dưới, 3-30 ký tự.";
    }

    if (!fullName.trim()) nextErrors.fullName = "Vui lòng nhập họ và tên.";

    if (!normalizedEmail) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!emailPattern.test(normalizedEmail)) {
      nextErrors.email = "Email chưa đúng định dạng.";
    }

    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      nextErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (!acceptedTerms) nextErrors.acceptedTerms = "Bạn cần đồng ý với điều khoản sử dụng.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await register({
        username: normalizedUsername,
        email: normalizedEmail,
        full_name: fullName.trim(),
        password,
        role,
      });

      navigate("/login", {
        replace: true,
        state: { registeredMessage: "Đăng ký thành công! Vui lòng đăng nhập." },
      });
    } catch (error) {
      setErrors({ submit: parseApiError(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordVisibilityButton = (
    visible: boolean,
    toggle: () => void,
    label: string,
  ) => (
    <button
      type="button"
      onClick={toggle}
      className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
      aria-label={visible ? `Ẩn ${label}` : `Hiện ${label}`}
      aria-pressed={visible}
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-card sm:p-8 xl:p-10">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-gradient-to-bl from-indigo-100/70 to-transparent" />

      <div className="relative">
        <header className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Tham gia ngay hôm nay</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            Tạo tài khoản học viên
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Bắt đầu hành trình học Python với sự hỗ trợ của AI
          </p>
        </header>

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="username"
            label="Tên đăng nhập"
            type="text"
            value={username}
            placeholder="nguyenvana"
            autoComplete="username"
            icon={<AtSign size={19} />}
            error={errors.username}
            onChange={(value) => {
              setUsername(value);
              clearError("username");
            }}
          />

          <FormField
            id="fullName"
            label="Họ và tên"
            type="text"
            value={fullName}
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            icon={<UserRound size={19} />}
            error={errors.fullName}
            onChange={(value) => {
              setFullName(value);
              clearError("fullName");
            }}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            value={email}
            placeholder="example@gmail.com"
            autoComplete="email"
            icon={<Mail size={19} />}
            error={errors.email}
            onChange={(value) => {
              setEmail(value);
              clearError("email");
            }}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="••••••••"
              autoComplete="new-password"
              icon={<LockKeyhole size={19} />}
              error={errors.password}
              onChange={(value) => {
                setPassword(value);
                clearError("password");
              }}
              trailingAction={passwordVisibilityButton(
                showPassword,
                () => setShowPassword((current) => !current),
                "mật khẩu",
              )}
            />

            <FormField
              id="confirmPassword"
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
              icon={<KeyRound size={19} />}
              error={errors.confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                clearError("confirmPassword");
              }}
              trailingAction={passwordVisibilityButton(
                showConfirmPassword,
                () => setShowConfirmPassword((current) => !current),
                "mật khẩu xác nhận",
              )}
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-700">Vai trò</legend>
            <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1">
              {([
                ["student", "Học viên"],
                ["instructor", "Giảng viên"],
              ] as const).map(([value, label]) => {
                const isActive = role === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    aria-pressed={isActive}
                    className={`focus-ring rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => {
                  setAcceptedTerms(event.target.checked);
                  clearError("acceptedTerms");
                }}
                className="peer sr-only"
                aria-invalid={!!errors.acceptedTerms}
                aria-describedby={errors.acceptedTerms ? "acceptedTerms-error" : undefined}
              />
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 ${
                  acceptedTerms
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : errors.acceptedTerms
                      ? "border-rose-400 bg-rose-50 text-transparent"
                      : "border-slate-300 bg-white text-transparent"
                }`}
              >
                <Check size={14} strokeWidth={3} />
              </span>
              <span>
                Tôi đồng ý với{" "}
                <Link to="/terms" className="font-semibold text-indigo-600 transition hover:text-indigo-800 hover:underline">
                  điều khoản sử dụng
                </Link>
              </span>
            </label>
            {errors.acceptedTerms && (
              <p id="acceptedTerms-error" className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.acceptedTerms}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="focus-ring group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            {!isSubmitting && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
          </button>
          {errors.submit && (
            <p className="text-center text-sm font-medium text-rose-600">{errors.submit}</p>
          )}
        </form>

        <div className="my-6 flex items-center gap-3" aria-label="Hoặc đăng ký bằng">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Hoặc đăng ký bằng</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="focus-ring flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            className="focus-ring flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-blue-50/50 hover:shadow-sm active:scale-[0.98]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2] text-sm font-extrabold leading-none text-white">
              f
            </span>
            Facebook
          </button>
        </div> */}

        <p className="mt-7 text-center text-sm text-slate-500">
          Đã có tài khoản?{" "}
          <Link to="/login" className="focus-ring rounded font-bold text-indigo-600 transition hover:text-indigo-800">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;