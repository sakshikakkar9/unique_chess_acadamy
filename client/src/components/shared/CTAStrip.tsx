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
    <section className="section-padding py-12">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="font-heading font-bold text-2xl md:text-3xl mb-2">{title}</h2>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
            <Button size="lg" className="gold-glow group shrink-0">
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTAStrip;
