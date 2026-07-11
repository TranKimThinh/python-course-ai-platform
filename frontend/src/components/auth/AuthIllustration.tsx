import { Bot, Braces, GraduationCap } from "lucide-react";
import { type MouseEvent } from "react";
import { Link } from "react-router-dom";

const loginIllustration = new URL(
  "../../assets/images/register-illustration.png.png",
  import.meta.url,
).href;

function AuthIllustration() {
  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const primaryBlob = event.currentTarget.querySelector(".login-blob-primary") as HTMLElement | null;
    const secondaryBlob = event.currentTarget.querySelector(".login-blob-secondary") as HTMLElement | null;

    if (primaryBlob) {
      primaryBlob.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    }

    if (secondaryBlob) {
      secondaryBlob.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative hidden min-h-screen flex-1 items-center justify-center overflow-hidden bg-slate-100 p-10 md:flex xl:p-12"
    >
      <div className="absolute inset-0 z-0 opacity-40" aria-hidden="true">
        <div className="login-blob login-blob-primary" />
        <div className="login-blob login-blob-secondary" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <Link
          to="/"
          className="focus-ring mb-12 flex w-fit items-center gap-3 rounded-xl"
          aria-label="Về trang chủ Python AI Learning"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-200">
            <Braces size={23} strokeWidth={2.5} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-950">
            Python <span className="text-indigo-600">AI</span> Learning
          </span>
        </Link>

        <div className="mb-12">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-950 xl:text-4xl">
            Python AI Learning
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">
            Khám phá sức mạnh của lập trình Python kết hợp cùng Trí tuệ nhân tạo thế hệ mới.
          </p>
        </div>

        <div className="w-full transform transition-transform duration-700 hover:scale-105">
          <img
            src={loginIllustration}
            alt="AI Learning Platform Illustration"
            className="h-auto w-full drop-shadow-2xl"
          />
        </div>

        <div className="mt-12 flex flex-wrap gap-4 xl:mt-16 xl:gap-6">
          <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-slate-900 shadow-md backdrop-blur-md">
            <GraduationCap size={18} className="text-indigo-600" />
            <span className="text-sm font-semibold">120+ Khóa học</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-slate-900 shadow-md backdrop-blur-md">
            <Bot size={18} className="text-blue-600" />
            <span className="text-sm font-semibold">AI Mentor 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthIllustration;
