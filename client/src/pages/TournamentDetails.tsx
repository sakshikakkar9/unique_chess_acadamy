import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminTournaments } from "@/features/tournaments/hooks/useAdminTournaments";
import { useTournamentRegistration } from "@/features/tournaments/hooks/useTournamentRegistration";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, CheckCircle2, Loader2,
  Copy
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TournamentPublicView } from "@/features/tournaments/components/public/TournamentPublicView";
import 'react-quill/dist/quill.snow.css';

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
    fideId: "",
    fideRating: "",
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back link */}
        <Link to="/tournaments" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6">
          <ArrowLeft className="size-4" />
          Back to Arenas
        </Link>

        <TournamentPublicView
          tournament={tournament}
          isRegistrationDisabled={isRegistrationDisabled}
          registrationStatus={registrationStatus}
          form={form}
          set={set}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          isPending={isPending}
          files={files}
          onBrochureDownload={handleBrochureDownload}
        />
      </div>

      <Footer />
    </div>
  );
}
