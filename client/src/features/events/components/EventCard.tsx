import { Event } from "@/types";
import { Calendar, Clock, MapPin } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  return (
    <ScrollReveal delay={index * 0.05} direction={index % 2 === 0 ? "left" : "right"}>
      <div className="group bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center gap-6">
        <div className="md:w-32 shrink-0">
          <span className="text-xs font-bold uppercase tracking-widest text-primary/70 bg-primary/10 px-3 py-1 rounded-full">
            {event.category}
          </span>
        </div>

        <div className="flex-grow">
          <h3 className="font-heading font-bold text-xl md:text-2xl mb-3 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default EventCard;
