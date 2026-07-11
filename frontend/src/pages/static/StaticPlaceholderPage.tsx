import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface StaticPlaceholderPageProps {
  title: string;
  backTo?: string;
}

function StaticPlaceholderPage({ title, backTo = "/" }: StaticPlaceholderPageProps) {
  return (
    <section className="page-container flex min-h-[55vh] items-center justify-center py-16">
      <div className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-card">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-3 text-slate-500">Trang đang được phát triển.</p>
        <Link
          to={backTo}
          className="focus-ring mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          <ArrowLeft size={17} />
          Quay lại
        </Link>
      </div>
    </section>
  );
}

export default StaticPlaceholderPage;
