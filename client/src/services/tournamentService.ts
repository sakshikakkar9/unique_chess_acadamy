import { Tournament } from "@/types";
import { tournaments as initialTournaments } from "./mockData";

let tournaments = [...initialTournaments];

export const tournamentService = {
  getAll: async (): Promise<Tournament[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...tournaments];
  },

  create: async (tournament: Omit<Tournament, "id">): Promise<Tournament> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newTournament = { ...tournament, id: Math.random().toString(36).substr(2, 9) };
    tournaments.push(newTournament);
    return newTournament;
  },

  update: async (id: string, tournament: Partial<Tournament>): Promise<Tournament> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const index = tournaments.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Tournament not found");
    tournaments[index] = { ...tournaments[index], ...tournament };
    return tournaments[index];
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    tournaments = tournaments.filter((t) => t.id !== id);
  },
};
