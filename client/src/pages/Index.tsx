import { useState } from "react"; // ✅ Added for Modal State
import { motion } from "framer-motion";
import { ArrowRight, Users, Trophy, Star as StarIcon, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-chess.jpg";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAStrip from "@/components/shared/CTAStrip";
import { Button } from "@/components/ui/button";
import CourseCard from "@/features/courses/components/CourseCard";

// ✅ Import the new Demo Components
import DemoModal from "@/features/demo/components/DemoModal"; 

import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";

// Static Data
const stats = [
  { id: "1", icon: Users, value: "5,000+", label: "Students Trained" },
  { id: "2", icon: Trophy, value: "120+", label: "Tournaments Hosted" },
  { id: "3", icon: StarIcon, value: "50+", label: "National Champions" },
  { id: "4", icon: BookOpen, value: "15+", label: "Expert Coaches" },
];

const testimonials = [
  { id: "t1", name: "Priya Sharma", role: "Parent", rating: 5, text: "My son went from a complete beginner to winning his school championship in just 6 months." },
  { id: "t2", name: "Arjun Mehta", role: "Student, Age 16", rating: 5, text: "Unique Chess Academy transformed my game. The structured approach gave me the competitive edge." },
  { id: "t3", name: "Dr. Rajesh Kumar", role: "Parent", rating: 5, text: "The focus on both skill development and character building makes it truly unique." },
];

export default function HomePage() {
  const { courses, isLoading: coursesLoading } = useAdminCourses();
  const { tournaments, isLoading: tournamentsLoading } = useAdminTournaments();
  
  // ✅ State to control the Modal
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Chess" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        </div>
        <div className="relative container mx-auto px-4 pt-20">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-block text-xs font-heading font-semibold uppercase tracking-[0.3em] text-primary mb-6">
                India's Premier Chess Academy
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
              Master the Game. <span className="text-gradient-gold">Think Like a Grandmaster.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Structured coaching programs, expert mentorship, and nationwide tournaments — your journey to chess mastery starts here.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gold-glow text-base px-8 py-6 group">
                Join Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              {/* ✅ Book Free Demo Button with onClick handler */}
              <Button 
                onClick={() => setIsDemoModalOpen(true)} 
                size="lg" 
                variant="outline" 
                className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-6"
              >
                Book Free Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-20 z-10 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.id} delay={i * 0.1}>
                <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-lg hover:border-primary/50 transition-colors">
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                  <div className="font-heading font-bold text-2xl md:text-3xl text-gradient-gold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label="Our Programs" title="Train Smart. Win Smarter." description="Structured programs designed for every skill level." />
          {coursesLoading ? (
            <div className="text-center py-10 animate-pulse text-muted-foreground">Loading programs...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course, i) => (
                <CourseCard key={course.id} course={course} delay={i * 0.1} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto">
          <SectionHeading label="Testimonials" title="What Our Community Says" />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.1}>
                <div className="bg-card border border-border rounded-2xl p-8 h-full shadow-sm">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div>
                    <div className="font-heading font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tournament Highlights */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label="Tournaments" title="Compete. Conquer. Champion." />
          {tournamentsLoading ? (
            <div className="text-center py-10 animate-pulse text-muted-foreground">Loading tournaments...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {tournaments.length > 0 && (
                <ScrollReveal direction="left">
                  <div className="relative rounded-2xl overflow-hidden aspect-video group">
                    <img src={tournaments[0].image || heroImg} alt="Tournament" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-xs font-medium bg-primary/20 text-primary px-3 py-1 rounded-full mb-3 inline-block">Upcoming</span>
                      <h3 className="font-heading font-bold text-xl mb-1">{tournaments[0].title}</h3>
                      <p className="text-muted-foreground text-sm">{tournaments[0].location} • {tournaments[0].date}</p>
                    </div>
                  </div>
                </ScrollReveal>
              )}
              <div className="flex flex-col gap-4">
                {tournaments.slice(1, 4).map((t) => (
                  <div key={t.id} className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div>
                      <h4 className="font-heading font-semibold text-sm mb-1">{t.title}</h4>
                      <p className="text-xs text-muted-foreground">{t.location} • {t.date}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${t.status === "Open" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTAStrip 
        title="Your Journey to Mastery Starts Here." 
        subtitle="Book a free demo class today." 
      />

      {/* ✅ Demo Modal Component */}
      <DemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </div>
  );
}

// Inline Star component for testimonials
function Star({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}