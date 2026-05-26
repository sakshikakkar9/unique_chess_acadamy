import { useState, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { 
  Trophy, 
  Trash2, Mail, Phone, Eye, BookOpen, Copy,
  Search, Filter, ExternalLink, ShieldCheck, CreditCard, Image as PhotoIcon,
  User, UserCheck, Loader2, Check
} from "lucide-react";
import AdminShell from "../../components/admin/AdminShell";
import AdminTable, { AdminTableColumn } from "../../components/admin/AdminTable";
import AdminModal from "../../components/admin/AdminModal";
import StatusBadge from "../../components/shared/admin/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import { useDemoAdmin } from "../../features/demo/hooks/useDemoRegistration";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { format } from "date-fns";
import { cn, getAvatarStyles } from "../../lib/utils";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import { RowActionMenu } from "../../components/admin/RowActionMenu";
import { StudentDetailSheet } from "../../components/admin/StudentDetailSheet";

type RegistrationTab = 'course' | 'tournament' | 'demo';

export default function RegistrationsPage() {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState<RegistrationTab>("course");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [pendingChanges, setPendingChanges] = useState<{ status?: string; paymentStatus?: string }>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");

  const qc = useQueryClient();

  // Data Fetching
  const { demos, refresh: refreshDemos } = useDemoAdmin();
  const { data: enrollments = [], refetch: refetchCourses, isLoading: enrollLoading } = useQuery({
    queryKey: ["course-enrollments"],
    queryFn: async () => (await api.get("/courses/enrollments")).data 
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => (await api.get("/courses")).data
  });

  const { data: registrations = [], refetch: refetchTournaments, isLoading: tournamentLoading } = useQuery({
    queryKey: ["registrations"], 
    queryFn: async () => (await api.get("/tournaments/admin/registrations/all")).data 
  });

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((item: any) => {
      const studentName = item.student?.fullName || item.studentName || "";
      const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchesCourse = courseFilter === "ALL" || item.course?.title === courseFilter;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [enrollments, searchTerm, statusFilter, courseFilter]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item: any) => {
      const studentName = item.student?.fullName || item.studentName || "";
      const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [registrations, searchTerm, statusFilter]);

  const filteredDemos = useMemo(() => {
    return (demos || []).filter((item: any) => {
      const studentName = item.studentName || "";
      const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [demos, searchTerm, statusFilter]);

  const handleAction = async (id: string | number, type: string, action: 'status' | 'delete' | 'paymentStatus' | 'bulk', payload?: any) => {
    const isDelete = action === 'delete';
    if (isDelete) setIsDeleting(true);
    else setIsSubmitting(true);

    const paths: any = {
      demo: `/demo/admin/${id}`,
      course: `/courses/enrollments/${id}`,
      tournament: `/tournaments/admin/registrations/${id}`
    };

    try {
      if (action === 'delete') {
        await api.delete(paths[type]);
      } else if (action === 'paymentStatus') {
        await api.patch(paths[type], { paymentStatus: payload });
      } else if (action === 'status') {
        await api.patch(paths[type], { status: payload });
      } else if (action === 'bulk') {
        await api.patch(paths[type], payload);
      }
      
      const queryKey = type === 'tournament' ? "registrations" : type === 'course' ? "course-enrollments" : type;
      qc.invalidateQueries({ queryKey: [queryKey] });
      if (type === 'demo') refreshDemos();

      // Update Detail Sheet if open and maintain dynamic content type references
      if (selectedItem && selectedItem.id === id) {
        if (action === 'delete') {
          setSelectedItem(null);
        } else if (action === 'bulk') {
          setSelectedItem((prev: any) => ({ ...prev, ...payload, type }));
        } else if (action === 'paymentStatus') {
          setSelectedItem((prev: any) => ({ ...prev, paymentStatus: payload, type }));
        } else {
          setSelectedItem((prev: any) => ({ ...prev, status: payload, type }));
        }
      }

      success(`${action === 'delete' ? 'Deleted' : 'Updated'} successfully`);

      if (isDelete) {
        setIsConfirmOpen(false);
        setRecordToDelete(null);
      }
      return true;
    } catch (err: any) {
      console.error(err);
      toastError(err.response?.data?.error || "Operation failed");
      return false;
    } finally {
      if (isDelete) setIsDeleting(false);
      else setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (!editingRecord) return;

    const success = await handleAction(editingRecord.id, editingRecord.type, 'bulk', pendingChanges);
    if (success) {
      setIsEditModalOpen(false);
      setEditingRecord(null);
      setPendingChanges({});
    }
  };

  const getActiveData = () => {
    if (activeTab === 'tournament') return { data: filteredRegistrations, loading: tournamentLoading, type: 'tournament' as const };
    if (activeTab === 'demo') return { data: filteredDemos, loading: false, type: 'demo' as const };
    return { data: filteredEnrollments, loading: enrollLoading, type: 'course' as const };
  };

  const { data: currentData, loading: currentLoading, type: currentType } = getActiveData();

  const columns: AdminTableColumn[] = useMemo(() => {
    return [
      { key: 'displayProfile', label: 'Student Profile', className: 'min-w-[200px]' },
      { key: 'displayUcaId', label: 'UCA ID', hiddenOn: 'mobile' },
      { key: 'displayProgram', label: activeTab === 'demo' ? 'City' : 'Address', hiddenOn: 'mobile' },
      { key: 'displayDate', label: 'Submission', hiddenOn: 'tablet' },
      { key: 'displayContact', label: 'Contact', hiddenOn: 'mobile' },
      { key: 'displayStatus', label: 'Status', align: 'right' }
    ];
  }, [activeTab]);

  const handleEdit = (item: any) => {
    setEditingRecord({ ...item, type: currentType });
    setPendingChanges({
      status: item.status,
      paymentStatus: item.paymentStatus
    });
    setIsEditModalOpen(true);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsEditModalOpen(false);
    setEditingRecord(null);
    setPendingChanges({});
  };

  const rows = (currentData || []).map((item: any) => {
    const avatarStyles = getAvatarStyles(item.studentName || item.student?.fullName || "?");
    return {
      ...item,
      displayProfile: (
        <div className="flex items-center gap-3">
          <div
            className="size-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0"
            style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
          >
            {item.student?.fullName?.charAt(0).toUpperCase() || item.studentName?.charAt(0).toUpperCase() || "S"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-uca-text-primary truncate">{item.student?.fullName || item.studentName}</span>
            <span className="text-[10px] text-uca-text-muted">
              {item.student?.gender || item.gender || 'Not Specified'}
            </span>
          </div>
        </div>
      ),
      displayUcaId: (
        <span className="font-mono text-[10px] font-bold text-uca-accent-blue">
          {item.student?.ucaId || "—"}
        </span>
      ),
      displayProgram: (
        <div className="flex items-center gap-2">
          {currentType === 'demo' ? (
            <span className="text-xs font-semibold text-uca-text-primary truncate max-w-[150px]">
              {item.city || 'N/A'}
            </span>
          ) : (
            <span className="text-xs font-semibold text-uca-text-primary truncate max-w-[200px]">
              {item.student?.address || item.address || 'N/A'}
            </span>
          )}
        </div>
      ),
      displayDate: (
        <span className="text-[10px] text-uca-text-muted font-medium">
          {item.createdAt ? format(new Date(item.createdAt), "MMM d, h:mm a") : 'N/A'}
        </span>
      ),
      displayContact: (
        <div className="flex items-center gap-1.5 text-xs text-uca-text-muted">
          <Phone className="size-3" /> {item.student?.phone || item.phone}
        </div>
      ),
      displayStatus: <StatusBadge status={item.status} />,
      actions: (
        <RowActionMenu
          onView={() => setSelectedItem({ ...item, type: currentType })}
          onEdit={() => handleEdit(item)}
          onConfirm={() => {
            const status = currentType === 'course' ? 'CONFIRMED' : (currentType === 'tournament' ? 'APPROVED' : 'COMPLETED');
            handleAction(item.id, currentType, 'status', status);
          }}
          onDelete={() => { setRecordToDelete({ ...item, type: currentType }); setIsConfirmOpen(true); }}
        />
      )
    };
  });

  return (
    <AdminShell
      title="Registrations"
      subtitle="Review and manage student enrollments across all programs."
    >
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-uca-bg-surface border border-uca-border p-4 rounded-xl mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
            <div className="relative flex-1 w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-uca-text-muted" />
              <Input
                placeholder="Search entries..."
                className="w-full h-10 bg-uca-bg-base border-uca-border text-sm focus:ring-uca-accent-blue rounded-lg pl-10 pr-4 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full sm:w-40 bg-uca-bg-base border-uca-border text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Filter className="size-3.5 text-uca-text-muted" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {activeTab === 'course' && (
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="h-10 w-full sm:w-48 bg-uca-bg-base border-uca-border text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-3.5 text-uca-accent-blue" />
                    <SelectValue placeholder="All Courses" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                  <SelectItem value="ALL">All Programs</SelectItem>
                  {courses.map((c: any) => (
                    <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex gap-1.5 flex-wrap w-full lg:w-auto justify-center lg:justify-end">
            <div className="flex bg-uca-bg-base p-1 rounded-lg h-10 border border-uca-border">
              <button
                onClick={() => setActiveTab("demo")}
                className={`rounded-md px-3 sm:px-4 text-[10px] font-black uppercase tracking-widest h-8 transition-all ${
                  activeTab === "demo"
                    ? "bg-uca-navy text-white"
                    : "text-uca-text-muted hover:text-uca-text-primary"
                }`}
              >
                Demos
              </button>
              <button
                onClick={() => setActiveTab("tournament")}
                className={`rounded-md px-3 sm:px-4 text-[10px] font-black uppercase tracking-widest h-8 transition-all ${
                  activeTab === "tournament"
                    ? "bg-uca-navy text-white"
                    : "text-uca-text-muted hover:text-uca-text-primary"
                }`}
              >
                Tournaments
              </button>
              <button
                onClick={() => setActiveTab("course")}
                className={`rounded-md px-3 sm:px-4 text-[10px] font-black uppercase tracking-widest h-8 transition-all ${
                  activeTab === "course"
                    ? "bg-uca-navy text-white"
                    : "text-uca-text-muted hover:text-uca-text-primary"
                }`}
              >
                Courses
              </button>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="hidden md:block">
          <AdminTable
            columns={columns}
            rows={rows}
            isLoading={currentLoading}
            onRowClick={(item) => setSelectedItem({ ...item, type: currentType })}
            onEdit={(row) => {
              const original = currentData.find((item: any) => item.id === row.id);
              if (original) handleEdit(original);
            }}
            onDelete={(item) => { setRecordToDelete({ ...item, type: currentType }); setIsConfirmOpen(true); }}
            renderActions={(row) => (
              <div className="flex items-center gap-2">
                 {row.status === 'PENDING' && (
                   <Button
                     size="sm"
                     variant="ghost"
                     className="h-8 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleAction(row.id, currentType, 'status', currentType === 'course' ? 'CONFIRMED' : 'APPROVED');
                     }}
                   >
                     Approve
                   </Button>
                 )}
                 {row.actions}
              </div>
            )}
          />
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {currentLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-uca-navy" />
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-uca-border rounded-xl bg-uca-bg-surface">
              <p className="text-sm text-uca-text-muted font-medium">No registrations found</p>
            </div>
          ) : (
            rows.map((row) => (
              <div
                key={row.id}
                className="bg-uca-bg-surface border border-uca-border rounded-xl p-4 shadow-sm active:bg-uca-bg-elevated/30 transition-all cursor-pointer"
                onClick={() => setSelectedItem({ ...row, type: currentType })}
              >
                <div className="flex items-center justify-between mb-3">
                  {row.displayProfile}
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    {row.status === 'PENDING' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-[10px] font-black uppercase text-emerald-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(row.id, currentType, 'status', currentType === 'course' ? 'CONFIRMED' : 'APPROVED');
                        }}
                      >
                        Approve
                      </Button>
                    )}
                    <RowActionMenu
                      onView={() => setSelectedItem({ ...row, type: currentType })}
                      onEdit={() => handleEdit(row)}
                      onDelete={() => { setRecordToDelete({ ...row, type: currentType }); setIsConfirmOpen(true); }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 pt-3 border-t border-uca-border/50 text-[10px]">
                  <div>
                    <span className="block font-black uppercase text-uca-text-muted mb-0.5">UCA ID</span>
                    {row.displayUcaId}
                  </div>
                  <div className="text-right">
                    <span className="block font-black uppercase text-uca-text-muted mb-0.5">Status</span>
                    <StatusBadge status={row.status} />
                  </div>
                  <div className="col-span-2">
                    <span className="block font-black uppercase text-uca-text-muted mb-0.5">{currentType === 'demo' ? 'City' : 'Address'}</span>
                    <p className="text-xs text-uca-text-primary line-clamp-1">{row.student?.address || row.address || row.city || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AdminModal
        isOpen={isEditModalOpen}
        onClose={handleClose}
        title={`Edit ${editingRecord?.type === 'tournament' ? 'Tournament' : editingRecord?.type === 'course' ? 'Course' : 'Demo'} Registration`}
        footer={
          <>
            <Button variant="ghost" disabled={isSubmitting} onClick={handleClose} className="text-uca-text-muted hover:text-uca-text-primary">Cancel</Button>
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
                  Save Changes
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2" key={editingRecord?.id ?? 'new'}>
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Registration Status</Label>
            <Select
              value={pendingChanges.status}
              onValueChange={(val) => setPendingChanges(prev => ({ ...prev, status: val }))}
            >
              <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg text-uca-text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {editingRecord?.type !== 'demo' && (
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Payment Status</Label>
              <Select
                value={pendingChanges.paymentStatus}
                onValueChange={(val) => setPendingChanges(prev => ({ ...prev, paymentStatus: val }))}
              >
                <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg text-uca-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="VERIFIED">Verified</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onCancel={() => { setIsConfirmOpen(false); setRecordToDelete(null); }}
        onConfirm={() => handleAction(recordToDelete.id, recordToDelete.type, 'delete')}
        isLoading={isDeleting}
        title="Permanent Delete?"
        description="This action cannot be undone. The registration and associated student link will be removed."
      />

      <StudentDetailSheet
        open={!!selectedItem}
        onOpenChange={() => setSelectedItem(null)}
        data={selectedItem}
        type={selectedItem?.type || 'course'}
        onAction={(id, action, payload) => handleAction(id, selectedItem?.type, action, payload)}
        isSubmitting={isSubmitting}
      />
    </AdminShell>
  );
}