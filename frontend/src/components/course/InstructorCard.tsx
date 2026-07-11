import { Globe2, Mail } from "lucide-react";
import { Link } from "react-router-dom";

function InstructorCard() {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-card">
      <h2 className="mb-5 text-lg font-extrabold text-slate-950">Giảng viên</h2>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-xl font-extrabold text-white shadow-lg shadow-indigo-200">
          NA
        </div>
        <div>
          <p className="font-extrabold text-slate-950">Nguyễn Văn A</p>
          <p className="mt-1 text-sm font-medium text-indigo-600">Chuyên gia AI & Software Engineer</p>
        </div>
      </div>
      <blockquote className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        “Hơn 10 năm kinh nghiệm phát triển phần mềm tại các tập đoàn đa quốc gia. Sứ mệnh của tôi là phổ
        cập lập trình và AI cho người Việt.”
      </blockquote>
      <div className="mt-5 flex gap-3">
        <Link
          to="/contact"
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-indigo-600 hover:text-white"
          aria-label="Website giảng viên"
        >
          <Globe2 size={18} />
        </Link>
        <Link
          to="/contact"
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-indigo-600 hover:text-white"
          aria-label="Email giảng viên"
        >
          <Mail size={18} />
        </Link>
      </div>
    </div>
  );
}

export default InstructorCard;
