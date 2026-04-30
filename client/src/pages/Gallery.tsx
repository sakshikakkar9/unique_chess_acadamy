import { useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import GalleryItem from "@/features/gallery/components/GalleryItem";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Image as ImageIcon, Camera, LayoutGrid } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Footer from "@/components/layout/Footer";
import SparkleCanvas from "@/components/shared/SparkleCanvas";
import { scaleIn, stagger, fadeUp } from "@/components/shared/motion";

export default function GalleryPage() {
  const { images, filter, setFilter, categories, isLoading } = useGallery();

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION - Sophisticated Dark Header */}
      <header className="relative h-[55vh] min-h-[450px] flex items-center bg-[#020617] overflow-hidden pt-20">
        <SparkleCanvas density="subtle" />
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-8">
              <Camera className="h-3.5 w-3.5" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Visual Chronicle</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tighter">
              Moments of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Excellence</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed italic">
              A visual journey through strategy, victory, and the pursuit of mastery at Unique Chess Academy.
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* STICKY FILTER BAR - Modern Glass Design */}
      <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "relative px-7 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300",
                  filter === cat
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {filter === cat && (
                  <motion.div 
                    layoutId="activeFilter" 
                    className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {cat === "All" && <LayoutGrid className="h-3.5 w-3.5" />}
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GALLERY GRID */}
      <section className="py-24 bg-slate-50/50 min-h-[700px]">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="aspect-[4/3] animate-pulse rounded-[2rem] bg-slate-200 border border-slate-300" 
                />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key={filter}
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {images.length > 0 ? (
                  images.map((img, i) => (
                    <motion.div key={img.id} variants={scaleIn} layout>
                      <GalleryItem image={img} index={i} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    variants={fadeUp}
                    className="col-span-full flex flex-col items-center justify-center py-40 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white"
                  >
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                      <ImageIcon className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Moments Captured Yet</h3>
                    <p className="text-slate-500 italic">Check back soon for new gallery updates.</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}