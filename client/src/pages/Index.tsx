import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Trophy, Star as StarIcon, BookOpen, Brain, Target, ArrowRight, PlayCircle, Sparkles
} from "lucide-react";
import heroImg from "@/assets/hero-chess.jpg";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import DemoModal from "@/features/demo/components/DemoModal";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { Button } from "@/components/ui/button";

// --- ADVANCED JS: INTERACTIVE CANVAS PARTICLES ---
// This handles the background animation without interfering with your app logic
const InteractiveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = "rgba(56, 189, 248, 0.35)"; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 16000);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.hypot(dx, dy);
          if (distance < 150) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize(); init(); animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70" />;
};

// --- CONSTANTS ---
const stats = [
  { id: "1", icon: Users, value: "5,000+", label: "Students" },
  { id: "2", icon: Trophy, value: "120+", label: "Tournaments" },
  { id: "3", icon: StarIcon, value: "50+", label: "Champions" },
  { id: "4", icon: BookOpen, value: "15+", label: "Coaches" },
];

const features = [
  { id: "f1", icon: Target, title: "Structured Learning", desc: "Step-by-step curriculum from beginner to advanced level." },
  { id: "f2", icon: Trophy, title: "Tournament Exposure", desc: "Regular competitions to test real-world performance." },
  { id: "f3", icon: Users, title: "Expert Coaches", desc: "Learn from experienced and ranked players." },
  { id: "f4", icon: Brain, title: "Cognitive Growth", desc: "Improve focus, memory, and decision-making." },
];

const levels = [
  { id: "l1", icon: "♟", title: "Beginner", desc: "Start your journey with strong fundamentals.", points: ["Rules & basics", "Simple tactics", "Opening ideas"] },
  { id: "l2", icon: "♜", title: "Intermediate", desc: "Build strategy and deeper understanding.", points: ["Middlegame planning", "Pattern recognition", "Better decisions"] },
  { id: "l3", icon: "♚", title: "Advanced", desc: "Train like a competitive player.", points: ["Endgame mastery", "Game analysis", "Tournament mindset"] },
];

export default function HomePage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // --- RESTORED LOGIC HOOKS ---
  // Ensure your backend server is running to avoid "Connection error" alerts
  const { tournaments } = useAdminTournaments();
  const { courses } = useAdminCourses();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 selection:bg-sky-500/30 overflow-hidden">
      
      {/* ANIMATION LAYER */}
      <InteractiveBackground />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Chess" className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a] to-[#0f172a]" />
        </div>

        <div className="relative container mx-auto px-6 z-10">
          <ScrollReveal>
            <div className="max-w-4xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-sm"
              >
                <Sparkles className="h-3 w-3 animate-pulse" /> India's Premier Chess Academy
              </motion.div>

              <h1 className="font-heading font-extrabold text-6xl md:text-8xl mb-8 leading-[1.05] tracking-tight text-white">
                Master the <span className="text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]">Board.</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-indigo-300">
                  Own the Game.
                </span>
              </h1>

              <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
                Professional coaching for the next generation of Grandmasters. 
                Combining logic with the fun of strategy to build future champions.
              </p>

              <div className="flex flex-wrap gap-6 mb-20">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-400 text-white px-10 rounded-2xl font-bold h-16 shadow-xl shadow-sky-900/20 transition-all hover:scale-105 active:scale-95">
                  Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button variant="outline" size="lg" onClick={() => setIsDemoModalOpen(true)} className="border-slate-700 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 px-10 rounded-2xl font-bold h-16 transition-all">
                  <PlayCircle className="mr-2 h-5 w-5" /> Free Demo
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="-mt-20 z-20 relative px-6">
        <div className="container mx-auto">
          <div className="bg-slate-800/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-2xl">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center md:text-left flex flex-col md:flex-row items-center gap-5 group">
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/20 group-hover:bg-sky-500 transition-all duration-300">
                  <stat.icon className="h-7 w-7 text-sky-400 group-hover:text-white" />
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-white tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <SectionHeading 
            label="The UCA Advantage" 
            title="Why Choose Us" 
            description="High-performance training in a modern environment designed for serious players." 
          />
          <div className="grid md:grid-cols-4 gap-8 mt-24">
            {features.map((f, i) => (
              <ScrollReveal key={f.id} delay={i * 0.1}>
                <div className="h-full bg-slate-800/20 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 transition-all hover:bg-sky-500/10 hover:border-sky-500/30 group shadow-lg">
                  <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-sky-500 transition-all duration-500">
                    <f.icon className="h-8 w-8 text-sky-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM SECTION */}
      <section className="py-32 bg-slate-900/50 border-y border-white/5 relative">
        <div className="container mx-auto px-6">
          <SectionHeading label="Your Path" title="Tailored Learning Paths" />
          <div className="grid md:grid-cols-3 gap-10 mt-24">
            {levels.map((level, i) => (
              <ScrollReveal key={level.id} delay={i * 0.1}>
                <div className="relative h-full bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 overflow-hidden hover:shadow-2xl hover:shadow-sky-500/10 transition-all">
                  <div className="text-6xl mb-10 drop-shadow-lg">{level.icon}</div>
                  <h3 className="font-extrabold text-3xl text-white mb-4 tracking-tight">{level.title}</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">{level.desc}</p>
                  <ul className="space-y-4">
                    {level.points.map((p, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-300 font-medium">
                        <div className="h-2 w-2 rounded-full bg-sky-500 mr-4 shadow-[0_0_8px_#0ea5e9]" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-32 pb-12 bg-[#020617] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-20 pb-20 border-b border-white/5">
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-white uppercase italic">
                Unique <span className="text-sky-500">Chess</span> Academy
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Shaping the future of Indian chess through methodology, discipline, and champion mentorship.
              </p>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Contact</h4>
              <div className="text-sm font-bold text-slate-400 space-y-4">
                <p>📍 Yamuna Nagar, Haryana</p>
                <p>📧 play@uniquechess.in</p>
              </div>
            </div>
          </div>
          <div className="mt-12 flex justify-between items-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            <p>© {new Date().getFullYear()} Unique Chess Academy</p>
            <p className="text-sky-500/40">Designed by Sakshi</p>
          </div>
        </div>
      </footer>

      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}