import React, { useRef, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import AdminShell from "@/components/admin/AdminShell";
import AdminModal from "@/components/admin/AdminModal";
import AdminTable, { AdminTableColumn } from "@/components/admin/AdminTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, Search, Calendar, BookOpen, X, Filter, ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { AGE_GROUP_LABELS } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RichTextEditor from "@/components/shared/admin/RichTextEditor";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import DatePickerField from "@/components/admin/DatePickerField";
import TimePickerField from "@/components/admin/TimePickerField";
import RowActionMenuExtended from "@/components/admin/RowActionMenuExtended";
import { formatDateDisplay, formatTimeDisplay, todayISO, getStatusFromDates } from "@/lib/dateUtils";
import api from "@/lib/api";

const ITEMS_PER_PAGE = 8;
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AdminCourses = () => {
  const navigate = useNavigate();
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useAdminCourses();
  const { success, error: toastError } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<any>({ 
    title: "",
    description: "",
    ageGroup: "ADULTS",
    skillLevel: "BEGINNER",
    startDate: todayISO(),
    startTime: "09:00",
    endDate: "",
    endTime: "18:00",
    regDeadlineDate: "",
    regDeadlineTime: "23:59",
    mode: "ONLINE",
    status: "UPCOMING",
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
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Reset page when searching or filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  const filteredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return [];
    return courses.filter((course: any) => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const status = getStatusFromDates(course.startDate, course.endDate, course.status).toUpperCase();
        const matchesFilter = activeFilter === "ALL" || status === activeFilter;
        return matchesSearch && matchesFilter;
    });
  }, [courses, searchTerm, activeFilter]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title) errors.title = "Course title is required";
    if (formData.fee === undefined || formData.fee === "") errors.fee = "Course fee is required";

    if (!formData.startDate) {
      errors.startDate = 'Enrollment start is required';
    }
    if (!formData.startTime) errors.startTime = 'Start time is required';

    if (!formData.endDate) {
      errors.endDate = 'Enrollment end is required';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }

    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    } else if (formData.startDate === formData.endDate && formData.startTime && formData.endTime <= formData.startTime) {
      errors.endTime = 'End time must be after start time';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (['startDate', 'endDate', 'regDeadlineDate'].includes(key)) {
            if (formData[key]) data.append(key, new Date(formData[key]).toISOString());
          } else if (key === 'days') {
            data.append(key, JSON.stringify(formData[key]));
          } else if (key !== 'custom_banner_url' && key !== 'brochureUrl' && key !== 'imageUrl') {
            data.append(key, String(formData[key]));
          }
        }
      });

      if (selectedFile) data.append("image", selectedFile);
      if (selectedBrochure) data.append("brochure", selectedBrochure);

      if (selectedCourse) {
        await updateCourse(selectedCourse.id, data);
        success("Course updated successfully");
      } else {
        await addCourse(data);
        success("Course created successfully");
      }
      closeModal();
    } catch (err) {
      toastError("Failed to save course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    setIsDeleting(true);
    try {
      await deleteCourse(selectedCourse.id);
      success("Course removed successfully");
      setIsConfirmOpen(false);
    } catch (err) {
      toastError("Failed to delete course.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateStatus = async (courseId: string, status: string) => {
    try {
      await api.patch(`/courses/${courseId}/status`, { status });
      success(`Course marked as ${status.toLowerCase()}`);
      window.location.reload();
    } catch (err) {
      toastError("Failed to update status");
    }
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setSelectedCourse(null);
    setEditingRecord(null);
    setSelectedFile(null);
    setSelectedBrochure(null);
    setPreviewUrl("");
    setFormErrors({});
    setFormData({ 
      title: "",
      description: "",
      ageGroup: "ADULTS", 
      skillLevel: "BEGINNER", 
      startDate: todayISO(),
      startTime: "09:00",
      endDate: "",
      endTime: "18:00",
      regDeadlineDate: "",
      regDeadlineTime: "23:59",
      mode: "ONLINE", 
      status: "UPCOMING",
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
    { key: 'displayTitle', label: 'Course Info', className: 'min-w-[200px]' },
    { key: 'displaySchedule', label: 'Enrollment', hiddenOn: 'mobile' },
    { key: 'displayStatus', label: 'Status', align: 'right' }
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    setSelectedCourse(null);
    setSelectedFile(null);
    setSelectedBrochure(null);
    setPreviewUrl("");
    setFormErrors({});
    setFormData({
      title: "",
      description: "",
      ageGroup: "ADULTS",
      skillLevel: "BEGINNER",
      startDate: todayISO(),
      startTime: "09:00",
      endDate: "",
      endTime: "18:00",
      regDeadlineDate: "",
      regDeadlineTime: "23:59",
      mode: "ONLINE",
      status: "UPCOMING",
      days: [],
      fee: 0,
      classTime: "",
      duration: "",
      contactDetails: "",
      posterOrientation: "LANDSCAPE",
      brochureUrl: ""
    });
    setIsModalOpen(true);
  };

  const handleEdit = (c: any) => {
    setEditingRecord(c);
    setSelectedCourse(c);
    setFormData({
      ...c,
      startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : "",
      endDate: c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : "",
      regDeadlineDate: c.regDeadlineDate ? new Date(c.regDeadlineDate).toISOString().split('T')[0] : "",
      posterOrientation: c.posterOrientation || "LANDSCAPE"
    });
    setPreviewUrl(c.custom_banner_url);
    setIsModalOpen(true);
  };

  const rows = paginatedCourses.map(c => ({
    ...c,
    displayTitle: (
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
    displaySchedule: (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2 text-xs font-bold text-uca-text-primary">
          <Calendar className="size-3.5 text-uca-accent-blue" />
          {formatDateDisplay(c.startDate)} {c.startTime && `· ${formatTimeDisplay(c.startTime)}`}
        </div>
        {c.endDate && (
           <div className="text-[10px] text-uca-text-muted font-bold uppercase ml-5">
             until {formatDateDisplay(c.endDate)} {c.endTime && `· ${formatTimeDisplay(c.endTime)}`}
           </div>
        )}
      </div>
    ),
    displayStatus: <StatusBadge status={getStatusFromDates(c.startDate, c.endDate, c.status)} />,
    displayActions: (
      <RowActionMenuExtended
        onEdit={() => handleEdit(c)}
        onDelete={() => { setSelectedCourse(c); setIsConfirmOpen(true); }}
        onMarkCompleted={() => handleUpdateStatus(c.id, 'COMPLETED')}
        onMarkRejected={() => handleUpdateStatus(c.id, 'REJECTED')}
        currentStatus={getStatusFromDates(c.startDate, c.endDate, c.status)}
      />
    )
  }));

  const FILTERS = [
    { value: 'ALL', label: 'All' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'ONGOING', label: 'Ongoing' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  return (
    <AdminShell
      title="Course Management"
      subtitle="Manage your academy programs and schedules."
      actionLabel="New Course"
      onAction={handleAdd}
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-uca-bg-surface border border-uca-border p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative flex-1 w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-uca-text-muted" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-uca-bg-base border-uca-border text-sm focus:ring-uca-accent-blue rounded-lg"
              />
            </div>

            <div className="flex gap-1.5 p-1 bg-uca-bg-base rounded-lg overflow-x-auto scrollbar-none">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.value;
                const count = courses.filter(c => f.value === "ALL" ? true : getStatusFromDates(c.startDate, c.endDate, c.status).toUpperCase() === f.value).length;
                return (
                  <button
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2",
                      isActive
                        ? "bg-uca-navy text-white shadow-sm"
                        : "text-uca-text-muted hover:text-uca-text-primary"
                    )}
                  >
                    {f.label}
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-[9px]",
                      isActive ? "bg-white/20 text-white" : "bg-uca-bg-elevated text-uca-text-muted"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-uca-accent-blue/10 rounded-full border border-uca-accent-blue/20">
            <BookOpen className="size-3.5 text-uca-accent-blue" />
            <span className="text-[10px] font-black uppercase tracking-widest text-uca-accent-blue">Total: {filteredCourses.length}</span>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-uca-bg-surface border border-uca-border rounded-xl overflow-hidden">
          <AdminTable
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            onRowClick={(c) => navigate(`/admin/courses/${c.id}/portal`)}
            onEdit={(row) => {
              const original = courses.find((c: any) => c.id === row.id);
              if (original) handleEdit(original);
            }}
            onDelete={(c) => { setSelectedCourse(c); setIsConfirmOpen(true); }}
            entityName="courses"
            onAddFirst={handleAdd}
          />
        </div>

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
            <Button variant="ghost" disabled={isSubmitting} onClick={closeModal} className="text-uca-text-muted hover:text-uca-text-primary">Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-uca-navy hover:bg-uca-navy-hover text-white font-bold px-8 h-10 gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  {editingRecord ? "Save Changes" : "Create Course"}
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-6 py-2" key={editingRecord?.id ?? 'new'}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Course Title</Label>
              <Input
                className={cn(
                  "h-11 bg-uca-bg-elevated border-uca-border rounded-lg transition-all focus:ring-2 focus:ring-uca-navy/30 focus:border-uca-navy outline-none",
                  formErrors.title && "border-uca-accent-red ring-2 ring-red-100"
                )}
                value={formData.title || ""}
                onChange={(e) => {
                  setFormData({...formData, title: e.target.value});
                  if (formErrors.title) setFormErrors({...formErrors, title: ""});
                }}
              />
              {formErrors.title && <p className="text-[10px] text-uca-accent-red font-bold flex items-center gap-1"><X className="size-3" /> {formErrors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Fee (₹)</Label>
              <Input
                className={cn(
                  "h-11 bg-uca-bg-elevated border-uca-border rounded-lg transition-all focus:ring-2 focus:ring-uca-navy/30 focus:border-uca-navy outline-none",
                  formErrors.fee && "border-uca-accent-red ring-2 ring-red-100"
                )}
                type="number"
                value={formData.fee || ""}
                onChange={(e) => {
                  setFormData({...formData, fee: Number(e.target.value)});
                  if (formErrors.fee) setFormErrors({...formErrors, fee: ""});
                }}
              />
              {formErrors.fee && <p className="text-[10px] text-uca-accent-red font-bold flex items-center gap-1"><X className="size-3" /> {formErrors.fee}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-uca-text-muted uppercase tracking-widest">Enrollment Window</p>

            <div className="grid grid-cols-2 gap-4">
              <DatePickerField
                label="Start Date"
                value={formData.startDate}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, startDate: val, endDate: prev.endDate < val ? '' : prev.endDate }));
                  if (formErrors.startDate) setFormErrors({...formErrors, startDate: ""});
                }}
                required
                error={formErrors.startDate}
                helperText="DD/MM/YYYY"
              />
              <TimePickerField
                label="Start Time"
                value={formData.startTime}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, startTime: val }));
                  if (formErrors.startTime) setFormErrors({...formErrors, startTime: ""});
                }}
                required
                error={formErrors.startTime}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DatePickerField
                label="End Date"
                value={formData.endDate}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, endDate: val }));
                  if (formErrors.endDate) setFormErrors({...formErrors, endDate: ""});
                }}
                minDate={formData.startDate || todayISO()}
                required
                error={formErrors.endDate}
                helperText="Must be ≥ start date"
              />
              <TimePickerField
                label="End Time"
                value={formData.endTime}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, endTime: val }));
                  if (formErrors.endTime) setFormErrors({...formErrors, endTime: ""});
                }}
                required
                error={formErrors.endTime}
              />
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

          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Course Status</Label>
            <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
              <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
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
        isOpen={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Course?" 
        description="This will permanently remove this program from the database." 
      />
    </AdminShell>
  );
};

export default AdminCourses;
