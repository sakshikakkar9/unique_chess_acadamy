import React, { useState, useMemo } from "react";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import DataTable, { Column } from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import StatusBadge from "@/components/shared/admin/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Ensure you have this shadcn component
import { Plus, Search, Trophy, Calendar, MapPin, FilterX, Upload, X, Edit2, Trash2 } from "lucide-react";
import { Tournament } from "@/types";

type TournamentStatus = "ALL" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

const AdminTournaments: React.FC = () => {
  const { tournaments, isLoading, addTournament, updateTournament, deleteTournament } = useAdminTournaments();

  const [activeTab, setActiveTab] = useState<TournamentStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  
  // Initialize with empty strings to avoid "undefined" input issues
  const [formData, setFormData] = useState<any>({
    title: "",
    location: "",
    date: "",
    entryFee: 0,
    status: "UPCOMING",
    description: "",
    imageUrl: ""
  });
  const [uploading, setUploading] = useState(false);

  const filteredData = useMemo(() => {
    let result = tournaments;
    if (activeTab !== "ALL") result = result.filter((t) => t.status === activeTab);
    if (searchQuery) {
      result = result.filter((t) => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.location && t.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return result;
  }, [tournaments, activeTab, searchQuery]);

  const handleAdd = () => {
    setSelectedTournament(null);
    setFormData({ 
      title: "", 
      location: "", 
      date: new Date().toISOString().split('T')[0], 
      status: activeTab === "ALL" ? "UPCOMING" : activeTab,
      entryFee: 0,
      description: "",
      imageUrl: "" 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (t: Tournament) => {
    setSelectedTournament(t);
    setFormData({ 
      ...t, 
      date: t.date ? new Date(t.date).toISOString().split('T')[0] : "",
      entryFee: t.entryFee || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = { 
      ...formData, 
      entryFee: parseFloat(formData.entryFee) || 0,
      // Ensure date is sent as ISO string for Prisma DateTime field
      date: new Date(formData.date).toISOString() 
    };
    try {
      if (selectedTournament) await updateTournament(selectedTournament.id, payload);
      else await addTournament(payload);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="space-y-6 p-2 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-7 w-7 text-amber-500" /> Tournament Console
          </h1>
          <p className="text-sm text-muted-foreground">Manage competitive events and registrations.</p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto font-bold h-11 gap-2">
          <Plus className="h-5 w-5" /> Add Tournament
        </Button>
      </div>

      {/* Main Table/List Container */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <DataTable 
          columns={[
            { header: "Tournament", accessorKey: "title" },
            { header: "Date", accessorKey: "date", cell: (item) => new Date(item.date).toLocaleDateString() },
            { header: "Status", accessorKey: "status", cell: (item) => <StatusBadge status={item.status} /> }
          ]} 
          data={filteredData} 
          isLoading={isLoading} 
          onEdit={handleEdit}
          onDelete={(item) => { setSelectedTournament(item); setIsConfirmOpen(true); }}
        />
      </div>

      {/* 
        FORM MODAL: IMPROVED VISIBILITY 
        Added h-[80vh] and overflow-y-auto to ensure it scrolls on all phones.
      */}
      <AdminFormModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        title={selectedTournament ? "Edit Tournament" : "New Tournament"} 
        onSave={handleSave}
      >
        <div className="flex flex-col gap-6 py-4 px-1 overflow-y-auto max-h-[70vh] scrollbar-thin">
          
          {/* 1. Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-bold">Tournament Banner</Label>
            <div className="border-2 border-dashed rounded-xl p-4 text-center hover:bg-muted/50 transition-colors">
              {formData.imageUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img src={formData.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => setFormData({...formData, imageUrl: ""})}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center py-6">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium">Click to upload JPG/PNG</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormData({...formData, imageUrl: reader.result});
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                </label>
              )}
            </div>
          </div>

          {/* 2. Basic Info */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Tournament Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Rising Masters Elite" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Venue / Location</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g. Gurugram Academy" />
            </div>
          </div>

          {/* 3. Pricing & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fee">Entry Fee (₹)</Label>
              <Input id="fee" type="number" value={formData.entryFee} onChange={(e) => setFormData({...formData, entryFee: e.target.value})} />
            </div>
          </div>

          {/* 4. Status Selection */}
          <div className="grid gap-2">
            <Label>Current Status</Label>
            <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 5. Description */}
          <div className="grid gap-2">
            <Label htmlFor="desc">Event Description</Label>
            <Textarea 
              id="desc" 
              placeholder="Detail the tournament rules, prizes, etc."
              className="min-h-[120px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>
      </AdminFormModal>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={setIsConfirmOpen} 
        onConfirm={async () => { if(selectedTournament) await deleteTournament(selectedTournament.id); setIsConfirmOpen(false); }}
        title="Delete Tournament"
        description="This will permanently remove the tournament and all player registrations."
      />
    </div>
  );
};

export default AdminTournaments;
