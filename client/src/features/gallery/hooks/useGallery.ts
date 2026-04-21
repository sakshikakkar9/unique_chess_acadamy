import { useState, useMemo } from "react";
import { galleryImages } from "@/services/mockData";
import { GalleryImage } from "@/types";

export const useGallery = () => {
  const [filter, setFilter] = useState<string>("All");

  const filteredImages = useMemo(() => {
    if (filter === "All") return galleryImages;
    return galleryImages.filter((img) => img.category === filter);
  }, [filter]);

  const categories = ["All", "Training", "Tournaments", "Coaching", "Academy"];

  return {
    images: filteredImages,
    filter,
    setFilter,
    categories,
  };
};
