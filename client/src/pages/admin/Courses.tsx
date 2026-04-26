import React, { useRef, useState } from "react";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import DataTable, { Column } from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, Loader2, ImageIcon } from "lucide-react";
import { AgeGroup, AGE_GROUP_LABELS, AGE_GROUP_RANGES, Course } from "@/types";
import { courseService } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";

const AGE_GROUP_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: "CHILDREN",  label: `Children — ${AGE_GROUP_RANGES.CHILDREN}`  },
  { value: "TEENAGERS", label: `Teenagers — ${AGE_GROUP_RANGES.TEENAGERS}` },
  { value: "ADULTS",    label: `Adults — ${AGE_GROUP_RANGES.ADULTS}`    },
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800";

const EMPTY_FORM: Partial<Course> = {
  title: "",
  ageGroup: "ADULTS",
  minAge: undefined,
  maxAge: undefined,
  level: "",
  duration: "",
  description: "",
  image: "",
  price: "",
  features: [],
};

const AdminCourses: React.FC = () => {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useAdminCourses();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns: Column<Course>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (item) => (
        <div className="flex items-center gap-3">
          {item.image ? (
            <img src={item.image} alt={item.title} className="h-8 w-12 rounded object-cover" />
          ) : (
            <div className="h-8 w-12 rounded bg-muted flex items-center justify-center">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <span className="font-medium">{item.title}</span>
        </div>
      ),
    },
    {
      header: "Age Group",
      accessorKey: "ageGroup",
      cell: (item) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {AGE_GROUP_LABELS[item.ageGroup]} · {AGE_GROUP_RANGES[item.ageGroup]}
        </span>
      ),
    },
    { header: "Level",    accessorKey: "level"    },
    { header: "Duration", accessorKey: "duration" },
    {
      header: "Price",
      accessorKey: "price",
      cell: (item) => item.price || <span className="text-muted-foreground text-xs">Contact Us</span>,
    },
  ];

  const handleAdd = () => {
    setSelectedCourse(null);
    setFormData(EMPTY_FORM);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await courseService.uploadImage(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      toast({ title: "Image uploaded", description: "Image saved successfully." });
    } catch {
      toast({ variant: "destructive", title: "Upload failed", description: "Could not upload the image." });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const set = (key: keyof Course, value: unknown) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">Manage your academy's training programs.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Course
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

          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          {/* Age Group */}
          <div className="grid gap-2">
            <Label htmlFor="ageGroup">Age Group</Label>
            <Select
              value={formData.ageGroup || "ADULTS"}
              onValueChange={(val) => set("ageGroup", val as AgeGroup)}
            >
              <SelectTrigger id="ageGroup">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {AGE_GROUP_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min / Max Age */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="minAge">Min Age (optional)</Label>
              <Input
                id="minAge"
                type="number"
                placeholder="e.g. 6"
                value={formData.minAge ?? ""}
                onChange={(e) => set("minAge", e.target.value ? parseInt(e.target.value, 10) : undefined)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxAge">Max Age (optional)</Label>
              <Input
                id="maxAge"
                type="number"
                placeholder="e.g. 12"
                value={formData.maxAge ?? ""}
                onChange={(e) => set("maxAge", e.target.value ? parseInt(e.target.value, 10) : undefined)}
              />
            </div>
          </div>

          {/* Skill Level / Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="level">Skill Level</Label>
              <Input
                id="level"
                placeholder="e.g. Beginner"
                value={formData.level || ""}
                onChange={(e) => set("level", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g. 3 Months"
                value={formData.duration || ""}
                onChange={(e) => set("duration", e.target.value)}
              />
            </div>
          </div>

          {/* Price */}
          <div className="grid gap-2">
            <Label htmlFor="price">Price (optional)</Label>
            <Input
              id="price"
              placeholder="e.g. ₹5,000"
              value={formData.price || ""}
              onChange={(e) => set("price", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description || ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="grid gap-2">
            <Label>Course Image</Label>

            {/* Preview */}
            {formData.image && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                <img
                  src={formData.image}
                  alt="Course preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}

            {/* Upload button */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 flex-1"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
                ) : (
                  <><Upload className="h-4 w-4" /> Upload Image</>
                )}
              </Button>
            </div>

            {/* URL fallback */}
            <Input
              placeholder="Or paste an image URL"
              value={formData.image || ""}
              onChange={(e) => set("image", e.target.value)}
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
