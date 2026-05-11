import React from "react";
import { Trash2, Pencil, Image as PhotoIcon } from "lucide-react";
import { GalleryImage } from "@/types";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  images: GalleryImage[];
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
}

const GalleryCard = ({ image, onEdit, onDelete }: { image: GalleryImage, onEdit: (img: any) => void, onDelete: (img: any) => void }) => {
  const spanStyle = image.orientation === 'landscape'
    ? { gridColumn: 'span 2', gridRow: 'span 1' }
    : { gridColumn: 'span 1', gridRow: 'span 2' };

  return (
    <div
      style={spanStyle}
      className="relative overflow-hidden rounded-xl border border-uca-border group bg-uca-bg-surface shadow-sm"
    >
      <img
        src={image.imageUrl}
        alt={image.caption || 'Gallery image'}
        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Hover overlay with actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                    transition-opacity duration-200 flex items-end p-3">
        <div className="flex flex-col w-full gap-1">
          {image.caption && <p className="text-[10px] font-bold text-white line-clamp-1 mb-1">{image.caption}</p>}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => onEdit(image)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            >
              <Pencil className="size-4 text-white" />
            </button>
            <button
              onClick={() => onDelete(image)}
              className="p-2 rounded-lg bg-red-500/70 hover:bg-red-500/90 backdrop-blur-sm transition-colors"
            >
              <Trash2 className="size-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryGrid: React.FC<GalleryGridProps> = ({ images, onEdit, onDelete }) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4
                    text-uca-text-muted border-2 border-dashed border-uca-border rounded-2xl bg-uca-bg-surface">
        <div className="size-12 rounded-full bg-uca-bg-elevated flex items-center justify-center">
            <PhotoIcon className="size-6 opacity-40" />
        </div>
        <div className="text-center">
            <p className="text-sm font-bold text-uca-text-primary uppercase tracking-widest">No photos yet</p>
            <p className="text-xs text-uca-text-muted mt-1 font-medium">Upload your first image to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid gap-3 md:gap-4
        [grid-template-columns:repeat(2,1fr)]
        [grid-auto-rows:120px]
        sm:[grid-template-columns:repeat(3,1fr)]
        sm:[grid-auto-rows:140px]
        lg:[grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]
        lg:[grid-auto-rows:150px]"
      style={{ gridAutoFlow: 'dense' }}
    >
      {images.map((img) => (
        <GalleryCard key={img.id} image={img} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default GalleryGrid;
