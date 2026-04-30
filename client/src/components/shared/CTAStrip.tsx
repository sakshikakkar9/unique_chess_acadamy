import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SparkleCanvas from "./SparkleCanvas";

interface CTAStripProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

const CTAStrip = ({
  title = "Ready to Make Your Move?",
  subtitle = "Join our community of passionate chess players and start your journey today.",
  buttonText = "Join Academy",
}: CTAStripProps) => {
  return (
    <section className="relative py-24 overflow-hidden border-t border-[#3b82f6]/20 bg-gradient-to-r from-[#0a0f1e] to-[#1e3a5f]">
      <div className="absolute inset-0 z-0 opacity-40">
        {/* Reduced density for CTAStrip */}
        <SparkleCanvas />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="font-black text-4xl md:text-5xl text-white mb-6 leading-tight">
                {title.split(' ').map((word, i) => (
                  <span key={i} className={i === 4 ? "glow-text-gold text-[#f59e0b]" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h2>
              <p className="text-[#cbd5e1] text-lg leading-relaxed">{subtitle}</p>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-black font-black rounded-full px-12 py-8 text-xl hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] border-none shrink-0 group"
            >
              {buttonText}
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTAStrip;
