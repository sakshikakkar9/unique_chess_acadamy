import React, { useState, useMemo } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen, Trophy, Image as ImageIcon, Users,
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
import AdminPageHeader from "@/components/shared/admin/AdminPageHeader";
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
      accent: "#0284c7",
      bg: "#e0f2fe",
      numColor: "#0284c7",
      status: "LIVE",
      path: "/admin/courses"
    },
    {
      title: "Enrollments",
      value: enrollLoading ? "…" : enrollments.length.toString(),
      icon: GraduationCap,
      accent: "#f59e0b",
      bg: "#fef3c7",
      numColor: "#d97706",
      status: pendingEnrollments.length > 0 ? "PENDING" : "LIVE",
      path: "/admin/registrations"
    },
    {
      title: "Registrations",
      value: tournamentLoading ? "…" : registrations.length.toString(),
      icon: Trophy,
      accent: "#8b5cf6",
      bg: "#ede9fe",
      numColor: "#7c3aed",
      status: registrations.some(r => r.status === 'PENDING') ? "PENDING" : "LIVE",
      path: "/admin/registrations"
    },
    {
      title: "Demo Leads",
      value: demosLoading ? "…" : demos.length.toString(),
      icon: Users,
      accent: "#10b981",
      bg: "#d1fae5",
      numColor: "#059669",
      status: "LIVE",
      path: "/admin/registrations"
    },
  ];


  const chessSymbols = ["♟", "♜", "♛"];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle="Monitoring growth at Unique Chess Academy."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white transition-all duration-150 group cursor-pointer"
            onClick={() => stat.path && navigate(stat.path)}
            style={{
              borderLeft: `4px solid ${stat.accent}`,
              borderRadius: '14px',
              border: '1px solid #e0eeff',
              borderLeftWidth: '4px',
              padding: '18px 18px 14px',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(2,132,199,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  backgroundColor: stat.bg,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <stat.icon style={{ width: '18px', height: '18px', color: stat.accent }} />
              </div>
              <StatusBadge status={stat.status} />
            </div>

            <div
              style={{
                fontSize: '32px',
                fontWeight: 800,
                letterSpacing: '-1.5px',
                color: stat.numColor,
                lineHeight: '1'
              }}
            >
              {stat.value}
            </div>

            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: '4px'
              }}
            >
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Enrollment Tabs */}
      <div
        className="bg-white overflow-hidden"
        style={{
          border: '1px solid #e0eeff',
          borderRadius: '14px'
        }}
      >
        <Tabs defaultValue="tournaments" className="w-full">
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-4 sm:px-6 border-b border-slate-100 bg-slate-50/30 gap-4"
          >
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
              <TabsList className="bg-slate-100/50 p-1 rounded-xl border border-slate-200 w-max sm:w-auto">
              <TabsTrigger
                value="tournaments"
                className="rounded-lg px-6 py-2 text-[11px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-sky-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-sky-500/30"
              >
                Tournament Enrollments
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="rounded-lg px-6 py-2 text-[11px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-sky-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-sky-500/30"
              >
                Course Enrollments
              </TabsTrigger>
              <TabsTrigger
                value="demos"
                className="rounded-lg px-6 py-2 text-[11px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-sky-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-sky-500/30"
              >
                Demo Enrollments
              </TabsTrigger>

              </TabsList>
            </div>

            <Link
              to="/admin/registrations"
              className="text-[10px] font-black uppercase tracking-widest text-sky-600 hover:text-sky-700 flex items-center gap-1 self-end sm:self-center"
            >
              View Full Register <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <TabsContent value="tournaments" className="m-0">
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-0 sm:hidden divide-y divide-slate-50">
              {tournamentLoading ? (
                <div className="py-20 text-center text-slate-400 text-sm">Loading registrations...</div>
              ) : paginatedTournaments.length > 0 ? (
                paginatedTournaments.map((reg: any) => {
                  const fullName = reg?.student?.fullName || "N/A";
                  const avatarStyles = getAvatarStyles(fullName);
                  return (
                    <div
                      key={reg?.id}
                      className="p-4 hover:bg-sky-50/30 transition-colors cursor-pointer group"
                      onClick={() => navigate("/admin/registrations")}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                            style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
                          >
                            {(fullName || "?").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">{fullName}</span>
                        </div>
                        <StatusBadge status={reg?.status} />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tournament</p>
                          <p className="text-xs font-medium text-slate-600">{reg?.tournament?.title || "N/A"}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {reg?.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "TBD"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center text-slate-400 text-sm">No tournament registrations found.</div>
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Selection</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                    <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tournamentLoading ? (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-400 text-sm">Loading registrations...</td></tr>
                  ) : paginatedTournaments.length > 0 ? (
                    paginatedTournaments.map((reg: any) => {
                      const fullName = reg?.student?.fullName || "N/A";
                      const avatarStyles = getAvatarStyles(fullName);
                      return (
                        <tr
                          key={reg?.id}
                          className="hover:bg-sky-50/30 transition-colors cursor-pointer group"
                          onClick={() => navigate("/admin/registrations")}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                                style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
                              >
                                {(fullName || "?").charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">{fullName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-slate-500">{reg?.tournament?.title || "N/A"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-slate-400">{reg?.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "TBD"}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <StatusBadge status={reg?.status} />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-400 text-sm">No tournament registrations found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={tournamentPage}
              totalPages={tournamentTotalPages}
              onPageChange={setTournamentPage}
            />
          </TabsContent>

          <TabsContent value="courses" className="m-0">
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-0 sm:hidden divide-y divide-slate-50">
              {enrollLoading ? (
                <div className="py-20 text-center text-slate-400 text-sm">Loading enrollments...</div>
              ) : paginatedCourses.length > 0 ? (
                paginatedCourses.map((enr: CourseEnrollment) => {
                  const avatarStyles = getAvatarStyles(enr?.studentName || "");
                  return (
                    <div
                      key={enr?.id}
                      className="p-4 hover:bg-sky-50/30 transition-colors cursor-pointer group"
                      onClick={() => navigate("/admin/registrations")}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                            style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
                          >
                            {(enr?.studentName || "?").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">{enr?.studentName || "N/A"}</span>
                        </div>
                        <StatusBadge status={enr.status} />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course</p>
                          <p className="text-xs font-medium text-slate-600">{enr?.course?.title || "N/A"}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {enr.createdAt ? new Date(enr.createdAt).toLocaleDateString() : "TBD"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center text-slate-400 text-sm">No course enrollments found.</div>
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Selection</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                    <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {enrollLoading ? (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-400 text-sm">Loading enrollments...</td></tr>
                  ) : paginatedCourses.length > 0 ? (
                    paginatedCourses.map((enr: CourseEnrollment) => {
                      const avatarStyles = getAvatarStyles(enr?.studentName || "");
                      return (
                        <tr
                          key={enr?.id}
                          className="hover:bg-sky-50/30 transition-colors cursor-pointer group"
                          onClick={() => navigate("/admin/registrations")}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                                style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
                              >
                                {(enr?.studentName || "?").charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">{enr?.studentName || "N/A"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-slate-500">{enr?.course?.title || "N/A"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-slate-400">{enr.createdAt ? new Date(enr.createdAt).toLocaleDateString() : "TBD"}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <StatusBadge status={enr.status} />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-400 text-sm">No course enrollments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={coursePage}
              totalPages={courseTotalPages}
              onPageChange={setCoursePage}
            />
          </TabsContent>

          <TabsContent value="demos" className="m-0">
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-0 sm:hidden divide-y divide-slate-50">
              {demosLoading ? (
                <div className="py-20 text-center text-slate-400 text-sm">Loading demos...</div>
              ) : paginatedDemos.length > 0 ? (
                paginatedDemos.map((demo: any) => {
                  const avatarStyles = getAvatarStyles(demo.studentName);
                  return (
                    <div
                      key={demo.id}
                      className="p-4 hover:bg-sky-50/30 transition-colors cursor-pointer group"
                      onClick={() => navigate("/admin/registrations")}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                            style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
                          >
                            {(demo.studentName || "?").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">{demo.studentName}</span>
                        </div>
                        <StatusBadge status={demo.status} />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scheduled At</p>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <Calendar className="h-3 w-3 text-sky-500" />
                            {new Date(demo.scheduledAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {demo.createdAt ? new Date(demo.createdAt).toLocaleDateString() : "TBD"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center text-slate-400 text-sm">No demo leads found.</div>
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Scheduled Date</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Submitted</th>
                    <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {demosLoading ? (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-400 text-sm">Loading demos...</td></tr>
                  ) : paginatedDemos.length > 0 ? (
                    paginatedDemos.map((demo: any) => {
                      const avatarStyles = getAvatarStyles(demo.studentName);
                      return (
                        <tr
                          key={demo.id}
                          className="hover:bg-sky-50/30 transition-colors cursor-pointer group"
                          onClick={() => navigate("/admin/registrations")}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                                style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
                              >
                                {(demo.studentName || "?").charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">{demo.studentName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-sky-500" />
                              <span className="text-xs font-medium text-slate-500">{new Date(demo.scheduledAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-slate-400">{demo.createdAt ? new Date(demo.createdAt).toLocaleDateString() : "TBD"}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <StatusBadge status={demo.status} />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-400 text-sm">No demo leads found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={demoPage}
              totalPages={demoTotalPages}
              onPageChange={setDemoPage}
            />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
};

export default AdminDashboard;
