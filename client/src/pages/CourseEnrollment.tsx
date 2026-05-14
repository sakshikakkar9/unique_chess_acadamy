import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminCourses } from "@/features/courses/hooks/useAdminCourses";
import { courseService } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, CheckCircle2, Loader2, Upload,
  Clock, Calendar, ShieldCheck, ChevronDown,
  Star, ArrowRight, Check, FileText, Globe
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import PaymentDisplay from "@/components/shared/PaymentDisplay";
import 'react-quill/dist/quill.snow.css';
import { formatINR, formatTime } from "@/lib/formatUtils";

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
      description: "The course brochure is being downloaded.",
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
        description: err.response?.data?.error || "Failed to submit enrollment."
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Course not found</h1>
        <Button onClick={() => navigate("/courses")} className="rounded-xl font-bold">Back to Courses</Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 pt-40 pb-20 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md space-y-6">
            <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Enrollment Successful!</h1>
            <p className="text-slate-500 leading-relaxed">Your registration for <span className="text-blue-600 font-semibold">{course.title}</span> has been submitted.</p>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference ID</p>
              <p className="text-3xl font-bold text-blue-600 tracking-tight">{refId}</p>
            </div>

            <Button onClick={() => navigate("/courses")} className="w-full h-16 bg-slate-900 hover:bg-blue-600 rounded-2xl font-bold transition-all text-white text-lg">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back link */}
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6">
          <ArrowLeft className="size-4" />
          Back to Programs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
          {/* RIGHT COLUMN: Sticky Form (Shown first on mobile) */}
          <div className="lg:sticky lg:top-24 lg:order-2">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Form header */}
              <div className="bg-slate-900 px-5 py-4 flex items-center gap-3">
                <ShieldCheck className="size-5 text-blue-400" />
                <div>
                  <p className="text-sm font-bold text-white">Secure Enrollment</p>
                  <p className="text-xs text-white/50 mt-0.5">Step 1 of 1 · SSL Protected</p>
                </div>
              </div>

              {/* Form fields */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 required-field">Student Full Name</Label>
                  <Input
                    value={form.studentName}
                    onChange={(e) => set("studentName", e.target.value)}
                    required
                    placeholder="Enter full name"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 h-auto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 required-field">Gender</Label>
                    <div className="relative">
                      <select
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 appearance-none h-[42px]"
                        value={form.gender}
                        onChange={(e) => set("gender", e.target.value)}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 required-field">Category</Label>
                    <div className="relative">
                      <select
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 appearance-none h-[42px]"
                        value={form.category}
                        onChange={(e) => set("category", e.target.value)}
                        required
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Professional">Professional</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 required-field">Date of Birth</Label>
                    <Input
                      type="date"
                      value={form.dob}
                      onChange={(e) => set("dob", e.target.value)}
                      required
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 h-auto"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 required-field">Phone Number</Label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      required
                      placeholder="+91"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 h-auto"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 required-field">Address</Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    required
                    placeholder="Residential address"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 required-field">How did you get the course info?</Label>
                  <div className="relative">
                    <select
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 appearance-none h-[42px]"
                      value={form.discoverySource}
                      onChange={(e) => set("discoverySource", e.target.value)}
                      required
                    >
                      <option value="Social Media">Social Media</option>
                      <option value="Through Academy">Through Academy</option>
                      <option value="Through Coaches">Through Coaches</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 required-field">Age Proof</Label>
                    <div className="relative group/file">
                      <input type="file" onChange={(e) => handleFileChange(e, 'age')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required />
                      <div className={cn("h-[42px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.age ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400 group-hover/file:border-blue-400")}>
                        {files.age ? <CheckCircle2 className="size-4" /> : <Upload className="size-4" />}
                        <span className="text-xs font-bold uppercase tracking-wider truncate">{files.age ? "Uploaded" : "Upload"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 required-field">Payment Proof</Label>
                    <div className="relative group/file">
                      <input type="file" onChange={(e) => handleFileChange(e, 'payment')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required />
                      <div className={cn("h-[42px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.payment ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400 group-hover/file:border-blue-400")}>
                        {files.payment ? <CheckCircle2 className="size-4" /> : <Upload className="size-4" />}
                        <span className="text-xs font-bold uppercase tracking-wider truncate">{files.payment ? "Uploaded" : "Upload"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed h-auto mt-4"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Enroll Now <ArrowRight className="size-4" /></>}
                </Button>
              </form>
            </div>
          </div>

          {/* LEFT COLUMN: Course Info */}
          <div className="space-y-6 lg:order-1">
            {/* Card 1 — Course Header */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative aspect-video bg-slate-100">
                <img
                  src={course.custom_banner_url || DEFAULT_BANNER}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Program Details</p>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
                  {course.title}
                </h1>

                {/* Info pills grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      icon: <Clock className="size-4 text-blue-500" />,
                      label: 'Duration',
                      value: course.duration ?? '—'
                    },
                    {
                      icon: <Star className="size-4 text-amber-500" />,
                      label: 'Level',
                      value: course.skillLevel ?? '—'
                    },
                    {
                      icon: <Globe className="size-4 text-green-500" />,
                      label: 'Mode',
                      value: course.mode ?? '—'
                    },
                    {
                      icon: <Clock className="size-4 text-purple-500" />,
                      label: 'Class Time',
                      value: course.classTime ? formatTime(course.classTime) : '—'
                    },
                  ].map(info => (
                    <div key={info.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        {info.icon}
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {info.label}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {info.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 — Training Schedule */}
            {course.days && course.days.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Calendar className="size-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Training Schedule</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                    const isActive = course.days?.includes(day) || course.days?.includes(day.toUpperCase());
                    return (
                      <div key={day}
                        className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                          }`}>
                        {day.slice(0, 3)}
                      </div>
                    );
                  })}
                </div>
                {course.classTime && (
                  <p className="text-sm text-slate-600 mt-3 flex items-center gap-2">
                    <Clock className="size-4 text-blue-500" />
                    Classes at <strong>{formatTime(course.classTime)}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Card 3 — About Program */}
            {course.description && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <FileText className="size-4 text-slate-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">About This Program</h3>
                </div>
                <div className="prose prose-sm max-w-none text-slate-600 ql-editor ql-viewer p-0" dangerouslySetInnerHTML={{ __html: course.description }} />
              </div>
            )}

            {/* Card 4 — Payment Portal */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50 font-medium mb-1">Course Investment</p>
                  <p className="text-2xl font-black text-white">{formatINR(course.fee ?? 0)}</p>
                </div>
                <div className="text-3xl opacity-20 select-none text-white font-bold">₹</div>
              </div>

              <div className="p-6 flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 mb-3">How to pay:</p>
                  <ol className="space-y-2.5">
                    {[
                      'Scan the QR code with any UPI app',
                      'Enter the course fee amount',
                      'Add your name in payment remarks',
                      'Upload payment screenshot in the form',
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm text-slate-600">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className="border-2 border-slate-200 rounded-xl p-3 bg-white shadow-sm">
                    <PaymentDisplay />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest">Scan to pay</p>
                </div>
              </div>

              {/* Help & Brochure */}
              {(course.contactDetails || course.brochureUrl) && (
                <div className="p-6 pt-0 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  {course.contactDetails && (
                    <p className="text-slate-500 text-sm font-medium">Questions? Call <span className="text-slate-900 font-bold">{course.contactDetails}</span></p>
                  )}
                  {course.brochureUrl && (
                    <button
                      onClick={(e) => handleBrochureDownload(e, course.brochureUrl!)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all"
                    >
                      <FileText className="size-3.5" />
                      Download Brochure
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
