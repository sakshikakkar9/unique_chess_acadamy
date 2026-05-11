import React, { useState, useMemo } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen, Trophy, Image as PhotoIcon, Users,
  TrendingUp, Calendar, UserCheck, ArrowUpRight, GraduationCap
} from "lucide-react";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useAdminGallery } from "@/features/gallery/hooks/useAdminGallery";
import { useDemoAdmin } from "../../features/demo/hooks/useDemoRegistration";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { CourseEnrollment } from "@/types";
import { AGE_GROUP_LABELS } from "@/types";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/shared/admin/StatusBadge";
import { cn, getAvatarStyles } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "@/components/shared/admin/Pagination";

const ITEMS_PER_PAGE = 6;

const AdminDashboard: React.FC = () => {
  const navigate          = useNavigate();
  const { courses }       = useAdminCourses();
  const { tournaments }   = useAdminTournaments();
  const { images }        = useAdminGallery();
  const { demos, isLoading: demosLoading } = useDemoAdmin();

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

  const paginatedTournaments = useMemo(() => {
    const start = (tournamentPage - 1) * ITEMS_PER_PAGE;
    return registrations.slice(start, start + ITEMS_PER_PAGE);
  }, [registrations, tournamentPage]);

  const paginatedCourses = useMemo(() => {
    const start = (coursePage - 1) * ITEMS_PER_PAGE;
    return enrollments.slice(start, start + ITEMS_PER_PAGE);
  }, [enrollments, coursePage]);

  const paginatedDemos = useMemo(() => {
    const start = (demoPage - 1) * ITEMS_PER_PAGE;
    return demos.slice(start, start + ITEMS_PER_PAGE);
  }, [demos, demoPage]);

  const tournamentTotalPages = Math.ceil(registrations.length / ITEMS_PER_PAGE);
  const courseTotalPages = Math.ceil(enrollments.length / ITEMS_PER_PAGE);
  const demoTotalPages = Math.ceil(demos.length / ITEMS_PER_PAGE);

  const pendingEnrollments = enrollments.filter((e) => e.status === "PENDING");

  const stats = [
    {
      title: "Total Courses",
      value: courses.length.toString(),
      icon: BookOpen,
      accent: "text-uca-accent-blue",
      bg: "bg-uca-accent-blue/10",
      numColor: "text-uca-accent-blue",
      status: "LIVE",
      path: "/admin/courses"
    },
    {
      title: "Enrollments",
      value: enrollLoading ? "…" : enrollments.length.toString(),
      icon: GraduationCap,
      accent: "text-amber-500",
      bg: "bg-amber-500/10",
      numColor: "text-amber-500",
      status: pendingEnrollments.length > 0 ? "PENDING" : "LIVE",
      path: "/admin/registrations"
    },
    {
      title: "Registrations",
      value: tournamentLoading ? "…" : registrations.length.toString(),
      icon: Trophy,
      accent: "text-purple-500",
      bg: "bg-purple-500/10",
      numColor: "text-purple-500",
      status: registrations.some(r => r.status === 'PENDING') ? "PENDING" : "LIVE",
      path: "/admin/registrations"
    },
    {
      title: "Demo Leads",
      value: demosLoading ? "…" : demos.length.toString(),
      icon: Users,
      accent: "text-emerald-500",
      bg: "bg-emerald-500/10",
      numColor: "text-emerald-500",
      status: "LIVE",
      path: "/admin/registrations"
    },
  ];

  return (
    <AdminShell
      title="Dashboard Overview"
      subtitle="Monitoring growth at Unique Chess Academy."
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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

              <div className="text-sm text-uca-text-muted">
                {stat.title}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Enrollment Tabs */}
        <div className="bg-uca-bg-surface border border-uca-border rounded-xl overflow-hidden shadow-sm">
          <Tabs defaultValue="tournaments" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-4 sm:px-6 border-b border-uca-border bg-uca-bg-elevated/30 gap-4">
              <TabsList className="bg-uca-bg-base p-1 rounded-lg border border-uca-border h-10">
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
                <TabsTrigger
                  value="demos"
                  className="rounded-md px-4 text-[10px] font-black uppercase tracking-widest h-8 data-[state=active]:bg-uca-navy data-[state=active]:text-white"
                >
                  Demos
                </TabsTrigger>
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
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-uca-bg-elevated/50 border-b border-uca-border">
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Student</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Selection</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted hidden sm:table-cell text-right">Date</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-uca-border">
                        {loading ? (
                          <tr><td colSpan={4} className="py-12 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">Loading...</td></tr>
                        ) : data.length > 0 ? (
                          data.map((item: any) => {
                            const name = item?.student?.fullName || item?.studentName || "N/A";
                            const avatarStyles = getAvatarStyles(name);
                            return (
                              <tr
                                key={item.id}
                                className="hover:bg-uca-bg-elevated/30 transition-colors cursor-pointer"
                                onClick={() => navigate("/admin/registrations")}
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
                                  <span className="text-xs text-uca-text-muted font-medium">
                                    {item.tournament?.title || item.course?.title || (tab === 'demos' ? 'Initial Demo' : 'N/A')}
                                  </span>
                                </td>
                                <td className="px-6 py-3 text-right hidden sm:table-cell">
                                  <span className="text-[10px] text-uca-text-muted font-bold">
                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString() : 'TBD')}
                                  </span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <StatusBadge status={item.status} />
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr><td colSpan={4} className="py-12 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">No records found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
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
  );
};

export default AdminDashboard;
