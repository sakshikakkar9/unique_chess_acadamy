import api from "@/lib/api";
import { AgeGroup, Course, CourseEnrollment } from "@/types";

export const courseService = {
  getAll: async (): Promise<Course[]> => {
    const res = await api.get("/courses");
    return res.data;
  },

  create: async (course: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course> => {
    const res = await api.post("/courses", course);
    return res.data;
  },

  update: async (id: number, course: Partial<Course>): Promise<Course> => {
    const res = await api.put(`/courses/${id}`, course);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },

  // Updated to match your Controller's response: { success: true, imageUrl: "..." }
  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("image", file);
    const res = await api.post("/courses/upload-image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.imageUrl; 
  },

  enroll: async (courseId: number, data: any): Promise<CourseEnrollment> => {
    const res = await api.post(`/courses/${courseId}/enroll`, data);
    return res.data.data;
  }
};