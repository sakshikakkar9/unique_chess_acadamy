import React, { useState, useMemo } from "react";
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
import { Plus, Trophy, Upload, X, Search, Eye } from "lucide-react";
import { Tournament } from "@/types";
import TournamentTable from "@/features/tournaments/components/admin/TournamentTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type TournamentStatus = "ALL" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

const AdminTournaments: React.FC = () => {
  const navigate = useNavigate();
  const { tournaments, isLoading, addTournament, updateTournament, deleteTournament } = useAdminTournaments();

  const [activeTab, setActiveTab] = useState<TournamentStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBrochure, setSelectedBrochure] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [formData, setFormData] = useState<any>({
    title: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
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
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
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

  const handleEdit = (t: Tournament) => {
    setSelectedTournament(t);
    setSelectedFile(null);
    setSelectedBrochure(null);
    setPreviewUrl(t.imageUrl || "");
    setFormData({ 
      ...t, 
      startDate: t.startDate ? new Date(t.startDate).toISOString().split('T')[0] : "",
      endDate: t.endDate ? new Date(t.endDate).toISOString().split('T')[0] : "",
      posterOrientation: t.posterOrientation || "LANDSCAPE",
      entryFee: t.entryFee || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (key === 'startDate' || key === 'endDate') {
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
      if (selectedTournament) await updateTournament(selectedTournament.id, data);
      else await addTournament(data);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="space-y-6 p-2 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2 text-slate-900">
            <Trophy className="h-8 w-8 text-amber-500" /> Tournament Console
          </h1>
          <p className="text-sm text-slate-500 font-medium italic">Manage competitive events and registrations window.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 rounded-xl"
            />
          </div>
          <Button onClick={handleAdd} className="w-full sm:w-auto font-bold h-11 gap-2 bg-slate-900 hover:bg-orange-600 rounded-xl transition-all">
            <Plus className="h-5 w-5" /> Add Tournament
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(["ALL", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"] as TournamentStatus[]).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-6 font-bold h-10 ${activeTab === tab ? "bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20" : "text-slate-500 hover:text-orange-600"}`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Table Section */}
      <TournamentTable
        data={filteredData}
        isLoading={isLoading}
        onRowClick={(t) => navigate(`/admin/tournaments/${t.id}/students`)}
        onViewPreview={(t) => { setSelectedTournament(t); setIsPreviewOpen(true); }}
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
              <Label htmlFor="discount" className="text-xs font-black uppercase text-slate-400 tracking-widest">Discount Information</Label>
              <Textarea id="discount" value={formData.discountDetails} onChange={(e) => setFormData({...formData, discountDetails: e.target.value})} placeholder="Enter early bird or other discount details..." className="rounded-xl min-h-[80px] text-sm" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="otherDetails" className="text-xs font-black uppercase text-slate-400 tracking-widest">Other Details</Label>
              <Textarea id="otherDetails" value={formData.otherDetails} onChange={(e) => setFormData({...formData, otherDetails: e.target.value})} placeholder="Additional tournament rules or information..." className="rounded-xl min-h-[100px]" />
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
              <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Poster & Orientation</Label>

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

              <div className="border-2 border-dashed border-slate-200 rounded-[1.5rem] p-4 text-center hover:bg-slate-50 transition-colors min-h-[160px] flex items-center justify-center bg-slate-50/50">
                {previewUrl ? (
                  <div className={`relative w-full rounded-xl overflow-hidden shadow-md ${formData.posterOrientation === 'PORTRAIT' ? 'aspect-[3/4] max-w-[200px]' : 'aspect-video'}`}>
                    <img src={previewUrl} alt="Banner" className="w-full h-full object-cover" />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-7 w-7 rounded-lg"
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
                  <label className="cursor-pointer flex flex-col items-center py-6 w-full group">
                    <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-orange-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload Poster ({formData.posterOrientation})</span>
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
          </div>
        </div>
      </AdminFormModal>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="bg-slate-900 text-white p-8">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Arena Preview</p>
                  <DialogTitle className="text-3xl font-black">{selectedTournament?.title}</DialogTitle>
                </div>
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </DialogHeader>
          </div>
          <div className="p-8 bg-white grid lg:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
             <div className="space-y-6">
                <div className="aspect-video rounded-3xl overflow-hidden border-4 border-slate-50 shadow-lg">
                  <img src={selectedTournament?.imageUrl} className="w-full h-full object-cover" alt="Tournament" />
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">Arena Intel</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Division</span>
                      <span className="font-bold text-slate-900">{selectedTournament?.category || 'Professional'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Prize Pool</span>
                      <span className="font-bold text-amber-600">{selectedTournament?.totalPrizePool || 'TBD'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Entry Fee</span>
                      <span className="font-bold text-blue-600">₹{selectedTournament?.entryFee}</span>
                    </div>
                  </div>
                </div>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <h4 className="font-black text-slate-900 uppercase tracking-tight">Mission Brief</h4>
                   <p className="text-slate-600 text-sm leading-relaxed">{selectedTournament?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Registration</p>
                      <p className="text-xs font-bold">{selectedTournament?.regStartDate ? format(new Date(selectedTournament.regStartDate), "MMM d") : 'TBD'} - {selectedTournament?.regEndDate ? format(new Date(selectedTournament.regEndDate), "MMM d") : 'TBD'}</p>
                   </div>
                   <div className="p-4 border border-orange-100 rounded-2xl bg-orange-50/30">
                      <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Event Dates</p>
                      <p className="text-xs font-bold">{selectedTournament?.startDate ? format(new Date(selectedTournament.startDate), "MMM d") : 'TBD'} - {selectedTournament?.endDate ? format(new Date(selectedTournament.endDate), "MMM d") : 'TBD'}</p>
                   </div>
                </div>
                <Button onClick={() => setIsPreviewOpen(false)} className="w-full h-14 bg-slate-900 hover:bg-orange-600 text-white font-black rounded-2xl transition-all">CLOSE PREVIEW</Button>
             </div>
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
