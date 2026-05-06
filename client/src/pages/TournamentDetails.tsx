import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useTournamentRegistration } from "@/features/tournaments/hooks/useTournamentRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, MapPin, ArrowLeft, Trophy,
  Upload, CheckCircle2, Loader2,
  CreditCard, Info, Copy, FileText, Phone, Award, User, ChevronDown
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

    // Cloudinary force download flag
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
      description: "The tournament brochure is being downloaded to your system.",
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
          description: error.response?.data?.error || "Could not process registration. Please check all fields and try again."
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Tournament not found</h1>
        <Button onClick={() => navigate("/tournaments")} className="rounded-xl font-semibold">Back to Arenas</Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 pt-40 pb-20 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md space-y-6">
            <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Registration Successful!</h1>
            <p className="text-slate-500 font-medium leading-relaxed">Your registration for <span className="text-orange-600 font-semibold">{tournament.title}</span> has been submitted. Our team will review your application and contact you shortly.</p>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] space-y-2 relative group">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Reference ID</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl font-bold text-orange-600 tracking-tight">{refId}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(refId);
                    toast({ title: "Copied!", description: "Reference ID copied to clipboard." });
                  }}
                  className="h-10 w-10 text-slate-400 hover:text-orange-600 rounded-xl"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Button onClick={() => navigate("/tournaments")} className="w-full h-16 bg-slate-900 hover:bg-orange-600 rounded-2xl font-bold transition-all text-white text-lg shadow-lg shadow-slate-900/10">
              RETURN TO ARENAS
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="mb-12">
          <Link to="/tournaments" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-orange-600 transition-colors group uppercase tracking-[0.2em]">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Arenas</span>
          </Link>
        </div>

        <OrientationWrapper
          orientation={tournament.posterOrientation}
          poster={
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className={cn(
              "relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white",
              tournament.posterOrientation === 'PORTRAIT' ? "aspect-[3/4]" : "aspect-video"
            )}>
              <img
                src={tournament.imageUrl || DEFAULT_BANNER}
                alt={tournament.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-orange-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg">
                  {tournament.category || "Professional"}
                </span>
              </div>
            </motion.div>
          }
          details={
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-12">
              <motion.div variants={fadeUp} className="space-y-8">
                <div className="space-y-3">
                  <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-[0.15em]">
                    Arena Details
                  </span>
                  <h1 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                    {tournament.title}
                  </h1>
                </div>

                {tournament.description && (
                  <div
                    className="text-slate-600 font-medium leading-relaxed text-lg border-l-4 border-orange-600/20 pl-6 ql-editor ql-viewer p-0"
                    dangerouslySetInnerHTML={{ __html: tournament.description }}
                  />
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md hover:border-orange-600/20 transition-all group">
                    <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <Calendar className="h-7 w-7 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Schedule</p>
                      <p className="text-base font-bold text-slate-900 tracking-tight">
                        {new Date(tournament.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        {tournament.endDate && ` - ${new Date(tournament.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md hover:border-orange-600/20 transition-all group">
                    <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <MapPin className="h-7 w-7 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Venue</p>
                      <p className="text-base font-bold text-slate-900 tracking-tight line-clamp-1">{tournament.location}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md hover:border-orange-600/20 transition-all group">
                    <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <Trophy className="h-7 w-7 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Prize Pool</p>
                      <p className="text-base font-bold text-slate-900 tracking-tight">{tournament.totalPrizePool}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md hover:border-orange-600/20 transition-all group">
                    <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <Award className="h-7 w-7 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Category</p>
                      <p className="text-base font-bold text-slate-900 tracking-tight">{tournament.category}</p>
                    </div>
                  </div>
                </div>

                {tournament.otherDetails && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] ml-1">Tournament Rules & Info</p>
                    <div
                      className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-base text-slate-600 font-medium leading-relaxed shadow-md border-l-4 border-l-orange-600 ql-editor ql-viewer"
                      dangerouslySetInnerHTML={{ __html: tournament.otherDetails }}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {tournament.brochureUrl && (
                    <button
                      onClick={(e) => handleBrochureDownload(e, tournament.brochureUrl!)}
                      className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2.5rem] group hover:border-orange-600 transition-all shadow-lg text-left"
                    >
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-inner">
                          <FileText className="h-8 w-8 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-0.5">Brochure</p>
                          <p className="text-lg font-bold text-slate-900">Download PDF</p>
                        </div>
                      </div>
                    </button>
                  )}

                  <div className="p-8 bg-slate-900 rounded-[2.5rem] flex items-center gap-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl transition-all group-hover:bg-orange-600/20" />
                    <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-md border border-white/10 group-hover:scale-105 transition-transform duration-500">
                      <Phone className="h-8 w-8 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-1">Direct Help</p>
                      <p className="text-xl font-bold tracking-tight">{tournament.contactDetails}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Section (Sleek Card) */}
                <motion.div variants={fadeUp} className="space-y-6">
                  <div className="px-10 py-8 bg-white border border-slate-100 rounded-[3rem] shadow-lg flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-full bg-orange-50/50 -skew-x-12 translate-x-16 transition-transform group-hover:translate-x-8" />
                    <div className="relative">
                      <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">Registration Entry Fee</p>
                      <p className="text-5xl font-bold text-orange-600 tracking-tighter">₹{tournament.entryFee.toLocaleString()}</p>
                    </div>
                    <div className="relative h-16 w-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:rotate-6 transition-transform">
                      <CreditCard className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {tournament.discountDetails && (
                    <div className="flex items-start gap-4 p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100/50 shadow-inner">
                      <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <Info className="h-6 w-6 text-orange-600" />
                      </div>
                      <p className="text-sm font-semibold text-orange-700 leading-relaxed italic uppercase tracking-tight">{tournament.discountDetails}</p>
                    </div>
                  )}

                  <PaymentDisplay />
                </motion.div>
              </motion.div>
            </motion.div>
          }
          form={
            <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
              <div className="h-3 bg-orange-600" />
              <CardContent className="p-10 md:p-14">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                      <User className="h-6 w-6 text-orange-600" />
                      <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Enrollment Form</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Player Name *</Label>
                        <Input
                          value={form.studentName}
                          onChange={(e) => set("studentName", e.target.value)}
                          required
                          placeholder="Enter your full name"
                          className="h-16 rounded-2xl border border-slate-100 bg-slate-50/50 font-semibold text-slate-900 px-6 focus:ring-orange-600 transition-all placeholder:text-slate-300"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Gender *</Label>
                        <div className="flex gap-10 pt-2 px-1">
                          {["Male", "Female", "Other"].map((g) => (
                            <label key={g} className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="radio"
                                  name="gender"
                                  value={g}
                                  checked={form.gender === g}
                                  onChange={(e) => set("gender", e.target.value)}
                                  className="peer sr-only"
                                />
                                <div className="h-6 w-6 rounded-full border border-slate-200 peer-checked:border-orange-600 transition-all" />
                                <div className="absolute h-3 w-3 rounded-full bg-orange-600 scale-0 peer-checked:scale-100 transition-transform" />
                              </div>
                              <span className={cn("text-base font-semibold tracking-tight transition-colors", form.gender === g ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600")}>
                                {g}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Category *</Label>
                          <div className="relative">
                            <select
                              className="w-full h-16 rounded-2xl border border-slate-100 bg-slate-50/50 px-6 text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all appearance-none cursor-pointer pr-12"
                              value={form.category}
                              onChange={(e) => set("category", e.target.value)}
                              required
                            >
                              <option value="">Select Category</option>
                              <option value="Under-7">Under-7</option>
                              <option value="Under-9">Under-9</option>
                              <option value="Under-11">Under-11</option>
                              <option value="Under-13">Under-13</option>
                              <option value="Under-15">Under-15</option>
                              <option value="Under-17">Under-17</option>
                              <option value="Under-19">Under-19</option>
                              <option value="Open">Open</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Date of Birth *</Label>
                          <Input
                            type="date"
                            value={form.dob}
                            onChange={(e) => set("dob", e.target.value)}
                            required
                            className="h-16 rounded-2xl border border-slate-100 bg-slate-50/50 font-semibold text-slate-900 px-6"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Phone Number *</Label>
                          <Input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            required
                            placeholder="+91 XXXXX XXXXX"
                            className="h-16 rounded-2xl border border-slate-100 bg-slate-50/50 font-semibold text-slate-900 px-6"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Email (Optional)</Label>
                          <Input
                            type="email"
                            value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder="john@example.com"
                            className="h-16 rounded-2xl border border-slate-100 bg-slate-50/50 font-semibold text-slate-900 px-6"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">FIDE ID</Label>
                          <Input
                            value={form.fideId}
                            onChange={(e) => set("fideId", e.target.value)}
                            placeholder="0"
                            className="h-16 rounded-2xl border border-slate-100 bg-slate-50/50 font-semibold text-slate-900 px-6"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">FIDE Rating</Label>
                          <Input
                            type="number"
                            value={form.fideRating}
                            onChange={(e) => set("fideRating", e.target.value)}
                            placeholder="0"
                            className="h-16 rounded-2xl border border-slate-100 bg-slate-50/50 font-semibold text-slate-900 px-6"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Full Address *</Label>
                        <Textarea
                          value={form.address}
                          onChange={(e) => set("address", e.target.value)}
                          required
                          placeholder="Enter your complete residential address"
                          className="rounded-2xl border border-slate-100 bg-slate-50/50 min-h-[120px] p-6 font-medium text-slate-900 resize-none focus:ring-orange-600 transition-all"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Payment Proof 1 *</Label>
                          <div className="relative h-20">
                            <input
                              type="file"
                              onChange={(e) => handleFileChange(e, 'payment1')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              required
                            />
                            <div className={cn(
                              "h-full w-full border border-dashed rounded-2xl flex items-center justify-center gap-3 px-6 transition-all",
                              files.payment1 ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-400 hover:border-orange-400"
                            )}>
                              {files.payment1 ? <CheckCircle2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                              <span className="text-sm font-semibold truncate">{files.payment1 ? files.payment1.name : "Upload Proof"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Payment Proof 2 *</Label>
                          <div className="relative h-20">
                            <input
                              type="file"
                              onChange={(e) => handleFileChange(e, 'payment2')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              required
                            />
                            <div className={cn(
                              "h-full w-full border border-dashed rounded-2xl flex items-center justify-center gap-3 px-6 transition-all",
                              files.payment2 ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-400 hover:border-orange-400"
                            )}>
                              {files.payment2 ? <CheckCircle2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                              <span className="text-sm font-semibold truncate">{files.payment2 ? files.payment2.name : "Upload Proof"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">How did you find us?</Label>
                        <div className="relative">
                          <select
                            className="w-full h-16 rounded-2xl border border-slate-100 bg-slate-50/50 px-6 text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all appearance-none cursor-pointer pr-12"
                            value={form.discoverySource}
                            onChange={(e) => set("discoverySource", e.target.value)}
                          >
                            <option>Social Media</option>
                            <option>Through Coach</option>
                            <option>Academy Event</option>
                            <option>Google Search</option>
                            <option>Friend/Word of Mouth</option>
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-20 bg-orange-600 hover:bg-slate-900 text-white text-xl font-bold rounded-3xl transition-all shadow-lg shadow-orange-600/30 active:scale-[0.98] uppercase tracking-wider"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" /> Submitting...
                      </span>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          }
        />
      </main>

      <Footer />
    </div>
  );
}
