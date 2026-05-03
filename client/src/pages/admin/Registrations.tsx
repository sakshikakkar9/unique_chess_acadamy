import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, Trophy, RefreshCw, MoreVertical,
  CheckCircle, XCircle, Trash2, Mail, Phone, Eye, Calendar, User, UserCheck, BookOpen, Copy
} from "lucide-react";
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

// ── 1. REFINED STATUS STYLES ──────────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-700 border-amber-200/50",
  APPROVED:  "bg-emerald-50 text-emerald-700 border-emerald-200/50",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200/50",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200/50",
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
  const qc = useQueryClient();

  // Data Fetching
  const { demos, refresh: refreshDemos } = useDemoAdmin();
  const { data: enrollments = [], refetch: refetchCourses } = useQuery({ 
    queryKey: ["courses"], 
    queryFn: async () => (await api.get("/courses/enrollments")).data 
  });
  const { data: registrations = [], refetch: refetchTournaments } = useQuery({ 
    queryKey: ["registrations"], 
    queryFn: async () => (await api.get("/tournaments/admin/registrations/all")).data 
  });

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
      
      qc.invalidateQueries({ queryKey: [type === 'tournament' ? "registrations" : type] });
      if (type === 'demo') refreshDemos();
    } catch (err) { console.error(err); }
  };

  const renderRows = (items: any[], type: 'demo' | 'course' | 'tournament') => (
    items.map((item) => (
      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 group">
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
              {item.studentName?.substring(0, 2).toUpperCase() || "ST"}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{item.studentName}</p>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">{item.gender || 'Not Specified'}</p>
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            {type === 'tournament' ? <Trophy className="h-3.5 w-3.5 text-amber-500" /> : <BookOpen className="h-3.5 w-3.5 text-blue-500" />}
            <span className="text-sm font-bold text-slate-700">{item.tournament?.title || item.course?.title || 'Demo Class'}</span>
          </div>
        </td>
        <td className="p-4 text-xs font-medium text-slate-500">
           {format(new Date(item.createdAt), "MMM d, h:mm a")}
        </td>
        <td className="p-4">
          <div className="flex flex-col text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {item.phone}</span>
            {item.email && <span className="flex items-center gap-1 mt-0.5"><Mail className="h-3 w-3" /> {item.email}</span>}
          </div>
        </td>
        <td className="p-4"><StatusBadge status={item.status} /></td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.status === "PENDING" && (
              <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold" 
                onClick={() => handleAction(item.id, type, 'status', type === 'tournament' ? 'APPROVED' : 'CONFIRMED')}>
                Approve
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-8 text-xs font-bold" 
              onClick={() => handleAction(item.id, type, 'status', 'CANCELLED')}>
              Cancel
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem className="font-bold text-xs py-2" onClick={() => setSelectedItem({ ...item, type })}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-bold text-xs py-2 text-rose-600 focus:text-rose-600" onClick={() => handleAction(item.id, type, 'delete')}>
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
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">Registrations</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Unique Chess Academy Admin Control</p>
        </div>
      </div>

      <Tabs defaultValue="tournament" className="w-full">
        <TabsList className="bg-slate-100/50 p-1 rounded-2xl mb-8 inline-flex">
          <TabsTrigger value="tournament" className="rounded-xl px-6 font-bold text-xs uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm">Tournaments</TabsTrigger>
          <TabsTrigger value="course" className="rounded-xl px-6 font-bold text-xs uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm">Courses</TabsTrigger>
          <TabsTrigger value="demo" className="rounded-xl px-6 font-bold text-xs uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm">Demo Classes</TabsTrigger>
        </TabsList>

        <div className="border border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="p-4">Student</th>
                <th className="p-4">Selection</th>
                <th className="p-4">Date/Time</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <TabsContent value="tournament" asChild>
                <>{renderRows(registrations, 'tournament')}</>
              </TabsContent>
              <TabsContent value="course" asChild>
                <>{renderRows(enrollments, 'course')}</>
              </TabsContent>
              <TabsContent value="demo" asChild>
                <>{renderRows(demos, 'demo')}</>
              </TabsContent>
            </tbody>
          </table>
        </div>
      </Tabs>

      {/* ── 2. REFINED DETAILS SHEET ────────────────────────────────────────── */}
      <Sheet open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <SheetContent className="sm:max-w-lg rounded-l-[3rem] p-0 border-none shadow-2xl">
          {selectedItem && (
            <div className="h-full flex flex-col">
              <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <SheetHeader className="mb-6 relative z-10">
                  <p className="text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">Application Profile</p>
                  <SheetTitle className="text-3xl font-black text-white leading-tight">
                    {selectedItem.studentName}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex gap-4 relative z-10">
                  <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/5">
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Ref ID</p>
                    <p className="text-sm font-mono font-bold tracking-tighter">
                      {selectedItem.referenceId?.slice(-10).toUpperCase() || selectedItem.id.toString().slice(-10).toUpperCase()}
                    </p>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/5">
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Status</p>
                    <p className="text-sm font-bold text-orange-400">{selectedItem.status}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                <section>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Player Bio</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Gender</p>
                      <p className="font-bold text-slate-900">{selectedItem.gender || 'Not Specified'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">DOB</p>
                      <p className="font-bold text-slate-900">{selectedItem.dob ? format(new Date(selectedItem.dob), "PPP") : 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Address</p>
                      <p className="font-bold text-slate-900 text-xs leading-relaxed">{selectedItem.address || 'N/A'}</p>
                    </div>
                  </div>
                </section>

                {selectedItem.type === 'tournament' && (
                  <section>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">FIDE Credentials</h4>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                        <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-tighter">FIDE ID</p>
                        <p className="text-xl font-black text-amber-700">{selectedItem.fideId || 'NA'}</p>
                      </div>
                      <div className="flex-1 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <p className="text-[9px] font-bold text-blue-600/60 uppercase tracking-tighter">Rating</p>
                        <p className="text-xl font-black text-blue-700">{selectedItem.fideRating || '0'}</p>
                      </div>
                    </div>
                  </section>
                )}

                {/* ── 3. REFINED VERIFICATION DOCUMENTS ───────────────────── */}
                <section>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Verification Documents</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group relative aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-100 transition-all hover:border-orange-200">
                      <img src={selectedItem.ageProofUrl || '/placeholder-doc.png'} className="w-full h-full object-cover" alt="Age Proof" />
                      <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                         <p className="text-[10px] font-bold text-white mb-2 uppercase tracking-widest">Age Verification</p>
                         <Button variant="secondary" size="sm" className="h-7 text-[9px] font-black uppercase tracking-tight" onClick={() => window.open(selectedItem.ageProofUrl)}>View Original</Button>
                      </div>
                    </div>
                    <div className="group relative aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-100 transition-all hover:border-orange-200">
                      <img src={selectedItem.paymentProofUrl || '/placeholder-payment.png'} className="w-full h-full object-cover" alt="Payment Proof" />
                      <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                         <p className="text-[10px] font-bold text-white mb-2 uppercase tracking-widest">Fee Confirmation</p>
                         <Button variant="secondary" size="sm" className="h-7 text-[9px] font-black uppercase tracking-tight" onClick={() => window.open(selectedItem.paymentProofUrl)}>View Receipt</Button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}