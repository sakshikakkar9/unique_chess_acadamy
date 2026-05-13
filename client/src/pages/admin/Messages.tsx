import { useState, useMemo } from "react";
import {
  Mail, Trash2, Search, Filter,
  Check, Loader2
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminTable, { AdminTableColumn } from "@/components/admin/AdminTable";
import StatusBadge from "@/components/shared/admin/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import { getAvatarStyles } from "@/lib/utils";
import RowActionMenu from "@/components/admin/RowActionMenu";
import { useEffect } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function MessagesPage() {
  const { success, error: toastError } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const qc = useQueryClient();

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["admin-messages"],
    queryFn: async () => (await api.get("/admin/messages")).data
  });

  useEffect(() => {
    if (selectedMessage && selectedMessage.status === 'unread') {
      handleMarkAsRead(selectedMessage.id);
    }
  }, [selectedMessage]);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch = (
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (msg.phone && msg.phone.includes(searchTerm)) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus =
        statusFilter === "ALL" ||
        msg.status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/admin/messages/${id}/read`);
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      success("Message marked as read");
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: 'read' });
      }
    } catch (err) {
      toastError("Failed to update message");
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/messages/${id}`);
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      success("Message deleted");
      setIsConfirmOpen(false);
      setMessageToDelete(null);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      toastError("Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: AdminTableColumn[] = [
    { key: 'displayProfile', label: 'Sender', className: 'min-w-[200px]' },
    { key: 'displayMessage', label: 'Message Preview', hiddenOn: 'mobile' },
    { key: 'displayDate', label: 'Sent Date', hiddenOn: 'tablet' },
    { key: 'displayStatus', label: 'Status', align: 'right' }
  ];

  const rows = filteredMessages.map((msg) => {
    const avatarStyles = getAvatarStyles(msg.name);
    return {
      ...msg,
      displayProfile: (
        <div className="flex items-center gap-3">
          <div
            className="size-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0"
            style={{ backgroundColor: avatarStyles.bg, color: avatarStyles.color }}
          >
            {msg.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-uca-text-primary truncate">{msg.name}</span>
            <span className="text-[10px] text-uca-text-muted truncate">
              {msg.email}
            </span>
          </div>
        </div>
      ),
      displayMessage: (
        <p className="text-xs text-uca-text-muted truncate max-w-[300px]">
          {msg.message}
        </p>
      ),
      displayDate: (
        <span className="text-[10px] text-uca-text-muted font-medium">
          {format(new Date(msg.createdAt), "MMM d, h:mm a")}
        </span>
      ),
      displayStatus: (
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
          msg.status === 'read' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'
        }`}>
          {msg.status}
        </span>
      ),
      actions: (
        <RowActionMenu
          onEdit={() => setSelectedMessage(msg)}
          onDelete={() => { setMessageToDelete(msg); setIsConfirmOpen(true); }}
        />
      )
    };
  });

  return (
    <AdminShell
      title="Messages"
      subtitle="View and manage inquiries from the contact form."
    >
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-uca-bg-surface border border-uca-border p-4 rounded-xl mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
            <div className="relative flex-1 w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-uca-text-muted" />
              <Input
                placeholder="Search messages..."
                className="w-full h-10 bg-uca-bg-base border-uca-border text-sm focus:ring-uca-accent-blue rounded-lg pl-10 pr-4 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full sm:w-40 bg-uca-bg-base border-uca-border text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Filter className="size-3.5 text-uca-text-muted" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                <SelectItem value="ALL">All Messages</SelectItem>
                <SelectItem value="UNREAD">Unread</SelectItem>
                <SelectItem value="READ">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AdminTable
          columns={columns}
          rows={rows}
          isLoading={isLoading}
          onRowClick={setSelectedMessage}
          onEdit={setSelectedMessage}
          onDelete={(msg) => { setMessageToDelete(msg); setIsConfirmOpen(true); }}
          renderActions={(row) => row.actions}
        />
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onCancel={() => { setIsConfirmOpen(false); setMessageToDelete(null); }}
        onConfirm={() => messageToDelete && handleDelete(messageToDelete.id)}
        isLoading={isDeleting}
        title="Delete Message?"
        description="Are you sure you want to delete this message? This action cannot be undone."
      />

      <Sheet open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <SheetContent className="sm:max-w-xl rounded-l-[2rem] p-0 border-uca-border bg-uca-bg-base shadow-2xl overflow-y-auto">
          {selectedMessage && (
            <div className="h-full flex flex-col">
              <div className="bg-uca-navy p-8 text-white relative overflow-hidden shrink-0 border-b border-uca-border">
                <SheetHeader className="mb-6 relative z-10 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded border ${
                      selectedMessage.status === 'read' ? 'bg-slate-100/10 border-white/20 text-white/60' : 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                    }`}>
                      {selectedMessage.status}
                    </span>
                  </div>
                  <SheetTitle className="text-3xl font-black text-white leading-tight tracking-tight">
                    {selectedMessage.name}
                  </SheetTitle>
                  <p className="text-uca-text-muted font-bold text-sm mt-1 flex items-center gap-2">
                    <Mail className="size-4 text-uca-accent-blue" />
                    {selectedMessage.email}
                  </p>
                </SheetHeader>

                <div className="flex flex-wrap gap-3 relative z-10">
                  <div className="bg-uca-bg-elevated px-4 py-2 rounded-lg border border-uca-border flex flex-col gap-0.5">
                    <p className="text-[8px] font-black text-uca-text-muted uppercase tracking-widest">Sent On</p>
                    <p className="text-xs font-bold">{format(new Date(selectedMessage.createdAt), "PPP p")}</p>
                  </div>
                  {selectedMessage.phone && (
                    <div className="bg-uca-bg-elevated px-4 py-2 rounded-lg border border-uca-border flex flex-col gap-0.5">
                      <p className="text-[8px] font-black text-uca-text-muted uppercase tracking-widest">Phone</p>
                      <p className="text-xs font-bold">{selectedMessage.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 p-8 bg-uca-bg-base">
                <div className="bg-uca-bg-surface p-6 rounded-2xl border border-uca-border shadow-sm min-h-[200px]">
                  <p className="text-[10px] font-black text-uca-text-muted uppercase tracking-widest mb-4">Message Content</p>
                  <p className="text-uca-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-uca-bg-surface border-t border-uca-border flex gap-3 shrink-0">
                {selectedMessage.status === 'unread' && (
                  <Button
                    className="flex-1 h-12 bg-uca-navy hover:bg-uca-navy-hover text-white rounded-lg font-bold text-xs uppercase tracking-widest"
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                  >
                    <Check className="size-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-lg font-bold text-xs uppercase tracking-widest border-uca-border bg-uca-bg-base text-uca-text-muted hover:text-red-500 hover:border-red-500/50"
                  onClick={() => { setMessageToDelete(selectedMessage); setIsConfirmOpen(true); }}
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}
