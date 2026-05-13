import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Loader2, UserPlus, Shield, Zap, Info, Check } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import AdminModal from "@/components/admin/AdminModal";

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editingRecord?: any;
}

export default function AddStudentModal({ open, onOpenChange, onSuccess, editingRecord }: AddStudentModalProps) {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: editingRecord?.fullName || "",
    email: editingRecord?.email || "",
    phone: editingRecord?.phone || "",
    gender: editingRecord?.gender || "Male",
    dob: editingRecord?.dob ? new Date(editingRecord.dob).toISOString().split('T')[0] : "",
    address: editingRecord?.address || "",
    fideId: editingRecord?.fideId || "NA",
    fideRating: editingRecord?.fideRating?.toString() || "0",
    clubAffiliation: editingRecord?.clubAffiliation || "",
    experienceLevel: editingRecord?.experienceLevel || "BEGINNER",
    preferredBatch: editingRecord?.preferredBatch || "",
    discoverySource: editingRecord?.discoverySource || "Social Media"
  });

  // Keep state in sync if editingRecord changes (though key prop handles it too)
  React.useEffect(() => {
    if (editingRecord) {
      setForm({
        fullName: editingRecord.fullName || "",
        email: editingRecord.email || "",
        phone: editingRecord.phone || "",
        gender: editingRecord.gender || "Male",
        dob: editingRecord.dob ? new Date(editingRecord.dob).toISOString().split('T')[0] : "",
        address: editingRecord.address || "",
        fideId: editingRecord.fideId || "NA",
        fideRating: editingRecord.fideRating?.toString() || "0",
        clubAffiliation: editingRecord.clubAffiliation || "",
        experienceLevel: editingRecord.experienceLevel || "BEGINNER",
        preferredBatch: editingRecord.preferredBatch || "",
        discoverySource: editingRecord.discoverySource || "Social Media"
      });
    } else {
      setForm({
        fullName: "",
        email: "",
        phone: "",
        gender: "Male",
        dob: "",
        address: "",
        fideId: "NA",
        fideRating: "0",
        clubAffiliation: "",
        experienceLevel: "BEGINNER",
        preferredBatch: "",
        discoverySource: "Social Media"
      });
    }
  }, [editingRecord, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingRecord) {
        await api.patch(`/students/${editingRecord.id}`, form);
        success("Student updated successfully");
      } else {
        await api.post("/students", form);
        success("Student added successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toastError(err.response?.data?.error || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <AdminModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={editingRecord ? "Update Student Profile" : "Initialize Student Profile"}
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 px-8 font-bold uppercase text-[10px] tracking-widest text-uca-text-muted hover:text-uca-text-primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="h-11 px-10 bg-uca-accent-blue hover:bg-uca-sidebar-bg text-white font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20 transition-all gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving Intelligence...
              </>
            ) : (
              <>
                <Check className="size-3.5" />
                {editingRecord ? "Sync Changes" : "Create Profile"}
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-10" key={editingRecord?.id ?? 'new'}>
        {/* Banner Section */}
        <div className="bg-uca-sidebar-bg -mx-6 -mt-5 p-8 text-white mb-6">
          <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 border border-white/10">
            <UserPlus className="h-6 w-6 text-uca-accent-blue" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase leading-tight">
            {editingRecord ? "Modify Records" : "Academy Intake"}
          </h2>
          <p className="text-white/50 font-bold uppercase text-[9px] tracking-widest mt-2 max-w-xs">
            {editingRecord ? "Synchronizing student intelligence with central directory." : "Initializing decentralized student profile for academy boarding."}
          </p>
        </div>

        {/* Personal Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-uca-border">
            <Info className="h-5 w-5 text-uca-accent-blue" />
            <h3 className="text-xs font-black uppercase text-uca-text-primary tracking-widest">Personal Intelligence</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">Full Name *</Label>
              <Input
                required
                className="h-12 rounded-xl border-uca-border bg-uca-bg-base font-bold px-4 focus:ring-uca-accent-blue"
                value={form.fullName}
                onChange={e => update("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">Phone Number *</Label>
              <Input
                required
                className="h-12 rounded-xl border-uca-border bg-uca-bg-base font-bold px-4 focus:ring-uca-accent-blue"
                value={form.phone}
                onChange={e => update("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">Email Address</Label>
              <Input
                type="email"
                className="h-12 rounded-xl border-uca-border bg-uca-bg-base font-bold px-4 focus:ring-uca-accent-blue"
                value={form.email}
                onChange={e => update("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">Date of Birth *</Label>
              <Input
                required
                type="date"
                className="h-12 rounded-xl border-uca-border bg-uca-bg-base font-bold px-4 focus:ring-uca-accent-blue"
                value={form.dob}
                onChange={e => update("dob", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">Gender</Label>
              <Select value={form.gender} onValueChange={v => update("gender", v)}>
                <SelectTrigger className="h-12 rounded-xl border-uca-border bg-uca-bg-base font-bold px-4 focus:ring-uca-accent-blue">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-bold bg-uca-bg-surface border-uca-border">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">Discovery Source</Label>
              <Select value={form.discoverySource} onValueChange={v => update("discoverySource", v)}>
                <SelectTrigger className="h-12 rounded-xl border-uca-border bg-uca-bg-base font-bold px-4 text-left focus:ring-uca-accent-blue">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-bold bg-uca-bg-surface border-uca-border">
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Google Search">Google Search</SelectItem>
                  <SelectItem value="Word of Mouth">Word of Mouth</SelectItem>
                  <SelectItem value="Through Coach">Through Coach</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">Residential Address</Label>
              <Textarea
                className="rounded-xl border-uca-border bg-uca-bg-base font-bold p-4 min-h-[80px] resize-none focus:ring-uca-accent-blue"
                value={form.address}
                onChange={e => update("address", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Chess Profile */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-uca-border">
            <Shield className="h-5 w-5 text-uca-accent-blue" />
            <h3 className="text-xs font-black uppercase text-uca-text-primary tracking-widest">Chess & FIDE Profile</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">FIDE ID</Label>
              <Input
                className="h-12 rounded-xl border-uca-border bg-uca-bg-base font-bold px-4 focus:ring-uca-accent-blue"
                value={form.fideId}
                onChange={e => update("fideId", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">FIDE Rating</Label>
              <Input
                type="number"
                className="h-12 rounded-xl border-uca-border bg-uca-bg-base font-bold px-4 focus:ring-uca-accent-blue"
                value={form.fideRating}
                onChange={e => update("fideRating", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">Club Affiliation</Label>
              <Input
                className="h-12 rounded-xl border-uca-border bg-uca-bg-base font-bold px-4 focus:ring-uca-accent-blue"
                value={form.clubAffiliation}
                onChange={e => update("clubAffiliation", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Academic Profile */}
        <section className="space-y-6 pb-6">
          <div className="flex items-center gap-3 pb-3 border-b border-uca-border">
            <Zap className="h-5 w-5 text-uca-accent-blue" />
            <h3 className="text-xs font-black uppercase text-uca-text-primary tracking-widest">Academy Intelligence</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">Experience Level</Label>
              <Select value={form.experienceLevel} onValueChange={v => update("experienceLevel", v)}>
                <SelectTrigger className="h-12 rounded-xl border-uca-border bg-uca-bg-base font-bold px-4 focus:ring-uca-accent-blue">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-bold bg-uca-bg-surface border-uca-border">
                  <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                  <SelectItem value="INTERMEDIATE">INTERMEDIATE</SelectItem>
                  <SelectItem value="ADVANCED">ADVANCED</SelectItem>
                  <SelectItem value="PROFESSIONAL">PROFESSIONAL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-uca-text-muted ml-1">Preferred Batch</Label>
              <Input
                className="h-12 rounded-xl border-uca-border bg-uca-bg-base font-bold px-4 focus:ring-uca-accent-blue"
                value={form.preferredBatch}
                onChange={e => update("preferredBatch", e.target.value)}
                placeholder="e.g. Mon/Wed 5PM"
              />
            </div>
          </div>
        </section>
      </div>
    </AdminModal>
  );
}
