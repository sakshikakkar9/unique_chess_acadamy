import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Event } from "@/types";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw,
  X
} from "lucide-react";
import AdminPageHeader from "@/components/shared/admin/AdminPageHeader";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import StatusBadge from "@/components/shared/admin/StatusBadge";
import { format } from "date-fns";

const AdminEvents: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    category: "CLASS",
    date: "",
    time: "",
    location: "",
    description: ""
  });

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["admin-events"],
    queryFn: async () => (await api.get("/events")).data
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post("/events", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event created successfully");
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event updated successfully");
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event deleted successfully");
      setIsConfirmOpen(false);
    }
  });

  const filteredEvents = useMemo(() => {
    return events.filter(e =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const handleAdd = () => {
    setSelectedEvent(null);
    setFormData({
      title: "",
      category: "CLASS",
      date: "",
      time: "",
      location: "",
      description: ""
    });
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      ...event,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : ""
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
    };

    if (selectedEvent) {
      updateMutation.mutate({ id: selectedEvent.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <AdminPageHeader
        title="Event Management"
        subtitle="Manage academy classes, workshops and special events."
        action={
          <Button onClick={handleAdd} className="shadow-lg bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        }
      />

      <div className="flex items-center gap-4 bg-white p-4 rounded-[14px] border border-[#e0eeff]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
          <Input
            placeholder="Search events..."
            className="pl-10 h-11 rounded-xl border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white overflow-hidden border border-[#e0eeff] rounded-[14px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f0f6ff] border-b-2 border-[#bae6fd]">
            <tr className="text-[11px] font-bold uppercase text-[#64748b] tracking-[0.08em]">
              <th className="p-4 px-6">Event Info</th>
              <th className="p-4 px-6">Schedule</th>
              <th className="p-4 px-6">Location</th>
              <th className="p-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-10 text-center">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-sky-600" />
                </td>
              </tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-slate-400">
                  No events found.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-[#f0f9ff] transition-all duration-120 border-b border-[#f1f5f9] group">
                  <td className="p-4 px-6">
                    <div className="space-y-1">
                      <p className="font-bold text-[#0f172a] text-[13px]">{event.title}</p>
                      <StatusBadge status={event.category} />
                    </div>
                  </td>
                  <td className="p-4 px-6">
                    <div className="space-y-1 text-[#94a3b8] text-[11px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> {format(new Date(event.date), "PPP")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" /> {event.time || "TBD"}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 px-6">
                    <div className="flex items-center gap-2 text-[#94a3b8] text-[11px]">
                      <MapPin className="h-3 w-3" /> {event.location || "Online"}
                    </div>
                  </td>
                  <td className="p-4 px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full">
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl border-slate-100 shadow-xl">
                        <DropdownMenuItem onClick={() => handleEdit(event)} className="font-bold text-[10px] uppercase py-2.5 cursor-pointer">
                          <Edit className="mr-2 h-3.5 w-3.5 text-sky-500" /> Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedEvent(event); setIsConfirmOpen(true); }} className="font-bold text-[10px] uppercase py-2.5 cursor-pointer text-rose-600 focus:text-rose-600">
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedEvent ? "Update Event" : "Create New Event"}
        onSave={handleSave}
      >
        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Event Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Summer Chess Workshop"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v as any })}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLASS">Class</SelectItem>
                  <SelectItem value="WORKSHOP">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Venue or Online"
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time</Label>
              <Input
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 10:00 AM - 12:00 PM"
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief overview of the event"
              className="h-11 rounded-xl"
            />
          </div>
        </div>
      </AdminFormModal>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={() => selectedEvent && deleteMutation.mutate(selectedEvent.id)}
        title="Delete Event?"
        description="This will permanently remove this event from the academy calendar."
      />
    </div>
  );
};

export default AdminEvents;
