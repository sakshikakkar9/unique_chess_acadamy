import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, Loader2, Sparkles, Send, Headphones } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import { scaleIn, fadeLeft, fadeRight, stagger, fadeUp } from "@/components/shared/motion";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await api.post("/contact", data);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION - Deep Pro Theme */}
      <header className="relative min-h-auto pt-24 pb-12 md:min-h-[400px] md:pt-28 md:pb-16 lg:min-h-[480px] lg:pt-32 lg:pb-20 flex items-center bg-[#020617] overflow-hidden">
        <SparkleCanvas density="subtle" />
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-left max-w-3xl">
            <motion.div variants={fadeUp} className="text-xs font-semibold tracking-widest uppercase border border-white/20 bg-white/10 rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-6 text-white">
              <Headphones className="h-3.5 w-3.5" />
              <span>Support Center</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Touch</span>
            </motion.h1>

            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] } } }} className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
              Have questions? We'd love to hear from you. Our team is ready to help you start your chess journey.
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* CONTACT CONTENT */}
      <section className="py-12 md:py-16 bg-white relative z-10 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* FORM CARD */}
            <ScrollReveal variants={fadeLeft}>
              <div className="bg-white p-6 md:p-12 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                <div className="mb-10">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Send a Message</h2>
                  <p className="text-slate-500 text-sm">We'll respond to your inquiry within 24 business hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <Input
                        name="name"
                        placeholder="Sakshi ..."
                        required
                        className="bg-slate-50 border-slate-100 h-14 rounded-2xl focus:bg-white focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500/20 transition-all text-slate-900 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <Input
                        name="phone"
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-slate-50 border-slate-100 h-14 rounded-2xl focus:bg-white focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500/20 transition-all text-slate-900 font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="bg-slate-50 border-slate-100 h-14 rounded-2xl focus:bg-white focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500/20 transition-all text-slate-900 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                    <Textarea
                      name="message"
                      placeholder="How can we help you master the board?"
                      rows={5}
                      required
                      className="bg-slate-50 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500/20 transition-all text-slate-900 font-medium p-4"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-16 bg-[#020617] hover:bg-sky-600 text-white font-black rounded-2xl transition-all duration-300 shadow-xl hover:shadow-sky-600/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        SEND MESSAGE
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            {/* INFO & WHATSAPP */}
            <div className="lg:pt-12">
              <ScrollReveal variants={fadeRight}>
                <div className="space-y-12">
                  <div className="relative">
                    <div className="h-1.5 w-16 bg-sky-500 rounded-full mb-8" />
                    <h3 className="text-4xl font-black text-slate-900 mb-10 tracking-tight leading-tight">
                      Let's Start Your <br />
                      <span className="text-sky-500">Chess Journey</span>
                    </h3>
                    
                    <div className="space-y-10">
                      <ContactInfoItem
                        icon={MapPin}
                        label="Academy Location"
                        value="Chess House, Andheri West, Mumbai 400058, India"
                      />
                      <ContactInfoItem icon={Phone} label="Direct Line" value="+91 98765 43210" />
                      <ContactInfoItem icon={Mail} label="Official Support" value="info@uniquechess.in" />
                    </div>
                  </div>

                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-6 p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 group transition-all hover:bg-emerald-100/50 hover:border-emerald-200"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-all duration-500">
                      <MessageCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900">Chat on WhatsApp</p>
                      <p className="text-emerald-700 text-sm font-medium">Quick replies, usually within minutes</p>
                    </div>
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactInfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-6 group">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-sky-500 group-hover:border-sky-500 transition-all duration-500">
        <Icon className="h-6 w-6 text-slate-400 group-hover:text-white transition-colors" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-slate-900 font-bold text-lg leading-tight">{value}</p>
      </div>
    </div>
  );
}