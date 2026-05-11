import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { Trophy, Calendar, Medal, Timer, Swords, MapPin, ChevronRight } from "lucide-react";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import { fadeLeft, fadeUp, stagger } from "@/components/shared/motion";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TournamentsPage() {
  const { tournaments, isLoading } = useAdminTournaments();
  const navigate = useNavigate();

  const handleViewDetails = (tournamentId: string) => {
    navigate(`/tournaments/${tournamentId}`);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative min-h-auto pt-24 pb-12 md:min-h-[400px] md:pt-28 md:pb-16 lg:min-h-[480px] lg:pt-32 lg:pb-20 w-full flex items-center bg-[#020617] overflow-hidden">
        <SparkleCanvas density="full" />
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2000" 
            alt="Chess Arena" 
            className="w-full h-full object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617]" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-left max-w-3xl">
            <motion.div variants={fadeLeft} className="text-xs font-semibold tracking-widest uppercase border border-white/20 bg-white/10 rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-6 text-white">
              <Trophy className="h-3.5 w-3.5" />
              <span>Championship Hub</span>
            </motion.div>
            
            <motion.h1 variants={fadeLeft} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4">
              Prove Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Strategic Might</span>
            </motion.h1>
            
            <motion.p variants={fadeLeft} className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
              "In chess, as in life, strategy is the art of making use of time and space."
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* STAT BAR */}
      <section className="relative z-20 -mt-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {[
              { icon: Timer, label: "Blitz", desc: "3-5 Mins", color: "text-blue-400" },
              { icon: Swords, label: "Rapid", desc: "15-30 Mins", color: "text-emerald-400" },
              { icon: Calendar, label: "Classical", desc: "90+ Mins", color: "text-sky-400" },
              { icon: Medal, label: "Rated", desc: "Official ELO", color: "text-purple-400" },
            ].map((stat) => (
              <div 
                key={stat.label} 
                className="flex flex-col sm:flex-row items-center gap-3 p-5 sm:p-6 bg-[#0f172a] transition-all duration-300 hover:bg-white/[0.05]"
              >
                <div className="p-3 rounded-xl bg-white/10 flex-shrink-0">
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm font-bold text-white uppercase tracking-wide">{stat.label}</p>
                  <p className="text-xs text-white/60">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOURNAMENT GRID */}
      <section className="py-12 md:py-16 bg-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">Active Arenas</h2>
              <div className="w-12 h-1 bg-blue-600 rounded mb-8" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="h-12 w-12 border-4 border-sky-500/10 border-t-sky-500 rounded-full animate-spin mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Arenas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tournaments.map((t, index) => {
                const isClosed = false; // Add real logic if available
                return (
                  <motion.div
                    key={t.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={index}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col h-full relative"
                  >
                    {/* Status Badge */}
                    <div className={cn(
                      "absolute top-3 left-3 z-10 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                      isClosed ? "bg-red-500" : "bg-green-500"
                    )}>
                      {isClosed ? "CLOSED" : "OPEN"}
                    </div>

                    {/* Banner Image */}
                    <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={t.imageUrl || "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2000"}
                        alt={t.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      {/* Start Date */}
                      <div className="mb-3">
                        <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide block">
                          {new Date(t.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">
                        {t.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{t.location || 'Unique Chess Academy'}</span>
                      </div>

                      {/* Prize Fund */}
                      <div className="mb-4">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-0.5">Prize Fund</span>
                        <span className="text-xl font-bold text-slate-900">
                          ₹{t.totalPrizePool?.toLocaleString() || 'TBD'}
                        </span>
                      </div>

                      {/* Bottom row */}
                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-700">
                          ₹{t.entryFee?.toLocaleString() || '0'}
                        </div>
                        <button
                          onClick={() => handleViewDetails(t.id.toString())}
                          className="bg-slate-900 hover:bg-slate-700 text-white text-[10px] font-semibold px-4 py-2 rounded-lg transition-colors duration-150 uppercase tracking-wider"
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}