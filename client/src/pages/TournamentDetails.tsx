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

    // Name validation
    if (!/^[A-Za-z\s]+$/.test(form.studentName)) {
      toast({
        variant: "destructive",
        title: "Invalid Name",
        description: "Player name should only contain letters and spaces."
      });
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(form.phone)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Phone number must be exactly 10 digits."
      });
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address."
      });
      return;
    }

    // FIDE ID validation (Optional, but must be numeric if provided)
    if (form.fideId && !/^\d+$/.test(form.fideId)) {
      toast({
        variant: "destructive",
        title: "Invalid FIDE ID",
        description: "FIDE ID must be numeric."
      });
      return;
    }

    // FIDE Rating validation (Optional, but must be 0-3500 if provided)
    if (form.fideRating) {
      const rating = parseInt(form.fideRating);
      if (isNaN(rating) || rating < 0 || rating > 3500) {
        toast({
          variant: "destructive",
          title: "Invalid FIDE Rating",
          description: "FIDE Rating must be between 0 and 3500."
        });
        return;
      }
    }

    if (!files.payment1 || !files.payment2) {
      toast({
        variant: "destructive",
        title: "Missing Files",
        description: "Please upload both Age Proof and Payment Proof."
      });
      return;
    }

    // File validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const minSize = 100 * 1024; // 100 KB
    const maxSize = 300 * 1024; // 300 KB

    // Updated upload validation block
    for (const [key, file] of Object.entries(files)) {
      if (file) {
        const friendlyName = key === 'payment1' ? 'Age Proof' : 'Payment Proof';

        // Validate Type
        if (!allowedTypes.includes(file.type)) {
          toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: `${friendlyName} must be a JPEG or PNG image.`
          });
          return;
        }

        // Validate Size with debugging helper
        if (file.size < minSize || file.size > maxSize) {
          const actualKb = (file.size / 1024).toFixed(1);
          toast({
            variant: "destructive",
            title: "Invalid File Size",
            description: `${friendlyName} size is ${actualKb} KB. It must be strictly between 100 KB and 300 KB.`
          });
          return;
        }
      }
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
        <Button onClick={() => navigate("/tournaments")} className="rounded-xl font-bold">Back to Tournaments</Button>
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

            <Button onClick={() => navigate("/tournaments")} className="w-full h-16 bg-slate-900 hover:bg-blue-600 rounded-2xl font-bold transition-all text-white text-xs tracking-widest uppercase shadow-lg">
              Return to Tournaments
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
          Back to Tournament
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