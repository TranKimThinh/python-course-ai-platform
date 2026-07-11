import { Search } from "lucide-react";
import TranscriptCard from "./TranscriptCard";
import { type TranscriptSegment } from "./lessonTypes";

interface TranscriptListProps {
  searchTerm: string;
  segments: TranscriptSegment[];
  onSearchChange: (value: string) => void;
}

function TranscriptList({ searchTerm, segments, onSearchChange }: TranscriptListProps) {
  return (
    <div className="space-y-5">
      <div className="relative">
        <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          name="transcript-search"
          autoComplete="off"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm trong transcript..."
          className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      {segments.length > 0 ? (
        <div className="space-y-4">
          {segments.map((segment) => (
            <TranscriptCard key={segment.id} segment={segment} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
          Không tìm thấy nội dung phù hợp.
        </div>
      )}
    </div>
  );
}

export default TranscriptList;
