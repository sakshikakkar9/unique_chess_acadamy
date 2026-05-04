import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Course } from "@/types";
import { courseService } from "@/services/courseService";
import { CheckCircle, Loader2, Upload } from "lucide-react";

interface CourseEnrollModalProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  studentName: string;
  gender: string;
  category: string;
  dob: string;
  email: string;
  phone: string;
  fideId: string;
  fideRating: string;
  address: string;
  discoverySource: string;
  experienceLevel: string;
  transactionId: string;
}

const EMPTY: FormState = {
  studentName: "",
  gender: "Male",
  category: "",
  dob: "",
  email: "",
  phone: "",
  fideId: "NA",
  fideRating: "0",
  address: "",
  discoverySource: "Social Media",
  experienceLevel: "BEGINNER",
  transactionId: "",
};

export default function CourseEnrollModal({ course, open, onOpenChange }: CourseEnrollModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // File states
  const [ageProof, setAgeProof] = useState<File | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = (val: boolean) => {
    if (!val) {
      setForm(EMPTY);
      setAgeProof(null);
      setPaymentProof(null);
      setSuccess(false);
    }
    onOpenChange(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    // Validation for files
    if (!ageProof || !paymentProof) {
      toast({ variant: "destructive", title: "Missing Files", description: "Please upload both Age Proof and Payment Proof." });
      return;
    }

    setLoading(true);
    try {
      // Logic Update: Passing course.mode directly to the service 
      // instead of using a value from the form state.
      await courseService.enroll(course.id, {
        ...form,
        mode: course.mode as "ONLINE" | "OFFLINE", 
        ageProof, 
        paymentProof,
        fideRating: parseInt(form.fideRating) || 0
      });

      setSuccess(true);
      toast({ title: "Enrollment submitted!", description: "We'll reach out to confirm your spot." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to submit. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Enroll in {course.title}</DialogTitle>
          <DialogDescription>
            Registration for <strong>{course.mode}</strong> session. Please provide accurate details.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
            <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="font-semibold text-lg">Application Submitted Successfully!</p>
            <Button onClick={() => handleClose(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            
            {/* Personal Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={form.studentName} onChange={(e) => set("studentName", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                        value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* DOB & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Category (Optional)</Label>
                <Input placeholder="e.g. Under-15" value={form.category} onChange={(e) => set("category", e.target.value)} />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Email (Optional)</Label>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
            </div>

            {/* FIDE Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
              <div className="space-y-2">
                <Label>FIDE ID</Label>
                <Input value={form.fideId} onChange={(e) => set("fideId", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>FIDE Rating</Label>
                <Input type="number" value={form.fideRating} onChange={(e) => set("fideRating", e.target.value)} />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Full Address *</Label>
              <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} required />
            </div>

            {/* Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">Age Proof * <Upload className="h-3 w-3"/></Label>
                <Input type="file" onChange={(e) => setAgeProof(e.target.files?.[0] || null)} required className="cursor-pointer" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">Payment Proof * <Upload className="h-3 w-3"/></Label>
                <Input type="file" onChange={(e) => setPaymentProof(e.target.files?.[0] || null)} required className="cursor-pointer" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Skill Level *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.experienceLevel}
                  onChange={(e) => set("experienceLevel", e.target.value)}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="GRANDMASTER">Expert</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Transaction ID *</Label>
                <Input
                  value={form.transactionId}
                  onChange={(e) => set("transactionId", e.target.value)}
                  required
                  placeholder="UPI Reference No."
                />
              </div>
            </div>

            {/* Discovery Row */}
            <div className="space-y-2">
              <Label>How did you find us?</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.discoverySource} onChange={(e) => set("discoverySource", e.target.value)}>
                <option>Social Media</option>
                <option>Through Coach</option>
                <option>Academy Event</option>
                <option>Google Search</option>
                <option>Friend/Word of Mouth</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
              <Button type="submit" disabled={loading} className="min-w-[150px]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Enrollment"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
