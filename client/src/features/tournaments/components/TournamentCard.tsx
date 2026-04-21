import { Tournament } from "@/types";
import { Calendar, MapPin, Trophy } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";

interface TournamentCardProps {
  tournament: Tournament;
  delay?: number;
}

const TournamentCard = ({ tournament, delay }: TournamentCardProps) => {
  return (
    <ScrollReveal delay={delay}>
      <div className="bg-card border border-border rounded-2xl p-6 card-hover group relative overflow-hidden">
        {tournament.status === "Open" && (
          <div className="absolute top-0 right-0">
            <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-8 py-1 rotate-45 translate-x-6 translate-y-2">
              Registration Open
            </div>
          </div>
        )}

        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-secondary text-secondary-foreground`}>
              {tournament.type}
            </span>
          </div>

          <h3 className="font-heading font-bold text-xl mb-4 group-hover:text-primary transition-colors">
            {tournament.title}
          </h3>

          <div className="space-y-3 mb-6 flex-grow">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{tournament.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{tournament.location}</span>
            </div>
          </div>

          <Button
            className="w-full"
            variant={tournament.status === "Open" ? "default" : "outline"}
            disabled={tournament.status === "Completed"}
          >
            {tournament.status === "Open" ? "Register Now" :
             tournament.status === "Coming Soon" ? "Notify Me" : "Completed"}
          </Button>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default TournamentCard;
