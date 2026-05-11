import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      <header className="relative min-h-auto pt-24 pb-12 md:min-h-[400px] md:pt-28 md:pb-16 lg:min-h-[480px] lg:pt-32 lg:pb-20 w-full flex items-center bg-[#020617] overflow-hidden">
        <SparkleCanvas density="full" />
        <div className="container relative z-10 mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-left max-w-3xl">
            <motion.div variants={fadeUp} className="text-xs font-semibold tracking-widest uppercase border border-white/20 bg-white/10 rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-6 text-white">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Curriculum Excellence</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Grandmaster</span> Path
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
              "Mastery is a journey, not a destination." Find the program that fits your ambition.
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* Categories Bar */}
      <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-2 flex-wrap">
            {["ALL", ...AGE_GROUP_ORDER].map((category) => (
              <button
                key={category}
                onClick={() => { setActiveCategory(category as any); setCurrentPage(1); }}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-150",
                  activeCategory === category
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-transparent border border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                )}
              >
                {category === "ALL" ? "All Programs" : AGE_GROUP_LABELS[category as AgeGroup]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16 bg-white min-h-[800px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {isLoading ? (
            <div className="flex justify-center py-40"><div className="h-12 w-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" /></div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-3 text-slate-400">
              <div className="text-5xl">♟</div>
              <p className="text-base font-medium">No programs found</p>
              <p className="text-sm">Try selecting a different category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCourses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
                >
                  {/* Image Container with Fixed Aspect Ratio for Uniformity */}
                  <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={course.custom_banner_url || HERO_IMAGE}
                      alt={course.title}
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-transform duration-700",
                        course.posterOrientation === 'PORTRAIT' ? "object-top" : "object-center"
                      )}
                      onError={(e) => {
                        e.currentTarget.src = HERO_IMAGE;
                      }}
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      <span className="flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5" /> {course.skillLevel}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">
                      {course.contactDetails}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-lg font-bold text-slate-900">₹{course.fee.toLocaleString()}</div>
                      <Button
                        onClick={() => navigate(`/courses/${course.id}/enroll`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 px-4 font-semibold text-xs"
                      >
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
    </div>
  );
}
