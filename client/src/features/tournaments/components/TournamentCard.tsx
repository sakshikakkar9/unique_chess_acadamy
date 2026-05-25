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
      {/* FIX: Added mx-auto, w-full, and explicit mobile/desktop max-widths. 
        This prevents parent layouts from squishing the card on 361px mobile viewports.
      */}
      <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 h-full w-full max-w-full sm:max-w-md md:max-w-sm mx-auto">
        
        {/* IMAGE AREA */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 flex items-center justify-center border-b border-slate-100">
          <img
            src={tournament.imageUrl || DEFAULT_IMAGE}
            alt={tournament.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgNDAwIDMwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGMUY1RjkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI0Q5Nzc0OSIgZm9udC1mYW1pbHk9InNlcmlmIiBmb250LXdlaWdodD0iOTAwIiBmb250LWl0YWxpYz0iaXRhbGljIiBmb250LXNpemU9IjY0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM1ZW0iPlNLPC90ZXh0Pjwvc3ZnPg==';
            }}
          />

          {/* Status badge - BOTTOM of image */}
          <div className="absolute bottom-3 left-3 z-10">
            {(() => {
              const cfg = {
                upcoming: { label: 'Upcoming', cls: 'bg-blue-600 text-white' },
                ongoing: { label: '● Live Now', cls: 'bg-green-500 text-white' },
                completed: { label: 'Ended', cls: 'bg-slate-600 text-white' },
                rejected: { label: 'Unavailable', cls: 'bg-red-600 text-white' },
                cancelled: { label: 'Cancelled', cls: 'bg-orange-600 text-white' },
              }[status] || { label: 'Unavailable', cls: 'bg-slate-600 text-white' };

              return (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${cfg.cls}`}>
                  {cfg.label}
                </span>
              );
            })()}
          </div>
        </div>

        {/* CARD BODY */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 mb-1.5 line-clamp-1">
            {tournament.title}
          </h3>

          {/* Date range */}
          <p className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5">
            <Calendar className="size-3.5 text-slate-400 flex-shrink-0" />
            {formatDateRange(tournament.startDate, tournament.endDate)}
          </p>

          {/* Venue */}
          <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5 truncate">
            <MapPin className="size-3.5 flex-shrink-0 text-blue-500" />
            {tournament.location || "Main Academy Hall"}
          </p>

          {/* Prize pool inline row */}
          <div className="flex items-center gap-1.5 mb-5 text-amber-600 bg-amber-50/50 border border-amber-100 rounded-xl px-3 py-2">
            <Trophy className="size-4 flex-shrink-0 text-amber-500" />
            <div className="flex items-center gap-1 text-xs font-semibold">
              <span className="uppercase tracking-wider text-[10px] text-amber-700 font-bold">Prize Pool:</span>
              <span className="font-bold text-amber-700">
                {formatINR(tournament.totalPrizePool ?? 0)}
              </span>
            </div>
          </div>

          {/* Bottom row - entry fee + register */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Entry Fee</span>
              <span className="text-base font-black text-slate-900 leading-none">
                {formatINR(tournament.entryFee ?? 0)}
              </span>
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
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors duration-150 shadow-sm"
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


// import { MapPin, Calendar, Trophy } from "lucide-react";
// import { Tournament } from "@/types";
// import { resolveStatus } from "@/lib/statusUtils";
// import ScrollReveal from "@/components/shared/ScrollReveal";
// import { formatINR, formatDateRange } from "@/lib/formatUtils";

// interface TournamentCardProps {
//   tournament: Tournament;
//   delay?: number;
//   onRegister: () => void;
// }

// const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800";

// export const TournamentCard = ({ tournament, delay = 0, onRegister }: TournamentCardProps) => {
//   const status = resolveStatus(tournament.startDate, tournament.endDate, tournament.status);

//   const now = new Date();
//   const regStart = tournament.regStartDate ? new Date(tournament.regStartDate) : null;
//   const regEnd = tournament.regEndDate ? new Date(tournament.regEndDate) : null;
//   if (regEnd) regEnd.setHours(23, 59, 59, 999);

//   const isRegOpen = (!regStart || now >= regStart) && (!regEnd || now <= regEnd);
//   const isActive = ['upcoming', 'ongoing'].includes(status);

//   return (
//     <ScrollReveal delay={delay}>
//       <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full w-full">
//         {/* IMAGE AREA - Reverted to match exact tournament height container ratio */}
//         <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 flex items-center justify-center border-b border-slate-100">
//           <img
//             src={tournament.imageUrl || DEFAULT_IMAGE}
//             alt={tournament.title}
//             className="w-full h-full object-cover"
//             loading="lazy"
//             onError={(e) => {
//               e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgNDAwIDMwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGMUY1RjkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI0Q5Nzc0OSIgZm9udC1mYW1pbHk9InNlcmlmIiBmb250LXdlaWdodD0iOTAwIiBmb250LWl0YWxpYz0iaXRhbGljIiBmb250LXNpemU9IjY0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM1ZW0iPlNLPC90ZXh0Pjwvc3ZnPg==';
//             }}
//           />

//           {/* Status badge - BOTTOM of image */}
//           <div className="absolute bottom-3 left-3">
//             {(() => {
//               const cfg = {
//                 upcoming: {
//                   label: 'Upcoming',
//                   cls: 'bg-blue-600 text-white'
//                 },
//                 ongoing: {
//                   label: '● Live Now',
//                   cls: 'bg-green-500 text-white'
//                 },
//                 completed: {
//                   label: 'Ended',
//                   cls: 'bg-slate-600 text-white'
//                 },
//                 rejected: {
//                   label: 'Unavailable',
//                   cls: 'bg-red-600 text-white'
//                 },
//                 cancelled: {
//                   label: 'Cancelled',
//                   cls: 'bg-orange-600 text-white'
//                 },
//               }[status];
//               return (
//                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.cls}`}>
//                   {cfg.label}
//                 </span>
//               );
//             })()}
//           </div>
//         </div>

//         {/* CARD BODY */}
//         <div className="p-4 flex flex-col flex-1">
//           {/* Title */}
//           <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">
//             {tournament.title}
//           </h3>

//           {/* Date range */}
//           <p className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
//             <Calendar className="size-3.5 flex-shrink-0" />
//             {formatDateRange(tournament.startDate, tournament.endDate)}
//           </p>

//           {/* Venue */}
//           <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5 truncate">
//             <MapPin className="size-3.5 flex-shrink-0 text-blue-500" />
//             {tournament.location || "Main Academy Hall"}
//           </p>

//           {/* Prize pool pill */}
//           {/* <div className="flex items-center gap-2 mb-4">
//             <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 flex-1">
//               <Trophy className="size-3.5 text-amber-500 flex-shrink-0" />
//               <div>
//                 <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wide">Prize Pool</p>
//                 <p className="text-sm font-black text-amber-700">
//                   {formatINR(tournament.totalPrizePool ?? 0)}
//                 </p>
//               </div>
//             </div>
//           </div> */}
// <div className="flex items-center gap-2 mb-4">
//   <div className="flex items-center gap-1.5 bg-transparent rounded-lg px-1 py-1 flex-1">
//     <Trophy className="size-6 text-amber-600 flex-shrink-0" />
//     <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600">
//       <span className="uppercase tracking-wide">Prize Pool:</span>
//       <span>
//         {formatINR(tournament.totalPrizePool ?? 0)}
//       </span>
//     </div>
//   </div>
// </div>

//           {/* Bottom row - entry fee + register */}
//           <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
//             <div>
//               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Entry Fee</p>
//               <p className="text-base font-black text-slate-900">
//                 {formatINR(tournament.entryFee ?? 0)}
//               </p>
//             </div>

//             {(() => {
//               if (!isActive || !isRegOpen) return (
//                 <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-2 rounded-lg">
//                   {status === 'completed' ? 'Ended'
//                     : status === 'cancelled' ? 'Cancelled'
//                     : !isRegOpen && isActive ? 'Closed'
//                     : 'Unavailable'}
//                 </span>
//               );

//               return (
//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     onRegister();
//                   }}
//                   className="bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors duration-150"
//                 >
//                   Register
//                 </button>
//               );
//             })()}
//           </div>
//         </div>
//       </div>
//     </ScrollReveal>
//   );
// };
