import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen, Trophy, Image as ImageIcon, Users,
  TrendingUp, Calendar, UserCheck, ArrowUpRight, GraduationCap,
} from "lucide-react";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useAdminGallery } from "@/features/gallery/hooks/useAdminGallery";
import { useDemoAdmin } from "../../features/demo/hooks/useDemoRegistration";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { CourseEnrollment } from "@/types";
import { AGE_GROUP_LABELS } from "@/types";
import AdminPageHeader from "@/components/shared/admin/AdminPageHeader";
import StatusBadge from "@/components/shared/admin/StatusBadge";

const AdminDashboard: React.FC = () => {
  const { courses }       = useAdminCourses();
  const { tournaments }   = useAdminTournaments();
  const { images }        = useAdminGallery();
  const { demos, isLoading: demosLoading } = useDemoAdmin();

  const { data: enrollments = [], isLoading: enrollLoading } = useQuery<CourseEnrollment[]>({
    queryKey: ["course-enrollments"],
    queryFn: async () => {
      const res = await api.get("/courses/enrollments");
      return res.data;
    },
  });

  const pendingEnrollments = enrollments.filter((e) => e.status === "PENDING");

  const stats = [
    {
      title: "Total Courses",
      value: courses.length.toString(),
      icon: BookOpen,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Course Enrollments",
      value: enrollLoading ? "…" : enrollments.length.toString(),
      sub: pendingEnrollments.length > 0 ? `${pendingEnrollments.length} pending` : undefined,
      icon: GraduationCap,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Tournaments",
      value: tournaments.length.toString(),
      icon: Trophy,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "New Demo Leads",
      value: demosLoading ? "…" : demos.length.toString(),
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle="Monitoring growth at Unique Chess Academy."
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-slate-200 bg-white shadow-sm overflow-hidden relative group border-l-4 border-l-sky-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              <div className="mt-2">
                {stat.sub ? (
                  <StatusBadge status="PENDING" className="bg-amber-50 text-amber-600 border-amber-200/50" />
                ) : (
                  <div className="flex items-center gap-2">
                    <StatusBadge status="LIVE" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Syncing</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Recent Course Enrollments */}
        <Card className="col-span-4 border-slate-200 bg-white shadow-sm rounded-[12px]">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50">
            <CardTitle className="text-[18px] font-semibold text-slate-900">Recent Course Enrollments</CardTitle>
            <Link
              to="/admin/registrations"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrollLoading ? (
                <div className="text-center py-4 text-muted-foreground">Loading enrollments…</div>
              ) : enrollments.length > 0 ? (
                enrollments.slice(0, 5).map((enr) => (
                  <div key={enr.id} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-colors flex-shrink-0">
                      <GraduationCap className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {enr.studentName}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          enrolled in{" "}
                          <span className="text-foreground">{enr.course?.title ?? "a course"}</span>
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {enr.course?.ageGroup ? AGE_GROUP_LABELS[enr.course.ageGroup] + " · " : ""}
                        {enr.createdAt ? new Date(enr.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                    <StatusBadge status={enr.status} />
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <GraduationCap className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No course enrollments yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right column: Upcoming Events + Demo Leads */}
        <div className="col-span-3 flex flex-col gap-4">

          {/* Upcoming Tournaments */}
          <Card className="border-slate-200 bg-white shadow-sm flex-1 rounded-[12px]">
            <CardHeader className="pb-4 border-b border-slate-50">
              <CardTitle className="text-[18px] font-semibold text-slate-900">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {tournaments.length > 0 ? (
                  tournaments.slice(0, 3).map((t) => (
                    <div key={t.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-800">{t.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <Calendar className="h-3 w-3 text-sky-500" />
                          {t.date && !isNaN(new Date(t.date).getTime())
                            ? new Date(t.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                            : <span className="italic font-normal lowercase text-slate-300">Date TBD</span>
                          }
                        </div>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No events scheduled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Demo Leads */}
          <Card className="border-slate-200 bg-white shadow-sm flex-1 rounded-[12px]">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50">
              <CardTitle className="text-[18px] font-semibold text-slate-900">Recent Demo Leads</CardTitle>
              <Link
                to="/admin/registrations"
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {demosLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading…</div>
                ) : demos.length > 0 ? (
                  demos.slice(0, 3).map((demo: any) => (
                    <div key={demo.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center border border-sky-100 flex-shrink-0">
                          <UserCheck className="h-4 w-4 text-sky-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{demo.studentName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-600">{demo.phone}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{new Date(demo.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No demo requests yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
