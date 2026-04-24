import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tournament } from "@/types";

interface TournamentCardProps {
  tournament: Tournament;
  delay?: number;
}

export const TournamentCard = ({ tournament, delay = 0 }: TournamentCardProps) => {
  const navigate = useNavigate();

  // Helper to handle navigation to details/registration page
  const handleViewDetails = () => {
    navigate(`/tournaments/${tournament.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          tournament.status === 'Coming Soon'
            ? 'bg-green-500/10 text-green-500'
            : 'bg-primary/10 text-primary'
        }`}>
          {tournament.status}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
        {tournament.title} 
      </h3>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          {/* Safe date formatting: Handles string or Date objects */}
          {tournament.date ? format(new Date(tournament.date), "PPP") : "TBA"}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {tournament.location}
        </div>

        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Ticket className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            ₹{tournament.entryFee > 0 ? tournament.entryFee : "Free Entry"}
          </span>
        </div>
      </div>

      <button 
        onClick={handleViewDetails}
        className="w-full py-2.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground font-bold text-sm transition-all shadow-sm active:scale-95"
      >
        View Details
      </button>
    </motion.div>
  );
};