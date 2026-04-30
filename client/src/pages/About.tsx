import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import { Target, Shield, Award, Users, TrendingUp, Trophy, ChevronRight, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeLeft, fadeRight, stagger, scaleIn, fadeIn } from "@/components/shared/motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const values = [
  { icon: Target, title: "Algorithmic Precision", text: "We teach verifiable logical systems, eliminating tactical blind spots through grandmaster-verified drills.", color: "blue" },
  { icon: Shield, title: "Competitive Integrity", text: "Cultivating the 'Grandmaster Mindset'—absolute discipline, psychological resilience, and sportsmanship.", color: "sky" },
  { icon: Award, title: "Elite Pedigree", text: "With 50+ National titles, our methodology is proven at the highest levels of competitive play.", color: "gold" },
  { icon: Users, title: "The Syndicate", text: "An exclusive global network of elite players for high-stakes sparring and collaborative growth.", color: "blue" },
  { icon: BrainCircuit, title: "Neural Agility", text: "Blending human intuition with cutting-edge engine analysis to sharpen split-second decision making.", color: "sky" },
  { icon: Trophy, title: "Absolute Dominance", text: "We prepare students to command the board and lead the leaderboards, not just participate.", color: "gold" },
];

const coaches = [
  { name: "GM Vikram Iyer", title: "Head of Pedagogy", elo: "2450", specialty: "Theory", bio: "Architect of the UCA Masterclass curriculum with 20+ years of Grandmaster circuit experience." },
  { name: "IM Ananya Desai", title: "Technical Lead", elo: "2280", specialty: "Endgames", bio: "Renowned technical specialist famous for converting microscopic advantages into clinical victories." },
  { name: "FM Rohan Patel", title: "Tactical Head", elo: "2200", specialty: "Calculation", bio: "Specialist in speed-calculation and visual-spatial dominance. The master of tactical chaos." },
  { name: "WIM Kavya Nair", title: "Elite Mentor", elo: "2150", specialty: "Foundations", bio: "The strategic force behind our junior prodigy program, shaping the next generation of masters." },
];

