import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Course } from "../../../types";
import { courseService } from "../../../services/courseService";
import { useToast } from "../../../hooks/use-toast";

export const useAdminCourses = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. Fetch all courses
  const { data: courses = [], isLoading, error } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: () => courseService.getAll(),
  });

  // 2. Add Course (Updated to accept FormData for Banner Uploads)
  const addMutation = useMutation({
    mutationFn: (courseData: FormData) => courseService.create(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ title: "Success", description: "Course created successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to create course." });
    },
  });

  // 3. Update Course (Updated to handle ID and FormData)
  const updateMutation = useMutation({
    mutationFn: ({ id, courseData }: { id: string; courseData: FormData }) =>
      courseService.update(id, courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ title: "Success", description: "Course updated successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to update course." });
    },
  });

  // 4. Delete Course (Updated id type to string to match cuid)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ title: "Success", description: "Course removed successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete course." });
    },
  });

  return {
    courses,
    isLoading,
    error,
    // Modular return functions
    addCourse: (courseData: FormData) => addMutation.mutateAsync(courseData),
    updateCourse: (id: string, courseData: FormData) =>
      updateMutation.mutateAsync({ id, courseData }),
    deleteCourse: (id: string) => deleteMutation.mutateAsync(id),
    refresh: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  };
};