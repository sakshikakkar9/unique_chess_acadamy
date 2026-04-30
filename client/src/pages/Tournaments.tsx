import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { TournamentCard } from "@/features/tournaments/components/TournamentCard";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { Trophy, Calendar, Medal, Timer, Swords } from "lucide-react";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import { fadeLeft, scaleIn } from "@/components/shared/motion";

export default function TournamentsPage() {
  const { tournaments, isLoading } = useAdminTournaments();
  const navigate = useNavigate();

  const handleViewDetails = (tournamentId: string) => {
    navigate(`/tournaments/${tournamentId}`);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION (Dark) */}
      <header className="relative min-h-[60vh] w-full flex items-center bg-[#0f172a] overflow-hidden pt-32 pb-20">
        <SparkleCanvas density="full" />
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2000" alt="Chess" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <ScrollReveal variants={fadeLeft}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fffbeb] text-[#92400e] border border-[rgba(217,119,6,0.2)] mb-8">
              <Trophy className="h-3.5 w-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Competition Hub</span>
            </div>
            <h1 className="text-h1 text-white mb-6 playfair">
              Prove Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d97706] to-[#fbbf24]">Strategic Might</span>
            </h1>
          </ScrollReveal>
        </div>
      </header>

      {/* STAT BAR (Dark transition) */}
      <section className="py-16 bg-[#0d1421] relative z-10 border-y border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: Timer, label: "Blitz", desc: "3-5 Mins", color: "text-[#2563eb]" },
              { icon: Swords, label: "Rapid", desc: "15-30 Mins", color: "text-emerald-400" },
              { icon: Calendar, label: "Classical", desc: "90+ Mins", color: "text-[#d97706]" },
              { icon: Medal, label: "Rated", desc: "Official ELO", color: "text-purple-400" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.08} variants={scaleIn}>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <stat.icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white uppercase tracking-tight">{stat.label}</p>
                    <p className="text-label text-[#94a3b8]">{stat.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
        </div>
      </section>

      {/* TOURNAMENT CARDS (White) */}
      <section className="py-32 bg-white container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
             <div className="col-span-full flex flex-col items-center justify-center py-32 text-[#94a3b8]">
                <div className="h-12 w-12 border-4 border-[#2563eb]/20 border-t-[#2563eb] rounded-full animate-spin mb-6" />
                <p className="text-label">Loading Arenas...</p>
             </div>
          ) : (
            tournaments.map((t, index) => (
              <TournamentCard 
                key={t.id} 
                tournament={t} 
                delay={index * 0.08}
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
