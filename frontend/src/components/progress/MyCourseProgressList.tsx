import { GraduationCap } from "lucide-react";
import MyCourseProgressCard from "./MyCourseProgressCard";
import { type CourseProgress } from "./progressTypes";

interface MyCourseProgressListProps {
  courses: CourseProgress[];
}

function MyCourseProgressList({ courses }: MyCourseProgressListProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <GraduationCap size={23} />
        </span>
        <h2 className="text-xl font-extrabold text-slate-950">Khóa học của tôi</h2>
      </div>
      <div className="space-y-5">
        {courses.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
            Bạn chưa tham gia khóa học nào.
          </p>
        ) : (
          courses.map((course) => <MyCourseProgressCard key={course.id} course={course} />)
        )}
      </div>
    </section>
  );
}

export default MyCourseProgressList;
