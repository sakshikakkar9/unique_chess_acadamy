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
      <div className="group glass-card-blue p-8 md:p-10 transition-smooth hover:glow-blue border-white/5 flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#3b82f6] to-[#0ea5e9]" />

        <div className="md:w-40 shrink-0">
          <div className="glass-card-blue px-4 py-2 rounded-xl border-[#3b82f6]/20 inline-block">
             <span className="accent-label text-[#38bdf8] font-black">
                {event.category}
             </span>
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="font-black text-2xl md:text-3xl mb-6 text-white group-hover:text-[#38bdf8] transition-colors uppercase tracking-tight">
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3 text-[#94a3b8] text-sm font-bold uppercase tracking-widest">
              <div className="p-2 rounded-lg glass-card-blue">
                <Calendar className="h-4 w-4 text-[#f59e0b]" />
              </div>
              <div className="flex flex-col">
                <span className="accent-label text-[10px] text-[#64748b]">Date</span>
                <span className="text-white">{event.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#94a3b8] text-sm font-bold uppercase tracking-widest">
              <div className="p-2 rounded-lg glass-card-blue">
                <Clock className="h-4 w-4 text-[#f59e0b]" />
              </div>
              <div className="flex flex-col">
                <span className="accent-label text-[10px] text-[#64748b]">Time</span>
                <span className="text-white">{event.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#94a3b8] text-sm font-bold uppercase tracking-widest">
              <div className="p-2 rounded-lg glass-card-blue">
                <MapPin className="h-4 w-4 text-[#f59e0b]" />
              </div>
              <div className="flex flex-col">
                <span className="accent-label text-[10px] text-[#64748b]">Location</span>
                <span className="text-white">{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-8 opacity-5 group-hover:opacity-10 transition-opacity">
           <Calendar size={120} className="text-white" />
        </div>
      </div>
    </ScrollReveal>
  );
};

export default EventCard;
