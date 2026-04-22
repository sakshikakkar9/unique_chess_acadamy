import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const usePublicGallery = (category?: string) => {
  return useQuery({
    queryKey: ["public-gallery", category],
    queryFn: async () => {
      const response = await api.get("/gallery", {
        params: { category }
      });
      return response.data;
    },
  });
};