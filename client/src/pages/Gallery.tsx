import { useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import GalleryItem from "@/features/gallery/components/GalleryItem";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Image as PhotoIcon, Camera, LayoutGrid } from "lucide-react";
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
      <header className="relative min-h-auto pt-24 pb-12 md:min-h-[400px] md:pt-28 md:pb-16 lg:min-h-[480px] lg:pt-32 lg:pb-20 flex items-center bg-[#020617] overflow-hidden">
        <SparkleCanvas density="subtle" />
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-left max-w-3xl">
            <motion.div variants={fadeUp} className="text-xs font-semibold tracking-widest uppercase border border-white/20 bg-white/10 rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-6 text-white">
              <Camera className="h-3.5 w-3.5" />
              <span>Visual Chronicle</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4">
              Moments of <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Excellence</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
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
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-[2rem] bg-slate-200 border border-slate-300"
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
            <div className="text-6xl">📷</div>
            <p className="text-lg font-medium">Gallery coming soon</p>
            <p className="text-sm">Check back for photos from our tournaments and events</p>
          </div>
        ) : (
          <div
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            style={{
              gridAutoRows: '200px',
              gridAutoFlow: 'dense',
            }}
          >
            {images.map((img) => (
              <div
                key={img.id}
                style={{
                  gridColumn: `span ${img.orientation === 'landscape' ? '2' : '1'}`,
                  gridRow: `span ${img.orientation === 'portrait' ? '2' : '1'}`,
                }}
                className="relative overflow-hidden rounded-2xl bg-slate-100 group"
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption ?? 'Gallery'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg'; // Using placeholder from public
                  }}
                />
                {img.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}