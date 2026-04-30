import { useState, useMemo, useEffect } from "react";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAStrip from "@/components/shared/CTAStrip";
import CourseList from "@/features/courses/components/CourseList";
import CourseEnrollModal from "@/features/courses/components/CourseEnrollModal";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { AgeGroup, AGE_GROUP_LABELS, Course } from "@/types";
import { Users, Baby, GraduationCap, LayoutGrid, ChevronLeft, ChevronRight, SearchX, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { cn } from "@/lib/utils";

const AGE_GROUP_ORDER: AgeGroup[] = ["CHILDREN", "TEENAGERS", "ADULTS"];
const ITEMS_PER_PAGE = 6;

const HERO_IMAGE = "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2000&auto=format&fit=crop"; 

const AGE_GROUP_ICONS: Record<AgeGroup, React.ReactNode> = {
  CHILDREN: <Baby className="h-4 w-4" />,
  TEENAGERS: <GraduationCap className="h-4 w-4" />,
  ADULTS: <Users className="h-4 w-4" />,
};

const AGE_GROUP_DESCRIPTIONS: Record<AgeGroup, string> = {
  CHILDREN: "Fun, engaging programs that build focus and logical thinking from an early age.",
  TEENAGERS: "Structured curriculum designed for strategic thinking and tournament readiness.",
  ADULTS: "Flexible learning paths for enthusiasts looking to master the royal game.",
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

  useEffect(() => {
    if (currentPage > 1) {
      const element = document.getElementById('course-directory');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-[#cbd5e1] selection:bg-sky-500/30 overflow-hidden relative">
      <SparkleCanvas />
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative h-[65vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="Chess Academy" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-transparent to-[#0a0f1e]" />
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <ScrollReveal direction="scale">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-blue mb-8 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Sparkles className="h-3.5 w-3.5 text-[#38bdf8]" />
              <span className="accent-label text-[#38bdf8] font-black">Professional Academy</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tight leading-tight">
              Master the <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9]">Royal Game</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[#94a3b8] text-xl leading-relaxed mb-12">
              From foundation to mastery — structured curriculum designed by Grandmasters for every stage of your chess journey.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-black font-black rounded-full px-12 h-16 text-lg shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 transition-all border-none"
              onClick={() => document.getElementById('course-directory')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Our Programs
            </Button>
          </ScrollReveal>
        </div>
      </header>

      {/* FILTER & CONTENT SECTION */}
      <section className="py-32 relative z-10" id="course-directory">
        <div className="container mx-auto px-6">
          
          {/* Enhanced Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <Button
              onClick={() => handleCategoryChange("ALL")}
              className={cn(
                "rounded-full px-8 h-14 font-black uppercase tracking-widest text-xs transition-smooth border-none",
                activeCategory === 'ALL' 
                ? 'bg-[#f59e0b] text-black glow-gold'
                : 'glass-card text-[#94a3b8] hover:text-white hover:bg-white/10'
              )}
            >
              <LayoutGrid className="mr-2 h-4 w-4" /> All Programs
            </Button>
            
            {AGE_GROUP_ORDER.map((group) => (
              <Button
                key={group}
                onClick={() => handleCategoryChange(group)}
                className={cn(
                  "rounded-full px-8 h-14 font-black uppercase tracking-widest text-xs transition-smooth border-none",
                  activeCategory === group 
                  ? 'bg-[#f59e0b] text-black glow-gold'
                  : 'glass-card text-[#94a3b8] hover:text-white hover:bg-white/10'
                )}
              >
                <span className="mr-2">{AGE_GROUP_ICONS[group]}</span>
                {AGE_GROUP_LABELS[group]}
              </Button>
            ))}
          </div>

          {/* Heading Content */}
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight uppercase">
              {activeCategory === "ALL" ? (
                <>Available <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9]">Programs</span></>
              ) : (
                <>{AGE_GROUP_LABELS[activeCategory]} <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9]">Path</span></>
              )}
            </h2>
            <p className="text-[#94a3b8] text-lg leading-relaxed">
              {activeCategory === "ALL" 
                ? "Browse our complete catalog of specialized chess training designed for every skill level."
                : AGE_GROUP_DESCRIPTIONS[activeCategory]}
            </p>
          </div>

          {/* Courses List Area */}
          <div className="w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 text-[#94a3b8]">
                <div className="h-12 w-12 border-4 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin mb-6" />
                <p className="font-black uppercase tracking-[0.2em] text-xs">Curating programs...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-32 glass-card border-dashed border-white/10">
                <SearchX className="h-16 w-16 text-[#3b82f6]/30 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white uppercase mb-4">No programs found</h3>
                <p className="text-[#94a3b8]">We're updating our curriculum. Check back shortly!</p>
              </div>
            ) : (
              <div className="space-y-24">
                <div className="w-full">
                  <CourseList courses={paginatedCourses} onEnroll={setEnrollCourse} />
                </div>
                
                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-12 pt-16 border-t border-white/5">
                     <div className="flex gap-4">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={cn(
                            "h-2 rounded-full transition-smooth",
                            currentPage === i + 1 ? 'bg-[#f59e0b] w-12 glow-gold' : 'bg-white/10 hover:bg-white/20 w-2'
                          )}
                          aria-label={`Go to page ${i + 1}`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="glass-card px-8 h-14 border-none font-black uppercase tracking-widest text-xs transition-smooth hover:bg-white/10"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="glass-card px-8 h-14 border-none font-black uppercase tracking-widest text-xs transition-smooth hover:bg-white/10"
                      >
                        Next <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <CTAStrip />
      <Footer />

      <CourseEnrollModal
        course={enrollCourse}
        open={!!enrollCourse}
        onOpenChange={(open) => { if (!open) setEnrollCourse(null); }}
      />
    </div>
  );
}
