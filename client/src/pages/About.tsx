import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAStrip from "@/components/shared/CTAStrip";
import trainingImg from "@/assets/academy-training.jpg";
import { Target, Eye, Shield, Award, Users, Lightbulb, Sparkles, ChevronRight } from "lucide-react";
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

// Professional Hero Background (Chess related)
const ABOUT_HERO_BG = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2000&auto=format&fit=crop";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* NEW PROFESSIONAL HERO SECTION */}
      <header className="relative h-[60vh] min-h-[500px] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ABOUT_HERO_BG} 
            alt="Chess Academy Excellence" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-3xl">
            <ScrollReveal direction="left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                <Sparkles className="h-3 w-3" /> Our Legacy
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white font-heading mb-6 tracking-tight leading-[1.1]">
                India's Premier <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Chess Ecosystem</span>
              </h1>
              <p className="text-blue-100/80 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
                Founded with a singular mission — to make world-class chess education accessible to every aspiring player across the nation.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 font-bold">
                  Explore Our Journey
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </header>

      {/* The Story Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl" />
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                  <img src={trainingImg} alt="Academy Training" className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white p-8 rounded-2xl shadow-xl hidden md:block">
                  <p className="text-4xl font-black text-blue-400">10+</p>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Years of Excellence</p>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">A Decade of <br />Strategic Mastery</h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>Unique Chess Academy was founded in 2016 with a vision to create a world-class chess training ecosystem in India. What started as a small coaching center has grown into one of the country's most respected institutions.</p>
                <p>Our approach combines rigorous analytical training with the joy of competition. We believe every student has the potential for greatness — they just need the right guidance and structure.</p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">5,000+</p>
                    <p className="text-sm text-slate-500">Students Trained</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">50+</p>
                    <p className="text-sm text-slate-500">National Champions</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Modern Card Design */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="group bg-white border border-slate-200 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Our Mission</h3>
                <p className="text-slate-500 text-lg leading-relaxed">To provide structured, world-class chess education that develops analytical thinking, strategic decision-making, and competitive excellence.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="group bg-white border border-slate-200 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="h-14 w-14 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                  <Eye className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Our Vision</h3>
                <p className="text-slate-500 text-lg leading-relaxed">To become India's leading chess academy — nurturing the next generation of grandmasters while making chess accessible to every aspiring player.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <SectionHeading label="Why Choose Us" title="What Sets Us Apart" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.05}>
                <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                  <v.icon className="h-8 w-8 text-blue-600 mb-4 transition-transform group-hover:scale-110" />
                  <h3 className="font-bold text-xl mb-3 text-slate-900">{v.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{v.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Coaches - Profile Card Style */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-bold tracking-widest text-sm uppercase">Our Faculty</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4">Learn From Champions</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coaches.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 0.1}>
                <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 hover:bg-slate-800 transition-all group">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/20">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{c.name}</h3>
                  <p className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-4">{c.title}</p>
                  <div className="flex gap-2 mb-4">
                    <span className="bg-slate-700 px-2 py-1 rounded text-[10px] font-bold text-slate-300">{c.elo}</span>
                    <span className="bg-slate-700 px-2 py-1 rounded text-[10px] font-bold text-slate-300">{c.specialty}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{c.bio}</p>
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