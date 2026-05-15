import React, { useRef, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
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
import { resolveStatus, ItemStatus } from "@/lib/statusUtils";
import { toDisplayDate, todayISO } from "@/lib/dateUtils";
import DatePickerField from "@/components/admin/DatePickerField";
import TimePickerField from "@/components/admin/TimePickerField";
import StatusBadge from "@/components/admin/StatusBadge";
import StatusActionMenu from "@/components/admin/StatusActionMenu";
import StatusFilterBar from "@/components/admin/StatusFilterBar";

const ITEMS_PER_PAGE = 8;
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AdminCourses = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { courses: fetchedCourses, isLoading, addCourse, updateCourse, deleteCourse } = useAdminCourses();
  const [courses, setCourses] = useState<any[]>([]);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (fetchedCourses) setCourses(fetchedCourses);
  }, [fetchedCourses]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<{
    item: any;
    newStatus: ItemStatus | 'restore';
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<any>({ 
    title: "",
    description: "",
    ageGroup: "ADULTS",
    skillLevel: "BEGINNER",
    mode: "ONLINE",
    days: [],
    fee: 0,
    classTime: "",
    startDate: "",
    endDate: "",
    enrollmentStart: "",
    enrollmentEnd: "",
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
  const [activeFilter, setActiveFilter] = useState("all");

  // Reset page when searching or filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, levelFilter, activeFilter]);

  const filteredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return [];
    return courses.filter((course: any) => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = levelFilter === "ALL" || course.skillLevel === levelFilter;
        const matchesStatus = activeFilter === 'all' || resolveStatus(course.startDate, course.endDate, course.status) === activeFilter;
        return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [courses, searchTerm, levelFilter, activeFilter]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title) errors.title = "Course title is required";
    if (formData.fee === undefined || formData.fee === "") errors.fee = "Course fee is required";

    const today = todayISO();

    // startDate required and not past:
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    } else if (formData.startDate < today) {
      errors.startDate = 'Start date cannot be in the past';
    }

    // endDate required and not before startDate:
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (
      formData.startDate &&
      formData.endDate < formData.startDate
    ) {
      errors.endDate = 'End date must be on or after start date';
    }

    // enrollmentEnd must be before startDate:
    if (
      formData.enrollmentEnd &&
      formData.startDate &&
      formData.enrollmentEnd > formData.startDate
    ) {
      errors.enrollmentEnd =
        'Enrollment must end before the course start date';
    }

    // enrollmentStart must be before enrollmentEnd:
    if (
      formData.enrollmentStart &&
      formData.enrollmentEnd &&
      formData.enrollmentStart > formData.enrollmentEnd
    ) {
      errors.enrollmentStart =
        'Enrollment open date must be before the deadline';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description || "");
      data.append("ageGroup", formData.ageGroup);
      data.append("skillLevel", formData.skillLevel);
      data.append("classTime", formData.classTime);
      if (formData.startDate) data.append("startDate", new Date(formData.startDate).toISOString());
      if (formData.endDate) data.append("endDate", new Date(formData.endDate).toISOString());
      if (formData.enrollmentStart) data.append("enrollmentStart", new Date(formData.enrollmentStart).toISOString());
      if (formData.enrollmentEnd) data.append("enrollmentEnd", new Date(formData.enrollmentEnd).toISOString());
      data.append("duration", formData.duration);
      data.append("fee", String(formData.fee));
      data.append("mode", formData.mode);
      data.append("contactDetails", formData.contactDetails);
      data.append("days", JSON.stringify(formData.days));
      data.append("posterOrientation", formData.posterOrientation);

      if (selectedFile) data.append("image", selectedFile);
      if (selectedBrochure) data.append("brochure", selectedBrochure);

      if (editingCourse?.id) {
        await updateCourse(editingCourse.id, data);
        success("Course updated successfully");
      } else {
        await addCourse(data);
        success("Course created successfully");
      }
      handleModalClose();
    } catch (err) {
      toastError("Failed to save course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (course: any) => {
    setIsDeleting(true);
    try {
      await api.delete(`/courses/${course.id}`);
      // Remove from local state:
      setCourses(prev => prev.filter(c => c.id !== course.id));
      setConfirmDelete(null);
      success('Course deleted');
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    } catch (err) {
      toastError('Failed to delete course');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalClose = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setSelectedCourse(null);
    setEditingCourse(null);
    setSelectedFile(null);
    setSelectedBrochure(null);
    setPreviewUrl("");
    setFormErrors({});
    setFormData({ 
      title: "",
      description: "",
      ageGroup: "ADULTS", 
      skillLevel: "BEGINNER", 
      mode: "ONLINE", 
      days: [], 
      fee: 0,
      classTime: "",
      startDate: "",
      endDate: "",
      enrollmentStart: "",
      enrollmentEnd: "",
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
    { key: 'displayStatus', label: 'Status' },
    { key: 'displayDays', label: 'Schedule', hiddenOn: 'mobile' },
    { key: 'displayFee', label: 'Course Fee', align: 'right' }
  ];

  const handleAdd = () => {
    setEditingCourse(null);
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
      mode: "ONLINE",
      days: [],
      fee: 0,
      classTime: "",
      startDate: "",
      endDate: "",
      enrollmentStart: "",
      enrollmentEnd: "",
      duration: "",
      contactDetails: "",
      posterOrientation: "LANDSCAPE",
      brochureUrl: ""
    });
    setIsModalOpen(true);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course); // set data FIRST
    setSelectedCourse(course);
    setFormData({
      ...course,
      posterOrientation: course.posterOrientation || "LANDSCAPE",
      startDate: dbDateToISO(course.startDate),
      endDate: dbDateToISO(course.endDate),
      enrollmentStart: dbDateToISO(course.enrollmentStart),
      enrollmentEnd: dbDateToISO(course.enrollmentEnd),
    });
    setPreviewUrl(course.custom_banner_url);
    setIsModalOpen(true); // open modal AFTER
  };

  const handleStatusChange = async (
    course: any,
    newStatus: ItemStatus | 'restore'
  ) => {
    const statusToSave = newStatus === 'restore' ? null : newStatus;

    try {
      const response = await api.patch(`/courses/status/${course.id}`, {
        status: statusToSave
      });

      if (!response.data) throw new Error('Failed to update status');

      // Update local state immediately:
      setCourses(prev => prev.map(c =>
        c.id === course.id
          ? { ...c, status: statusToSave }
          : c
      ));

      setConfirmStatus(null);
      const label = newStatus === 'restore'
        ? 'Restored to active'
        : `Marked as ${newStatus}`;
      success(label);
      queryClient.invalidateQueries({ queryKey: ["courses"] });

    } catch (err) {
      toastError('Failed to update status');
    }
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
          </div>
        </div>
      </div>
    ),
    displayStatus: <StatusBadge status={resolveStatus(c.startDate, c.endDate, c.status)} />,
    displayDays: (
      <div className="flex flex-wrap gap-1">
        {c.days?.slice(0, 3).map((day: string) => (
          <span key={day} className="text-[10px] font-bold text-uca-text-muted bg-uca-bg-elevated px-1.5 py-0.5 rounded border border-uca-border">
            {day.substring(0, 3)}
          </span>
        ))}
        {c.days?.length > 3 && <span className="text-[10px] font-bold text-uca-text-muted">+{c.days.length - 3}</span>}
      </div>
    ),
    displayFee: (
      <div className="font-bold text-uca-accent-blue tabular-nums">
        ₹{c.fee.toLocaleString()}
      </div>
    ),
    actions: (
      <StatusActionMenu
        currentStatus={resolveStatus(c.startDate, c.endDate, c.status)}
        onEdit={() => handleEdit(c)}
        onDelete={() => setConfirmDelete(c)}
        onStatusChange={(newStatus) => {
          if (newStatus === 'restore') {
            handleStatusChange(c, 'restore');
          } else {
            setConfirmStatus({ item: c, newStatus });
          }
        }}
      />
    )
  }));

  return (
    <AdminShell
      title="Course Management"
      subtitle="Manage your academy programs and schedules."
      actionLabel="New Course"
      onAction={handleAdd}
    >
      <div className="space-y-6">
        <StatusFilterBar
          items={courses}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search courses..."
        />

        {/* Table Area */}
        <AdminTable
          columns={columns}
          rows={rows}
          isLoading={isLoading}
          onRowClick={(c) => navigate(`/admin/courses/${c.id}/portal`)}
          onEdit={(row) => {
            const original = courses.find((c: any) => c.id === row.id);
            if (original) handleEdit(original);
          }}
          onDelete={(c) => setConfirmDelete(c)}
          entityName="courses"
          onAddFirst={handleAdd}
          renderActions={(row) => row.actions}
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
        onClose={handleModalClose}
        title={editingCourse ? "Update Program" : "Create Program"}
        footer={
          <>
            <Button variant="ghost" disabled={isSubmitting} onClick={handleModalClose} className="text-uca-text-muted hover:text-uca-text-primary">Cancel</Button>
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
                  {editingCourse ? "Save Changes" : "Create Course"}
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-6 py-2" key={editingCourse?.id ?? 'new'}>
          <div className="grid grid-cols-2 gap-4">
            <DatePickerField
              label="Starts On"
              value={formData.startDate || ""}
              onChange={(val) => setFormData({
                ...formData,
                startDate: val,
                endDate: formData.endDate && formData.endDate < val ? "" : formData.endDate,
                enrollmentEnd: formData.enrollmentEnd && formData.enrollmentEnd > val ? "" : formData.enrollmentEnd,
              })}
              minDate={todayISO()}
              required
              error={formErrors.startDate}
              helperText="Course event start date"
            />
            <DatePickerField
              label="Ends On"
              value={formData.endDate || ""}
              onChange={(val) => setFormData({...formData, endDate: val})}
              minDate={formData.startDate || todayISO()}
              required
              error={formErrors.endDate}
              helperText="Must be on or after start date"
            />
          </div>

          <div className="col-span-2">
            <p className="text-[10px] font-bold text-slate-400
                          uppercase tracking-widest mb-3 mt-2
                          flex items-center gap-2">
              <span className="w-4 h-px bg-slate-300" />
              Enrollment Window
              <span className="w-4 h-px bg-slate-300" />
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DatePickerField
              label="Enrollment Opens"
              value={formData.enrollmentStart}
              onChange={(val) => setFormData({
                ...formData,
                enrollmentStart: val,
                enrollmentEnd: formData.enrollmentEnd && formData.enrollmentEnd < val ? "" : formData.enrollmentEnd,
              })}
              minDate={todayISO()}
              maxDate={formData.startDate || undefined}
              error={formErrors.enrollmentStart}
              helperText="When students can begin enrolling"
            />
            <DatePickerField
              label="Enrollment Closes"
              value={formData.enrollmentEnd}
              onChange={(val) => setFormData({...formData, enrollmentEnd: val})}
              minDate={formData.enrollmentStart || todayISO()}
              maxDate={formData.startDate || undefined}
              error={formErrors.enrollmentEnd}
              helperText="Last day to enroll — before course starts"
            />
          </div>

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
              <TimePickerField
                label="Class Time"
                value={formData.classTime || ""}
                onChange={(val) => setFormData({...formData, classTime: val})}
              />
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
        isOpen={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        isLoading={isDeleting}
        title="Delete Course?" 
        description="This will permanently remove this program from the database." 
      />

      <ConfirmDialog
        isOpen={!!confirmStatus}
        title={`Mark as ${confirmStatus?.newStatus}?`}
        description={`This will mark the course as ${confirmStatus?.newStatus}.`}
        confirmLabel={`Yes, mark as ${confirmStatus?.newStatus}`}
        onConfirm={() => {
          if (confirmStatus) {
            handleStatusChange(confirmStatus.item, confirmStatus.newStatus);
          }
        }}
        onCancel={() => setConfirmStatus(null)}
      />
    </AdminShell>
  );
};

export default AdminCourses;
