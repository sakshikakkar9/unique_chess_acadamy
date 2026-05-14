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
  Clock, Calendar, ShieldCheck, User, ChevronDown,
  Star, ArrowRight, Check, FileText, Globe
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
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* LEFT COLUMN: Scrollable Info */}
        <div className="flex-1 lg:h-screen lg:overflow-y-auto bg-slate-50">
          <div className="max-w-3xl ml-auto mr-0 px-6 sm:px-10 lg:px-16 pt-24 pb-20">
            {/* Back link */}
            <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors mb-10">
              <ArrowLeft className="size-4" />
              BACK TO PROGRAMS
            </Link>

            <div className="space-y-12">
              {/* Header */}
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">Program Details</p>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  {course.title}
                </h1>
              </div>

              {/* Banner */}
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-200">
                <img
                  src={course.custom_banner_url || DEFAULT_BANNER}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Clock className="size-5 text-blue-600" />, label: 'Duration', value: course.duration },
                  { icon: <Star className="size-5 text-blue-600" />, label: 'Level', value: course.skillLevel },
                  { icon: <Globe className="size-5 text-blue-600" />, label: 'Mode', value: course.mode },
                  { icon: <Calendar className="size-5 text-blue-600" />, label: 'Schedule', value: course.classTime },
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

              {/* Description */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                  <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">About Program</h2>
                </div>
                <div className="text-slate-600 leading-relaxed text-lg ql-editor ql-viewer p-0" dangerouslySetInnerHTML={{ __html: course.description || '' }} />
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
                        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Investment</p>
                        <p className="text-5xl font-black tracking-tight">₹{course.fee?.toLocaleString()}</p>
                      </div>
                      <ul className="space-y-3">
                        {['Lifetime access', 'Live sessions', 'Certification'].map(pt => (
                          <li key={pt} className="flex items-center gap-3 text-white/70 text-sm font-medium">
                            <Check className="size-4 text-emerald-500" /> {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex-shrink-0 bg-white p-4 rounded-3xl">
                      <PaymentDisplay />
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Schedule */}
              {course.days && course.days.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Weekly Training Days</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.days.map((day) => (
                      <span key={day} className="px-6 py-3 bg-white text-slate-900 text-xs font-bold rounded-2xl border border-slate-200 uppercase tracking-widest shadow-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Help & Brochure */}
              <div className="pt-10 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-slate-500 font-medium">Questions? Call <span className="text-slate-900 font-bold">{course.contactDetails}</span></p>
                {course.brochureUrl && (
                  <button
                    onClick={(e) => handleBrochureDownload(e, course.brochureUrl!)}
                    className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                  >
                    <FileText className="size-4" />
                    Download Brochure
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Form */}
        <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 bg-white flex items-center justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-lg">
            <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 sm:p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Secure Enrollment</h2>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">Step 1 of 1</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Full Name</Label>
                  <Input
                    value={form.studentName}
                    onChange={(e) => set("studentName", e.target.value)}
                    required
                    placeholder="Enter full name"
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-all text-base px-6"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</Label>
                    <div className="relative">
                      <select
                        className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-6 text-sm appearance-none focus:bg-white transition-all"
                        value={form.gender}
                        onChange={(e) => set("gender", e.target.value)}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</Label>
                    <div className="relative">
                      <select
                        className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-6 text-sm appearance-none focus:bg-white transition-all"
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
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</Label>
                    <Input
                      type="date"
                      value={form.dob}
                      onChange={(e) => set("dob", e.target.value)}
                      required
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white px-6"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</Label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      required
                      placeholder="+91"
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white px-6"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    required
                    placeholder="Residential address"
                    className="rounded-2xl border-slate-200 bg-slate-50 focus:bg-white px-6 py-4 min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Age Proof</Label>
                    <div className="relative group/file">
                      <input type="file" onChange={(e) => handleFileChange(e, 'age')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required />
                      <div className={cn("h-14 border border-dashed rounded-2xl flex items-center justify-center gap-2 transition-all px-4", files.age ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400 group-hover/file:border-blue-400")}>
                        {files.age ? <CheckCircle2 className="size-4" /> : <Upload className="size-4" />}
                        <span className="text-xs font-bold uppercase tracking-wider truncate">{files.age ? "Uploaded" : "Upload"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Proof</Label>
                    <div className="relative group/file">
                      <input type="file" onChange={(e) => handleFileChange(e, 'payment')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required />
                      <div className={cn("h-14 border border-dashed rounded-2xl flex items-center justify-center gap-2 transition-all px-4", files.payment ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400 group-hover/file:border-blue-400")}>
                        {files.payment ? <CheckCircle2 className="size-4" /> : <Upload className="size-4" />}
                        <span className="text-xs font-bold uppercase tracking-wider truncate">{files.payment ? "Uploaded" : "Upload"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/20 mt-4 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>ENROLL NOW <ArrowRight className="size-5" /></>}
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
