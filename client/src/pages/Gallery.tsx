import Navbar from "@/components/layout/Navbar";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { stagger, fadeLeft, fadeIn } from "@/components/shared/motion";

export default function GalleryPage() {
  const { images, filter, setFilter, categories, isLoading } = useGallery();

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <p className="text-sm font-medium">Gallery coming soon.</p>
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
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                {img.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-xs font-bold uppercase tracking-wider">{img.caption}</p>
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
