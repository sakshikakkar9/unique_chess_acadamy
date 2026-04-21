import { useState, useEffect, useCallback } from "react";
import { Course } from "@/types";
import { courseService } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";

export const useAdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getAll();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch courses.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const addCourse = async (course: Omit<Course, "id">) => {
    try {
      const newCourse = await courseService.create(course);
      setCourses((prev) => [...prev, newCourse]);
      toast({
        title: "Success",
        description: "Course added successfully.",
      });
      return newCourse;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add course.",
      });
      throw err;
    }
  };

  const updateCourse = async (id: string, course: Partial<Course>) => {
    try {
      const updatedCourse = await courseService.update(id, course);
      setCourses((prev) => prev.map((c) => (c.id === id ? updatedCourse : c)));
      toast({
        title: "Success",
        description: "Course updated successfully.",
      });
      return updatedCourse;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update course.",
      });
      throw err;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await courseService.delete(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast({
        title: "Success",
        description: "Course deleted successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete course.",
      });
      throw err;
    }
  };

  return {
    courses,
    isLoading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    refresh: fetchCourses,
  };
};
