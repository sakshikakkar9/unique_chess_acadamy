import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, Ticket, ArrowRight } from "lucide-react";
import { Tournament } from "@/types";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/components/shared/motion";

interface TournamentCardProps {
  tournament: Tournament;
  delay?: number;
  onRegister: () => void;
}

export const TournamentCard = ({ tournament, delay = 0, onRegister }: TournamentCardProps) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className="card-pro group border-l-[3px] border-l-[#d97706] hover:border-l-[#b45309]"
    >
      <div className="flex justify-between items-start mb-8">
        <div className={cn(
          "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
          tournament.status === 'UPCOMING'
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            : 'bg-[#fffbeb] text-[#92400e] border border-[#d97706]/20'
        )}>
          {tournament.status}
        </div>

        <div className="bg-[#f8fafc] px-4 py-1.5 rounded-full border border-[#e2e8f0]">
          <span className="text-[12px] font-bold text-[#0f172a]">
            {tournament.date ? format(new Date(tournament.date), "MMM d") : "TBA"}
          </span>
        </div>
      </div>

      <h3 className="text-[22px] font-bold text-[#0f172a] mb-6 group-hover:text-[#d97706] transition-colors leading-tight">
        {tournament.title} 
      </h3>

      <div className="space-y-4 mb-10">
        <div className="flex items-center text-[14px] text-[#475569] gap-3">
          <Calendar className="h-4 w-4 text-[#d97706]" />
          {tournament.date ? format(new Date(tournament.date), "PPP") : "TBA"}
        </div>
        
        <div className="flex items-center text-[14px] text-[#475569] gap-3">
          <MapPin className="h-4 w-4 text-[#d97706]" />
          {tournament.location}
        </div>

        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#fffbeb] border border-[#d97706]/10">
          <Ticket className="h-4 w-4 text-[#d97706]" />
          <span className="text-[14px] font-bold text-[#92400e]">
            ₹{tournament.entryFee > 0 ? tournament.entryFee : "Free Entry"}
          </span>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.preventDefault();
          onRegister();
        }}
        className="w-full py-4 rounded-xl border border-[#2563eb] text-[#2563eb] font-bold text-[14px] transition-all hover:bg-[#2563eb] hover:text-white flex items-center justify-center gap-2 group/btn"
      >
        View Details
        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </motion.div>
  );
};
