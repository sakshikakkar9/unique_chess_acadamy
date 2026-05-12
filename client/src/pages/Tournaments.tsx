import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { Trophy, Calendar, MapPin, ArrowRight } from "lucide-react";
import { fadeLeft, fadeIn, stagger } from "@/components/shared/motion";
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
    <div className="min-h-screen bg-white selection:bg-blue-600/30 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-[#070F1C] min-h-[560px] flex items-center overflow-hidden">
        {/* Chess pattern texture */}
        <div className="absolute inset-0 opacity-[0.035]"
             style={{
               backgroundImage: `linear-gradient(45deg,#fff 25%,transparent 25%),
                                 linear-gradient(-45deg,#fff 25%,transparent 25%),
                                 linear-gradient(45deg,transparent 75%,#fff 75%),
                                 linear-gradient(-45deg,transparent 75%,#fff 75%)`,
               backgroundSize: '32px 32px',
               backgroundPosition: '0 0,0 16px,16px -16px,-16px 0'
             }} />

        {/* Glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px]
                        bg-blue-600/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        w-full pt-24 sm:pt-28 pb-16 sm:pb-20">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
            {/* Eyebrow */}
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 mb-5
                            bg-blue-500/15 border border-blue-500/25 rounded-full
                            px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">
                Championship Hub
              </span>
            </motion.div>

            <motion.h1 variants={fadeLeft} className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
              Prove Your <br />
              <span className="text-blue-400">Strategic Might.</span>
            </motion.h1>
            <motion.p variants={fadeLeft} className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl mb-8">
              "In chess, as in life, strategy is the art of making use of time and space."
            </motion.p>
          </motion.div>
        </div>

        {/* Fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-20
                        bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* TOURNAMENT GRID */}
      <section className="py-14 sm:py-16 bg-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.15em] mb-2">
              The Arena
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Active Tournaments.
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="h-10 w-10 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Arenas...</p>
            </div>
          ) : tournaments.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-slate-400">
              <Trophy className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">No active tournaments found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {tournaments.map((t) => (
                <motion.div
                  key={t.id}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
                >
                  <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={t.imageUrl || "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2000"}
                      alt={t.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="mb-3">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                        {new Date(t.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1 leading-tight">
                      {t.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                      <MapPin className="size-3" />
                      <span className="line-clamp-1">{t.location || 'UCA Academy'}</span>
                    </div>

                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prize Fund</p>
                      <p className="text-lg font-bold text-slate-900">
                        ₹{t.totalPrizePool?.toLocaleString() || 'TBD'}
                      </p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-700">
                        ₹{t.entryFee?.toLocaleString() || '0'}
                      </div>
                      <button
                        onClick={() => handleViewDetails(t.id.toString())}
                        className="bg-slate-900 hover:bg-slate-700 text-white text-[10px] font-bold px-4 py-2 rounded-lg transition-colors duration-150 uppercase tracking-widest"
                      >
                        Enroll Now
                      </button>
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
