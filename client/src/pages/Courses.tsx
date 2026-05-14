import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { AgeGroup, AGE_GROUP_LABELS } from "@/types";
import { GraduationCap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { stagger, fadeLeft, fadeIn } from "@/components/shared/motion";
import CourseCard from "@/features/courses/components/CourseCard";

const AGE_GROUP_ORDER: AgeGroup[] = ["CHILDREN", "TEENAGERS", "ADULTS"];
const ITEMS_PER_PAGE = 6;
const HERO_IMAGE = "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2000&auto=format&fit=crop"; 

export default function CoursesPage() {
  const navigate = useNavigate();
  const { courses, isLoading } = useAdminCourses();
  const [activeCategory, setActiveCategory] = useState<AgeGroup | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return [];
    if (activeCategory === "ALL") return courses;
    return courses.filter((c) => c.ageGroup === activeCategory);
  }, [courses, activeCategory]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white selection:bg-blue-600/30 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-[#070F1C] min-h-[560px] flex items-center overflow-hidden">
        {/* Chess pattern texture */}
        <div className="absolute inset-0 opacity-[0.035]"
             style={{
               backgroundImage: `linear-gradient(45deg,#fff 25%,transparent 25%),
                                 linear-gradient(-45deg,#fff 25%,transparent 25%),
                                 linear-gradient(45deg,transparent 75%,#fff 75%),
                                 linear-gradient(-45deg,transparent 75%,#fff 75%)`,
               backgroundSize: '32px 32px',
               backgroundPosition: '0 0,0 16px,16px -16px,-16px 0'
             }} />

        {/* Glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px]
                        bg-blue-600/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        w-full pt-24 sm:pt-28 pb-16 sm:pb-20">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
            {/* Eyebrow */}
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 mb-5
                            bg-blue-500/15 border border-blue-500/25 rounded-full
                            px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">
                Academy Programs
              </span>
            </motion.div>

            <motion.h1 variants={fadeLeft} className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
              The Path to <br />
              <span className="text-blue-400">Mastery.</span>
            </motion.h1>
            <motion.p variants={fadeLeft} className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl mb-8">
              "Mastery is a journey, not a destination." Find the program that fits your ambition.
            </motion.p>
          </motion.div>
        </div>

        {/* Fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-20
                        bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Categories Bar */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-2 flex-wrap">
            {["ALL", ...AGE_GROUP_ORDER].map((category) => (
              <button
                key={category}
                onClick={() => { setActiveCategory(category as any); setCurrentPage(1); }}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150",
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-transparent border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
                )}
              >
                {category === "ALL" ? "All Programs" : AGE_GROUP_LABELS[category as AgeGroup]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-14 sm:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-40"><div className="h-10 w-10 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" /></div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-slate-400">
              <GraduationCap className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">No programs found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {paginatedCourses.map((course, idx) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    delay={idx * 0.1}
                    onEnroll={() => navigate(`/courses/${course.id}/enroll`)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={cn(
                        "w-10 h-10 rounded-lg text-sm font-bold transition-colors",
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
