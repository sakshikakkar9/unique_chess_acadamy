import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Trophy, Target, Brain, PlayCircle, CheckCircle2, Zap, Camera, Star
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fadeLeft, stagger, scaleIn, fadeIn } from "@/components/shared/motion";
import { cn } from "@/lib/utils";
import DemoModal from "@/features/demo/components/DemoModal";

const stats = [
  { id: "1", value: 5000, label: "ACTIVE MINDS", suffix: "+" },
  { id: "2", value: 120, label: "STATE TITLES", suffix: "+" },
  { id: "3", value: 50, label: "FIDE RATED", suffix: "+" },
  { id: "4", value: 15, label: "MASTERS", suffix: "" },
];

const features = [
  { id: "f1", icon: Target, title: "Tactical Precision", desc: "Master 5,000+ pattern recognition drills curated by International Masters.", color: "blue", highlight: "Accuracy" },
  { id: "f2", icon: Zap, title: "Blitz Mastery", desc: "Specialized speed chess clinics to sharpen clock management.", color: "sky", highlight: "Speed" },
  { id: "f3", icon: Trophy, title: "Elite Tournaments", desc: "Exclusive access to UCA Rated Opens with significant prize pools.", color: "gold", highlight: "Success" },
  { id: "f4", icon: Brain, title: "Strategic Depth", desc: "Beyond the moves—learn psychological resilience and game theory.", color: "blue", highlight: "Focus" },
];

const levels = [
  { id: "l1", icon: "♟", title: "Novice Pawn", desc: "For those picking up the pieces for the first time.", points: ["Piece coordination", "Basic Checkmate patterns", "Opening Principles"], bg: "bg-orange-500/20" },
  { id: "l2", icon: "♞", title: "Intermediate Knight", desc: "Develop complex maneuvering and positional play.", points: ["Middlegame Strategy", "Endgame Fundamentals", "Introduction to Theory"], bg: "bg-blue-500/20" },
  { id: "l3", icon: "♚", title: "Elite King", desc: "High-intensity training for competitive tournament players.", points: ["Grandmaster Analysis", "Psychological Prep", "Advanced Theory"], bg: "bg-amber-500/20" },
];

const CountUp = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsInView(true); }, { threshold: 0.1 });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = duration / frameRate;
    const increment = end / totalFrames;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); } 
      else { setCount(Math.floor(start)); }
    }, frameRate);
    return () => clearInterval(timer);
  }, [end, isInView]);

  return <div ref={setRef} className="tabular-nums">{count.toLocaleString()}{suffix}</div>;
};

export default function HomePage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION - Fixed Overlap Issues */}
      <section className="relative bg-[#020617] flex flex-col min-h-screen lg:block">
        <SparkleCanvas density="low" />
        
        {/* Main Content Area */}
        <div className="container mx-auto px-6 z-10 pt-32 pb-20 lg:pt-48 lg:pb-64 grid lg:grid-cols-2 gap-16 items-center flex-grow">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center lg:text-left">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-8">
              <Star className="h-3.5 w-3.5 fill-current" /> India's Premier Chess Academy
            </motion.div>
            
            <motion.div variants={fadeLeft}>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-white mb-8 leading-[0.9] tracking-tighter">
                Strategic <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-200 to-orange-500">Might.</span>
              </h1>
            </motion.div>

            <motion.p variants={fadeLeft} className="text-slate-300 text-lg md:text-xl mb-12 max-w-[540px] mx-auto lg:mx-0 leading-relaxed font-medium">
              Join an elite community where every move is calculated for victory. We build champions through grandmaster-led logic.
            </motion.p>

            <motion.div variants={scaleIn} className="relative z-20">
              <Button 
                size="lg" 
                onClick={() => setIsDemoModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-500 text-white font-black px-12 h-16 rounded-2xl group transition-all active:scale-95 shadow-2xl shadow-orange-900/40 w-full sm:w-auto"
              >
                BOOK A FREE DEMO <PlayCircle className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeIn} className="hidden lg:block relative">
             <img 
               src="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=800" 
               className="rounded-[3rem] opacity-60 border-2 border-white/5 shadow-2xl"
               alt="Chess Board"
             />
          </motion.div>
        </div>

        {/* STATS DOCK - Fixed Positioning */}
        <div className="w-full px-6 lg:absolute lg:bottom-0 lg:left-0 z-30">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-b-none lg:rounded-t-[3rem] overflow-hidden shadow-2xl">
              {stats.map((stat, i) => (
                <div key={stat.id} className={cn(
                  "flex flex-col items-center justify-center py-8 lg:py-12 px-4 text-center border-white/10",
                  i % 2 === 0 ? "border-r" : "", // Vertical divider on mobile
                  i < 2 ? "border-b lg:border-b-0" : "", // Horizontal divider on mobile
                  i === 2 ? "lg:border-r" : "" // Standard desktop divider
                )}>
                  <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tabular-nums tracking-tighter">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-orange-400 font-black tracking-[0.2em] text-[9px] md:text-[10px] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REMAINDER OF SECTIONS (Features, Curriculum, etc.) */}
      <section className="py-32 bg-white">
          {/* ... existing features code ... */}
      </section>

      <Footer />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
