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
import { Plus, Search, Trophy, Calendar, MapPin, FilterX, Upload, X } from "lucide-react";
import { Tournament } from "@/types";

type TournamentStatus = "ALL" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

const AdminTournaments: React.FC = () => {
  const { tournaments, isLoading, addTournament, updateTournament, deleteTournament } = useAdminTournaments();

  const [activeTab, setActiveTab] = useState<TournamentStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    let result = tournaments;
    if (activeTab !== "ALL") {
      result = result.filter((t) => t.status === activeTab);
    }
    if (searchQuery) {
      result = result.filter((t) => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.location && t.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return result;
  }, [tournaments, activeTab, searchQuery]);

  // --- Table Columns ---
  const columns: Column<Tournament>[] = [
    {
      header: "Tournament",
      accessorKey: "title",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{item.title}</span>
          <span className="text-xs text-muted-foreground md:hidden">{item.location}</span>
        </div>
      )
    },
    { 
      header: "Location", 
      accessorKey: "location",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{item.location || "No Location"}</span>
        </div>
      )
    },
    { 
      header: "Date", 
      accessorKey: "date",
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>{item.date ? new Date(item.date).toLocaleDateString() : "TBD"}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />
    },
  ];

  // --- Handlers ---
  
  // ✅ AUTO-SELECT LOGIC ADDED HERE
  const handleAdd = () => {
    setSelectedTournament(null);
    
    // Determine default status: If on a specific tab, use it. If on "ALL", default to "UPCOMING"
    const defaultStatus = activeTab === "ALL" ? "UPCOMING" : activeTab;

    setFormData({ 
      title: "", 
      location: "", 
      date: new Date().toISOString().split('T')[0], 
      status: defaultStatus, // Set based on active UI tab
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed", error);
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const payload = { 
      title: formData.title,
      location: formData.location,
      description: formData.description,
      status: formData.status,
      imageUrl: formData.imageUrl || null,
      entryFee: parseFloat(formData.entryFee) || 0, 
      date: formData.date 
    };
    
    try {
      if (selectedTournament) {
        await updateTournament(selectedTournament.id, payload);
      } else {
        await addTournament(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-amber-500" /> Tournament Console
          </h1>
          <p className="text-muted-foreground">Manage and broadcast academy competitive events.</p>
        </div>
        <Button onClick={handleAdd} className="h-11 px-6 bg-primary hover:bg-primary/90 shadow-md font-bold gap-2">
          <Plus className="h-5 w-5" /> Add Tournament
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by title or venue..." 
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TournamentStatus)} className="w-full md:w-auto">
          {/* ✅ UPDATED: Added CANCELLED to the tab list */}
          <TabsList className="grid w-full grid-cols-3 md:flex h-11 bg-muted/50 p-1">
            {["ALL", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"].map((status) => (
              <TabsTrigger key={status} value={status} className="px-4 font-medium">
                {status.charAt(0) + status.slice(1).toLowerCase()}
                <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                  {status === "ALL" ? tournaments.length : tournaments.filter(t => t.status === status).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FilterX className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No tournaments found</h3>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={filteredData} 
            isLoading={isLoading} 
            onEdit={handleEdit}
            onDelete={(item) => { setSelectedTournament(item); setIsConfirmOpen(true); }}
          />
        )}
      </div>

      {/* FORM MODAL */}
      <AdminFormModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        title={selectedTournament ? "Update Tournament" : "Create Event"} 
        onSave={handleSave}
      >
        <div className="grid gap-5 py-4 max-h-[70vh] overflow-y-auto px-1">
          
          {/* Image Upload Section */}
          <div className="grid gap-2">
            <Label>Tournament Banner</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors hover:bg-muted/50 relative">
              {formData.imageUrl ? (
                <div className="relative w-full aspect-video">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, imageUrl: ""})}
                    className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-4 cursor-pointer w-full">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {uploading ? "Uploading..." : "Click to upload image"}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Tournament Title</Label>
            <Input id="title" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location / Venue</Label>
            <Input id="location" value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Event Date</Label>
              <Input id="date" type="date" value={formData.date || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="entryFee">Entry Fee (₹)</Label>
              <Input id="entryFee" type="number" value={formData.entryFee || 0} onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
      </AdminFormModal>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={setIsConfirmOpen} 
        onConfirm={async () => { if(selectedTournament) await deleteTournament(selectedTournament.id); setIsConfirmOpen(false); }}
        title="Delete Tournament"
        description={`This action cannot be undone. "${selectedTournament?.title}" will be removed.`}
      />
    </div>
  );
};

export default AdminTournaments;