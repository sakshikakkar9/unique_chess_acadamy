import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GalleryImage } from "@/types";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const useAdminGallery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. FETCH IMAGES
  const { 
    data: images = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const response = await api.get("/gallery");
      return response.data;
    },
  });

  // 2. ADD IMAGE
  const addMutation = useMutation({
    mutationFn: async (image: Omit<GalleryImage, "id"> | FormData) => {
      // If handling file uploads, you might pass FormData instead of standard JSON
      const response = await api.post("/gallery", image);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: "Success", description: "Image added successfully." });
    },
    onError: (err) => {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: "Failed to add image." });
    },
  });

  // 3. UPDATE IMAGE
  const updateMutation = useMutation({
    mutationFn: async ({ id, image }: { id: string; image: Partial<GalleryImage> }) => {
      const response = await api.put(`/gallery/${id}`, image);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: "Success", description: "Image updated successfully." });
    },
    onError: (err) => {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: "Failed to update image." });
    },
  });

  // 4. DELETE IMAGE
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/gallery/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: "Success", description: "Image deleted successfully." });
    },
    onError: (err) => {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: "Failed to delete image." });
    },
  });

  return {
    images,
    isLoading,
    error: error as Error | null,
    addImage: addMutation.mutateAsync,
    updateImage: (id: string, image: Partial<GalleryImage>) => updateMutation.mutateAsync({ id, image }),
    deleteImage: deleteMutation.mutateAsync,
    refresh: refetch, // Allows manual refresh if needed
  };
};