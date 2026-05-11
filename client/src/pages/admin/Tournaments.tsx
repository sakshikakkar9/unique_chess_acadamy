import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import AdminShell from "@/components/admin/AdminShell";
import AdminModal from "@/components/admin/AdminModal";
import AdminTable, { AdminTableColumn } from "@/components/admin/AdminTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, X, Search, Eye, Calendar, Users, Check, Loader2 } from "lucide-react";
import { Tournament } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RichTextEditor from "@/components/shared/admin/RichTextEditor";
import { cn } from "@/lib/utils";
import TournamentPreview from "@/features/tournaments/components/admin/TournamentPreview";
import StatusBadge from "@/components/shared/admin/StatusBadge";
import { useToast } from "@/hooks/useToast";

type TournamentStatus = "ALL" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

const AdminTournaments: React.FC = () => {
  const navigate = useNavigate();
  const { tournaments, isLoading, addTournament, updateTournament, deleteTournament } = useAdminTournaments();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<TournamentStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewData, setPreviewData] = useState<Tournament | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [editingRecord, setEditingRecord] = useState<Tournament | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBrochure, setSelectedBrochure] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    regStartDate: "",
    regEndDate: "",
    location: "",
    category: "",
    totalPrizePool: "",
    entryFee: 0,
    discountDetails: "",
    otherDetails: "",
    brochureUrl: "",
    contactDetails: "",
    posterOrientation: "LANDSCAPE",
    status: "UPCOMING",
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
    setEditingRecord(null);
    setSelectedTournament(null);
    setSelectedFile(null);
    setSelectedBrochure(null);
    setPreviewUrl("");
    setFormData({ 
      title: "", 
      description: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      regStartDate: "",
      regEndDate: "",
      location: "", 
      category: "",
      totalPrizePool: "",
      entryFee: 0,
      discountDetails: "",
      otherDetails: "",
      brochureUrl: "",
      contactDetails: "",
      posterOrientation: "LANDSCAPE",
      status: activeTab === "ALL" ? "UPCOMING" : activeTab,
      imageUrl: ""
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingRecord(null);
    setSelectedTournament(null);
  };

  const handleViewPreview = (t: any) => {
    if (isModalOpen) {
      setPreviewData({
        ...t,
        ...formData,
        imageUrl: previewUrl || t.imageUrl
      });
    } else {
      setPreviewData(t);
    }
    setIsPreviewOpen(true);
  };

  const handleEdit = (t: Tournament) => {
    setSelectedTournament(t);
    setEditingRecord(t);
    setSelectedFile(null);
    setSelectedBrochure(null);
    setPreviewUrl(t.imageUrl || "");
    setFormData({ 
      ...t, 
      startDate: t.startDate ? new Date(t.startDate).toISOString().split('T')[0] : "",
      endDate: t.endDate ? new Date(t.endDate).toISOString().split('T')[0] : "",
      regStartDate: t.regStartDate ? new Date(t.regStartDate).toISOString().split('T')[0] : "",
      regEndDate: t.regEndDate ? new Date(t.regEndDate).toISOString().split('T')[0] : "",
      posterOrientation: t.posterOrientation || "LANDSCAPE",
      entryFee: t.entryFee || 0
    });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title) errors.title = "Arena title is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.location) errors.location = "Venue is required";
    if (!formData.category) errors.category = "Category is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (['startDate', 'endDate', 'regStartDate', 'regEndDate'].includes(key)) {
          if (formData[key]) data.append(key, new Date(formData[key]).toISOString());
        } else if (key !== 'imageUrl' && key !== 'brochureUrl') {
          data.append(key, String(formData[key]));
        }
      }
    });

    if (selectedFile) data.append("image", selectedFile);
    if (selectedBrochure) data.append("brochure", selectedBrochure);

    try {
      if (selectedTournament?.id) {
        await updateTournament(selectedTournament.id, data);
        success("Tournament updated successfully");
      } else {
        await addTournament(data);
        success("Tournament created successfully");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toastError("Failed to save tournament. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTournament) return;
    setIsDeleting(true);
    try {
      await deleteTournament(selectedTournament.id);
      success("Tournament dismantled successfully");
      setIsConfirmOpen(false);
    } catch (err) {
      toastError("Failed to delete tournament.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: AdminTableColumn[] = [
    {
      key: 'displayTitle',
      label: 'Tournament Arena',
      className: 'min-w-[200px]'
    },
    {
      key: 'category',
      label: 'Division',
      hiddenOn: 'mobile'
    },
    {
      key: 'displayDates',
      label: 'Event Dates',
      hiddenOn: 'tablet'
    },
    {
      key: 'displayRegistrations',
      label: 'Players',
      hiddenOn: 'mobile',
      align: 'right'
    },
    {
      key: 'displayStatus',
      label: 'Status',
      align: 'right'
    }
  ];

  const formatDateRange = (start?: string, end?: string) => {
    if (!start) return "N/A";
    const startStr = format(new Date(start), "MMM d");
    if (!end) return startStr;
    return `${startStr} - ${format(new Date(end), "MMM d")}`;
  };

  const rows = filteredData.map(t => ({
    ...t,
    displayTitle: (
      <div className="flex flex-col">
        <span className="font-bold text-uca-text-primary">{t.title}</span>
        <span className="text-[10px] text-uca-text-muted uppercase tracking-tight">{t.location || "Online"}</span>
      </div>
    ),
    displayDates: (
      <div className="flex items-center gap-2 text-xs font-medium">
        <Calendar className="size-3.5 text-uca-accent-blue" />
        {formatDateRange(t.startDate, t.endDate)}
      </div>
    ),
    displayRegistrations: (
      <div className="flex items-center justify-end gap-1.5 text-uca-accent-blue font-black text-sm">
        <Users className="size-3.5" />
        {t._count?.registrations || 0}
      </div>
    ),
    displayStatus: <StatusBadge status={t.status} />
  }));

  return (
    <AdminShell
      title="Tournament Console"
      subtitle="Manage competitive tournaments and registrations window."
      actionLabel="Add Tournament"
      onAction={handleAdd}
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-uca-bg-surface border border-uca-border p-4 rounded-xl">
          <div className="flex gap-1.5 p-1 bg-uca-bg-base rounded-lg w-full md:w-auto overflow-x-auto scrollbar-none">
            {(["ALL", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"] as TournamentStatus[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                    isActive
                      ? "bg-uca-navy text-white shadow-sm"
                      : "text-uca-text-muted hover:text-uca-text-primary"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-uca-text-muted" />
            <Input
              placeholder="Search arenas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-uca-bg-base border-uca-border text-sm focus:ring-uca-accent-blue rounded-lg"
            />
          </div>
        </div>

        {/* Table Area */}
        <AdminTable
          columns={columns}
          rows={rows}
          isLoading={isLoading}
          onRowClick={(t) => navigate(`/admin/tournaments/${t.id}/portal`)}
          onEdit={(row) => {
            const original = tournaments.find(t => t.id === row.id);
            if (original) handleEdit(original);
          }}
          onDelete={(t) => {
            const original = tournaments.find(item => item.id === t.id);
            setSelectedTournament(original || t);
            setIsConfirmOpen(true);
          }}
          entityName="tournaments"
          onAddFirst={handleAdd}
        />
      </div>

      {/* Form Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingRecord ? "Update Tournament Arena" : "Construct New Arena"}
        footer={
          <>
            <Button
              variant="ghost"
              disabled={isSubmitting}
              onClick={handleClose}
              className="text-uca-text-muted hover:text-uca-text-primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-uca-navy hover:bg-uca-navy-hover text-white font-bold px-8 h-10 gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  {editingRecord ? "Save Changes" : "Create Arena"}
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-6 py-2" key={editingRecord?.id ?? 'new'}>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg gap-2 text-xs h-9 border-uca-border hover:bg-uca-bg-elevated"
              onClick={() => handleViewPreview(selectedTournament || formData)}
            >
              <Eye className="size-3.5" /> Live Preview
            </Button>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Arena Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  setFormData({...formData, title: e.target.value});
                  if (formErrors.title) setFormErrors({...formErrors, title: ""});
                }}
                placeholder="e.g. Grand Master Invitational 2024"
                className={cn(
                  "h-11 bg-uca-bg-elevated border-uca-border rounded-lg transition-all focus:ring-2 focus:ring-uca-navy/30 focus:border-uca-navy outline-none",
                  formErrors.title && "border-uca-accent-red ring-2 ring-red-100"
                )}
              />
              {formErrors.title && <p className="text-[10px] text-uca-accent-red font-bold flex items-center gap-1"><X className="size-3" /> {formErrors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Starts On</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData({...formData, startDate: e.target.value});
                    if (formErrors.startDate) setFormErrors({...formErrors, startDate: ""});
                  }}
                  className={cn(
                    "h-11 bg-uca-bg-elevated border-uca-border rounded-lg focus:ring-2 focus:ring-uca-navy/30 focus:border-uca-navy outline-none",
                    formErrors.startDate && "border-uca-accent-red ring-2 ring-red-100"
                  )}
                />
                {formErrors.startDate && <p className="text-[10px] text-uca-accent-red font-bold flex items-center gap-1"><X className="size-3" /> {formErrors.startDate}</p>}
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Ends On</Label>
                <Input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Reg Starts</Label>
                <Input type="date" value={formData.regStartDate} onChange={(e) => setFormData({...formData, regStartDate: e.target.value})} className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Reg Ends</Label>
                <Input type="date" value={formData.regEndDate} onChange={(e) => setFormData({...formData, regEndDate: e.target.value})} className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Venue</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({...formData, location: e.target.value});
                    if (formErrors.location) setFormErrors({...formErrors, location: ""});
                  }}
                  placeholder="Location"
                  className={cn(
                    "h-11 bg-uca-bg-elevated border-uca-border rounded-lg focus:ring-2 focus:ring-uca-navy/30 focus:border-uca-navy outline-none",
                    formErrors.location && "border-uca-accent-red ring-2 ring-red-100"
                  )}
                />
                {formErrors.location && <p className="text-[10px] text-uca-accent-red font-bold flex items-center gap-1"><X className="size-3" /> {formErrors.location}</p>}
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({...formData, category: e.target.value});
                    if (formErrors.category) setFormErrors({...formErrors, category: ""});
                  }}
                  placeholder="e.g. Open"
                  className={cn(
                    "h-11 bg-uca-bg-elevated border-uca-border rounded-lg focus:ring-2 focus:ring-uca-navy/30 focus:border-uca-navy outline-none",
                    formErrors.category && "border-uca-accent-red ring-2 ring-red-100"
                  )}
                />
                {formErrors.category && <p className="text-[10px] text-uca-accent-red font-bold flex items-center gap-1"><X className="size-3" /> {formErrors.category}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Prize Pool</Label>
                <Input value={formData.totalPrizePool} onChange={(e) => setFormData({...formData, totalPrizePool: e.target.value})} placeholder="₹1,00,000" className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Fee (₹)</Label>
                <Input type="number" value={formData.entryFee} onChange={(e) => setFormData({...formData, entryFee: e.target.value})} className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Description</Label>
              <RichTextEditor
                value={formData.description || ""}
                onChange={(content) => setFormData({...formData, description: content})}
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Rules & Other Info</Label>
              <RichTextEditor
                value={formData.otherDetails || ""}
                onChange={(content) => setFormData({...formData, otherDetails: content})}
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Brochure (PDF)</Label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setSelectedBrochure(e.target.files?.[0] || null)}
                  />
                  <div className={`h-11 px-4 border border-dashed rounded-lg flex items-center gap-2 transition-all ${selectedBrochure ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' : 'border-uca-border bg-uca-bg-elevated text-uca-text-muted'}`}>
                    <Upload className="size-4" />
                    <span className="text-[10px] font-bold truncate uppercase">{selectedBrochure ? selectedBrochure.name : "Upload PDF"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Arena Status</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4 border-t border-uca-border">
              <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Poster Orientation</Label>
              <RadioGroup
                value={formData.posterOrientation}
                onValueChange={(val) => setFormData({...formData, posterOrientation: val})}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 bg-uca-bg-elevated px-4 py-3 rounded-lg border border-uca-border cursor-pointer flex-1">
                  <RadioGroupItem value="LANDSCAPE" id="landscape" />
                  <Label htmlFor="landscape" className="font-bold text-xs cursor-pointer">Landscape</Label>
                </div>
                <div className="flex items-center space-x-2 bg-uca-bg-elevated px-4 py-3 rounded-lg border border-uca-border cursor-pointer flex-1">
                  <RadioGroupItem value="PORTRAIT" id="portrait" />
                  <Label htmlFor="portrait" className="font-bold text-xs cursor-pointer">Portrait</Label>
                </div>
              </RadioGroup>

              <div
                className={cn(
                  "relative rounded-xl border border-dashed flex flex-col items-center justify-center overflow-hidden hover:bg-uca-bg-elevated cursor-pointer transition-all border-uca-border bg-uca-bg-base",
                  formData.posterOrientation === 'PORTRAIT' ? "aspect-[3/4] max-w-[200px] mx-auto" : "aspect-video"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl("");
                        setSelectedFile(null);
                        setFormData({...formData, imageUrl: ""});
                      }}
                      className="absolute top-2 right-2 size-8 bg-uca-accent-red rounded-lg flex items-center justify-center shadow-lg"
                    >
                      <X className="size-4 text-uca-text-primary" />
                    </button>
                  </>
                ) : (
                  <div className="text-center group">
                    <Upload className="size-6 text-uca-accent-blue mx-auto mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted">Upload {formData.posterOrientation}</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
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
              </div>
            </div>
          </div>
        </div>
      </AdminModal>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[95vw] lg:max-w-7xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-uca-bg-base">
          <div className="bg-uca-bg-surface text-uca-text-primary p-6 flex items-center justify-between border-b border-uca-border">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-uca-accent-blue">Arena Preview Mode</p>
              <DialogTitle className="text-xl font-black">User Experience View</DialogTitle>
            </div>
            <Button variant="ghost" onClick={() => setIsPreviewOpen(false)} className="text-uca-text-primary hover:bg-uca-bg-elevated rounded-lg">
              <X className="size-6" />
            </Button>
          </div>

          <div className="p-4 md:p-12 max-h-[85vh] overflow-y-auto scrollbar-thin">
            {previewData && <TournamentPreview tournament={previewData} />}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Dismantle Arena?"
        description="This will permanently remove the tournament and all player registrations from the system. This action cannot be undone."
        confirmLabel="Dismantle"
      />
    </AdminShell>
  );
};

export default AdminTournaments;
