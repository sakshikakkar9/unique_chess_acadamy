import { motion } from "framer-motion";
import { GalleryImage } from "@/types";

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
}

export default function GalleryItem({ image, index }: GalleryItemProps) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-[2.5rem] glass-card border-white/5 transition-smooth hover:border-[#38bdf8]/50 hover:shadow-2xl hover:shadow-[#3b82f6]/20">
      {/* Subtle border animation on hover */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-[#3b82f6] via-[#0ea5e9] to-[#f59e0b] [mask-image:linear-gradient(white,white)_padding-box,linear-gradient(white,white)] mask-composite:exclude rounded-[2.5rem] animate-[borderSpin_4s_linear_infinite]" />
      </div>

      <img
        src={image.imageUrl}
        alt={image.caption || "Academy photo"}
        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex flex-col justify-end p-8 z-10 backdrop-blur-[2px]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-white font-black text-xl uppercase tracking-tight mb-4"
        >
          {image.caption}
        </motion.p>
        <div className="flex items-center gap-3">
          <div className="h-[2px] w-8 bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
          <span className="accent-label text-[#f59e0b] font-black">
            {image.category}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes borderSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
