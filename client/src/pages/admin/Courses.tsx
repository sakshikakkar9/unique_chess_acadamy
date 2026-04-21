import React, { useState } from "react";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import DataTable, { Column } from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Course } from "@/types";

const AdminCourses: React.FC = () => {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useAdminCourses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({});

  const columns: Column<Course>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (item) => <span className="font-medium">{item.title}</span>
    },
    { header: "Level", accessorKey: "level" },
    { header: "Duration", accessorKey: "duration" },
    {
      header: "Price",
      accessorKey: "price",
      cell: (item) => item.price || "Contact Us"
    },
  ];

  const handleAdd = () => {
    setSelectedCourse(null);
    setFormData({
      title: "",
      level: "",
      duration: "",
      description: "",
      image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800",
      price: "",
      features: [],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormData({ ...course });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setIsConfirmOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedCourse) {
        await updateCourse(selectedCourse.id, formData);
      } else {
        await addCourse(formData as Omit<Course, "id">);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedCourse) {
      await deleteCourse(selectedCourse.id);
      setIsConfirmOpen(false);
      setSelectedCourse(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">Manage your academy's training programs.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={courses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <AdminFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedCourse ? "Edit Course" : "Add New Course"}
        onSave={handleSave}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="level">Target Level/Age</Label>
              <Input
                id="level"
                placeholder="e.g. Ages 6-12"
                value={formData.level || ""}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g. 3 Months"
                value={formData.duration || ""}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price (Optional)</Label>
            <Input
              id="price"
              placeholder="e.g. ₹5,000"
              value={formData.price || ""}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
      </AdminFormModal>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        description={`Are you sure you want to delete "${selectedCourse?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminCourses;
