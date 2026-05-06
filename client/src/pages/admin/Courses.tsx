import React, { useRef, useState, useMemo, useEffect } from "react";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import DataTable from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Search, Calendar, BookOpen, Layers } from "lucide-react";
import { AGE_GROUP_LABELS } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AdminCourses = () => {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useAdminCourses();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  const [formData, setFormData] = useState<any>({ 
    title: "",
    description: "",
    ageGroup: "ADULTS",
    skillLevel: "BEGINNER",
    mode: "ONLINE",
    days: [],
    fee: 0,
    classTime: "",
    duration: "",
    contactDetails: ""
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return [];
    return courses.filter((course: any) => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description || "");
      data.append("ageGroup", formData.ageGroup);
      data.append("skillLevel", formData.skillLevel);
      data.append("classTime", formData.classTime);
      data.append("duration", formData.duration);
      data.append("fee", String(formData.fee));
      data.append("mode", formData.mode);
      data.append("contactDetails", formData.contactDetails);
      data.append("days", JSON.stringify(formData.days));

      if (selectedFile) data.append("image", selectedFile);

      if (selectedCourse) {
        await updateCourse(selectedCourse.id, data);
        toast({ title: "Course Updated" });
      } else {
        await addCourse(data);
        toast({ title: "Course Created" });
      }
      closeModal();
    } catch (err) {
      toast({ variant: "destructive", title: "Operation Failed" });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData({ 
      title: "",
      description: "",
      ageGroup: "ADULTS", 
      skillLevel: "BEGINNER", 
      mode: "ONLINE", 
      days: [], 
      fee: 0,
      classTime: "",
      duration: "",
      contactDetails: ""
    });
  };

  const toggleDay = (day: string) => {
    const currentDays = formData.days || [];
    const newDays = currentDays.includes(day) 
      ? currentDays.filter((d: string) => d !== day) 
      : [...currentDays, day];
    setFormData({ ...formData, days: newDays });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Course Management</h1>
          <p className="text-muted-foreground">Manage your academy programs and schedules.</p>
        </div>
        <Button onClick={() => { closeModal(); setIsModalOpen(true); }} className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" /> Add New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <Label className="mb-2 block">Search Programs</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-9" 
                placeholder="Search by title..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="text-sm font-semibold mb-2">Quick Info</h4>
            <p className="text-xs text-muted-foreground">Total Courses: {filteredCourses.length}</p>
          </div>
        </div>

        {/* Table Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <DataTable
              columns={[
                { header: "Course Info", accessorKey: "title", cell: (c: any) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      <img 
                        src={c.custom_banner_url || "/placeholder.jpg"} 
                        alt=""
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{c.title}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{c.skillLevel} • {c.mode}</div>
                    </div>
                  </div>
                )},
                { header: "Schedule", accessorKey: "days", cell: (c: any) => (
                    <span className="text-xs">{c.days?.join(", ") || "No days set"}</span>
                )},
                { header: "Fee", accessorKey: "fee", cell: (c: any) => (
                    <span className="font-bold text-primary">₹{c.fee}</span>
                )}
              ]}
              data={paginatedCourses}
              isLoading={isLoading}
              onEdit={(c) => { 
                setSelectedCourse(c); 
                setFormData(c); 
                setPreviewUrl(c.custom_banner_url); 
                setIsModalOpen(true); 
              }}
              onDelete={(c) => { setSelectedCourse(c); setIsConfirmOpen(true); }}
            />
          </div>
        </div>
      </div>

      <AdminFormModal 
        open={isModalOpen} 
        onOpenChange={(val) => !val && closeModal()} 
        title={selectedCourse ? "Update Program" : "Create Program"} 
        onSave={handleSave}
      >
        <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Course Title</Label>
                <Input value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label>Fee (₹)</Label>
                <Input type="number" value={formData.fee || ""} onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Course Description</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Provide a detailed description of the course, its objectives, and what students will learn."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Skill Level</Label>
              <Select value={formData.skillLevel} onValueChange={(v) => setFormData({...formData, skillLevel: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED", "GRANDMASTER"].map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Class Mode</Label>
              <Select value={formData.mode} onValueChange={(v) => setFormData({...formData, mode: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["ONLINE", "OFFLINE", "HYBRID"].map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Training Days</Label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(day => (
                <Button 
                    key={day} 
                    type="button" 
                    variant={formData.days?.includes(day) ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => toggleDay(day)} 
                    className="rounded-full"
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Age Group Tag</Label>
                <Select value={formData.ageGroup} onValueChange={(v) => setFormData({...formData, ageGroup: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {Object.entries(AGE_GROUP_LABELS).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v as string}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Class Time (e.g. 18:00)</Label>
                <Input value={formData.classTime || ""} onChange={(e) => setFormData({...formData, classTime: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Duration (e.g. 4 Months)</Label>
                <Input value={formData.duration || ""} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label>Contact Details</Label>
                <Input value={formData.contactDetails || ""} onChange={(e) => setFormData({...formData, contactDetails: e.target.value})} />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="block font-bold">Course Banner</Label>
            <div
              className="relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden hover:bg-muted/50 cursor-pointer transition-all border-slate-200"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : (
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <span className="text-xs mt-2 block font-medium">Upload Banner</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                }}
              />
            </div>
          </div>
        </div>
      </AdminFormModal>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={setIsConfirmOpen} 
        onConfirm={() => deleteCourse(selectedCourse.id)} 
        title="Delete Course?" 
        description="This will permanently remove this program from the database." 
      />
    </div>
  );
};

export default AdminCourses;
