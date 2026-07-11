import { type AIFeature } from "./courseDetailTypes";

interface CourseAIFeaturesProps {
  features: AIFeature[];
}

function CourseAIFeatures({ features }: CourseAIFeaturesProps) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">AI hỗ trợ trong khóa học này</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Các công cụ AI giúp bạn học nhanh hơn, ôn tập hiệu quả hơn và đặt câu hỏi đúng ngữ cảnh.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {features.length === 0 ? (
          <p className="rounded-[26px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-500 shadow-card md:col-span-3">
            Khóa học này chưa có tính năng AI được cấu hình.
          </p>
        ) : (
          features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.id}
                className="group rounded-[26px] border border-slate-200 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={23} />
                </span>
                <h3 className="font-extrabold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default CourseAIFeatures;
