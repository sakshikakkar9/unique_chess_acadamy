import { Button } from "@/components/ui/button";
import { AGE_GROUP_RANGES, Course } from "@/types";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { cn } from "@/lib/utils";
import { resolveStatus, STATUS_CONFIG } from "@/lib/statusUtils";

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

  const overlayConfig = {
    upcoming: { label: null, color: '' },
    ongoing: { label: 'Live Now', color: 'bg-green-500' },
    completed: { label: 'Completed', color: 'bg-slate-500' },
    rejected: { label: 'Unavailable', color: 'bg-red-500' },
    cancelled: { label: 'Cancelled', color: 'bg-orange-500' },
  }[status];

  const ageRange =
    course.minAge && course.maxAge
      ? `Ages ${course.minAge}–${course.maxAge}`
      : AGE_GROUP_RANGES[course.ageGroup];

  const getAccentColor = () => {
    switch (course.ageGroup) {
      case 'CHILDREN': return 'bg-[#2563eb]';
      case 'TEENAGERS': return 'bg-[#0ea5e9]';
      case 'ADULTS': return 'bg-[#d97706]';
      default: return 'bg-[#2563eb]';
    }
  };

  const getTintBg = () => {
    switch (course.ageGroup) {
      case 'CHILDREN': return 'bg-[#eff6ff] text-[#2563eb]';
      case 'TEENAGERS': return 'bg-[#f0f9ff] text-[#0ea5e9]';
      case 'ADULTS': return 'bg-[#fffbeb] text-[#92400e]';
      default: return 'bg-[#eff6ff] text-[#2563eb]';
    }
  };

  return (
    <ScrollReveal delay={delay}>
      <div className={cn(
        "card-pro group relative overflow-hidden p-0 flex flex-col h-full border-[#e2e8f0] transition-all duration-300",
        !isActive
          ? "opacity-50 grayscale pointer-events-none"
          : "hover:shadow-lg hover:-translate-y-1"
      )}>
        {/* Status overlay badge — top of card */}
        {overlayConfig?.label && (
          <div className={cn(
            "absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-1.5",
            overlayConfig.color
          )}>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
              {overlayConfig.label}
            </span>
          </div>
        )}

        {/* Top accent bar */}
        <div className={cn("w-full h-1", getAccentColor(), !isActive && "mt-6")} />
        
        {/* IMAGE SECTION */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={course.custom_banner_url || DEFAULT_IMAGE}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />

          {/* Status Badge Overlay */}
          <div className="absolute top-4 right-4 z-10">
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
              statusConfig.badge
            )}>
              {statusConfig.label}
            </span>
          </div>

          {/* Ongoing pulsing dot badge */}
          {status === 'ongoing' && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live Now
            </div>
          )}
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-4">
            <span className={cn("text-[12px] font-medium px-3 py-1 rounded-full", getTintBg())}>
              {ageRange}
            </span>
            <span className="bg-[#f8fafc] text-[#94a3b8] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#e2e8f0]">
              {course.skillLevel}
            </span>
          </div>

          <h3 className="text-[22px] font-bold text-[#0f172a] mb-4 leading-tight">
            {course.title}
          </h3>
          <p className="text-[#475569] text-[15px] mb-8 leading-relaxed line-clamp-3">
            {course.description}
          </p>

          {/* FOOTER: PRICE & ACTION */}
          <div className="mt-auto pt-6 border-t border-[#f1f5f9] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-widest text-[#94a3b8] font-bold">Investment</span>
              <span className="text-[20px] font-black text-[#0f172a]">₹{course.fee?.toLocaleString() || "Contact Us"}</span>
            </div>
            
            <Button
              className={cn(
                "bg-[#2563eb] text-white font-semibold rounded-full px-8 py-2 h-auto hover:bg-[#1d4ed8] transition-all",
                !isActive && "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200"
              )}
              onClick={() => isActive && onEnroll?.(course)}
              disabled={!isActive}
            >
              {status === 'completed' ? 'Program Ended'
                : status === 'cancelled' ? 'Program Cancelled'
                : status === 'rejected' ? 'Not Available'
                : 'Enroll'}
            </Button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default CourseCard;
