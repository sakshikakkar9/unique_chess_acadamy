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
import AdminShell from "@/components/admin/AdminShell";
import Pagination from "@/components/shared/admin/Pagination";
import { getAvatarStyles, cn } from "@/lib/utils";

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
      <AdminShell title="Loading Arena..." subtitle="Fetching tournament data">
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      </AdminShell>
    );
  }

  if (!tournament) return (
    <AdminShell title="Not Found" subtitle="Tournament ID mismatch">
      <div className="p-12 text-center bg-uca-bg-surface border border-uca-border rounded-2xl">
        <p className="text-uca-text-muted">Tournament arena not found.</p>
      </div>
    </AdminShell>
  );

  return (
    <AdminShell
      title={tournament.title}
      subtitle={`Portal ID: ${id?.substring(0, 8).toUpperCase()}`}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/tournaments")}
            className="rounded-lg hover:bg-uca-bg-elevated text-uca-text-muted gap-2 px-3"
          >
            <ArrowLeft className="size-4" /> Back to Arenas
          </Button>
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <TabsList className="bg-uca-bg-surface border border-uca-border p-1.5 h-12 rounded-xl mb-6 inline-flex min-w-max">
              <TabsTrigger
                value="summary"
                className="rounded-lg px-6 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-uca-navy data-[state=active]:text-white transition-all"
              >
                <LayoutDashboard className="size-3.5 mr-2" /> Summary
              </TabsTrigger>
              <TabsTrigger
                value="finance"
                className="rounded-lg px-6 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-uca-navy data-[state=active]:text-white transition-all"
              >
                <CreditCard className="size-3.5 mr-2" /> Finance
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="rounded-lg px-6 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-uca-navy data-[state=active]:text-white transition-all"
              >
                <Users className="size-3.5 mr-2" /> Roster
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="summary" className="mt-0 focus-visible:ring-0">
             <div className="bg-uca-bg-surface rounded-2xl border border-uca-border p-6 md:p-10 shadow-sm overflow-hidden">
               <TournamentPreview tournament={tournament} />
             </div>
          </TabsContent>

          <TabsContent value="finance" className="mt-0 focus-visible:ring-0 space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
               {[
                 { label: 'Total Collections', value: `₹${totalCollections.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', sub: `${registrations.length} players` },
                 { label: 'Entry Fee', value: `₹${tournament?.entryFee?.toLocaleString() || "0"}`, icon: Wallet, color: 'text-uca-accent-blue', bg: 'bg-uca-accent-blue/10', sub: 'Standard rate' },
                 { label: 'Prize Pool', value: tournament.totalPrizePool || "₹0", icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10', sub: 'Total rewards' }
               ].map((stat, i) => (
                 <div key={i} className="bg-uca-bg-surface p-6 rounded-xl border border-uca-border space-y-4 shadow-sm">
                    <div className={cn("size-10 rounded-lg flex items-center justify-center border border-uca-border", stat.bg)}>
                      <stat.icon className={cn("size-5", stat.color)} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-uca-text-muted mb-1">{stat.label}</p>
                      <p className="text-2xl font-black text-uca-text-primary tracking-tight">{stat.value}</p>
                    </div>
                    <p className="text-[10px] font-bold text-uca-text-muted pt-3 border-t border-uca-border/50">{stat.sub}</p>
                 </div>
               ))}
             </div>

             <div className="bg-uca-bg-surface rounded-xl border border-uca-border p-6 space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="size-9 rounded-lg bg-uca-navy flex items-center justify-center border border-uca-border">
                      <Percent className="size-4 text-uca-accent-blue" />
                   </div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-uca-text-primary">Discount Intel</h3>
                </div>
                <div className="p-5 bg-uca-bg-base rounded-xl border border-uca-border min-h-[80px]">
                   <p className="text-sm font-medium text-uca-text-muted leading-relaxed italic">
                      {tournament.discountDetails || "No special discount details provided for this tournament."}
                   </p>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="students" className="mt-0 focus-visible:ring-0 space-y-6">
             <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-uca-bg-surface p-5 rounded-xl border border-uca-border shadow-sm">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-uca-text-muted" />
                  <Input
                    placeholder="Search roster..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-10 h-11 bg-uca-bg-base border-uca-border text-sm focus:ring-uca-accent-blue rounded-lg"
                  />
                </div>
                <Button
                  className="h-11 rounded-lg font-bold gap-2 bg-uca-navy hover:bg-uca-navy-hover text-white text-xs uppercase tracking-widest w-full md:w-auto"
                  onClick={() => {
                    const headers = ["Reference ID", "Student Name", "Category", "FIDE ID", "Rating", "Phone", "Status"];
                    const rows = registrations?.map(r => [
                      r?.referenceId,
                      r?.student?.fullName || "N/A",
                        r?.category || "N/A",
                        r?.student?.fideId || "NA",
                        r?.student?.fideRating || 0,
                        r?.student?.phone || "N/A",
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
                  <Download className="size-4" /> Export CSV
                </Button>
             </div>

             <div className="bg-uca-bg-surface border border-uca-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-uca-bg-elevated/50 border-b border-uca-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Player</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Division / FIDE</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted hidden lg:table-cell">Contact</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted text-center">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-uca-text-muted text-right">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-uca-border">
                      {isRegLoading ? (
                        <tr><td colSpan={5} className="py-12 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">Loading roster...</td></tr>
                      ) : (
                        (() => {
                          const filtered = registrations.filter((reg) => {
                            const name = reg?.student?.fullName?.toLowerCase() || "";
                            const refId = reg?.referenceId?.toLowerCase() || "";
                            const search = searchQuery.toLowerCase();
                            return name.includes(search) || refId.includes(search);
                          });
                          const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                          const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

                          if (paginated.length === 0) return <tr><td colSpan={5} className="py-20 text-center text-uca-text-muted text-xs uppercase font-bold tracking-widest">No players found</td></tr>;

                          return (
                            <>
                              {paginated.map((reg) => {
                                const name = reg?.student?.fullName || "N/A";
                                const avatarStyles = getAvatarStyles(name);
                                return (
                                  <tr key={reg?.id} className="hover:bg-uca-bg-elevated/30 transition-colors">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}>
                                          {name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-sm font-bold text-uca-text-primary truncate">{name}</p>
                                          <p className="text-[10px] text-uca-text-muted font-mono">{reg?.referenceId}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-semibold text-uca-text-primary">{reg?.category || 'Open'}</span>
                                        <span className="text-[10px] text-uca-text-muted">FIDE: {reg?.student?.fideRating || 0}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-xs text-uca-text-primary font-medium">{reg?.student?.phone}</span>
                                        <span className="text-[10px] text-uca-text-muted truncate max-w-[120px]">{reg?.student?.email}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <StatusBadge status={reg?.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <span className="text-[10px] text-uca-text-muted font-bold">
                                        {reg?.createdAt ? format(new Date(reg.createdAt), "MMM d, yyyy") : 'TBD'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                              {totalPages > 1 && (
                                <tr>
                                  <td colSpan={5} className="px-6 py-4 bg-uca-bg-elevated/20">
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>
  );
};

export default TournamentPortal;
