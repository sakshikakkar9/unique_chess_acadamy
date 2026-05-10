import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import AdminFormModal from "@/components/shared/admin/AdminFormModal";
import ConfirmDialog from "@/components/shared/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trophy, Upload, X, Search, Eye, Calendar, MapPin, FileText, Phone, CreditCard, Info, User, ChevronDown } from "lucide-react";
import { Tournament } from "@/types";
import TournamentTable from "@/features/tournaments/components/admin/TournamentTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminPageHeader from "@/components/shared/admin/AdminPageHeader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RichTextEditor from "@/components/shared/admin/RichTextEditor";
import { cn } from "@/lib/utils";
import TournamentPreview from "@/features/tournaments/components/admin/TournamentPreview";

type TournamentStatus = "ALL" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

const AdminTournaments: React.FC = () => {
  const navigate = useNavigate();
  const { tournaments, isLoading, addTournament, updateTournament, deleteTournament } = useAdminTournaments();

  const [activeTab, setActiveTab] = useState<TournamentStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<Tournament | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBrochure, setSelectedBrochure] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleViewPreview = (t: any) => {
    // If we are currently in the modal, use formData for preview
    if (isModalOpen) {
      setPreviewData({
        ...t,
        ...formData,
        imageUrl: previewUrl || t.imageUrl // Use preview URL if file selected
      });
    } else {
      setPreviewData(t);
    }
    setIsPreviewOpen(true);
  };

  const handleEdit = (t: Tournament) => {
    setSelectedTournament(t);
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

  const handleSave = async () => {
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

    if (selectedFile) {
      data.append("image", selectedFile);
    }
    if (selectedBrochure) {
      data.append("brochure", selectedBrochure);
    }

    try {
      if (selectedTournament?.id) await updateTournament(selectedTournament.id, data);
      else await addTournament(data);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      <AdminPageHeader
        title="Tournament Console"
        subtitle="Manage competitive tournaments and registrations window."
        action={
          <Button onClick={handleAdd} className="shadow-lg bg-[#0284c7] hover:bg-[#0284c7]/90 text-white font-bold rounded-full px-6 h-11">
            <Plus className="mr-2 h-4 w-4" /> Add Tournament
          </Button>
        }
      />

      <div
        className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white"
        style={{
          border: '1px solid #e0eeff',
          padding: '14px 18px',
          borderRadius: '14px'
        }}
      >
        {/* Tabs */}
        <div className="flex gap-2">
          {(["ALL", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"] as TournamentStatus[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  backgroundColor: isActive ? '#0284c7' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  transition: 'all 150ms'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#e0f2fe';
                    e.currentTarget.style.color = '#0284c7';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#64748b';
                  }
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
          <Input
            placeholder="Search tournaments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Table Section */}
      <TournamentTable
        data={filteredData}
        isLoading={isLoading}
        onRowClick={(t) => navigate(`/admin/tournaments/${t.id}/portal`)}
        onViewPreview={handleViewPreview}
        onEdit={handleEdit}
        onDelete={(t) => { setSelectedTournament(t); setIsConfirmOpen(true); }}
      />

      {/* Form Modal */}
      <AdminFormModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        title={selectedTournament ? "Update Tournament Arena" : "Construct New Arena"}
        onSave={handleSave}
      >
        <div className="flex flex-col gap-6 py-4 px-1 overflow-y-auto max-h-[70vh] scrollbar-thin pr-3">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl gap-2"
              onClick={() => handleViewPreview(selectedTournament || formData)}
            >
              <Eye className="h-4 w-4" /> Live Preview
            </Button>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-xs font-black uppercase text-slate-400 tracking-widest">Arena Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Grand Master Invitational 2024" className="h-12 rounded-xl" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate" className="text-xs font-black uppercase text-slate-400 tracking-widest">Starts On</Label>
                <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="h-12 rounded-xl border-orange-100" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate" className="text-xs font-black uppercase text-slate-400 tracking-widest">Ends On</Label>
                <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="h-12 rounded-xl border-orange-100" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="regStartDate" className="text-xs font-black uppercase text-slate-400 tracking-widest">Enrollment Starts</Label>
                <Input id="regStartDate" type="date" value={formData.regStartDate} onChange={(e) => setFormData({...formData, regStartDate: e.target.value})} className="h-12 rounded-xl border-blue-100" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="regEndDate" className="text-xs font-black uppercase text-slate-400 tracking-widest">Enrollment Ends</Label>
                <Input id="regEndDate" type="date" value={formData.regEndDate} onChange={(e) => setFormData({...formData, regEndDate: e.target.value})} className="h-12 rounded-xl border-blue-100" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location" className="text-xs font-black uppercase text-slate-400 tracking-widest">Venue</Label>
                <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Location name" className="h-12 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-xs font-black uppercase text-slate-400 tracking-widest">Division/Category</Label>
                <Input id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Open / Under-19" className="h-12 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prize" className="text-xs font-black uppercase text-slate-400 tracking-widest">Total Prize Pool</Label>
                <Input id="prize" value={formData.totalPrizePool} onChange={(e) => setFormData({...formData, totalPrizePool: e.target.value})} placeholder="e.g. ₹1,00,000" className="h-12 rounded-xl border-amber-100" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fee" className="text-xs font-black uppercase text-slate-400 tracking-widest">Entry Fee (₹)</Label>
                <Input id="fee" type="number" value={formData.entryFee} onChange={(e) => setFormData({...formData, entryFee: e.target.value})} className="h-12 rounded-xl" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Mission Brief (Description)</Label>
              <RichTextEditor
                value={formData.description || ""}
                onChange={(content) => setFormData({...formData, description: content})}
                placeholder="Describe the tournament mission and goals..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discount" className="text-xs font-black uppercase text-slate-400 tracking-widest">Discount Information</Label>
              <Textarea id="discount" value={formData.discountDetails} onChange={(e) => setFormData({...formData, discountDetails: e.target.value})} placeholder="Enter early bird or other discount details..." className="rounded-xl min-h-[80px] text-sm" />
            </div>

            <div className="grid gap-2">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Other Details (Rules & Info)</Label>
              <RichTextEditor
                value={formData.otherDetails || ""}
                onChange={(content) => setFormData({...formData, otherDetails: content})}
                placeholder="Additional tournament rules or information..."
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Tournament Brochure (PDF)</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setSelectedBrochure(e.target.files?.[0] || null)}
                  />
                  <div className={`h-12 px-4 border-2 border-dashed rounded-xl flex items-center gap-2 transition-all ${selectedBrochure ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                    <Upload className="h-4 w-4" />
                    <span className="text-xs font-bold truncate">{selectedBrochure ? selectedBrochure.name : (formData.brochureUrl ? "Change Brochure" : "Upload Brochure")}</span>
                  </div>
                </div>
                {formData.brochureUrl && !selectedBrochure && (
                   <a href={formData.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-bold">View Current</a>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactDetails" className="text-xs font-black uppercase text-slate-400 tracking-widest">Contact Details</Label>
              <Input id="contactDetails" value={formData.contactDetails} onChange={(e) => setFormData({...formData, contactDetails: e.target.value})} placeholder="Email or Phone for queries" className="h-12 rounded-xl" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status" className="text-xs font-black uppercase text-slate-400 tracking-widest">Arena Status</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                <SelectTrigger className="h-12 rounded-xl">
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

            <div className="space-y-4 pt-4 border-t">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Poster & Orientation</Label>

              <RadioGroup
                value={formData.posterOrientation}
                onValueChange={(val) => setFormData({...formData, posterOrientation: val})}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 cursor-pointer flex-1">
                  <RadioGroupItem value="LANDSCAPE" id="landscape" />
                  <Label htmlFor="landscape" className="font-bold text-sm cursor-pointer">Landscape</Label>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 cursor-pointer flex-1">
                  <RadioGroupItem value="PORTRAIT" id="portrait" />
                  <Label htmlFor="portrait" className="font-bold text-sm cursor-pointer">Portrait</Label>
                </div>
              </RadioGroup>

              <div
                className={cn(
                  "relative rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden hover:bg-slate-50 cursor-pointer transition-all border-slate-200 bg-slate-50/50",
                  formData.posterOrientation === 'PORTRAIT' ? "aspect-[3/4] max-w-[240px] mx-auto" : "aspect-video"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} className="w-full h-full object-cover" />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-7 w-7 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl("");
                        setSelectedFile(null);
                        setFormData({...formData, imageUrl: ""});
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center group">
                    <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto">
                      <Upload className="h-6 w-6 text-sky-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload Poster ({formData.posterOrientation})</span>
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
      </AdminFormModal>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[95vw] lg:max-w-7xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="bg-slate-900 text-white p-6 md:p-4 md:p-8 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0284c7]">Arena Preview Mode</p>
              <DialogTitle className="text-xl md:text-3xl font-black">User Experience View</DialogTitle>
            </div>
            <Button variant="ghost" onClick={() => setIsPreviewOpen(false)} className="text-white hover:bg-white/10 rounded-xl">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-4 md:p-12 bg-slate-50/50 max-h-[85vh] overflow-y-auto">
            {previewData && (
              <TournamentPreview tournament={previewData} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={setIsConfirmOpen} 
        onConfirm={async () => { if(selectedTournament) await deleteTournament(selectedTournament.id); setIsConfirmOpen(false); }}
        title="Dismantle Arena?"
        description="This will permanently remove the tournament and all player registrations from the system. This action cannot be undone."
      />
    </div>
  );
};

export default AdminTournaments;
