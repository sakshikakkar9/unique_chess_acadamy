import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  MapPin,
  Trophy,
  BookOpen,
  ShieldCheck,
  Zap,
  Info,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import StatusBadge from "@/components/shared/admin/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import AdminShell from "@/components/admin/AdminShell";

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: student, isLoading } = useQuery({
    queryKey: ["admin-student", id],
    queryFn: async () => (await api.get(`/students/${id}`)).data
  });

  if (isLoading) {
    return (
      <AdminShell title="Loading..." subtitle="Fetching student profile data">
        <div className="space-y-6">
          <Skeleton className="h-10 w-40" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-[500px] md:col-span-1 rounded-2xl" />
            <Skeleton className="h-[500px] md:col-span-2 rounded-2xl" />
          </div>
        </div>
      </AdminShell>
    );
  }

  if (!student) return (
    <AdminShell title="Error" subtitle="Resource not found">
      <div className="p-12 text-center bg-uca-bg-surface border border-uca-border rounded-2xl">
        <p className="text-uca-text-muted">Student not found.</p>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell
      title={student.fullName}
      subtitle={`Student ID: ${student.id.slice(0, 8).toUpperCase()}`}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/students")}
            className="rounded-lg hover:bg-uca-bg-elevated text-uca-text-muted gap-2 px-3"
          >
            <ArrowLeft className="size-4" /> Back to Students
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-uca-bg-surface border border-uca-border rounded-2xl overflow-hidden shadow-sm">
              <div className="h-24 bg-uca-navy relative border-b border-uca-border">
                <div className="absolute -bottom-10 left-6 size-20 rounded-2xl bg-uca-bg-surface p-1 shadow-xl border border-uca-border">
                  <div className="size-full rounded-xl bg-uca-accent-blue/10 flex items-center justify-center">
                    <User className="size-10 text-uca-accent-blue" />
                  </div>
                </div>
              </div>

              <div className="pt-14 p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-uca-text-primary leading-tight">{student.fullName}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={student.accountStatus} />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-uca-border">
                  <div className="flex items-start gap-4">
                    <div className="size-9 rounded-lg bg-uca-bg-elevated flex items-center justify-center shrink-0 border border-uca-border">
                      <Phone className="size-4 text-uca-accent-blue" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-0.5">Contact</p>
                      <p className="text-sm font-bold text-uca-text-primary">{student.phone}</p>
                      {student.email && <p className="text-[11px] font-medium text-uca-text-muted">{student.email}</p>}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-9 rounded-lg bg-uca-bg-elevated flex items-center justify-center shrink-0 border border-uca-border">
                      <Calendar className="size-4 text-uca-accent-blue" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-0.5">Birth Details</p>
                      <p className="text-sm font-bold text-uca-text-primary">{format(new Date(student.dob), "PPP")}</p>
                      <p className="text-[11px] font-medium text-uca-text-muted uppercase tracking-wider">{student.gender}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-9 rounded-lg bg-uca-bg-elevated flex items-center justify-center shrink-0 border border-uca-border">
                      <MapPin className="size-4 text-uca-accent-blue" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-0.5">Address</p>
                      <p className="text-sm font-bold text-uca-text-primary leading-relaxed">{student.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-uca-bg-surface border border-uca-border rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-uca-accent-blue" />
                <h3 className="text-xs font-black uppercase text-uca-text-primary tracking-widest">Chess Profile</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-uca-bg-elevated p-4 rounded-xl border border-uca-border">
                  <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1">FIDE ID</p>
                  <p className="text-lg font-black text-uca-text-primary">{student.fideId || 'NA'}</p>
                </div>
                <div className="bg-uca-bg-elevated p-4 rounded-xl border border-uca-border">
                  <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1">Rating</p>
                  <p className="text-lg font-black text-uca-accent-blue">{student.fideRating || '0'}</p>
                </div>
                <div className="col-span-2 bg-uca-bg-elevated p-4 rounded-xl border border-uca-border">
                  <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1">Club / Affiliation</p>
                  <p className="text-sm font-bold text-uca-text-primary">{student.clubAffiliation || 'Direct Entry'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-uca-bg-surface border border-uca-border rounded-2xl p-6 md:p-8 space-y-10 shadow-sm">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-10 rounded-lg bg-uca-navy flex items-center justify-center border border-uca-border">
                    <Zap className="size-5 text-uca-accent-blue" />
                  </div>
                  <h3 className="text-lg font-black text-uca-text-primary uppercase tracking-tight">Active Registrations</h3>
                </div>

                <div className="space-y-4">
                  {[...(student.registrations || []), ...(student.enrollments || [])].map((item: any, idx: number) => {
                    const isTournament = !!item.tournament;
                    return (
                      <div key={item.id || idx} className="group p-5 rounded-2xl border border-uca-border bg-uca-bg-elevated/20 hover:bg-uca-bg-elevated/40 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="size-10 rounded-lg bg-uca-bg-surface flex items-center justify-center border border-uca-border shadow-sm">
                              {isTournament ? <Trophy className="size-5 text-amber-500" /> : <BookOpen className="size-5 text-uca-accent-blue" />}
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-0.5">
                                {isTournament ? 'Tournament' : 'Course'}
                              </p>
                              <h4 className="text-sm font-bold text-uca-text-primary">{item.tournament?.title || item.course?.title}</h4>
                            </div>
                          </div>
                          <div className="text-right">
                            <StatusBadge status={item.status} />
                            <p className="text-[9px] font-bold text-uca-text-muted uppercase mt-1.5 tracking-widest">
                              {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy") : 'TBD'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {!student.registrations?.length && !student.enrollments?.length && (
                    <div className="p-12 text-center rounded-2xl border border-dashed border-uca-border bg-uca-bg-base/50">
                      <Info className="size-8 text-uca-bg-elevated mx-auto mb-3" />
                      <p className="text-[10px] font-black text-uca-text-muted uppercase tracking-widest">No program history found.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="pt-10 border-t border-uca-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-10 rounded-lg bg-uca-navy flex items-center justify-center border border-uca-border">
                    <Info className="size-5 text-uca-accent-blue" />
                  </div>
                  <h3 className="text-lg font-black text-uca-text-primary uppercase tracking-tight">Academic Profile</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-uca-bg-elevated/30 border border-uca-border">
                    <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Zap className="size-3.5 text-uca-accent-blue" /> Skill Level
                    </p>
                    <p className="text-sm font-bold text-uca-text-primary">{student.experienceLevel || 'Beginner'}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-uca-bg-elevated/30 border border-uca-border">
                    <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Clock className="size-3.5 text-uca-accent-blue" /> Preferred Batch
                    </p>
                    <p className="text-sm font-bold text-uca-text-primary">{student.preferredBatch || 'TBD'}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-uca-bg-elevated/30 border border-uca-border col-span-2">
                    <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-2">Discovery Source</p>
                    <p className="text-xs font-bold text-uca-text-primary uppercase tracking-wide">{student.discoverySource || 'Direct Search'}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
