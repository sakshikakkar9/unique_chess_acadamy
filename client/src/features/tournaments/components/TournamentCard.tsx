import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, Ticket, Send } from "lucide-react";
import { Tournament } from "@/types";

interface TournamentCardProps {
  tournament: Tournament;
  delay?: number;
  onRegister: () => void; // Added this to fix the TypeScript error
}

export const TournamentCard = ({ tournament, delay = 0, onRegister }: TournamentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className="group relative bg-white border border-slate-200 rounded-3xl p-6 hover:border-amber-500/50 transition-all shadow-sm hover:shadow-xl"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          tournament.status === 'UPCOMING'
            ? 'bg-green-500/10 text-green-500'
            : 'bg-amber-500/10 text-amber-500'
        }`}>
          {tournament.status}
        </span>
      </div>

      <h3 className="text-xl font-black mb-3 text-slate-900 group-hover:text-amber-600 transition-colors font-heading">
        {tournament.title} 
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-slate-500 gap-2 font-medium">
          <Calendar className="h-4 w-4 text-amber-500" />
          {tournament.date ? format(new Date(tournament.date), "PPP") : "TBA"}
        </div>
        
        <div className="flex items-center text-sm text-slate-500 gap-2 font-medium">
          <MapPin className="h-4 w-4 text-amber-500" />
          {tournament.location}
        </div>

        <div className="flex items-center text-sm text-slate-500 gap-2">
          <Ticket className="h-4 w-4 text-amber-500" />
          <span className="font-bold text-slate-900">
            ₹{tournament.entryFee > 0 ? tournament.entryFee : "Free Entry"}
          </span>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.preventDefault(); // Critical: Prevents page jump/refresh
          onRegister();       // Triggers the backend call in the parent
        }}
        className="w-full py-3 rounded-2xl bg-slate-900 text-white hover:bg-amber-600 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
      >
        <Send className="h-4 w-4" />
        Register Now
      </button>
    </motion.div>
  );
};