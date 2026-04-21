import { GalleryImage } from "@/types";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
}

const GalleryItem = ({ image, index }: GalleryItemProps) => {
  return (
    <ScrollReveal delay={index * 0.05}>
      <div className="group relative aspect-square overflow-hidden rounded-2xl bg-card">
        <img
          src={image.url}
          alt={image.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              {image.category}
            </span>
            <p className="text-sm font-medium text-white">{image.alt}</p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default GalleryItem;
