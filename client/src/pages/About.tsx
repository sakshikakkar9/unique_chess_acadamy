import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAStrip from "@/components/shared/CTAStrip";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import trainingImg from "@/assets/academy-training.jpg";
import { Target, Eye, Shield, Award, Users, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  { icon: Target, title: "Precision", text: "Every lesson is structured for measurable progress." },
  { icon: Shield, title: "Trust", text: "Transparent methods and proven results parents can rely on." },
  { icon: Award, title: "Excellence", text: "We don't just teach chess — we build champions." },
  { icon: Users, title: "Community", text: "A supportive environment where players grow together." },
  { icon: Lightbulb, title: "Innovation", text: "Modern techniques blended with classical chess wisdom." },
  { icon: Eye, title: "Vision", text: "Developing strategic thinkers who excel beyond the board." },
];

const coaches = [
  { name: "GM Vikram Iyer", title: "Head Coach", elo: "2450 ELO", specialty: "Opening Theory", bio: "Former National Champion with 15+ years of elite coaching experience." },
  { name: "IM Ananya Desai", title: "Senior Coach", elo: "2280 ELO", specialty: "Endgame Strategy", bio: "Expert in technical endgames and psychological match preparation." },
  { name: "FM Rohan Patel", title: "Youth Coach", elo: "2200 ELO", specialty: "Tactical Training", bio: "Specializes in identifying tactical patterns and calculation speed." },
  { name: "WIM Kavya Nair", title: "Junior Coach", elo: "2150 ELO", specialty: "Beginner Development", bio: "Dedicated to building strong foundations for our youngest prodigies." },
];

const ABOUT_HERO_BG = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2000&auto=format&fit=crop";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-[#cbd5e1] selection:bg-sky-500/30 overflow-hidden relative">
      <SparkleCanvas />
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-gold mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Sparkles className="h-3 w-3 text-[#f59e0b]" />
                <span className="accent-label text-[#f59e0b] font-black">Our Legacy</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tight leading-[1.05]">
                India's Premier <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9]">Chess Ecosystem</span>
              </h1>
              <p className="text-[#94a3b8] text-xl leading-relaxed mb-10">
                Founded with a singular mission — to make world-class chess education accessible to every aspiring player across the nation.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-black font-black rounded-full px-10 h-16 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-all duration-300 border-none">
                Explore Our Journey
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="hidden lg:block h-[700px]">
            <div
              className="w-full h-full object-cover rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              style={{ clipPath: 'polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
            >
              <img src={ABOUT_HERO_BG} alt="Chess Academy Excellence" className="w-full h-full object-cover" />
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* STORY SECTION */}
      <section className="py-32 bg-[#0d1b2e] relative z-10 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal direction="left">
              <div className="relative group">
                <div className="absolute -inset-4 bg-[#3b82f6]/20 rounded-[2.5rem] blur-2xl group-hover:bg-[#3b82f6]/30 transition-all duration-500" />
                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                  <img src={trainingImg} alt="Academy Training" className="w-full h-auto transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute -bottom-8 -right-8 glass-card p-10 shadow-2xl border-[#3b82f6]/30">
                  <p className="text-5xl font-black text-[#38bdf8] glow-text-blue leading-none">10+</p>
                  <p className="accent-label text-[#94a3b8] mt-2 font-black">Years of Excellence</p>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-blue mb-6">
                <span className="accent-label text-[#38bdf8] font-black">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tight leading-[1.1]">A Decade of <br />Strategic Mastery</h2>
              <div className="space-y-8 text-[#94a3b8] text-lg leading-relaxed">
                <p>Unique Chess Academy was founded in 2016 with a vision to create a world-class chess training ecosystem in India. What started as a small coaching center has grown into one of the country's most respected institutions.</p>
                <p>Our approach combines rigorous analytical training with the joy of competition. We believe every student has the potential for greatness — they just need the right guidance and structure.</p>
                <div className="grid grid-cols-2 gap-12 pt-6">
                  <div>
                    <p className="text-4xl font-black text-white">5,000+</p>
                    <p className="accent-label text-[#38bdf8] mt-2 font-black">Students Trained</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-white">50+</p>
                    <p className="accent-label text-[#38bdf8] mt-2 font-black">National Champions</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* VALUES GRID */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <SectionHeading label="Why Choose Us" title="What Sets Us Apart" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="glass-card-blue p-10 group transition-smooth hover:translate-y-[-8px] hover:glow-blue">
                  <v.icon className="h-10 w-10 text-[#38bdf8] mb-8 transition-smooth group-hover:scale-110 group-hover:glow-text-blue" />
                  <h3 className="font-black text-xl mb-4 text-white uppercase tracking-tight">{v.title}</h3>
                  <p className="text-[#94a3b8] leading-relaxed">{v.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* COACHES SECTION */}
      <section className="py-32 bg-[#0d1b2e] relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6">
          <SectionHeading label="Our Faculty" title="Learn From Champions" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {coaches.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 0.1}>
                <div className="glass-card p-8 group transition-smooth hover:translate-y-[-8px] border-white/5">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9] mb-8 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-[#3b82f6]/20 transition-smooth group-hover:scale-110">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{c.name}</h3>
                  <div className="inline-flex px-3 py-1 rounded-full glass-card-gold mb-6 border-[#f59e0b]/30">
                    <span className="accent-label text-[#f59e0b] font-black">{c.elo}</span>
                  </div>
                  <p className="text-[#38bdf8] text-xs font-black uppercase tracking-widest mb-6">{c.title} • {c.specialty}</p>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">{c.bio}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTAStrip />
      <Footer />
    </div>
  );
}
