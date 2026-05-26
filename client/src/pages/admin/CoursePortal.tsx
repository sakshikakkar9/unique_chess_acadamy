import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { Course, CourseEnrollment } from "../../types";
import {
  ArrowLeft, LayoutDashboard, CreditCard, Users, TrendingUp, Wallet, BookOpen,
  Percent, Search, Filter, Download, FileText, Phone, Mail,
  Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  Copy, User, ShieldCheck, Image as PhotoIcon, Check, Loader2, Trophy, UserCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import CoursePreview from "../../features/courses/components/admin/CoursePreview";
import { format } from "date-fns";
import StatusBadge from "../../components/shared/admin/StatusBadge";
import AdminShell from "../../components/admin/AdminShell";
import Pagination from "../../components/shared/admin/Pagination";
import { getAvatarStyles, cn } from "../../lib/utils";
import { RowActionMenu } from "../../components/admin/RowActionMenu";
import { useToast } from "../../hooks/useToast";
import { StudentDetailSheet } from "../../components/admin/StudentDetailSheet";
import AdminModal from "../../components/admin/AdminModal";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const ITEMS_PER_PAGE = 8;

const CoursePortal: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [pendingChanges, setPendingChanges] = useState<{ status?: string; paymentStatus?: string }>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);

  const { data: course, isLoading: isCourseLoading } = useQuery<Course>({
    queryKey: ["course", id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}`);
      return res.data;
    },
  });

  const { data: enrollments = [], isLoading: isRegLoading } = useQuery<CourseEnrollment[]>({
    queryKey: ["course-enrollments", id],
    queryFn: async () => {
      const res = await api.get(`/courses/enrollments?courseId=${id}`);
      return res.data;
    },
  });

  const totalCollections = enrollments.length * (course?.fee || 0);

  const handleAction = async (enrollId: string | number, action: 'status' | 'delete' | 'paymentStatus' | 'bulk', payload?: any) => {
    const isDelete = action === 'delete';
    if (isDelete) setIsDeleting(true);
    else setIsSubmitting(true);

    const path = `/courses/enrollments/${enrollId}`;

    try {
      if (action === 'delete') {
        await api.delete(path);
      } else if (action === 'paymentStatus') {
        await api.patch(path, { paymentStatus: payload });
      } else if (action === 'status') {
        await api.patch(path, { status: payload });
      } else if (action === 'bulk') {
        await api.patch(path, payload);
      }

      qc.invalidateQueries({ queryKey: ["course-enrollments", id] });
      qc.invalidateQueries({ queryKey: ["course-enrollments"] });

      if (selectedItem && selectedItem.id === enrollId) {
        if (action === 'delete') setSelectedItem(null);
        else if (action === 'bulk') setSelectedItem((prev: any) => ({ ...prev, ...payload }));
        else if (action === 'paymentStatus') setSelectedItem((prev: any) => ({ ...prev, paymentStatus: payload }));
        else setSelectedItem((prev: any) => ({ ...prev, status: payload }));
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

  const handleEdit = (item: any) => {
    setEditingRecord(item);
    setPendingChanges({
      status: item.status,
      paymentStatus: item.paymentStatus
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingRecord) return;
    const ok = await handleAction(editingRecord.id, 'bulk', pendingChanges);
    if (ok) {
      setIsEditModalOpen(false);
      setEditingRecord(null);
      setPendingChanges({});
    }
  };

  const handleCloseEdit = () => {
    if (isSubmitting) return;
    setIsEditModalOpen(false);
    setEditingRecord(null);
    setPendingChanges({});
  };

  if (isCourseLoading) {
    return (
      <AdminShell title="Loading Course..." subtitle="Fetching academy data">
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      </AdminShell>
    );
  }

  if (!course) return (
    <AdminShell title="Not Found" subtitle="Course ID mismatch">
      <div className="p-12 text-center bg-uca-bg-surface border border-uca-border rounded-2xl">
        <p className="text-uca-text-muted">Course program not found.</p>
      </div>
    </AdminShell>
  );

  return (
    <>
    <AdminShell
      title={course.title}
      subtitle={`Program ID: ${id?.substring(0, 8).toUpperCase()}`}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/courses")}
            className="rounded-lg hover:!bg-uca-navy hover:text-white text-uca-text-muted gap-2 px-3 transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Courses
          </Button>
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <TabsList className="bg-uca-bg-surface border border-uca-border p-1.5 h-12 rounded-xl mb-6 inline-flex min-w-max">
              <TabsTrigger
                value="summary"
                className="rounded-lg px-6 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-uca-navy data-[state=active]:text-white transition-all"
              >
                <LayoutDashboard className="size-3.5 mr-2" /> Summary
              </TabsTrigger>
              <TabsTrigger
                value="finance"
                className="rounded-lg px-6 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-uca-navy data-[state=active]:text-white transition-all"
              >
                <CreditCard className="size-3.5 mr-2" /> Finance
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="rounded-lg px-6 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-uca-navy data-[state=active]:text-white transition-all"
              >
                <Users className="size-3.5 mr-2" /> Enrollment
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="summary" className="mt-0 focus-visible:ring-0">
             <div className="bg-uca-bg-surface rounded-2xl border border-uca-border p-6 md:p-10 shadow-sm overflow-hidden">
               <CoursePreview course={course} />
             </div>
          </TabsContent>

          <TabsContent value="finance" className="mt-0 focus-visible:ring-0 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
               {[
                 { label: 'Total Collections', value: `₹${(totalCollections || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', sub: `${enrollments.length} enrollments` },
                 { label: 'Course Fee', value: `₹${(course?.fee || 0).toLocaleString()}`, icon: Wallet, color: 'text-uca-accent-blue', bg: 'bg-uca-accent-blue/10', sub: 'Standard rate' },
                 { label: 'Class Mode', value: course?.mode || "N/A", icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-500/10', sub: `${course?.duration || "N/A"} duration` }
               ].map((stat, i) => (
                 <div key={i} className="bg-uca-bg-surface p-6 rounded-xl border border-uca-border space-y-4 shadow-sm">
                    <div className={cn("size-10 rounded-lg flex items-center justify-center border border-uca-border", stat.bg)}>
                      <stat.icon className={cn("size-5", stat.color)} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-uca-text-muted mb-1">{stat.label}</p>
                      <p className="text-2xl font-black text-uca-text-primary tracking-tight">{stat.value}</p>
                    </div>
                    <p className="text-[10px] font-bold text-uca-text-muted pt-3 border-t border-uca-border/50">{stat.sub}</p>
                 </div>
               ))}
             </div>

             <div className="bg-uca-bg-surface rounded-xl border border-uca-border p-6 space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="size-9 rounded-lg bg-uca-navy flex items-center justify-center border border-uca-border">
                      <Percent className="size-4 text-uca-accent-blue" />
                   </div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-uca-text-primary">Operational Info</h3>
                </div>
                <div className="p-5 bg-uca-bg-base rounded-xl border border-uca-border min-h-[80px]">
                   <p className="text-sm font-medium text-uca-text-muted leading-relaxed italic">
                      Contact: {course.contactDetails || "No additional contact details provided."}
                   </p>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="students" className="mt-0 focus-visible:ring-0 space-y-6">
             <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-uca-bg-surface p-5 rounded-xl border border-uca-border shadow-sm">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-uca-text-muted" />
                  <Input
                    placeholder="Search enrollments..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-10 h-11 bg-uca-bg-base border-uca-border text-sm focus:ring-uca-accent-blue rounded-lg"
                  />
                </div>
                <Button
                  className="h-11 rounded-lg font-bold gap-2 bg-uca-navy hover:bg-uca-navy-hover text-white text-xs uppercase tracking-widest w-full md:w-auto"
                  onClick={() => {
                    const headers = ["UCA ID", "ID", "Student Name", "Category", "Skill Level", "Phone", "Status"];
                    const rows = enrollments.map(r => [
                      r?.ucaId || "—",
                      r?.id || "N/A",
                      r?.student?.fullName || "N/A",
                      r?.category || "N/A",
                      r?.student?.experienceLevel || "N/A",
                      r?.student?.phone || "N/A",
                      r?.status || "PENDING"
                    ]);
                    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `${course?.title || 'course'}_enrollments.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="size-4" /> Export CSV
                </Button>
             </div>

             <div className="bg-uca-bg-surface border border-uca-border rounded-xl overflow-hidden shadow-sm">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-uca-bg-elevated/50 border-b border-uca-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Student</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">UCA ID</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Skill & Level</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted hidden lg:table-cell">Contact</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted text-center">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-uca-border">
                      {isRegLoading ? (
                        <tr><td colSpan={6} className="py-12 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">Loading entries...</td></tr>
                      ) : (
                        (() => {
                          const filtered = enrollments.filter((reg) => {
                            const name = (reg?.student?.fullName || "").toLowerCase();
                            const idStr = (reg?.id || "").toLowerCase();
                            const search = searchQuery.toLowerCase();
                            return name.includes(search) || idStr.includes(search);
                          });
                          const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                          const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

                          if (paginated.length === 0) return <tr><td colSpan={6} className="py-20 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">No entries found</td></tr>;

                          return (
                            <>
                              {paginated.map((reg) => {
                                const name = reg?.student?.fullName || "N/A";
                                const avatarStyles = getAvatarStyles(name);
                                return (
                                  <tr key={reg?.id} className="hover:bg-uca-bg-elevated/30 transition-colors cursor-pointer" onClick={() => setSelectedItem({ ...reg, type: 'course' })}>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}>
                                          {name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-sm font-bold text-uca-text-primary truncate">{name}</p>
                                          <p className="text-[10px] text-uca-text-muted font-mono">{reg?.id?.substring(0, 8)}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="font-mono text-[11px] font-bold text-uca-text-primary bg-uca-bg-elevated px-2 py-1 rounded border border-uca-border">
                                        {reg?.student?.ucaId || '—'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-semibold text-uca-text-primary">{reg?.category || 'General'}</span>
                                        <span className="text-[10px] text-uca-text-muted">{reg?.student?.experienceLevel || 'Beginner'}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-xs text-uca-text-primary font-medium">{reg?.student?.phone || 'N/A'}</span>
                                        <span className="text-[10px] text-uca-text-muted truncate max-w-[120px]">{reg?.student?.email || 'N/A'}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <StatusBadge status={reg?.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                      <RowActionMenu
                                        onView={() => setSelectedItem({ ...reg, type: 'course' })}
                                        onEdit={() => handleEdit(reg)}
                                        onConfirm={() => handleAction(reg.id, 'status', 'CONFIRMED')}
                                        onDelete={() => { setRecordToDelete(reg); setIsConfirmOpen(true); }}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                              {totalPages > 1 && (
                                <tr>
                                  <td colSpan={6} className="px-6 py-4 bg-uca-bg-elevated/20">
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })()
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-uca-border">
                  {isRegLoading ? (
                    <div className="py-12 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">Loading entries...</div>
                  ) : (
                    (() => {
                      const filtered = enrollments.filter((reg) => {
                        const name = (reg?.student?.fullName || "").toLowerCase();
                        const idStr = (reg?.id || "").toLowerCase();
                        const search = searchQuery.toLowerCase();
                        return name.includes(search) || idStr.includes(search);
                      });
                      const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                      const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

                      if (paginated.length === 0) return <div className="py-20 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">No entries found</div>;

                      return (
                        <>
                          {paginated.map((reg) => {
                            const name = reg?.student?.fullName || "N/A";
                            const avatarStyles = getAvatarStyles(name);
                            return (
                              <div
                                key={reg?.id}
                                className="p-4 space-y-3 hover:bg-uca-bg-elevated/30 active:bg-uca-bg-elevated transition-colors cursor-pointer"
                                onClick={() => setSelectedItem({ ...reg, type: 'course' })}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="size-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}>
                                      {name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <p className="text-sm font-bold text-uca-text-primary truncate">{name}</p>
                                      <span className="font-mono text-[9px] font-bold text-uca-accent-blue">
                                        {reg?.student?.ucaId || '—'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                    <StatusBadge status={reg?.status} />
                                    <RowActionMenu
                                      onView={() => setSelectedItem({ ...reg, type: 'course' })}
                                      onEdit={() => handleEdit(reg)}
                                      onConfirm={() => handleAction(reg.id, 'status', 'CONFIRMED')}
                                      onDelete={() => { setRecordToDelete(reg); setIsConfirmOpen(true); }}
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pl-11 text-[10px]">
                                   <div className="flex flex-col gap-0.5">
                                      <span className="font-black uppercase text-uca-text-muted tracking-widest">Category</span>
                                      <span className="font-bold text-uca-text-primary">{reg?.category || 'General'}</span>
                                   </div>
                                   <div className="flex flex-col gap-0.5 text-right">
                                      <span className="font-black uppercase text-uca-text-muted tracking-widest">Contact</span>
                                      <span className="font-bold text-uca-text-primary">{reg?.student?.phone || 'N/A'}</span>
                                   </div>
                                </div>
                              </div>
                            );
                          })}
                          {totalPages > 1 && (
                            <div className="px-4 py-4 bg-uca-bg-elevated/20">
                              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                            </div>
                          )}
                        </>
                      );
                    })()
                  )}
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>

    <AdminModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        title="Edit Enrollment"
        footer={
          <>
            <Button variant="ghost" disabled={isSubmitting} onClick={handleCloseEdit}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-uca-navy hover:bg-uca-navy-hover text-white font-bold px-8 h-10 gap-2"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Enrollment Status</Label>
            <Select
              value={pendingChanges.status}
              onValueChange={(val) => setPendingChanges(prev => ({ ...prev, status: val }))}
            >
              <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg text-uca-text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onCancel={() => { setIsConfirmOpen(false); setRecordToDelete(null); }}
        onConfirm={() => handleAction(recordToDelete.id, 'delete')}
        isLoading={isDeleting}
        title="Permanent Delete?"
        description="This action cannot be undone. The enrollment and associated student link will be removed."
      />

      <StudentDetailSheet
        open={!!selectedItem}
        onOpenChange={() => setSelectedItem(null)}
        data={selectedItem}
        type="course"
        onAction={(id, action, payload) => handleAction(id, action, payload)}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default CoursePortal;
