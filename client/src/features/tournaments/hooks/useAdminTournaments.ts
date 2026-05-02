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
      // The backend now sends data sorted by 'startDate'
      return res.data;
    }
  });

  const addMutation = useMutation({
    mutationFn: (newTournament: any) => api.post("/tournaments/admin/create", newTournament),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast({ title: "Success", description: "Tournament created successfully." });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive", 
        title: "Failed", 
        description: error.response?.data?.error || "Check your network or data format." 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      api.put(`/tournaments/admin/update/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast({ title: "Updated", description: "Tournament details have been synced." });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.response?.data?.error || "Could not save changes."
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/tournaments/admin/delete/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast({ title: "Deleted", description: "Tournament removed from database." });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Delete Failed",
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