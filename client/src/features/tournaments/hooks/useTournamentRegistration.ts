import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const useTournamentRegistration = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      // ✅ CHANGE: Extract tournamentId from FormData since it's no longer a simple object
      const tournamentId = formData.get("tournamentId");
      
      // ✅ CHANGE: Sending FormData requires 'multipart/form-data'
      // Most modern fetch/axios wrappers (like yours likely is) handle this automatically 
      // when they see a FormData object, but we await the full response here.
      const response = await api.post(`/tournaments/${tournamentId}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      return response.data;
    },
    onSuccess: (data) => {
      // ✅ CHANGE: Invalidate registrations so admin sees new data immediately
      queryClient.invalidateQueries({ queryKey: ["registrations"] });

      toast({
        title: "Registration Received!",
        description: `Ref ID: ${data.referenceId || 'Pending'}. We will verify your payment proof shortly.`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.response?.data?.error || "Could not process registration. Check your connection.",
      });
    }
  });
};