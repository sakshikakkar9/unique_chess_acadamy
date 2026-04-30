import { motion } from "framer-motion";
import { GalleryImage } from "@/types";

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
}

export default function GalleryItem({ image, index }: GalleryItemProps) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl border border-[#e2e8f0] transition-smooth hover:shadow-xl">
      <img
        src={image.imageUrl}
        alt={image.caption || "Academy photo"}
        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/40 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100 flex flex-col justify-end p-8 z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-white font-bold text-xl mb-4 leading-tight"
        >
          {image.caption}
        </motion.p>
        <div className="flex items-center gap-3">
          <div className="h-[2px] w-6 bg-[#d97706]" />
          <span className="text-[11px] font-bold text-[#d97706] uppercase tracking-widest">
            {image.category}
          </span>
        </div>
      </div>
    </div>
  );
}
