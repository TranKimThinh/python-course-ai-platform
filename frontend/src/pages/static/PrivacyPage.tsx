import {
  Bot,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function FadeInCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

const summaryCards = [
  {
    title: "Thông tin cá nhân",
    description: "Họ tên, email, số điện thoại và thông tin định danh cơ bản.",
    icon: UserRound,
  },
  {
    title: "Dữ liệu học tập",
    description: "Tiến độ khóa học, bài tập, kết quả quiz và chứng chỉ đã đạt được.",
    icon: GraduationCap,
  },
  {
    title: "Dữ liệu AI",
    description: "Nội dung truy vấn gửi cho AI Assistant và các phản hồi tương ứng.",
    icon: Bot,
  },
  {
    title: "Bảo mật hệ thống",
    description: "Các biện pháp mã hóa, tường lửa và giám sát truy cập tài khoản.",
    icon: ShieldCheck,
  },
];

const collectedData = [
  "Thông tin đăng ký: Tên, địa chỉ email, mật khẩu và thông tin mạng xã hội nếu bạn chọn đăng ký bằng bên thứ ba.",
  "Hồ sơ người dùng: Ảnh đại diện, tiểu sử và mục tiêu học tập bạn tự nguyện cung cấp.",
  "Dữ liệu tiến trình: Thời gian học, các bài thực hành Python đã hoàn thành và kết quả kiểm tra.",
  "Lịch sử AI: Tất cả các đoạn hội thoại, đoạn mã bạn gửi cho trợ lý AI Assistant để hỗ trợ việc học.",
  "Nhật ký kỹ thuật: Địa chỉ IP, loại trình duyệt, hệ điều hành và cách bạn tương tác với nền tảng.",
];

const usagePurposes = [
  {
    text: "Cung cấp trải nghiệm học tập được cá nhân hóa dựa trên trình độ hiện tại của bạn.",
    icon: Target,
  },
  {
    text: "Theo dõi và phân tích hiệu suất học tập để đề xuất lộ trình Python phù hợp nhất.",
    icon: TrendingUp,
  },
  {
    text: "Nâng cao chất lượng nội dung khóa học và các thuật toán gợi ý của AI.",
    icon: Sparkles,
  },
  {
    text: "Đảm bảo an toàn hệ thống, ngăn chặn các hành vi gian lận và tấn công mạng.",
    icon: Shield,
  },
];

const userRights = [
  {
    title: "Quyền truy cập và xem dữ liệu cá nhân đang lưu trữ.",
    icon: Eye,
  },
  {
    title: "Quyền cập nhật hoặc chỉnh sửa thông tin không chính xác.",
    icon: Edit3,
  },
  {
    title: "Quyền yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan.",
    icon: Trash2,
  },
  {
    title: "Quyền xuất dữ liệu học tập về máy cá nhân.",
    icon: Download,
  },
];

const securityCommitments = [
  {
    text: "Mã hóa đầu cuối SSL 256-bit",
    icon: Shield,
  },
  {
    text: "Bảo mật 2 lớp (2FA) nâng cao",
    icon: Lock,
  },
  {
    text: "Tuân thủ tiêu chuẩn GDPR",
    icon: ShieldCheck,
  },
];

function PrivacyPage() {
  return (
    <div className="relative overflow-hidden bg-[#f8f9ff] text-[#0b1c30]">
      <div className="pointer-events-none absolute right-[-8rem] top-8 h-72 w-72 rounded-full bg-[#4f46e5]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-32 left-[-8rem] h-72 w-72 rounded-full bg-[#0058be]/10 blur-3xl" />

      <section className="page-container relative py-14 text-center sm:py-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e2dfff] px-4 py-2 text-sm font-bold text-[#0f0069]">
          <ShieldCheck size={18} aria-hidden={true} />
          Dữ liệu học tập được bảo vệ
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">Chính sách bảo mật</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#464555]">
          Python AI Learning cam kết bảo vệ thông tin cá nhân, dữ liệu học tập và lịch sử tương tác AI của người dùng
          thông qua các tiêu chuẩn an ninh hàng đầu.
        </p>
      </section>

      <section className="page-container relative pb-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <FadeInCard key={card.title}>
                <article className="ambient-shadow lift-hover h-full rounded-2xl border border-[#c7c4d8]/70 bg-white p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#3525cd]">
                    <Icon size={25} aria-hidden={true} />
                  </span>
                  <h2 className="mt-5 text-lg font-bold">{card.title}</h2>
                  <p className="mt-2 leading-6 text-[#464555]">{card.description}</p>
                </article>
              </FadeInCard>
            );
          })}
        </div>
      </section>

      <div className="page-container relative grid gap-8 pb-16 lg:grid-cols-12">
        <main className="space-y-6 lg:col-span-8">
          <FadeInCard>
            <section className="ambient-shadow rounded-2xl border border-[#c7c4d8]/70 bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-bold">1. Thông tin chúng tôi thu thập</h2>
              <ul className="mt-6 space-y-4">
                {collectedData.map((item) => (
                  <li key={item} className="flex gap-3 leading-7 text-[#464555]">
                    <CheckCircle2 size={21} className="mt-0.5 shrink-0 text-[#3525cd]" aria-hidden={true} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </FadeInCard>

          <FadeInCard>
            <section className="ambient-shadow rounded-2xl border border-[#c7c4d8]/70 bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-bold">2. Mục đích sử dụng dữ liệu</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {usagePurposes.map((purpose) => {
                  const Icon = purpose.icon;

                  return (
                    <div key={purpose.text} className="rounded-xl bg-[#eff4ff] p-4">
                      <Icon size={24} className="text-[#3525cd]" aria-hidden={true} />
                      <p className="mt-3 leading-7 text-[#464555]">{purpose.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </FadeInCard>

          <div className="grid gap-6 md:grid-cols-2">
            <FadeInCard>
              <section className="ambient-shadow h-full rounded-2xl border border-[#c7c4d8]/70 bg-white p-6">
                <h2 className="text-xl font-bold">3. Bảo vệ dữ liệu</h2>
                <p className="mt-4 leading-7 text-[#464555]">
                  Chúng tôi áp dụng các biện pháp mã hóa SSL/TLS cho tất cả các luồng dữ liệu. Hệ thống máy chủ được
                  bảo vệ bởi tường lửa đa lớp và quyền truy cập quản trị được giới hạn nghiêm ngặt theo nguyên tắc đủ
                  để dùng.
                </p>
              </section>
            </FadeInCard>

            <FadeInCard>
              <section className="ambient-shadow h-full rounded-2xl border border-[#c7c4d8]/70 bg-white p-6">
                <h2 className="text-xl font-bold">4. Dữ liệu AI Assistant</h2>
                <p className="mt-4 leading-7 text-[#464555]">
                  Dữ liệu trò chuyện được sử dụng để cải thiện phản hồi ngữ cảnh. Chúng tôi khuyến nghị người dùng
                  không nên chia sẻ thông tin nhạy cảm hoặc bí mật kinh doanh trong các khung chat AI.
                </p>
              </section>
            </FadeInCard>
          </div>

          <FadeInCard>
            <section className="ambient-shadow rounded-2xl border border-[#c7c4d8]/70 bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-bold">5. Chia sẻ dữ liệu</h2>
              <p className="mt-4 leading-7 text-[#464555]">
                Python AI Learning tuyệt đối không bán thông tin cá nhân của bạn cho bên thứ ba. Chúng tôi chỉ chia sẻ
                dữ liệu trong các trường hợp:
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#c7c4d8]/70 bg-[#eff4ff] p-5">
                  <h3 className="font-bold text-[#3525cd]">Đối tác vận hành</h3>
                  <p className="mt-2 leading-7 text-[#464555]">Các dịch vụ lưu trữ đám mây và xử lý thanh toán tin cậy.</p>
                </div>
                <div className="rounded-xl border border-[#c7c4d8]/70 bg-white p-5">
                  <h3 className="font-bold">Yêu cầu pháp lý</h3>
                  <p className="mt-2 leading-7 text-[#464555]">
                    Khi có yêu cầu chính thức từ cơ quan pháp luật theo quy định hiện hành.
                  </p>
                </div>
              </div>
            </section>
          </FadeInCard>

          <FadeInCard>
            <section className="ambient-shadow rounded-2xl border border-[#c7c4d8]/70 bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-bold">6. Quyền của người dùng</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {userRights.map((right) => {
                  const Icon = right.icon;

                  return (
                    <div key={right.title} className="lift-hover rounded-xl border border-[#c7c4d8]/70 bg-white p-5">
                      <Icon size={24} className="text-[#3525cd]" aria-hidden={true} />
                      <p className="mt-3 font-medium leading-7 text-[#464555]">{right.title}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </FadeInCard>
        </main>

        <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <FadeInCard>
            <section className="indigo-gradient ambient-shadow rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-bold">Cam kết bảo mật</h2>
              <ul className="mt-6 space-y-4">
                {securityCommitments.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.text} className="flex items-center gap-3">
                      <Icon size={22} className="shrink-0 text-[#adc6ff]" aria-hidden={true} />
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 leading-7 text-white/85">
                Sự tin tưởng của bạn là nền tảng cho sự phát triển của hệ thống Python AI Learning.
              </p>
            </section>
          </FadeInCard>

          <FadeInCard>
            <section className="glass-nav ambient-shadow rounded-2xl border border-[#c7c4d8]/70 bg-white/90 p-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eff4ff] text-[#3525cd]">
                <Mail size={28} aria-hidden={true} />
              </span>
              <h2 className="mt-5 text-xl font-bold">Câu hỏi về quyền riêng tư?</h2>
              <p className="mt-3 leading-7 text-[#464555]">
                Nếu bạn có bất kỳ thắc mắc nào về cách chúng tôi xử lý dữ liệu, vui lòng liên hệ đội ngũ pháp lý.
              </p>
              <Link
                to="/contact"
                className="mt-5 inline-flex rounded-xl bg-[#3525cd] px-5 py-3 font-bold text-white transition hover:scale-105 active:scale-95"
              >
                Liên hệ với chúng tôi
              </Link>
            </section>
          </FadeInCard>

          <FadeInCard>
            <section className="glass-nav ambient-shadow rounded-2xl border border-[#c7c4d8]/70 bg-white/90 p-6">
              <p className="text-sm font-medium uppercase tracking-wider text-[#464555]">Cập nhật lần cuối:</p>
              <p className="mt-2 text-2xl font-bold text-[#3525cd]">15/10/2024</p>
            </section>
          </FadeInCard>
        </aside>
      </div>
    </div>
  );
}

export default PrivacyPage;
