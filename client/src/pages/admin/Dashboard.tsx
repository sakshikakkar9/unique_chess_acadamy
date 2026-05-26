import React, { useState, useMemo } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  BookOpen, Trophy, Image as PhotoIcon, Users,
  TrendingUp, Calendar, UserCheck, ArrowUpRight, GraduationCap,
  Loader2, Check, User, ShieldCheck, Copy, Mail, Phone, Eye, Trash2,
  RefreshCw, Filter, ExternalLink, CreditCard, UserCheck as UserCheckIcon
} from "lucide-react";
import { useAdminCourses } from "../../features/courses/hooks/useAdminCourses";
import { useAdminTournaments } from "../../features/tournaments/hooks/useAdminTournaments";
import { useAdminGallery } from "../../features/gallery/hooks/useAdminGallery";
import { useDemoAdmin } from "../../features/demo/hooks/useDemoRegistration";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { formatINR } from "../../lib/formatUtils";
import { CourseEnrollment } from "../../types";
import { AGE_GROUP_LABELS } from "../../types";
import AdminShell from "../../components/admin/AdminShell";
import StatusBadge from "../../components/shared/admin/StatusBadge";
import { cn, getAvatarStyles } from "../../lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import Pagination from "../../components/shared/admin/Pagination";
import { RowActionMenu } from "../../components/admin/RowActionMenu";
import { format } from "date-fns";
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
import { Button } from "../../components/ui/button";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const ITEMS_PER_PAGE = 10;

