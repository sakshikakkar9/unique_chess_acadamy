import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, ChevronRight } from "lucide-react";
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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={delay}
      className="group relative bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-sky-900/10 hover:border-sky-200 transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Container with Fixed Aspect Ratio for Uniformity */}
      <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={tournament.imageUrl || "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2000"}
          alt={tournament.title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
            tournament.posterOrientation === 'PORTRAIT' ? "object-top" : "object-center"
          )}
        />
        <div className="absolute top-5 left-5 flex gap-2">
          <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black text-sky-600 shadow-xl shadow-blue-900/5 uppercase tracking-widest border border-sky-50">
            {tournament.category || 'Open'}
          </span>
        </div>
        {/* Soft gradient overlay for professional feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-6 md:p-9 flex flex-col h-full">
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Start Date</span>
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Calendar className="h-4 w-4 text-sky-500" />
              {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
          {tournament.title}
        </h3>
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 font-medium">
          <MapPin className="h-4 w-4 text-slate-400" />
          {tournament.location || 'Unique Chess Academy'}
        </div>

        <div className="flex flex-col mb-10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prize Fund</span>
          <span className="text-2xl font-bold text-slate-900">
            ₹{tournament.totalPrizePool?.toLocaleString() || 'TBD'}
          </span>
        </div>

        <div
          onClick={(e) => {
            e.preventDefault();
            onRegister();
          }}
          className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between cursor-pointer group/btn"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-1">Entry Fee</span>
            <span className="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
              ₹{tournament.entryFee?.toLocaleString() || '0'}
            </span>
          </div>
          <div className="h-12 px-6 bg-slate-900 group-hover:bg-sky-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95">
            <span className="text-xs font-bold uppercase tracking-widest">Enroll Now</span>
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
