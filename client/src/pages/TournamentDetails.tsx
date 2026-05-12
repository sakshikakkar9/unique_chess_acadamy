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
  Calendar, MapPin, ArrowLeft, Trophy, Tag,
  Upload, CheckCircle2, Loader2,
  CreditCard, Copy, FileText, Phone, Award, ChevronDown, AlertCircle, Clock, ShieldCheck,
  FileDown
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import PaymentDisplay from "@/components/shared/PaymentDisplay";
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-4">
        <Link to="/tournaments"
           className="inline-flex items-center gap-2 text-sm font-medium
                      text-slate-500 hover:text-slate-900 transition-colors duration-150">
          <ArrowLeft className="size-4" />
          Back to Arenas
        </Link>
      </div>

      {/* Main two-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Title & Description Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">
                Tournament Details
              </p>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
                {tournament.title}
              </h1>
              {tournament.description && (
                <div
                  className="text-sm text-slate-600 leading-relaxed ql-editor ql-viewer p-0"
                  dangerouslySetInnerHTML={{ __html: tournament.description }}
                />
              )}
            </div>

            {/* Poster card */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
              <img
                src={tournament.imageUrl || DEFAULT_BANNER}
                alt={tournament.title}
                className="w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Info pills grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: <Calendar className="size-4 text-blue-500" />,
                  label: 'Schedule',
                  value: `${new Date(tournament.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}${tournament.endDate ? ` - ${new Date(tournament.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}`,
                },
                {
                  icon: <MapPin className="size-4 text-blue-500" />,
                  label: 'Venue',
                  value: tournament.location,
                },
                {
                  icon: <Trophy className="size-4 text-amber-500" />,
                  label: 'Prize Pool',
                  value: tournament.totalPrizePool,
                },
                {
                  icon: <Tag className="size-4 text-green-500" />,
                  label: 'Category',
                  value: tournament.category,
                },
              ].map(info => (
                <div key={info.label}
                     className="bg-white border border-slate-200 rounded-xl p-4
                                flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    {info.icon}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {info.label}
                    </span>
                  </div>
                  <span className="text-base font-bold text-slate-900 leading-snug">
                    {info.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Rules card */}
            {tournament.otherDetails && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <FileText className="size-4 text-slate-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Rules & Regulations
                  </h3>
                </div>
                <div
                  className="text-sm text-slate-600 leading-relaxed ql-editor ql-viewer p-0"
                  dangerouslySetInnerHTML={{ __html: tournament.otherDetails.replace(/\s*\[\d+(,\s*\d+)*\]/g, '') }}
                />
                {tournament.brochureUrl && (
                  <button
                    onClick={(e) => handleBrochureDownload(e, tournament.brochureUrl!)}
                    className="inline-flex items-center gap-2 mt-4 text-sm font-semibold
                               text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    <FileDown className="size-4" />
                    Download Brochure PDF
                  </button>
                )}
              </div>
            )}

            {/* Payment card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  Registration Fee
                </span>
                <span className="text-2xl font-black text-white">
                  ₹{tournament.entryFee?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-1 space-y-3">
                    <p className="text-sm font-semibold text-slate-900">How to pay:</p>
                    <ol className="space-y-2.5">
                      {[
                        'Scan the QR code with any UPI app',
                        'Enter the registration fee amount',
                        'Add your name in payment remarks',
                        'Submit the form below with your details',
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full
                                           bg-blue-100 text-blue-600
                                           text-[10px] font-bold
                                           flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-sm text-slate-600">{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Accepted via</p>
                      <div className="flex flex-wrap gap-2">
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Any UPI'].map(app => (
                          <span key={app} className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-center gap-2 mx-auto sm:mx-0">
                    <div className="border-2 border-slate-200 rounded-xl p-3 bg-white shadow-sm">
                      <PaymentDisplay />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Active Scanner</span>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center max-w-[140px]">Scan with any UPI app to pay</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — sticky registration form */}
          <div className="lg:sticky lg:top-24 order-1 lg:order-2">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
                <ShieldCheck className="size-5 text-blue-400" />
                <div>
                  <p className="text-sm font-bold text-white">Registration Form</p>
                  <p className="text-xs text-white/50 mt-0.5">Secure · Instant confirmation</p>
                </div>
              </div>

              <div className="px-6 pt-4">
                <div className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-2.5 mb-4 border",
                  registrationStatus === "OPEN" ? "bg-green-50 border-green-200 text-green-700" :
                  registrationStatus === "CLOSED" ? "bg-red-50 border-red-200 text-red-700" :
                  "bg-blue-50 border-blue-200 text-blue-700"
                )}>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full",
                      registrationStatus === "OPEN" ? "bg-green-500" :
                      registrationStatus === "CLOSED" ? "bg-red-500" : "bg-blue-500"
                    )} />
                    <span className="text-xs font-semibold">
                      {registrationStatus === "OPEN" ? "Registration Open" :
                       registrationStatus === "CLOSED" ? "Registration Closed" : "Registration Starting Soon"}
                    </span>
                  </div>
                  <span className="text-xs opacity-80">
                    {registrationStatus === "OPEN" ? (tournament.spotsLeft ?? 'Limited') + " spots left" :
                     registrationStatus === "CLOSED" ? "Enrollment ended" : `Starts ${tournament.regStartDate ? new Date(tournament.regStartDate).toLocaleDateString() : 'TBD'}`}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className={cn("space-y-4 transition-all duration-300", isRegistrationDisabled && "opacity-40 grayscale pointer-events-none")}>
                    <div className="space-y-1.5">
                      <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Player Name *</Label>
                      <Input
                        value={form.studentName}
                        onChange={(e) => set("studentName", e.target.value)}
                        required
                        disabled={isRegistrationDisabled}
                        placeholder="Full Name"
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 h-11"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gender *</Label>
                      <div className="flex gap-6 py-1">
                        {["Male", "Female", "Other"].map((g) => (
                          <label key={g} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="radio"
                              name="gender"
                              value={g}
                              checked={form.gender === g}
                              onChange={(e) => set("gender", e.target.value)}
                              disabled={isRegistrationDisabled}
                              className="accent-blue-600 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-sm text-slate-700 group-hover:text-slate-900">{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category *</Label>
                        <div className="relative">
                          <select
                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 appearance-none cursor-pointer h-11"
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
                      <div className="space-y-1.5">
                        <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">DOB *</Label>
                        <Input
                          type="date"
                          value={form.dob}
                          onChange={(e) => set("dob", e.target.value)}
                          required
                          disabled={isRegistrationDisabled}
                          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 h-11"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone *</Label>
                        <Input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          required
                          disabled={isRegistrationDisabled}
                          placeholder="+91"
                          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          disabled={isRegistrationDisabled}
                          placeholder="Email"
                          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Address *</Label>
                      <Textarea
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        required
                        disabled={isRegistrationDisabled}
                        placeholder="Full Address"
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 min-h-[80px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Age Proof *</Label>
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
                      <div className="space-y-1.5">
                        <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment *</Label>
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
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed h-auto mt-2"
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
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
