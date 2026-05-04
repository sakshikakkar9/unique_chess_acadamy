import { useState, useMemo } from "react";
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
import { CheckCircle, Loader2, Upload, Info, QrCode, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_COURSE_IMAGE = "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=1000&auto=format&fit=crop";

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
  experienceLevel: "Beginner",
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

  // Real-time validation
  const isFormValid = useMemo(() => {
    return (
      form.studentName.trim().length > 2 &&
      form.phone.trim().length >= 10 &&
      form.experienceLevel.trim() !== "" &&
      form.transactionId.trim().length >= 5 &&
      form.dob !== "" &&
      form.address.trim().length > 5 &&
      !!ageProof &&
      !!paymentProof
    );
  }, [form, ageProof, paymentProof]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    if (!isFormValid) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill all required fields and upload proofs correctly."
      });
      return;
    }

    setLoading(true);
    try {
      await courseService.enroll(course.id, {
        ...form,
        mode: course.mode,
        ageProof, 
        paymentProof,
        fideRating: parseInt(form.fideRating) || 0
      });

      setSuccess(true);
      toast({ title: "Enrollment submitted!", description: "We'll reach out to confirm your spot." });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || "Failed to submit. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl bg-white p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
        {success ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 gap-6 text-center">
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h2>
              <p className="text-slate-500 max-w-sm mx-auto">
                Thank you for choosing Unique Chess Academy. Our team will verify your payment and contact you within 24-48 hours.
              </p>
            </div>
            <Button onClick={() => handleClose(false)} className="bg-slate-900 hover:bg-slate-800 text-white px-8 rounded-xl font-bold">
              Done
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full max-h-[95vh]">
            
            {/* Left Column: Course Branding & Info */}
            <div className="w-full lg:w-[40%] bg-slate-50 border-r border-slate-100 flex flex-col overflow-y-auto">
              <div className="relative h-48 lg:h-56 w-full flex-shrink-0">
                <img
                  src={course.bannerUrl || DEFAULT_COURSE_IMAGE}
                  alt={course.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase mb-2 inline-block">
                    {course.mode}
                  </span>
                  <h2 className="text-xl lg:text-2xl font-black text-white leading-tight">
                    {course.title}
                  </h2>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info className="h-3 w-3 text-blue-500" /> Program Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Fee</p>
                      <p className="text-lg font-black text-slate-900">₹{course.fee.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Level</p>
                      <p className="text-lg font-black text-slate-900 capitalize">{course.level.toLowerCase()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <QrCode className="h-3 w-3 text-blue-500" /> Secure Payment
                  </h4>
                  <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                    {course.scannerUrl ? (
                      <div className="space-y-4">
                        <img
                          src={course.scannerUrl}
                          alt="Payment QR"
                          className="w-40 h-40 mx-auto object-contain bg-slate-50 p-2 rounded-xl"
                        />
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Scan the QR code to complete the payment. <br/>
                          <strong>Amount: ₹{course.fee.toLocaleString()}</strong>
                        </p>
                      </div>
                    ) : (
                      <div className="py-8">
                        <CreditCard className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 italic">No QR scanner uploaded. Please contact {course.contactDetails} for payment.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <p className="text-[11px] text-blue-700 font-medium">
                      Your enrollment is secure. We verify every transaction ID against our bank records before confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Registration Form */}
            <div className="w-full lg:w-[60%] flex flex-col bg-white">
              <DialogHeader className="p-8 pb-0">
                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Registration Form</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">
                  Fill in the details below to secure your spot in this program.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-grow overflow-y-auto p-8 pt-6">
                <form id="enroll-form" onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Info Section */}
                  <div className="space-y-6">
                    <h5 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                      <span className="bg-blue-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-[9px]">01</span>
                      Personal Information
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-700">Student Full Name *</Label>
                        <Input
                          placeholder="Enter legal name"
                          className="rounded-xl border-slate-200 h-11 focus:ring-blue-500"
                          value={form.studentName}
                          onChange={(e) => set("studentName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-700">Contact Number *</Label>
                        <Input
                          placeholder="+91 00000 00000"
                          className="rounded-xl border-slate-200 h-11 focus:ring-blue-500"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-700">Date of Birth *</Label>
                        <Input
                          type="date"
                          className="rounded-xl border-slate-200 h-11"
                          value={form.dob}
                          onChange={(e) => set("dob", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-700">Gender *</Label>
                        <select
                          className="flex h-11 w-full rounded-xl border border-slate-200 bg-background px-3 py-2 text-sm focus:ring-blue-500"
                          value={form.gender}
                          onChange={(e) => set("gender", e.target.value)}
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-700">Permanent Address *</Label>
                      <Textarea
                        placeholder="House No, Street, City, State, PIN"
                        className="rounded-xl border-slate-200 min-h-[80px]"
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Chess & Level Section */}
                  <div className="space-y-6">
                    <h5 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                      <span className="bg-blue-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-[9px]">02</span>
                      Experience & Chess Profile
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-700">Current Experience Level *</Label>
                        <select
                          className="flex h-11 w-full rounded-xl border border-slate-200 bg-background px-3 py-2 text-sm focus:ring-blue-500"
                          value={form.experienceLevel}
                          onChange={(e) => set("experienceLevel", e.target.value)}
                          required
                        >
                          <option value="Beginner">Beginner (No Knowledge)</option>
                          <option value="Novice">Novice (Knows how to move)</option>
                          <option value="Intermediate">Intermediate (Played Tournaments)</option>
                          <option value="Advanced">Advanced (Rated Player)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-700">Category (Optional)</Label>
                        <Input
                          placeholder="e.g. Under-12"
                          className="rounded-xl border-slate-200 h-11"
                          value={form.category}
                          onChange={(e) => set("category", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">FIDE ID (If any)</Label>
                        <Input
                          placeholder="NA"
                          className="rounded-lg border-slate-200 h-10 bg-white"
                          value={form.fideId}
                          onChange={(e) => set("fideId", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">FIDE Rating</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="rounded-lg border-slate-200 h-10 bg-white"
                          value={form.fideRating}
                          onChange={(e) => set("fideRating", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment & Proofs Section */}
                  <div className="space-y-6">
                    <h5 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                      <span className="bg-blue-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-[9px]">03</span>
                      Transaction Details
                    </h5>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-700">Transaction ID (UPI/Bank) *</Label>
                      <Input
                        placeholder="Ref No. from your payment app"
                        className="rounded-xl border-slate-200 h-11 font-mono uppercase text-blue-600"
                        value={form.transactionId}
                        onChange={(e) => set("transactionId", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                          Birth Certificate / Age Proof * <Upload className="h-3 w-3 text-blue-600"/>
                        </Label>
                        <div className={cn(
                          "relative rounded-xl border-2 border-dashed p-4 flex flex-col items-center justify-center transition-all cursor-pointer hover:bg-slate-50",
                          ageProof ? "border-green-300 bg-green-50" : "border-slate-200"
                        )}>
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setAgeProof(e.target.files?.[0] || null)}
                            required
                          />
                          {ageProof ? (
                            <div className="flex items-center gap-2 text-green-700 font-bold text-xs truncate max-w-full">
                              <CheckCircle className="h-4 w-4" /> {ageProof.name}
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-[10px] text-slate-500 font-bold uppercase">Upload Document</p>
                              <p className="text-[9px] text-slate-400 mt-1">PDF, JPG up to 5MB</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                          Payment Screenshot * <Upload className="h-3 w-3 text-blue-600"/>
                        </Label>
                        <div className={cn(
                          "relative rounded-xl border-2 border-dashed p-4 flex flex-col items-center justify-center transition-all cursor-pointer hover:bg-slate-50",
                          paymentProof ? "border-green-300 bg-green-50" : "border-slate-200"
                        )}>
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                            required
                          />
                          {paymentProof ? (
                            <div className="flex items-center gap-2 text-green-700 font-bold text-xs truncate max-w-full">
                              <CheckCircle className="h-4 w-4" /> {paymentProof.name}
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-[10px] text-slate-500 font-bold uppercase">Upload Screenshot</p>
                              <p className="text-[9px] text-slate-400 mt-1">Image format up to 5MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Sticky Footer */}
              <div className="p-8 border-t bg-slate-50 flex items-center justify-between">
                <Button type="button" variant="ghost" onClick={() => handleClose(false)} className="rounded-xl font-bold text-slate-500">
                  Cancel
                </Button>
                <div className="flex items-center gap-4">
                  {!isFormValid && (
                    <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:block">Please fill all * fields</span>
                  )}
                  <Button
                    form="enroll-form"
                    type="submit"
                    disabled={loading || !isFormValid}
                    className={cn(
                      "min-w-[200px] h-12 rounded-xl font-black text-sm shadow-xl transition-all",
                      isFormValid ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20" : "bg-slate-200 text-slate-400 shadow-none"
                    )}
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Enrollment"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
