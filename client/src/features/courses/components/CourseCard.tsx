import { Button } from "@/components/ui/button";
import { AGE_GROUP_RANGES, Course } from "@/types";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { cn } from "@/lib/utils";
import { resolveStatus, STATUS_CONFIG } from "@/lib/statusUtils";
import { Calendar, Clock, MapPin, Globe } from "lucide-react";
import { format } from "date-fns";

interface CourseCardProps {
  course: Course;
  delay?: number;
  onEnroll?: (course: Course) => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800";

const CourseCard = ({ course, delay, onEnroll }: CourseCardProps) => {
  const status = resolveStatus(course.startDate, course.endDate, course.status);
  const statusConfig = STATUS_CONFIG[status];
  const isActive = ['upcoming', 'ongoing'].includes(status);

  const ageRange =
    course.minAge && course.maxAge
      ? `Ages ${course.minAge}–${course.maxAge}`
      : AGE_GROUP_RANGES[course.ageGroup];

  return (
    <ScrollReveal delay={delay}>
      <div className={cn(
        "group relative overflow-hidden flex flex-col h-full bg-white rounded-2xl border border-slate-100 transition-all duration-300",
        !isActive
          ? "opacity-50 grayscale pointer-events-none"
          : "hover:shadow-xl hover:-translate-y-1 border-slate-200"
      )}>
        {/* HEADER: IMAGE + BADGE */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={course.custom_banner_url || DEFAULT_IMAGE}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute top-4 right-4 z-10">
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
              statusConfig.badge
            )}>
              {statusConfig.label}
            </span>
          </div>

          {status === 'ongoing' && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live Now
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5 flex flex-col flex-grow">
          {/* DATE INFO */}
          <div className="flex items-center gap-2 mb-3 text-[#64748b]">
            <Calendar className="size-3.5" />
            <span className="text-xs font-semibold">
              {course.startDate ? format(new Date(course.startDate), "MMM d, yyyy") : "TBA"}
              {course.endDate && ` - ${format(new Date(course.endDate), "MMM d, yyyy")}`}
            </span>
          </div>

          {/* CORE INFO */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
              {course.title}
            </h3>
            <div className="flex items-center gap-1.5 text-blue-600">
              <Globe className="size-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{course.mode}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
             <span className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-slate-100">
              {ageRange}
            </span>
            <span className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-slate-100">
              {course.skillLevel}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Fee</span>
              <span className="text-lg font-black text-slate-900">₹{course.fee?.toLocaleString()}</span>
            </div>
            
            <Button
              className={cn(
                "bg-blue-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl px-5 py-2.5 h-auto hover:bg-blue-700 transition-all",
                !isActive && "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
              onClick={() => isActive && onEnroll?.(course)}
              disabled={!isActive}
            >
              {status === 'completed' ? 'Ended' : 'Enroll'}
            </Button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default CourseCard;
