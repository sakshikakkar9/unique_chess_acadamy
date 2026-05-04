import React, { useState, useMemo } from "react";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import DataTable from "@/components/shared/admin/DataTable";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import StatusBadge from "@/components/shared/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trophy, Upload, X } from "lucide-react";
import { Tournament } from "@/types";

type TournamentStatus = "ALL" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

const AdminTournaments: React.FC = () => {
  const { tournaments, isLoading, addTournament, updateTournament, deleteTournament } = useAdminTournaments();

  const [activeTab, setActiveTab] = useState<TournamentStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedScannerFile, setSelectedScannerFile] = useState<File | null>(null);
  const [previewScannerUrl, setPreviewScannerUrl] = useState<string>("");

  // Updated initial state to match new Prisma schema fields
  const [formData, setFormData] = useState<any>({
    title: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    location: "",
    category: "",
    totalPrizePool: "",
    entryFee: 0,
    discountDetails: "",
    brochureUrl: "",
    otherDetails: "",
    contactDetails: "",
    status: "UPCOMING",
    description: "",
    imageUrl: ""
  });

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
    setSelectedFile(null);
    setPreviewUrl("");
    setSelectedScannerFile(null);
    setPreviewScannerUrl("");
    setFormData({ 
      title: "", 
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      location: "", 
      category: "",
      totalPrizePool: "",
      entryFee: 0,
      discountDetails: "",
      brochureUrl: "",
      otherDetails: "",
      contactDetails: "",
      status: activeTab === "ALL" ? "UPCOMING" : activeTab,
      description: "",
      imageUrl: "",
      scannerUrl: ""
    });
    setIsModalOpen(true);
  };

  const handleEdit = (t: Tournament) => {
    setSelectedTournament(t);
    setSelectedFile(null);
    setPreviewUrl(t.imageUrl || "");
    setSelectedScannerFile(null);
    setPreviewScannerUrl(t.scannerUrl || "");
    setFormData({ 
      ...t, 
      startDate: t.startDate ? new Date(t.startDate).toISOString().split('T')[0] : "",
      endDate: t.endDate ? new Date(t.endDate).toISOString().split('T')[0] : "",
      entryFee: t.entryFee || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("startDate", new Date(formData.startDate).toISOString());
    if (formData.endDate) data.append("endDate", new Date(formData.endDate).toISOString());
    data.append("location", formData.location || "");
    data.append("category", formData.category || "");
    data.append("totalPrizePool", formData.totalPrizePool || "");
    data.append("entryFee", String(formData.entryFee || 0));
    data.append("discountDetails", formData.discountDetails || "");
    data.append("brochureUrl", formData.brochureUrl || "");
    data.append("otherDetails", formData.otherDetails || "");
    data.append("contactDetails", formData.contactDetails || "");
    data.append("status", formData.status);
    data.append("description", formData.description || "");

    if (selectedFile) {
      data.append("image", selectedFile);
    } else if (formData.imageUrl) {
      data.append("imageUrl", formData.imageUrl);
    }

    if (selectedScannerFile) {
      data.append("scanner", selectedScannerFile);
    } else if (formData.scannerUrl) {
      data.append("scannerUrl", formData.scannerUrl);
    }

    try {
      if (selectedTournament) await updateTournament(selectedTournament.id, data);
      else await addTournament(data);
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

      {/* Main Table Section */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <DataTable 
          columns={[
            { header: "Tournament", accessorKey: "title" },
            { header: "Start Date", accessorKey: "startDate", cell: (item) => new Date(item.startDate).toLocaleDateString() },
            { header: "Status", accessorKey: "status", cell: (item) => <StatusBadge status={item.status} /> }
          ]} 
          data={filteredData} 
          isLoading={isLoading} 
          onEdit={handleEdit}
          onDelete={(item) => { setSelectedTournament(item); setIsConfirmOpen(true); }}
        />
      </div>

      <AdminFormModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        title={selectedTournament ? "Edit Tournament" : "New Tournament"} 
        onSave={handleSave}
      >
        <div className="flex flex-col gap-6 py-4 px-1 overflow-y-auto max-h-[70vh] scrollbar-thin">
          
          {/* 1. Banner & Scanner Upload */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold">Tournament Banner</Label>
              <div className="border-2 border-dashed rounded-xl p-4 text-center hover:bg-muted/50 transition-colors min-h-[160px] flex items-center justify-center">
                {previewUrl ? (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                    <img src={previewUrl} alt="Banner" className="w-full h-full object-cover" />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => {
                        setPreviewUrl("");
                        setSelectedFile(null);
                        setFormData({...formData, imageUrl: ""});
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center py-4 w-full">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-[10px] font-medium">Upload Banner</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold">Payment QR Scanner</Label>
              <div className="border-2 border-dashed rounded-xl p-4 text-center hover:bg-muted/50 transition-colors min-h-[160px] flex items-center justify-center">
                {previewScannerUrl ? (
                  <div className="relative aspect-square w-24 rounded-lg overflow-hidden mx-auto">
                    <img src={previewScannerUrl} alt="Scanner" className="w-full h-full object-cover" />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => {
                        setPreviewScannerUrl("");
                        setSelectedScannerFile(null);
                        setFormData({...formData, scannerUrl: ""});
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center py-4 w-full">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-[10px] font-medium">Upload QR</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedScannerFile(file);
                          setPreviewScannerUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* 2. Series-wise Inputs Based on Client Requirements */}
          <div className="grid gap-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Tournament Title" />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Brief overview of the tournament" />
            </div>

            {/* Dates (Start and End) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
              </div>
            </div>

            {/* Location & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Venue" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Open, Under-19" />
              </div>
            </div>

            {/* Price Pool */}
            <div className="grid gap-2">
              <Label htmlFor="prize">Total Price Pool</Label>
              <Input id="prize" value={formData.totalPrizePool} onChange={(e) => setFormData({...formData, totalPrizePool: e.target.value})} placeholder="e.g. ₹50,000" />
            </div>

            {/* Entry Fee & Discount Description */}
            <div className="grid gap-2">
              <Label htmlFor="fee">Entry Fee</Label>
              <Input id="fee" type="number" value={formData.entryFee} onChange={(e) => setFormData({...formData, entryFee: e.target.value})} />
              <Input 
                placeholder="Discount Details (e.g. Early bird 10% off)" 
                value={formData.discountDetails} 
                onChange={(e) => setFormData({...formData, discountDetails: e.target.value})} 
                className="mt-1 text-sm"
              />
            </div>

            {/* Brochure Upload */}
            <div className="grid gap-2">
              <Label htmlFor="brochure">Tournament Brochure (Link or Base64)</Label>
              <Input id="brochure" value={formData.brochureUrl} onChange={(e) => setFormData({...formData, brochureUrl: e.target.value})} placeholder="Paste brochure link or upload info" />
            </div>

            {/* Other Details */}
            <div className="grid gap-2">
              <Label htmlFor="other">Other Details</Label>
              <Textarea id="other" value={formData.otherDetails} onChange={(e) => setFormData({...formData, otherDetails: e.target.value})} placeholder="Rules, schedule, etc." />
            </div>

            {/* Contact Details */}
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact Details</Label>
              <Input id="contact" value={formData.contactDetails} onChange={(e) => setFormData({...formData, contactDetails: e.target.value})} placeholder="Name/Phone/Email" />
            </div>

            {/* Status Selection */}
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