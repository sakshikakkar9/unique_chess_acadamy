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
import { scaleIn, fadeLeft, fadeRight } from "@/components/shared/motion";

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
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION (Dark Hero Mini) */}
      <header className="relative h-[45vh] min-h-[400px] flex items-center bg-[#0f172a] overflow-hidden">
        <SparkleCanvas density="subtle" />
        <div className="container mx-auto px-6 z-10 text-center">
          <ScrollReveal variants={scaleIn}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] text-[#0ea5e9] border border-[#0ea5e9]/20 mb-8">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Contact</span>
            </div>

            <h1 className="text-h1 text-white mb-6">
              Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d97706] to-[#fbbf24]">Touch</span>
            </h1>

            <p className="text-[#94a3b8] max-w-2xl mx-auto text-body-lg">
              Have questions? We'd love to hear from you. Our team is ready to help you start your chess journey.
            </p>
          </ScrollReveal>
        </div>
      </header>

      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20">
            <ScrollReveal variants={fadeLeft}>
              <div className="card-pro border-[#e2e8f0]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium text-[#0f172a]">Name</label>
                      <Input
                        placeholder="Your name"
                        required
                        className="bg-[#f8fafc] border-[#e2e8f0] h-12 rounded-xl focus:border-[#2563eb] focus:ring-[3px] focus:ring-[#2563eb]/10 transition-all text-[#0f172a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium text-[#0f172a]">Phone</label>
                      <Input
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-[#f8fafc] border-[#e2e8f0] h-12 rounded-xl focus:border-[#2563eb] focus:ring-[3px] focus:ring-[#2563eb]/10 transition-all text-[#0f172a]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium text-[#0f172a]">Email</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="bg-[#f8fafc] border-[#e2e8f0] h-12 rounded-xl focus:border-[#2563eb] focus:ring-[3px] focus:ring-[#2563eb]/10 transition-all text-[#0f172a]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium text-[#0f172a]">Message</label>
                    <Textarea
                      placeholder="Tell us what you're looking for..."
                      rows={5}
                      required
                      className="bg-[#f8fafc] border-[#e2e8f0] rounded-xl focus:border-[#2563eb] focus:ring-[3px] focus:ring-[#2563eb]/10 transition-all text-[#0f172a]"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-[#d97706] text-white font-bold w-full h-14 px-12 rounded-full hover:bg-[#b45309] transition-all shadow-[0_4px_12px_rgba(217,119,6,0.35)]"
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

            <ScrollReveal variants={fadeRight}>
              <div className="space-y-10">
                <div className="card-pro border-l-[3px] border-l-[#2563eb] border-[#e2e8f0]">
                  <h3 className="text-[20px] font-bold text-[#0f172a] mb-8 uppercase tracking-tight">Contact Info</h3>
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
                  className="flex items-center gap-6 card-pro border-[#e2e8f0] hover:border-green-500/30 group transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all">
                    <MessageCircle className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[18px] font-bold text-[#0f172a]">Chat on WhatsApp</p>
                    <p className="text-[#475569] text-[14px]">Quick replies, usually within minutes</p>
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
      <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center shrink-0 group-hover:scale-110 transition-all">
        <Icon className="h-5 w-5 text-[#2563eb]" />
      </div>
      <div>
        <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mb-1">{label}</p>
        <p className="text-[#0f172a] font-semibold text-[16px]">{value}</p>
      </div>
    </div>
  );
}
