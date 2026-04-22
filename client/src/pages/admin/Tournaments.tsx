import React, { useState } from "react";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import DataTable, { Column } from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import StatusBadge from "@/components/shared/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Tournament } from "@/types";

const AdminTournaments: React.FC = () => {
  const { 
    tournaments, 
    isLoading, 
    addTournament, 
    updateTournament, 
    deleteTournament 
  } = useAdminTournaments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [formData, setFormData] = useState<Partial<Tournament>>({});

  // ✅ Column configuration for the Admin Table
  const columns: Column<Tournament>[] = [
    {
      header: "Tournament Name",
      accessorKey: "title", // ✅ Matches your backend 'title'
      cell: (item) => <span className="font-medium">{item.title}</span>
    },
    { header: "Location", accessorKey: "location" },
    { 
      header: "Date", 
      accessorKey: "date",
      cell: (item) => item.date ? new Date(item.date).toLocaleDateString() : "N/A"
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />
    },
  ];

  const handleAdd = () => {
    setSelectedTournament(null);
    setFormData({
      title: "",
      location: "",
      date: new Date().toISOString().split('T')[0],
      status: "UPCOMING",
      entryFee: 0,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    const formattedDate = tournament.date ? new Date(tournament.date).toISOString().split('T')[0] : "";
    setFormData({ ...tournament, date: formattedDate });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title,
        location: formData.location,
        // ✅ Ensures valid ISO date for Prisma
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        status: formData.status,
        entryFee: parseFloat(formData.entryFee?.toString() || "0"),
        description: formData.description || "",
      };

      if (selectedTournament) {
        await updateTournament(selectedTournament.id, payload);
      } else {
        await addTournament(payload as any);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedTournament) {
      await deleteTournament(selectedTournament.id);
      setIsConfirmOpen(false);
      setSelectedTournament(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Tournaments</h1>
          <p className="text-muted-foreground">Manage academy chess tournaments and results.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
          <Plus className="h-4 w-4" />
          Add Tournament
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={tournaments}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(item) => {
          setSelectedTournament(item);
          setIsConfirmOpen(true);
        }}
      />

      <AdminFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedTournament ? "Edit Tournament" : "Add New Tournament"}
        onSave={handleSave}
      >
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Tournament Name</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Event Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="entryFee">Entry Fee (₹)</Label>
              <Input
                id="entryFee"
                type="number"
                value={formData.entryFee || 0}
                onChange={(e) => setFormData({ ...formData, entryFee: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPCOMING">Upcoming</SelectItem> 
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </AdminFormModal>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Tournament"
        description={`Are you sure you want to delete "${selectedTournament?.title}"?`}
      />
    </div>
  );
};

export default AdminTournaments;