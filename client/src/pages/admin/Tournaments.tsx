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
  const { tournaments, isLoading, addTournament, updateTournament, deleteTournament } = useAdminTournaments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [formData, setFormData] = useState<Partial<Tournament>>({});

  const columns: Column<Tournament>[] = [
    {
      header: "Tournament Name",
      accessorKey: "title",
      cell: (item) => <span className="font-medium">{item.title}</span>
    },
    { header: "Location", accessorKey: "location" },
    { header: "Date", accessorKey: "date" },
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
      date: "",
      status: "Coming Soon",
      type: "Open",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setFormData({ ...tournament });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsConfirmOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedTournament) {
        await updateTournament(selectedTournament.id, formData);
      } else {
        await addTournament(formData as Omit<Tournament, "id">);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
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
          <h1 className="text-3xl font-bold tracking-tight">Tournaments</h1>
          <p className="text-muted-foreground">Manage upcoming and past chess tournaments.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Tournament
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={tournaments}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <AdminFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedTournament ? "Edit Tournament" : "Add New Tournament"}
        onSave={handleSave}
      >
        <div className="grid gap-4">
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
              placeholder="e.g. Mumbai"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              placeholder="e.g. June 15–18, 2026"
              value={formData.date || ""}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
              onValueChange={(v: Tournament["status"]) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v: Tournament["type"]) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="State">State</SelectItem>
                  <SelectItem value="National">National</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </AdminFormModal>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Tournament"
        description={`Are you sure you want to delete "${selectedTournament?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminTournaments;
