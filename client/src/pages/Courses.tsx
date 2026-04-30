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
import { scaleIn } from "@/components/shared/motion";

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
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION (Dark) */}
      <header className="relative min-h-[60vh] w-full flex items-center justify-center bg-[#0f172a] overflow-hidden pt-32 pb-20">
        <SparkleCanvas density="full" />
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={HERO_IMAGE} alt="Chess Academy" className="w-full h-full object-cover" />
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <ScrollReveal variants={scaleIn}>
            <h1 className="text-h1 text-white mb-8 playfair">
              Master the <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9]">Royal Game</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[#94a3b8] text-body-lg leading-relaxed mb-12">
              From foundation to mastery — structured curriculum designed by Grandmasters for every stage of your chess journey.
            </p>
            <Button 
              size="lg" 
              className="bg-[#d97706] text-white font-semibold rounded-full px-12 h-14 text-lg shadow-[0_4px_12px_rgba(217,119,6,0.35)] hover:bg-[#b45309] transition-all"
              onClick={() => document.getElementById('course-directory')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Our Programs
            </Button>
          </ScrollReveal>
        </div>
      </header>

      {/* FILTER BAR (Sticky White) */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-[#e2e8f0] py-4" id="course-directory">
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => handleCategoryChange("ALL")}
            className={cn(
              "px-6 py-2.5 rounded-full text-[13px] font-medium transition-all duration-200 border",
              activeCategory === 'ALL'
              ? 'bg-[#2563eb] text-white border-[#2563eb]'
              : 'bg-white text-[#475569] border-[#e2e8f0] hover:border-[#cbd5e1]'
            )}
          >
            All Programs
          </button>
          
          {AGE_GROUP_ORDER.map((group) => (
            <button
              key={group}
              onClick={() => handleCategoryChange(group)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[13px] font-medium transition-all duration-200 border flex items-center gap-2",
                activeCategory === group
                ? 'bg-[#2563eb] text-white border-[#2563eb]'
                : 'bg-white text-[#475569] border-[#e2e8f0] hover:border-[#cbd5e1]'
              )}
            >
              {AGE_GROUP_ICONS[group]}
              {AGE_GROUP_LABELS[group]}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT SECTION (White) */}
      <section className="py-20 bg-white min-h-[600px]">
        <div className="container mx-auto px-6">
          {/* Heading Content */}
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-h2 text-[#0f172a] mb-6">
              {activeCategory === "ALL" ? "All Programs" : AGE_GROUP_LABELS[activeCategory]}
            </h2>
            <p className="text-[#475569] text-[17px] leading-[1.7]">
              {activeCategory === "ALL" 
                ? "Browse our complete catalog of specialized chess training designed for every skill level."
                : AGE_GROUP_DESCRIPTIONS[activeCategory]}
            </p>
          </div>

          {/* Courses List Area */}
          <div className="w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 text-[#94a3b8]">
                <div className="h-12 w-12 border-4 border-[#2563eb]/20 border-t-[#2563eb] rounded-full animate-spin mb-6" />
                <p className="text-label">Curating programs...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-32 border border-dashed border-[#e2e8f0] rounded-2xl">
                <SearchX className="h-16 w-16 text-[#94a3b8]/30 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-[#0f172a] mb-4">No programs found</h3>
                <p className="text-[#475569]">We're updating our curriculum. Check back shortly!</p>
              </div>
            ) : (
              <div className="space-y-24">
                <div className="w-full">
                  <CourseList courses={paginatedCourses} onEnroll={setEnrollCourse} />
                </div>
                
                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-12 pt-16 border-t border-[#e2e8f0]">
                    <div className="flex gap-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="rounded-full px-8 h-12 border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                      </Button>
                      <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={cn(
                              "w-2.5 h-2.5 rounded-full transition-all",
                              currentPage === i + 1 ? 'bg-[#2563eb] w-8' : 'bg-[#e2e8f0] hover:bg-[#cbd5e1]'
                            )}
                            aria-label={`Go to page ${i + 1}`}
                          />
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-full px-8 h-12 border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]"
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
