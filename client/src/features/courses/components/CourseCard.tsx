import { Button } from "@/components/ui/button";
import { AGE_GROUP_RANGES, Course } from "@/types";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  delay?: number;
  onEnroll?: (course: Course) => void;
}

const API_BASE_URL = "http://localhost:5000";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800";

const CourseCard = ({ course, delay, onEnroll }: CourseCardProps) => {
  const ageRange =
    course.minAge && course.maxAge
      ? `Ages ${course.minAge}–${course.maxAge}`
      : AGE_GROUP_RANGES[course.ageGroup];

  const getFullImageUrl = (path?: string) => {
    if (!path) return DEFAULT_IMAGE;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  return (
    <ScrollReveal delay={delay}>
      <div className="glass border-white/5 rounded-[2rem] overflow-hidden card-hover group h-full flex flex-col card-elevation">
        
        {/* IMAGE SECTION */}
        <div className="relative overflow-hidden aspect-[4/3] bg-secondary/30">
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
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          {/* BADGES ON IMAGE */}
          <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-4 py-1 rounded-full shadow-lg">
              {course.level}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-background/80 backdrop-blur-md text-foreground px-4 py-1 rounded-full border border-white/10">
              {ageRange}
            </span>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-heading font-bold text-2xl group-hover:text-primary transition-colors leading-tight">
              {course.title}
            </h3>
            {course.price && (
              <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg shrink-0">{course.price}</span>
            )}
          </div>

          <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3">
            {course.description}
          </p>

          {/* FEATURES LIST */}
          {course.features && course.features.length > 0 && (
            <ul className="space-y-3 mb-8 mt-auto pt-6 border-t border-white/5">
              {course.features.map((feat, i) => (
                <li key={i} className="text-xs flex items-center gap-3 text-muted-foreground/80 font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feat}
                </li>
              ))}
            </ul>
          )}

          {/* FOOTER: ACTION */}
          <div className="mt-auto">
            <Button
              className="w-full rounded-2xl gold-glow hover:shadow-primary/20 transition-all py-6 font-bold tracking-wide"
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
