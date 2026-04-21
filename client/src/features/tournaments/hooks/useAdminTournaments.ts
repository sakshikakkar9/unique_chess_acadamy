import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tournament } from "@/types";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const useAdminTournaments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. FETCH TOURNAMENTS
  const { 
    data: tournaments = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const response = await api.get("/tournaments");
      return response.data;
    },
  });

  // 2. ADD TOURNAMENT
  const addMutation = useMutation({
    mutationFn: async (tournament: Omit<Tournament, "id">) => {
      const response = await api.post("/tournaments", tournament);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast({ title: "Success", description: "Tournament added successfully." });
    },
    onError: (err) => {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: "Failed to add tournament." });
    },
  });

  // 3. UPDATE TOURNAMENT
  const updateMutation = useMutation({
    mutationFn: async ({ id, tournament }: { id: string; tournament: Partial<Tournament> }) => {
      const response = await api.put(`/tournaments/${id}`, tournament);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast({ title: "Success", description: "Tournament updated successfully." });
    },
    onError: (err) => {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: "Failed to update tournament." });
    },
  });

  // 4. DELETE TOURNAMENT
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/tournaments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast({ title: "Success", description: "Tournament deleted successfully." });
    },
    onError: (err) => {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: "Failed to delete tournament." });
    },
  });

  return {
    tournaments,
    isLoading,
    error: error as Error | null,
    addTournament: addMutation.mutateAsync,
    updateTournament: (id: string, tournament: Partial<Tournament>) => updateMutation.mutateAsync({ id, tournament }),
    deleteTournament: deleteMutation.mutateAsync,
    refresh: refetch,
  };
};