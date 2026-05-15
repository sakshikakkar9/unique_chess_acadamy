import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Loader2, UserPlus, Shield, Zap, Info, Check, Plus, X } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import AdminModal from "@/components/admin/AdminModal";
import DatePickerField from "../../admin/DatePickerField";
import { cn } from "@/lib/utils";

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
      title={editingRecord ? "Update Student Profile" : "Create Student Profile"}
      footer={
        <>
          <Button variant="ghost" disabled={loading} onClick={() => onOpenChange(false)} className="text-uca-text-muted hover:text-uca-text-primary">Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-uca-navy hover:bg-uca-navy-hover text-white font-bold px-8 h-10 gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="size-4" />
                {editingRecord ? "Save Changes" : "Create Student"}
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-6 py-2" key={editingRecord?.id ?? 'new'}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Full Name</Label>
            <Input
              required
              className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"
              value={form.fullName}
              onChange={e => update("fullName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Phone Number</Label>
            <Input
              required
              className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"
              value={form.phone}
              onChange={e => update("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Email Address</Label>
            <Input
              type="email"
              className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"
              value={form.email}
              onChange={e => update("email", e.target.value)}
            />
          </div>
          <DatePickerField
            label="Date of Birth"
            value={form.dob}
            onChange={val => update("dob", val)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Gender</Label>
            <Select value={form.gender} onValueChange={v => update("gender", v)}>
              <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Discovery Source</Label>
            <Select value={form.discoverySource} onValueChange={v => update("discoverySource", v)}>
              <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                <SelectItem value="Social Media">Social Media</SelectItem>
                <SelectItem value="Google Search">Google Search</SelectItem>
                <SelectItem value="Word of Mouth">Word of Mouth</SelectItem>
                <SelectItem value="Through Coach">Through Coach</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Residential Address</Label>
          <Textarea
            className="bg-uca-bg-elevated border-uca-border rounded-lg min-h-[80px] resize-none"
            value={form.address}
            onChange={e => update("address", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">FIDE ID</Label>
            <Input
              className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"
              value={form.fideId}
              onChange={e => update("fideId", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">FIDE Rating</Label>
            <Input
              type="number"
              className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"
              value={form.fideRating}
              onChange={e => update("fideRating", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Club Affiliation</Label>
            <Input
              className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"
              value={form.clubAffiliation}
              onChange={e => update("clubAffiliation", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Experience Level</Label>
            <Select value={form.experienceLevel} onValueChange={v => update("experienceLevel", v)}>
              <SelectTrigger className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-uca-bg-surface border-uca-border text-uca-text-primary shadow-lg">
                <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                <SelectItem value="INTERMEDIATE">INTERMEDIATE</SelectItem>
                <SelectItem value="ADVANCED">ADVANCED</SelectItem>
                <SelectItem value="PROFESSIONAL">PROFESSIONAL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-uca-text-muted tracking-widest">Preferred Batch</Label>
            <Input
              className="h-11 bg-uca-bg-elevated border-uca-border rounded-lg"
              value={form.preferredBatch}
              onChange={e => update("preferredBatch", e.target.value)}
              placeholder="e.g. Mon/Wed 5PM"
            />
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
