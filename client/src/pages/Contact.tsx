import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, Loader2, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import SparkleCanvas from "@/components/shared/SparkleCanvas";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-[#cbd5e1] selection:bg-sky-500/30 overflow-hidden relative">
      <SparkleCanvas />
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative pt-48 pb-24 flex items-center">
        <div className="container mx-auto px-6 z-10 text-center">
          <ScrollReveal direction="scale">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card-blue mb-10 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Sparkles className="h-4 w-4 text-[#38bdf8] animate-pulse" />
              <span className="accent-label text-[#38bdf8] font-black">Contact</span>
            </div>

            <h1 className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter uppercase leading-none">
              Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] glow-text-gold">Touch</span>
            </h1>

            <p className="text-[#94a3b8] max-w-2xl mx-auto text-xl leading-relaxed font-medium">
              Have questions? We'd love to hear from you. Our team is ready to help you start your chess journey.
            </p>
          </ScrollReveal>
        </div>
      </header>

      <section className="pb-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20">
            <ScrollReveal direction="left">
              <div className="glass-card p-10 border-white/5">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="accent-label text-[#64748b] font-black">Name</label>
                      <Input
                        placeholder="Your name"
                        required
                        className="bg-white/5 border-white/10 h-14 rounded-xl focus:border-[#3b82f6] focus:ring-0 transition-smooth focus:glow-blue text-white"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="accent-label text-[#64748b] font-black">Phone</label>
                      <Input
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-white/5 border-white/10 h-14 rounded-xl focus:border-[#3b82f6] focus:ring-0 transition-smooth focus:glow-blue text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="accent-label text-[#64748b] font-black">Email</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="bg-white/5 border-white/10 h-14 rounded-xl focus:border-[#3b82f6] focus:ring-0 transition-smooth focus:glow-blue text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="accent-label text-[#64748b] font-black">Message</label>
                    <Textarea
                      placeholder="Tell us what you're looking for..."
                      rows={5}
                      required
                      className="bg-white/5 border-white/10 rounded-xl focus:border-[#3b82f6] focus:ring-0 transition-smooth focus:glow-blue text-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-black font-black w-full sm:w-auto h-16 px-12 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] transition-all border-none"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      <>
                        SEND MESSAGE
                        <Send className="ml-3 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="space-y-10">
                <div className="glass-card-blue p-10 border-[#3b82f6]/20">
                  <h3 className="font-black text-2xl text-white uppercase tracking-tight mb-8">Contact Info</h3>
                  <div className="space-y-8">
                    <ContactInfoItem
                      icon={MapPin}
                      label="Address"
                      value="Chess House, Andheri West, Mumbai 400058, India"
                    />
                    <ContactInfoItem icon={Phone} label="Phone" value="+91 98765 43210" />
                    <ContactInfoItem icon={Mail} label="Email" value="info@uniquechess.in" />
                  </div>
                </div>

                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-6 glass-card p-10 border-green-500/20 hover:bg-green-500/5 transition-smooth group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-smooth">
                    <MessageCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <div>
                    <p className="font-black text-xl text-white uppercase tracking-tight">Chat on WhatsApp</p>
                    <p className="text-[#94a3b8] font-medium">Quick replies, usually within minutes</p>
                  </div>
                </a>
              </div>
            </ScrollReveal>
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
      <div className="w-12 h-12 rounded-xl glass-card-blue flex items-center justify-center shrink-0 group-hover:scale-110 transition-smooth">
        <Icon className="h-5 w-5 text-[#38bdf8]" />
      </div>
      <div>
        <p className="accent-label text-[#64748b] font-black">{label}</p>
        <p className="text-white font-bold text-lg">{value}</p>
      </div>
    </div>
  );
}
