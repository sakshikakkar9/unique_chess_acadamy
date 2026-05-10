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
import { getAvatarStyles } from "@/lib/utils";

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
    const id = (reg?.id || "").toLowerCase();
    const phone = reg?.student?.phone || "";
    const search = searchQuery.toLowerCase();
    return name.includes(search) || id.includes(search) || phone.includes(search);
  });

  const handleExport = () => {
    const headers = ["Reference ID", "Student Name", "Category", "Skill Level", "Phone", "Status"];
    const rows = filteredEnrollments.map(r => [
      r?.id || "N/A",
      r?.student?.fullName || "N/A",
      r?.category || "N/A",
      r?.student?.experienceLevel || "N/A",
      r?.student?.phone || "N/A",
      r?.status || "PENDING"
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers, ...rows].map(e => e.join(",")).join("\n");

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
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 md:p-4 md:p-8">
      {/* Contextual Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/courses")}
            className="rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  border: '1px solid #bfdbfe'
                }}
               >
                Course Roster
               </span>
               <span className="text-slate-300">/</span>
               <span className="text-xs font-medium text-slate-500 italic">{course?.title}</span>
            </div>
            <h1
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#0c1a3a',
                letterSpacing: '-0.6px'
              }}
            >
              Registered Students
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
            <Input
              placeholder="Search by name, ID or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-12 rounded-xl border-slate-200"
            />
          </div>
          <Button
            variant="outline"
            className="h-12 rounded-xl font-bold gap-2 border-slate-200"
            onClick={() => {/* Filter logic */}}
          >
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button
            className="h-12 rounded-xl font-bold gap-2 bg-[#0c1a3a] hover:bg-[#0284c7] transition-all"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div
        className="bg-white overflow-hidden"
        style={{
          border: '1px solid #e0eeff',
          borderRadius: '14px'
        }}
      >
        <table className="w-full border-collapse">
          <thead style={{ backgroundColor: '#f0f6ff', borderBottom: '2px solid #bae6fd' }}>
            <tr className="text-[10px] font-black uppercase text-[#64748b] tracking-[0.08em]">
              <th className="p-4 px-6 text-left">ID</th>
              <th className="p-4 px-6 text-left">Student Name</th>
              <th className="p-4 px-6 text-left">Category & Level</th>
              <th className="p-4 px-6 text-left">Contact</th>
              <th className="p-4 px-6 text-center">Status</th>
              <th className="p-4 px-6 text-left">Enrolled On</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isRegLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td colSpan={6} className="p-4 px-6"><Skeleton className="h-12 w-full" /></td>
                </tr>
              ))
            ) : filteredEnrollments.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 py-12">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center">
                      <FileText className="h-10 w-10 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-black text-slate-900">No Signups Yet</p>
                      <p className="text-sm text-slate-500">Wait for students to discover this course.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEnrollments.map((reg) => {
                const fullName = reg?.student?.fullName || "N/A";
                const avatarStyles = getAvatarStyles(fullName);
                return (
                  <tr
                    key={reg?.id}
                    className="group transition-all duration-120 cursor-pointer"
                    style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="p-4 px-6 font-mono text-[10px] font-bold text-[#0284c7]">{(reg?.id || "").substring(0, 8)}...</td>
                    <td className="p-4 px-6">
                      <div className="flex items-center gap-3">
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
                          {(fullName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }} className="truncate">{fullName}</p>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{reg?.student?.gender || "N/A"} • {reg?.student?.dob ? format(new Date(reg.student.dob), "dd MMM yyyy") : 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6">
                      <div className="space-y-1">
                         <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '20px',
                            textTransform: 'uppercase',
                            backgroundColor: '#f1f5f9',
                            color: '#64748b'
                          }}
                         >
                          {reg?.category || 'General'}
                         </span>
                         <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }}>Level: {reg?.student?.experienceLevel || "N/A"}</div>
                      </div>
                    </td>
                    <td className="p-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                          <Phone className="h-3 w-3" /> {reg?.student?.phone || "N/A"}
                        </div>
                        <div className="flex items-center gap-2" style={{ fontSize: '10px', color: '#94a3b8' }}>
                          <Mail className="h-3 w-3" /> {reg?.student?.email || 'No email provided'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6 text-center">
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="p-4 px-6">
                      <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                        <Calendar className="h-3.5 w-3.5" />
                        {reg.createdAt ? format(new Date(reg.createdAt), "MMM dd, yyyy") : 'N/A'}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseStudents;