const AdminDashboard: React.FC = () => {
  const navigate          = useNavigate();
  const { success, error: toastError } = useToast();
  const qc = useQueryClient();
  const { courses }       = useAdminCourses();
  const { tournaments }   = useAdminTournaments();
  const { images }        = useAdminGallery();
  const { demos, isLoading: demosLoading, refresh: refreshDemos } = useDemoAdmin();

  const { data: messages = [], isLoading: messagesLoading } = useQuery<any[]>({
    queryKey: ["admin-messages"],
    queryFn: async () => (await api.get("/contact")).data
  });

  const { data: registrations = [], isLoading: tournamentLoading } = useQuery<any[]>({
    queryKey: ["registrations"],
    queryFn: async () => (await api.get("/tournaments/admin/registrations/all")).data
  });

  const { data: enrollments = [], isLoading: enrollLoading } = useQuery<CourseEnrollment[]>({
    queryKey: ["course-enrollments"],
    queryFn: async () => {
      const res = await api.get("/courses/enrollments");
      return res.data;
    },
  });

  const [tournamentPage, setTournamentPage] = useState(1);
  const [coursePage, setCoursePage] = useState(1);
  const [demoPage, setDemoPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [pendingChanges, setPendingChanges] = useState<{ status?: string; paymentStatus?: string }>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);

  const paginatedTournaments = useMemo(() => {
    const start = (tournamentPage - 1) * ITEMS_PER_PAGE;
    return [...registrations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(start, start + ITEMS_PER_PAGE);
  }, [registrations, tournamentPage]);

  const paginatedCourses = useMemo(() => {
    const start = (coursePage - 1) * ITEMS_PER_PAGE;
    return [...enrollments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(start, start + ITEMS_PER_PAGE);
  }, [enrollments, coursePage]);

  const paginatedDemos = useMemo(() => {
    const start = (demoPage - 1) * ITEMS_PER_PAGE;
    return [...demos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(start, start + ITEMS_PER_PAGE);
  }, [demos, demoPage]);

  const handleAction = async (id: string | number, type: string, action: 'status' | 'delete' | 'paymentStatus' | 'bulk', payload?: any) => {
    const isDelete = action === 'delete';
    if (isDelete) setIsDeleting(true);
    else setIsSubmitting(true);

    const typeKey = (type === 'tournaments' || type === 'tournament') ? 'tournament' :
                   (type === 'courses' || type === 'course') ? 'course' : 'demo';
    const paths: any = {
      demo: `/demo/admin/${id}`,
      course: `/courses/enrollments/${id}`,
      tournament: `/tournaments/admin/registrations/${id}`
    };

    try {
      if (action === 'delete') {
        await api.delete(paths[typeKey]);
      } else if (action === 'paymentStatus') {
        await api.patch(paths[typeKey], { paymentStatus: payload });
      } else if (action === 'status') {
        await api.patch(paths[typeKey], { status: payload });
      } else if (action === 'bulk') {
        await api.patch(paths[typeKey], payload);
      }

      const queryKey = typeKey === 'tournament' ? "registrations" : typeKey === 'course' ? "course-enrollments" : typeKey === 'demo' ? "admin-demos" : type;
      qc.invalidateQueries({ queryKey: [queryKey] });
      if (typeKey === 'demo') refreshDemos();

      // Update Detail Sheet if open
      if (selectedItem && selectedItem.id === id) {
        if (action === 'delete') setSelectedItem(null);
        else if (action === 'bulk') setSelectedItem({ ...selectedItem, ...payload });
        else if (action === 'paymentStatus') setSelectedItem({ ...selectedItem, paymentStatus: payload });
        else setSelectedItem({ ...selectedItem, status: payload });
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

  const handleEdit = (item: any, type: string) => {
    const typeKey = type === 'tournaments' ? 'tournament' : type === 'courses' ? 'course' : 'demo';
    setEditingRecord({ ...item, type: typeKey });
    setPendingChanges({
      status: item.status,
      paymentStatus: item.paymentStatus
    });
    setIsEditModalOpen(true);
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

  const handleClose = () => {
    if (isSubmitting) return;
    setIsEditModalOpen(false);
    setEditingRecord(null);
    setPendingChanges({});
  };

  const tournamentTotalPages = Math.ceil(registrations.length / ITEMS_PER_PAGE);
  const courseTotalPages = Math.ceil(enrollments.length / ITEMS_PER_PAGE);
  const demoTotalPages = Math.ceil(demos.length / ITEMS_PER_PAGE);

  const pendingEnrollments = enrollments.filter((e) => e.status === "PENDING");

  // Calculate Collections
  const totalCourseCollections = useMemo(() => {
    return enrollments
      .filter(e => e.status !== 'REJECTED')
      .reduce((sum, e) => sum + (e.course?.fee || 0), 0);
  }, [enrollments]);

  const totalTournamentCollections = useMemo(() => {
    return registrations
      .filter(r => r.status !== 'CANCELLED' && r.status !== 'REJECTED')
      .reduce((sum, r) => sum + (r.tournament?.entryFee || 0), 0);
  }, [registrations]);

  const totalInvestment = totalCourseCollections + totalTournamentCollections;

  const uniqueStudentCount = useMemo(() => {
    const studentIds = new Set();
    enrollments.forEach(e => studentIds.add(e.studentId));
    registrations.forEach(r => studentIds.add(r.studentId));
    return studentIds.size;
  }, [enrollments, registrations]);

  const demoStatus = useMemo(() => {
    if (demos.length === 0) return "NO LEADS";
    const allDone = demos.every((d: any) => d.status === "CONFIRMED" || d.status === "COMPLETED");
    if (allDone) return "DONE";
    return "PENDING";
  }, [demos]);

  const stats = [
    {
      title: "Demo Leads",
      value: demosLoading ? "…" : demos.length.toString(),
      icon: Users,
      accent: "text-uca-accent-blue",
      bg: "bg-uca-accent-blue/10",
      numColor: "text-uca-accent-blue",
      status: demoStatus,
      path: "/admin/registrations"
    },
    {
      title: "Active Users",
      value: enrollLoading || tournamentLoading ? "…" : uniqueStudentCount.toString(),
      icon: GraduationCap,
      accent: "text-amber-500",
      bg: "bg-amber-500/10",
      numColor: "text-amber-500",
      status: "SYNCED",
      subtitle: `Courses: ${enrollments.length} | Tournaments: ${registrations.length}`,
      path: "/admin/registrations"
    },
    {
      title: "Collected amount",
      value: tournamentLoading || enrollLoading ? "…" : `₹${totalInvestment.toLocaleString()}`,
      icon: TrendingUp,
      accent: "text-emerald-500",
      bg: "bg-emerald-500/10",
      numColor: "text-emerald-500",
      subtitle: `Courses: ${formatINR(totalCourseCollections)} | Tournaments: ${formatINR(totalTournamentCollections)}`,
      status: "REVENUE",
      path: "/admin/registrations"
    },
  ];

  return (
    <>
    <AdminShell
      title="Dashboard Overview"
      subtitle="Monitoring growth at Unique Chess Academy."
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-uca-bg-surface border border-uca-border rounded-2xl p-5 hover:bg-uca-bg-elevated transition-all cursor-pointer group shadow-sm"
              onClick={() => stat.path && navigate(stat.path)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className={cn("size-10 rounded-xl flex items-center justify-center bg-uca-bg-elevated border border-uca-border transition-transform group-hover:scale-110")}>
                  <stat.icon className={cn("size-5", stat.accent)} />
                </div>
                <StatusBadge status={stat.status} />
              </div>

              <div className={cn("text-3xl font-bold tracking-tight text-uca-text-primary mt-3 mb-1")}>
                {stat.value}
              </div>

              <div className="text-sm font-semibold text-uca-text-primary">
                {stat.title}
              </div>

              {stat.subtitle && (
                <div className="text-[10px] text-uca-text-muted mt-2 pt-2 border-t border-uca-border/50">
                  {stat.subtitle}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enhanced Enrollment Tabs */}
        <div className="bg-uca-bg-surface border border-uca-border rounded-xl overflow-hidden shadow-sm">
          <Tabs defaultValue="tournaments" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-4 sm:px-6 border-b border-uca-border bg-uca-bg-elevated/30 gap-4">
              <TabsList className="bg-uca-bg-base p-1 rounded-lg border border-uca-border h-10">
                <TabsTrigger
                  value="demos"
                  className="rounded-md px-4 text-[10px] font-black uppercase tracking-widest h-8 data-[state=active]:bg-uca-navy data-[state=active]:text-white"
                >
                  Demos
                </TabsTrigger>
                <TabsTrigger
                  value="tournaments"
                  className="rounded-md px-4 text-[10px] font-black uppercase tracking-widest h-8 data-[state=active]:bg-uca-navy data-[state=active]:text-white"
                >
                  Tournaments
                </TabsTrigger>
                <TabsTrigger
                  value="courses"
                  className="rounded-md px-4 text-[10px] font-black uppercase tracking-widest h-8 data-[state=active]:bg-uca-navy data-[state=active]:text-white"
                >
                  Courses
                </TabsTrigger>
                {/* <TabsTrigger
                  value="demos"
                  className="rounded-md px-4 text-[10px] font-black uppercase tracking-widest h-8 data-[state=active]:bg-uca-navy data-[state=active]:text-white"
                >
                  Demos
                </TabsTrigger> */}
              </TabsList>

              <Link
                to="/admin/registrations"
                className="text-[10px] font-black uppercase tracking-widest text-uca-accent-blue hover:text-uca-text-primary flex items-center gap-1 transition-colors"
              >
                Full Register <ArrowUpRight className="size-3" />
              </Link>
            </div>

            {["tournaments", "courses", "demos"].map((tab) => {
              const loading = tab === "tournaments" ? tournamentLoading : tab === "courses" ? enrollLoading : demosLoading;
              const data = tab === "tournaments" ? paginatedTournaments : tab === "courses" ? paginatedCourses : paginatedDemos;
              const totalPages = tab === "tournaments" ? tournamentTotalPages : tab === "courses" ? courseTotalPages : demoTotalPages;
              const currentPage = tab === "tournaments" ? tournamentPage : tab === "courses" ? coursePage : demoPage;
              const setPage = tab === "tournaments" ? setTournamentPage : tab === "courses" ? setCoursePage : setDemoPage;

              return (
                <TabsContent key={tab} value={tab} className="m-0">
                  {/* Desktop view */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-uca-bg-elevated/50 border-b border-uca-border">
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Student</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">UCA ID</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Address</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted text-right">Status</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-uca-border">
                        {loading ? (
                          <tr><td colSpan={5} className="py-12 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">Loading...</td></tr>
                        ) : data.length > 0 ? (
                          data.map((item: any) => {
                            const name = item?.student?.fullName || item?.studentName || "N/A";
                            const avatarStyles = getAvatarStyles(name);
                            return (
                              <tr
                                key={item.id}
                                className="hover:bg-uca-bg-elevated/30 transition-colors cursor-pointer"
                                onClick={() => {
                                  const typeKey = tab === 'tournaments' ? 'tournament' : tab === 'courses' ? 'course' : 'demo';
                                  setSelectedItem({ ...item, type: typeKey });
                                }}
                              >
                                <td className="px-6 py-3">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="size-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                                      style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
                                    >
                                      {name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-bold text-uca-text-primary">{name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-3">
                                  <span className="font-mono text-[10px] font-bold text-uca-accent-blue">
                                    {item.student?.ucaId || "—"}
                                  </span>
                                </td>
                                <td className="px-6 py-3">
                                  <span className="text-xs text-uca-text-muted font-medium truncate max-w-[200px] block">
                                    {item.student?.address || item.address || item.city || 'N/A'}
                                  </span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <StatusBadge status={item.status} />
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                                    <RowActionMenu
                                      onView={() => {
                                        const typeKey = tab === 'tournaments' ? 'tournament' : tab === 'courses' ? 'course' : 'demo';
                                        setSelectedItem({ ...item, type: typeKey });
                                      }}
                                      onEdit={() => handleEdit(item, tab)}
                                      onConfirm={() => {
                                        const typeKey = tab === 'tournaments' ? 'tournament' : tab === 'courses' ? 'course' : 'demo';
                                        const status = typeKey === 'course' ? 'CONFIRMED' : (typeKey === 'tournament' ? 'APPROVED' : 'COMPLETED');
                                        handleAction(item.id, typeKey, 'status', status);
                                      }}
                                      onDelete={() => {
                                        const typeKey = tab === 'tournaments' ? 'tournament' : tab === 'courses' ? 'course' : 'demo';
                                        setRecordToDelete({ ...item, type: typeKey });
                                        setIsConfirmOpen(true);
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr><td colSpan={5} className="py-12 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">No records found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile view */}
                  <div className="md:hidden divide-y divide-uca-border">
                    {loading ? (
                      <div className="py-12 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">Loading...</div>
                    ) : data.length > 0 ? (
                      data.map((item: any) => {
                        const name = item?.student?.fullName || item?.studentName || "N/A";
                        const avatarStyles = getAvatarStyles(name);
                        const typeKey = tab === 'tournaments' ? 'tournament' : tab === 'courses' ? 'course' : 'demo';
                        return (
                          <div
                            key={item.id}
                            className="p-4 space-y-3 hover:bg-uca-bg-elevated/30 active:bg-uca-bg-elevated transition-colors cursor-pointer"
                            onClick={() => setSelectedItem({ ...item, type: typeKey })}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className="size-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                                  style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
                                >
                                  {name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-bold text-uca-text-primary truncate">{name}</span>
                                    <span className="font-mono text-[10px] font-bold text-uca-accent-blue">
                                    {item.student?.ucaId || "—"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <StatusBadge status={item.status} />
                                <RowActionMenu
                                  onView={() => setSelectedItem({ ...item, type: typeKey })}
                                  onEdit={() => handleEdit(item, tab)}
                                  onConfirm={() => {
                                    const status = typeKey === 'course' ? 'CONFIRMED' : (typeKey === 'tournament' ? 'APPROVED' : 'COMPLETED');
                                    handleAction(item.id, typeKey, 'status', status);
                                  }}
                                  onDelete={() => {
                                    setRecordToDelete({ ...item, type: typeKey });
                                    setIsConfirmOpen(true);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 pl-11">
                                <span className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Address</span>
                                <span className="text-xs text-uca-text-primary leading-relaxed line-clamp-2">
                                  {item.student?.address || item.address || item.city || 'N/A'}
                                </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">No records found</div>
                    )}
                  </div>
                  {tab !== 'demos' && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-uca-border">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                      />
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </AdminShell>

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
    </>
  );
};

export default AdminDashboard;
