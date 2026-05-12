import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Trophy, Target, Brain, PlayCircle, CheckCircle2, Zap, Camera, ArrowRight
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
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
  { value: '2,400+', label: 'Students Trained' },
  { value: '150+',   label: 'Tournament Wins' },
  { value: '12',     label: 'Expert Coaches' },
  { value: '8+',     label: 'Years of Excellence' },
];

const features = [
  { id: "f1", icon: Target, title: "Tactical Precision", desc: "Master pattern recognition drills curated by International Masters.", color: "blue", highlight: "Accuracy" },
  { id: "f2", icon: Zap, title: "Blitz Mastery", desc: "Specialized speed chess clinics to sharpen clock management.", color: "sky", highlight: "Speed" },
  { id: "f3", icon: Trophy, title: "Elite Tournaments", desc: "Exclusive access to UCA Rated Opens with significant prize pools.", color: "sky", highlight: "Success" },
  { id: "f4", icon: Brain, title: "Strategic Depth", desc: "Learn psychological resilience and game theory beyond the moves.", color: "blue", highlight: "Focus" },
];

const levels = [
  { id: "l1", icon: "♟", title: "Novice Pawn", desc: "For those picking up the pieces for the first time.", points: ["Piece coordination", "Basic Checkmate patterns"], bg: "bg-sky-500/20" },
  { id: "l2", icon: "♞", title: "Intermediate Knight", desc: "Develop complex maneuvering and positional play.", points: ["Middlegame Strategy", "Endgame Fundamentals"], bg: "bg-blue-500/20" },
  { id: "l3", icon: "♚", title: "Elite King", desc: "High-intensity training for competitive tournament players.", points: ["Grandmaster Analysis", "Psychological Prep"], bg: "bg-blue-600/20" },
];

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
    <div className="min-h-screen bg-white selection:bg-blue-600/30 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-[#070F1C] min-h-[560px] flex items-center overflow-hidden">
        {/* Chess pattern texture */}
        <div className="absolute inset-0 opacity-[0.035]"
             style={{
               backgroundImage: `linear-gradient(45deg,#fff 25%,transparent 25%),
                                 linear-gradient(-45deg,#fff 25%,transparent 25%),
                                 linear-gradient(45deg,transparent 75%,#fff 75%),
                                 linear-gradient(-45deg,transparent 75%,#fff 75%)`,
               backgroundSize: '32px 32px',
               backgroundPosition: '0 0,0 16px,16px -16px,-16px 0'
             }} />

        {/* Glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px]
                        bg-blue-600/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        w-full pt-24 sm:pt-28 pb-16 sm:pb-20">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">

            {/* Eyebrow */}
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 mb-5
                            bg-blue-500/15 border border-blue-500/25 rounded-full
                            px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">
                India's Premier Chess Academy
              </span>
            </motion.div>

            {/* H1 — use Display scale */}
            <motion.h1 variants={fadeLeft} className="text-4xl sm:text-5xl font-black text-white leading-[1.1]
                           tracking-tight mb-4">
              Where Strategy<br />
              Meets <span className="text-blue-400">Mastery.</span>
            </motion.h1>

            {/* Subtitle — concise, max 2 lines */}
            <motion.p variants={fadeLeft} className="text-base sm:text-lg text-white/60 leading-relaxed mb-8 max-w-xl">
              Grandmaster-led training programs for all ages.
              Build discipline, think deeper, win more.
            </motion.p>

            {/* CTA row */}
            <motion.div variants={scaleIn} className="flex flex-wrap gap-3">
              <a href="/tournaments"
                 className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500
                            text-white font-semibold text-sm px-5 py-3 rounded-xl
                            transition-colors duration-150">
                View Tournaments
                <ArrowRight className="size-4" />
              </a>
              <button
                 onClick={() => setIsDemoModalOpen(true)}
                 className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20
                            text-white font-medium text-sm px-5 py-3 rounded-xl
                            border border-white/20 transition-colors duration-150">
                Book Free Demo
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-20
                        bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* STATS BAR */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center py-6 px-4">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-slate-400 text-center uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-14 sm:py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.15em] mb-2">
              Why Unique Chess Academy?
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              The Strategic Advantage.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={f.id} delay={i * 0.1}>
                <div className="p-8 rounded-[2rem] border border-slate-200 bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group h-full flex flex-col cursor-pointer">
                  <div className={cn("inline-flex p-4 rounded-2xl mb-6 transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-sm w-fit", f.color === 'sky' ? 'bg-sky-100 text-sky-600' : 'bg-blue-100 text-blue-600')}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">{f.highlight}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 leading-snug">{f.title}</h3>
                  <p className="text-sm font-normal text-slate-500 leading-relaxed max-w-xl flex-grow">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY ARENA */}
      <section className="py-14 sm:py-16 bg-[#070F1C] overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex items-center gap-4">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-[0.15em]">
            The Arena Gallery
          </p>
          <div className="h-px flex-grow bg-white/10" />
          <Camera className="text-blue-500 h-4 w-4" />
        </div>

        <div className="relative flex">
          <div ref={marqueeRef} className="flex gap-6 whitespace-nowrap">
            {[...galleryImages, ...galleryImages].map((src, idx) => (
              <div key={idx} className="w-[280px] h-[380px] sm:w-[400px] sm:h-[500px] shrink-0 relative group">
                <div className="w-full h-full bg-slate-900 rounded-[2rem] overflow-hidden border border-white/10">
                  <img src={src} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" alt="Chess Match" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Academy Spotlight</p>
                    <p className="font-bold text-xl tracking-tight">Tournament Hall</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM SECTION */}
      <section className="py-14 sm:py-16 bg-[#070F1C] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-10">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.15em] mb-2">
              Academy Path
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Structured for Growth.
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
            {levels.map((level, i) => (
              <ScrollReveal key={level.id} delay={i * 0.1}>
                <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 h-full flex flex-col group hover:bg-white transition-all duration-500 hover:-translate-y-1 cursor-pointer">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 transition-transform group-hover:-translate-y-1 shadow-xl", level.bg)}>
                    {level.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-slate-950 mb-4 transition-colors tracking-tight">{level.title}</h3>
                  <p className="text-sm font-normal text-slate-300 group-hover:text-slate-600 mb-8 flex-grow leading-relaxed transition-colors">{level.desc}</p>
                  
                  <div className="space-y-4">
                    {level.points.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-slate-200 group-hover:text-slate-800 transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-medium tracking-tight">{p}</span>
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
