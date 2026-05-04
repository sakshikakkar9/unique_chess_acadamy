import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CourseEnrollModal from "@/features/courses/components/CourseEnrollModal";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { AgeGroup, AGE_GROUP_LABELS, Course } from "@/types";
import { Users, Baby, GraduationCap, ChevronLeft, ChevronRight, SearchX, Sparkles, Clock, BarChart3, Calendar, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { fadeIn, stagger, fadeUp } from "@/components/shared/motion";

const AGE_GROUP_ORDER: AgeGroup[] = ["CHILDREN", "TEENAGERS", "ADULTS"];
const ITEMS_PER_PAGE = 6;
const HERO_IMAGE = "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2000&auto=format&fit=crop"; 
const DEFAULT_COURSE_IMAGE = "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=1000&auto=format&fit=crop";

export default function CoursesPage() {
  const { courses, isLoading } = useAdminCourses();
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);
  const [activeCategory, setActiveCategory] = useState<AgeGroup | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (activeCategory === "ALL") return courses;
    return courses.filter((c) => c.ageGroup === activeCategory);
  }, [courses, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      <header className="relative min-h-[60vh] w-full flex items-center justify-center bg-[#020617] overflow-hidden pt-32 pb-20">
        <SparkleCanvas density="full" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-7xl font-bold text-white mb-6 tracking-tighter">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Grandmaster</span> Path
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-slate-400 text-lg italic mb-10">
              "Mastery is a journey, not a destination." Find the program that fits your ambition.
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* Categories Bar */}
      <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {["ALL", ...AGE_GROUP_ORDER].map((category) => (
              <button
                key={category}
                onClick={() => { setActiveCategory(category as any); setCurrentPage(1); }}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all",
                  activeCategory === category ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                {category === "ALL" ? "All Programs" : AGE_GROUP_LABELS[category as AgeGroup]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-24 bg-slate-50/50 min-h-[800px]">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-40"><div className="h-12 w-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" /></div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-32 border-2 border-dashed border-slate-200 rounded-3xl">
              <SearchX className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">No programs found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedCourses.map((course) => (
                <motion.div key={course.id} variants={fadeUp} initial="hidden" animate="visible" className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all flex flex-col h-full">
                  <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                    <img src={course.bannerUrl || DEFAULT_COURSE_IMAGE} alt={course.title} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[10px] font-black text-blue-600 shadow-sm uppercase">
                        {course.mode}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5 text-blue-500" /> {course.skillLevel}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-blue-500" /> {course.duration}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                    
                    <div className="space-y-2 mb-8">
                      <p className="text-slate-500 text-sm italic line-clamp-2">{course.contactDetails}</p>
                      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" /> {course.days?.join(", ")} | {course.classTime}
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Enrollment Fee</span>
                        <div className="text-xl font-black text-slate-900">₹{course.fee.toLocaleString()}</div>
                      </div>
                      <Button onClick={() => setEnrollCourse(course)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-blue-600/10">
                        Enroll Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <CourseEnrollModal course={enrollCourse} open={!!enrollCourse} onOpenChange={(open) => !open && setEnrollCourse(null)} />
    </div>
  );
}
