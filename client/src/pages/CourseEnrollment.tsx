import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { courseService } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, CheckCircle2, Loader2, Upload,
  Clock, Calendar, BarChart3,
  ShieldCheck, CreditCard, User, ChevronDown,
  Zap, HelpCircle, FileText, Star, ArrowRight, Check
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import PaymentDisplay from "@/components/shared/PaymentDisplay";
import 'react-quill/dist/quill.snow.css';

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2000&auto=format&fit=crop";

export default function CourseEnrollmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courses, isLoading } = useAdminCourses();

  const course = useMemo(() => courses.find((c) => c.id === id), [courses, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loading, setLoading] = useState(false);
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
    phone: "",
    address: "",
    discoverySource: "Social Media",
    category: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'age' | 'payment') => {
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
      description: "The course brochure is being downloaded to your system.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    if (!files.age || !files.payment) {
      toast({
        variant: "destructive",
        title: "Missing Files",
        description: "Please upload both Age Proof and Payment Proof."
      });
      return;
    }

    setLoading(true);
    try {
      const result = await courseService.enroll(course.id, {
        ...form,
        ageProof: files.age,
        paymentProof: files.payment,
        experienceLevel: course.skillLevel,
        email: "",
        fideId: "NA",
        fideRating: 0
      });

      setRefId(result.referenceId);
      setSuccess(true);
      toast({ title: "Enrollment Successful!", description: "Your application has been received." });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || "Failed to submit enrollment. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Course not found</h1>
        <Button onClick={() => navigate("/courses")} className="rounded-xl font-semibold">Back to Courses</Button>
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
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Enrollment Successful!</h1>
            <p className="text-slate-500 font-medium leading-relaxed">Your registration for <span className="text-blue-600 font-semibold">{course.title}</span> has been submitted. Our team will review your application and contact you shortly.</p>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] space-y-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Reference ID</p>
              <p className="text-3xl font-bold text-blue-600 tracking-tight">{refId}</p>
            </div>

            <Button onClick={() => navigate("/courses")} className="w-full h-16 bg-slate-900 hover:bg-blue-600 rounded-2xl font-bold transition-all text-white text-lg shadow-lg shadow-slate-900/10">
              RETURN TO PROGRAMS
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
        <Link to="/courses"
           className="inline-flex items-center gap-2 text-sm font-medium
                      text-slate-500 hover:text-slate-900 transition-colors duration-150">
          <ArrowLeft className="size-4" />
          Back to Programs
        </Link>
      </div>

      {/* Main two-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Title Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Course Details
              </p>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
                {course.title}
              </h1>
            </div>

            {/* Banner card */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
              <img
                src={course.custom_banner_url || DEFAULT_BANNER}
                alt={course.title}
                className="w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Info pills grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Clock className="size-4 text-blue-500" />,  label: 'Duration',  value: course.duration },
                { icon: <Star className="size-4 text-blue-500" />,   label: 'Level',     value: course.skillLevel },
                { icon: <User className="size-4 text-blue-500" />,   label: 'Mode',     value: course.mode },
                { icon: <Calendar className="size-4 text-blue-500" />, label: 'Schedule', value: course.classTime },
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

            {/* Description card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-lg bg-slate-100">
                  <FileText className="size-4 text-slate-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Course Overview
                </h3>
              </div>
              <div
                className="text-sm text-slate-600 leading-relaxed ql-editor ql-viewer p-0"
                dangerouslySetInnerHTML={{ __html: course.description || '' }}
              />
            </div>

            {/* Training Days */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Calendar className="size-4 text-slate-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Weekly Schedule
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {course.days?.map((day) => (
                  <span key={day} className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-100 uppercase tracking-wider">
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {/* Resources card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-lg bg-slate-100">
                  <HelpCircle className="size-4 text-slate-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Resources & Support
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-600">Need help? Contact: <span className="font-bold text-slate-900">{course.contactDetails}</span></p>
                </div>
                {course.brochureUrl && (
                  <button
                    onClick={(e) => handleBrochureDownload(e, course.brochureUrl!)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    <FileText className="size-4" />
                    Download Brochure PDF
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — sticky enrollment card */}
          <div className="lg:sticky lg:top-24 order-1 lg:order-2">
            {/* Enrollment card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-900 px-6 py-5">
                <p className="text-xs text-white/50 font-medium mb-1">Course Fee</p>
                <p className="text-3xl font-black text-white">
                  ₹{course.fee?.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Single Payment</p>
              </div>

              <div className="p-6 space-y-4">
                <ul className="space-y-2.5">
                  {[
                    'Lifetime access to course material',
                    'Live sessions with FIDE-rated coaches',
                    'Certificate upon completion',
                    'Access to UCA student community',
                  ].map(point => (
                    <li key={point} className="flex items-start gap-2.5">
                      <Check className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
                      <ShieldCheck className="size-5 text-blue-400" />
                      <div>
                        <p className="text-sm font-bold text-white">Enrollment Form</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Player Name *</Label>
                          <Input
                            value={form.studentName}
                            onChange={(e) => set("studentName", e.target.value)}
                            required
                            placeholder="Full Name"
                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 h-11"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gender *</Label>
                          <div className="flex gap-4">
                            {["Male", "Female", "Other"].map((g) => (
                              <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                  type="radio"
                                  name="gender"
                                  value={g}
                                  checked={form.gender === g}
                                  onChange={(e) => set("gender", e.target.value)}
                                  className="accent-blue-600 w-4 h-4 cursor-pointer"
                                />
                                <span className="text-sm text-slate-700 group-hover:text-slate-900">{g}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1.5">
                            <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category *</Label>
                            <div className="relative">
                              <select
                                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 appearance-none h-11"
                                value={form.category}
                                onChange={(e) => set("category", e.target.value)}
                                required
                              >
                                <option value="">Select</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Professional">Professional</option>
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
                              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 h-11"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone *</Label>
                          <Input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            required
                            placeholder="+91"
                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 h-11"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Address *</Label>
                          <Textarea
                            value={form.address}
                            onChange={(e) => set("address", e.target.value)}
                            required
                            placeholder="Full Address"
                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 min-h-[80px] resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1.5">
                            <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Age Proof *</Label>
                            <div className="relative">
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'age')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                required
                              />
                              <div className={cn(
                                "w-full h-11 border border-dashed rounded-xl flex items-center justify-center gap-2 px-3 transition-all text-[11px] font-bold uppercase",
                                files.age ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-400"
                              )}>
                                {files.age ? <CheckCircle2 className="size-3.5" /> : <Upload className="size-3.5" />}
                                <span className="truncate">{files.age ? "Uploaded" : "Age Proof"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment Proof *</Label>
                            <div className="relative">
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'payment')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                required
                              />
                              <div className={cn(
                                "w-full h-11 border border-dashed rounded-xl flex items-center justify-center gap-2 px-3 transition-all text-[11px] font-bold uppercase",
                                files.payment ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-400"
                              )}>
                                {files.payment ? <CheckCircle2 className="size-3.5" /> : <Upload className="size-3.5" />}
                                <span className="truncate">{files.payment ? "Uploaded" : "Payment Proof"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <PaymentDisplay />

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 h-auto"
                        >
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enroll Now"}
                          <ArrowRight className="size-4" />
                        </Button>
                      </form>
                    </div>
                  </div>

                  <a href="/contact"
                     className="block text-center text-sm text-blue-600
                                hover:text-blue-500 font-medium transition-colors">
                    Book a free demo first →
                  </a>
                </div>

                <div className="flex items-center justify-center gap-4 pt-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="size-3.5 text-green-500" />
                    Secure payment
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Star className="size-3.5 text-amber-500" />
                    4.9 rated coaches
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
