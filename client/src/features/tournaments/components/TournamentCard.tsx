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
  const isActive = ['upcoming', 'ongoing'].includes(status);
  const isEnrollable = isRegOpen && isActive;

  const overlayConfig = {
    upcoming: { label: null, color: '' },
    ongoing: { label: 'Live Now', color: 'bg-green-500' },
    completed: { label: 'Completed', color: 'bg-slate-500' },
    rejected: { label: 'Unavailable', color: 'bg-red-500' },
    cancelled: { label: 'Cancelled', color: 'bg-orange-500' },
  }[status];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={cn(
        "card-pro group relative rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col h-full bg-white shadow-sm border-slate-100",
        !isActive
          ? "opacity-50 grayscale pointer-events-none"
          : "border-slate-200 hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* Status overlay badge — top of card */}
      {overlayConfig?.label && (
        <div className={cn(
          "absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-1.5",
          overlayConfig.color
        )}>
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            {overlayConfig.label}
          </span>
        </div>
      )}

      {/* Ongoing pulsing dot badge */}
      {status === 'ongoing' && (
        <div className="absolute top-8 left-3 z-20 flex items-center gap-1.5 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Live Now
        </div>
      )}

      <div className={cn("p-6 flex flex-col h-full", !isActive && "mt-6")}>
        <div className="flex justify-between items-start mb-8">
          <div className={cn(
            "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
            statusConfig.badge
          )}>
            {statusConfig.label}
          </div>

          <div className="bg-[#f8fafc] px-4 py-1.5 rounded-full border border-[#e2e8f0]">
            <span className="text-[12px] font-bold text-[#0f172a]">
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

        {!isActive ? (
          <div className="mt-auto">
            <button
              disabled
              className="w-full py-3.5 rounded-xl text-sm font-bold bg-slate-200 text-slate-400 cursor-not-allowed border border-transparent"
            >
              {status === 'completed' ? 'Tournament Ended'
                : status === 'cancelled' ? 'Cancelled'
                  : 'Unavailable'}
            </button>
          </div>
        ) : !isRegOpen ? (
          <div className="mt-auto">
            <button
              disabled
              className="w-full py-3.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            >
              Registration Closed
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              onRegister();
            }}
            className="mt-auto w-full py-3.5 rounded-xl border border-[#0f172a] text-[#0f172a] font-bold text-[14px] transition-all flex items-center justify-center gap-2 group/btn hover:bg-[#0f172a] hover:text-white"
          >
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        )}
      </div>
    </motion.div>
  );
};