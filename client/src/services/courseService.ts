import { Course } from "@/types";
import { courses as initialCourses } from "./mockData";

let courses = [...initialCourses];

export const courseService = {
  getAll: async (): Promise<Course[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...courses];
  },

  getById: async (id: string): Promise<Course | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return courses.find((c) => c.id === id);
  },

  create: async (course: Omit<Course, "id">): Promise<Course> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newCourse = { ...course, id: Math.random().toString(36).substr(2, 9) };
    courses.push(newCourse);
    return newCourse;
  },

  update: async (id: string, course: Partial<Course>): Promise<Course> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const index = courses.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Course not found");
    courses[index] = { ...courses[index], ...course };
    return courses[index];
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    courses = courses.filter((c) => c.id !== id);
  },
};
