import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/shared/PageHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAStrip from "@/components/shared/CTAStrip";
import trainingImg from "@/assets/academy-training.jpg";
import { Target, Eye, Shield, Award, Users, Lightbulb } from "lucide-react";

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
      <section className="section-padding pt-0">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={trainingImg} alt="Academy Training" loading="lazy" width={800} height={600} className="w-full h-full object-cover" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <span className="text-xs font-heading font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">Who We Are</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">A Decade of Chess Excellence</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Unique Chess Academy was founded in 2016 with a vision to create a world-class chess training ecosystem in India. What started as a small coaching center in Mumbai has grown into one of the country's most respected chess academies.</p>
                <p>Our approach combines rigorous analytical training with the joy of competition. We believe every student has the potential for greatness — they just need the right guidance, structure, and opportunities.</p>
                <p>Today, we've trained over 5,000 students, hosted 120+ tournaments, and produced 50+ national-level champions. But we're just getting started.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="bg-card border border-border rounded-2xl p-8 h-full shadow-sm">
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-heading font-bold text-2xl mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">To provide structured, world-class chess education that develops analytical thinking, strategic decision-making, and competitive excellence in students of all ages.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="bg-card border border-border rounded-2xl p-8 h-full shadow-sm">
                <Eye className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-heading font-bold text-2xl mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">To become India's leading chess academy — nurturing the next generation of grandmasters while making the beauty of chess accessible to every aspiring player.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label="Why Choose Us" title="What Sets Us Apart" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.08}>
                <div className="bg-card border border-border rounded-2xl p-6 card-hover">
                  <v.icon className="h-6 w-6 text-primary mb-3" />
                  <h3 className="font-heading font-semibold text-lg mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto">
          <SectionHeading label="Our Team" title="Expert Coaches, Proven Champions" description="Learn from titled players who've competed at the highest levels." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coaches.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 0.08}>
                <div className="bg-card border border-border rounded-2xl p-6 text-center card-hover">
                  <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center border-2 border-primary/20">
                    <span className="font-heading font-bold text-xl text-primary">{c.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <h3 className="font-heading font-semibold">{c.name}</h3>
                  <p className="text-xs text-primary font-medium mt-1 uppercase tracking-wider">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-2">{c.elo} • {c.specialty}</p>
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
