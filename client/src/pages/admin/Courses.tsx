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
import { Plus, Upload, X, Search, ChevronLeft, ChevronRight, BookOpen, Layers } from "lucide-react";
import { AGE_GROUP_LABELS, AgeGroup } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;
const SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "GRANDMASTER"];
const CLASS_MODES = ["ONLINE", "OFFLINE", "HYBRID"];
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AdminCourses = () => {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useAdminCourses();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ 
    ageGroup: "ADULTS", 
    skillLevel: "BEGINNER", 
    mode: "ONLINE",
    days: [] 
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "ALL" || course.ageGroup === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [courses, searchTerm, activeTab]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("ageGroup", formData.ageGroup);
      data.append("skillLevel", formData.skillLevel);
      data.append("classTime", formData.classTime);
      data.append("duration", formData.duration);
      data.append("fee", String(formData.fee));
      data.append("mode", formData.mode);
      data.append("contactDetails", formData.contactDetails);
      data.append("days", JSON.stringify(formData.days));

      if (selectedFile) data.append("banner", selectedFile);

      if (selectedCourse) {
        await updateCourse(selectedCourse.id, data);
        toast({ title: "Updated successfully" });
      } else {
        await addCourse(data);
        toast({ title: "Created successfully" });
      }
      closeModal();
    } catch (err) {
      toast({ variant: "destructive", title: "Save Failed" });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData({ ageGroup: "ADULTS", skillLevel: "BEGINNER", mode: "ONLINE", days: [] });
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-muted-foreground">Manage your academy programs based on Prisma Schema.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Course</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <div className="bg-card border rounded-xl p-2">
             <button onClick={() => setActiveTab("ALL")} className={cn("w-full text-left px-3 py-2 rounded-lg", activeTab === "ALL" && "bg-slate-900 text-white")}>All Courses</button>
             {Object.entries(AGE_GROUP_LABELS).map(([val, label]) => (
               <button key={val} onClick={() => setActiveTab(val)} className={cn("w-full text-left px-3 py-2 rounded-lg", activeTab === val && "bg-slate-900 text-white")}>{label as string}</button>
             ))}
          </div>
        </div>

        <div className="lg:col-span-9">
          <DataTable
            columns={[
              { header: "Course Info", accessorKey: "title", cell: (c: any) => (
                <div className="flex items-center gap-3">
                  <img src={c.bannerUrl || "/placeholder.jpg"} className="h-10 w-10 rounded object-cover" />
                  <div><div className="font-medium">{c.title}</div><div className="text-xs text-muted-foreground">{c.skillLevel} · {c.mode}</div></div>
                </div>
              )},
              { header: "Fee", accessorKey: "fee", cell: (c: any) => <span>₹{c.fee}</span> }
            ]}
            data={paginatedCourses}
            isLoading={isLoading}
            onEdit={(c) => { setSelectedCourse(c); setFormData(c); setPreviewUrl(c.bannerUrl); setIsModalOpen(true); }}
            onDelete={(c) => { setSelectedCourse(c); setIsConfirmOpen(true); }}
          />
        </div>
      </div>

      <AdminFormModal open={isModalOpen} onOpenChange={(val) => !val && closeModal()} title="Course Details" onSave={handleSave}>
        <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Title</Label><Input value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} /></div>
            <div className="space-y-1"><Label>Fee (₹)</Label><Input type="number" value={formData.fee || ""} onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})} /></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Skill Level</Label>
              <Select value={formData.skillLevel} onValueChange={(v) => setFormData({...formData, skillLevel: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SKILL_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Class Mode</Label>
              <Select value={formData.mode} onValueChange={(v) => setFormData({...formData, mode: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CLASS_MODES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Schedule Days</Label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(day => (
                <Button key={day} type="button" variant={formData.days?.includes(day) ? "default" : "outline"} size="sm" onClick={() => toggleDay(day)}>{day}</Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Class Time</Label><Input placeholder="e.g. 17:00" value={formData.classTime || ""} onChange={(e) => setFormData({...formData, classTime: e.target.value})} /></div>
            <div className="space-y-1"><Label>Duration</Label><Input placeholder="e.g. 60 mins" value={formData.duration || ""} onChange={(e) => setFormData({...formData, duration: e.target.value})} /></div>
          </div>

          <div className="space-y-1"><Label>Contact Details</Label><Input value={formData.contactDetails || ""} onChange={(e) => setFormData({...formData, contactDetails: e.target.value})} /></div>

          <div className="pt-2">
            <Label>Banner Image</Label>
            <div className="mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {previewUrl ? <img src={previewUrl} className="max-h-40 mx-auto rounded" /> : <span>Click to upload banner</span>}
              <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if(file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
              }} />
            </div>
          </div>
        </div>
      </AdminFormModal>
    </div>
  );
};

export default AdminCourses;