const ABOUT_HERO_BG = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2000&auto=format&fit=crop";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-blue-600/30 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION - CINEMATIC DARK */}
      <header className="relative min-h-[90vh] flex items-center bg-[#020617] pt-32 pb-20 overflow-hidden">
        <SparkleCanvas density="low" />
        <div
          className="absolute inset-0 z-0 opacity-40 scale-110"
          style={{
            backgroundImage: `url(${ABOUT_HERO_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) saturate(0.5)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617] to-[#f8fafc]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Trophy className="h-3.5 w-3.5" /> The Grandmaster Standard
              </motion.div>
              
              <motion.h1 variants={fadeLeft} className="text-6xl md:text-9xl font-extrabold text-white mb-10 leading-[0.85] tracking-tighter">
                Architecting <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-200 to-blue-600">Pure Intellect.</span>
              </motion.h1>

              <motion.p variants={fadeLeft} className="text-slate-300 text-xl md:text-2xl leading-relaxed mb-14 max-w-3xl font-medium italic">
                Unique Chess Academy is India's most elite strategic laboratory, where grandmaster theory meets modern computational logic.
              </motion.p>
              
              <motion.div variants={scaleIn}>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-12 h-16 rounded-2xl group transition-all active:scale-95 shadow-2xl shadow-blue-900/40">
                  EXPLORE THE METHOD <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* STORY SECTION - CLEAN TRANSITION */}
      <section className="py-32 bg-gradient-to-b from-[#f8fafc] to-[#e6f0f7] relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-20 items-center">
            <ScrollReveal variants={fadeLeft}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest mb-6">
                 <Trophy className="h-3.5 w-3.5" /> Established 2016
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-10 tracking-tighter leading-[0.95]">
                Beyond <br /><span className="text-blue-600 italic">Memorization.</span>
              </h2>
              <div className="space-y-8 text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
                <p>Since 2016, we have pioneered a shift from rote learning to deep architectural understanding. We view the chessboard as the ultimate gym for cognitive development.</p>
                <p>Our ecosystem is precision-built for those who seek to master positional pressure and tactical explosiveness.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal variants={scaleIn}>
              <div className="grid grid-cols-1 gap-8">
                <div className="p-10 rounded-[3rem] bg-white border border-blue-100 shadow-[0_25px_80px_rgba(37,99,235,0.05)] backdrop-blur-md">
                  <p className="text-6xl font-black text-slate-900 tracking-tighter">5K+</p>
                  <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] mt-3">Elite Alumni Worldwide</p>
                </div>
                <div className="p-10 rounded-[3rem] bg-white border border-blue-100 shadow-[0_25px_80px_rgba(37,99,235,0.05)] backdrop-blur-md">
                  <p className="text-6xl font-black text-slate-900 tracking-tighter">98%</p>
                  <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] mt-3">Elo Growth Rate</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* MISSION & VISION - REFINED TYPOGRAPHY */}
      <section className="py-24 bg-[#f1f5f9] border-y border-slate-200">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-8">
          <ScrollReveal variants={fadeLeft}>
            <div className="bg-white/70 backdrop-blur-xl border border-white p-10 lg:p-12 rounded-[3rem] group hover:bg-white transition-all duration-500 shadow-xl shadow-blue-900/5 h-full text-left">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-5 tracking-tight">The Mission</h3>
              <p className="text-slate-500 text-base lg:text-lg leading-relaxed font-medium max-w-md">
                To democratize elite-level chess education through scientific, measurable methodologies that guarantee tactical and strategic mastery.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal variants={fadeRight}>
            <div className="bg-white/70 backdrop-blur-xl border border-white p-10 lg:p-12 rounded-[3rem] group hover:bg-white transition-all duration-500 shadow-xl shadow-blue-900/5 h-full text-left">
              <div className="w-14 h-14 bg-cyan-500 text-white rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-5 tracking-tight">The Vision</h3>
              <p className="text-slate-500 text-base lg:text-lg leading-relaxed font-medium max-w-md">
                To be the global gold-standard for intellectual training, forging strategic leaders who dominate every industry.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* VALUES GRID */}
      <section className="py-32 bg-[#f8fafc]">
        <div className="container mx-auto px-6">
          <div className="mb-24 text-center">
             <SectionHeading label="The UCA Edge" title="Defining the Method" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="group p-12 rounded-[3.5rem] bg-white border border-blue-50 hover:border-blue-200 hover:shadow-[0_30px_80px_rgba(0,0,0,0.06)] transition-all duration-500 h-full flex flex-col items-start text-left">
                  <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center mb-12 transition-all group-hover:rotate-6 group-hover:scale-110", 
                    v.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                    v.color === 'sky' ? 'bg-cyan-50 text-cyan-600' : 'bg-orange-50 text-orange-600')}>
                    <v.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black mb-6 text-slate-900 tracking-tight leading-snug">{v.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium flex-grow text-base">{v.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* COACHES SECTION */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading label="The Faculty" title="Elite Tactical Minds" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
            {coaches.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 0.1}>
                <div className="bg-[#f8fafc] border border-blue-100 p-10 rounded-[3rem] group hover:bg-white hover:border-blue-300 transition-all duration-700 h-full flex flex-col items-start text-left hover:shadow-xl hover:shadow-blue-900/5">
                  <div className="flex justify-between items-start mb-12 w-full">
                    <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex items-center justify-center text-3xl font-extrabold text-white group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-blue-600/30">
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
                      <span className="text-[10px] font-black text-blue-600 tracking-tighter uppercase tabular-nums">{c.elo} ELO</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{c.name}</h3>
                  <p className="text-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-10 pb-4 border-b border-blue-100 w-fit">{c.title}</p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-10 italic font-medium flex-grow">"{c.bio}"</p>
                  <div className="pt-6 border-t border-slate-200 mt-auto w-full">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialty: {c.specialty}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}