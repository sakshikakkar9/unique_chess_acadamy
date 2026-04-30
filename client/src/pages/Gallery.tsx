import { useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import GalleryItem from "@/features/gallery/components/GalleryItem";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Footer from "@/components/layout/Footer";
import SparkleCanvas from "@/components/shared/SparkleCanvas";

export default function GalleryPage() {
  const { images, filter, setFilter, categories, isLoading } = useGallery();

  return (
    <div className="min-h-screen relative text-[#cbd5e1] selection:bg-sky-500/30 overflow-x-hidden bg-[#0a0f1e]">
      <SparkleCanvas />
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-32 flex items-center">
        <div className="container mx-auto px-6 z-10 text-center">
          <ScrollReveal direction="scale">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card-blue mb-10 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Sparkles className="h-4 w-4 text-[#38bdf8] animate-pulse" />
              <span className="accent-label text-[#38bdf8] font-black">Gallery Highlights</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter uppercase leading-none">
              Moments of <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9]">Excellence</span>
            </h1>
            
            <p className="text-[#94a3b8] max-w-2xl mx-auto text-xl leading-relaxed mb-20 font-medium">
              A visual chronicle of strategy, victory, and the journey toward mastery.
            </p>

            {/* Category Filter - Premium Buttons */}
            <div className="flex flex-wrap justify-center gap-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-smooth border-none backdrop-blur-xl",
                    filter === cat
                      ? "bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-110"
                      : "glass-card text-[#94a3b8] hover:text-white hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* MAIN GALLERY GRID */}
      <section className="relative z-10 pb-40">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square animate-pulse rounded-[3rem] glass-card bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {images.length > 0 ? (
                images.map((img, i) => (
                  <ScrollReveal key={img.id} delay={i * 0.05} direction="scale">
                    <GalleryItem image={img} index={i} />
                  </ScrollReveal>
                ))
              ) : (
                <div className="col-span-full text-center py-40 glass-card border-dashed border-white/10 rounded-[4rem]">
                  <ImageIcon className="h-24 w-24 text-[#3b82f6]/30 mx-auto mb-8" />
                  <p className="text-white font-black uppercase tracking-widest text-2xl">No Images Found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
