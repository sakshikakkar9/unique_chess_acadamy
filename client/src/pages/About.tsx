import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/shared/PageHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAStrip from "@/components/shared/CTAStrip";
import trainingImg from "@/assets/academy-training.jpg";
import { Target, Eye, Shield, Award, Users, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  { icon: Target, title: "Precision", text: "Every lesson is structured for measurable progress." },
  { icon: Shield, title: "Trust", text: "Transparent methods and proven results parents can rely on." },
  { icon: Award, title: "Excellence", text: "We don't just teach chess — we build champions." },
  { icon: Users, title: "Community", text: "A supportive environment where players grow together." },
  { icon: Lightbulb, title: "Innovation", text: "Modern techniques blended with classical chess wisdom." },
  { icon: Eye, title: "Vision", text: "Developing strategic thinkers who excel beyond the board." },
];

const coaches = [
  { name: "GM Vikram Iyer", title: "Head Coach", elo: "2450 ELO", specialty: "Opening Theory" },
  { name: "IM Ananya Desai", title: "Senior Coach", elo: "2280 ELO", specialty: "Endgame Strategy" },
  { name: "FM Rohan Patel", title: "Youth Coach", elo: "2200 ELO", specialty: "Tactical Training" },
  { name: "WIM Kavya Nair", title: "Junior Coach", elo: "2150 ELO", specialty: "Beginner Development" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        label="Our Story"
        title={
          <>
            Building India's Next Generation of <span className="text-gradient-gold">Chess Champions</span>
          </>
        }
        description="Founded with a singular mission — to make world-class chess education accessible to every aspiring player across India."
      />

      {/* Story */}
      <section className="section-padding pt-0 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative rounded-[2.5rem] overflow-hidden card-elevation group">
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                <img src={trainingImg} alt="Academy Training" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.4em] text-primary mb-4 bg-primary/10 px-4 py-1 rounded-full inline-block">Who We Are</span>
              <h2 className="font-heading font-bold text-4xl md:text-5xl mb-8 leading-tight">A Decade of <span className="text-gradient-gold">Chess Excellence</span></h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>Unique Chess Academy was founded in 2016 with a vision to create a world-class chess training ecosystem in India. What started as a small coaching center in Mumbai has grown into one of the country's most respected chess academies.</p>
                <p>Our approach combines rigorous analytical training with the joy of competition. We believe every student has the potential for greatness — they just need the right guidance, structure, and opportunities.</p>
                <p>Today, we've trained over 5,000 students, hosted 120+ tournaments, and produced 50+ national-level champions. But we're just getting started.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <ScrollReveal>
              <div className="glass border-white/5 rounded-[2.5rem] p-10 h-full card-elevation group hover:border-primary/30 transition-all duration-500">
                <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-8 group-hover:bg-primary/20 transition-colors">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-3xl mb-6">Our Mission</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">To provide structured, world-class chess education that develops analytical thinking, strategic decision-making, and competitive excellence in students of all ages.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="glass border-white/5 rounded-[2.5rem] p-10 h-full card-elevation group hover:border-primary/30 transition-all duration-500">
                <div className="p-4 bg-royal/10 rounded-2xl w-fit mb-8 group-hover:bg-royal/20 transition-colors">
                  <Eye className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-3xl mb-6">Our Vision</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">To become India's leading chess academy — nurturing the next generation of grandmasters while making the beauty of chess accessible to every aspiring player.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding relative">
        <div className="absolute inset-0 chess-pattern opacity-10 -z-10" />
        <div className="container mx-auto">
          <SectionHeading label="Why Choose Us" title="What Sets Us Apart" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.08}>
                <div className="glass border-white/5 rounded-3xl p-8 card-hover h-full">
                  <div className="p-3 bg-primary/5 rounded-xl w-fit mb-6">
                    <v.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 tracking-tight">{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches */}
      <section className="section-padding bg-secondary/20">
        <div className="container mx-auto">
          <SectionHeading label="Our Team" title="Expert Coaches, Proven Champions" description="Learn from titled players who've competed at the highest levels." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coaches.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 0.08}>
                <div className="glass border-white/5 rounded-[2.5rem] p-8 text-center card-hover group">
                  <div className="relative mb-6 mx-auto w-28 h-28">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-full h-full rounded-full bg-secondary flex items-center justify-center border-2 border-primary/20 group-hover:border-primary transition-colors overflow-hidden">
                      <span className="font-heading font-bold text-2xl text-primary group-hover:scale-110 transition-transform">{c.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-1">{c.name}</h3>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-4">{c.title}</p>
                  <div className="w-8 h-0.5 bg-primary/20 mx-auto mb-4 group-hover:w-12 transition-all" />
                  <p className="text-xs text-muted-foreground font-medium">{c.elo} • {c.specialty}</p>
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
