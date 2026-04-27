import React, { useRef, useState } from "react";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import DataTable from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, Loader2, ImageIcon, X } from "lucide-react";
import { AGE_GROUP_LABELS, AGE_GROUP_RANGES } from "@/types";
import { courseService } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:5000";

const AdminCourses = () => {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useAdminCourses();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ ageGroup: "ADULTS" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getImageUrl = (path: string) => path?.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const handleSave = async () => {
    try {
      if (selectedCourse) {
        await updateCourse(selectedCourse.id, formData);
        toast({ title: "Updated successfully" });
      } else {
        await addCourse(formData);
        toast({ title: "Created successfully" });
      }
      setIsModalOpen(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Save Failed", description: "Check server logs for database errors." });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await courseService.uploadImage(file);
      setFormData((p: any) => ({ ...p, image: url }));
      toast({ title: "Image uploaded" });
    } catch {
      toast({ variant: "destructive", title: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const set = (key: string, val: any) => setFormData((p: any) => ({ ...p, [key]: val }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        <Button onClick={() => { setFormData({ ageGroup: "ADULTS" }); setSelectedCourse(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      <DataTable 
        columns={[{ header: "Title", accessorKey: "title" }, { header: "Level", accessorKey: "level" }, { header: "Price", accessorKey: "price" }]} 
        data={courses} 
        isLoading={isLoading} 
        onEdit={(c) => { setSelectedCourse(c); setFormData(c); setIsModalOpen(true); }} 
        onDelete={(c) => { setSelectedCourse(c); setIsConfirmOpen(true); }} 
      />

      <AdminFormModal open={isModalOpen} onOpenChange={setIsModalOpen} title={selectedCourse ? "Edit" : "Add"} onSave={handleSave}>
        <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid gap-4 py-2">
            <Label>Course Title</Label>
            <Input value={formData.title || ""} onChange={(e) => set("title", e.target.value)} />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Age</Label>
                <Input type="number" value={formData.minAge || ""} onChange={(e) => set("minAge", e.target.value)} />
              </div>
              <div>
                <Label>Max Age</Label>
                <Input type="number" value={formData.maxAge || ""} onChange={(e) => set("maxAge", e.target.value)} />
              </div>
            </div>

            <Label>Description</Label>
            <Textarea value={formData.description || ""} onChange={(e) => set("description", e.target.value)} />

            <div className="pt-4 border-t">
              <Label className="font-bold">Course Image</Label>
              {formData.image && (
                <div className="relative mt-2 aspect-video rounded border overflow-hidden">
                  <img src={getImageUrl(formData.image)} className="w-full h-full object-cover" />
                  <Button size="icon" variant="destructive" className="absolute top-2 right-2" onClick={() => set("image", "")}><X /></Button>
                </div>
              )}
              <Button variant="outline" className="w-full mt-2 border-dashed" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="animate-spin" /> : <><Upload className="mr-2" /> Upload</>}
              </Button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
            </div>
          </div>
        </div>
      </AdminFormModal>

      <ConfirmDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen} onConfirm={() => deleteCourse(selectedCourse.id)} />
      
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
    </div>
  );
};

export default AdminCourses;