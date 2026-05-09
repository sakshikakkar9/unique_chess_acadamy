import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen, Trophy, Image as ImageIcon, Users,
  TrendingUp, Calendar, UserCheck, ArrowUpRight, GraduationCap, Mail,
  MessageSquare
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
import { cn } from "@/lib/utils";

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
      title: "Messages",
      value: messagesLoading ? "…" : messages.length.toString(),
      icon: MessageSquare,
      accent: "#6366f1",
      bg: "#eef2ff",
      numColor: "#4f46e5",
      status: messages.some(m => !m.isRead) ? "PENDING" : "LIVE",
      path: "/admin/messages"
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

  const getAvatarStyles = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    if ("ABCDE".includes(firstLetter)) return { bg: "#e0f2fe", color: "#0284c7" };
    if ("FGHIJ".includes(firstLetter)) return { bg: "#ede9fe", color: "#6d28d9" };
    if ("KLMNO".includes(firstLetter)) return { bg: "#d1fae5", color: "#065f46" };
    if ("PQRST".includes(firstLetter)) return { bg: "#fef3c7", color: "#b45309" };
    return { bg: "#fce7f3", color: "#be185d" };
  };

  const chessSymbols = ["♟", "♜", "♛"];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle="Monitoring growth at Unique Chess Academy."
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Recent Course Enrollments */}
        <div
          className="col-span-4 bg-white"
          style={{
            border: '1px solid #e0eeff',
            borderRadius: '14px',
            overflow: 'hidden'
          }}
        >
          <div
            className="flex justify-between items-center"
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#0c1a3a',
                textTransform: 'uppercase',
                letterSpacing: '.02em'
              }}
            >
              Recent Course Enrollments
            </h3>
            <Link
              to="/admin/registrations"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#0284c7'
              }}
            >
              View All →
            </Link>
          </div>
          <div>
            {enrollLoading ? (
              <div className="text-center py-10 text-slate-400 text-sm">Loading enrollments…</div>
            ) : enrollments.length > 0 ? (
              enrollments.slice(0, 5).map((enr) => {
                const avatarStyles = getAvatarStyles(enr.studentName);
                return (
                  <div
                    key={enr.id}
                    className="flex items-center gap-3 transition-all duration-120 cursor-pointer"
                    style={{
                      padding: '11px 18px',
                      borderBottom: '1px solid #f8fafc'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => navigate("/admin/registrations")}
                  >
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: avatarStyles.bg,
                        color: avatarStyles.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      {enr.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }} className="truncate">
                        {enr.studentName}
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                        enrolled in <span style={{ color: '#0284c7' }}>{enr.course?.title ?? "a course"}</span>
                      </p>
                    </div>
                    <StatusBadge status={enr.status} />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <GraduationCap className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No course enrollments yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Recent Messages */}
        <div className="col-span-3 flex flex-col gap-6">

          {/* Recent Messages */}
          <div
            className="bg-white flex-1"
            style={{
              border: '1px solid #e0eeff',
              borderRadius: '14px',
              overflow: 'hidden'
            }}
          >
            <div
              className="flex justify-between items-center"
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0c1a3a',
                  textTransform: 'uppercase',
                  letterSpacing: '.02em'
                }}
              >
              Recent Messages
              </h3>
              <Link
              to="/admin/messages"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#0284c7'
                }}
              >
                View All →
              </Link>
            </div>
            <div>
            {messagesLoading ? (
                <div className="text-center py-10 text-slate-400 text-sm">Loading…</div>
            ) : messages.length > 0 ? (
              messages.slice(0, 3).map((m: any) => {
                const avatarStyles = getAvatarStyles(m.name);
                  return (
                    <div
                    key={m.id}
                      className="flex items-center gap-3 transition-all duration-120 cursor-pointer"
                      style={{
                        padding: '11px 18px',
                        borderBottom: '1px solid #f8fafc'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => navigate("/admin/messages")}
                    >
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: avatarStyles.bg,
                          color: avatarStyles.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                      >
                      {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }} className="truncate">{m.name}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }} className="truncate">{m.message}</p>
                      </div>
                      <div className="text-right">
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(m.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                <Mail className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No messages yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
