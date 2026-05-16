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
      <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full w-full">
        
        {/* IMAGE AREA - Reverted to match exact tournament height container ratio */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 flex items-center justify-center border-b border-slate-100">
          {/* Real course banner image or custom placeholder layout match */}
          {course.custom_banner_url && course.custom_banner_url !== 'null' && course.custom_banner_url !== 'undefined' ? (
            <img
              src={course.custom_banner_url}
              alt={course.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgNDAwIDMwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGMUY1RjkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI0Q5Nzc0OSIgZm9udC1mYW1pbHk9InNlcmlmIiBmb250LXdlaWdodD0iOTAwIiBmb250LWl0YWxpYz0iaXRhbGljIiBmb250LXNpemU9IjY0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM1ZW0iPlNLPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
          ) : (
            /* Branding fallback matching Tournament style structure perfectly */
            <div className="flex flex-col items-center justify-center gap-0.5 select-none opacity-90">
              <span className="text-2xl font-serif italic font-black text-amber-600 leading-none">SK</span>
              <span className="text-[11px] font-sans font-black uppercase tracking-[0.25em] text-[#0F172A] -mt-0.5">Sakshi</span>
              <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-slate-400 -mt-0.5">Kakkar</span>
            </div>
          )}

          {/* Chess piece pattern context mark overlay */}
          {!course.custom_banner_url ? (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-6xl opacity-[0.04] select-none">♟</span>
            </div>
          ) : null}

          {/* Level badge */}
          {course.skillLevel && (
            <div className="absolute top-3 right-3">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#0F172A]/20 text-white backdrop-blur-sm">
                {course.skillLevel}
              </span>
            </div>
          )}
        </div>

        {/* CARD BODY - Reverted back to p-4 match layout parameter */}
        <div className="p-4 flex flex-col flex-1">
          {/* Date range header line info wrapper */}
          {(course.startDate || course.endDate) && (
            <p className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
              <Calendar className="size-3.5 flex-shrink-0" />
              {formatDateRange(course.startDate, course.endDate)}
            </p>
          )}

          {/* Title - Exact tournament match token scale size */}
          <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">
            {course.title}
          </h3>

          {/* Mode + Schedule metadata parameters */}
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

          {/* Info pill status tags row stack parameters */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {/* Dynamic Status Pill */}
            {(() => {
              const cfg = {
                upcoming: { label: 'Upcoming', cls: 'bg-blue-600 text-white' },
                ongoing: { label: '● Enrolling', cls: 'bg-green-500 text-white' },
                completed: { label: 'Ended', cls: 'bg-slate-600 text-white' },
                rejected: { label: 'Unavailable', cls: 'bg-red-600 text-white' },
                cancelled: { label: 'Cancelled', cls: 'bg-orange-600 text-white' },
              }[status];
              return (
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.cls}`}>
                  {cfg.label}
                </span>
              );
            })()}

            {/* Target Criteria Range Badge Tag */}
            {ageRange && (
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                {ageRange}
              </span>
            )}

            {/* Active Training Program Days parameters layout rendering stack */}
            {course.days && course.days.length > 0 && (
              <>
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
              </>
            )}
          </div>

          {/* BOTTOM ROW ACTION PANEL - Exact structure match to Tournament card footer template */}
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
                  onClick={(e) => {
                    e.preventDefault();
                    onEnroll?.(course);
                  }}
                  className="bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors duration-150"
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