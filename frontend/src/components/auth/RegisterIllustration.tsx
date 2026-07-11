import { Bot, GraduationCap, Sparkles } from "lucide-react";

const registerIllustration = new URL(
  "../../assets/images/register-illustration.png.png",
  import.meta.url,
).href;

function RegisterIllustration() {
  return (
    <section className="relative order-2 overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-800 p-7 text-white shadow-soft md:p-10 lg:order-1 lg:min-h-[720px] xl:p-12">
      <div className="absolute -left-20 top-36 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100 backdrop-blur">
          <Sparkles size={15} className="text-blue-300" />
          Kỷ nguyên học tập mới cùng AI
        </div>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Python AI <span className="text-blue-300">Learning</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-indigo-100/90 sm:text-base">
          Bắt đầu hành trình học Python với sự hỗ trợ của AI. Hệ thống học tập thông minh giúp bạn tối ưu hóa
          thời gian và làm chủ ngôn ngữ lập trình Python nhanh hơn.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-xl overflow-visible px-4 pb-8 sm:mt-12 sm:px-8">
        <div className="relative isolate mx-auto aspect-square w-full max-w-[480px] overflow-visible md:mx-0">
          <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-indigo-500/20 via-blue-400/10 to-transparent blur-3xl" />

          <img
            src={registerIllustration}
            alt="Python AI Illustration"
            className="floating-anim h-full w-full object-contain drop-shadow-2xl"
          />

          <div className="glass-card absolute -right-2 -top-3 flex scale-90 items-center gap-3 rounded-2xl border border-white/50 p-3 text-indigo-950 shadow-xl animate-bounce delay-75 sm:-right-4 sm:-top-4 sm:scale-100 sm:p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <GraduationCap size={21} />
            </span>
            <div>
              <p className="text-xl font-extrabold leading-none">120+</p>
              <p className="mt-1 text-xs font-semibold text-slate-600">Khóa học</p>
            </div>
          </div>

          <div className="glass-card absolute -left-2 bottom-8 flex scale-90 items-center gap-3 rounded-2xl border border-white/50 p-3 text-indigo-950 shadow-xl animate-bounce sm:-left-8 sm:bottom-12 sm:scale-100 sm:p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Bot size={21} />
            </span>
            <div>
              <p className="text-base font-extrabold leading-none">AI Mentor</p>
              <p className="mt-1 text-xs font-semibold text-slate-600">Hỗ trợ 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterIllustration;
