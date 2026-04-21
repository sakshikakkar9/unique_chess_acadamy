import { useState, useEffect, useCallback } from "react";
import { GalleryImage } from "@/types";
import { galleryService } from "@/services/galleryService";
import { useToast } from "@/hooks/use-toast";

export const useAdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await galleryService.getAll();
      setImages(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch gallery images.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const addImage = async (image: Omit<GalleryImage, "id">) => {
    try {
      const newImage = await galleryService.create(image);
      setImages((prev) => [...prev, newImage]);
      toast({
        title: "Success",
        description: "Image added successfully.",
      });
      return newImage;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add image.",
      });
      throw err;
    }
  };

  const updateImage = async (id: string, image: Partial<GalleryImage>) => {
    try {
      const updatedImage = await galleryService.update(id, image);
      setImages((prev) => prev.map((img) => (img.id === id ? updatedImage : img)));
      toast({
        title: "Success",
        description: "Image updated successfully.",
      });
      return updatedImage;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update image.",
      });
      throw err;
    }
  };

  const deleteImage = async (id: string) => {
    try {
      await galleryService.delete(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast({
        title: "Success",
        description: "Image deleted successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image.",
      });
      throw err;
    }
  };

  return {
    images,
    isLoading,
    error,
    addImage,
    updateImage,
    deleteImage,
    refresh: fetchImages,
  };
};
