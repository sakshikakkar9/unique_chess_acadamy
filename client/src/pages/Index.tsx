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
  { id: "f3", icon: Trophy, title: "Elite Tournaments", desc: "Exclusive access to UCA Rated Opens with significant prize pools.", color: "sky", highlight: "Success" },
  { id: "f4", icon: Brain, title: "Strategic Depth", desc: "Beyond the moves—learn psychological resilience and game theory.", color: "blue", highlight: "Focus" },
];

const levels = [
  { id: "l1", icon: "♟", title: "Novice Pawn", desc: "For those picking up the pieces for the first time.", points: ["Piece coordination", "Basic Checkmate patterns", "Opening Principles"], bg: "bg-sky-500/20" },
  { id: "l2", icon: "♞", title: "Intermediate Knight", desc: "Develop complex maneuvering and positional play.", points: ["Middlegame Strategy", "Endgame Fundamentals", "Introduction to Theory"], bg: "bg-blue-500/20" },
  { id: "l3", icon: "♚", title: "Elite King", desc: "High-intensity training for competitive tournament players.", points: ["Grandmaster Analysis", "Psychological Prep", "Advanced Theory"], bg: "bg-blue-600/20" },
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
    <div className="min-h-screen bg-white selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION - RE-ENGINEERED FOR RESPONSIVENESS */}
      <section className="relative bg-[#020617] flex flex-col min-h-auto pt-24 pb-12 md:min-h-[400px] md:pt-28 md:pb-16 lg:min-h-[480px] lg:pt-32 lg:pb-20">
        <SparkleCanvas density="low" />
        
        {/* Container for Text and Image */}
        <div className="container mx-auto px-6 z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="text-left max-w-3xl">
            <motion.div variants={fadeIn} className="text-xs font-semibold tracking-widest uppercase border border-white/20 bg-white/10 rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-6 text-white">
              <Star className="h-3.5 w-3.5 fill-current" /> India's Premier Chess Academy
            </motion.div>
            
            <motion.div variants={fadeLeft}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4">
                Strategic <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-blue-600">Might.</span>
              </h1>
            </motion.div>

            <motion.p variants={fadeLeft} className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
              Join an elite community where every move is calculated for victory. We build champions through grandmaster-led logic.
            </motion.p>

            <motion.div variants={scaleIn}>
              <Button 
                size="lg" 
                onClick={() => setIsDemoModalOpen(true)}
                className="bg-sky-600 hover:bg-sky-500 text-white font-black px-12 h-16 rounded-2xl group transition-all active:scale-95 shadow-2xl shadow-sky-900/40 w-full sm:w-auto"
              >
                BOOK A FREE DEMO <PlayCircle className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Desktop Only Image */}
          <motion.div variants={fadeIn} className="hidden lg:block relative">
             <img 
               src="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=800" 
               className="rounded-[3rem] opacity-60 grayscale-[0.2] border-2 border-white/5 shadow-2xl transition-all duration-1000"
               alt="Chess Board"
             />
          </motion.div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* STATS DOCK */}
      <section className="bg-white">
        <div className="container mx-auto px-4 md:px-6 -mt-12 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {stats.map((stat, i) => (
                <div key={stat.id} className={cn(
                  "flex flex-col items-center justify-center py-8 lg:py-12 px-4 text-center border-white/10",
                  i % 2 === 0 ? "border-r" : "",
                  i < 2 ? "border-b lg:border-b-0" : "",
                  i === 2 ? "lg:border-r" : ""
                )}>
                  <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tabular-nums tracking-tighter">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sky-400 font-black tracking-[0.2em] text-[9px] md:text-[10px] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-12 md:py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start text-left mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 border border-sky-100 text-[10px] font-black uppercase tracking-widest mb-2">
                <Trophy className="h-3.5 w-3.5" /> WHY UNIQUE CHESS ACADEMY?
              </div>
              <div className="w-12 h-1 bg-blue-600 rounded mb-8" />
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">
                Strategic <span className="text-sky-600 italic">Advantage</span>
              </h2>
              <p className="text-slate-500 max-w-2xl text-lg font-medium leading-relaxed">
                We combine traditional wisdom with modern engine analysis to sharpen your intuition and tactical awareness.
              </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <ScrollReveal key={f.id} delay={i * 0.1}>
                <div className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-200 bg-white hover:border-sky-200 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500 group h-full flex flex-col">
                  <div className={cn("inline-flex p-5 rounded-3xl mb-8 transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-sm w-fit", f.color === 'sky' ? 'bg-sky-100 text-sky-600' : 'bg-blue-100 text-blue-600')}>
                    <f.icon className="h-8 w-8" />
                  </div>
                  <div className="text-[11px] font-black text-sky-600 uppercase tracking-[0.2em] mb-4">{f.highlight}</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium flex-grow">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY ARENA */}
      <section className="py-12 md:py-16 bg-[#020617] overflow-hidden border-y border-white/5">
        <div className="flex items-center gap-6 px-4 sm:px-6 lg:px-8 mb-16">
          <div className="w-3 h-3 bg-sky-500 animate-ping rounded-full" />
          <span className="text-white font-black uppercase tracking-[0.4em] text-xs">The Arena Gallery</span>
          <div className="h-[1px] flex-grow bg-white/20" />
          <Camera className="text-sky-500 h-5 w-5" />
        </div>

        <div className="relative flex">
          <div ref={marqueeRef} className="flex gap-8 whitespace-nowrap">
            {[...galleryImages, ...galleryImages].map((src, idx) => (
              <div key={idx} className="w-[280px] h-[380px] sm:w-[450px] sm:h-[550px] shrink-0 relative group">
                <div className="absolute inset-0 bg-sky-600 translate-x-2 translate-y-2 rounded-2xl sm:rounded-[2.5rem] -z-10 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500" />
                <div className="w-full h-full bg-slate-900 rounded-2xl sm:rounded-[2.5rem] overflow-hidden border-2 border-slate-800">
                  <img src={src} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" alt="Chess Match" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <p className="text-[11px] font-black uppercase tracking-widest text-sky-400 mb-1">Academy Spotlights</p>
                    <p className="font-bold text-2xl tracking-tight">Tournament Hall #{idx % 4 + 1}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM SECTION */}
      <section className="py-12 md:py-16 bg-[#020617] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[11px] font-black uppercase tracking-widest mb-2">
              Academy Path
            </div>
            <div className="w-12 h-1 bg-blue-600 rounded mb-8" />
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">Structured for Growth.</h2>
            <p className="text-slate-300 text-xl leading-relaxed font-medium">Precision-engineered for competitive success.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-10">
            {levels.map((level, i) => (
              <ScrollReveal key={level.id} delay={i * 0.1}>
                <div className="bg-white/5 backdrop-blur-md rounded-[3rem] md:rounded-[3.5rem] p-10 md:p-12 border border-white/10 h-full flex flex-col group hover:bg-white transition-all duration-700 hover:scale-[1.02]">
                  <div className={cn("w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-3xl md:text-5xl mb-10 transition-transform group-hover:-translate-y-2 group-hover:rotate-6 shadow-xl", level.bg)}>
                    {level.icon}
                  </div>
                  <h3 className="text-3xl font-black text-white group-hover:text-slate-950 mb-6 transition-colors tracking-tight">{level.title}</h3>
                  <p className="text-slate-300 group-hover:text-slate-600 mb-10 flex-grow leading-relaxed font-medium transition-colors">{level.desc}</p>
                  
                  <div className="space-y-6">
                    {level.points.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-5 text-slate-200 group-hover:text-slate-800 transition-colors">
                        <div className="bg-sky-500/20 group-hover:bg-sky-100 p-1 rounded-full transition-colors">
                          <CheckCircle2 className="h-5 w-5 text-sky-500 flex-shrink-0" />
                        </div>
                        <span className="text-[15px] font-bold tracking-tight">{p}</span>
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
