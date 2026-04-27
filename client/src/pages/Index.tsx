import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Trophy, Star as StarIcon, BookOpen } from "lucide-react";
import heroImg from "@/assets/hero-chess.jpg";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAStrip from "@/components/shared/CTAStrip";
import { Button } from "@/components/ui/button";
import CourseCard from "@/features/courses/components/CourseCard";
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
  
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Chess"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 hero-overlay" />
          {/* Animated Background Gradients */}
          <div className="absolute top-1/4 -left-1/4 w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-[50%] h-[50%] bg-royal/20 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>

        <div className="relative container mx-auto px-4 pt-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full glass-light text-xs font-heading font-semibold uppercase tracking-[0.4em] text-primary mb-8 border-glow-gold">
                India's Premier Chess Academy
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-8 text-glow-gold"
            >
              Master the Game. <br />
              <span className="text-gradient-gold">Grandmaster Mindset.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Elite coaching, professional mentorship, and national-level competition. Transform your strategic thinking with Unique Chess Academy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button size="lg" className="gold-glow rounded-full text-base px-10 py-7 group">
                Join Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button 
                onClick={() => setIsDemoModalOpen(true)} 
                size="lg" 
                variant="outline" 
                className="glass border-primary/30 text-primary hover:bg-primary/10 rounded-full px-10 py-7 transition-all duration-300"
              >
                Book Free Demo
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-24 z-10 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.id} delay={i * 0.1}>
                <div className="glass border-white/5 rounded-3xl p-8 text-center card-elevation hover:border-primary/50 transition-all duration-500 group">
                  <div className="inline-flex p-3 bg-primary/5 rounded-2xl mb-4 group-hover:bg-primary/10 transition-colors">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="font-heading font-bold text-3xl md:text-4xl text-gradient-gold mb-2">{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section with Chess Pattern */}
      <section className="section-padding relative">
        <div className="absolute inset-0 chess-pattern -z-10" />
        <div className="container mx-auto">
          <SectionHeading
            label="Our Programs"
            title={<span>Elite Training for <span className="text-gradient-gold">Every Level</span></span>}
            description="Our structured curriculum is designed to take you from basic moves to advanced strategic mastery."
          />
          {coursesLoading ? (
            <div className="text-center py-20 animate-pulse text-muted-foreground">Loading programs...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {courses.slice(0, 3).map((course, i) => (
                <CourseCard key={course.id} course={course} delay={i * 0.1} />
              ))}
            </div>
          )}
          <div className="mt-16 text-center">
            <Button variant="ghost" className="text-primary hover:text-primary-foreground group">
              View All Programs <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-secondary/20">
        <div className="container mx-auto">
          <SectionHeading label="Testimonials" title="The Student Experience" />
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.1}>
                <div className="glass border-white/5 rounded-3xl p-10 h-full flex flex-col">
                  <div className="flex gap-1.5 mb-8">
                    {[...Array(t.rating)].map((_, j) => (
                      <StarIcon key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground/90 text-lg leading-relaxed mb-10 flex-grow">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-heading font-bold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-heading font-bold text-sm tracking-wide">{t.name}</div>
                      <div className="text-xs text-muted-foreground font-medium">{t.role}</div>
                    </div>
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
          <SectionHeading label="Tournaments" title="Compete at the Highest Level" />
          {tournamentsLoading ? (
            <div className="text-center py-20 animate-pulse text-muted-foreground">Loading tournaments...</div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-10">
              {tournaments.length > 0 && (
                <ScrollReveal direction="left">
                  <div className="relative rounded-[2rem] overflow-hidden aspect-[16/10] group card-elevation">
                    <img
                      src={tournaments[0].image || heroImg}
                      alt="Tournament"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-4 py-1 rounded-full mb-4 inline-block">
                        Featured Event
                      </span>
                      <h3 className="font-heading font-bold text-3xl mb-2 text-glow-gold">{tournaments[0].title}</h3>
                      <p className="text-muted-foreground font-medium">{tournaments[0].location} • {tournaments[0].date}</p>
                      <Button className="mt-6 gold-glow rounded-full px-8">Register Now</Button>
                    </div>
                  </div>
                </ScrollReveal>
              )}
              <div className="flex flex-col gap-6">
                {tournaments.slice(1, 4).map((t) => (
                  <ScrollReveal key={t.id} direction="right">
                    <div className="glass border-white/5 rounded-3xl p-6 flex items-center justify-between hover:bg-white/5 transition-all group cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-secondary/50 rounded-2xl border border-white/5 group-hover:border-primary/30 transition-all">
                          <Trophy className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-lg mb-1 group-hover:text-primary transition-colors">{t.title}</h4>
                          <p className="text-sm text-muted-foreground">{t.location} • {t.date}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full",
                        t.status === "Open" ? "bg-primary/20 text-primary border border-primary/20" : "bg-muted/50 text-muted-foreground border border-white/5"
                      )}>
                        {t.status}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTAStrip 
        title="Your Journey to Mastery Starts Here." 
        subtitle="Book a free demo class today and take your first step towards grandmaster thinking."
      />

      <DemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </div>
  );
}
