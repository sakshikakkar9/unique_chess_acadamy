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
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Course Enrollments",
      value: enrollLoading ? "…" : enrollments.length.toString(),
      sub: pendingEnrollments.length > 0 ? `${pendingEnrollments.length} pending` : undefined,
      icon: GraduationCap,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Tournaments",
      value: tournaments.length.toString(),
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "New Demo Leads",
      value: demosLoading ? "…" : demos.length.toString(),
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitoring growth at Unique Chess Academy.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border bg-card/50 backdrop-blur shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`${stat.bg} p-2 rounded-md`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {stat.sub ? (
                  <span className="text-amber-500 font-medium">{stat.sub}</span>
                ) : (
                  <>
                    <span className="text-green-500 font-medium flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" /> Live
                    </span>
                    Syncing with Database
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Recent Course Enrollments */}
        <Card className="col-span-4 border-border bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Course Enrollments</CardTitle>
            <Link
              to="/admin/registrations"
              className="text-xs text-gold hover:underline flex items-center gap-1"
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
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors flex-shrink-0">
                      <GraduationCap className="h-5 w-5 text-emerald-500" />
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
                    <EnrollBadge status={enr.status} />
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
          <Card className="border-border bg-card/50 flex-1">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tournaments.length > 0 ? (
                  tournaments.slice(0, 3).map((t) => (
                    <div key={t.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{t.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                          <Calendar className="h-3 w-3 text-gold" />
                          {new Date(t.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </div>
                      </div>
                      <TournamentBadge status={t.status} />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No events scheduled.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Demo Leads */}
          <Card className="border-border bg-card/50 flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Demo Leads</CardTitle>
              <Link
                to="/admin/registrations"
                className="text-xs text-gold hover:underline flex items-center gap-1"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demosLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading…</div>
                ) : demos.length > 0 ? (
                  demos.slice(0, 3).map((demo: any) => (
                    <div key={demo.id} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 flex-shrink-0">
                        <UserCheck className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{demo.studentName}</p>
                        <p className="text-xs text-muted-foreground">{demo.phone}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(demo.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No demo requests yet.</p>
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

// ── Small helper badges ───────────────────────────────────────────────────────

const ENROLL_COLORS: Record<string, string> = {
  PENDING:   "bg-amber-500/10 text-amber-500 border-amber-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
  REJECTED:  "bg-red-500/10 text-red-400 border-red-500/20",
};

function EnrollBadge({ status }: { status: string }) {
  const cls = ENROLL_COLORS[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${cls} flex-shrink-0`}>
      {status}
    </span>
  );
}

function TournamentBadge({ status }: { status: string }) {
  const isOngoing = status === "ONGOING";
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
      isOngoing
        ? "bg-green-500/10 text-green-500 border-green-500/20"
        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
    }`}>
      {status}
    </span>
  );
}

export default AdminDashboard;
