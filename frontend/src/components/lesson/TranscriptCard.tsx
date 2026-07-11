import { Play } from "lucide-react";
import { type TranscriptSegment } from "./lessonTypes";

interface TranscriptCardProps {
  segment: TranscriptSegment;
}

function TranscriptCard({ segment }: TranscriptCardProps) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-white hover:shadow-sm">
      <div className="flex gap-4">
        <span className="h-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700">
          {segment.time}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-extrabold text-slate-950">{segment.title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{segment.content}</p>
        </div>
        <button
          type="button"
          onClick={() => console.log("Play transcript timestamp:", segment.time)}
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 opacity-70 shadow-sm transition hover:bg-indigo-600 hover:text-white group-hover:opacity-100"
          aria-label={`Phát tại ${segment.time}`}
        >
          <Play size={17} className="ml-0.5 fill-current" />
        </button>
      </div>
    </article>
  );
}

export default TranscriptCard;
