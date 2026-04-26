import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Course } from "@/types";
import { courseService } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";

export const useAdminCourses = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: courses = [], isLoading, error } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: () => courseService.getAll(),
  });

  const addMutation = useMutation({
    mutationFn: (course: Omit<Course, "id" | "createdAt" | "updatedAt">) =>
      courseService.create(course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ title: "Success", description: "Course added successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to add course." });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, course }: { id: number; course: Partial<Course> }) =>
      courseService.update(id, course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ title: "Success", description: "Course updated successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to update course." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ title: "Success", description: "Course deleted successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete course." });
    },
  });

  return {
    courses,
    isLoading,
    error,
    addCourse: addMutation.mutateAsync,
    updateCourse: (id: number, course: Partial<Course>) =>
      updateMutation.mutateAsync({ id, course }),
    deleteCourse: (id: number) => deleteMutation.mutateAsync(id),
    refresh: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  };
};
