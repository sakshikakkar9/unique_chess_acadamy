import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, Ticket, ArrowRight, Trophy } from "lucide-react";
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
      className="card-pro group border-l-[3px] border-l-[#d97706] hover:border-l-[#b45309] flex flex-col h-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
    >
      <div className="flex justify-between items-start mb-8">
        <div className={cn(
          "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
          tournament.category ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        )}>
          {/* ✅ CHANGE: Uses category or default status */}
          {tournament.category || 'Upcoming'}
        </div>

        <div className="bg-[#f8fafc] px-4 py-1.5 rounded-full border border-[#e2e8f0]">
          <span className="text-[12px] font-bold text-[#0f172a]">
            {/* ✅ CHANGE: Switched 'date' to 'startDate' */}
            {tournament.startDate ? format(new Date(tournament.startDate), "MMM d") : "TBA"}
          </span>
        </div>
      </div>

      <h3 className="text-[22px] font-bold text-[#0f172a] mb-4 group-hover:text-[#d97706] transition-colors leading-tight">
        {tournament.title} 
      </h3>

      <div className="space-y-4 mb-8">
        <div className="flex items-center text-[14px] text-[#475569] gap-3">
          <Calendar className="h-4 w-4 text-[#d97706]" />
          {/* ✅ CHANGE: Switched 'date' to 'startDate' */}
          {tournament.startDate ? format(new Date(tournament.startDate), "PPP") : "TBA"}
        </div>
        
        <div className="flex items-center text-[14px] text-[#475569] gap-3">
          <MapPin className="h-4 w-4 text-[#d97706]" />
          {tournament.location || "Main Academy Hall"}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fffbeb] border border-[#d97706]/10">
            <Ticket className="h-3.5 w-3.5 text-[#d97706]" />
            <span className="text-[13px] font-bold text-[#92400e]">
              ₹{tournament.entryFee > 0 ? tournament.entryFee : "Free"}
            </span>
          </div>

          {/* ✅ NEW: Added Prize Pool Badge */}
          {tournament.totalPrizePool && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
              <Trophy className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-[13px] font-bold text-emerald-700">
                ₹{tournament.totalPrizePool.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.preventDefault();
          onRegister();
        }}
        className="mt-auto w-full py-3.5 rounded-xl border border-[#0f172a] text-[#0f172a] font-bold text-[14px] transition-all hover:bg-[#0f172a] hover:text-white flex items-center justify-center gap-2 group/btn"
      >
        View Details
        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </motion.div>
  );
};