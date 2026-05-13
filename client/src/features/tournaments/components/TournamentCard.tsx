import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, Ticket, ArrowRight, Trophy } from "lucide-react";
import { Tournament } from "@/types";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/components/shared/motion";
import { resolveStatus, STATUS_CONFIG } from "@/lib/statusUtils";

interface TournamentCardProps {
  tournament: Tournament;
  delay?: number;
  onRegister: () => void;
}

export const TournamentCard = ({ tournament, delay = 0, onRegister }: TournamentCardProps) => {
  const status = resolveStatus(tournament.startDate, tournament.endDate, tournament.status);
  const statusConfig = STATUS_CONFIG[status];

  const now = new Date();
  const regStart = tournament.regStartDate ? new Date(tournament.regStartDate) : null;
  const regEnd = tournament.regEndDate ? new Date(tournament.regEndDate) : null;
  if (regEnd) regEnd.setHours(23, 59, 59, 999);

  const isRegOpen = (!regStart || now >= regStart) && (!regEnd || now <= regEnd);
  const isInactive = status === 'cancelled' || status === 'rejected' || status === 'completed';
  const isEnrollable = isRegOpen && !isInactive;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={cn(
        "card-pro group border-l-[3px] border-l-sky-600 hover:border-l-sky-700 flex flex-col h-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all duration-300",
        (status === 'cancelled' || status === 'rejected') && "grayscale opacity-50 pointer-events-none"
      )}
    >
      <div className="flex justify-between items-start mb-8">
        <div className={cn(
          "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
          statusConfig.badge
        )}>
          {statusConfig.label}
        </div>

        <div className="bg-[#f8fafc] px-4 py-1.5 rounded-full border border-[#e2e8f0]">
          <span className="text-[12px] font-bold text-[#0f172a]">
            {/* ✅ CHANGE: Switched 'date' to 'startDate' */}
            {tournament.startDate ? format(new Date(tournament.startDate), "MMM d") : "TBA"}
          </span>
        </div>
      </div>

      <h3 className="text-[22px] font-bold text-[#0f172a] mb-4 group-hover:text-sky-600 transition-colors leading-tight">
        {tournament.title} 
      </h3>

      <div className="space-y-4 mb-8">
        <div className="flex items-center text-[14px] text-[#475569] gap-3">
          <Calendar className="h-4 w-4 text-sky-600" />
          {/* ✅ CHANGE: Switched 'date' to 'startDate' */}
          {tournament.startDate ? format(new Date(tournament.startDate), "PPP") : "TBA"}
        </div>
        
        <div className="flex items-center text-[14px] text-[#475569] gap-3">
          <MapPin className="h-4 w-4 text-sky-600" />
          {tournament.location || "Main Academy Hall"}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-600/10">
            <Ticket className="h-3.5 w-3.5 text-sky-600" />
            <span className="text-[13px] font-bold text-sky-800">
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
          if (isEnrollable) onRegister();
        }}
        disabled={!isEnrollable}
        className={cn(
          "mt-auto w-full py-3.5 rounded-xl border border-[#0f172a] text-[#0f172a] font-bold text-[14px] transition-all flex items-center justify-center gap-2 group/btn",
          isEnrollable
            ? "hover:bg-[#0f172a] hover:text-white"
            : "opacity-50 cursor-not-allowed border-slate-300 text-slate-400"
        )}
      >
        {status === 'completed' ? 'Tournament Ended' : isRegOpen ? 'View Details' : 'Registration Closed'}
        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </motion.div>
  );
};