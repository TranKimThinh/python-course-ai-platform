import {
  AlertTriangle,
  ArrowRight,
  Bolt,
  Bot,
  Building2,
  ChevronDown,
  Mail,
  Phone,
  School,
  Send,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { type FormEvent, type ReactElement, useState } from "react";
import { Link } from "react-router-dom";

const supportIllustration = new URL("../../assets/images/register-illustration.png.png", import.meta.url).href;

// EmailJS config — lấy từ dashboard emailjs.com (Email Services / Email Templates / Account > API Keys)
const EMAILJS_SERVICE_ID = "service_98p6f4h";
const EMAILJS_TEMPLATE_ID = "template_5b8naf3";
const EMAILJS_PUBLIC_KEY = "fhFVcc419rzuso6L0";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

type ContactFormErrors = Partial<Record<keyof Pick<ContactFormData, "fullName" | "email" | "message">, string>>;

const initialFormData: ContactFormData = {
  fullName: "",
  email: "",
  phone: "",
  topic: "Tư vấn khóa học",
  message: "",
};

const contactCards = [
  {
    title: "Email hỗ trợ",
    description: "Gửi câu hỏi hoặc yêu cầu hỗ trợ",
    value: "252quanghuy@gmail.com",
    href: "mailto:252quanghuy@gmail.com",
    icon: Mail,
  },
  {
    title: "Thời gian hỗ trợ",
    description: "Chúng tôi luôn sẵn sàng",
    value: "Thứ 2 - Thứ 6 (09:00 - 18:00)",
    icon: Phone,
  },
  {
    title: "Kênh tư vấn",
    description: "Hỗ trợ học tập và kỹ thuật",
    value: "AI Assistant & Form liên hệ",
    icon: Bot,
  },
];

const supportCategories = [
  {
    title: "Tư vấn khóa học",
    description: "Lộ trình học AI & Python",
    icon: School,
  },
  {
    title: "Hỗ trợ tài khoản",
    description: "Đăng nhập, bảo mật, hồ sơ",
    icon: UserCog,
  },
  {
    title: "Hỗ trợ AI Assistant",
    description: "Giải đáp thắc mắc học tập",
    icon: Bot,
  },
  {
    title: "Báo lỗi hệ thống",
    description: "Kỹ thuật, bug, kết nối",
    icon: AlertTriangle,
  },
];

const faqs = [
  {
    question: "Tôi quên mật khẩu thì làm thế nào?",
    answer:
      "Bạn có thể sử dụng chức năng Quên mật khẩu tại trang đăng nhập. Một email hướng dẫn đặt lại mật khẩu sẽ được gửi đến địa chỉ email bạn đã đăng ký.",
  },
  {
    question: "AI Assistant có trả lời theo nội dung bài học không?",
    answer:
      "Có, AI Assistant được thiết kế để hỗ trợ dựa trên nội dung khóa học Python, transcript bài học và tài liệu học tập liên quan.",
  },
  {
    question: "Tôi có thể xem lại transcript ở đâu?",
    answer:
      "Transcript của các bài học video được hiển thị trong trang học bài hoặc trang Transcript & Tóm tắt bài học.",
  },
  {
    question: "Làm sao để theo dõi tiến độ học tập?",
    answer:
      "Hệ thống tự động ghi nhận phần trăm hoàn thành của bạn. Bạn có thể xem chi tiết trong trang Tiến độ học tập hoặc Hồ sơ cá nhân.",
  },
];

function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const validateForm = () => {
    const errors: ContactFormErrors = {};

    if (!formData.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên.";
    if (!formData.email.trim()) errors.email = "Vui lòng nhập email.";
    if (!formData.message.trim()) errors.message = "Vui lòng nhập nội dung cần hỗ trợ.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || "Không cung cấp",
          topic: formData.topic,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY,
      );

      setSuccessMessage("Yêu cầu của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất!");
      setFormData(initialFormData);
    } catch (error) {
      console.error("EmailJS send error:", error);
      setErrorMessage("Gửi yêu cầu thất bại, vui lòng thử lại sau hoặc liên hệ trực tiếp qua email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30]">
      <section className="page-container grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex rounded-full bg-[#e5eeff] px-4 py-2 text-sm font-extrabold tracking-wider text-[#3525cd]">
            TRUNG TÂM HỖ TRỢ
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Liên hệ với <span className="text-[#3525cd]">Python AI Learning</span>
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#464555]">
            Bạn cần tư vấn khóa học, hỗ trợ tài khoản hoặc gặp lỗi kỹ thuật? Hãy gửi thông tin cho chúng tôi để được
            giải đáp sớm nhất.
          </p>
          <div className="mt-7 flex flex-wrap gap-4 text-sm font-bold text-[#464555]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <ShieldCheck size={18} className="text-[#3525cd]" aria-hidden={true} />
              Hỗ trợ 24/7
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <Bolt size={18} className="text-[#0058be]" aria-hidden={true} />
              Phản hồi siêu tốc
            </span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl shadow-2xl shadow-indigo-200/80">
          <img
            src={supportIllustration}
            alt="Minh họa trung tâm hỗ trợ Python AI Learning"
            className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/75 via-[#0b1c30]/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/15 p-5 text-white backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">AI Support Desk</p>
            <p className="mt-2 text-2xl font-bold">Luôn sẵn sàng hỗ trợ việc học Python của bạn.</p>
          </div>
        </div>
      </section>

      <section className="page-container pb-12">
        <div className="grid gap-5 md:grid-cols-3">
          {contactCards.map((card) => {
            const Icon = card.icon;
            const content = (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5eeff] text-[#3525cd]">
                  <Icon size={24} aria-hidden={true} />
                </span>
                <h2 className="mt-5 text-xl font-bold">{card.title}</h2>
                <p className="mt-2 text-[#464555]">{card.description}</p>
                <p className="mt-4 font-bold text-[#3525cd]">{card.value}</p>
              </>
            );

            return card.href ? (
              <a
                key={card.title}
                href={card.href}
                className="glass-card elevated-card rounded-2xl p-6"
              >
                {content}
              </a>
            ) : (
              <article key={card.title} className="glass-card elevated-card rounded-2xl p-6">
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-container grid gap-8 py-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="ambient-shadow rounded-3xl border border-[#c7c4d8]/70 bg-white p-6 sm:p-8">
            <h2 className="text-3xl font-bold">Gửi yêu cầu hỗ trợ</h2>
            <p className="mt-3 leading-7 text-[#464555]">
              Điền thông tin vào mẫu dưới đây, đội ngũ của chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="Họ và tên" error={formErrors.fullName}>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  className="w-full rounded-xl border border-[#c7c4d8] px-4 py-3 outline-none transition focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15"
                />
              </Field>

              <Field label="Email" error={formErrors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="w-full rounded-xl border border-[#c7c4d8] px-4 py-3 outline-none transition focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15"
                />
              </Field>

              <Field label="Số điện thoại">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="090 123 4567"
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="w-full rounded-xl border border-[#c7c4d8] px-4 py-3 outline-none transition focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15"
                />
              </Field>

              <Field label="Chủ đề">
                <select
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={(event) => updateField("topic", event.target.value)}
                  className="w-full rounded-xl border border-[#c7c4d8] bg-white px-4 py-3 outline-none transition focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15"
                >
                  <option>Tư vấn khóa học</option>
                  <option>Hỗ trợ tài khoản</option>
                  <option>Lỗi kỹ thuật</option>
                  <option>Góp ý hệ thống</option>
                  <option>Khác</option>
                </select>
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Nội dung" error={formErrors.message}>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Nhập chi tiết yêu cầu của bạn tại đây..."
                  value={formData.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  className="w-full resize-none rounded-xl border border-[#c7c4d8] px-4 py-3 outline-none transition focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15"
                />
              </Field>
            </div>

            {successMessage && (
              <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {successMessage}
              </p>
            )}

            {errorMessage && (
              <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="gradient-primary mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={20} aria-hidden={true} />
              {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
            </button>
          </form>
        </div>

        <aside className="space-y-5 lg:col-span-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {supportCategories.map((category) => {
              const Icon = category.icon;
              return (
                <article
                  key={category.title}
                  className="glass-card rounded-2xl border border-transparent p-5 transition hover:border-[#3525cd]/30"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3525cd]/10 text-[#3525cd]">
                    <Icon size={23} aria-hidden={true} />
                  </span>
                  <h3 className="mt-4 font-bold">{category.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#464555]">{category.description}</p>
                </article>
              );
            })}
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-[#dce9ff] p-6">
            <Building2
              size={130}
              className="absolute -bottom-8 -right-8 text-[#3525cd]/10"
              aria-hidden={true}
            />
            <div className="relative">
              <h2 className="text-2xl font-bold">Bạn là doanh nghiệp?</h2>
              <p className="mt-3 leading-7 text-[#464555]">
                Chúng tôi cung cấp các gói đào tạo AI & Python tùy chỉnh cho đội ngũ kỹ sư của bạn.
              </p>
              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-[#3525cd] transition-all hover:gap-3"
              >
                Liên hệ hợp tác
                <ArrowRight size={18} aria-hidden={true} />
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="page-container py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Câu hỏi thường gặp</h2>
          <p className="mt-3 text-[#464555]">Tìm thấy câu trả lời nhanh chóng cho các vấn đề phổ biến nhất.</p>
        </div>

        <div className="mx-auto mt-8 max-w-4xl space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeFaqIndex === index;
            const buttonId = `contact-faq-button-${index}`;
            const panelId = `contact-faq-panel-${index}`;

            return (
              <article key={faq.question} className="overflow-hidden rounded-2xl border border-[#c7c4d8]/70 bg-white">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  onClick={() => setActiveFaqIndex(isActive ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold transition hover:bg-[#eff4ff] sm:px-6"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={21}
                    className={`shrink-0 text-[#3525cd] transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
                    aria-hidden={true}
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`overflow-hidden transition-all duration-300 ${isActive ? "max-h-40" : "max-h-0"}`}
                >
                  <p className="px-5 pb-5 leading-7 text-[#464555] sm:px-6">{faq.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-container pb-16 pt-8">
        <div className="relative overflow-hidden rounded-[40px] bg-[#e2dfff] bg-[radial-gradient(circle_at_top_right,rgba(53,37,205,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(0,88,190,0.14),transparent_35%)] px-6 py-12 text-center text-[#0f0069]">
          <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/30 blur-2xl" aria-hidden={true} />
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/30 blur-2xl" aria-hidden={true} />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Muốn được AI hỗ trợ ngay?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8">
              Hãy thử đặt câu hỏi với AI Assistant để được giải đáp nhanh trong quá trình học Python. Trợ lý thông minh
              luôn sẵn sàng 24/7.
            </p>
            <Link
              to="/ai-assistant"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#3525cd] shadow-lg shadow-indigo-200 transition hover:bg-white/85 active:scale-95"
            >
              <Bot size={20} aria-hidden={true} />
              Dùng AI Assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactElement<{ id?: string }>;
}) {
  const fieldId = children.props.id ?? "";

  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 block text-sm font-bold text-[#0b1c30]">
        {label}
      </label>
      {children}
      {error && <p className="mt-2 text-sm font-semibold text-[#ba1a1a]">{error}</p>}
    </div>
  );
}

export default ContactPage;