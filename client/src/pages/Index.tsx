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

const galleryImages = [
  "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=1200",
  "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=1200",
  "https://images.unsplash.com/photo-1529697210530-8c4bb1358ce5?q=80&w=1200",
  "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?q=80&w=1200",
  "https://images.unsplash.com/photo-1560174038-da43ac74f01b?q=80&w=1200",
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200",
];

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
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!marqueeRef.current) return;
      gsap.to(marqueeRef.current, {
        x: "-50%",
        duration: 35,
        repeat: -1,
        ease: "none",
      });
    }, marqueeRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION - Responsive Fixes */}
      <section className="relative bg-[#020617] overflow-hidden">
        <SparkleCanvas density="low" />
        
        <div className="container mx-auto px-6 z-10 pt-28 pb-40 md:pt-40 md:pb-56 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center lg:text-left">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8">
              <Star className="h-3 w-3 md:h-3.5 md:w-3.5 fill-current" /> India's Premier Chess Academy
            </motion.div>
            
            <motion.div variants={fadeLeft}>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-white mb-6 md:mb-8 leading-[0.95] tracking-tighter">
                Strategic <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-200 to-orange-500">Might.</span>
              </h1>
            </motion.div>

            <motion.p variants={fadeLeft} className="text-slate-300 text-base md:text-xl mb-8 md:mb-12 max-w-[540px] mx-auto lg:mx-0 leading-relaxed font-medium">
              Join an elite community where every move is calculated for victory. We build champions through grandmaster-led logic.
            </motion.p>

            <motion.div variants={scaleIn} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={() => setIsDemoModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-500 text-white font-black px-8 md:px-12 h-14 md:h-16 rounded-xl md:rounded-2xl group transition-all active:scale-95 shadow-2xl shadow-orange-900/40 w-full sm:w-auto"
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

        {/* STATS DOCK - Re-engineered for Mobile */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#0f172a]/90 backdrop-blur-xl border-x border-t border-white/10 rounded-t-2xl md:rounded-t-[3rem] overflow-hidden">
              {stats.map((stat, i) => (
                <div 
                  key={stat.id} 
                  className={cn(
                    "flex flex-col items-center justify-center py-6 md:py-12 px-2 text-center border-white/10",
                    i % 2 === 0 && "border-r", // Mobile vertical divider
                    i < 2 && "border-b md:border-b-0", // Mobile horizontal divider
                    i === 2 && "md:border-r" // Desktop intermediate divider
                  )}
                >
                  <div className="text-2xl sm:text-4xl md:text-6xl font-black text-white mb-1 md:mb-2 tabular-nums tracking-tighter">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-orange-400 font-black tracking-[0.15em] md:tracking-[0.25em] text-[8px] md:text-[10px] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 md:py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-black uppercase tracking-widest mb-6">
               <Trophy className="h-3.5 w-3.5" /> WHY UNIQUE CHESS ACADEMY?
             </div>
             <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 md:mb-8 leading-tight">
               Strategic <span className="text-orange-600 italic">Advantage</span>
             </h2>
             <p className="text-slate-500 max-w-2xl text-base md:text-lg font-medium leading-relaxed">
               We combine traditional wisdom with modern engine analysis to sharpen your intuition and tactical awareness.
             </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((f, i) => (
              <ScrollReveal key={f.id} delay={i * 0.1}>
                <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-200 bg-white hover:border-orange-200 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500 group h-full flex flex-col">
                  <div className={cn("inline-flex p-4 md:p-5 rounded-2xl md:rounded-3xl mb-6 md:mb-8 transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-sm w-fit", f.color === 'gold' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600')}>
                    <f.icon className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                  <div className="text-[10px] md:text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 md:mb-4">{f.highlight}</div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium flex-grow">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-20 md:py-28 bg-[#020617] overflow-hidden border-y border-white/5">
        <div className="flex items-center gap-4 md:gap-6 px-6 md:px-10 mb-12 md:mb-16">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-orange-500 animate-ping rounded-full" />
          <span className="text-white font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs">The Arena Gallery</span>
          <div className="h-[1px] flex-grow bg-white/20" />
          <Camera className="text-orange-500 h-4 w-4 md:h-5 md:w-5" />
        </div>

        <div className="relative flex">
          <div ref={marqueeRef} className="flex gap-4 md:gap-8 whitespace-nowrap">
            {[...galleryImages, ...galleryImages].map((src, idx) => (
              <div key={idx} className="w-[240px] h-[320px] sm:w-[450px] sm:h-[550px] shrink-0 relative group">
                <div className="absolute inset-0 bg-orange-600 translate-x-1 translate-y-1 rounded-2xl md:rounded-[2.5rem] -z-10 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500" />
                <div className="w-full h-full bg-slate-900 rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-800">
                  <img src={src} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" alt="Chess Match" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
                    <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-orange-400 mb-1">Academy Spotlights</p>
                    <p className="font-bold text-lg md:text-2xl tracking-tight">Tournament Hall #{idx % 4 + 1}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM SECTION */}
      <section className="py-20 md:py-32 bg-[#020617] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-16 md:mb-24 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-6">
              Academy Path
            </div>
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 md:mb-8 tracking-tighter">Structured for Growth.</h2>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium">Precision-engineered for competitive success.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 md:gap-10">
            {levels.map((level, i) => (
              <ScrollReveal key={level.id} delay={i * 0.1}>
                <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border border-white/10 h-full flex flex-col group hover:bg-white transition-all duration-700">
                  <div className={cn("w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-3xl md:text-4xl mb-8 md:mb-10 transition-transform group-hover:-translate-y-2 shadow-xl", level.bg)}>
                    {level.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-slate-950 mb-4 md:mb-6 transition-colors tracking-tight">{level.title}</h3>
                  <p className="text-slate-400 group-hover:text-slate-600 mb-8 md:mb-10 flex-grow text-sm md:text-base leading-relaxed font-medium transition-colors">{level.desc}</p>
                  
                  <div className="space-y-4 md:space-y-6">
                    {level.points.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-slate-300 group-hover:text-slate-800 transition-colors">
                        <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <span className="text-sm md:text-[15px] font-bold tracking-tight">{p}</span>
                      </div>
                    ))}
                  </div>
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
