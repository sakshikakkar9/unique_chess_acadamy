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

      <header className="relative min-h-[60vh] w-full flex items-center bg-[#020617] overflow-hidden pt-32 pb-20">
        <SparkleCanvas density="full" />
        <div className="container relative z-10 mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-left">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-8">
              <GraduationCap className="h-3.5 w-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Curriculum Excellence</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Grandmaster</span> Path
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-xl text-slate-400 text-lg leading-relaxed">
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
                <motion.div
                  key={course.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full"
                >
                  {/* Image Container with Fixed Aspect Ratio for Uniformity */}
                  <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={course.custom_banner_url || HERO_IMAGE}
                      alt={course.title}
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
                        course.posterOrientation === 'PORTRAIT' ? "object-top" : "object-center"
                      )}
                    />
                    <div className="absolute top-5 left-5 flex gap-2">
                      <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black text-blue-600 shadow-xl shadow-blue-900/5 uppercase tracking-widest border border-blue-50">
                        {course.mode}
                      </span>
                    </div>
                    {/* Soft gradient overlay for professional feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    {/* Meta Info with consistent height */}
                    <div className="flex items-center gap-4 mb-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      <span className="flex items-center gap-2 py-1 px-3 bg-slate-50 rounded-lg border border-slate-100"><BarChart3 className="h-3.5 w-3.5 text-blue-500" /> {course.skillLevel}</span>
                      <span className="flex items-center gap-2 py-1 px-3 bg-slate-50 rounded-lg border border-slate-100"><Clock className="h-3.5 w-3.5 text-blue-500" /> {course.duration}</span>
                    </div>

                    {/* Title with fixed line height and clamp to ensure alignment */}
                    <div className="h-16 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 mb-8 flex-grow">
                      <div className="h-10">
                        <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 italic">
                          {course.contactDetails}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-bold text-slate-700 bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50">
                        <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                        <span className="truncate">{course.days?.join(", ")} | {course.classTime}</span>
                      </div>
                    </div>

                    {/* Footer alignment ensured by mt-auto */}
                    <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Course Fee</span>
                        <div className="text-2xl font-black text-slate-900 tracking-tighter">₹{course.fee.toLocaleString()}</div>
                      </div>
                      <Button
                        onClick={() => navigate(`/courses/${course.id}/enroll`)}
                        className="bg-blue-600 hover:bg-slate-900 text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] uppercase tracking-wider text-xs"
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
