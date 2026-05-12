import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Image as PhotoIcon, X, ZoomIn } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { stagger, fadeLeft, fadeIn } from "@/components/shared/motion";
import { GalleryImage } from "@/types";

export default function GalleryPage() {
  const { images, filter, setFilter, categories, isLoading } = useGallery();
  const [orientations, setOrientations] = useState<Record<string, 'landscape' | 'portrait' | 'square'>>({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageLoad = (id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    const ratio = el.naturalWidth / el.naturalHeight;
    const o = ratio > 1.2 ? 'landscape' : ratio < 0.85 ? 'portrait' : 'square';
    setOrientations(prev => ({ ...prev, [id]: o }));
  };

  const getGridStyle = (): React.CSSProperties => {
    if (windowWidth < 640) return {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridAutoRows: '150px',
      gridAutoFlow: 'dense',
    };
    if (windowWidth < 1024) return {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridAutoRows: '170px',
      gridAutoFlow: 'dense',
    };
    return {
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gridAutoRows: '180px',
      gridAutoFlow: 'dense',
    };
  };

  const getSpanStyle = (orientation: 'landscape' | 'portrait' | 'square'): React.CSSProperties => {
    switch (orientation) {
      case 'landscape': return { gridColumn: 'span 2', gridRow: 'span 1' };
      case 'portrait': return { gridColumn: 'span 1', gridRow: 'span 2' };
      default: return { gridColumn: 'span 1', gridRow: 'span 1' };
    }
  };

  const skeletonPattern: Array<'landscape' | 'portrait' | 'square'> = [
    'landscape', 'portrait', 'square',
    'square',    'landscape', 'portrait',
    'portrait',  'square',    'landscape',
  ];

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
                Visual Chronicle
              </span>
            </motion.div>

            <motion.h1 variants={fadeLeft} className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
              Moments of <br />
              <span className="text-blue-400">Excellence.</span>
            </motion.h1>
            <motion.p variants={fadeLeft} className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl mb-8">
              A visual journey through strategy, victory, and the pursuit of mastery at Unique Chess Academy.
            </motion.p>
          </motion.div>
        </div>

        {/* Fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-20
                        bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150",
                  filter === cat
                    ? "bg-blue-600 text-white"
                    : "bg-transparent border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
                )}
              >
                <span className="flex items-center gap-2">
                  {cat === "All" && <LayoutGrid className="size-3.5" />}
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GALLERY GRID */}
      <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px]">
        {isLoading ? (
          <div className="grid gap-3" style={getGridStyle()}>
            {skeletonPattern.map((o, i) => (
              <div
                key={i}
                style={getSpanStyle(o)}
                className="rounded-2xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
            <PhotoIcon className="size-12 opacity-30" />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-500">No photos yet</p>
              <p className="text-xs text-slate-400 mt-1">Check back soon for photos from our events</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 w-full" style={getGridStyle()}>
            {images.map((img) => (
              <div
                key={img.id}
                style={getSpanStyle(orientations[img.id] || 'square')}
                className="relative overflow-hidden rounded-2xl bg-slate-100 group cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption ?? 'Gallery'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onLoad={(e) => handleImageLoad(img.id, e)}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.parentElement!.style.display = 'none';
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center">
                      {img.caption && (
                        <p className="text-white text-sm font-medium">
                          {img.caption}
                        </p>
                      )}
                      <ZoomIn className="size-5 text-white/80" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X className="size-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.caption || "Full size gallery image"}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              {selectedImage.caption && (
                <p className="text-white text-center text-lg font-medium px-4">
                  {selectedImage.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
