import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Trophy, Star as StarIcon, BookOpen, Target, Brain, ArrowRight, PlayCircle
} from "lucide-react";
import heroImg from "@/assets/hero-chess.jpg";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import DemoModal from "@/features/demo/components/DemoModal";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { Button } from "@/components/ui/button";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// --- CONSTANTS ---
const stats = [
  { id: "1", icon: Users, value: 5000, label: "Students", suffix: "+" },
  { id: "2", icon: Trophy, value: 120, label: "Tournaments", suffix: "+" },
  { id: "3", icon: StarIcon, value: 50, label: "Champions", suffix: "+" },
  { id: "4", icon: BookOpen, value: 15, label: "Coaches", suffix: "+" },
];

const features = [
  { id: "f1", icon: Target, title: "Structured Learning", desc: "Step-by-step curriculum from beginner to advanced level." },
  { id: "f2", icon: Trophy, title: "Tournament Exposure", desc: "Regular competitions to test real-world performance." },
  { id: "f3", icon: Users, title: "Expert Coaches", desc: "Learn from experienced and ranked players." },
  { id: "f4", icon: Brain, title: "Cognitive Growth", desc: "Improve focus, memory, and decision-making." },
];

const levels = [
  { id: "l1", icon: "♟", title: "Beginner", desc: "Start your journey with strong fundamentals.", points: ["Rules & basics", "Simple tactics", "Opening ideas"], color: "#3b82f6" },
  { id: "l2", icon: "♜", title: "Intermediate", desc: "Build strategy and deeper understanding.", points: ["Middlegame planning", "Pattern recognition", "Better decisions"], color: "#0ea5e9" },
  { id: "l3", icon: "♚", title: "Advanced", desc: "Train like a competitive player.", points: ["Endgame mastery", "Game analysis", "Tournament mindset"], color: "#f59e0b" },
];

const CountUp = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <>{count}{suffix}</>;
};

export default function HomePage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const { tournaments } = useAdminTournaments();
  const { courses } = useAdminCourses();

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-[#cbd5e1] selection:bg-sky-500/30 overflow-hidden relative">
      <SparkleCanvas />
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Repeating Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03]"
             style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,255,255,0.5) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.5) 50px)', backgroundSize: '50px 50px' }} />

        <div className="container mx-auto px-6 z-10 grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b] text-[11px] font-black tracking-[0.15em] uppercase mb-8 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="animate-pulse">♟</span> India's Premier Chess Academy
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tight text-white">
                Master the <br />
                <span className="text-[#38bdf8] glow-text-blue">Board.</span><br />
                Own the <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]">Game.</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="inline-block w-[3px] h-[0.8em] bg-[#f59e0b] ml-2 align-middle"
                />
              </h1>

              <p className="text-[#94a3b8] text-xl mb-12 leading-relaxed">
                Professional coaching for the next generation of Grandmasters. 
                Combining logic with the fun of strategy to build future champions.
              </p>

              <div className="flex flex-wrap gap-6">
                <Button size="lg" className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-black font-black px-10 rounded-full h-16 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-all duration-300">
                  Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button variant="outline" size="lg" onClick={() => setIsDemoModalOpen(true)} className="glass-card-blue text-white border-none px-10 rounded-full h-16 transition-all hover:bg-[#3b82f6]/20">
                  <PlayCircle className="mr-2 h-5 w-5" /> Free Demo
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Floating Board Illustration */}
          <div className="relative hidden lg:block h-[600px]">
             <motion.div
               animate={{
                 y: [0, -12, 0],
                 rotateX: [15, 17, 15],
                 rotateY: [-10, -12, -10]
               }}
               transition={{
                 duration: 6,
                 repeat: Infinity,
                 ease: "easeInOut"
               }}
               style={{ perspective: '800px', transformStyle: 'preserve-3d', rotateX: '15deg', rotateY: '-10deg' }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#111827] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
             >
                <div className="grid grid-cols-8 grid-rows-8 w-full h-full opacity-20">
                  {[...Array(64)].map((_, i) => (
                    <div key={i} className={(Math.floor(i / 8) + i) % 2 === 0 ? "bg-white" : "bg-transparent"} />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-[180px] text-[#f59e0b] opacity-30 drop-shadow-2xl">♞</div>
                </div>
             </motion.div>

             {/* Floating Stat Cards */}
             <motion.div
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
               className="absolute top-[10%] right-[5%] glass-card-blue p-6 glow-blue"
             >
                <div className="text-white font-black text-2xl">5000+</div>
                <div className="accent-label text-[#93c5fd]">Students</div>
             </motion.div>

             <motion.div
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, delay: 1 }}
               className="absolute bottom-[20%] left-[0%] glass-card-blue p-6 glow-blue"
             >
                <div className="text-white font-black text-2xl">120+</div>
                <div className="accent-label text-[#93c5fd]">Tournaments</div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#0d1b2e] border-y border-white/5 py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col md:flex-row items-center gap-6 group">
                <div className="w-16 h-16 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center shrink-0">
                  <stat.icon className="h-8 w-8 text-[#f59e0b]" />
                </div>
                <div className="text-center md:text-left">
                  <div className="text-5xl font-black text-white leading-none mb-2">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="accent-label text-[#94a3b8]">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <SectionHeading 
            label="The UCA Advantage" 
            title="Why Choose Us" 
            description="High-performance training in a modern environment designed for serious players." 
          />
          <div className="grid md:grid-cols-4 gap-8 mt-24">
            {features.map((f, i) => (
              <ScrollReveal key={f.id} delay={i * 0.1}>
                <div className="h-full glass-card p-10 group transition-smooth hover:translate-y-[-8px] hover:glow-blue">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9] flex items-center justify-center mb-8 transition-smooth group-hover:scale-110">
                    <f.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{f.title}</h3>
                  <p className="text-[#94a3b8] leading-relaxed text-sm">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM SECTION */}
      <section className="py-32 bg-[#030712] relative z-10 border-y border-white/5">
        <div className="container mx-auto px-6">
          <SectionHeading label="Your Path" title="Tailored Learning Paths" />
          <div className="grid md:grid-cols-3 gap-10 mt-24">
            {levels.map((level, i) => (
              <ScrollReveal key={level.id} delay={i * 0.1}>
                <div
                  className="relative h-full glass-card p-12 overflow-hidden transition-smooth hover:shadow-2xl border-l-[3px]"
                  style={{ borderLeftColor: level.color }}
                >
                  <div className="text-7xl mb-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" style={{ filter: `drop-shadow(0 0 10px ${level.color}40)` }}>{level.icon}</div>
                  <h3 className="font-black text-3xl text-white mb-6 uppercase tracking-tight">{level.title}</h3>
                  <p className="text-[#94a3b8] mb-10 leading-relaxed">{level.desc}</p>
                  <ul className="space-y-6">
                    {level.points.map((p, idx) => (
                      <li key={idx} className="flex items-center text-sm font-bold text-[#cbd5e1] uppercase tracking-wider">
                        <div className="h-2 w-2 rounded-full mr-4 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: level.color, color: level.color }} /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
