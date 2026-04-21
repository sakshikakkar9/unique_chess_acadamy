import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        label="Contact"
        title={
          <>
            Get in <span className="text-gradient-gold">Touch</span>
          </>
        }
        description="Have questions? We'd love to hear from you."
      />

      <section className="section-padding pt-0">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <ScrollReveal direction="left">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Name</label>
                    <Input placeholder="Your name" required className="bg-card border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Phone</label>
                    <Input placeholder="+91 XXXXX XXXXX" className="bg-card border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium block">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="bg-card border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium block">Message</label>
                  <Textarea
                    placeholder="Tell us what you're looking for..."
                    rows={5}
                    required
                    className="bg-card border-border"
                  />
                </div>
                <Button type="submit" size="lg" className="gold-glow w-full sm:w-auto" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">Contact Info</h3>
                  <div className="space-y-4">
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
                  className="flex items-center gap-3 bg-green-600/20 border border-green-500/30 rounded-2xl p-6 hover:bg-green-600/30 transition-colors group"
                >
                  <MessageCircle className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="font-heading font-semibold">Chat on WhatsApp</p>
                    <p className="text-sm text-muted-foreground">Quick replies, usually within minutes</p>
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
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
