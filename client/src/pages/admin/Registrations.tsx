import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, Users, Trophy, RefreshCw, 
  CheckCircle, Clock, BookOpen, XCircle, Trash2, Mail, Phone 
} from "lucide-react";
import { useDemoAdmin } from "@/features/demo/hooks/useDemoRegistration";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { CourseEnrollment, DemoRegistration, Registration, AGE_GROUP_LABELS } from "@/types";

// ── Status Configuration ──────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  PENDING:   "bg-amber-500/10 text-amber-500 border-amber-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  APPROVED:  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  REJECTED:  "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold tracking-wide uppercase ${statusStyles[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

// ── Shared Action Logic ───────────────────────────────────────────────────────

const useAdminActions = (refetch: () => void, type: 'demo' | 'course' | 'tournament') => {
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const qc = useQueryClient();

  const handleAction = async (id: string | number, action: 'status' | 'delete', value?: string) => {
    if (action === 'delete' && !window.confirm("Permanent delete? This cannot be undone.")) return;
    setLoadingId(id);
    
    const paths = {
      demo: `/demo/admin/${id}`,
      course: `/courses/enrollments/${id}`,
      tournament: `/tournaments/admin/registrations/${id}`
    };

    try {
      if (action === 'delete') await api.delete(paths[type]);
      else await api.patch(paths[type], { status: value });
      
      await refetch();
      qc.invalidateQueries({ queryKey: [type === 'tournament' ? "registrations" : type] });
    } catch (err) {
      console.error("Action Error:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return { handleAction, loadingId };
};

// ── Reusable Action Group ─────────────────────────────────────────────────────

function ActionGroup({ item, type, handleAction, loadingId, phone, name, context }: any) {
  const openWhatsApp = () => {
    const msg = `Hello ${name}, this is Unique Chess Academy regarding your ${context} request.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10" onClick={openWhatsApp}>
        <MessageCircle className="h-4 w-4" />
      </Button>
      
      {item.status === "PENDING" && (
        <Button size="sm" variant="outline" className="h-8 text-blue-500 border-blue-500/20" disabled={!!loadingId} onClick={() => handleAction(item.id, 'status', type === 'tournament' ? 'APPROVED' : 'CONFIRMED')}>
          Approve
        </Button>
      )}

      <Button size="sm" variant="ghost" className="h-8 text-muted-foreground hover:text-foreground" onClick={() => handleAction(item.id, 'status', 'CANCELLED')}>
        Cancel
      </Button>

      <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-500 hover:bg-rose-500/10" onClick={() => handleAction(item.id, 'delete')}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ── Tabs Implementation ───────────────────────────────────────────────────────

function DemoRequestsTab() {
  const { demos, isLoading, refresh } = useDemoAdmin();
  const { handleAction, loadingId } = useAdminActions(refresh, 'demo');
  const active = demos.filter((d: any) => d.status !== "CANCELLED");

  if (isLoading) return <LoadingState />;
  return (
    <TableShell count={active.length} label="Request">
      <tbody className="divide-y">
        {active.map((req: any) => (
          <tr key={req.id} className="hover:bg-muted/5 transition-colors">
            <td className="p-4 font-medium">{req.studentName}</td>
            <td className="p-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><Phone className="h-3 w-3"/> {req.phone}</div>
              <div className="flex items-center gap-1 mt-1"><Mail className="h-3 w-3"/> {req.email}</div>
            </td>
            <td className="p-4"><StatusBadge status={req.status} /></td>
            <td className="p-4">
              <ActionGroup item={req} type="demo" handleAction={handleAction} loadingId={loadingId} phone={req.phone} name={req.studentName} context="Demo Class" />
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function CourseEnrollmentsTab() {
  const { data: enrollments = [], isLoading, refetch } = useQuery({ queryKey: ["courses"], queryFn: async () => (await api.get("/courses/enrollments")).data });
  const { handleAction, loadingId } = useAdminActions(refetch, 'course');
  const active = enrollments.filter((e: any) => e.status !== "CANCELLED");

  if (isLoading) return <LoadingState />;
  return (
    <TableShell count={active.length} label="Enrollment">
      <tbody className="divide-y">
        {active.map((enr: any) => (
          <tr key={enr.id} className="hover:bg-muted/5 transition-colors">
            <td className="p-4 font-medium">{enr.studentName}</td>
            <td className="p-4 text-sm">{enr.course?.title}</td>
            <td className="p-4"><StatusBadge status={enr.status} /></td>
            <td className="p-4">
              <ActionGroup item={enr} type="course" handleAction={handleAction} loadingId={loadingId} phone={enr.phone} name={enr.studentName} context="Course Enrollment" />
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function TournamentEnrollmentsTab() {
  const { data: registrations = [], isLoading, refetch } = useQuery({ queryKey: ["registrations"], queryFn: async () => (await api.get("/tournaments/admin/registrations/all")).data });
  const { handleAction, loadingId } = useAdminActions(refetch, 'tournament');
  const active = registrations.filter((r: any) => r.status !== "CANCELLED");

  if (isLoading) return <LoadingState />;
  return (
    <TableShell count={active.length} label="Registration">
      <tbody className="divide-y">
        {active.map((reg: any) => (
          <tr key={reg.id} className="hover:bg-muted/5 transition-colors">
            <td className="p-4 font-medium">{reg.studentName || reg.name}</td>
            <td className="p-4 text-sm font-medium"><Trophy className="inline h-3 w-3 mr-1 text-amber-500" /> {reg.tournament?.title}</td>
            <td className="p-4"><StatusBadge status={reg.status} /></td>
            <td className="p-4">
              <ActionGroup item={reg} type="tournament" handleAction={handleAction} loadingId={loadingId} phone={reg.phone} name={reg.studentName || reg.name} context="Tournament" />
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

// ── UI Shell Helpers ─────────────────────────────────────────────────────────

function LoadingState() {
  return <div className="py-20 text-center text-muted-foreground animate-pulse"><RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" /> Loading records...</div>;
}

function TableShell({ children, count, label }: { children: React.ReactNode, count: number, label: string }) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-muted/20 border-b flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{count} Active {label}s</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/30 text-[11px] uppercase font-bold text-muted-foreground">
            <tr>
              <th className="p-4">Student</th><th className="p-4">Details</th>
              <th className="p-4">Status</th><th className="p-4">Actions</th>
            </tr>
          </thead>
          {children}
        </table>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function RegistrationsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Academy Management</h1>
        <p className="text-muted-foreground mt-2 text-lg">Central control for all student applications and registrations.</p>
      </div>

      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md bg-muted/50 p-1 mb-8">
          <TabsTrigger value="demo" className="data-[state=active]:bg-background">Demos</TabsTrigger>
          <TabsTrigger value="course" className="data-[state=active]:bg-background">Courses</TabsTrigger>
          <TabsTrigger value="tournament" className="data-[state=active]:bg-background">Tournaments</TabsTrigger>
        </TabsList>

        <TabsContent value="demo"><DemoRequestsTab /></TabsContent>
        <TabsContent value="course"><CourseEnrollmentsTab /></TabsContent>
        <TabsContent value="tournament"><TournamentEnrollmentsTab /></TabsContent>
      </Tabs>
    </div>
  );
}