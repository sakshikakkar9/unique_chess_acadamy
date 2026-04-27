import { Button } from "@/components/ui/button";
import { AGE_GROUP_RANGES, Course } from "@/types";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface CourseCardProps {
  course: Course;
  delay?: number;
  onEnroll?: (course: Course) => void;
}

// ── CONFIGURATION ────────────────────────────────────────────────────────────
const API_BASE_URL = "http://localhost:5000";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800";

const CourseCard = ({ course, delay, onEnroll }: CourseCardProps) => {
  // Logic to determine age label
  const ageRange =
    course.minAge && course.maxAge
      ? `Ages ${course.minAge}–${course.maxAge}`
      : AGE_GROUP_RANGES[course.ageGroup];

  /**
   * Helper to resolve image source:
   * 1. If empty, use Unsplash default.
   * 2. If it's an external link (starts with http), use as-is.
   * 3. If it's a local path (starts with /uploads), prefix with Backend URL.
   */
  const getFullImageUrl = (path?: string) => {
    if (!path) return DEFAULT_IMAGE;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  return (
    <ScrollReveal delay={delay}>
      <div className="bg-card border border-border rounded-2xl overflow-hidden card-hover group h-full flex flex-col shadow-sm">
        
        {/* IMAGE SECTION */}
        <div className="relative overflow-hidden aspect-[4/3] bg-muted">
          <img
            src={getFullImageUrl(course.image)}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            // Fail-safe: if the file is missing on the server, swap to default
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
          
          {/* BADGES ON IMAGE */}
          <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/90 text-primary-foreground px-3 py-1 rounded-full shadow-sm">
              {ageRange}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary/90 text-secondary-foreground px-3 py-1 rounded-full shadow-sm">
              {course.level}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-card/90 text-secondary px-3 py-1 rounded-full shadow-sm">
              {course.duration}
            </span>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-heading font-bold text-xl mb-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
            {course.description}
          </p>

          {/* FEATURES LIST */}
          {course.features && course.features.length > 0 && (
            <ul className="space-y-2 mb-6 mt-auto pt-4 border-t border-border/50">
              {course.features.map((feat, i) => (
                <li key={i} className="text-xs flex items-center gap-2 text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                  {feat}
                </li>
              ))}
            </ul>
          )}

          {/* FOOTER: PRICE & ACTION */}
          <div className="mt-auto flex items-center justify-between gap-4">
            {course.price && (
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Fees</span>
                <span className="text-sm font-bold text-primary">{course.price}</span>
              </div>
            )}
            
            <Button
              className="flex-1 max-w-[140px] rounded-xl hover:shadow-lg transition-all"
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