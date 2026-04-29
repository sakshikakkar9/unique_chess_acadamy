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
import { AGE_GROUP_LABELS, AgeGroup } from "@/types";
import { courseService } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

const AdminCourses = () => {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useAdminCourses();
  const { toast } = useToast();
  
  // Modals & Selection State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ ageGroup: "ADULTS" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search, Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const getImageUrl = (path: string) => path;

  // --- Logic Functions ---

  const handleMenuClick = (menuId: string) => {
    setActiveTab(menuId);
    setCurrentPage(1); // Reset pagination when changing categories
  };

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Combined Filtering Logic
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === "ALL" || course.ageGroup === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [courses, searchTerm, activeTab]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const handleSave = async () => {
    try {
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
      toast({ variant: "destructive", title: "Save Failed", description: "Check server logs." });
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
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Course Management</h1>
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
        {/* Sidebar */}
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
              <button
                onClick={() => handleMenuClick("ALL")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === "ALL" ? "bg-slate-900 text-white shadow-md" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Layers className="h-4 w-4" /> All Courses
                <span className="ml-auto text-[10px] bg-background/20 px-2 py-0.5 rounded-full">{courses?.length || 0}</span>
              </button>
              
              {Object.entries(AGE_GROUP_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => handleMenuClick(value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    activeTab === value ? "bg-slate-900 text-white shadow-md" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  {label as string}
                  <span className="ml-auto text-[10px] bg-background/20 px-2 py-0.5 rounded-full">
                    {courses?.filter(c => c.ageGroup === value).length || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50/50">
               <h2 className="text-lg font-semibold text-gray-800">
                  {activeTab === "ALL" ? "All Programs" : AGE_GROUP_LABELS[activeTab as keyof typeof AGE_GROUP_LABELS]}
               </h2>
            </div>

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
                      {AGE_GROUP_LABELS[c.ageGroup as keyof typeof AGE_GROUP_LABELS]}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50/50">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredCourses.length)}</span> of <span className="font-medium">{filteredCourses.length}</span> entries
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Form Modal */}
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
                <Select
                  value={formData.ageGroup}
                  onValueChange={(val: AgeGroup) => {
                    const ageLimits: Record<AgeGroup, {min: number, max: number}> = {
                      CHILDREN: { min: 6, max: 12 },
                      TEENAGERS: { min: 13, max: 17 },
                      ADULTS: { min: 18, max: 99 }
                    };
                    setFormData((p: any) => ({
                      ...p,
                      ageGroup: val,
                      minAge: ageLimits[val].min,
                      maxAge: ageLimits[val].max
                    }));
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AGE_GROUP_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label as string}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Skill Level</Label>
                <Input value={formData.level || ""} onChange={(e) => set("level", e.target.value)} placeholder="e.g. Beginner" className="h-11" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Min Age (Auto)</Label>
                <Input value={formData.minAge || ""} readOnly disabled className="h-11 bg-muted" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Max Age (Auto)</Label>
                <Input value={formData.maxAge || ""} readOnly disabled className="h-11 bg-muted" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Duration</Label>
                <Input value={formData.duration || ""} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 3 Months" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Price / Fees</Label>
                <Input value={formData.price || ""} onChange={(e) => set("price", e.target.value)} placeholder="e.g. ₹2000/mo" className="h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Description</Label>
              <Textarea value={formData.description || ""} onChange={(e) => set("description", e.target.value)} className="min-h-[100px] resize-none" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Key Features (Comma separated)</Label>
              <Textarea value={formData.features || ""} onChange={(e) => set("features", e.target.value)} placeholder="FIDE Certified Coach, Study Material..." className="min-h-[80px] resize-none" />
            </div>

            <div className="pt-4 border-t">
              <Label className="text-sm font-semibold block mb-4">Course Banner</Label>
              {formData.image ? (
                <div className="relative aspect-video rounded-xl border overflow-hidden group">
                  <img src={getImageUrl(formData.image)} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="destructive" onClick={() => set("image", "")}><X className="h-4 w-4 mr-2" /> Remove</Button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                  {uploading ? <Loader2 className="animate-spin h-6 w-6" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
                  <span className="text-xs font-medium">Click to upload banner</span>
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
        description="This action cannot be undone."
      />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminCourses;