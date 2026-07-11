import {
  Ban,
  Bot,
  Brain,
  CalendarDays,
  Code2,
  CreditCard,
  Gavel,
  Headset,
  Info,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCircle,
  UserRoundX,
  Users,
  WandSparkles,
  BookOpen,
} from "lucide-react";
import { createRef, type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type TermsSectionId =
  | "section-1"
  | "section-2"
  | "section-3"
  | "section-4"
  | "section-5"
  | "section-6"
  | "section-7"
  | "section-8"
  | "section-9";

interface TermsSection {
  id: TermsSectionId;
  navLabel: string;
  title: string;
  icon: ReactNode;
  body: ReactNode;
}

const forbiddenActions = [
  {
    title: "Tấn công hệ thống",
    description: "Hành vi hack, chèn mã độc hoặc gây nhiễu cơ sở hạ tầng.",
    icon: Code2,
  },
  {
    title: "Xúc phạm người khác",
    description: "Ngôn từ kích động thù hận, quấy rối giảng viên hoặc học viên khác.",
    icon: UserRoundX,
  },
  {
    title: "Lạm dụng AI",
    description: "Sử dụng AI để tạo nội dung rác hoặc tấn công bên thứ ba.",
    icon: WandSparkles,
  },
];

function TermsPage() {
  const sections = useMemo<TermsSection[]>(
    () => [
      {
        id: "section-1",
        navLabel: "Giới thiệu",
        title: "1. Giới thiệu",
        icon: <Info size={24} aria-hidden={true} />,
        body: (
          <div className="space-y-4">
            <p>
              Chào mừng bạn đến với Python AI Learning. Nền tảng của chúng tôi cung cấp các tài nguyên giáo dục,
              khóa học lập trình và các công cụ hỗ trợ trí tuệ nhân tạo (AI) chuyên sâu về ngôn ngữ Python.
            </p>
            <p>
              Bằng việc truy cập hoặc sử dụng bất kỳ phần nào của trang web, bạn đồng ý tuân thủ các điều khoản và
              điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ ngay lập tức.
            </p>
          </div>
        ),
      },
      {
        id: "section-2",
        navLabel: "Tài khoản người dùng",
        title: "2. Tài khoản người dùng",
        icon: <UserCircle size={24} aria-hidden={true} />,
        body: (
          <div>
            <p>Để truy cập một số tính năng nhất định, bạn có thể được yêu cầu tạo tài khoản. Bạn cam kết rằng:</p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Thông tin cung cấp khi đăng ký là chính xác, đầy đủ và luôn được cập nhật.</li>
              <li>Bạn có trách nhiệm bảo mật mật khẩu và các thông tin đăng nhập của mình.</li>
              <li>Mọi hoạt động diễn ra dưới tài khoản của bạn sẽ thuộc trách nhiệm cá nhân của bạn.</li>
              <li>Thông báo ngay cho chúng tôi nếu có bất kỳ dấu hiệu truy cập trái phép nào.</li>
            </ul>
          </div>
        ),
      },
      {
        id: "section-3",
        navLabel: "Quyền và trách nhiệm",
        title: "3. Quyền và trách nhiệm",
        icon: <ShieldCheck size={24} aria-hidden={true} />,
        body: (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#c7c4d8]/70 bg-[#eff4ff] p-5">
              <h3 className="font-bold text-[#3525cd]">Quyền của người học</h3>
              <p className="mt-2">
                Được truy cập nội dung bài học đã mua, sử dụng công cụ AI hỗ trợ và nhận phản hồi từ giảng viên
                theo quy định của khóa học.
              </p>
            </div>
            <div className="rounded-xl border border-[#c7c4d8]/70 bg-white p-5">
              <h3 className="font-bold text-[#0b1c30]">Trách nhiệm</h3>
              <p className="mt-2">
                Không chia sẻ tài khoản với người khác, không sao chép trái phép nội dung và tôn trọng cộng đồng học
                tập văn minh.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "section-4",
        navLabel: "Nội dung khóa học",
        title: "4. Nội dung khóa học",
        icon: <BookOpen size={24} aria-hidden={true} />,
        body: (
          <div className="space-y-5">
            <p>
              Tất cả nội dung bao gồm video, tài liệu, mã nguồn mẫu và giáo trình đều thuộc sở hữu trí tuệ của
              Python AI Learning hoặc các đối tác cấp phép.
            </p>
            <div className="rounded-xl border-l-4 border-[#ba1a1a] bg-[#ffdad6]/60 p-4 text-[#650008]">
              <strong>Nghiêm cấm:</strong> Việc tải xuống trái phép, ghi màn hình hoặc phân phối lại nội dung dưới
              mọi hình thức mà không có sự đồng ý bằng văn bản.
            </div>
          </div>
        ),
      },
      {
        id: "section-5",
        navLabel: "Sử dụng AI Assistant",
        title: "5. Sử dụng AI Assistant",
        icon: <Brain size={24} aria-hidden={true} />,
        body: (
          <div className="relative overflow-hidden rounded-xl border border-[#adc6ff] bg-[#e5eeff]/70 p-5">
            <Bot size={120} className="absolute -right-6 -top-8 text-[#3525cd]/10" aria-hidden={true} />
            <div className="relative space-y-4">
              <p>Công cụ AI Assistant được cung cấp để hỗ trợ giải đáp thắc mắc lập trình và gợi ý hướng dẫn học tập.</p>
              <p>
                <strong className="text-[#3525cd]">Lưu ý quan trọng:</strong> Các câu trả lời từ AI chỉ mang tính
                chất tham khảo. Chúng tôi không chịu trách nhiệm về bất kỳ sai sót kỹ thuật hoặc hậu quả nào phát
                sinh từ việc áp dụng trực tiếp các đoạn mã do AI tạo ra mà không có sự kiểm chứng.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "section-6",
        navLabel: "Thanh toán và dịch vụ",
        title: "6. Thanh toán và dịch vụ",
        icon: <CreditCard size={24} aria-hidden={true} />,
        body: (
          <p>
            Các khóa học có thể yêu cầu thanh toán một lần hoặc theo gói định kỳ. Mọi giao dịch được xử lý thông qua
            các cổng thanh toán an toàn. Chính sách hoàn tiền chỉ được áp dụng trong vòng 7 ngày kể từ khi mua khóa
            học nếu người dùng chưa hoàn thành quá 10% nội dung.
          </p>
        ),
      },
      {
        id: "section-7",
        navLabel: "Hành vi bị cấm",
        title: "7. Hành vi bị cấm",
        icon: <Ban size={24} aria-hidden={true} />,
        body: (
          <div className="grid gap-4 md:grid-cols-3">
            {forbiddenActions.map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.title} className="rounded-xl border border-[#c7c4d8]/70 bg-white p-5">
                  <Icon size={26} className="text-[#ba1a1a]" aria-hidden={true} />
                  <h3 className="mt-4 font-bold">{action.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#464555]">{action.description}</p>
                </div>
              );
            })}
          </div>
        ),
      },
      {
        id: "section-8",
        navLabel: "Thay đổi điều khoản",
        title: "8. Thay đổi điều khoản",
        icon: <RefreshCw size={24} aria-hidden={true} />,
        body: (
          <p>
            Chúng tôi bảo lưu quyền cập nhật hoặc thay đổi các điều khoản này bất kỳ lúc nào mà không cần thông báo
            trước. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên trang web.
          </p>
        ),
      },
      {
        id: "section-9",
        navLabel: "Liên hệ",
        title: "9. Liên hệ",
        icon: <Mail size={24} aria-hidden={true} />,
        body: (
          <p>
            Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ này, vui lòng liên hệ với chúng tôi qua trang{" "}
            <Link to="/contact" className="font-semibold text-[#3525cd] hover:underline">
              Liên hệ hỗ trợ
            </Link>{" "}
            hoặc gửi email tới{" "}
            <a href="mailto:support@pythonailearning.edu.vn" className="font-semibold text-[#3525cd] hover:underline">
              support@pythonailearning.edu.vn
            </a>
            .
          </p>
        ),
      },
    ],
    [],
  );

  const [activeSection, setActiveSection] = useState<TermsSectionId>("section-1");
  const sectionRefs = useMemo(
    () =>
      sections.reduce(
        (refs, section) => ({
          ...refs,
          [section.id]: createRef<HTMLElement>(),
        }),
        {} as Record<TermsSectionId, React.RefObject<HTMLElement>>,
      ),
    [sections],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id as TermsSectionId);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => {
      const element = sectionRefs[section.id].current;
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionRefs, sections]);

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30]">
      <section className="page-container py-14 text-center sm:py-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e5eeff] px-4 py-2 text-sm font-bold text-[#3525cd]">
          <Gavel size={18} aria-hidden={true} />
          Pháp lý & Quy định
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">Điều khoản dịch vụ</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#464555]">
          Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng nền tảng Python AI Learning để đảm bảo quyền lợi
          và trách nhiệm của bạn.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-4 text-sm font-medium text-[#464555]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <CalendarDays size={17} className="text-[#3525cd]" aria-hidden={true} />
            Cập nhật lần cuối: 24/06/2026
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <Users size={17} className="text-[#3525cd]" aria-hidden={true} />
            Áp dụng cho tất cả người dùng hệ thống
          </span>
        </div>
      </section>

      <div className="page-container grid gap-8 pb-16 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav
            aria-label="Mục lục điều khoản dịch vụ"
            className="quiz-card-shadow rounded-xl border border-[#c7c4d8] bg-white p-4"
          >
            <h2 className="px-3 py-2 text-sm font-bold uppercase tracking-wider text-[#464555]">Mục lục</h2>
            <ul className="mt-2 space-y-1">
              {sections.map((section, index) => {
                const isActive = activeSection === section.id;

                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setActiveSection(section.id)}
                      className={`block rounded-r-lg border-l-4 border-transparent px-3 py-2.5 text-sm text-[#464555] transition hover:bg-[#eff4ff] hover:text-[#3525cd] ${
                        isActive ? "sidebar-active" : ""
                      }`}
                    >
                      {index + 1}. {section.navLabel}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              ref={sectionRefs[section.id]}
              className="quiz-card-shadow scroll-mt-28 rounded-xl border border-[#c7c4d8] bg-white p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff4ff] text-[#3525cd]">
                  {section.icon}
                </span>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <div className="leading-8 text-[#464555]">{section.body}</div>
            </section>
          ))}

          <section className="rounded-[2rem] bg-[#e2dfff] p-6 text-[#0f0069] shadow-2xl shadow-indigo-200/70 sm:p-8">
            <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div>
                <h2 className="text-2xl font-extrabold">Bạn cần hỗ trợ thêm?</h2>
                <p className="mt-2 max-w-2xl leading-7">
                  Đội ngũ pháp lý và hỗ trợ kỹ thuật của chúng tôi luôn sẵn sàng giải đáp thắc mắc của bạn 24/7.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#3525cd] shadow-lg shadow-indigo-200 transition hover:scale-105 active:scale-95"
              >
                <Headset size={20} aria-hidden={true} />
                Liên hệ hỗ trợ
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default TermsPage;
