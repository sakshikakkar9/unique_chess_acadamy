import { Button } from "@/components/ui/button";
import { AGE_GROUP_RANGES, Course } from "@/types";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface CourseCardProps {
  course: Course;
  delay?: number;
  onEnroll?: (course: Course) => void;
}

const CourseCard = ({ course, delay, onEnroll }: CourseCardProps) => {
  const ageRange =
    course.minAge && course.maxAge
      ? `Ages ${course.minAge}–${course.maxAge}`
      : AGE_GROUP_RANGES[course.ageGroup];

  return (
    <ScrollReveal delay={delay}>
      <div className="bg-card border border-border rounded-2xl overflow-hidden card-hover group h-full flex flex-col">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={course.image || "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800"}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
            <span className="text-xs font-medium bg-primary/20 text-primary px-3 py-1 rounded-full backdrop-blur-sm">
              {ageRange}
            </span>
            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full backdrop-blur-sm">
              {course.level}
            </span>
            <span className="text-xs font-medium bg-background/60 text-foreground px-3 py-1 rounded-full backdrop-blur-sm">
              {course.duration}
            </span>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-heading font-bold text-xl mb-2">{course.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{course.description}</p>

          {course.features && course.features.length > 0 && (
            <ul className="space-y-2 mb-6 mt-auto">
              {course.features.map((feat, i) => (
                <li key={i} className="text-xs flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  {feat}
                </li>
              ))}
            </ul>
          )}

          {course.price && (
            <p className="text-sm font-semibold text-primary mb-4">{course.price}</p>
          )}

          <Button
            className="w-full mt-auto"
            onClick={() => onEnroll?.(course)}
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default CourseCard;
