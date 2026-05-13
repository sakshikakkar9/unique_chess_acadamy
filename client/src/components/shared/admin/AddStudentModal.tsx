import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
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
  }, [editingRecord]);

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
    } catch (err: any) {
      toastError(err.response?.data?.error || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl
        fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
        max-h-[90vh] overflow-y-auto
        rounded-t-[2.5rem] sm:rounded-[2.5rem] transition-all duration-300">
        <div className="bg-slate-900 p-8 text-white w-full">
          <DialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-sky-500/20 flex items-center justify-center mb-4 border border-sky-500/20">
              <UserPlus className="h-6 w-6 text-sky-400" />
            </div>
            <DialogTitle className="text-3xl font-black tracking-tight text-white uppercase">
              {editingRecord ? "Update Student" : "Initialize Student"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
              {editingRecord ? "Update the student profile information." : "Create a centralized profile for manual academy onboarding."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-10 max-h-[70vh] overflow-y-auto bg-white" key={editingRecord?.id ?? 'new'}>
          {/* Personal Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
              <Info className="h-5 w-5 text-sky-600" />
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-widest">Personal Intelligence</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name *</Label>
                <Input
                  required
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5"
                  value={form.fullName}
                  onChange={e => update("fullName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number *</Label>
                <Input
                  required
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5"
                  value={form.phone}
                  onChange={e => update("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                <Input
                  type="email"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date of Birth *</Label>
                <Input
                  required
                  type="date"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5"
                  value={form.dob}
                  onChange={e => update("dob", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gender</Label>
                <Select value={form.gender} onValueChange={v => update("gender", v)}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl font-bold">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Discovery Source</Label>
                <Select value={form.discoverySource} onValueChange={v => update("discoverySource", v)}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5 text-left">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl font-bold">
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Google Search">Google Search</SelectItem>
                    <SelectItem value="Word of Mouth">Word of Mouth</SelectItem>
                    <SelectItem value="Through Coach">Through Coach</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Residential Address</Label>
                <Textarea
                  className="rounded-2xl border-slate-100 bg-slate-50/50 font-bold p-5 min-h-[100px] resize-none"
                  value={form.address}
                  onChange={e => update("address", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Chess Profile */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
              <Shield className="h-5 w-5 text-sky-600" />
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-widest">Chess & FIDE Profile</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">FIDE ID</Label>
                <Input
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5"
                  value={form.fideId}
                  onChange={e => update("fideId", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">FIDE Rating</Label>
                <Input
                  type="number"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5"
                  value={form.fideRating}
                  onChange={e => update("fideRating", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Club Affiliation</Label>
                <Input
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5"
                  value={form.clubAffiliation}
                  onChange={e => update("clubAffiliation", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Academic Profile */}
          <section className="space-y-6 pb-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
              <Zap className="h-5 w-5 text-sky-600" />
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-widest">Academy Intelligence</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Experience Level</Label>
                <Select value={form.experienceLevel} onValueChange={v => update("experienceLevel", v)}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl font-bold">
                    <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                    <SelectItem value="INTERMEDIATE">INTERMEDIATE</SelectItem>
                    <SelectItem value="ADVANCED">ADVANCED</SelectItem>
                    <SelectItem value="PROFESSIONAL">PROFESSIONAL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Preferred Batch</Label>
                <Input
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5"
                  value={form.preferredBatch}
                  onChange={e => update("preferredBatch", e.target.value)}
                  placeholder="e.g. Mon/Wed 5PM"
                />
              </div>
            </div>
          </section>

          <DialogFooter className="pt-8 border-t border-slate-50 flex flex-col-reverse sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-14 w-full sm:w-auto rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-full sm:w-auto rounded-2xl px-10 bg-sky-600 hover:bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-sky-600/20 transition-all gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  {editingRecord ? "Update Record" : "Create Record"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
