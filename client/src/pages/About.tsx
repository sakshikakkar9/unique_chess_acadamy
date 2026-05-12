import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { ArrowRight } from "lucide-react";
import { stagger, scaleIn, fadeIn, fadeLeft } from "@/components/shared/motion";
import { motion } from "framer-motion";

const instructors = [
  { name: "GM Vikram Iyer", title: "Head of Pedagogy", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800", quote: "Chess is not just a game, it's a way of building architectural logic.", specialty: "Theory" },
  { name: "IM Ananya Desai", title: "Technical Lead", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800", quote: "We focus on converting microscopic advantages into clinical victories.", specialty: "Endgames" },
  { name: "FM Rohan Patel", title: "Tactical Head", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800", quote: "Mastering tactical chaos requires disciplined calculation and focus.", specialty: "Calculation" },
  { name: "WIM Kavya Nair", title: "Elite Mentor", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800", quote: "Building strong foundations is the key to shaping the next generation of masters.", specialty: "Foundations" },
];

export default function AboutPage() {
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
                Our Story
              </span>
            </motion.div>

            <motion.h1 variants={fadeLeft} className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
              Built by Players.<br />
              <span className="text-blue-400">Driven by Purpose.</span>
            </motion.h1>
            <motion.p variants={fadeLeft} className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl mb-8">
              Founded in 2018, UCA has grown from a single classroom
              to India's most trusted chess institution.
            </motion.p>
          </motion.div>
        </div>

        {/* Fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-20
                        bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* MISSION / VALUES SECTION */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading block */}
          <div className="mb-10">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.15em] mb-2">
              What Drives Us
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Our Core Values.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '♟',
                title: 'Discipline First',
                body: 'Chess is a mirror of life. We teach students to think before they act.'
              },
              {
                icon: '🏆',
                title: 'Excellence Always',
                body: 'We set high standards because we believe every student is capable of surpassing them.'
              },
              {
                icon: '🤝',
                title: 'Community First',
                body: 'Our players compete hard but grow together, mentoring each other at every level.'
              },
            ].map((val, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50
                                hover:border-blue-200 hover:bg-blue-50/30
                                transition-colors duration-200 h-full flex flex-col">
                  <div className="text-3xl mb-6">{val.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{val.title}</h3>
                  <p className="text-sm font-normal text-slate-500 leading-relaxed max-w-xl">{val.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTORS SECTION */}
      <section className="py-14 sm:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.15em] mb-2">
              Our Faculty
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              World-Class Coaching Staff.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {instructors.map((person, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex flex-col bg-white border border-slate-200
                                rounded-2xl overflow-hidden
                                hover:shadow-md hover:-translate-y-1
                                transition-all duration-200 h-full">

                  {/* Photo */}
                  <div className="aspect-square bg-slate-100 overflow-hidden">
                    <img src={person.photo} alt={person.name}
                         className="w-full h-full object-cover object-top"
                         loading="lazy" />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-slate-900">{person.name}</h3>
                    <p className="text-xs font-medium text-blue-600 mt-0.5 mb-3">{person.title}</p>

                    {/* Quote — strictly 3 lines max */}
                    <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-3 flex-1">
                      "{person.quote}"
                    </p>

                    {/* Specialty — always at bottom */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-blue-600
                                       uppercase tracking-widest">
                        ♟ {person.specialty}
                      </span>
                    </div>
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
