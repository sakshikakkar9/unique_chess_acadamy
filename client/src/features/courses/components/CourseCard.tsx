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
    if (!path) return DEFAULT_IMAGE;
    return path;
  };

  const getAccentColor = () => {
    switch (course.ageGroup) {
      case 'CHILDREN': return 'bg-[#3b82f6]';
      case 'TEENAGERS': return 'bg-[#0ea5e9]';
      case 'ADULTS': return 'bg-[#f59e0b]';
      default: return 'bg-[#3b82f6]';
    }
  };

  return (
    <ScrollReveal delay={delay} direction="scale">
      <div className="glass-card-blue overflow-hidden group h-full flex flex-col transition-smooth hover:translate-y-[-8px] hover:glow-blue border-white/5 relative">
        {/* Top accent bar */}
        <div className={cn("absolute top-0 left-0 w-full h-1 z-20", getAccentColor())} />
        
        {/* IMAGE SECTION */}
        <div className="relative overflow-hidden aspect-[16/10]">
          <img
            src={getFullImageUrl(course.image)}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent opacity-60" />
          
          {/* BADGES ON IMAGE */}
          <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
            <span className="accent-label bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/10">
              {ageRange}
            </span>
            <span className="accent-label bg-black/40 backdrop-blur-md text-[#f59e0b] px-3 py-1 rounded-full border border-[#f59e0b]/20">
              {course.level}
            </span>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8 flex flex-col flex-grow">
          <h3 className="font-black text-2xl mb-4 text-white uppercase tracking-tight group-hover:text-[#38bdf8] transition-colors">
            {course.title}
          </h3>
          <p className="text-[#94a3b8] text-sm mb-6 leading-relaxed line-clamp-3">
            {course.description}
          </p>

          {/* FEATURES LIST */}
          {Array.isArray(course.features) && course.features.length > 0 && (
            <ul className="space-y-3 mb-8 mt-auto pt-6 border-t border-white/5">
              {course.features.slice(0, 3).map((feat, i) => (
                <li key={i} className="text-xs font-bold flex items-center gap-3 text-[#cbd5e1] uppercase tracking-wider">
                  <div className={cn("h-1.5 w-1.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]", course.ageGroup === 'ADULTS' ? 'text-[#f59e0b] bg-[#f59e0b]' : 'text-[#38bdf8] bg-[#38bdf8]')} />
                  {feat}
                </li>
              ))}
            </ul>
          )}

          {/* FOOTER: PRICE & ACTION */}
          <div className="mt-auto flex items-center justify-between gap-6">
            {course.price && (
              <div className="flex flex-col">
                <span className="accent-label text-[#64748b]">Investment</span>
                <span className="text-lg font-black text-white">{course.price}</span>
              </div>
            )}
            
            <Button
              className="flex-1 bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9] text-white font-black rounded-xl h-12 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-105 transition-all border-none uppercase tracking-widest text-[10px]"
              onClick={() => onEnroll?.(course)}
            >
              Enroll Now
            </Button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default CourseCard;
