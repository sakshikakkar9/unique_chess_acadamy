import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, Trophy, RefreshCw, MoreVertical,
  CheckCircle, XCircle, Trash2, Mail, Phone, Eye, Calendar, User, UserCheck, BookOpen, Copy,
  Search, Filter, ExternalLink, ShieldCheck, CreditCard, Info, Image as ImageIcon
} from "lucide-react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── 1. REFINED STATUS STYLES ──────────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-700 border-amber-200/50",
  APPROVED:  "bg-emerald-50 text-emerald-700 border-emerald-200/50",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200/50",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200/50",
  REJECTED:  "bg-rose-50 text-rose-700 border-rose-200/50",
  COMPLETED: "bg-purple-50 text-purple-700 border-purple-200/50",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-[0.15em] ${statusStyles[status] || "bg-slate-50 text-slate-500"}`}>
      {status}
    </span>
  );
}

export default function RegistrationsPage() {
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

  const handleAction = async (id: string | number, type: string, action: 'status' | 'delete', value?: string) => {
    if (action === 'delete' && !window.confirm("Permanent delete? This cannot be undone.")) return;
    
    const paths: any = {
      demo: `/demo/admin/${id}`,
      course: `/courses/enrollments/${id}`,
      tournament: `/tournaments/admin/registrations/${id}`
    };

    try {
      if (action === 'delete') await api.delete(paths[type]);
      else await api.patch(paths[type], { status: value });
      
      const queryKey = type === 'tournament' ? "registrations" : type === 'course' ? "course-enrollments" : type;
      qc.invalidateQueries({ queryKey: [queryKey] });
      if (type === 'demo') refreshDemos();

      if (selectedItem && selectedItem.id === id) {
        if (action === 'delete') setSelectedItem(null);
        else setSelectedItem({ ...selectedItem, status: value });
      }

      toast.success(`${action === 'delete' ? 'Deleted' : 'Updated'} successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  const renderRows = (items: any[], type: 'demo' | 'course' | 'tournament') => (
    items.length === 0 ? (
      <tr>
        <td colSpan={6} className="p-20 text-center">
          <div className="flex flex-col items-center gap-2 text-slate-300">
            <Search className="h-10 w-10" />
            <p className="font-bold uppercase tracking-widest text-xs">No records found</p>
          </div>
        </td>
      </tr>
    ) : items.map((item) => (
      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 group">
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
              {item.studentName?.substring(0, 2).toUpperCase() || "ST"}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{item.studentName}</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">{item.gender || 'Not Specified'}</p>
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            {type === 'tournament' ? <Trophy className="h-3.5 w-3.5 text-amber-500" /> : <BookOpen className="h-3.5 w-3.5 text-blue-500" />}
            <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{item.tournament?.title || item.course?.title || 'Demo Class'}</span>
          </div>
        </td>
        <td className="p-4 text-[11px] font-bold text-slate-500 uppercase">
           {format(new Date(item.createdAt), "MMM d, h:mm a")}
        </td>
        <td className="p-4">
          <div className="flex flex-col text-[10px] font-black text-slate-400 tracking-tight">
            <span className="flex items-center gap-1"><Phone className="h-2.5 w-2.5 text-slate-300" /> {item.phone}</span>
            {item.email && <span className="flex items-center gap-1 mt-0.5"><Mail className="h-2.5 w-2.5 text-slate-300" /> {item.email}</span>}
          </div>
        </td>
        <td className="p-4"><StatusBadge status={item.status} /></td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.status === "PENDING" && (
              <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                onClick={() => handleAction(item.id, type, 'status', type === 'course' ? 'CONFIRMED' : 'APPROVED')}>
                Approve
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full"><MoreVertical className="h-4 w-4 text-slate-400" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-100 shadow-xl p-2">
                <DropdownMenuItem className="font-bold text-[11px] uppercase tracking-widest py-3 rounded-xl cursor-pointer" onClick={() => setSelectedItem({ ...item, type })}>
                  <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-bold text-[11px] uppercase tracking-widest py-3 rounded-xl cursor-pointer text-rose-600 focus:text-rose-600" onClick={() => handleAction(item.id, type, 'delete')}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Record
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>
    ))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900">Registrations</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-3 flex items-center gap-2">
            <div className="h-1 w-8 bg-blue-600 rounded-full" /> Admin Intelligence Portal
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search students, phones, IDs..."
              className="pl-11 h-12 w-full md:w-72 rounded-[1.25rem] border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 w-40 rounded-[1.25rem] border-slate-200 font-bold text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
              <SelectItem value="ALL" className="font-bold text-[10px] uppercase tracking-widest py-3">All Status</SelectItem>
              <SelectItem value="PENDING" className="font-bold text-[10px] uppercase tracking-widest py-3">Pending</SelectItem>
              <SelectItem value="APPROVED" className="font-bold text-[10px] uppercase tracking-widest py-3 text-emerald-600">Approved</SelectItem>
              <SelectItem value="CONFIRMED" className="font-bold text-[10px] uppercase tracking-widest py-3 text-blue-600">Confirmed</SelectItem>
              <SelectItem value="REJECTED" className="font-bold text-[10px] uppercase tracking-widest py-3 text-rose-600">Rejected</SelectItem>
              <SelectItem value="CANCELLED" className="font-bold text-[10px] uppercase tracking-widest py-3 text-slate-500">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="course" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 p-2 bg-slate-50 rounded-[2rem] border border-slate-100">
          <TabsList className="bg-transparent gap-2">
            <TabsTrigger value="tournament" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-blue-600 transition-all">
              Tournaments
            </TabsTrigger>
            <TabsTrigger value="course" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-blue-600 transition-all">
              Courses
            </TabsTrigger>
            <TabsTrigger value="demo" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-blue-600 transition-all">
              Demo Classes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="course" className="m-0">
             <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="h-11 w-56 rounded-2xl border-none bg-white shadow-sm font-bold text-[10px] uppercase tracking-widest px-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <SelectValue placeholder="Filter by Course" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                  <SelectItem value="ALL" className="font-bold text-[10px] uppercase tracking-widest py-3">All Programs</SelectItem>
                  {courses.map((c: any) => (
                    <SelectItem key={c.id} value={c.title} className="font-bold text-[10px] uppercase tracking-widest py-3">{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </TabsContent>
        </div>

        <div className="border border-slate-100 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-slate-200/50">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                <th className="p-6">Student Profile</th>
                <th className="p-6">Program / Event</th>
                <th className="p-6">Submission Date</th>
                <th className="p-6">Contact Info</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <TabsContent value="tournament" asChild>
                <>
                  {tournamentLoading ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
                        <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Loading Entries...</p>
                      </td>
                    </tr>
                  ) : renderRows(filteredRegistrations, 'tournament')}
                </>
              </TabsContent>
              <TabsContent value="course" asChild>
                <>
                  {enrollLoading ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
                        <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Loading Enrollments...</p>
                      </td>
                    </tr>
                  ) : renderRows(filteredEnrollments, 'course')}
                </>
              </TabsContent>
              <TabsContent value="demo" asChild>
                <>{renderRows(filteredDemos, 'demo')}</>
              </TabsContent>
            </tbody>
          </table>
        </div>
      </Tabs>

      {/* ── 2. REFINED DETAILS SHEET ────────────────────────────────────────── */}
      <Sheet open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <SheetContent className="sm:max-w-xl rounded-l-[3.5rem] p-0 border-none shadow-2xl">
          {selectedItem && (
            <div className="h-full flex flex-col bg-slate-50/50">
              <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
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
                    {selectedItem.studentName}
                  </SheetTitle>
                  <p className="text-slate-400 font-bold text-sm mt-2 flex items-center gap-2">
                    {selectedItem.type === 'tournament' ? <Trophy className="h-4 w-4 text-amber-500" /> : <BookOpen className="h-4 w-4 text-blue-500" />}
                    {selectedItem.tournament?.title || selectedItem.course?.title || 'Initial Demo Session'}
                  </p>
                </SheetHeader>

                <div className="flex gap-4 relative z-10">
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
                    <p className="text-xs font-bold">{format(new Date(selectedItem.createdAt), "PPP")}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-white rounded-tl-[3.5rem] -mt-8 relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.05)]">
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
                      <p className="font-bold text-slate-900">{selectedItem.gender || 'Not Specified'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Birth Date</p>
                      <p className="font-bold text-slate-900">{selectedItem.dob ? format(new Date(selectedItem.dob), "PPP") : 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-blue-500" /> Contact Number
                      </p>
                      <p className="font-bold text-slate-900 text-sm tracking-tight">{selectedItem.phone || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-blue-500" /> Email Address
                      </p>
                      <p className="font-bold text-slate-900 text-xs truncate tracking-tight">{selectedItem.email || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 col-span-2 group hover:border-blue-200 transition-all">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Residential Address</p>
                      <p className="font-bold text-slate-900 text-xs leading-relaxed tracking-tight">{selectedItem.address || 'N/A'}</p>
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
                        <p className="text-2xl font-black text-amber-700 leading-none tracking-tighter">{selectedItem.fideId || 'NA'}</p>
                      </div>
                      <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex flex-col justify-center">
                        <p className="text-[9px] font-black text-blue-600/60 uppercase tracking-widest mb-2">Rating</p>
                        <p className="text-2xl font-black text-blue-700 leading-none tracking-tighter">{selectedItem.fideRating || '0'}</p>
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
                        <p className="font-bold text-slate-900">{selectedItem.discoverySource || 'Direct Search'}</p>
                      </div>
                      <div className="bg-slate-900 p-6 rounded-[2rem] col-span-2 shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
                        <div className="relative z-10">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <CreditCard className="h-3 w-3 text-blue-500" /> Transaction Intel
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xl font-black text-white font-mono tracking-[0.15em]">{selectedItem.transactionId || 'NOT_FOUND'}</p>
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
              <div className="p-8 bg-white border-t border-slate-100 flex items-center gap-4 relative z-30">
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
