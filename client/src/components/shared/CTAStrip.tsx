import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

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
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="relative overflow-hidden glass border-white/10 rounded-[3rem] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-royal/10 blur-[100px] rounded-full -z-10" />

            <div className="text-center lg:text-left max-w-2xl">
              <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6 leading-tight">
                {title}
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 shrink-0">
              <Button size="lg" className="gold-glow rounded-full text-base px-10 py-7 group">
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTAStrip;
