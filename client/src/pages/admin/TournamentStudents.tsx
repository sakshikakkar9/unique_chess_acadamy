import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Tournament, Registration } from "@/types";
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

const TournamentStudents: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: tournament, isLoading: isTournamentLoading } = useQuery<Tournament>({
    queryKey: ["tournament", id],
    queryFn: async () => {
      const res = await api.get(`/tournaments/${id}`);
      return res.data;
    },
  });

  const { data: registrations = [], isLoading: isRegLoading } = useQuery<Registration[]>({
    queryKey: ["tournament-registrations", id],
    queryFn: async () => {
      const res = await api.get(`/tournaments/admin/registrations?tournamentId=${id}`);
      return res.data;
    },
  });

  const filteredRegistrations = registrations.filter((reg) =>
    reg.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.phone.includes(searchQuery)
  );

  const handleExport = () => {
    // Basic CSV export logic
    const headers = ["Reference ID", "Student Name", "Category", "FIDE ID", "Rating", "Phone", "Status"];
    const rows = filteredRegistrations.map(r => [
      r.referenceId,
      r.studentName,
      r.category || "N/A",
      r.fideId || "NA",
      r.fideRating,
      r.phone,
      r.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tournament?.title || 'tournament'}_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (isTournamentLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 md:p-8">
      {/* Contextual Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/tournaments")}
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
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  border: '1px solid #fde68a'
                }}
               >
                Tournament Roster
               </span>
               <span className="text-slate-300">/</span>
               <span className="text-xs font-medium text-slate-500 italic">{tournament?.title}</span>
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
              <th className="p-4 px-6 text-left">Reference ID</th>
              <th className="p-4 px-6 text-left">Student Name</th>
              <th className="p-4 px-6 text-left">Category & Rating</th>
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
            ) : filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 py-12">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center">
                      <FileText className="h-10 w-10 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-black text-slate-900">No Signups Yet</p>
                      <p className="text-sm text-slate-500">Wait for students to discover this arena.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((reg) => {
                const avatarStyles = getAvatarStyles(reg.studentName);
                return (
                  <tr
                    key={reg.id}
                    className="group transition-all duration-120 cursor-pointer"
                    style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="p-4 px-6 font-mono text-[10px] font-bold text-[#0284c7]">{reg.referenceId}</td>
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
                          {(reg.studentName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }} className="truncate">{reg.studentName}</p>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{reg.gender} • {format(new Date(reg.dob), "dd MMM yyyy")}</span>
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
                          {reg.category || 'Open'}
                         </span>
                         <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }}>FIDE: {reg.fideId} ({reg.fideRating})</div>
                      </div>
                    </td>
                    <td className="p-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                          <Phone className="h-3 w-3" /> {reg.phone}
                        </div>
                        <div className="flex items-center gap-2" style={{ fontSize: '10px', color: '#94a3b8' }}>
                          <Mail className="h-3 w-3" /> {reg.email || 'No email provided'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6 text-center">
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="p-4 px-6">
                      <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(reg.createdAt), "MMM dd, yyyy")}
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

export default TournamentStudents;
