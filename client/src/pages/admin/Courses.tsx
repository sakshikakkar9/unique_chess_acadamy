import React, { useRef, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import AdminShell from "@/components/admin/AdminShell";
import AdminModal from "@/components/admin/AdminModal";
import AdminTable, { AdminTableColumn } from "@/components/admin/AdminTable";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, Search, Calendar, BookOpen, X, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { AGE_GROUP_LABELS } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RichTextEditor from "@/components/shared/admin/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 8;
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AdminCourses = () => {
  const navigate = useNavigate();
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useAdminCourses();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  
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
    contactDetails: "",
    posterOrientation: "LANDSCAPE",
    brochureUrl: ""
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBrochure, setSelectedBrochure] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [levelFilter, setLevelFilter] = useState("ALL");

  // Reset page when searching or filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, levelFilter]);

  const filteredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return [];
    return courses.filter((course: any) => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = levelFilter === "ALL" || course.skillLevel === levelFilter;
        return matchesSearch && matchesLevel;
    });
  }, [courses, searchTerm, levelFilter]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
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
      data.append("posterOrientation", formData.posterOrientation);

      if (selectedFile) data.append("image", selectedFile);
      if (selectedBrochure) data.append("brochure", selectedBrochure);

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
    setEditingRecord(null);
    setSelectedFile(null);
    setSelectedBrochure(null);
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
      contactDetails: "",
      posterOrientation: "LANDSCAPE",
      brochureUrl: ""
    });
  };

  const toggleDay = (day: string) => {
    const currentDays = formData.days || [];
    const newDays = currentDays.includes(day) 
      ? currentDays.filter((d: string) => d !== day) 
      : [...currentDays, day];
    setFormData({ ...formData, days: newDays });
  };

  const getLevelPillStyles = (level: string) => {
    switch(level) {
      case "BEGINNER": return "bg-green-500/10 text-green-500";
      case "INTERMEDIATE": return "bg-blue-500/10 text-blue-500";
      case "ADVANCED": return "bg-purple-500/10 text-purple-500";
      default: return "bg-slate-500/10 text-uca-text-muted";
    }
  };

  const getModePillStyles = (mode: string) => {
    switch(mode) {
      case "ONLINE": return "bg-cyan-500/10 text-cyan-500";
      case "OFFLINE": return "bg-slate-500/10 text-uca-text-muted";
      case "HYBRID": return "bg-pink-500/10 text-pink-500";
      default: return "bg-slate-500/10 text-uca-text-muted";
    }
  };

  const columns: AdminTableColumn[] = [
    { key: 'title', label: 'Course Info', className: 'min-w-[200px]' },
    { key: 'days', label: 'Schedule', hiddenOn: 'mobile' },
    { key: 'fee', label: 'Course Fee', align: 'right' }
  ];

  const rows = paginatedCourses.map(c => ({
    ...c,
    title: (
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-uca-bg-elevated overflow-hidden shrink-0 border border-uca-border">
          <img src={c.custom_banner_url || "/placeholder.jpg"} className="size-full object-cover" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-uca-text-primary truncate">{c.title}</span>
          <div className="flex gap-1.5 mt-0.5">
            <span className={cn("text-[9px] font-black uppercase px-1.5 py-0.5 rounded", getLevelPillStyles(c.skillLevel))}>
              {c.skillLevel}
            </span>
            <span className={cn("text-[9px] font-black uppercase px-1.5 py-0.5 rounded", getModePillStyles(c.mode))}>
              {c.mode}
            </span>
          </div>
        </div>
      </div>
    ),
    days: (
      <div className="flex flex-wrap gap-1">
        {c.days?.slice(0, 3).map((day: string) => (
          <span key={day} className="text-[10px] font-bold text-uca-text-muted bg-uca-bg-elevated px-1.5 py-0.5 rounded border border-uca-border">
            {day.substring(0, 3)}
          </span>
        ))}
        {c.days?.length > 3 && <span className="text-[10px] font-bold text-uca-text-muted">+{c.days.length - 3}</span>}
      </div>
    ),
    fee: (
      <div className="font-bold text-uca-accent-blue tabular-nums">
        ₹{c.fee.toLocaleString()}
      </div>
    )
  }));

  return (
    <AdminShell
      title="Course Management"
      subtitle="Manage your academy programs and schedules."
      actionLabel="New Course"
      onAction={() => { closeModal(); setIsModalOpen(true); }}
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-uca-bg-surface border border-uca-border p-4 rounded-xl">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-uca-text-muted" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-uca-bg-base border-uca-border text-sm focus:ring-uca-accent-blue rounded-lg"
              />
            </div>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="h-10 w-40 bg-uca-bg-base border-uca-border text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Filter className="size-3.5 text-uca-text-muted" />
                  <SelectValue placeholder="Level" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                <SelectItem value="ALL">All Levels</SelectItem>
                {["BEGINNER", "INTERMEDIATE", "ADVANCED", "GRANDMASTER"].map(l => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-uca-accent-blue/10 rounded-full border border-uca-accent-blue/20">
            <BookOpen className="size-3.5 text-uca-accent-blue" />
            <span className="text-[10px] font-black uppercase tracking-widest text-uca-accent-blue">Total: {filteredCourses.length}</span>
          </div>
        </div>

        {/* Table Area */}
        <AdminTable
          columns={columns}
          rows={rows}
          isLoading={isLoading}
          onRowClick={(c) => navigate(`/admin/courses/${c.id}/portal`)}
          onEdit={(c) => {
            setSelectedCourse(c);
            setEditingRecord(c);
            setFormData({ ...c, posterOrientation: c.posterOrientation || "LANDSCAPE" });
            setPreviewUrl(c.custom_banner_url);
            setIsModalOpen(true);
          }}
          onDelete={(c) => { setSelectedCourse(c); setIsConfirmOpen(true); }}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-uca-bg-surface border border-uca-border rounded-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted">
              Page <span className="text-uca-accent-blue">{currentPage}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-9 border-uca-border bg-uca-bg-base hover:bg-uca-bg-elevated"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-9 border-uca-border bg-uca-bg-base hover:bg-uca-bg-elevated"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingRecord ? "Update Program" : "Create Program"}
        footer={
          <>
            <Button variant="ghost" onClick={closeModal} className="text-uca-text-muted hover:text-uca-text-primary">Cancel</Button>
            <Button onClick={handleSave} className="bg-uca-navy hover:bg-uca-navy-hover text-uca-text-primary font-bold px-8 h-10">
              {editingRecord ? "Save Changes" : "Create Course"}
            </Button>
          </>
        }
      >
        <div className="space-y-6 py-2" key={editingRecord?.id ?? 'new'}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Course Title</Label>
              <Input className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg" value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Fee (₹)</Label>
              <Input className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg" type="number" value={formData.fee || ""} onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Course Description</Label>
            <RichTextEditor
              value={formData.description || ""}
              onChange={(content) => setFormData({...formData, description: content})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Skill Level</Label>
              <Select value={formData.skillLevel} onValueChange={(v) => setFormData({...formData, skillLevel: v})}>
                <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED", "GRANDMASTER"].map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Class Mode</Label>
              <Select value={formData.mode} onValueChange={(v) => setFormData({...formData, mode: v})}>
                <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                  {["ONLINE", "OFFLINE", "HYBRID"].map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest flex items-center gap-2">
              <Calendar className="size-3.5 text-uca-accent-blue" /> Training Days
            </Label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all border",
                    formData.days?.includes(day)
                      ? "bg-uca-accent-blue border-uca-accent-blue text-uca-text-primary shadow-lg shadow-uca-accent-blue/20"
                      : "bg-uca-bg-elevated border-uca-border text-uca-text-muted hover:text-uca-text-primary"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Age Group Tag</Label>
              <Select value={formData.ageGroup} onValueChange={(v) => setFormData({...formData, ageGroup: v})}>
                <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                  {Object.entries(AGE_GROUP_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v as string}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Class Time</Label>
              <Input className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg" value={formData.classTime || ""} onChange={(e) => setFormData({...formData, classTime: e.target.value})} placeholder="e.g. 18:00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Duration</Label>
              <Input className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg" value={formData.duration || ""} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 4 Months" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Contact Details</Label>
              <Input className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg" value={formData.contactDetails || ""} onChange={(e) => setFormData({...formData, contactDetails: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Brochure (PDF)</Label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => setSelectedBrochure(e.target.files?.[0] || null)}
              />
              <div className={`h-11 px-4 border border-dashed rounded-lg flex items-center gap-2 transition-all ${selectedBrochure ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' : 'border-uca-border bg-uca-bg-elevated text-uca-text-muted'}`}>
                <Upload className="size-4" />
                <span className="text-[10px] font-bold uppercase truncate">{selectedBrochure ? selectedBrochure.name : "Upload Brochure PDF"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-uca-border">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Poster Orientation</Label>
            <RadioGroup value={formData.posterOrientation} onValueChange={(val) => setFormData({...formData, posterOrientation: val})} className="flex gap-4">
              <div className="flex items-center space-x-2 bg-uca-bg-elevated px-4 py-3 rounded-lg border border-uca-border cursor-pointer flex-1">
                <RadioGroupItem value="LANDSCAPE" id="landscape" />
                <Label htmlFor="landscape" className="font-bold text-xs cursor-pointer">Landscape</Label>
              </div>
              <div className="flex items-center space-x-2 bg-uca-bg-elevated px-4 py-3 rounded-lg border border-uca-border cursor-pointer flex-1">
                <RadioGroupItem value="PORTRAIT" id="portrait" />
                <Label htmlFor="portrait" className="font-bold text-xs cursor-pointer">Portrait</Label>
              </div>
            </RadioGroup>

            <div
              className={cn(
                "relative rounded-xl border border-dashed flex flex-col items-center justify-center overflow-hidden hover:bg-uca-bg-elevated cursor-pointer transition-all border-uca-border bg-uca-bg-base",
                formData.posterOrientation === 'PORTRAIT' ? "aspect-[3/4] max-w-[200px] mx-auto" : "aspect-video"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} className="size-full object-cover" />
                  <button onClick={(e) => { e.stopPropagation(); setPreviewUrl(""); setSelectedFile(null); }} className="absolute top-2 right-2 size-8 bg-uca-accent-red rounded-lg flex items-center justify-center shadow-lg">
                    <X className="size-4 text-uca-text-primary" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="size-6 text-uca-accent-blue mx-auto mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Upload {formData.posterOrientation}</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); } }} />
            </div>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={setIsConfirmOpen} 
        onConfirm={() => deleteCourse(selectedCourse.id)} 
        title="Delete Course?" 
        description="This will permanently remove this program from the database." 
      />
    </AdminShell>
  );
};

export default AdminCourses;
