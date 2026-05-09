import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Trophy, RefreshCw, MoreVertical,
  Trash2, Mail, Phone, Eye, BookOpen, Copy,
  Search, Filter, ExternalLink, ShieldCheck, CreditCard, Image as ImageIcon,
  User, UserCheck
} from "lucide-react";
import AdminPageHeader from "@/components/shared/admin/AdminPageHeader";
import StatusBadge from "@/components/shared/admin/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useDemoAdmin } from "@/features/demo/hooks/useDemoRegistration";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type RegistrationTab = 'course' | 'tournament' | 'demo';

export default function RegistrationsPage() {
  const [activeTab, setActiveTab] = useState<RegistrationTab>("course");
  const [selectedItem, setSelectedItem] = useState<any>(null);
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
      const matchesSearch = (item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.phone?.includes(searchTerm) ||
                            item.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchesCourse = courseFilter === "ALL" || item.course?.title === courseFilter;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [enrollments, searchTerm, statusFilter, courseFilter]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item: any) => {
      const matchesSearch = (item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.phone?.includes(searchTerm) ||
                            item.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [registrations, searchTerm, statusFilter]);

  const filteredDemos = useMemo(() => {
    return (demos || []).filter((item: any) => {
      const matchesSearch = (item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.phone?.includes(searchTerm));
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [demos, searchTerm, statusFilter]);

  const handleAction = async (id: string | number, type: string, action: 'status' | 'delete' | 'paymentStatus', value?: string) => {
    if (action === 'delete' && !window.confirm("Permanent delete? This cannot be undone.")) return;
    
    const paths: any = {
      demo: `/demo/admin/${id}`,
      course: `/courses/enrollments/${id}`,
      tournament: `/tournaments/admin/registrations/${id}`
    };

    try {
      if (action === 'delete') {
        await api.delete(paths[type]);
      } else if (action === 'paymentStatus') {
        await api.patch(paths[type], { paymentStatus: value });
      } else {
        await api.patch(paths[type], { status: value });
      }
      
      const queryKey = type === 'tournament' ? "registrations" : type === 'course' ? "course-enrollments" : type;
      qc.invalidateQueries({ queryKey: [queryKey] });
      if (type === 'demo') refreshDemos();

      if (selectedItem && selectedItem.id === id) {
        if (action === 'delete') setSelectedItem(null);
        else if (action === 'paymentStatus') setSelectedItem({ ...selectedItem, paymentStatus: value });
        else setSelectedItem({ ...selectedItem, status: value });
      }

      toast.success(`${action === 'delete' ? 'Deleted' : 'Updated'} successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  const getActiveData = () => {
    if (activeTab === 'tournament') return { data: filteredRegistrations, loading: tournamentLoading, type: 'tournament' as const };
    if (activeTab === 'demo') return { data: filteredDemos, loading: false, type: 'demo' as const };
    return { data: filteredEnrollments, loading: enrollLoading, type: 'course' as const };
  };

  const { data: currentData, loading: currentLoading, type: currentType } = getActiveData();

  const getAvatarStyles = (name: string) => {
    const firstLetter = (name || "?").charAt(0).toUpperCase();
    if ("ABCDE".includes(firstLetter)) return { bg: "#e0f2fe", color: "#0284c7" };
    if ("FGHIJ".includes(firstLetter)) return { bg: "#ede9fe", color: "#6d28d9" };
    if ("KLMNO".includes(firstLetter)) return { bg: "#d1fae5", color: "#065f46" };
    if ("PQRST".includes(firstLetter)) return { bg: "#fef3c7", color: "#b45309" };
    return { bg: "#fce7f3", color: "#be185d" };
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <AdminPageHeader
        title="Registrations"
        subtitle="Review and manage student enrollments across all programs."
      />

      <div
        className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white"
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
              placeholder="Search students, phones, IDs..."
              className="pl-10 h-11 w-full md:w-80 rounded-xl border-slate-200 focus:ring-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-44 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
              <SelectItem value="ALL" className="font-bold text-[10px] uppercase tracking-widest py-3">All Status</SelectItem>
              <SelectItem value="PENDING" className="font-bold text-[10px] uppercase tracking-widest py-3">Pending</SelectItem>
              <SelectItem value="APPROVED" className="font-bold text-[10px] uppercase tracking-widest py-3 text-emerald-600">Approved</SelectItem>
              <SelectItem value="CONFIRMED" className="font-bold text-[10px] uppercase tracking-widest py-3 text-sky-600">Confirmed</SelectItem>
              <SelectItem value="REJECTED" className="font-bold text-[10px] uppercase tracking-widest py-3 text-rose-600">Rejected</SelectItem>
              <SelectItem value="CANCELLED" className="font-bold text-[10px] uppercase tracking-widest py-3 text-slate-500">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RegistrationTab)} className="w-full md:w-auto">
          <TabsList className="bg-slate-100 p-1 rounded-full h-11 w-full md:w-auto">
            <TabsTrigger value="tournament" className="rounded-full px-6 py-2 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm transition-all h-9">
              Tournaments
            </TabsTrigger>
            <TabsTrigger value="course" className="rounded-full px-6 py-2 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm transition-all h-9">
              Courses
            </TabsTrigger>
            <TabsTrigger value="demo" className="rounded-full px-6 py-2 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm transition-all h-9">
              Demo Classes
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div
        className="bg-white overflow-hidden"
        style={{
          border: '1px solid #e0eeff',
          borderRadius: '14px'
        }}
      >
          <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Real-time Registration Feed ({activeTab})</span>
            </div>

            {activeTab === 'course' && (
               <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="h-9 w-52 rounded-lg border-slate-200 bg-white font-bold text-[9px] uppercase tracking-widest px-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                      <SelectValue placeholder="Filter by Course" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    <SelectItem value="ALL" className="font-bold text-[9px] uppercase tracking-widest py-2.5">All Programs</SelectItem>
                    {courses.map((c: any) => (
                      <SelectItem key={c.id} value={c.title} className="font-bold text-[9px] uppercase tracking-widest py-2.5">{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            )}
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase text-[#64748b] tracking-[0.08em]">
                <th className="p-4 px-6">Student Profile</th>
                <th className="p-4 px-6">Program</th>
                <th className="p-4 px-6">Submission Date</th>
                <th className="p-4 px-6">Contact Info</th>
                <th className="p-4 px-6 text-center">Status</th>
                <th className="p-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
                {currentLoading ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
                        <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Loading Entries...</p>
                      </td>
                    </tr>
                ) : currentData.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                            <Search className="h-10 w-10" />
                            <p className="font-bold uppercase tracking-widest text-xs">No records found</p>
                        </div>
                        </td>
                    </tr>
                ) : (
                    currentData.map((item: any) => {
                      const avatarStyles = getAvatarStyles(item.studentName || item.student?.fullName || "?");
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-[#f0f9ff] transition-all duration-120 border-b border-[#f1f5f9] group cursor-pointer"
                          onClick={() => setSelectedItem({ ...item, type: currentType })}
                        >
                          <td className="p-4 px-6">
                            <div className="flex items-center gap-3">
                              <div
                                style={{
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '50%',
                                  backgroundColor: avatarStyles.bg,
                                  color: avatarStyles.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  flexShrink: 0
                                }}
                              >
                                {item.student?.fullName?.charAt(0).toUpperCase() || item.studentName?.charAt(0).toUpperCase() || "S"}
                              </div>
                              <div className="min-w-0">
                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }} className="truncate">{item.student?.fullName || item.studentName}</p>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                  {item.student?.gender || item.gender || 'Not Specified'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 px-6">
                            <div className="flex items-center gap-2">
                              {currentType === 'tournament' ? <Trophy className="h-3.5 w-3.5 text-amber-500" /> : <BookOpen className="h-3.5 w-3.5 text-[#0284c7]" />}
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }} className="truncate max-w-[180px]">
                                {item.tournament?.title || item.course?.title || 'Demo Class'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 px-6" style={{ fontSize: '11px', color: '#94a3b8' }}>
                             {item.createdAt ? format(new Date(item.createdAt), "MMM d, h:mm a") : 'N/A'}
                          </td>
                          <td className="p-4 px-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#94a3b8' }}>
                                <Phone className="h-3 w-3" /> {item.phone}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 px-6 text-center">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="p-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.status === "PENDING" && (
                                <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                                  onClick={() => handleAction(item.id, currentType, 'status', currentType === 'course' ? 'CONFIRMED' : 'APPROVED')}>
                                  Approve
                                </Button>
                              )}

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full"><MoreVertical className="h-4 w-4 text-slate-400" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-100 shadow-xl p-2">
                                  <DropdownMenuItem className="font-bold text-[11px] uppercase tracking-widest py-3 rounded-xl cursor-pointer" onClick={() => setSelectedItem({ ...item, type: currentType })}>
                                    <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="font-bold text-[11px] uppercase tracking-widest py-3 rounded-xl cursor-pointer text-rose-600 focus:text-rose-600" onClick={() => handleAction(item.id, currentType, 'delete')}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Record
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                )}
            </tbody>
          </table>
    </div>

      {/* ── 2. REFINED DETAILS SHEET ────────────────────────────────────────── */}
      <Sheet open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <SheetContent className="sm:max-w-xl rounded-l-[3.5rem] p-0 border-none shadow-2xl overflow-y-auto">
          {selectedItem && (
            <div className="h-full flex flex-col bg-slate-50/50">
              <div className="bg-slate-900 p-10 text-white relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[60px] -ml-16 -mb-16" />

                <SheetHeader className="mb-8 relative z-10 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg">
                      {selectedItem.type === 'course' ? 'Course Enrollment' : selectedItem.type === 'tournament' ? 'Tournament Entry' : 'Demo Request'}
                    </span>
                    <StatusBadge status={selectedItem.status} />
                  </div>
                  <SheetTitle className="text-4xl font-black text-white leading-tight tracking-tighter">
                    {selectedItem.student?.fullName || selectedItem.studentName}
                  </SheetTitle>
                  <p className="text-slate-400 font-bold text-sm mt-2 flex items-center gap-2">
                    {selectedItem.type === 'tournament' ? <Trophy className="h-4 w-4 text-amber-500" /> : <BookOpen className="h-4 w-4 text-blue-500" />}
                    {selectedItem.tournament?.title || selectedItem.course?.title || 'Initial Demo Session'}
                  </p>
                </SheetHeader>

                <div className="flex flex-wrap gap-4 relative z-10">
                  <div className="bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 flex flex-col gap-1">
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Reference ID</p>
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-mono font-bold tracking-widest text-blue-400">
                        {selectedItem.referenceId || selectedItem.id.toString().slice(-12).toUpperCase()}
                      </p>
                      <button onClick={() => {
                        navigator.clipboard.writeText(selectedItem.referenceId || selectedItem.id);
                        toast.success("Ref ID Copied");
                      }} className="text-white/20 hover:text-white transition-colors">
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 flex flex-col gap-1">
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Registration Date</p>
                    <p className="text-xs font-bold">{selectedItem.createdAt ? format(new Date(selectedItem.createdAt), "PPP") : 'N/A'}</p>
                  </div>
                  {selectedItem.type !== 'demo' && (
                    <div className="bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 flex flex-col gap-1">
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Payment</p>
                      <StatusBadge status={selectedItem.paymentStatus || 'PENDING'} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 p-10 space-y-12 bg-white rounded-tl-[3.5rem] -mt-8 relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.05)]">
                {/* Section: Personal Intelligence */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                        <User className="h-5 w-5 text-orange-500" />
                      </div>
                      <h4 className="text-sm font-black uppercase text-slate-900 tracking-widest">Personal Intelligence</h4>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Gender</p>
                      <p className="font-bold text-slate-900">{selectedItem.student?.gender || selectedItem.gender || 'Not Specified'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Birth Date</p>
                      <p className="font-bold text-slate-900">{(selectedItem.student?.dob || selectedItem.dob) ? format(new Date(selectedItem.student?.dob || selectedItem.dob), "PPP") : 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-blue-500" /> Contact Number
                      </p>
                      <p className="font-bold text-slate-900 text-sm tracking-tight">{selectedItem.student?.phone || selectedItem.phone || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-blue-500" /> Email Address
                      </p>
                      <p className="font-bold text-slate-900 text-xs truncate tracking-tight">{selectedItem.student?.email || selectedItem.email || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 col-span-2 group hover:border-blue-200 transition-all">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Residential Address</p>
                      <p className="font-bold text-slate-900 text-xs leading-relaxed tracking-tight">{selectedItem.student?.address || selectedItem.address || 'N/A'}</p>
                    </div>
                  </div>
                </section>

                {/* Section: Academic & FIDE Profiles */}
                {(selectedItem.type === 'tournament' || selectedItem.type === 'course') && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-black uppercase text-slate-900 tracking-widest">Academic & FIDE Profile</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 flex flex-col justify-center">
                        <p className="text-[9px] font-black text-amber-600/60 uppercase tracking-widest mb-2">FIDE ID</p>
                      <p className="text-2xl font-black text-amber-700 leading-none tracking-tighter">{selectedItem.student?.fideId || selectedItem.fideId || 'NA'}</p>
                      </div>
                      <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex flex-col justify-center">
                        <p className="text-[9px] font-black text-blue-600/60 uppercase tracking-widest mb-2">Rating</p>
                      <p className="text-2xl font-black text-blue-700 leading-none tracking-tighter">{selectedItem.student?.fideRating || selectedItem.fideRating || '0'}</p>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Skill Category</p>
                        <p className="font-bold text-slate-900">{selectedItem.category || 'General'}</p>
                      </div>
                      {selectedItem.type === 'course' && (
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Experience Level</p>
                          <p className="font-bold text-slate-900">{selectedItem.experienceLevel || 'Beginner'}</p>
                        </div>
                      )}
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 col-span-2 hover:border-blue-200 transition-all">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Discovery Attribution</p>
                        <p className="font-bold text-slate-900">{selectedItem.student?.discoverySource || selectedItem.discoverySource || 'Direct Search'}</p>
                      </div>
                      <div className="bg-slate-900 p-6 rounded-[2rem] col-span-2 shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
                        <div className="relative z-10">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <CreditCard className="h-3 w-3 text-blue-500" /> Transaction Intel
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xl font-black text-white font-mono tracking-[0.15em]">{selectedItem.transactionId || 'NOT_FOUND'}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className={cn(
                                  "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                                  selectedItem.paymentStatus === 'VERIFIED' ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                                )}>
                                  {selectedItem.paymentStatus || 'PENDING'}
                                </span>
                                {selectedItem.paymentStatus !== 'VERIFIED' && (
                                  <Button
                                    variant="link"
                                    className="h-auto p-0 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300"
                                    onClick={() => handleAction(selectedItem.id, selectedItem.type, 'paymentStatus', 'VERIFIED')}
                                  >
                                    Mark Verified
                                  </Button>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-white/40 hover:text-white hover:bg-white/10 rounded-xl" onClick={() => {
                              if(selectedItem.transactionId) {
                                navigator.clipboard.writeText(selectedItem.transactionId);
                                toast.success("Intel Copied to Clipboard");
                              }
                            }}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Section: Visual Verification */}
                {selectedItem.type !== 'demo' && (
                <section className="pb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                      <ImageIcon className="h-5 w-5 text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-black uppercase text-slate-900 tracking-widest">Visual Verification</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="group relative aspect-square bg-slate-100 rounded-[2rem] overflow-hidden border-2 border-slate-100 transition-all hover:border-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/10">
                      <img src={selectedItem.ageProofUrl || '/placeholder-doc.png'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Age Proof" />
                      <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[4px] p-6 text-center">
                         <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                           <UserCheck className="h-6 w-6 text-white" />
                         </div>
                         <p className="text-[10px] font-black text-white mb-4 uppercase tracking-[0.2em]">Age Verification</p>
                         <Button variant="secondary" size="sm" className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={() => window.open(selectedItem.ageProofUrl)}>
                           <ExternalLink className="mr-2 h-3.5 w-3.5" /> Full Scope
                         </Button>
                      </div>
                    </div>
                    <div className="group relative aspect-square bg-slate-100 rounded-[2rem] overflow-hidden border-2 border-slate-100 transition-all hover:border-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/10">
                      <img src={selectedItem.paymentProofUrl || '/placeholder-payment.png'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Payment Proof" />
                      <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[4px] p-6 text-center">
                         <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                           <CreditCard className="h-6 w-6 text-white" />
                         </div>
                         <p className="text-[10px] font-black text-white mb-4 uppercase tracking-[0.2em]">Fee Confirmation</p>
                         <Button variant="secondary" size="sm" className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={() => window.open(selectedItem.paymentProofUrl)}>
                           <ExternalLink className="mr-2 h-3.5 w-3.5" /> Full Scope
                         </Button>
                      </div>
                    </div>
                  </div>
                </section>
                )}
              </div>

              {/* Sheet Footer Actions */}
              <div className="p-8 bg-white border-t border-slate-100 flex items-center gap-4 relative z-30 shrink-0">
                {selectedItem.status === "PENDING" && (
                  <Button
                    className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20"
                    onClick={() => handleAction(selectedItem.id, selectedItem.type, 'status', selectedItem.type === 'course' ? 'CONFIRMED' : 'APPROVED')}
                  >
                    Confirm Application
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200 hover:bg-slate-50 transition-all"
                  onClick={() => handleAction(selectedItem.id, selectedItem.type, 'status', selectedItem.type === 'course' ? 'REJECTED' : 'CANCELLED')}
                >
                  {selectedItem.type === 'course' ? 'Reject Application' : 'Cancel Entry'}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
