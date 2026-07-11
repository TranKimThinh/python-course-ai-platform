import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Info,
  LockKeyhole,
  Mail,
  MailCheck,
  Terminal,
} from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const illustrationUrl = new URL("../../assets/images/register-illustration.png.png", import.meta.url).href;

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const transitionTimerRef = useRef<number | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(
    () => () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    },
    [],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError("");

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setEmailError("Vui lòng nhập email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailError("Email không hợp lệ.");
      return;
    }

    console.log({ email: normalizedEmail });
    setIsTransitioning(true);
    transitionTimerRef.current = window.setTimeout(() => {
      setIsSubmitted(true);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="grid min-h-[calc(100vh-160px)] grid-cols-1 bg-white lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#eff4ff] px-10 py-14 lg:flex lg:items-center lg:justify-center">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#4f46e5]/25 blur-[100px]" aria-hidden={true} />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#0058be]/25 blur-[100px]" aria-hidden={true} />

        <div className="relative z-10 max-w-xl text-center">
          <div className="relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-white/80 shadow-2xl shadow-indigo-300/50">
            <img
              src={illustrationUrl}
              alt="Minh họa học Python cùng trí tuệ nhân tạo"
              className="h-[390px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-4">
              {[Terminal, Bot, LockKeyhole].map((Icon, index) => (
                <span
                  key={index}
                  className="glass-effect flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white"
                >
                  <Icon size={24} aria-hidden={true} />
                </span>
              ))}
            </div>
          </div>
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight">Học Python cùng Trí tuệ nhân tạo</h1>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-[#464555]">
            Trải nghiệm phương pháp học tập hiện đại, cá nhân hóa cho từng lộ trình phát triển của bạn.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="relative">
            {!isSubmitted ? (
              <div
                className={`auth-card transition-opacity-custom rounded-xl border border-[#c7c4d8]/70 bg-white p-6 sm:p-8 ${
                  isTransitioning ? "scale-95 opacity-0" : "scale-100 opacity-100"
                }`}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e2dfff] text-[#3525cd]">
                  <LockKeyhole size={28} aria-hidden={true} />
                </span>
                <h2 className="mt-6 text-3xl font-extrabold tracking-tight">Quên mật khẩu?</h2>
                <p className="mt-3 leading-7 text-[#464555]">
                  Nhập email đã đăng ký tài khoản. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-7">
                  <label htmlFor="email" className="mb-2 block text-sm font-bold">
                    Email của bạn
                  </label>
                  <div
                    className={`group relative rounded-xl transition duration-200 focus-within:scale-[1.01] ${
                      emailError ? "text-[#ba1a1a]" : "text-[#777587] focus-within:text-[#3525cd]"
                    }`}
                  >
                    <Mail
                      size={20}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                      aria-hidden={true}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="vidu@gmail.com"
                      required
                      value={email}
                      aria-invalid={Boolean(emailError)}
                      aria-describedby={emailError ? "email-error" : undefined}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setEmailError("");
                      }}
                      className={`w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-[#0b1c30] outline-none transition focus:ring-2 focus:ring-[#3525cd]/20 ${
                        emailError ? "border-[#ba1a1a]" : "border-[#c7c4d8] focus:border-[#3525cd]"
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p id="email-error" className="mt-2 text-sm font-semibold text-[#ba1a1a]">
                      {emailError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isTransitioning}
                    className="primary-gradient-btn group mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 font-bold text-white disabled:cursor-wait disabled:opacity-70"
                  >
                    Gửi hướng dẫn đặt lại mật khẩu
                    <ArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden={true}
                    />
                  </button>
                </form>

                <div className="mt-7 border-t border-[#c7c4d8]/70 pt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 font-bold text-[#3525cd] transition hover:text-[#0058be]"
                  >
                    <ArrowLeft size={18} aria-hidden={true} />
                    Quay lại đăng nhập
                  </Link>
                  <p className="mt-4 text-sm text-[#464555]">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="font-bold text-[#3525cd] hover:underline">
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="auth-card transition-opacity-custom scale-100 rounded-xl border border-[#c7c4d8]/70 bg-white p-6 text-center opacity-100 sm:p-8">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d8e2ff] text-[#0058be]">
                  <MailCheck size={32} aria-hidden={true} />
                </span>
                <h2 className="mt-6 text-3xl font-extrabold tracking-tight">Kiểm tra email của bạn</h2>
                <p className="mt-3 leading-7 text-[#464555]">
                  Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3525cd] px-5 py-4 font-bold text-white transition hover:bg-[#2d1fb7] active:scale-95"
                >
                  <ArrowLeft size={20} aria-hidden={true} />
                  Quay lại đăng nhập
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-3 rounded-xl border-l-4 border-[#0058be] bg-[#eff4ff] p-4 animate-pulse">
            <Info size={20} className="mt-0.5 shrink-0 text-[#0058be]" aria-hidden={true} />
            <p className="text-sm leading-6 text-[#464555]">
              Vì lý do bảo mật, liên kết đặt lại mật khẩu chỉ có hiệu lực trong một thời gian ngắn.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForgotPasswordPage;
