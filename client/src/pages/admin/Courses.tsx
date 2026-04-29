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
const API_BASE_URL = "http://localhost:5000";
const ITEMS_PER_PAGE = 5; // Adjust pagination limit here
const AdminCourses = () => {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useAdminCourses();
  const { toast } = useToast();
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
      const matchesFilter = filterGroup == "ALL" || course.ageGroup == filterGroup;
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

  // Sidebar Menu & Pagination State
  const [activeTab, setActiveTab] = useState<string>("ALL");
 
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

  // --- Client-Side Filtering & Pagination Logic ---
  const handleMenuClick = (menuId: string) => {
    setActiveTab(menuId);
    setCurrentPage(1); // Reset pagination when changing menu categories
  };

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (activeTab === "ALL") return courses;
    return courses.filter((c: any) => c.ageGroup === activeTab);
  }, [courses, activeTab]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Courses</h1>
          <p className="text-sm text-gray-500 mt-1">Select a category from the sidebar to view or manage specific programs.</p>
        </div>
        <Button 
          size="lg"
          onClick={() => { setFormData({ ageGroup: "ADULTS" }); setSelectedCourse(null); setIsModalOpen(true); }}
        >
          <Plus className="mr-2 h-5 w-5" /> Add Course
        </Button>
      </div>

      {/* Main Layout: Sidebar + Content Area */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR MENU */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Categories</h2>
            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => handleMenuClick("ALL")}
                className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "ALL" 
                    ? "bg-slate-900 text-white" 
                    : "text-gray-700 hover:bg-slate-100"
                }`}
              >
                <Layers className="mr-3 h-4 w-4" />
                All Courses
              </button>
              
              {Object.entries(AGE_GROUP_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => handleMenuClick(value)}
                  className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === value 
                      ? "bg-slate-900 text-white" 
                      : "text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  <BookOpen className="mr-3 h-4 w-4" />
                  {label as string}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* CONTENT AREA (Table & Pagination) */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Table Header showing active category */}
            <div className="px-6 py-4 border-b bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-800">
                {activeTab === "ALL" ? "All Courses" : AGE_GROUP_LABELS[activeTab as keyof typeof AGE_GROUP_LABELS]}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'})
                </span>
              </h2>
            </div>

            {filteredCourses.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No courses in this category</h3>
                <p className="text-gray-500 mt-1">Click "Add Course" to create one.</p>
              </div>
            ) : (
              <>
                <DataTable 
                  columns={[
                    { header: "Title", accessorKey: "title" },
                    { header: "Age Group", accessorKey: "ageGroup" },
                    { header: "Level", accessorKey: "level" },
                    { header: "Price", accessorKey: "price" }
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
                    <p className="text-sm text-gray-500">
                      Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredCourses.length)}</span> of <span className="font-medium">{filteredCourses.length}</span> entries
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Admin Form Modal */}
      <AdminFormModal open={isModalOpen} onOpenChange={setIsModalOpen} title={selectedCourse ? "Edit Course" : "Add New Course"} onSave={handleSave}>
        {/* Form content remains exactly the same */}
        <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Course Title</Label>
              <Input value={formData.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Chess Foundation" />

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
                      <SelectItem key={value} value={value}>{label as string}</SelectItem>
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

        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

      `}</style>
    </div>
  );
};

export default AdminCourses;
