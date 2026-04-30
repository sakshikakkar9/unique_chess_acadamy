import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAStrip from "@/components/shared/CTAStrip";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import trainingImg from "@/assets/academy-training.jpg";
import { Target, Eye, Shield, Award, Users, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeLeft, fadeRight, stagger } from "@/components/shared/motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const values = [
  { icon: Target, title: "Precision", text: "Every lesson is structured for measurable progress.", color: "blue" },
  { icon: Shield, title: "Trust", text: "Transparent methods and proven results parents can rely on.", color: "sky" },
  { icon: Award, title: "Excellence", text: "We don't just teach chess — we build champions.", color: "gold" },
  { icon: Users, title: "Community", text: "A supportive environment where players grow together.", color: "blue" },
  { icon: Lightbulb, title: "Innovation", text: "Modern techniques blended with classical chess wisdom.", color: "sky" },
  { icon: Eye, title: "Vision", text: "Developing strategic thinkers who excel beyond the board.", color: "gold" },
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
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION (Dark) */}
      <header className="relative min-h-[60vh] flex items-center bg-[#0f172a] pt-32 pb-20 overflow-hidden">
        <SparkleCanvas density="full" />
        <div
          className="absolute inset-0 z-0 opacity-[0.15]"
          style={{
            backgroundImage: `url(${ABOUT_HERO_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <ScrollReveal variants={fadeLeft}>
              <h1 className="text-h1 text-white mb-8 playfair">
                India's Premier <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9]">Chess Ecosystem</span>
              </h1>
              <p className="text-[#94a3b8] text-body-lg leading-relaxed mb-10 max-w-xl">
                Founded with a singular mission — to make world-class chess education accessible to every aspiring player across the nation.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </header>

      {/* STORY SECTION (White) */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal variants={fadeLeft}>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-[#e2e8f0]">
                  <img src={trainingImg} alt="Academy Training" className="w-full h-auto" />
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal variants={fadeRight}>
              <h2 className="text-h2 text-[#0f172a] mb-8">A Decade of <br />Strategic Mastery</h2>
              <div className="space-y-6 text-[#475569] text-lg leading-relaxed">
                <p>Unique Chess Academy was founded in 2016 with a vision to create a world-class chess training ecosystem in India. What started as a small coaching center has grown into one of the country's most respected institutions.</p>
                <p>Our approach combines rigorous analytical training with the joy of competition. We believe every student has the potential for greatness — they just need the right guidance and structure.</p>
                <div className="grid grid-cols-2 gap-12 pt-8">
                  <div>
                    <p className="text-[32px] font-black text-[#0f172a]">5,000+</p>
                    <p className="text-label text-[#94a3b8] mt-1">Students Trained</p>
                  </div>
                  <div>
                    <p className="text-[32px] font-black text-[#0f172a]">50+</p>
                    <p className="text-label text-[#94a3b8] mt-1">National Champions</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* MISSION & VISION (f8fafc) */}
      <section className="py-32 bg-[#f8fafc]">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10">
          <ScrollReveal variants={fadeLeft}>
            <div className="card-pro h-full">
              <div className="card-icon-box blue mb-6">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-h3 text-[#0f172a] mb-4">Our Mission</h3>
              <p className="text-[#475569] leading-relaxed">To nurture logical thinking and strategic brilliance through a structured, world-class chess curriculum accessible to all.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal variants={fadeRight}>
            <div className="card-pro h-full">
              <div className="card-icon-box sky mb-6">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-h3 text-[#0f172a] mb-4">Our Vision</h3>
              <p className="text-[#475569] leading-relaxed">To create a community of critical thinkers and champions who excel not only on the chessboard but also in life.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* VALUES GRID (White) */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeading label="Why Choose Us" title="What Sets Us Apart" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.08}>
                <div className="card-pro group hover:border-[#2563eb]/30">
                  <div className={cn("card-icon-box mb-8 group-hover:scale-110", v.color)}>
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-[20px] font-bold mb-4 text-[#0f172a] uppercase tracking-tight">{v.title}</h3>
                  <p className="text-[#475569] leading-relaxed">{v.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* COACHES SECTION (Dark) */}
      <section className="py-32 bg-[#0f172a] relative overflow-hidden">
        <SparkleCanvas density="subtle" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading label="Our Faculty" title="Learn From Champions" dark />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {coaches.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 0.08}>
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl group hover:translate-y-[-5px] transition-smooth">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] mb-8 flex items-center justify-center text-2xl font-black text-white group-hover:scale-110 transition-smooth">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="text-[20px] font-bold text-white mb-2 uppercase tracking-tight">{c.name}</h3>
                  <p className="text-[#38bdf8] text-[11px] font-bold uppercase tracking-widest mb-4">{c.title} • {c.specialty}</p>
                  <p className="text-[#94a3b8] text-sm leading-relaxed mb-6">{c.bio}</p>
                  <div className="inline-flex px-3 py-1 rounded-full bg-[#fffbeb] border border-[#d97706]/20">
                    <span className="text-[11px] font-bold text-[#92400e] uppercase tracking-wider">{c.elo}</span>
                  </div>
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
