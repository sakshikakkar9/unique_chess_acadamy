import api from "@/lib/api";
import { GalleryImage } from "@/types";

export const galleryService = {
  getAll: async (): Promise<GalleryImage[]> => {
    const response = await api.get("/gallery");
    return response.data;
  },

  create: async (image: Omit<GalleryImage, "id"> | FormData): Promise<GalleryImage> => {
    // Note: If you upload real files, you might pass FormData here. 
    // Axios handles both JSON and FormData beautifully.
    const response = await api.post("/gallery", image);
    return response.data;
  },

  update: async (id: string, image: Partial<GalleryImage>): Promise<GalleryImage> => {
    const response = await api.put(`/gallery/${id}`, image);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/gallery/${id}`);
  },
};