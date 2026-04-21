import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Course } from "@/types";
import { courseService } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";

export const useAdminCourses = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. FETCH
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseService.getAll(),
  });

  // 2. ADD
  const addMutation = useMutation({
    mutationFn: (course: Omit<Course, "id">) => courseService.create(course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] }); // Auto-refreshes the list!
      toast({ title: "Success", description: "Course added successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to add course." });
    },
  });

  // 3. UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, course }: { id: string; course: Partial<Course> }) => 
      courseService.update(id, course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ title: "Success", description: "Course updated successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to update course." });
    },
  });

  // 4. DELETE
  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.delete(id),
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
    updateCourse: (id: string, course: Partial<Course>) => updateMutation.mutateAsync({ id, course }),
    deleteCourse: deleteMutation.mutateAsync,
    refresh: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  };
};