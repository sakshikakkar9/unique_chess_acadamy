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
import { Plus, Search, Trophy, Calendar, MapPin, FilterX, Upload, X, MoreVertical, Edit2, Trash2 } from "lucide-react";
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

  // --- Table Columns (Desktop) ---
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
  const handleAdd = () => {
    setSelectedTournament(null);
    const defaultStatus = activeTab === "ALL" ? "UPCOMING" : activeTab;
    setFormData({ 
      title: "", 
      location: "", 
      date: new Date().toISOString().split('T')[0], 
      status: defaultStatus,
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
    const payload = { ...formData, entryFee: parseFloat(formData.entryFee) || 0 };
    try {
      if (selectedTournament) await updateTournament(selectedTournament.id, payload);
      else await addTournament(payload);
      setIsModalOpen(false);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="space-y-6 p-2 md:p-6 lg:p-8">
      {/* 1. Header: Improved for Mobile */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-7 w-7 text-amber-500" /> Tournament Console
          </h1>
          <p className="text-sm text-muted-foreground">Manage academy competitive events.</p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto h-11 px-6 font-bold gap-2">
          <Plus className="h-5 w-5" /> Add Tournament
        </Button>
      </div>

      {/* 2. Filters & Tabs: Fixed Overflow issues seen in screenshot */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-3 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search tournaments..." 
            className="pl-10 h-11 bg-muted/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Scrollable Tabs for Mobile */}
        <div className="overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TournamentStatus)} className="w-fit">
            <TabsList className="h-11 bg-muted/50 p-1 flex w-max">
              {["ALL", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"].map((status) => (
                <TabsTrigger key={status} value={status} className="px-3 md:px-4 text-xs md:text-sm">
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                  <span className="ml-1.5 opacity-60 text-[10px]">
                    ({status === "ALL" ? tournaments.length : tournaments.filter(t => t.status === status).length})
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 3. Tournament List: Card View (Mobile) vs Table View (Desktop) */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FilterX className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold opacity-50">No tournaments found</h3>
          </div>
        ) : (
          <>
            {/* MOBILE ONLY: Card List */}
            <div className="grid grid-cols-1 divide-y md:hidden">
              {filteredData.map((t) => (
                <div key={t.id} className="p-4 space-y-3 active:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground leading-none">{t.title}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {t.location || "TBD"}
                      </div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {t.date ? new Date(t.date).toLocaleDateString() : "TBD"}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(t)} className="h-8 px-2.5">
                        <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedTournament(t); setIsConfirmOpen(true); }} className="h-8 px-2 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP ONLY: Table View */}
            <div className="hidden md:block">
              <DataTable 
                columns={columns} 
                data={filteredData} 
                isLoading={isLoading} 
                onEdit={handleEdit}
                onDelete={(item) => { setSelectedTournament(item); setIsConfirmOpen(true); }}
              />
            </div>
          </>
        )}
      </div>

      {/* --- FORM MODAL & DIALOGS --- */}
      {/* (Same as your previous code, ensure they are responsive) */}
      <AdminFormModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        title={selectedTournament ? "Update Tournament" : "Create Event"} 
        onSave={handleSave}
      >
        <div className="grid gap-5 py-4 max-h-[70vh] overflow-y-auto px-1">
             {/* ... (Keep your existing form fields here) */}
             <div className="grid gap-2">
                <Label htmlFor="title">Tournament Title</Label>
                <Input id="title" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
             </div>
             {/* ... ensure other inputs follow this pattern */}
        </div>
      </AdminFormModal>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={setIsConfirmOpen} 
        onConfirm={async () => { if(selectedTournament) await deleteTournament(selectedTournament.id); setIsConfirmOpen(false); }}
        title="Delete Tournament"
        description={`This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminTournaments;
