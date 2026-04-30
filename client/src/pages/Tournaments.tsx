import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { TournamentCard } from "@/features/tournaments/components/TournamentCard";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { Trophy, Calendar, Medal, Timer, Swords, Sparkles } from "lucide-react";
import SparkleCanvas from "@/components/shared/SparkleCanvas";

export default function TournamentsPage() {
  const { tournaments, isLoading } = useAdminTournaments();
  const navigate = useNavigate();

  const handleViewDetails = (tournamentId: string) => {
    navigate(`/tournaments/${tournamentId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-[#cbd5e1] selection:bg-sky-500/30 overflow-hidden relative">
      <SparkleCanvas />
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative h-[60vh] min-h-[500px] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2000" alt="Chess" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-transparent to-[#0a0f1e]" />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <ScrollReveal direction="left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-gold mb-8 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Trophy className="h-3.5 w-3.5 text-[#f59e0b]" />
              <span className="accent-label text-[#f59e0b] font-black">Competition Hub</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-tight uppercase">
              Prove Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] glow-text-gold">Strategic Might</span>
            </h1>
          </ScrollReveal>
        </div>
      </header>

      {/* STAT BAR */}
      <section className="py-16 bg-[#0d1b2e] border-y border-white/5 relative z-10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: Timer, label: "Blitz", desc: "3-5 Mins", color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10" },
              { icon: Swords, label: "Rapid", desc: "15-30 Mins", color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { icon: Calendar, label: "Classical", desc: "90+ Mins", color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10" },
              { icon: Medal, label: "Rated", desc: "Official ELO", color: "text-purple-400", bg: "bg-purple-400/10" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="flex items-center gap-6 group">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center transition-smooth group-hover:scale-110 shadow-lg`}>
                    <stat.icon className={`h-7 w-7 ${stat.color} ${stat.label === 'Blitz' ? 'drop-shadow-[0_0_10px_#3b82f6]' : ''}`} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-white uppercase tracking-tight">{stat.label}</p>
                    <p className="accent-label text-[#94a3b8] font-black">{stat.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
        </div>
      </section>

      <section className="py-32 container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
             <div className="col-span-full flex flex-col items-center justify-center py-32 text-[#94a3b8]">
                <div className="h-12 w-12 border-4 border-[#f59e0b]/20 border-t-[#f59e0b] rounded-full animate-spin mb-6" />
                <p className="font-black uppercase tracking-[0.2em] text-xs">Loading Arenas...</p>
             </div>
          ) : (
            tournaments.map((t, index) => (
              <TournamentCard 
                key={t.id} 
                tournament={t} 
                delay={index * 0.1}
                onRegister={() => handleViewDetails(t.id.toString())} 
              />
            ))
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
