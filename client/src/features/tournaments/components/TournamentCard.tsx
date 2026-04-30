import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, Ticket, Send } from "lucide-react";
import { Tournament } from "@/types";
import { cn } from "@/lib/utils";

interface TournamentCardProps {
  tournament: Tournament;
  delay?: number;
  onRegister: () => void;
}

export const TournamentCard = ({ tournament, delay = 0, onRegister }: TournamentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      className="group relative glass-card p-8 transition-smooth hover:translate-y-[-8px] border-l-4 border-l-[#f59e0b] hover:shadow-2xl overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b]/5 rounded-full -mr-16 -mt-16 transition-smooth group-hover:bg-[#f59e0b]/10" />

      <div className="flex justify-between items-start mb-6">
        <div className={cn(
          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md",
          tournament.status === 'UPCOMING'
            ? 'bg-green-500/10 text-green-400 border-green-500/20'
            : 'glass-card-gold text-[#f59e0b] border-[#f59e0b]/20'
        )}>
          {tournament.status}
        </div>

        <div className="glass-card-blue px-4 py-1.5 rounded-full border-white/5">
          <span className="accent-label text-[#38bdf8] font-black">
            {tournament.date ? format(new Date(tournament.date), "MMM d") : "TBA"}
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-black mb-6 text-white group-hover:text-[#f59e0b] transition-colors uppercase tracking-tight leading-tight">
        {tournament.title} 
      </h3>

      <div className="space-y-4 mb-10">
        <div className="flex items-center text-sm text-[#94a3b8] gap-3 font-bold uppercase tracking-wider">
          <Calendar className="h-4 w-4 text-[#f59e0b]" />
          {tournament.date ? format(new Date(tournament.date), "PPP") : "TBA"}
        </div>
        
        <div className="flex items-center text-sm text-[#94a3b8] gap-3 font-bold uppercase tracking-wider">
          <MapPin className="h-4 w-4 text-[#f59e0b]" />
          {tournament.location}
        </div>

        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl glass-card-gold border-[#f59e0b]/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Ticket className="h-4 w-4 text-[#f59e0b]" />
          <span className="text-sm font-black text-white uppercase tracking-widest">
            ₹{tournament.entryFee > 0 ? tournament.entryFee : "Free Entry"}
          </span>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.preventDefault();
          onRegister();
        }}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-black hover:scale-[1.02] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-3 active:scale-95"
      >
        <Send className="h-4 w-4" />
        Register Now
      </button>
    </motion.div>
  );
};
