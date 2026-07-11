import { Search } from "lucide-react";

interface CourseSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function CourseSearchBar({ value, onChange }: CourseSearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} aria-hidden="true" />
      <input
        type="search"
        name="course-search"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Tìm kiếm khóa học..."
        className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}

export default CourseSearchBar;
