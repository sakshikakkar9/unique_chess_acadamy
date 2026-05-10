import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
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

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: student, isLoading } = useQuery({
    queryKey: ["admin-student", id],
    queryFn: async () => (await api.get(`/students/${id}`)).data
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-40" />
        <div className="grid md:grid-cols-3 gap-4 md:p-8">
          <Skeleton className="h-[500px] md:col-span-1 rounded-3xl" />
          <Skeleton className="h-[500px] md:col-span-2 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!student) return <div className="p-4 md:p-8 text-center">Student not found</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/students")}
          className="rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Student Intelligence</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Profile</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:p-8">
        {/* Left Column: Personal Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="h-32 bg-slate-900 relative">
              <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-3xl bg-white p-1.5 shadow-xl border border-slate-100">
                <div className="h-full w-full rounded-[1.25rem] bg-sky-50 flex items-center justify-center">
                  <User className="h-10 w-10 text-sky-600" />
                </div>
              </div>
            </div>

            <div className="pt-16 p-4 md:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{student.fullName}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={student.accountStatus} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    ID: {student.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact</p>
                    <p className="text-sm font-bold text-slate-900">{student.phone}</p>
                    {student.email && <p className="text-[11px] font-medium text-slate-400">{student.email}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Birth Details</p>
                    <p className="text-sm font-bold text-slate-900">{format(new Date(student.dob), "PPP")}</p>
                    <p className="text-[11px] font-medium text-slate-400">{student.gender}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                    <p className="text-sm font-bold text-slate-900 leading-relaxed">{student.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sky-50 rounded-[2rem] border border-sky-100 p-4 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-sky-600" />
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-widest">Chess Profile</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-sky-600/60 uppercase tracking-widest mb-1">FIDE ID</p>
                <p className="text-lg font-black text-slate-900">{student.fideId || 'NA'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-sky-600/60 uppercase tracking-widest mb-1">Rating</p>
                <p className="text-lg font-black text-slate-900">{student.fideRating || '0'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black text-sky-600/60 uppercase tracking-widest mb-1">Club / Affiliation</p>
                <p className="text-sm font-bold text-slate-900">{student.clubAffiliation || 'Direct Entry'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Detailed Info */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-10">
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
                  <Zap className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Registrations</h3>
              </div>

              <div className="space-y-4">
                {student.registrations?.map((reg: any) => (
                  <div key={reg.id} className="group p-6 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-sky-100 hover:shadow-xl hover:shadow-sky-500/5 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                          <Trophy className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tournament Entry</p>
                          <h4 className="text-base font-bold text-slate-900">{reg.tournament?.title}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={reg.status} />
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{format(new Date(reg.createdAt), "MMM d, yyyy")}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {student.enrollments?.map((enr: any) => (
                  <div key={enr.id} className="group p-6 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-sky-100 hover:shadow-xl hover:shadow-sky-500/5 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                          <BookOpen className="h-6 w-6 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Course Enrollment</p>
                          <h4 className="text-base font-bold text-slate-900">{enr.course?.title}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={enr.status} />
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{format(new Date(enr.createdAt), "MMM d, yyyy")}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {(!student.registrations?.length && !student.enrollments?.length) && (
                  <div className="p-12 text-center rounded-[2rem] border border-dashed border-slate-200">
                    <Info className="h-8 w-8 text-slate-300 mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No program history found for this student.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="pt-10 border-t border-slate-50">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center border border-sky-100">
                  <Info className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Academic Preferences</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Zap className="h-3 w-3 text-sky-500" /> Skill Level
                  </p>
                  <p className="text-base font-bold text-slate-900">{student.experienceLevel || 'Beginner'}</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Clock className="h-3 w-3 text-sky-500" /> Preferred Batch
                  </p>
                  <p className="text-base font-bold text-slate-900">{student.preferredBatch || 'TBD'}</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 col-span-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Discovery Source</p>
                  <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">{student.discoverySource || 'Other / Not Specified'}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
