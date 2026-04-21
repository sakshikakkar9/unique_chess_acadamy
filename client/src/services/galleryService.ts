import { GalleryImage } from "@/types";
import { galleryImages as initialImages } from "./mockData";

let galleryImages = [...initialImages];

export const galleryService = {
  getAll: async (): Promise<GalleryImage[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...galleryImages];
  },

  create: async (image: Omit<GalleryImage, "id">): Promise<GalleryImage> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newImage = { ...image, id: Math.random().toString(36).substr(2, 9) };
    galleryImages.push(newImage);
    return newImage;
  },

  update: async (id: string, image: Partial<GalleryImage>): Promise<GalleryImage> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const index = galleryImages.findIndex((img) => img.id === id);
    if (index === -1) throw new Error("Image not found");
    galleryImages[index] = { ...galleryImages[index], ...image };
    return galleryImages[index];
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    galleryImages = galleryImages.filter((img) => img.id !== id);
  },
};
