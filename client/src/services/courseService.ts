import api from "@/lib/api"; // Your custom axios instance
import { Course } from "@/types";

export const courseService = {
  getAll: async (): Promise<Course[]> => {
    const response = await api.get("/courses");
    return response.data;
  },

  getById: async (id: string): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  create: async (course: Omit<Course, "id">): Promise<Course> => {
    const response = await api.post("/courses", course);
    return response.data;
  },

  update: async (id: string, course: Partial<Course>): Promise<Course> => {
    const response = await api.put(`/courses/${id}`, course);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
};