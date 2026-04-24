import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const useTournamentRegistration = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => api.post("/tournaments/register", data),
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "Your entry has been recorded. We will verify your payment soon.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.response?.data?.error || "Please try again.",
      });
    }
  });
};