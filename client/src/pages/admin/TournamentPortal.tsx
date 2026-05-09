import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Tournament } from "@/types";
import { ArrowLeft, LayoutDashboard, CreditCard, Users, TrendingUp, Wallet, Award, Percent, Search, Filter, Download, FileText, Phone, Mail, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import TournamentPreview from "@/features/tournaments/components/admin/TournamentPreview";
import { Registration } from "@/types";
import { format } from "date-fns";
import StatusBadge from "@/components/shared/admin/StatusBadge";

const ITEMS_PER_PAGE = 8;

const TournamentPortal: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

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

  const totalCollections = (registrations?.length || 0) * (tournament?.entryFee || 0);

  if (isTournamentLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!tournament) return <div className="p-8 text-center font-bold text-rose-500">Tournament not found</div>;

  return (
    <div className="space-y-6 p-2 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/tournaments")}
          className="rounded-full hover:bg-slate-100 h-12 w-12"
        >
          <ArrowLeft className="h-6 w-6 text-slate-600" />
        </Button>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100">Tournament Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-400">ID: {id?.substring(0, 8)}</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em' }}>
            {tournament.title}
          </h1>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-white border border-slate-200 p-1.5 h-16 rounded-[20px] mb-8 shadow-sm inline-flex">
          <TabsTrigger
            value="summary"
            className="rounded-[14px] px-8 h-full font-black text-[11px] uppercase tracking-[0.1em] data-[state=active]:bg-[#0284c7] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-sky-500/20 transition-all duration-300"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" /> Summary
          </TabsTrigger>
          <TabsTrigger
            value="finance"
            className="rounded-[14px] px-8 h-full font-black text-[11px] uppercase tracking-[0.1em] data-[state=active]:bg-[#0284c7] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-sky-500/20 transition-all duration-300"
          >
            <CreditCard className="h-4 w-4 mr-2" /> Finance
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="rounded-[14px] px-8 h-full font-black text-[11px] uppercase tracking-[0.1em] data-[state=active]:bg-[#0284c7] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-sky-500/20 transition-all duration-300"
          >
            <Users className="h-4 w-4 mr-2" /> Students
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-0 focus-visible:ring-0">
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-12 overflow-hidden">
             <TournamentPreview tournament={tournament} />
           </div>
        </TabsContent>

        <TabsContent value="finance" className="mt-0 focus-visible:ring-0 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Collections</p>
                  <p className="text-3xl font-black text-slate-900">₹{totalCollections.toLocaleString()}</p>
                </div>
                <div className="pt-4 border-t border-slate-50">
                   <p className="text-xs font-bold text-slate-500">Based on {registrations.length} registrations</p>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-sky-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entry Fee</p>
                  <p className="text-3xl font-black text-slate-900">₹{tournament?.entryFee?.toLocaleString() || "0"}</p>
                </div>
                <div className="pt-4 border-t border-slate-50">
                   <p className="text-xs font-bold text-slate-500">Standard rate per player</p>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prize Pool</p>
                  <p className="text-3xl font-black text-slate-900">{tournament.totalPrizePool || "₹0"}</p>
                </div>
                <div className="pt-4 border-t border-slate-50">
                   <p className="text-xs font-bold text-slate-500">Total tournament rewards</p>
                </div>
             </div>
           </div>

           <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Percent className="h-5 w-5 text-indigo-600" />
                 </div>
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Discount & Offer Details</h3>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 min-h-[100px]">
                 <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                    {tournament.discountDetails || "No special discount details provided for this tournament."}
                 </p>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="students" className="mt-0 focus-visible:ring-0 space-y-6">
           <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                <Input
                  placeholder="Search by name, ID or phone..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-9 h-12 rounded-xl border-slate-200"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button
                  variant="outline"
                  className="h-12 rounded-xl font-bold gap-2 border-slate-200 flex-1 md:flex-none"
                >
                  <Filter className="h-4 w-4" /> Filters
                </Button>
                <Button
                  className="h-12 rounded-xl font-bold gap-2 bg-[#0c1a3a] hover:bg-[#0284c7] transition-all flex-1 md:flex-none"
                  onClick={() => {
                    const headers = ["Reference ID", "Student Name", "Category", "FIDE ID", "Rating", "Phone", "Status"];
                    const rows = registrations?.map(r => [
                      r?.referenceId,
                      r?.studentName,
                        r?.category || "N/A",
                        r?.fideId || "NA",
                        r?.fideRating,
                        r?.phone,
                        r?.status
                    ]);
                    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `${tournament?.title || 'tournament'}_registrations.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="h-4 w-4" /> Export CSV
                </Button>
              </div>
           </div>

           <div className="bg-white overflow-hidden border border-slate-100 rounded-[24px] shadow-sm">
              <table className="w-full border-collapse">
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
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
                  ) : (registrations?.length || 0) === 0 ? (
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
                    (() => {
                      const filtered = (registrations || []).filter((reg) => {
                        // Use optional chaining and default to empty strings to prevent crashes
                        const name = reg?.studentName?.toLowerCase() || "";
                        const refId = reg?.referenceId?.toLowerCase() || "";
                        const phone = reg?.phone || "";
                        const search = searchQuery.toLowerCase();
                      
                        return name.includes(search) || refId.includes(search) || phone.includes(search);
                      });
                      const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                      const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

                      return (
                        <>
                          {paginated.map((reg) => {
                            const firstLetter = reg?.studentName?.charAt(0).toUpperCase() || '?';
                            let avatarStyles = { bg: "#fce7f3", color: "#be185d" };
                            if ("ABCDE".includes(firstLetter)) avatarStyles = { bg: "#e0f2fe", color: "#0284c7" };
                            else if ("FGHIJ".includes(firstLetter)) avatarStyles = { bg: "#ede9fe", color: "#6d28d9" };
                            else if ("KLMNO".includes(firstLetter)) avatarStyles = { bg: "#d1fae5", color: "#065f46" };
                            else if ("PQRST".includes(firstLetter)) avatarStyles = { bg: "#fef3c7", color: "#b45309" };

                            return (
                              <tr
                                key={reg?.id}
                                className="group transition-all duration-120 cursor-pointer hover:bg-sky-50/50"
                                style={{ borderBottom: '1px solid #f8fafc' }}
                              >
                                <td className="p-4 px-6 font-mono text-[10px] font-bold text-[#0284c7]">{reg?.referenceId}</td>
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
                                      {firstLetter}
                                    </div>
                                    <div className="min-w-0">
                                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }} className="truncate">{reg?.studentName}</p>
                                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{reg?.gender} • {reg?.dob ? format(new Date(reg.dob), "dd MMM yyyy") : 'Date TBD'}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 px-6">
                                  <div className="space-y-1">
                                     <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                                      {reg?.category || 'Open'}
                                     </span>
                                     <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }}>FIDE: {reg?.fideId} ({reg?.fideRating})</div>
                                  </div>
                                </td>
                                <td className="p-4 px-6">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                                      <Phone className="h-3 w-3" /> {reg?.phone}
                                    </div>
                                    <div className="flex items-center gap-2" style={{ fontSize: '10px', color: '#94a3b8' }}>
                                      <Mail className="h-3 w-3" /> {reg?.email || 'No email provided'}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 px-6 text-center">
                                  <StatusBadge status={reg?.status} />
                                </td>
                                <td className="p-4 px-6">
                                  <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                                    <CalendarIcon className="h-3.5 w-3.5" />
                                    {reg?.createdAt ? format(new Date(reg.createdAt), "MMM dd, yyyy") : 'Date TBD'}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {/* Pagination Controls */}
                          {totalPages > 1 && (
                            <tr>
                              <td colSpan={6} className="p-4 px-6 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Showing page <span className="text-sky-600">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                      disabled={currentPage === 1}
                                      className="h-9 rounded-lg px-4 font-bold text-[10px] uppercase tracking-widest border-slate-200"
                                    >
                                      <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Previous
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                      disabled={currentPage === totalPages}
                                      className="h-9 rounded-lg px-4 font-bold text-[10px] uppercase tracking-widest border-slate-200"
                                    >
                                      Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })()
                  )}
                </tbody>
              </table>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TournamentPortal;
