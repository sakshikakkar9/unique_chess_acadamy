import { useState, useEffect, useCallback } from "react";
import { Tournament } from "@/types";
import { tournamentService } from "@/services/tournamentService";
import { useToast } from "@/hooks/use-toast";

export const useAdminTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchTournaments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await tournamentService.getAll();
      setTournaments(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tournaments.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const addTournament = async (tournament: Omit<Tournament, "id">) => {
    try {
      const newTournament = await tournamentService.create(tournament);
      setTournaments((prev) => [...prev, newTournament]);
      toast({
        title: "Success",
        description: "Tournament added successfully.",
      });
      return newTournament;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add tournament.",
      });
      throw err;
    }
  };

  const updateTournament = async (id: string, tournament: Partial<Tournament>) => {
    try {
      const updatedTournament = await tournamentService.update(id, tournament);
      setTournaments((prev) => prev.map((t) => (t.id === id ? updatedTournament : t)));
      toast({
        title: "Success",
        description: "Tournament updated successfully.",
      });
      return updatedTournament;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tournament.",
      });
      throw err;
    }
  };

  const deleteTournament = async (id: string) => {
    try {
      await tournamentService.delete(id);
      setTournaments((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Success",
        description: "Tournament deleted successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete tournament.",
      });
      throw err;
    }
  };

  return {
    tournaments,
    isLoading,
    error,
    addTournament,
    updateTournament,
    deleteTournament,
    refresh: fetchTournaments,
  };
};
