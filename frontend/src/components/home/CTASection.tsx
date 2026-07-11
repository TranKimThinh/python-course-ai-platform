import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="page-container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 px-6 py-12 text-white shadow-soft sm:px-10 lg:px-14">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[36px] border-white/5" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-indigo-100">
                <Sparkles size={17} />
                Bắt đầu hành trình của bạn
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Sẵn sàng để học Python hiệu quả hơn?
              </h2>
              <p className="mt-4 leading-7 text-indigo-100">
                Đăng ký để nhận thông tin khóa học mới và trải nghiệm phương pháp học cùng AI.
              </p>
            </div>
            <form
              className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="relative block">
                <span className="sr-only">Email của bạn</span>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="Email của bạn"
                  className="focus-ring h-[52px] w-full rounded-xl border-0 bg-white py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 sm:w-72"
                />
              </label>
              <Link
                to="/register"
                className="focus-ring inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
              >
                Đăng ký ngay
                <ArrowRight size={18} />
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
