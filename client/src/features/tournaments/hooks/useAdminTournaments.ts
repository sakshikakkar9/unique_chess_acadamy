import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const useAdminTournaments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const res = await api.get("/tournaments");
      return res.data;
    }
  });

  const addMutation = useMutation({
  // ✅ CHANGE: Add /admin/create to the path
  mutationFn: (newTournament: any) => api.post("/tournaments/admin/create", newTournament),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    toast({ title: "Success", description: "Tournament added." });
  },
  onError: (error: any) => {
    toast({ 
      variant: "destructive", 
      title: "Failed", 
      description: error.response?.data?.error || "Check your data." 
    });
  }
});

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/tournaments/admin/update/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast({ title: "Updated", description: "Changes saved to database." });
    }
  });

  const deleteMutation = useMutation({
  // ✅ CHANGE THIS: Add /admin/delete/ to the path
  mutationFn: (id: number) => api.delete(`/tournaments/admin/delete/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    toast({ title: "Deleted", description: "Tournament removed." });
  },
  // Added error handling to help diagnose issues
  onError: (error: any) => {
    toast({
      variant: "destructive",
      title: "Failed",
      description: error.response?.data?.error || "Failed to delete tournament."
    });
  }
});

  return {
    tournaments,
    isLoading,
    addTournament: addMutation.mutateAsync,
    updateTournament: (id: number, data: any) => updateMutation.mutateAsync({ id, data }),
    deleteTournament: (id: number) => deleteMutation.mutateAsync(id),
  };
};