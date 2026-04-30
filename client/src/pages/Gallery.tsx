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
import { scaleIn } from "@/components/shared/motion";

export default function GalleryPage() {
  const { images, filter, setFilter, categories, isLoading } = useGallery();

  return (
    <div className="min-h-screen relative text-[#475569] selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden bg-[#0a0f1e] bg-gradient-to-b from-[#0f172a] to-[#0a0f1e]">
      <Navbar />

      {/* HERO SECTION (Dark Hero Mini) */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center bg-[#0f172a] overflow-hidden">
        <SparkleCanvas density="subtle" />
        <div className="container mx-auto px-6 z-10 text-center">
          <ScrollReveal variants={scaleIn}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] text-[#0ea5e9] border border-[#0ea5e9]/20 mb-8">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Gallery Highlights</span>
            </div>
            
            <h1 className="text-h1 text-white mb-6 playfair">
              Moments of <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9]">Excellence</span>
            </h1>
            
            <p className="text-[#94a3b8] max-w-2xl mx-auto text-body-lg">
              A visual chronicle of strategy, victory, and the journey toward mastery.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CATEGORY FILTER BAR */}
      <div className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 py-6 sticky top-[72px] z-30">
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-8 py-2.5 rounded-full text-[13px] font-medium transition-all duration-200 border",
                filter === cat
                  ? "bg-[#d97706] text-white border-[#d97706] shadow-[0_4px_12px_rgba(217,119,6,0.35)]"
                  : "bg-white/5 text-white/70 border-white/10 hover:border-white/20"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN GALLERY GRID */}
      <section className="relative z-10 py-24 bg-transparent">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {images.length > 0 ? (
                images.map((img, i) => (
                  <ScrollReveal key={img.id} delay={i * 0.05} variants={scaleIn}>
                    <GalleryItem image={img} index={i} />
                  </ScrollReveal>
                ))
              ) : (
                <div className="col-span-full text-center py-40 border-2 border-dashed border-[#e2e8f0] rounded-2xl">
                  <ImageIcon className="h-16 w-16 text-[#94a3b8]/30 mx-auto mb-6" />
                  <p className="text-[#0f172a] font-bold text-2xl uppercase tracking-widest">No Images Found</p>
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
