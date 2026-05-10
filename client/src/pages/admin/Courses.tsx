import React, { useRef, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import DataTable from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
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
import AdminPageHeader from "@/components/shared/admin/AdminPageHeader";
import StatusBadge from "@/components/shared/admin/StatusBadge";

const ITEMS_PER_PAGE = 8;
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AdminCourses = () => {
  const navigate = useNavigate();
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
      case "BEGINNER": return { bg: "#f0fdf4", color: "#15803d" };
      case "INTERMEDIATE": return { bg: "#eff6ff", color: "#1d4ed8" };
      case "ADVANCED": return { bg: "#fdf4ff", color: "#7e22ce" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  const getModePillStyles = (mode: string) => {
    switch(mode) {
      case "ONLINE": return { bg: "#ecfeff", color: "#0e7490" };
      case "OFFLINE": return { bg: "#f8fafc", color: "#475569" };
      case "HYBRID": return { bg: "#fdf2f8", color: "#9d174d" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <AdminPageHeader
        title="Course Management"
        subtitle="Manage your academy programs and schedules."
        action={
          <Button onClick={() => { closeModal(); setIsModalOpen(true); }} className="shadow-lg bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" /> Add New Course
          </Button>
        }
      />

      {/* Standardized Filter Bar */}
      <div
        className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white"
        style={{
          border: '1px solid #e0eeff',
          padding: '14px 18px',
          borderRadius: '14px'
        }}
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                <Input
                    className="pl-10 h-11 w-full md:w-80 rounded-xl border-slate-200 focus:ring-sky-500"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="h-11 w-44 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-widest bg-white">
                    <div className="flex items-center gap-2">
                        <Filter className="h-3.5 w-3.5 text-slate-400" />
                        <SelectValue placeholder="Skill Level" />
                    </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                    <SelectItem value="ALL" className="font-bold text-[10px] uppercase tracking-widest py-3">All Levels</SelectItem>
                    {["BEGINNER", "INTERMEDIATE", "ADVANCED", "GRANDMASTER"].map(l => (
                        <SelectItem key={l} value={l} className="font-bold text-[10px] uppercase tracking-widest py-3">{l}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-sky-50/50 rounded-full border border-sky-100/50">
            <BookOpen className="h-4 w-4 text-sky-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">Total Courses: {filteredCourses.length}</span>
        </div>
      </div>

      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {isLoading ? (
          <div className="p-4 md:p-10 text-center bg-white rounded-2xl border border-slate-100">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0284c7] border-t-transparent mx-auto"></div>
            <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Loading Courses...</p>
          </div>
        ) : paginatedCourses.length > 0 ? (
          paginatedCourses.map((c: any) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4 group"
              onClick={() => navigate(`/admin/courses/${c.id}/portal`)}
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                  <img
                    src={c.custom_banner_url || "/placeholder.jpg"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-sky-600 transition-colors">{c.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '20px',
                        textTransform: 'uppercase',
                        ...getLevelPillStyles(c.skillLevel)
                      }}
                    >
                      {c.skillLevel}
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '20px',
                        textTransform: 'uppercase',
                        ...getModePillStyles(c.mode)
                      }}
                    >
                      {c.mode}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-[#0284c7] hover:bg-sky-50"
                    onClick={() => {
                      setSelectedCourse(c);
                      setFormData({
                        ...c,
                        posterOrientation: c.posterOrientation || "LANDSCAPE"
                      });
                      setPreviewUrl(c.custom_banner_url);
                      setIsModalOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" style={{ transform: 'rotate(45deg)' }} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-rose-500 hover:bg-rose-50"
                    onClick={() => { setSelectedCourse(c); setIsConfirmOpen(true); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Schedule</p>
                  <div className="flex flex-wrap gap-1">
                    {c.days?.slice(0, 3).map((day: string) => (
                      <span key={day} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{day.substring(0, 3)}</span>
                    ))}
                    {c.days?.length > 3 && <span className="text-[10px] font-bold text-slate-400">+{c.days.length - 3}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Course Fee</p>
                  <p className="text-sm font-bold text-sky-600">₹{c.fee.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <BookOpen className="h-10 w-10" />
              <p className="font-bold uppercase tracking-widest text-xs">No courses found</p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop View: Table */}
      <div
        className="bg-white overflow-hidden hidden md:block"
        style={{
          border: '1px solid #e0eeff',
          borderRadius: '14px'
        }}
      >
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#f0f6ff', borderBottom: '2px solid #bae6fd' }}>
                <th className="text-left px-6 py-[10px]" style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Course Info</th>
                <th className="text-left px-6 py-[10px]" style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Schedule</th>
                <th className="text-right px-6 py-[10px]" style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fee</th>
                <th className="text-right px-6 py-[10px]" style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0284c7] border-t-transparent mx-auto"></div>
                  </td>
                </tr>
              ) : paginatedCourses.length > 0 ? (
                paginatedCourses.map((c: any) => (
                  <tr
                    key={c.id}
                    className="group transition-all duration-120 cursor-pointer"
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onClick={() => navigate(`/admin/courses/${c.id}/portal`)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          <img
                            src={c.custom_banner_url || "/placeholder.jpg"}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-slate-900 leading-tight" style={{ fontSize: '13px' }}>{c.title}</div>
                          <div className="flex gap-2">
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '3px 9px',
                                borderRadius: '20px',
                                textTransform: 'uppercase',
                                ...getLevelPillStyles(c.skillLevel)
                              }}
                            >
                              {c.skillLevel}
                            </span>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '3px 9px',
                                borderRadius: '20px',
                                textTransform: 'uppercase',
                                ...getModePillStyles(c.mode)
                              }}
                            >
                              {c.mode}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.days?.slice(0, 3).map((day: string) => (
                          <span key={day} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{day.substring(0, 3)}</span>
                        ))}
                        {c.days?.length > 3 && <span className="text-[10px] font-bold text-slate-400">+{c.days.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div style={{ fontWeight: 700, color: '#0284c7', fontVariantNumeric: 'tabular-nums' }}>
                        ₹{c.fee.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-[#0284c7] hover:bg-sky-50"
                          onClick={() => {
                            setSelectedCourse(c);
                            setFormData({
                              ...c,
                              posterOrientation: c.posterOrientation || "LANDSCAPE"
                            });
                            setPreviewUrl(c.custom_banner_url);
                            setIsModalOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4" style={{ transform: 'rotate(45deg)' }} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-rose-500 hover:bg-rose-50"
                          onClick={() => { setSelectedCourse(c); setIsConfirmOpen(true); }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 md:py-20 text-center text-slate-400 text-sm">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>

      {/* Manual Pagination Controls */}
      {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-white border border-[#e0eeff] rounded-[14px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Showing page <span className="text-sky-600">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-9 rounded-lg px-3 sm:px-4 font-bold text-[10px] uppercase tracking-widest border-slate-200"
                  >
                      <ChevronLeft className="sm:mr-1 h-3.5 w-3.5" /> <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="h-9 rounded-lg px-3 sm:px-4 font-bold text-[10px] uppercase tracking-widest border-slate-200"
                  >
                      <span className="hidden sm:inline">Next</span> <ChevronRight className="sm:ml-1 h-3.5 w-3.5" />
                  </Button>
              </div>
          </div>
      )}

      <AdminFormModal 
        open={isModalOpen} 
        onOpenChange={(val) => !val && closeModal()} 
        title={selectedCourse ? "Update Program" : "Create Program"} 
        onSave={handleSave}
      >
        <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 py-2 scrollbar-thin">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course Title</Label>
                <Input className="h-11 rounded-xl" value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fee (₹)</Label>
                <Input className="h-11 rounded-xl" type="number" value={formData.fee || ""} onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course Description</Label>
            <RichTextEditor
              value={formData.description || ""}
              onChange={(content) => setFormData({...formData, description: content})}
              placeholder="Provide a detailed description of the course, its objectives, and what students will learn."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Skill Level</Label>
              <Select value={formData.skillLevel} onValueChange={(v) => setFormData({...formData, skillLevel: v})}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED", "GRANDMASTER"].map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class Mode</Label>
              <Select value={formData.mode} onValueChange={(v) => setFormData({...formData, mode: v})}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["ONLINE", "OFFLINE", "HYBRID"].map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Calendar className="h-4 w-4" /> Training Days</Label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(day => (
                <Button 
                    key={day} 
                    type="button" 
                    variant={formData.days?.includes(day) ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => toggleDay(day)} 
                    className={cn("rounded-full h-8 px-4 text-[10px] font-bold uppercase tracking-widest transition-all", formData.days?.includes(day) ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "text-slate-500 hover:bg-sky-50")}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Age Group Tag</Label>
                <Select value={formData.ageGroup} onValueChange={(v) => setFormData({...formData, ageGroup: v})}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {Object.entries(AGE_GROUP_LABELS).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v as string}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class Time (e.g. 18:00)</Label>
                <Input className="h-11 rounded-xl" value={formData.classTime || ""} onChange={(e) => setFormData({...formData, classTime: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration (e.g. 4 Months)</Label>
                <Input className="h-11 rounded-xl" value={formData.duration || ""} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Details</Label>
                <Input className="h-11 rounded-xl" value={formData.contactDetails || ""} onChange={(e) => setFormData({...formData, contactDetails: e.target.value})} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Course Brochure (PDF)</Label>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => setSelectedBrochure(e.target.files?.[0] || null)}
                />
                <div className={`h-11 px-4 border-2 border-dashed rounded-xl flex items-center gap-2 transition-all ${selectedBrochure ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                  <Upload className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase truncate">{selectedBrochure ? selectedBrochure.name : (formData.brochureUrl ? "Change Brochure" : "Upload Brochure")}</span>
                </div>
              </div>
              {formData.brochureUrl && !selectedBrochure && (
                 <a href={formData.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline text-[10px] font-black uppercase tracking-widest">View Current</a>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Poster & Orientation</Label>

            <RadioGroup
              value={formData.posterOrientation}
              onValueChange={(val) => setFormData({...formData, posterOrientation: val})}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 cursor-pointer flex-1">
                <RadioGroupItem value="LANDSCAPE" id="landscape" />
                <Label htmlFor="landscape" className="font-bold text-sm cursor-pointer">Landscape</Label>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 cursor-pointer flex-1">
                <RadioGroupItem value="PORTRAIT" id="portrait" />
                <Label htmlFor="portrait" className="font-bold text-sm cursor-pointer">Portrait</Label>
              </div>
            </RadioGroup>

            <div
              className={cn(
                "relative rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden hover:bg-slate-50 cursor-pointer transition-all border-slate-200 bg-slate-50/50",
                formData.posterOrientation === 'PORTRAIT' ? "aspect-[3/4] max-w-[240px] mx-auto" : "aspect-video"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} className="w-full h-full object-cover" />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl("");
                      setSelectedFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="text-center group">
                  <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto">
                    <Upload className="h-6 w-6 text-sky-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload Banner ({formData.posterOrientation})</span>
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
