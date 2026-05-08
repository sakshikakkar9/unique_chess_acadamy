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
import { Plus, Trophy, Upload, X, Search, Eye, Calendar, MapPin, FileText, Phone, CreditCard, Info, User, ChevronDown } from "lucide-react";
import { Tournament } from "@/types";
import TournamentTable from "@/features/tournaments/components/admin/TournamentTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminPageHeader from "@/components/shared/admin/AdminPageHeader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RichTextEditor from "@/components/shared/admin/RichTextEditor";
import { cn } from "@/lib/utils";
import PaymentDisplay from "@/components/shared/PaymentDisplay";
import OrientationWrapper from "@/features/tournaments/components/OrientationWrapper";

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

  const handleViewPreview = (t: Tournament) => {
    // If we are currently editing this tournament, use formData for preview
    if (selectedTournament?.id === t.id && isModalOpen) {
      setSelectedTournament({
        ...t,
        ...formData,
        imageUrl: previewUrl || t.imageUrl // Use preview URL if file selected
      });
    } else {
      setSelectedTournament(t);
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
      if (selectedTournament) await updateTournament(selectedTournament.id, data);
      else await addTournament(data);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="space-y-8 p-8 max-w-[1600px] mx-auto">
      <AdminPageHeader
        title="Tournament Console"
        subtitle="Manage competitive events and registrations window."
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
        onRowClick={(t) => navigate(`/admin/tournaments/${t.id}/students`)}
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
                      <Upload className="h-6 w-6 text-[#0284c7]" />
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
        <DialogContent className="max-w-[95vw] lg:max-w-7xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="bg-slate-900 text-white p-6 md:p-8 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0284c7]">Arena Preview Mode</p>
              <DialogTitle className="text-xl md:text-3xl font-black">User Experience View</DialogTitle>
            </div>
            <Button variant="ghost" onClick={() => setIsPreviewOpen(false)} className="text-white hover:bg-white/10 rounded-xl">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-4 md:p-12 bg-slate-50/50 max-h-[85vh] overflow-y-auto">
            {selectedTournament && (
              <OrientationWrapper
                orientation={selectedTournament.posterOrientation}
                poster={
                  <div className={cn(
                    "relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white",
                    selectedTournament.posterOrientation === 'PORTRAIT' ? "aspect-[3/4]" : "aspect-video"
                  )}>
                    <img
                      src={selectedTournament.imageUrl || "/placeholder.jpg"}
                      alt={selectedTournament.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-[#0284c7] text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg">
                        {selectedTournament.category || "Professional"}
                      </span>
                    </div>
                  </div>
                }
                details={
                  <div className="space-y-12">
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <span className="px-4 py-1.5 bg-sky-100 text-[#0284c7] rounded-full text-[10px] font-bold uppercase tracking-[0.15em]">
                          Arena Details
                        </span>
                        <h1 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                          {selectedTournament.title}
                        </h1>
                      </div>

                      {selectedTournament.description && (
                        <div
                          className="text-slate-600 font-medium leading-relaxed text-lg border-l-4 border-[#0284c7]/20 pl-6 ql-editor ql-viewer p-0"
                          dangerouslySetInnerHTML={{ __html: selectedTournament.description }}
                        />
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md">
                          <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
                            <Calendar className="h-7 w-7 text-[#0284c7]" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Schedule</p>
                            <p className="text-base font-bold text-slate-900 tracking-tight">
                              {selectedTournament.startDate ? format(new Date(selectedTournament.startDate), "MMM d, yyyy") : 'TBD'}
                              {selectedTournament.endDate && ` - ${format(new Date(selectedTournament.endDate), "MMM d, yyyy")}`}
                            </p>
                          </div>
                        </div>

                        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md">
                          <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
                            <MapPin className="h-7 w-7 text-[#0284c7]" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Venue</p>
                            <p className="text-base font-bold text-slate-900 tracking-tight">{selectedTournament.location}</p>
                          </div>
                        </div>

                        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md">
                          <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
                            <Trophy className="h-7 w-7 text-[#0284c7]" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Prize Pool</p>
                            <p className="text-base font-bold text-slate-900 tracking-tight">{selectedTournament.totalPrizePool}</p>
                          </div>
                        </div>

                        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md">
                          <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
                            <Trophy className="h-7 w-7 text-[#0284c7]" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Category</p>
                            <p className="text-base font-bold text-slate-900 tracking-tight">{selectedTournament.category}</p>
                          </div>
                        </div>
                      </div>

                      {selectedTournament.otherDetails && (
                        <div className="space-y-4">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] ml-1">Tournament Rules & Info</p>
                          <div
                            className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-base text-slate-600 font-medium leading-relaxed shadow-md border-l-4 border-l-[#0284c7] ql-editor ql-viewer"
                            dangerouslySetInnerHTML={{ __html: selectedTournament.otherDetails }}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {selectedTournament.brochureUrl && (
                          <div className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-lg">
                            <div className="flex items-center gap-5">
                              <div className="h-16 w-16 rounded-2xl bg-sky-50 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-[#0284c7]" />
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-0.5">Brochure</p>
                                <p className="text-lg font-bold text-slate-900">Download PDF</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="p-8 bg-slate-900 rounded-[2.5rem] flex items-center gap-6 text-white shadow-xl overflow-hidden relative">
                          <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                            <Phone className="h-8 w-8 text-sky-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-1">Direct Help</p>
                            <p className="text-xl font-bold tracking-tight">{selectedTournament.contactDetails}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="px-10 py-8 bg-white border border-slate-100 rounded-[3rem] shadow-lg flex items-center justify-between relative overflow-hidden group">
                          <div className="relative">
                            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">Registration Entry Fee</p>
                            <p className="text-5xl font-bold text-[#0284c7] tracking-tighter">₹{selectedTournament.entryFee.toLocaleString()}</p>
                          </div>
                          <div className="relative h-16 w-16 bg-[#0284c7] rounded-2xl flex items-center justify-center shadow-lg">
                            <CreditCard className="h-8 w-8 text-white" />
                          </div>
                        </div>

                        {selectedTournament.discountDetails && (
                          <div className="flex items-start gap-4 p-6 bg-sky-50/50 rounded-[2rem] border border-sky-100/50">
                            <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                              <Info className="h-6 w-6 text-[#0284c7]" />
                            </div>
                            <p className="text-sm font-semibold text-sky-700 leading-relaxed italic uppercase tracking-tight">{selectedTournament.discountDetails}</p>
                          </div>
                        )}

                        <PaymentDisplay />
                      </div>
                    </div>
                  </div>
                }
                form={
                  <div className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
                    <div className="h-3 bg-[#0284c7]" />
                    <div className="p-10 md:p-14">
                      <div className="space-y-10">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                          <User className="h-6 w-6 text-[#0284c7]" />
                          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Static Registration Form</h2>
                        </div>
                        <div className="p-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center space-y-4">
                           <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                             <Trophy className="h-8 w-8 text-[#0284c7]" />
                           </div>
                           <p className="text-slate-500 font-medium">This is a preview of how users will see the registration form. In the live version, this will be a fully interactive enrollment experience.</p>
                        </div>
                        <Button disabled className="w-full h-20 bg-slate-200 text-slate-400 text-xl font-bold rounded-3xl uppercase tracking-wider">
                          COMPLETE REGISTRATION (PREVIEW)
                        </Button>
                      </div>
                    </div>
                  </div>
                }
              />
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
