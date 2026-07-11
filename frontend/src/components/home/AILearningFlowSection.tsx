import {
  ArrowDown,
  ArrowRight,
  Bot,
  Captions,
  CirclePlay,
  Network,
  Search,
  type LucideIcon,
} from "lucide-react";

interface FlowStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

const steps: FlowStep[] = [
  { title: "Video bài giảng", description: "Nội dung học trực quan", icon: CirclePlay },
  { title: "Transcript", description: "Chuyển giọng nói thành chữ", icon: Captions },
  { title: "Embedding", description: "Vector hóa nội dung", icon: Network },
  { title: "Tìm kiếm ngữ nghĩa", description: "Truy xuất đúng ngữ cảnh", icon: Search },
  { title: "AI trả lời", description: "Phản hồi chính xác, dễ hiểu", icon: Bot },
];

function AILearningFlowSection() {
  return (
    <section id="ai-flow" className="scroll-mt-20 overflow-hidden bg-slate-950 py-20 text-white sm:py-24">
      <div className="page-container relative">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="relative mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">AI hoạt động thế nào?</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Quy trình học tập thông minh</h2>
          <p className="mt-4 leading-7 text-slate-400">
            Mỗi câu trả lời đều được tạo từ chính nội dung bài giảng bạn đang học.
          </p>
        </div>

        <div className="relative flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:gap-2">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <div key={title} className="contents">
              <div className="group flex flex-1 items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:min-h-48 lg:flex-col lg:justify-center lg:text-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/20 transition group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white">
                  <Icon size={25} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <>
                  <ArrowDown className="mx-auto text-indigo-400 lg:hidden" size={22} />
                  <ArrowRight className="hidden shrink-0 text-indigo-400 lg:block" size={22} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AILearningFlowSection;
