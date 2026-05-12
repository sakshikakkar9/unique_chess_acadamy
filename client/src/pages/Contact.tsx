import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { stagger, fadeLeft, fadeRight, fadeIn } from "@/components/shared/motion";
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
                Support Center
              </span>
            </motion.div>

            <motion.h1 variants={fadeLeft} className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
              Get in <br />
              <span className="text-blue-400">Touch.</span>
            </motion.h1>
            <motion.p variants={fadeLeft} className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl mb-8">
              Have questions? We'd love to hear from you. Our team is ready to help.
            </motion.p>
          </motion.div>
        </div>

        {/* Fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-20
                        bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* CONTACT CONTENT */}
      <section className="py-14 sm:py-16 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* FORM CARD */}
            <ScrollReveal variants={fadeLeft}>
              <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                <div className="mb-10">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Send a Message.</h2>
                  <p className="text-sm font-normal text-slate-500">We'll respond to your inquiry within 24 hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <Input
                        name="name"
                        placeholder="John Doe"
                        required
                        className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-slate-900 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <Input
                        name="phone"
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-slate-900 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-slate-900 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                    <Textarea
                      name="message"
                      placeholder="How can we help you?"
                      rows={5}
                      required
                      className="bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-slate-900 text-sm p-4"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 uppercase text-xs tracking-widest"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send className="h-4 w-4" />
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
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
                      Let's Start Your <br />
                      <span className="text-blue-600">Chess Journey.</span>
                    </h3>
                    <div className="h-1 w-12 bg-blue-600 rounded-full mb-3" />
                    
                    <div className="space-y-10">
                      <ContactInfoItem
                        icon={MapPin}
                        label="Academy Location"
                        value="Andheri West, Mumbai, India"
                      />
                      <ContactInfoItem icon={Phone} label="Direct Line" value="+91 98765 43210" />
                      <ContactInfoItem icon={Mail} label="Official Support" value="info@uniquechess.in" />
                    </div>
                  </div>

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
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
        <Icon className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-slate-900 font-bold text-lg leading-tight">{value}</p>
      </div>
    </div>
  );
}
