import React, { useRef, useState, useMemo } from "react";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import DataTable from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, Loader2, X, Search, ChevronLeft, ChevronRight, BookOpen, Layers } from "lucide-react";
import { AGE_GROUP_LABELS, AGE_GROUP_RANGES, AgeGroup } from "@/types";
import { courseService } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

const AdminCourses = () => {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useAdminCourses();
  const { toast } = useToast();

  // State for Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ ageGroup: "ADULTS" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Search, Filter & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState<AgeGroup | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const getImageUrl = (path: string) => path;

  // Filtering Logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterGroup === "ALL" || course.ageGroup === filterGroup;
      return matchesSearch && matchesFilter;
    });
  }, [courses, searchTerm, filterGroup]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterGroup]);

  const handleSave = async () => {
    try {
      // Process features: convert comma-separated string to array
      const processedData = {
        ...formData,
        features: typeof formData.features === 'string'
          ? formData.features.split(',').map((f: string) => f.trim()).filter((f: string) => f !== "")
          : formData.features
      };

      if (selectedCourse) {
        await updateCourse(selectedCourse.id, processedData);
        toast({ title: "Updated successfully" });
      } else {
        await addCourse(processedData);
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

  const categories = [
    { id: "ALL", label: "All Courses", icon: Layers },
    { id: "CHILDREN", label: "Children", icon: BookOpen },
    { id: "TEENAGERS", label: "Teenagers", icon: BookOpen },
    { id: "ADULTS", label: "Adults", icon: BookOpen },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground">Create, edit and manage your academy programs.</p>
        </div>
        <Button
          onClick={() => { setFormData({ ageGroup: "ADULTS" }); setSelectedCourse(null); setIsModalOpen(true); }}
          className="shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Search className="h-4 w-4" /> Search
            </h3>
            <Input
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="bg-card border rounded-xl p-2 shadow-sm">
            <div className="px-3 py-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Categories</h3>
            </div>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterGroup(cat.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    filterGroup === cat.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                  <span className="ml-auto text-[10px] bg-background/20 px-2 py-0.5 rounded-full">
                    {cat.id === "ALL" ? courses.length : courses.filter(c => c.ageGroup === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-4">
          <DataTable
            columns={[
              {
                header: "Course Info",
                accessorKey: "title",
                cell: (c: any) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {c.image ? (
                        <img src={getImageUrl(c.image)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{c.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{c.level} · {c.duration}</div>
                    </div>
                  </div>
                )
              },
              {
                header: "Age Group",
                accessorKey: "ageGroup",
                cell: (c: any) => (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {AGE_GROUP_LABELS[c.ageGroup as AgeGroup]}
                  </span>
                )
              },
              {
                header: "Pricing",
                accessorKey: "price",
                cell: (c: any) => <span className="font-semibold text-primary">{c.price || "Free"}</span>
              }
            ]}
            data={paginatedCourses}
            isLoading={isLoading}
            onEdit={(c) => {
              setSelectedCourse(c);
              setFormData({
                ...c,
                features: Array.isArray(c.features) ? c.features.join(", ") : c.features
              });
              setIsModalOpen(true);
            }}
            onDelete={(c) => { setSelectedCourse(c); setIsConfirmOpen(true); }}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-card border rounded-xl px-4 py-3 shadow-sm">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredCourses.length)}</span> of <span className="font-medium">{filteredCourses.length}</span> courses
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AdminFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedCourse ? "Update Course" : "Create New Course"}
        onSave={handleSave}
      >
        <div className="max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
          <div className="grid gap-6 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Course Title</Label>
              <Input
                value={formData.title || ""}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Chess Foundation for Beginners"
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Age Group</Label>
                <Select value={formData.ageGroup} onValueChange={(val) => set("ageGroup", val)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AGE_GROUP_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Skill Level</Label>
                <Input
                  value={formData.level || ""}
                  onChange={(e) => set("level", e.target.value)}
                  placeholder="e.g. Beginner"
                  className="h-11"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Min Age (Optional)</Label>
                <Input
                  type="number"
                  value={formData.minAge || ""}
                  onChange={(e) => set("minAge", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Max Age (Optional)</Label>
                <Input
                  type="number"
                  value={formData.maxAge || ""}
                  onChange={(e) => set("maxAge", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Duration</Label>
                <Input
                  value={formData.duration || ""}
                  onChange={(e) => set("duration", e.target.value)}
                  placeholder="e.g. 3 Months"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Price / Fees</Label>
                <Input
                  value={formData.price || ""}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="e.g. ₹2000/mo"
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Description</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Write a detailed description of the course curriculum..."
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Key Features (Comma separated)</Label>
              <Textarea
                value={formData.features || ""}
                onChange={(e) => set("features", e.target.value)}
                placeholder="FIDE Certified Coach, Weekly Tournaments, Study Material..."
                className="min-h-[80px] resize-none text-sm"
              />
            </div>

            <div className="pt-6 border-t">
              <Label className="text-sm font-semibold block mb-4">Course Banner Image</Label>
              {formData.image ? (
                <div className="relative aspect-video rounded-xl border-2 border-muted overflow-hidden group">
                  <img src={getImageUrl(formData.image)} className="w-full h-full object-cover" alt="Course preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => set("image", "")}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" /> Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full aspect-video rounded-xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                    {uploading ? <Loader2 className="animate-spin h-6 w-6" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                  </div>
                  <div className="text-xs text-muted-foreground">PNG, JPG or WebP (max. 5MB)</div>
                </button>
              )}
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </div>
          </div>
        </div>
      </AdminFormModal>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={() => deleteCourse(selectedCourse.id)}
        title="Delete Course?"
        description="This action cannot be undone. This will permanently delete the course and all associated data."
      />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default AdminCourses;
