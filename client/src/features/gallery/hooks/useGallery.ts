import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/lib/api";
import { GalleryImage } from "@/types";

export const useGallery = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("All");

  const { data: images = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      const response = await api.get("/gallery");
      return response.data;
    },
  });

  const categories = ["All", "TRAINING", "TOURNAMENT", "COACHING", "ACADEMY"];

  const filteredImages = filter === "All" 
    ? images 
    : images.filter(img => img.category.toUpperCase() === filter.toUpperCase());

  // Mutations for Admin
  const uploadMutation = useMutation({
    mutationFn: (newImage: FormData) =>
      api.post("/gallery", newImage, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => api.delete(`/gallery/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
  });

  return {
    images: filteredImages, // Use this for frontend
    rawImages: images,      // Use this for admin table
    isLoading,
    filter,
    setFilter,
    categories,
    uploadImage: uploadMutation.mutateAsync,
    deleteImage: deleteMutation.mutateAsync
  };
};