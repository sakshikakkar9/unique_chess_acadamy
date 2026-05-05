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
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

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
               <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 uppercase tracking-widest text-[9px] font-black">Tournament Roster</Badge>
               <span className="text-slate-300">/</span>
               <span className="text-xs font-medium text-slate-500 italic">{tournament?.title}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Registered Students</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
            className="h-12 rounded-xl font-bold gap-2 bg-slate-900 hover:bg-blue-600 transition-all"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4">Reference ID</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Student Name</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Category & Rating</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Contact</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Enrolled On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isRegLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell>
                </TableRow>
              ))
            ) : filteredRegistrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 py-12">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center">
                      <FileText className="h-10 w-10 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-black text-slate-900">No Signups Yet</p>
                      <p className="text-sm text-slate-500">Wait for students to discover this arena.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRegistrations.map((reg) => (
                <TableRow key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-blue-600">{reg.referenceId}</TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">{reg.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{reg.gender} • {format(new Date(reg.dob), "dd MMM yyyy")}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                       <Badge variant="secondary" className="text-[9px] font-black uppercase bg-slate-100 text-slate-600 border-none">{reg.category || 'Open'}</Badge>
                       <div className="text-[10px] font-bold text-slate-500">FIDE: {reg.fideId} ({reg.fideRating})</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-slate-700">{reg.phone}</div>
                    <div className="text-xs text-slate-400">{reg.email || 'No email provided'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tight ${
                      reg.status === 'CONFIRMED' ? 'bg-emerald-500 text-white' :
                      reg.status === 'PENDING' ? 'bg-amber-500 text-white' :
                      'bg-slate-500 text-white'
                    }`}>
                      {reg.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(reg.createdAt), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TournamentStudents;
