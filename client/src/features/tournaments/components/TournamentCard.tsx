import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, Ticket } from "lucide-react";
import { Tournament } from "@/types";

interface TournamentCardProps {
  tournament: Tournament;
  delay?: number;
}

export const TournamentCard = ({ tournament, delay = 0 }: TournamentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
          {tournament.status}
        </span>
      </div>

      {/* ✅ FIX: Changed from tournament.name to tournament.title */}
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
        {tournament.title} 
      </h3>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          {/* ✅ Safe date formatting */}
          {tournament.date ? format(new Date(tournament.date), "PPP") : "TBA"}
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {tournament.location}
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Ticket className="h-4 w-4 text-primary" />
          ₹{tournament.entryFee} Entry Fee
        </div>
      </div>

      <button className="w-full py-2.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground font-bold text-sm transition-all">
        View Details
      </button>
    </motion.div>
  );
};