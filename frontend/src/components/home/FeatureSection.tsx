import { Bot, ChartNoAxesCombined, FileCheck2, PlaySquare, type LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const features: Feature[] = [
  {
    title: "Học qua video",
    description: "Bài giảng trực quan, dễ theo dõi và được chia nhỏ theo từng chủ đề thực hành.",
    icon: PlaySquare,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "AI giải đáp thắc mắc",
    description: "Đặt câu hỏi ngay trong bài học và nhận câu trả lời bám sát nội dung đang học.",
    icon: Bot,
    color: "bg-violet-50 text-violet-600",
  },
  {
    title: "Tóm tắt bài học",
    description: "AI tự động chắt lọc khái niệm, cú pháp và ví dụ quan trọng để bạn ôn tập nhanh.",
    icon: FileCheck2,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    title: "Theo dõi tiến độ",
    description: "Quan sát lộ trình, số bài hoàn thành và duy trì nhịp học phù hợp với mục tiêu.",
    icon: ChartNoAxesCombined,
    color: "bg-emerald-50 text-emerald-600",
  },
];

function FeatureSection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="page-container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Điểm nổi bật</p>
          <h2 className="section-heading">Mọi công cụ bạn cần để học hiệu quả</h2>
          <p className="mt-4 leading-7 text-slate-600">
            Kết hợp nội dung bài bản với AI để mỗi giờ học đều tập trung và có kết quả rõ ràng.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon, color }) => (
            <article
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-soft"
            >
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
