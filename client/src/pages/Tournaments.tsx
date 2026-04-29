import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { TournamentCard } from "@/features/tournaments/components/TournamentCard";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { Trophy, Calendar, Medal, Timer, Swords } from "lucide-react";
import axios from "axios";
import { toast } from "sonner"; // Recommended for professional alerts

export default function TournamentsPage() {
  const { tournaments, isLoading } = useAdminTournaments();

  const handleTournamentRegister = async (tournamentId: string) => {
    try {
      // NOTE: Ensure this URL matches your backend route exactly
      const response = await axios.post(`http://localhost:8080/api/tournaments/register`, {
        tournamentId: tournamentId,
        // You might need to add user details here if logged in
      });
      
      if (response.status === 200 || response.status === 201) {
        alert("Success! Your registration is visible on the Admin Dashboard.");
      }
    } catch (error) {
      console.error("Backend Error:", error);
      alert("Failed to reach server. Ensure backend is running on port 8080.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <header className="relative h-[45vh] min-h-[400px] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2000" alt="Chess" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-white" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <ScrollReveal direction="left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-bold uppercase tracking-widest mb-6">
              <Trophy className="h-3.5 w-3.5" /> Competition Hub
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white font-heading tracking-tight">
              Prove Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Strategic Might</span>
            </h1>
          </ScrollReveal>
        </div>
      </header>

      {/* STAT BAR */}
      <section className="py-12 bg-slate-950">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 text-white">
              <Timer className="h-6 w-6 text-blue-400" />
              <div><p className="font-bold">Blitz</p><p className="text-xs text-slate-400">3-5 Mins</p></div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <Swords className="h-6 w-6 text-emerald-400" />
              <div><p className="font-bold">Rapid</p><p className="text-xs text-slate-400">15-30 Mins</p></div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <Calendar className="h-6 w-6 text-amber-400" />
              <div><p className="font-bold">Classical</p><p className="text-xs text-slate-400">90+ Mins</p></div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <Medal className="h-6 w-6 text-purple-400" />
              <div><p className="font-bold">Rated</p><p className="text-xs text-slate-400">Official ELO</p></div>
            </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
             <div className="col-span-full flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
             </div>
          ) : (
            tournaments.map((t, index) => (
              <TournamentCard 
                key={t.id} 
                tournament={t} 
                delay={index * 0.1}
                onRegister={() => handleTournamentRegister(t.id)} 
              />
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}