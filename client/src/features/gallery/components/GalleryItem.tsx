import { motion } from "framer-motion";
import { GalleryImage } from "@/types";

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
}

export default function GalleryItem({ image, index }: GalleryItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <img
        src={image.imageUrl} // ✅ Corrected from .url
        alt={image.caption || "Academy photo"} // ✅ Corrected from .alt
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6">
        <p className="text-white font-medium transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
          {image.caption}
        </p>
        <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mt-2">
          {image.category}
        </span>
      </div>
    </motion.div>
  );
}