import { Course } from "@/types";
import CourseCard from "./CourseCard";

interface CourseListProps {
  courses: Course[];
  onEnroll?: (course: Course) => void;
}

const CourseList = ({ courses, onEnroll }: CourseListProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
        <p className="text-muted-foreground">No courses found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, i) => (
        <CourseCard key={course.id} course={course} delay={i * 0.1} onEnroll={onEnroll} />
      ))}
    </div>
  );
};

export default CourseList;
