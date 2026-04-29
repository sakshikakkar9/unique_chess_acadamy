import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Trophy, RefreshCw, CheckCircle, Clock, BookOpen, XCircle } from "lucide-react";
import { useDemoAdmin } from "@/features/demo/hooks/useDemoRegistration";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { CourseEnrollment, DemoRegistration, Registration } from "@/types";
import { AGE_GROUP_LABELS } from "@/types";

// ── Status helpers ────────────────────────────────────────────────────────────

const demoStatusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING:   { label: "Pending",   color: "bg-amber-500/10 text-amber-400 border-amber-500/30",  icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500/10 text-blue-400 border-blue-500/30",    icon: CheckCircle },
  COMPLETED: { label: "Completed", color: "bg-green-500/10 text-green-400 border-green-500/30", icon: CheckCircle },
};

const enrollStatusConfig: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pending",   color: "bg-amber-500/10 text-amber-400 border-amber-500/30"  },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500/10 text-blue-400 border-blue-500/30"    },
  COMPLETED: { label: "Completed", color: "bg-green-500/10 text-green-400 border-green-500/30" },
  REJECTED:  { label: "Rejected",  color: "bg-red-500/10 text-red-400 border-red-500/30"       },
};

const regStatusConfig: Record<string, { label: string; color: string }> = {
  PENDING:  { label: "Pending",  color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  APPROVED: { label: "Approved", color: "bg-green-500/10 text-green-400 border-green-500/30" },
  REJECTED: { label: "Rejected", color: "bg-red-500/10 text-red-400 border-red-500/30" },
};

function DemoStatusBadge({ status }: { status: string }) {
  const cfg = demoStatusConfig[status] ?? { label: status, color: "bg-muted text-muted-foreground border-border", icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border ${cfg.color}`}>
      <Icon className="h-3 w-3" />{cfg.label}
    </span>
  );
}

function EnrollStatusBadge({ status }: { status: string }) {
  const cfg = enrollStatusConfig[status] ?? { label: status, color: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function RegStatusBadge({ status }: { status: string }) {
  const cfg = regStatusConfig[status] ?? { label: status, color: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

// ── Demo Requests Tab ─────────────────────────────────────────────────────────

function DemoRequestsTab() {
  const { demos, isLoading, refresh } = useDemoAdmin();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const openWhatsApp = (phone: string, name: string) => {
    const msg = `Hello ${name}, this is Unique Chess Academy. We received your request for a free demo class!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/demo/admin/${id}`, { status });
      await refresh();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) return <LoadingRow />;
  if (!demos.length) return <EmptyState icon={Users} text="No demo requests yet" sub="When students book a free demo, they will appear here." />;

  return (
    <TableShell count={demos.length} label="Request" onRefresh={refresh}>
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="p-4">Student</th><th className="p-4">Contact</th>
          <th className="p-4">Preferred Date</th><th className="p-4">Applied On</th>
          <th className="p-4">Status</th><th className="p-4">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border text-sm">
        {(demos as DemoRegistration[]).map((req) => (
          <tr key={req.id} className="hover:bg-muted/10 transition-colors">
            <td className="p-4 font-medium">{req.studentName}</td>
            <td className="p-4 text-muted-foreground">{req.phone}<br /><span className="text-xs">{req.email}</span></td>
            <td className="p-4 text-muted-foreground">
              {req.scheduledAt ? new Date(req.scheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "—"}
            </td>
            <td className="p-4 text-muted-foreground">{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "—"}</td>
            <td className="p-4"><DemoStatusBadge status={req.status} /></td>
            <td className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" variant="outline" className="gap-1.5 border-green-500/50 text-green-500 hover:bg-green-500/10" onClick={() => openWhatsApp(req.phone, req.studentName)}>
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </Button>
                {req.status === "PENDING" && (
                  <Button size="sm" variant="outline" className="gap-1.5 border-blue-500/50 text-blue-400 hover:bg-blue-500/10" disabled={updatingId === req.id} onClick={() => updateStatus(req.id, "CONFIRMED")}>
                    <CheckCircle className="h-3.5 w-3.5" /> Confirm
                  </Button>
                )}
                {req.status === "CONFIRMED" && (
                  <Button size="sm" variant="outline" className="gap-1.5 border-green-500/50 text-green-400 hover:bg-green-500/10" disabled={updatingId === req.id} onClick={() => updateStatus(req.id, "COMPLETED")}>
                    <CheckCircle className="h-3.5 w-3.5" /> Mark Done
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

// ── Course Enrollments Tab ────────────────────────────────────────────────────

function CourseEnrollmentsTab() {
  const qc = useQueryClient();
  const { data: enrollments = [], isLoading, refetch } = useQuery<CourseEnrollment[]>({
    queryKey: ["course-enrollments"],
    queryFn: async () => {
      const res = await api.get("/courses/enrollments");
      return res.data;
    },
  });
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const openWhatsApp = (phone: string, name: string, courseTitle: string) => {
    const msg = `Hello ${name}, this is Unique Chess Academy. We received your enrollment request for "${courseTitle}". We'll be in touch shortly!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/courses/enrollments/${id}`, { status });
      await refetch();
      qc.invalidateQueries({ queryKey: ["course-enrollments"] });
    } catch (err) {
      console.error("Failed to update enrollment status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) return <LoadingRow />;
  if (!enrollments.length) return <EmptyState icon={BookOpen} text="No course enrollments yet" sub="When students enroll in a course, they will appear here." />;

  return (
    <TableShell count={enrollments.length} label="Enrollment" onRefresh={() => refetch()}>
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="p-4">Student</th><th className="p-4">Contact</th>
          <th className="p-4">Course</th><th className="p-4">Mode</th><th className="p-4">Message</th>
          <th className="p-4">Enrolled On</th><th className="p-4">Status</th>
          <th className="p-4">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border text-sm">
        {enrollments.map((enr: any) => (
          <tr key={enr.id} className="hover:bg-muted/10 transition-colors">
            <td className="p-4 font-medium">{enr.studentName}</td>
            <td className="p-4 text-muted-foreground">{enr.phone}<br /><span className="text-xs">{enr.email}</span></td>
            <td className="p-4">
              <div className="space-y-0.5">
                <p className="font-medium text-sm">{enr.course?.title ?? "—"}</p>
                {enr.course?.ageGroup && (
                  <span className="text-xs text-muted-foreground">{AGE_GROUP_LABELS[enr.course.ageGroup as keyof typeof AGE_GROUP_LABELS]}</span>
                )}
              </div>
            </td>
            <td className="p-4">
              <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border ${enr.mode === 'ONLINE' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'}`}>
                {enr.mode}
              </span>
            </td>
            <td className="p-4 text-muted-foreground text-xs max-w-[180px] truncate">{enr.message || "—"}</td>
            <td className="p-4 text-muted-foreground">{enr.createdAt ? new Date(enr.createdAt).toLocaleDateString() : "—"}</td>
            <td className="p-4"><EnrollStatusBadge status={enr.status} /></td>
            <td className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" variant="outline" className="gap-1.5 border-green-500/50 text-green-500 hover:bg-green-500/10" onClick={() => openWhatsApp(enr.phone, enr.studentName, enr.course?.title ?? "course")}>
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </Button>
                {enr.status === "PENDING" && (
                  <>
                    <Button size="sm" variant="outline" className="gap-1.5 border-blue-500/50 text-blue-400 hover:bg-blue-500/10" disabled={updatingId === enr.id} onClick={() => updateStatus(enr.id, "CONFIRMED")}>
                      <CheckCircle className="h-3.5 w-3.5" /> Confirm
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 border-red-500/50 text-red-400 hover:bg-red-500/10" disabled={updatingId === enr.id} onClick={() => updateStatus(enr.id, "REJECTED")}>
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </>
                )}
                {enr.status === "CONFIRMED" && (
                  <Button size="sm" variant="outline" className="gap-1.5 border-green-500/50 text-green-400 hover:bg-green-500/10" disabled={updatingId === enr.id} onClick={() => updateStatus(enr.id, "COMPLETED")}>
                    <CheckCircle className="h-3.5 w-3.5" /> Mark Done
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

// ── Enrolled Students (Tournament) Tab ───────────────────────────────────────

function TournamentEnrollmentsTab() {
  const { data: registrations = [], isLoading, refetch } = useQuery<Registration[]>({
    queryKey: ["registrations"],
    queryFn: async () => {
      const res = await api.get("/tournaments/registrations");
      return res.data;
    },
  });

  if (isLoading) return <LoadingRow />;
  if (!registrations.length) return <EmptyState icon={Trophy} text="No tournament enrollments yet" sub="Students who register for tournaments will appear here." />;

  return (
    <TableShell count={registrations.length} label="Enrollment" onRefresh={() => refetch()}>
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="p-4">Student</th><th className="p-4">Contact</th>
          <th className="p-4">Tournament</th><th className="p-4">FIDE ID / UTR</th><th className="p-4">Registered On</th>
          <th className="p-4">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border text-sm">
        {registrations.map((reg: any) => (
          <tr key={reg.id} className="hover:bg-muted/10 transition-colors">
            <td className="p-4 font-medium">{reg.studentName}</td>
            <td className="p-4 text-muted-foreground">{reg.phone}<br /><span className="text-xs">{reg.email || "No email"}</span></td>
            <td className="p-4">
              <span className="inline-flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                {reg.tournament?.title ?? "—"}
              </span>
            </td>
            <td className="p-4 text-muted-foreground">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium">FIDE: {reg.fideId || "—"}</span>
                <span className="text-[10px] text-muted-foreground">UTR: {reg.transactionId || "—"}</span>
              </div>
            </td>
            <td className="p-4 text-muted-foreground">{reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "—"}</td>
            <td className="p-4"><RegStatusBadge status={reg.status} /></td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────

function LoadingRow() {
  return (
    <div className="flex items-center justify-center py-20 text-muted-foreground">
      <RefreshCw className="h-5 w-5 animate-spin mr-2" /> Loading…
    </div>
  );
}

function EmptyState({ icon: Icon, text, sub }: { icon: React.ElementType; text: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl text-center">
      <Icon className="h-12 w-12 text-muted-foreground/30 mb-3" />
      <p className="text-muted-foreground font-medium">{text}</p>
      <p className="text-sm text-muted-foreground/60 mt-1">{sub}</p>
    </div>
  );
}

function TableShell({
  children,
  count,
  label,
  onRefresh,
}: {
  children: React.ReactNode;
  count: number;
  label: string;
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {count} {label}{count !== 1 ? "s" : ""}
        </span>
        <Button variant="ghost" size="sm" onClick={onRefresh} className="gap-2 text-muted-foreground hover:text-foreground">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">{children}</table>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function RegistrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
        <p className="text-muted-foreground">Manage demo requests, course enrollments, and tournament registrations.</p>
      </div>

      <Tabs defaultValue="course-enrollments" className="w-full">
        <TabsList className="bg-muted/20 border border-border mb-6">
          <TabsTrigger value="demo" className="gap-2">
            <Users className="h-4 w-4" /> Free Demo Requests
          </TabsTrigger>
          <TabsTrigger value="course-enrollments" className="gap-2">
            <BookOpen className="h-4 w-4" /> Course Enrollments
          </TabsTrigger>
          <TabsTrigger value="tournament" className="gap-2">
            <Trophy className="h-4 w-4" /> Tournament
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demo">
          <DemoRequestsTab />
        </TabsContent>

        <TabsContent value="course-enrollments">
          <CourseEnrollmentsTab />
        </TabsContent>

        <TabsContent value="tournament">
          <TournamentEnrollmentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
