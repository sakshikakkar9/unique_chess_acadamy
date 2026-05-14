import { MapPin, Calendar, Trophy } from "lucide-react";
import { Tournament } from "@/types";
import { resolveStatus } from "@/lib/statusUtils";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { formatINR, formatDateRange } from "@/lib/formatUtils";

interface TournamentCardProps {
  tournament: Tournament;
  delay?: number;
  onRegister: () => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800";

export const TournamentCard = ({ tournament, delay = 0, onRegister }: TournamentCardProps) => {
  const status = resolveStatus(tournament.startDate, tournament.endDate, tournament.status);

  const now = new Date();
  const regStart = tournament.regStartDate ? new Date(tournament.regStartDate) : null;
  const regEnd = tournament.regEndDate ? new Date(tournament.regEndDate) : null;
  if (regEnd) regEnd.setHours(23, 59, 59, 999);

  const isRegOpen = (!regStart || now >= regStart) && (!regEnd || now <= regEnd);
  const isActive = ['upcoming', 'ongoing'].includes(status);

  return (
    <ScrollReveal delay={delay}>
      <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full">
        {/* IMAGE AREA */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={tournament.imageUrl || DEFAULT_IMAGE}
            alt={tournament.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Status badge - BOTTOM of image */}
          <div className="absolute bottom-3 left-3">
            {(() => {
              const cfg = {
                upcoming: {
                  label: 'Upcoming',
                  cls: 'bg-blue-600 text-white'
                },
                ongoing: {
                  label: '● Live Now',
                  cls: 'bg-green-500 text-white'
                },
                completed: {
                  label: 'Ended',
                  cls: 'bg-slate-600 text-white'
                },
                rejected: {
                  label: 'Unavailable',
                  cls: 'bg-red-600 text-white'
                },
                cancelled: {
                  label: 'Cancelled',
                  cls: 'bg-orange-600 text-white'
                },
              }[status];
              return (
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.cls}`}>
                  {cfg.label}
                </span>
              );
            })()}
          </div>
        </div>

        {/* CARD BODY */}
        <div className="p-4 flex flex-col flex-1">
          {/* Date range */}
          <p className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
            <Calendar className="size-3.5 flex-shrink-0" />
            {formatDateRange(tournament.startDate, tournament.endDate)}
          </p>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">
            {tournament.title}
          </h3>

          {/* Venue */}
          <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
            <MapPin className="size-3.5 flex-shrink-0 text-blue-500" />
            {tournament.location || "Main Academy Hall"}
          </p>

          {/* Prize pool pill */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 flex-1">
              <Trophy className="size-3.5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wide">Prize Pool</p>
                <p className="text-sm font-black text-amber-700">
                  {formatINR(tournament.totalPrizePool ?? 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom row - entry fee + register */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Entry Fee</p>
              <p className="text-base font-black text-slate-900">
                {formatINR(tournament.entryFee ?? 0)}
              </p>
            </div>

            {(() => {
              if (!isActive || !isRegOpen) return (
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-2 rounded-lg">
                  {status === 'completed' ? 'Ended'
                    : status === 'cancelled' ? 'Cancelled'
                    : !isRegOpen && isActive ? 'Closed'
                    : 'Unavailable'}
                </span>
              );

              return (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRegister();
                  }}
                  className="bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors duration-150"
                >
                  Register
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};
