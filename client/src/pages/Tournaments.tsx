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
      <header className="relative min-h-[60vh] w-full flex items-center bg-[#020617] overflow-hidden pt-32 pb-20">
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
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-left">
            <motion.div variants={fadeLeft} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-8">
              <Trophy className="h-3.5 w-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Championship Hub</span>
            </motion.div>
            
            <motion.h1 variants={fadeLeft} className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              Prove Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Strategic Might</span>
            </motion.h1>
            
            <motion.p variants={fadeLeft} className="max-w-xl text-slate-400 text-lg leading-relaxed">
              "In chess, as in life, strategy is the art of making use of time and space."
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* STAT BAR */}
      <section className="relative z-20 -mt-20 mb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-[#0f172a] border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            {[
              { icon: Timer, label: "Blitz", desc: "3-5 Mins", color: "text-blue-400", bg: "group-hover:bg-blue-500/10" },
              { icon: Swords, label: "Rapid", desc: "15-30 Mins", color: "text-emerald-400", bg: "group-hover:bg-emerald-500/10" },
              { icon: Calendar, label: "Classical", desc: "90+ Mins", color: "text-sky-400", bg: "group-hover:bg-sky-500/10" },
              { icon: Medal, label: "Rated", desc: "Official ELO", color: "text-purple-400", bg: "group-hover:bg-purple-500/10" },
            ].map((stat, i) => (
              <div 
                key={stat.label} 
                className={cn(
                  "group relative flex flex-col md:flex-row items-center gap-4 py-6 px-4 md:py-10 md:px-8 transition-all duration-300 hover:bg-white/[0.02]",
                  i !== 3 && "md:border-r border-white/5"
                )}
              >
                <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-colors duration-300", stat.bg)}>
                  <stat.icon className={cn("h-7 w-7", stat.color)} />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[13px] font-bold text-white uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <p className="text-xs font-medium text-slate-400">{stat.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOURNAMENT GRID */}
      <section className="py-20 bg-white min-h-[600px]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Active Arenas</h2>
              <div className="h-1 w-12 bg-sky-500 mt-3 rounded-full" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="h-12 w-12 border-4 border-sky-500/10 border-t-sky-500 rounded-full animate-spin mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Arenas...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {tournaments.map((t, index) => (
                <motion.div 
                  key={t.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={index}
                  onClick={() => handleViewDetails(t.id.toString())}
                  className="group relative bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-sky-900/10 hover:border-sky-200 transition-all duration-500 flex flex-col h-full cursor-pointer"
                >
                  {/* Image Container with Fixed Aspect Ratio for Uniformity */}
                  <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={t.imageUrl || "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2000"}
                      alt={t.title}
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
                        t.posterOrientation === 'PORTRAIT' ? "object-top" : "object-center"
                      )}
                    />
                    <div className="absolute top-5 left-5 flex gap-2">
                      <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black text-sky-600 shadow-xl shadow-sky-900/5 uppercase tracking-widest border border-sky-50">
                        {t.category || 'Open'}
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
                          {/* LOGIC CHANGE: Uses startDate from new schema */}
                          {new Date(t.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                      {t.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 font-medium">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {t.location || 'Unique Chess Academy'}
                    </div>

                    <div className="flex flex-col mb-10">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prize Fund</span>
                      <span className="text-2xl font-bold text-slate-900">
                        {/* LOGIC CHANGE: Uses totalPrizePool from new schema */}
                        ₹{t.totalPrizePool?.toLocaleString() || 'TBD'}
                      </span>
                    </div>

                    <div
                      onClick={() => handleViewDetails(t.id.toString())}
                      className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between cursor-pointer group/btn"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-1">Entry Fee</span>
                        <span className="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                          ₹{t.entryFee?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="h-12 px-6 bg-slate-900 group-hover:bg-sky-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95">
                        <span className="text-xs font-bold uppercase tracking-widest">Enroll Now</span>
                        <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}