import api from "@/lib/api";
import { Tournament } from "@/types";

export const tournamentService = {
  getAll: async (): Promise<Tournament[]> => {
    const response = await api.get("/tournaments");
    return response.data;
  },

  getById: async (id: string): Promise<Tournament> => {
    const response = await api.get(`/tournaments/${id}`);
    return response.data;
  },

  create: async (tournament: Omit<Tournament, "id">): Promise<Tournament> => {
    const response = await api.post("/tournaments", tournament);
    return response.data;
  },

  update: async (id: string, tournament: Partial<Tournament>): Promise<Tournament> => {
    const response = await api.put(`/tournaments/${id}`, tournament);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tournaments/${id}`);
  },
};