import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CourseList from "@/features/courses/components/CourseList";
import CourseEnrollModal from "@/features/courses/components/CourseEnrollModal";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { AgeGroup, AGE_GROUP_LABELS, Course } from "@/types";
import { Users, Baby, GraduationCap, ChevronLeft, ChevronRight, SearchX, Sparkles, Trophy, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { scaleIn, fadeIn, stagger, fadeUp } from "@/components/shared/motion";

const AGE_GROUP_ORDER: AgeGroup[] = ["CHILDREN", "TEENAGERS", "ADULTS"];
const ITEMS_PER_PAGE = 6;

const HERO_IMAGE = "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2000&auto=format&fit=crop"; 

const AGE_GROUP_ICONS: Record<AgeGroup, React.ReactNode> = {
  CHILDREN: <Baby className="h-4 w-4" />,
  TEENAGERS: <GraduationCap className="h-4 w-4" />,
  ADULTS: <Users className="h-4 w-4" />,
};

const AGE_GROUP_DESCRIPTIONS: Record<AgeGroup, string> = {
  CHILDREN: "Interactive programs that transform logical thinking into a fun adventure for young minds.",
  TEENAGERS: "Competitive training modules focused on opening theory, endgame precision, and mental grit.",
  ADULTS: "Comprehensive paths for adult learners to refine their strategy and achieve FIDE ratings.",
};

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

  const handleCategoryChange = (category: AgeGroup | "ALL") => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative min-h-[60vh] w-full flex items-center justify-center bg-[#020617] overflow-hidden pt-32 pb-20">
        <SparkleCanvas density="full" />
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img src={HERO_IMAGE} alt="Chess Academy" className="w-full h-full object-cover" />
        </motion.div>
        
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles className="h-3 w-3" /> Professional Curriculum
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-7xl font-bold text-white mb-6 tracking-tighter">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Grandmaster</span> Path
            </motion.h1>
            
            <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed mb-10 italic">
              "Every master was once a beginner." Join a legacy of strategic excellence.
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 py-6" id="course-directory">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {[ "ALL", ...AGE_GROUP_ORDER ].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category as any)}
                className={cn(
                  "relative px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300",
                  activeCategory === category 
                    ? "text-white" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {activeCategory === category && (
                  <motion.div 
                    layoutId="activeCategory" 
                    className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {category !== "ALL" && AGE_GROUP_ICONS[category as AgeGroup]}
                  {category === "ALL" ? "All Programs" : AGE_GROUP_LABELS[category as AgeGroup]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <section className="py-24 bg-slate-50/50 min-h-[800px] relative">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-16 text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                {activeCategory === "ALL" ? "Available Programs" : AGE_GROUP_LABELS[activeCategory]}
              </h2>
              <p className="text-slate-500 text-base leading-relaxed italic">
                {activeCategory === "ALL" 
                  ? "Browse our complete catalog of specialized chess training."
                  : AGE_GROUP_DESCRIPTIONS[activeCategory]}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <div className="h-12 w-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-32 border-2 border-dashed border-slate-200 rounded-3xl">
                <SearchX className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No programs found</h3>
              </div>
            ) : (
              <div className="space-y-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory + currentPage}
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {paginatedCourses.map((course) => (
                      <motion.div 
                        key={course.id}
                        variants={fadeUp}
                        className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all duration-500 flex flex-col h-full"
                      >
                        {/* Image Header - FIXED RENDERING */}
                        <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                          <img 
                            src={course.image || "/placeholder-chess.jpg"} 
                            alt={course.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=800&auto=format&fit=crop";
                            }}
                          />
                          <div className="absolute top-4 left-4 flex gap-2 z-10">
                             <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-wider text-blue-600 shadow-sm">
                                {course.ageGroup}
                             </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 md:p-7 flex flex-col flex-grow">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <BarChart3 className="h-3.5 w-3.5 text-blue-500" /> {course.level || 'All Levels'}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <Clock className="h-3.5 w-3.5 text-blue-500" /> {course.duration || '4 Months'}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {course.title}
                          </h3>
                          
                          <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2 italic">
                            {course.description}
                          </p>

                          {/* Footer */}
                          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Investment</span>
                              <span className="text-xl font-black text-slate-900">
                                ₹{course.price.toLocaleString()}
                              </span>
                            </div>
                            <Button 
                              onClick={() => setEnrollCourse(course)}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-11 text-sm font-bold shadow-lg shadow-blue-600/10 active:scale-95 transition-all"
                            >
                              Enroll Now
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
                
                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 pt-10 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-xl font-bold"
                    >
                      <ChevronLeft className="h-5 w-5 mr-1" /> Prev
                    </Button>
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            currentPage === i + 1 ? 'bg-blue-600 w-8' : 'bg-slate-200 w-2 hover:bg-slate-300'
                          )}
                        />
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-xl font-bold"
                    >
                      Next <ChevronRight className="h-5 w-5 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <CourseEnrollModal
        course={enrollCourse}
        open={!!enrollCourse}
        onOpenChange={(open) => { if (!open) setEnrollCourse(null); }}
      />
    </div>
  );
}