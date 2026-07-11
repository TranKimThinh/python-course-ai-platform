export type CourseChip = "Tất cả" | "Cơ bản" | "Trung cấp" | "Có AI hỗ trợ" | "Đang học";

interface CourseFilterChipsProps {
  chips: CourseChip[];
  activeChip: CourseChip;
  onChange: (chip: CourseChip) => void;
}

function CourseFilterChips({ chips, activeChip, onChange }: CourseFilterChipsProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-2">
        {chips.map((chip) => {
          const isActive = activeChip === chip;

          return (
            <button
              key={chip}
              type="button"
              onClick={() => onChange(chip)}
              className={`focus-ring rounded-full px-4 py-2.5 text-sm font-bold transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CourseFilterChips;
