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
import { Plus, Search, Trophy, Calendar, MapPin, FilterX } from "lucide-react";
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

  // ✅ Professional Filtering Logic
  const filteredData = useMemo(() => {
    let result = tournaments;
    if (activeTab !== "ALL") {
      result = result.filter((t) => t.status === activeTab);
    }
    if (searchQuery) {
      result = result.filter((t) => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [tournaments, activeTab, searchQuery]);

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
          <span>{item.location}</span>
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

  // Helper logic for Modals
  const handleAdd = () => {
    setSelectedTournament(null);
    setFormData({ title: "", location: "", date: new Date().toISOString().split('T')[0], status: "UPCOMING", entryFee: 0 });
    setIsModalOpen(true);
  };

  const handleEdit = (t: Tournament) => {
    setSelectedTournament(t);
    setFormData({ ...t, date: t.date ? new Date(t.date).toISOString().split('T')[0] : "" });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...formData, entryFee: Number(formData.entryFee) };
    selectedTournament ? await updateTournament(selectedTournament.id, payload) : await addTournament(payload);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 p-1">
      {/* --- Header Section --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-warning" /> Tournament Console
          </h1>
          <p className="text-muted-foreground">Manage and broadcast your academy's competitive events.</p>
        </div>
        <Button onClick={handleAdd} className="h-11 px-6 bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95 font-bold gap-2">
          <Plus className="h-5 w-5" /> Add Tournament
        </Button>
      </div>

      {/* --- Filter & Search Bar --- */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by title or venue..." 
            className="pl-10 h-11 border-muted-foreground/20 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TournamentStatus)} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-2 md:flex h-11 bg-muted/50 p-1">
            {["ALL", "UPCOMING", "ONGOING", "COMPLETED"].map((status) => (
              <TabsTrigger key={status} value={status} className="px-4 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
                {status.charAt(0) + status.slice(1).toLowerCase()}
                <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                  {status === "ALL" ? tournaments.length : tournaments.filter(t => t.status === status).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* --- Data Table Section --- */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FilterX className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No tournaments found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
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

      {/* Form Modal & Confirm Dialog */}
      <AdminFormModal open={isModalOpen} onOpenChange={setIsModalOpen} title={selectedTournament ? "Update Tournament" : "Create Event"} onSave={handleSave}>
        <div className="grid gap-4 py-4">
           {/* Existing form inputs go here... */}
        </div>
      </AdminFormModal>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={setIsConfirmOpen} 
        onConfirm={async () => { if(selectedTournament) await deleteTournament(selectedTournament.id); setIsConfirmOpen(false); }}
        title="Delete Tournament"
        description={`This action cannot be undone. "${selectedTournament?.title}" will be permanently removed.`}
      />
    </div>
  );
};

export default AdminTournaments;