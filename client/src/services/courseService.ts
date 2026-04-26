import api from "@/lib/api";
import { AgeGroup, Course, CourseEnrollment } from "@/types";

export const courseService = {
  // ── Courses ────────────────────────────────────────────────────────────────
  getAll: async (): Promise<Course[]> => {
    const res = await api.get("/courses");
    return res.data;
  },

  getByAgeGroup: async (ageGroup: AgeGroup): Promise<Course[]> => {
    const res = await api.get(`/courses/age-group/${ageGroup}`);
    return res.data;
  },

  getById: async (id: number): Promise<Course> => {
    const res = await api.get(`/courses/${id}`);
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

  // ── Image Upload ───────────────────────────────────────────────────────────
  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("image", file);
    const res = await api.post("/courses/upload-image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.imageUrl as string;
  },

  // ── Enrollments ────────────────────────────────────────────────────────────
  enroll: async (
    courseId: number,
    data: { studentName: string; email: string; phone: string; message?: string }
  ): Promise<CourseEnrollment> => {
    const res = await api.post(`/courses/${courseId}/enroll`, data);
    return res.data.data as CourseEnrollment;
  },

  getAllEnrollments: async (): Promise<CourseEnrollment[]> => {
    const res = await api.get("/courses/enrollments");
    return res.data;
  },

  updateEnrollmentStatus: async (
    enrollmentId: number,
    status: string
  ): Promise<CourseEnrollment> => {
    const res = await api.patch(`/courses/enrollments/${enrollmentId}`, { status });
    return res.data.data as CourseEnrollment;
  },
};
