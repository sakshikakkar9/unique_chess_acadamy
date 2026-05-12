import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useTournamentRegistration } from "@/features/tournaments/hooks/useTournamentRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, MapPin, ArrowLeft, Trophy,
  Upload, CheckCircle2, Loader2,
  CreditCard, Copy, FileText, Phone, Award, ChevronDown, AlertCircle, Clock, ShieldCheck
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "@/components/shared/motion";
import PaymentDisplay from "@/components/shared/PaymentDisplay";
import OrientationWrapper from "@/features/tournaments/components/OrientationWrapper";
import 'react-quill/dist/quill.snow.css';

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2000&auto=format&fit=crop";

export default function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tournaments, isLoading } = useAdminTournaments();
  const { mutate: register, isPending } = useTournamentRegistration();
  
  const [success, setSuccess] = useState(false);
  const [refId, setRefId] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [files, setFiles] = useState<{ payment1?: File | null; payment2?: File | null }>({
    payment1: null,
    payment2: null
  });

  const [form, setForm] = useState({
    studentName: "",
    gender: "Male",
    dob: "",
    email: "",
    phone: "",
    fideId: "0",
    fideRating: "0",
    address: "",
    discoverySource: "Social Media",
    category: ""
  });

  const tournament = useMemo(() => tournaments.find((t) => t.id.toString() === id), [tournaments, id]);

  const registrationStatus = useMemo(() => {
    if (!tournament) return "OPEN";
    const now = new Date();
    const start = tournament.regStartDate ? new Date(tournament.regStartDate) : null;
    const end = tournament.regEndDate ? new Date(tournament.regEndDate) : null;

    if (start && now < start) return "NOT_STARTED";
    if (end) {
      const closingTime = new Date(end);
      closingTime.setHours(23, 59, 59, 999);
      if (now > closingTime) return "CLOSED";
    }
    return "OPEN";
  }, [tournament]);

  const isRegistrationDisabled = registrationStatus !== "OPEN";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'payment1' | 'payment2') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const set = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleBrochureDownload = (e: React.MouseEvent, url: string) => {
    e.preventDefault();

    const downloadUrl = url.includes("cloudinary.com")
      ? url.replace("/upload/", "/upload/fl_attachment/")
      : url;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank";
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "The tournament brochure is being downloaded.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournament || !id) return;

    if (!files.payment1 || !files.payment2) {
      toast({
        variant: "destructive",
        title: "Missing Files",
        description: "Please upload both payment proof images."
      });
      return;
    }

    const formData = new FormData();
    formData.append("tournamentId", id);
    formData.append("studentName", form.studentName);
    formData.append("gender", form.gender);
    formData.append("dob", form.dob);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("fideId", form.fideId);
    formData.append("fideRating", form.fideRating);
    formData.append("address", form.address);
    formData.append("discoverySource", form.discoverySource);
    formData.append("category", form.category);
    formData.append("ageProof", files.payment1);
    formData.append("paymentProof", files.payment2);

    register(formData, {
      onSuccess: (data: any) => {
        setRefId(data.referenceId || "UCA-" + Math.random().toString(36).toUpperCase().substring(2, 10));
        setSuccess(true);
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.response?.data?.error || "Could not process registration."
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Tournament not found.</h1>
        <Button onClick={() => navigate("/tournaments")} className="rounded-xl font-bold uppercase text-xs tracking-widest">Back to Arenas</Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 sm:pt-28 sm:pb-20 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md space-y-6">
            <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Registration Successful!</h1>
            <p className="text-sm font-normal text-slate-500 leading-relaxed">
              Your application has been submitted. Our team will review it shortly.
            </p>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl space-y-2 relative group">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference ID</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-bold text-blue-600 tracking-tight">{refId}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(refId);
                    toast({ title: "Copied!", description: "Reference ID copied to clipboard." });
                  }}
                  className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-lg"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button onClick={() => navigate("/tournaments")} className="w-full h-14 bg-slate-900 hover:bg-blue-600 rounded-xl font-bold transition-all text-white text-xs tracking-widest uppercase shadow-lg">
              Return to Arenas
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 sm:pt-28 sm:pb-16">
        <div className="mb-10">
          <Link to="/tournaments" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors group uppercase tracking-widest">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Arenas</span>
          </Link>
        </div>

        <OrientationWrapper
          orientation={tournament.posterOrientation}
          poster={
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className={cn(
              "relative rounded-2xl overflow-hidden shadow-sm border border-slate-100",
              tournament.posterOrientation === 'PORTRAIT' ? "aspect-[3/4]" : "aspect-video"
            )}>
              <img
                src={tournament.imageUrl || DEFAULT_BANNER}
                alt={tournament.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  {tournament.category || "Professional"}
                </span>
              </div>
            </motion.div>
          }
          details={
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-10">
              <motion.div variants={fadeUp} className="space-y-8">
                {/* Title & Description */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Arena Details
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                    {tournament.title}
                  </h1>

                  {tournament.description && (
                    <div
                      className="text-sm font-normal text-slate-500 leading-relaxed ql-editor ql-viewer p-0"
                      dangerouslySetInnerHTML={{ __html: tournament.description }}
                    />
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 py-6 border-t border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Schedule</p>
                      <p className="text-sm font-bold text-slate-900 tracking-tight">
                        {new Date(tournament.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        {tournament.endDate && ` - ${new Date(tournament.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Venue</p>
                      <p className="text-sm font-bold text-slate-900 tracking-tight line-clamp-1">{tournament.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Trophy className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Prize Pool</p>
                      <p className="text-sm font-bold text-slate-900 tracking-tight">{tournament.totalPrizePool}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Award className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Category</p>
                      <p className="text-sm font-bold text-slate-900 tracking-tight">{tournament.category}</p>
                    </div>
                  </div>
                </div>

                {/* Rules */}
                {tournament.otherDetails && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rules & Regulations</p>
                    <div
                      className="text-sm text-slate-500 font-normal leading-relaxed ql-editor ql-viewer p-0"
                      dangerouslySetInnerHTML={{ __html: tournament.otherDetails }}
                    />
                  </div>
                )}

                {/* Contact & Resources */}
                <div className="flex flex-wrap gap-x-10 gap-y-6 py-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support</p>
                      <p className="text-sm font-bold text-slate-900">{tournament.contactDetails}</p>
                    </div>
                  </div>

                  {tournament.brochureUrl && (
                    <button
                      onClick={(e) => handleBrochureDownload(e, tournament.brochureUrl!)}
                      className="flex items-center gap-3 group"
                    >
                      <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Resources</p>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors underline decoration-blue-600/20 underline-offset-4">Brochure PDF</p>
                      </div>
                    </button>
                  )}
                </div>

                {/* Payment Section */}
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Registration Fee</p>
                      <p className="text-3xl font-bold text-blue-600 tracking-tight">₹{tournament.entryFee.toLocaleString()}</p>
                    </div>
                    <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {tournament.discountDetails && (
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider italic">
                      Note: {tournament.discountDetails}
                    </p>
                  )}

                  <PaymentDisplay />
                </div>
              </motion.div>
            </motion.div>
          }
          form={
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
                <ShieldCheck className="size-4 text-blue-400" />
                <h2 className="text-xs font-bold text-white tracking-widest uppercase">Registration Form</h2>
              </div>
              <div className="px-6 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {registrationStatus === "NOT_STARTED" && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-4">
                      <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-blue-900 font-bold text-sm">Registration hasn't started.</p>
                        <p className="text-blue-600 text-xs">Available from {tournament.regStartDate ? new Date(tournament.regStartDate).toLocaleDateString() : 'TBD'}.</p>
                      </div>
                    </div>
                  )}

                  {registrationStatus === "CLOSED" && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-4">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="text-red-900 font-bold text-sm">Registration is closed.</p>
                        <p className="text-red-600 text-xs">The enrollment period has ended.</p>
                      </div>
                    </div>
                  )}

                  <div className={cn("space-y-6 transition-all duration-300", isRegistrationDisabled && "opacity-40 grayscale pointer-events-none")}>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Player Name *</Label>
                      <Input
                        value={form.studentName}
                        onChange={(e) => set("studentName", e.target.value)}
                        required
                        disabled={isRegistrationDisabled}
                        placeholder="Full Name"
                        className="bg-slate-50 border-slate-200 h-11 rounded-xl text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender *</Label>
                      <div className="flex gap-4">
                        {["Male", "Female", "Other"].map((g) => (
                          <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                            <input
                              type="radio"
                              name="gender"
                              value={g}
                              checked={form.gender === g}
                              onChange={(e) => set("gender", e.target.value)}
                              disabled={isRegistrationDisabled}
                              className="size-3.5 accent-blue-600"
                            />
                            {g}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category *</Label>
                        <div className="relative">
                          <select
                            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm appearance-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none"
                            value={form.category}
                            onChange={(e) => set("category", e.target.value)}
                            required
                            disabled={isRegistrationDisabled}
                          >
                            <option value="">Select</option>
                            <option value="Under-7">U-7</option>
                            <option value="Under-9">U-9</option>
                            <option value="Under-11">U-11</option>
                            <option value="Under-13">U-13</option>
                            <option value="Under-15">U-15</option>
                            <option value="Under-17">U-17</option>
                            <option value="Under-19">U-19</option>
                            <option value="Open">Open</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">DOB *</Label>
                        <Input
                          type="date"
                          value={form.dob}
                          onChange={(e) => set("dob", e.target.value)}
                          required
                          disabled={isRegistrationDisabled}
                          className="bg-slate-50 border-slate-200 h-11 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone *</Label>
                        <Input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          required
                          disabled={isRegistrationDisabled}
                          placeholder="+91"
                          className="bg-slate-50 border-slate-200 h-11 rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          disabled={isRegistrationDisabled}
                          placeholder="Email"
                          className="bg-slate-50 border-slate-200 h-11 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Address *</Label>
                      <Textarea
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        required
                        disabled={isRegistrationDisabled}
                        placeholder="Full Address"
                        className="bg-slate-50 border-slate-200 rounded-xl text-sm min-h-[80px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Age Proof *</Label>
                        <div className="relative">
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'payment1')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            required
                            disabled={isRegistrationDisabled}
                          />
                          <div className={cn(
                            "w-full h-11 border border-dashed rounded-xl flex items-center justify-center gap-2 px-3 transition-all text-[11px] font-bold uppercase",
                            files.payment1 ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-400"
                          )}>
                            {files.payment1 ? <CheckCircle2 className="size-3.5" /> : <Upload className="size-3.5" />}
                            <span className="truncate">{files.payment1 ? "Uploaded" : "Age Proof"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Payment *</Label>
                        <div className="relative">
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'payment2')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            required
                            disabled={isRegistrationDisabled}
                          />
                          <div className={cn(
                            "w-full h-11 border border-dashed rounded-xl flex items-center justify-center gap-2 px-3 transition-all text-[11px] font-bold uppercase",
                            files.payment2 ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-400"
                          )}>
                            {files.payment2 ? <CheckCircle2 className="size-3.5" /> : <Upload className="size-3.5" />}
                            <span className="truncate">{files.payment2 ? "Uploaded" : "Payment Proof"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending || isRegistrationDisabled}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md uppercase tracking-widest disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Register Now"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          }
        />
      </main>

      <Footer />
    </div>
  );
}
