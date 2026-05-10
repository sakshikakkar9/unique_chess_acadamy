import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Course, CourseEnrollment } from "@/types";
import {
  ArrowLeft,
  Users,
  Search,
  Download,
  Calendar,
  Filter,
  FileText,
  Phone,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import StatusBadge from "@/components/shared/admin/StatusBadge";
import { getAvatarStyles, cn } from "@/lib/utils";
import AdminShell from "@/components/admin/AdminShell";

const CourseStudents: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: course, isLoading: isCourseLoading } = useQuery<Course>({
    queryKey: ["course", id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}`);
      return res.data;
    },
  });

  const { data: enrollments = [], isLoading: isRegLoading } = useQuery<CourseEnrollment[]>({
    queryKey: ["course-enrollments", id],
    queryFn: async () => {
      const res = await api.get(`/courses/enrollments?courseId=${id}`);
      return res.data;
    },
  });

  const filteredEnrollments = enrollments.filter((reg) => {
    const name = (reg?.student?.fullName || "").toLowerCase();
    const regId = (reg?.id || "").toLowerCase();
    const phone = reg?.student?.phone || "";
    const search = searchQuery.toLowerCase();
    return name.includes(search) || regId.includes(search) || phone.includes(search);
  });

  const handleExport = () => {
    const headers = ["ID", "Student Name", "Category", "Skill Level", "Phone", "Status"];
    const rows = filteredEnrollments.map(r => [
      r?.id || "N/A",
      r?.student?.fullName || "N/A",
      r?.category || "N/A",
      r?.student?.experienceLevel || "N/A",
      r?.student?.phone || "N/A",
      r?.status || "PENDING"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${course?.title || 'course'}_enrollments.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isCourseLoading) {
    return (
      <AdminShell title="Loading..." subtitle="Fetching enrollment roster">
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Course Roster"
      subtitle={course?.title}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/courses/${id}/portal`)}
            className="rounded-lg hover:bg-uca-bg-elevated text-uca-text-muted gap-2 px-3"
          >
            <ArrowLeft className="size-4" /> Back to Portal
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-uca-bg-surface border border-uca-border p-4 rounded-xl shadow-sm">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-uca-text-muted" />
            <Input
              placeholder="Search enrollment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-uca-bg-base border-uca-border text-sm focus:ring-uca-accent-blue rounded-lg"
            />
          </div>
          <Button
            className="h-11 rounded-lg font-bold gap-2 bg-uca-navy hover:bg-uca-navy-hover text-white text-xs uppercase tracking-widest w-full md:w-auto px-6"
            onClick={handleExport}
          >
            <Download className="size-4" /> Export CSV
          </Button>
        </div>

        <div className="bg-uca-bg-surface border border-uca-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-uca-bg-elevated/50 border-b border-uca-border">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Student</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Skill & Level</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted text-right">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-uca-border">
                {isRegLoading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">Loading entries...</td></tr>
                ) : filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <FileText className="size-10 text-uca-bg-elevated mx-auto mb-3" />
                      <p className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">No Enrollments Found</p>
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((reg) => {
                    const name = reg?.student?.fullName || "N/A";
                    const avatarStyles = getAvatarStyles(name);
                    return (
                      <tr key={reg.id} className="hover:bg-uca-bg-elevated/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-[10px] font-bold text-uca-accent-blue">{(reg.id || "").substring(0, 8)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="size-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                              style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
                            >
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-uca-text-primary truncate">{name}</p>
                              <span className="text-[10px] text-uca-text-muted">
                                {reg.student?.gender || 'N/A'} • {reg.student?.dob ? format(new Date(reg.student.dob), "dd MMM yyyy") : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-uca-text-primary uppercase tracking-tight">{reg.category || 'General'}</span>
                            <span className="text-[10px] text-uca-text-muted">Level: {reg.student?.experienceLevel || 'Beginner'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-uca-text-primary font-medium">
                              <Phone className="size-3 text-uca-accent-blue" /> {reg.student?.phone || 'N/A'}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-uca-text-muted">
                              <Mail className="size-3" /> {reg.student?.email || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={reg.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-[10px] text-uca-text-muted font-bold">
                            {reg.createdAt ? format(new Date(reg.createdAt), "MMM d, yyyy") : 'TBD'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
};

export default CourseStudents;
