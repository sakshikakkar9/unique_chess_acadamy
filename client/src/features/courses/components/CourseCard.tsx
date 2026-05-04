import { Button } from "@/components/ui/button";
import { AGE_GROUP_RANGES, Course } from "@/types";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  delay?: number;
  onEnroll?: (course: Course) => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800";

const CourseCard = ({ course, delay, onEnroll }: CourseCardProps) => {
  const ageRange =
    course.minAge && course.maxAge
      ? `Ages ${course.minAge}–${course.maxAge}`
      : AGE_GROUP_RANGES[course.ageGroup];

  const getFullImageUrl = (path?: string) => {
    return path || course.bannerUrl || DEFAULT_IMAGE;
  };

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
      <div className="card-pro overflow-hidden p-0 flex flex-col h-full border-[#e2e8f0]">
        {/* Top accent bar */}
        <div className={cn("w-full h-1", getAccentColor())} />
        
        {/* IMAGE SECTION */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={getFullImageUrl(course.image)}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-4">
            <span className={cn("text-[12px] font-medium px-3 py-1 rounded-full", getTintBg())}>
              {ageRange}
            </span>
            <span className="bg-[#f8fafc] text-[#94a3b8] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#e2e8f0]">
              {course.level}
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
              <span className="text-[20px] font-black text-[#0f172a]">
                {course.fee ? `₹${course.fee.toLocaleString()}` : "Contact Us"}
              </span>
            </div>
            
            <Button
              className="bg-[#2563eb] text-white font-semibold rounded-full px-8 py-2 h-auto hover:bg-[#1d4ed8] transition-all"
              onClick={() => onEnroll?.(course)}
            >
              Enroll
            </Button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default CourseCard;
