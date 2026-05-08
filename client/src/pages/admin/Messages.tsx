import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ContactMessage } from "@/types";
import {
  Mail, Phone, Clock, CheckCircle2, Trash2,
  Search, Filter, RefreshCw, MessageSquare,
  MoreVertical, Eye, Inbox
} from "lucide-react";
import AdminPageHeader from "@/components/shared/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AdminMessages: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [selectedMessage, setSelectedMessage] = React.useState<ContactMessage | null>(null);

  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, refetch } = useQuery<ContactMessage[]>({
    queryKey: ["admin-messages"],
    queryFn: async () => (await api.get("/contact")).data
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/contact/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.success("Message marked as read");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/contact/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.success("Message deleted");
      setSelectedMessage(null);
    }
  });

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.phone && m.phone.includes(searchTerm));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "READ" ? m.isRead : !m.isRead);

    return matchesSearch && matchesStatus;
  });

  const getAvatarStyles = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    if ("ABCDE".includes(firstLetter)) return { bg: "#e0f2fe", color: "#0284c7" };
    if ("FGHIJ".includes(firstLetter)) return { bg: "#ede9fe", color: "#6d28d9" };
    if ("KLMNO".includes(firstLetter)) return { bg: "#d1fae5", color: "#065f46" };
    if ("PQRST".includes(firstLetter)) return { bg: "#fef3c7", color: "#b45309" };
    return { bg: "#fce7f3", color: "#be185d" };
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <AdminPageHeader
        title="Contact Messages"
        subtitle="Manage inquiries and feedback from website visitors."
      />

      <div
        className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white"
        style={{
          border: '1px solid #e0eeff',
          padding: '14px 18px',
          borderRadius: '14px'
        }}
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
            <Input
              placeholder="Search by name, email or phone..."
              className="pl-10 h-11 w-full md:w-80 rounded-xl border-slate-200 focus:ring-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-44 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
              <SelectItem value="ALL" className="font-bold text-[10px] uppercase tracking-widest py-3">All Messages</SelectItem>
              <SelectItem value="UNREAD" className="font-bold text-[10px] uppercase tracking-widest py-3">Unread Only</SelectItem>
              <SelectItem value="READ" className="font-bold text-[10px] uppercase tracking-widest py-3">Read Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          className="rounded-full h-11 px-6 font-bold text-[10px] uppercase tracking-widest border-slate-200"
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} /> Refresh Feed
        </Button>
      </div>

      <div
        className="bg-white overflow-hidden"
        style={{
          border: '1px solid #e0eeff',
          borderRadius: '14px'
        }}
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[10px] font-black uppercase text-[#64748b] tracking-[0.08em]">
              <th className="p-4 px-6">Sender</th>
              <th className="p-4 px-6">Message Preview</th>
              <th className="p-4 px-6">Date</th>
              <th className="p-4 px-6 text-center">Status</th>
              <th className="p-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-sky-500 mb-4" />
                  <p className="font-bold uppercase tracking-widest text-xs text-slate-400">Loading Messages...</p>
                </td>
              </tr>
            ) : filteredMessages.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4 text-slate-300">
                    <Inbox className="h-12 w-12" />
                    <p className="font-bold uppercase tracking-widest text-xs">No messages found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMessages.map((m) => {
                const avatar = getAvatarStyles(m.name);
                return (
                  <tr
                    key={m.id}
                    className={cn(
                      "hover:bg-sky-50/50 transition-all duration-120 border-b border-slate-50 cursor-pointer group",
                      !m.isRead && "bg-blue-50/20"
                    )}
                    onClick={() => {
                      setSelectedMessage(m);
                      if (!m.isRead) markAsReadMutation.mutate(m.id);
                    }}
                  >
                    <td className="p-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: avatar.bg, color: avatar.color }}
                        >
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className={cn("text-sm truncate", !m.isRead ? "font-bold text-slate-900" : "font-medium text-slate-600")}>{m.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6">
                      <p className={cn("text-sm line-clamp-1 max-w-md", !m.isRead ? "text-slate-900 font-medium" : "text-slate-500")}>
                        {m.message}
                      </p>
                    </td>
                    <td className="p-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-600">
                          {format(new Date(m.createdAt || new Date()), "MMM d, yyyy")}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {format(new Date(m.createdAt || new Date()), "h:mm a")}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 px-6 text-center">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                        m.isRead ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-600"
                      )}>
                        {m.isRead ? "Read" : "New"}
                      </span>
                    </td>
                    <td className="p-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreVertical className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuItem
                              className="font-bold text-[11px] uppercase tracking-widest py-2.5 cursor-pointer"
                              onClick={() => {
                                setSelectedMessage(m);
                                if (!m.isRead) markAsReadMutation.mutate(m.id);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Message
                            </DropdownMenuItem>
                            {!m.isRead && (
                              <DropdownMenuItem
                                className="font-bold text-[11px] uppercase tracking-widest py-2.5 cursor-pointer"
                                onClick={() => markAsReadMutation.mutate(m.id)}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Mark Read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="font-bold text-[11px] uppercase tracking-widest py-2.5 cursor-pointer text-rose-600 focus:text-rose-600"
                              onClick={() => {
                                if (window.confirm("Delete this message?")) deleteMutation.mutate(m.id);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <SheetContent className="sm:max-w-xl rounded-l-[3rem] p-0 border-none shadow-2xl">
          {selectedMessage && (
            <div className="h-full flex flex-col">
              <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <SheetHeader className="relative z-10 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-sky-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      Inquiry
                    </span>
                    <span className={cn(
                      "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg",
                      selectedMessage.isRead ? "bg-white/10 text-white/60" : "bg-emerald-500 text-white"
                    )}>
                      {selectedMessage.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                  <SheetTitle className="text-3xl font-black text-white leading-tight">
                    {selectedMessage.name}
                  </SheetTitle>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                      <Mail className="h-4 w-4" /> {selectedMessage.email}
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                        <Phone className="h-4 w-4" /> {selectedMessage.phone}
                      </div>
                    )}
                  </div>
                </SheetHeader>
              </div>

              <div className="flex-1 p-10 space-y-10 overflow-y-auto bg-white rounded-tl-[3rem] -mt-6 relative z-20">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100">
                      <MessageSquare className="h-5 w-5 text-sky-600" />
                    </div>
                    <h4 className="text-sm font-black uppercase text-slate-900 tracking-widest">Message Content</h4>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                    <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                      <Clock className="h-5 w-5 text-orange-500" />
                    </div>
                    <h4 className="text-sm font-black uppercase text-slate-900 tracking-widest">Metadata</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sent Date</p>
                      <p className="font-bold text-slate-900">{format(new Date(selectedMessage.createdAt || new Date()), "PPP")}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sent Time</p>
                      <p className="font-bold text-slate-900">{format(new Date(selectedMessage.createdAt || new Date()), "p")}</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="p-8 bg-white border-t border-slate-100 flex items-center gap-4">
                <Button
                  className="flex-1 h-14 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-600/20"
                  onClick={() => window.open(`mailto:${selectedMessage.email}`)}
                >
                  <Mail className="mr-2 h-4 w-4" /> Reply via Email
                </Button>
                <Button
                  variant="outline"
                  className="h-14 w-14 rounded-2xl border-slate-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
                  onClick={() => {
                    if(window.confirm("Permanent delete?")) deleteMutation.mutate(selectedMessage.id);
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminMessages;
