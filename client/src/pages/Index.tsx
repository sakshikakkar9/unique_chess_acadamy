import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Trophy, Star as StarIcon, BookOpen, Target, Brain, ArrowRight, PlayCircle
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import DemoModal from "@/features/demo/components/DemoModal";
import { Button } from "@/components/ui/button";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fadeLeft, stagger, scaleIn } from "@/components/shared/motion";
import { cn } from "@/lib/utils";

// --- CONSTANTS ---
const stats = [
  { id: "1", icon: Users, value: 5000, label: "Students", suffix: "+" },
  { id: "2", icon: Trophy, value: 120, label: "Tournaments", suffix: "+" },
  { id: "3", icon: StarIcon, value: 50, label: "Champions", suffix: "+" },
  { id: "4", icon: BookOpen, value: 15, label: "Coaches", suffix: "+" },
];

const features = [
  { id: "f1", icon: Target, title: "Structured Learning", desc: "Step-by-step curriculum from beginner to advanced level.", color: "blue" },
  { id: "f2", icon: Trophy, title: "Tournament Exposure", desc: "Regular competitions to test real-world performance.", color: "sky" },
  { id: "f3", icon: Users, title: "Expert Coaches", desc: "Learn from experienced and ranked players.", color: "gold" },
  { id: "f4", icon: Brain, title: "Cognitive Growth", desc: "Improve focus, memory, and decision-making.", color: "blue" },
];

const levels = [
  { id: "l1", icon: "♟", title: "Beginner", desc: "Start your journey with strong fundamentals.", points: ["Rules & basics", "Simple tactics", "Opening ideas"], color: "#2563eb" },
  { id: "l2", icon: "♜", title: "Intermediate", desc: "Build strategy and deeper understanding.", points: ["Middlegame planning", "Pattern recognition", "Better decisions"], color: "#0ea5e9" },
  { id: "l3", icon: "♚", title: "Advanced", desc: "Train like a competitive player.", points: ["Endgame mastery", "Game analysis", "Tournament mindset"], color: "#d97706" },
];

const CountUp = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsInView(true);
    }, { threshold: 0.1 });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const frameRate = 1000 / 60;
    const totalFrames = duration / frameRate;
    const increment = end / totalFrames;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, frameRate);
    return () => clearInterval(timer);
  }, [end, isInView]);

  return <div ref={setRef}>{count}{suffix}</div>;
};

export default function HomePage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION (Dark) */}
      <section className="relative min-h-screen flex items-center bg-[#0f172a] overflow-hidden pt-20">
        <SparkleCanvas density="full" />

        {/* Chess Photo Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-[0.12]"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div className="container mx-auto px-6 z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeLeft}>
              <h1 className="text-h1 text-white mb-8 playfair">
                Master the <br />
                <span className="text-[#38bdf8]">Board.</span><br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#60a5fa] to-[#a78bfa]">Own the Game.</span>
              </h1>
            </motion.div>

            <motion.p variants={fadeLeft} className="text-[#94a3b8] text-body-lg mb-12 max-w-[480px]">
              Professional coaching for the next generation of Grandmasters.
              Combining logic with the fun of strategy to build future champions.
            </motion.p>

            <motion.div variants={scaleIn} className="flex flex-wrap gap-6">
              <Button size="lg" className="bg-[#d97706] text-black font-semibold px-10 rounded-full h-14 hover:bg-[#b45309] shadow-[0_4px_12px_rgba(217,119,6,0.35)] transition-all animate-gold-pulse">
                Start Learning <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button variant="outline" size="lg" onClick={() => setIsDemoModalOpen(true)} className="glass-stat text-white border-white/20 px-10 rounded-full h-14 hover:bg-white/10">
                <PlayCircle className="mr-2 h-5 w-5" /> Free Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side: floating board card */}
          <div className="relative hidden lg:block h-[600px]">
             <motion.div
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="glass-hero absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] p-8 flex items-center justify-center"
             >
                <div className="grid grid-cols-8 grid-rows-8 w-full h-full border border-white/10">
                  {[...Array(64)].map((_, i) => (
                    <div key={i} className={cn("w-full h-full", (Math.floor(i / 8) + i) % 2 === 0 ? "bg-white/5" : "bg-transparent")} />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-[240px] text-white/10 drop-shadow-2xl">♞</div>
                </div>
             </motion.div>

             {/* Floating Stats */}
             <motion.div
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
               className="glass-stat absolute top-[15%] right-[0%] p-6"
             >
                <div className="text-white font-black text-2xl">5000+</div>
                <div className="text-label text-[#94a3b8]">Students</div>
             </motion.div>

             <motion.div
               animate={{ y: [0, 15, 0] }}
               transition={{ duration: 5, repeat: Infinity, delay: 1 }}
               className="glass-stat absolute bottom-[20%] left-[-5%] p-6"
             >
                <div className="text-white font-black text-2xl">120+</div>
                <div className="text-label text-[#94a3b8]">Tournaments</div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR (Light) */}
      <section className="bg-[#f8fafc] py-20 border-t-4 border-[#2563eb]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col md:flex-row items-center gap-6">
                <div className="card-icon-box blue">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-center md:text-left">
                  <div className="text-[44px] font-black text-[#0f172a] leading-none mb-1 tracking-[-0.04em]">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-label text-[#94a3b8]">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (White) */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeading 
            label="The UCA Advantage" 
            title="Why Choose One of Us"
            description="High-performance training in a modern environment designed for serious players." 
          />
          <div className="grid md:grid-cols-4 gap-8 mt-24">
            {features.map((f, i) => (
              <ScrollReveal key={f.id} delay={i * 0.08}>
                <div className="card-pro h-full group">
                  <div className={cn("card-icon-box mb-8 group-hover:scale-110", f.color)}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-h3 text-[#0f172a] mb-4">{f.title}</h3>
                  <p className="text-[#475569] text-[15px] leading-[1.7]">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM SECTION (Light Grey) */}
      <section className="py-32 bg-[#f8fafc]">
        <div className="container mx-auto px-6">
          <SectionHeading label="Your Path" title="Tailored Learning Paths" />
          <div className="grid md:grid-cols-3 gap-10 mt-24">
            {levels.map((level, i) => (
              <ScrollReveal key={level.id} delay={i * 0.08}>
                <div
                  className="card-pro h-full border-l-[3px]"
                  style={{ borderLeftColor: level.color }}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-10",
                    i === 0 ? "bg-[#eff6ff]" : i === 1 ? "bg-[#f0f9ff]" : "bg-[#fffbeb]"
                  )}>{level.icon}</div>
                  <h3 className="text-[22px] font-bold text-[#0f172a] mb-6">{level.title}</h3>
                  <p className="text-[#475569] mb-10 leading-[1.7]">{level.desc}</p>
                  <ul className="space-y-4">
                    {level.points.map((p, idx) => (
                      <li key={idx} className="flex items-center text-[15px] text-[#475569]">
                        <div className="h-1.5 w-1.5 rounded-full mr-4" style={{ backgroundColor: level.color }} /> {p}
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
