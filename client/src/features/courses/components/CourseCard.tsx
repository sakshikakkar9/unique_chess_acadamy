import { Calendar, Globe, Clock } from "lucide-react";
import { AGE_GROUP_RANGES, Course } from "@/types";
import { resolveStatus } from "@/lib/statusUtils";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { formatINR, formatTime, formatDateRange } from "@/lib/formatUtils";

interface CourseCardProps {
  course: Course;
  delay?: number;
  onEnroll?: (course: Course) => void;
}

const CourseCard = ({ course, delay = 0, onEnroll }: CourseCardProps) => {
  const status = resolveStatus(course.startDate, course.endDate, course.status);
  const isActive = ['upcoming', 'ongoing'].includes(status);

  const ageRange =
    course.minAge && course.maxAge
      ? `Ages ${course.minAge}–${course.maxAge}`
      : AGE_GROUP_RANGES[course.ageGroup];

  return (
    <ScrollReveal delay={delay}>
      <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full">
        {/* COURSE IMAGE */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-800 to-blue-900">
          {/* Only show image if it's a real course image URL */}
          {course.custom_banner_url && !course.custom_banner_url.includes('tournament') && (
            <img
              src={course.custom_banner_url}
              alt={course.title}
              className="w-full h-full object-cover opacity-80"
              loading="lazy"
            />
          )}

          {/* Fallback — chess piece pattern */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-20 select-none">♟</span>
          </div>

          {/* Status badge — bottom left of image */}
          <div className="absolute bottom-3 left-3">
            {(() => {
              const cfg = {
                upcoming: { label: 'Upcoming', cls: 'bg-blue-600' },
                ongoing: { label: '● Enrolling', cls: 'bg-green-500' },
                completed: { label: 'Ended', cls: 'bg-slate-600' },
                rejected: { label: 'Unavailable', cls: 'bg-red-600' },
                cancelled: { label: 'Cancelled', cls: 'bg-orange-600' },
              }[status];
              return (
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white ${cfg.cls}`}>
                  {cfg.label}
                </span>
              );
            })()}
          </div>

          {/* Level badge — top right */}
          {course.skillLevel && (
            <div className="absolute top-3 right-3">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                {course.skillLevel}
              </span>
            </div>
          )}
        </div>

        {/* CARD BODY */}
        <div className="p-4 flex flex-col flex-1">
          {/* Date range */}
          {(course.startDate || course.endDate) && (
            <p className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {formatDateRange(course.startDate, course.endDate)}
            </p>
          )}

          {/* Course title */}
          <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-2">
            {course.title}
          </h3>

          {/* Mode + Schedule */}
          <div className="flex items-center gap-3 mb-3">
            {course.mode && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Globe className="size-3.5 text-blue-500" />
                {course.mode}
              </span>
            )}
            {course.classTime && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="size-3.5 text-blue-500" />
                {formatTime(course.classTime)}
              </span>
            )}
          </div>

          {/* Age tag — clean pill */}
          {ageRange && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                {ageRange}
              </span>
            </div>
          )}

          {/* Training days */}
          {course.days && course.days.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {course.days.slice(0, 3).map((day: string) => (
                <span key={day} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">
                  {day.slice(0, 3)}
                </span>
              ))}
              {course.days.length > 3 && (
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                  +{course.days.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Fee + Enroll — bottom */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Fee</p>
              <p className="text-base font-black text-slate-900">
                {formatINR(course.fee ?? 0)}
              </p>
            </div>

            {(() => {
              if (!isActive) return (
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-2 rounded-lg">
                  {status === 'completed' ? 'Ended'
                    : status === 'cancelled' ? 'Cancelled'
                    : 'Unavailable'}
                </span>
              );

              return (
                <button
                  onClick={() => onEnroll?.(course)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors duration-150"
                >
                  Enroll
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default CourseCard;
