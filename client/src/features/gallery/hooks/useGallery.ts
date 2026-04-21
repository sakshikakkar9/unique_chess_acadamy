import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { GalleryImage } from "@/types";

export const useGallery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. FETCH IMAGES (Public & Admin)
  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const response = await api.get("/gallery");
      return response.data;
    },
  });

  // 2. UPLOAD IMAGE (Admin Only)
  const uploadMutation = useMutation({
    // Note: If you are uploading actual files via Multer on the backend, 
    // newImage might be FormData. If it's just image URLs, it will be standard JSON.
    mutationFn: async (newImage: Omit<GalleryImage, "id"> | FormData) => {
      const response = await api.post("/gallery", newImage);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: "Success", description: "Image uploaded successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to upload image." });
    },
  });

  // 3. DELETE IMAGE (Admin Only)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/gallery/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: "Success", description: "Image deleted successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete image." });
    },
  });

  return {
    images,
    isLoading,
    error,
    uploadImage: uploadMutation.mutateAsync,
    deleteImage: deleteMutation.mutateAsync,
  };
};