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
  Copy, FileText, ChevronDown, ShieldCheck,
  FileDown, Check, ArrowRight
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

    toast({ title: "Download Started", description: "The tournament brochure is being downloaded." });
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
        <Button onClick={() => navigate("/tournaments")} className="rounded-xl font-bold">Back to Arenas</Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-40 pb-20 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md space-y-6">
            <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-14 w-14 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Registration Successful!</h1>
            <p className="text-slate-500 leading-relaxed">Your application has been submitted successfully.</p>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-2 relative group">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference ID</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-bold text-blue-600 tracking-tight">{refId}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(refId);
                    toast({ title: "Copied!", description: "Reference ID copied." });
                  }}
                  className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-lg"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button onClick={() => navigate("/tournaments")} className="w-full h-16 bg-slate-900 hover:bg-blue-600 rounded-2xl font-bold transition-all text-white text-xs tracking-widest uppercase shadow-lg">
              Return to Arenas
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white">
      <Navbar />

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* LEFT COLUMN: Scrollable Info */}
        <div className="lg:w-1/2 lg:h-screen lg:overflow-y-auto bg-transparent">
          <div className="max-w-3xl ml-auto mr-0 px-6 sm:px-10 lg:px-16 pt-24 pb-20">
            {/* Back link */}
            <Link to="/tournaments" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors mb-10">
              <ArrowLeft className="size-4" />
              BACK TO ARENAS
            </Link>

            <div className="space-y-12">
              {/* Header */}
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">Championship Details</p>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  {tournament.title}
                </h1>
              </div>

              {/* Banner */}
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-200">
                <img
                  src={tournament.imageUrl || DEFAULT_BANNER}
                  alt={tournament.title}
                  className="w-full aspect-video object-cover"
                />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Calendar className="size-5 text-blue-600" />, label: 'Schedule', value: `${new Date(tournament.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}${tournament.endDate ? ` - ${new Date(tournament.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}` },
                  { icon: <MapPin className="size-5 text-blue-600" />, label: 'Venue', value: tournament.location },
                  { icon: <Trophy className="size-5 text-amber-500" />, label: 'Prize Pool', value: tournament.totalPrizePool },
                  { icon: <Tag className="size-5 text-green-600" />, label: 'Category', value: tournament.category },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-50 rounded-xl">{item.icon}</div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Description & Rules */}
              <div className="space-y-10">
                {tournament.description && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                      <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Overview</h2>
                    </div>
                    <div className="text-slate-600 leading-relaxed text-lg ql-editor ql-viewer p-0" dangerouslySetInnerHTML={{ __html: tournament.description }} />
                  </div>
                )}

                {tournament.otherDetails && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                      <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Rules & Regulations</h2>
                    </div>
                    <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
                       <div className="text-slate-600 leading-relaxed ql-editor ql-viewer p-0" dangerouslySetInnerHTML={{ __html: tournament.otherDetails.replace(/\s*\[\d+(,\s*\d+)*\]/g, '') }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Scanner - Persistent Visibility on Left */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1.5 bg-emerald-500 rounded-full" />
                  <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Payment Portal</h2>
                </div>
                <div className="bg-slate-900 p-8 sm:p-10 rounded-[3rem] text-white overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-6">
                      <div>
                        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Entry Fee</p>
                        <p className="text-5xl font-black tracking-tight">₹{tournament.entryFee?.toLocaleString()}</p>
                      </div>
                      <div className="space-y-4">
                         <p className="text-xs text-white/50 uppercase tracking-[0.2em] font-bold">Quick Steps</p>
                         <ol className="space-y-3">
                            {['Scan QR', 'Pay Fee', 'Attach Proof'].map((step, i) => (
                              <li key={i} className="flex items-center gap-3 text-white/70 text-sm font-medium">
                                <span className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black">{i+1}</span>
                                {step}
                              </li>
                            ))}
                         </ol>
                      </div>
                    </div>
                    <div className="flex-shrink-0 bg-white p-4 rounded-3xl">
                      <PaymentDisplay />
                    </div>
                  </div>
                </div>
              </div>

              {/* Help & Brochure */}
              <div className="pt-10 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-slate-500 font-medium">Questions? Call <span className="text-slate-900 font-bold">{tournament.contactDetails}</span></p>
                {tournament.brochureUrl && (
                  <button
                    onClick={(e) => handleBrochureDownload(e, tournament.brochureUrl!)}
                    className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                  >
                    <FileDown className="size-4" />
                    Download Brochure
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Form */}
        <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 bg-transparent flex items-center justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-lg">
            <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Secure Register</h2>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">Quick Checkout</p>
                  </div>
                </div>
                {/* Status Badge */}
                <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest", registrationStatus === "OPEN" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                  {registrationStatus}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className={cn("space-y-4 transition-all", isRegistrationDisabled && "opacity-40 grayscale pointer-events-none")}>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 required-field">Player Name</Label>
                    <Input
                      value={form.studentName}
                      onChange={(e) => set("studentName", e.target.value)}
                      required
                      disabled={isRegistrationDisabled}
                      placeholder="Full name"
                      className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all text-sm px-5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 required-field">Gender</Label>
                      <div className="relative">
                        <select
                          className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-5 text-xs appearance-none focus:bg-white transition-all"
                          value={form.gender}
                          onChange={(e) => set("gender", e.target.value)}
                          required
                          disabled={isRegistrationDisabled}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-3 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 required-field">Category</Label>
                      <div className="relative">
                        <select
                          className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-5 text-xs appearance-none focus:bg-white transition-all"
                          value={form.category}
                          onChange={(e) => set("category", e.target.value)}
                          required
                          disabled={isRegistrationDisabled}
                        >
                          <option value="">Select Age</option>
                          <option value="Under-7">U-7</option>
                          <option value="Under-9">U-9</option>
                          <option value="Under-11">U-11</option>
                          <option value="Under-13">U-13</option>
                          <option value="Under-15">U-15</option>
                          <option value="Under-17">U-17</option>
                          <option value="Under-19">U-19</option>
                          <option value="Open">Open</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-3 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 required-field">DOB</Label>
                      <Input
                        type="date"
                        value={form.dob}
                        onChange={(e) => set("dob", e.target.value)}
                        required
                        disabled={isRegistrationDisabled}
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white px-5 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 required-field">Phone</Label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        required
                        disabled={isRegistrationDisabled}
                        placeholder="+91"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white px-5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 required-field">Address</Label>
                    <Textarea
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      required
                      disabled={isRegistrationDisabled}
                      placeholder="Full residential address"
                      className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white px-5 py-3 min-h-[80px] resize-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 required-field">Age Proof</Label>
                      <div className="relative group/file">
                        <input type="file" onChange={(e) => handleFileChange(e, 'payment1')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required disabled={isRegistrationDisabled} />
                        <div className={cn("h-12 border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.payment1 ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400")}>
                          {files.payment1 ? <CheckCircle2 className="size-3.5" /> : <Upload className="size-3.5" />}
                          <span className="text-[10px] font-bold uppercase tracking-wider truncate">{files.payment1 ? "Uploaded" : "Upload"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 required-field">Payment Proof</Label>
                      <div className="relative group/file">
                        <input type="file" onChange={(e) => handleFileChange(e, 'payment2')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required disabled={isRegistrationDisabled} />
                        <div className={cn("h-12 border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.payment2 ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400")}>
                          {files.payment2 ? <CheckCircle2 className="size-3.5" /> : <Upload className="size-3.5" />}
                          <span className="text-[10px] font-bold uppercase tracking-wider truncate">{files.payment2 ? "Uploaded" : "Upload"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isPending || isRegistrationDisabled}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-blue-600/20 mt-4 flex items-center justify-center gap-3"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>REGISTER NOW <ArrowRight className="size-4" /></>}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
