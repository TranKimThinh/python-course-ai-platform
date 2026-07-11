import { ChevronLeft, ChevronRight } from "lucide-react";

function CoursePagination() {
  const pages = ["1", "2", "3", "..."];

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Phân trang khóa học">
      <button
        type="button"
        className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600"
        aria-label="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`focus-ring flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-bold transition ${
            page === "1"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
          }`}
          aria-current={page === "1" ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600"
        aria-label="Trang sau"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

export default CoursePagination;
