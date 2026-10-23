import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props { page: number; totalPages: number; onChange: (page: number) => void }
export default function CoursePagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Phân trang khóa học">
    <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Trang trước" className="focus-ring rounded-full border p-3 disabled:opacity-40"><ChevronLeft size={18} /></button>
    <span aria-live="polite">Trang {page} / {totalPages}</span>
    <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Trang sau" className="focus-ring rounded-full border p-3 disabled:opacity-40"><ChevronRight size={18} /></button>
  </nav>;
}
