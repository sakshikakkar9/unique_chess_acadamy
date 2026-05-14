import { format } from "date-fns";
import { MapPin, Calendar, Trophy } from "lucide-react";
import { Tournament } from "@/types";
import { cn } from "@/lib/utils";
import { resolveStatus, STATUS_CONFIG } from "@/lib/statusUtils";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface TournamentCardProps {
  tournament: Tournament;
  delay?: number;
  onRegister: () => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800";

export const TournamentCard = ({ tournament, delay = 0, onRegister }: TournamentCardProps) => {
  const status = resolveStatus(tournament.startDate, tournament.endDate, tournament.status);
  const statusConfig = STATUS_CONFIG[status];

  const now = new Date();
  const regStart = tournament.regStartDate ? new Date(tournament.regStartDate) : null;
  const regEnd = tournament.regEndDate ? new Date(tournament.regEndDate) : null;
  if (regEnd) regEnd.setHours(23, 59, 59, 999);

  const isRegOpen = (!regStart || now >= regStart) && (!regEnd || now <= regEnd);
  const isActive = ['upcoming', 'ongoing'].includes(status);

  return (
    <ScrollReveal delay={delay}>
      <div className={cn(
        "group relative overflow-hidden flex flex-col h-full bg-white rounded-2xl border border-slate-100 transition-all duration-300",
        !isActive
          ? "opacity-50 grayscale pointer-events-none"
          : "hover:shadow-xl hover:-translate-y-1 border-slate-200"
      )}>
        {/* HEADER: IMAGE + BADGE */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={tournament.imageUrl || DEFAULT_IMAGE}
            alt={tournament.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute top-4 right-4 z-10">
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
              statusConfig.badge
            )}>
              {statusConfig.label}
            </span>
          </div>

          {status === 'ongoing' && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live Now
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5 flex flex-col flex-grow">
          {/* DATE INFO */}
          <div className="flex items-center gap-2 mb-3 text-[#64748b]">
            <Calendar className="size-3.5" />
            <span className="text-xs font-semibold">
              {tournament.startDate ? format(new Date(tournament.startDate), "MMM d, yyyy") : "TBA"}
              {tournament.endDate && ` - ${format(new Date(tournament.endDate), "MMM d, yyyy")}`}
            </span>
          </div>

          {/* CORE INFO */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
              {tournament.title}
            </h3>
            <div className="flex items-center gap-1.5 text-blue-600">
              <MapPin className="size-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider line-clamp-1">
                {tournament.location || "Main Academy Hall"}
              </span>
            </div>
          </div>

          {/* TOURNAMENT SPECIFIC: PRIZE POOL */}
          {tournament.totalPrizePool && (
            <div className="flex items-center gap-2 mb-4 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              <Trophy className="size-3.5 text-emerald-600" />
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-wider text-emerald-600 font-bold">Prize Pool</span>
                <span className="text-xs font-bold text-emerald-700">₹{tournament.totalPrizePool.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Entry Fee</span>
              <span className="text-lg font-black text-slate-900">₹{tournament.entryFee > 0 ? tournament.entryFee.toLocaleString() : "Free"}</span>
            </div>

            <Button
              className={cn(
                "bg-blue-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl px-5 py-2.5 h-auto hover:bg-blue-700 transition-all",
                (!isActive || !isRegOpen) && "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
              onClick={(e) => {
                e.preventDefault();
                isActive && isRegOpen && onRegister();
              }}
              disabled={!isActive || !isRegOpen}
            >
              {status === 'completed' ? 'Ended' : !isRegOpen && isActive ? 'Closed' : 'Register'}
            </Button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};
