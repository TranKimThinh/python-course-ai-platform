import { Braces } from "lucide-react";
import { Link } from "react-router-dom";

const learningLinks = [
  { label: "Về chúng tôi", to: "/about" },
  { label: "Khóa học", to: "/courses" },
  { label: "AI Assistant", to: "/ai-assistant" },
  { label: "Hướng dẫn", to: "/guide" },
];

const policyLinks = [
  { label: "Điều khoản dịch vụ", to: "/terms" },
  { label: "Chính sách bảo mật", to: "/privacy" },
  { label: "Liên hệ", to: "/contact" },
];

function AppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-container py-12">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Link to="/" className="focus-ring inline-flex items-center gap-2 rounded-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Braces size={20} />
              </span>
              <span className="font-extrabold text-slate-950">Python AI Learning</span>
            </Link>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600">
              Nền tảng học Python tích hợp AI hỗ trợ phân tích video bài giảng, tạo transcript, tóm tắt nội dung
              và giải đáp thắc mắc cho học viên.
            </p>
          </div>
          <FooterLinks title="Học tập" links={learningLinks} />
          <FooterLinks title="Thông tin" links={policyLinks} />
        </div>
        <p className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          © 2026 Python AI Learning. Nâng tầm tri thức công nghệ Việt.
        </p>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: Array<{ label: string; to: string }> }) {
  return (
    <div>
      <h2 className="mb-4 font-bold text-slate-950">{title}</h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-sm text-slate-600 transition hover:text-indigo-600">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppFooter;
