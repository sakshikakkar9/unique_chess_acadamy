import { useState, useMemo, useEffect } from "react";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAStrip from "@/components/shared/CTAStrip";
import CourseList from "@/features/courses/components/CourseList";
import CourseEnrollModal from "@/features/courses/components/CourseEnrollModal";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { AgeGroup, AGE_GROUP_LABELS, AGE_GROUP_RANGES, Course } from "@/types";
import { Users, Baby, GraduationCap, LayoutGrid, ChevronLeft, ChevronRight, SearchX, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <header className="relative h-[65vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="Chess Academy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-blue-950/80 to-white" />
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Professional Academy
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white font-heading mb-6 tracking-tight">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Royal Game</span>
          </h1>
          <p className="max-w-2xl mx-auto text-blue-50/90 text-lg md:text-xl leading-relaxed mb-10">
            From foundation to mastery — structured curriculum designed by Grandmasters for every stage of your chess journey.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl shadow-blue-900/40 transition-all hover:scale-105 active:scale-95" 
              onClick={() => document.getElementById('course-directory')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Our Programs
            </Button>
          </div>
        </div>
      </header>

      {/* FILTER & CONTENT SECTION */}
      <section className="py-20 bg-white" id="course-directory">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Enhanced Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Button
              onClick={() => handleCategoryChange("ALL")}
              className={`rounded-full px-8 py-6 transition-all duration-300 border-2 font-bold shadow-sm ${
                activeCategory === 'ALL' 
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="mr-2 h-4 w-4" /> All Programs
            </Button>
            
            {AGE_GROUP_ORDER.map((group) => (
              <Button
                key={group}
                onClick={() => handleCategoryChange(group)}
                className={`rounded-full px-8 py-6 transition-all duration-300 border-2 font-bold shadow-sm ${
                  activeCategory === group 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <span className="mr-2">{AGE_GROUP_ICONS[group]}</span>
                {AGE_GROUP_LABELS[group]}
              </Button>
            ))}
          </div>

          {/* Heading Content */}
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold font-heading mb-4 text-slate-900 tracking-tight">
              {activeCategory === "ALL" ? "Available Programs" : `${AGE_GROUP_LABELS[activeCategory]} Path`}
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              {activeCategory === "ALL" 
                ? "Browse our complete catalog of specialized chess training designed for every skill level."
                : AGE_GROUP_DESCRIPTIONS[activeCategory]}
            </p>
          </div>

          {/* Courses List Area */}
          <div className="w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <div className="h-12 w-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="font-medium">Curating programs...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <SearchX className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900">No programs found</h3>
                <p className="text-slate-500">We're updating our curriculum. Check back shortly!</p>
              </div>
            ) : (
              <div className="space-y-16">
                {/* FIXED GRID WRAPPER: 
                   This ensures your CourseList doesn't squash the cards.
                */}
                <div className="w-full">
                  <CourseList courses={paginatedCourses} onEnroll={setEnrollCourse} />
                </div>
                
                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-8 pt-12 border-t border-slate-100">
                     <div className="flex gap-3">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            currentPage === i + 1 ? 'bg-blue-600 w-12' : 'bg-slate-200 hover:bg-slate-300 w-2.5'
                          }`}
                          aria-label={`Go to page ${i + 1}`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="rounded-full px-8 h-12 border-slate-200 font-semibold shadow-sm"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-full px-8 h-12 border-slate-200 font-semibold shadow-sm"
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

      {/* SPECIALIZED TRAINING CARDS */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Master-Level Mentorship</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Go beyond the basics with private training sessions from our elite coaching staff.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="group bg-white border border-slate-200 rounded-3xl p-10 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-1">
              <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">One-on-One Coaching</h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">Personalized mentorship tailored to your opening repertoire and endgame precision.</p>
              <Button variant="outline" className="w-full rounded-xl py-6 border-slate-200 font-bold group-hover:bg-slate-900 group-hover:text-white transition-all">Book Private Session</Button>
            </div>
            
            <div className="group bg-white border border-slate-200 rounded-3xl p-10 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-1">
              <div className="h-14 w-14 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                <LayoutGrid className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Corporate Workshops</h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">Applying chess strategy to business leadership and tactical decision-making.</p>
              <Button variant="outline" className="w-full rounded-xl py-6 border-slate-200 font-bold group-hover:bg-slate-900 group-hover:text-white transition-all">Request Proposal</Button>
            </div>
          </div>
        </div>
      </section>

      <CTAStrip />

      <CourseEnrollModal
        course={enrollCourse}
        open={!!enrollCourse}
        onOpenChange={(open) => { if (!open) setEnrollCourse(null); }}
      />
    </div>
  );
}