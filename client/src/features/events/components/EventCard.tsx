import { Event } from "@/types";
import { Calendar, Clock, MapPin } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  return (
    <ScrollReveal delay={index * 0.05}>
      <div className="card-pro group flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden mb-8 border-[#e2e8f0]">
        <div className="md:w-40 shrink-0">
          <div className="bg-[#f0f9ff] px-4 py-2 rounded-xl border border-[#0ea5e9]/10 inline-block">
             <span className="text-[12px] font-bold text-[#0ea5e9] uppercase tracking-wider">
                {event.category}
             </span>
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="text-[24px] font-bold text-[#0f172a] mb-6 group-hover:text-[#2563eb] transition-colors leading-tight">
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#fffbeb]">
                <Calendar className="h-4 w-4 text-[#d97706]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-widest">Date</span>
                <span className="text-[15px] text-[#475569] font-medium">{event.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#fffbeb]">
                <Clock className="h-4 w-4 text-[#d97706]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-widest">Time</span>
                <span className="text-[15px] text-[#475569] font-medium">{event.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#fffbeb]">
                <MapPin className="h-4 w-4 text-[#d97706]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-widest">Location</span>
                <span className="text-[15px] text-[#475569] font-medium">{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
           <Calendar size={120} className="text-[#0f172a]" />
        </div>
      </div>
    </ScrollReveal>
  );
};

export default EventCard;
