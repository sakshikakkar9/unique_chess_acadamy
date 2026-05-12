import React, { useState, useEffect } from "react";
import { Trash2, Pencil, Image as PhotoIcon } from "lucide-react";
import { GalleryImage } from "@/types";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  images: GalleryImage[];
  orientations: Record<string, 'landscape' | 'portrait' | 'square'>;
  onImageLoad: (id: string, e: React.SyntheticEvent<HTMLImageElement>) => void;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
}

const getSpanStyle = (
  orientation: 'landscape' | 'portrait' | 'square'
): React.CSSProperties => {
  switch (orientation) {
    case 'landscape':
      return { gridColumn: 'span 2', gridRow: 'span 1' };
    case 'portrait':
      return { gridColumn: 'span 1', gridRow: 'span 2' };
    case 'square':
    default:
      return { gridColumn: 'span 1', gridRow: 'span 1' };
  }
};

const GalleryCard = ({
  image,
  orientation,
  onImageLoad,
  onEdit,
  onDelete
}: {
  image: GalleryImage,
  orientation: 'landscape' | 'portrait' | 'square',
  onImageLoad: (id: string, e: React.SyntheticEvent<HTMLImageElement>) => void,
  onEdit: (img: GalleryImage) => void,
  onDelete: (img: GalleryImage) => void
}) => {
  return (
    <div
      style={getSpanStyle(orientation)}
      className="relative overflow-hidden rounded-xl border border-slate-200 group bg-slate-100 cursor-pointer"
    >
      <img
        src={image.imageUrl}
        alt={image.caption || 'Gallery image'}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onLoad={(e) => onImageLoad(image.id, e)}
        loading="lazy"
      />

      {/* Orientation badge — top left */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-[9px] font-bold uppercase tracking-wider bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
          {orientation}
        </span>
      </div>

      {/* Action buttons — top right */}
      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(image); }}
          className="p-1.5 rounded-lg bg-white/90 hover:bg-white shadow-sm transition-colors duration-150"
        >
          <Pencil className="size-3.5 text-slate-700" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(image); }}
          className="p-1.5 rounded-lg bg-red-500/90 hover:bg-red-500 shadow-sm transition-colors duration-150"
        >
          <Trash2 className="size-3.5 text-white" />
        </button>
      </div>

      {/* Title overlay — bottom */}
      {image.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-white text-xs font-medium truncate">
            {image.caption}
          </p>
        </div>
      )}
    </div>
  );
};

const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  orientations,
  onImageLoad,
  onEdit,
  onDelete
}) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
        <PhotoIcon className="size-12 opacity-30" />
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-500">No photos yet</p>
          <p className="text-xs text-slate-400 mt-1">Upload your first image using the button above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 w-full" style={getGridStyle()}>
      {images.map((img) => (
        <GalleryCard
          key={img.id}
          image={img}
          orientation={orientations[img.id] || 'square'}
          onImageLoad={onImageLoad}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;
