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
  Calendar, MapPin, Ticket, ArrowLeft, Trophy, Users, 
  Upload, CheckCircle2, Loader2, ShieldCheck,
  CreditCard, Info, Copy
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "@/components/shared/motion";
import PaymentDisplay from "@/components/shared/PaymentDisplay";
import OrientationWrapper from "@/features/tournaments/components/OrientationWrapper";

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2000&auto=format&fit=crop";

export default function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tournaments, isLoading } = useAdminTournaments();
  const { mutate: register, isPending } = useTournamentRegistration();
  
  const [success, setSuccess] = useState(false);
  const [refId, setRefId] = useState("");

  const [files, setFiles] = useState<{ age?: File | null; payment?: File | null }>({
    age: null,
    payment: null
  });

  const [form, setForm] = useState({
    studentName: "",
    gender: "Male",
    dob: "",
    email: "",
    phone: "",
    fideId: "NA",
    fideRating: "0",
    address: "",
    discoverySource: "Social Media",
    transactionId: "",
    category: ""
  });

  const tournament = useMemo(() => tournaments.find((t) => t.id.toString() === id), [tournaments, id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'age' | 'payment') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const set = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournament || !id) return;

    if (!files.age || !files.payment) {
      toast({
        variant: "destructive",
        title: "Missing Files",
        description: "Please upload both Age Proof and Payment Proof."
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
    formData.append("transactionId", form.transactionId);
    formData.append("category", form.category);
    formData.append("ageProof", files.age);
    formData.append("paymentProof", files.payment);

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
        <h1 className="text-2xl font-bold text-slate-900">Tournament not found</h1>
        <Button onClick={() => navigate("/tournaments")}>Back to Arenas</Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 pt-40 pb-20 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md space-y-6">
            <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-900">Registration Successful!</h1>
            <p className="text-slate-500 font-medium">Your registration for <strong>{tournament.title}</strong> has been submitted. Our team will review your application and contact you shortly.</p>

            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-2 relative group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference ID</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-black text-orange-600">{refId}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(refId);
                    toast({ title: "Copied!", description: "Reference ID copied to clipboard." });
                  }}
                  className="h-8 w-8 text-slate-400 hover:text-orange-600"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button onClick={() => navigate("/tournaments")} className="w-full h-14 bg-slate-900 hover:bg-orange-600 rounded-xl font-bold transition-all text-white">
              Return to Arenas
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
        <div className="mb-10">
          <Link to="/tournaments" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-orange-600 transition-colors group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="uppercase tracking-widest">Back to Arenas</span>
          </Link>
        </div>

        <OrientationWrapper
          orientation={tournament.posterOrientation}
          poster={
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className={cn(
              "relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white",
              tournament.posterOrientation === 'PORTRAIT' ? "aspect-[3/4]" : "aspect-video"
            )}>
              <img
                src={tournament.imageUrl || DEFAULT_BANNER}
                alt={tournament.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 bg-orange-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg">
                  {tournament.category || "Professional"}
                </span>
              </div>
            </motion.div>
          }
          details={
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
              <motion.div variants={fadeUp} className="space-y-4">
                <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tighter">
                  {tournament.title}
                </h1>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-bold text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-orange-500" /> {new Date(tournament.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-bold text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-orange-500" /> {tournament.location || "Main Academy Hall"}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-bold text-slate-600">
                    <Users className="h-3.5 w-3.5 text-orange-500" /> ₹{tournament.totalPrizePool?.toLocaleString() || 'TBD'}
                  </div>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {tournament.description || "Compete against the finest minds in the region and show your chess prowess."}
                </p>
                {tournament.otherDetails && (
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-orange-900 text-xs font-medium leading-relaxed italic">
                      {tournament.otherDetails}
                    </p>
                  </div>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="p-8 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-600/20">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Entry Fee</p>
                    <p className="text-4xl font-black">₹{tournament.entryFee.toLocaleString()}</p>
                    {tournament.discountDetails && (
                      <p className="text-[10px] text-blue-100 mt-1 font-bold italic">{tournament.discountDetails}</p>
                    )}
                  </div>
                  <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-6 w-6" />
                  </div>
                </div>

                <PaymentDisplay />
              </motion.div>
            </motion.div>
          }
          form={
            <Card className="border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden bg-white">
              <div className="h-2 bg-orange-600" />
              <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <ShieldCheck className="h-5 w-5 text-orange-600" />
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Player Details</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Full Name *</Label>
                        <Input
                          value={form.studentName}
                          onChange={(e) => set("studentName", e.target.value)}
                          required
                          placeholder="John Doe"
                          className="h-14 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Gender *</Label>
                        <select
                          className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-600"
                          value={form.gender}
                          onChange={(e) => set("gender", e.target.value)}
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Date of Birth *</Label>
                        <Input
                          type="date"
                          value={form.dob}
                          onChange={(e) => set("dob", e.target.value)}
                          required
                          className="h-14 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Category (Optional)</Label>
                        <Input
                          placeholder="e.g. Under-15"
                          value={form.category}
                          onChange={(e) => set("category", e.target.value)}
                          className="h-14 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Phone Number *</Label>
                        <Input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          required
                          placeholder="+91 98765 43210"
                          className="h-14 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Email Address</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="john@example.com"
                          className="h-14 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">FIDE ID (Optional)</Label>
                        <Input
                          value={form.fideId}
                          onChange={(e) => set("fideId", e.target.value)}
                          placeholder="FIDE ID"
                          className="h-14 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">FIDE Rating (Optional)</Label>
                        <Input
                          type="number"
                          value={form.fideRating}
                          onChange={(e) => set("fideRating", e.target.value)}
                          placeholder="0"
                          className="h-14 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Full Address *</Label>
                      <Textarea
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        required
                        placeholder="Your residential address"
                        className="rounded-xl border-slate-200 bg-slate-50/50 min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 pt-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <CreditCard className="h-5 w-5 text-orange-600" />
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Experience & Payment</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Transaction ID *</Label>
                        <Input
                          value={form.transactionId}
                          onChange={(e) => set("transactionId", e.target.value)}
                          required
                          placeholder="UPI Reference No."
                          className="h-14 rounded-xl border-slate-200 bg-slate-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">How did you find us?</Label>
                        <select
                          className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-600"
                          value={form.discoverySource}
                          onChange={(e) => set("discoverySource", e.target.value)}
                        >
                          <option>Social Media</option>
                          <option>Through Coach</option>
                          <option>Academy Event</option>
                          <option>Google Search</option>
                          <option>Friend/Word of Mouth</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Age Proof *</Label>
                        <div className="relative h-14">
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'age')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            required
                          />
                          <div className={cn(
                            "h-full w-full border border-dashed rounded-xl flex items-center justify-center gap-2 px-4 transition-all",
                            files.age ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-slate-300 bg-slate-50 text-slate-400"
                          )}>
                            {files.age ? <CheckCircle2 className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                            <span className="text-xs font-bold truncate">{files.age ? files.age.name : "Upload Document"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Payment Proof *</Label>
                        <div className="relative h-14">
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'payment')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            required
                          />
                          <div className={cn(
                            "h-full w-full border border-dashed rounded-xl flex items-center justify-center gap-2 px-4 transition-all",
                            files.payment ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-slate-300 bg-slate-50 text-slate-400"
                          )}>
                            {files.payment ? <CheckCircle2 className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                            <span className="text-xs font-bold truncate">{files.payment ? files.payment.name : "Upload Screenshot"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-16 bg-orange-600 hover:bg-slate-900 text-white text-lg font-black rounded-2xl transition-all shadow-xl shadow-orange-600/10"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" /> PROCESSING...
                      </span>
                    ) : (
                      "SUBMIT REGISTRATION"
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
