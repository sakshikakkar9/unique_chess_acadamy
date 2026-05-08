import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
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
  Zap, HelpCircle, FileText
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "@/components/shared/motion";
import PaymentDisplay from "@/components/shared/PaymentDisplay";
import OrientationWrapper from "@/features/tournaments/components/OrientationWrapper";
import 'react-quill/dist/quill.snow.css';

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2000&auto=format&fit=crop";

export default function CourseEnrollmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ["course-enrollments"] });
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
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="mb-12">
          <Link to="/courses" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors group uppercase tracking-[0.2em]">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Programs</span>
          </Link>
        </div>

        <OrientationWrapper
          orientation={course.posterOrientation}
          poster={
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className={cn(
              "relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white",
              course.posterOrientation === 'PORTRAIT' ? "aspect-[3/4]" : "aspect-video"
            )}>
              <img
                src={course.custom_banner_url || DEFAULT_BANNER}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg">
                  {course.mode}
                </span>
              </div>
            </motion.div>
          }
          details={
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-12">
              <motion.div variants={fadeUp} className="space-y-10">
                {/* Title & Description */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
                      Course Details
                    </span>
                    <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                      {course.title}
                    </h1>
                  </div>

                  {course.description && (
                    <div
                      className="text-slate-600 font-medium leading-relaxed text-base ql-editor ql-viewer p-0"
                      dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                  )}
                </div>

                {/* Info Grid - Clean & Minimal */}
                <div className="grid grid-cols-2 gap-y-8 gap-x-12 py-4 border-t border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Skill Level</p>
                      <p className="text-base font-bold text-slate-900">{course.skillLevel}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Duration</p>
                      <p className="text-base font-bold text-slate-900">{course.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Age Group</p>
                      <p className="text-base font-bold text-slate-900">{course.ageGroup}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Class Time</p>
                      <p className="text-base font-bold text-slate-900">{course.classTime}</p>
                    </div>
                  </div>
                </div>

                {/* Training Days - Simplified Alignment */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Weekly Training Schedule</p>
                  <div className="flex flex-wrap gap-2">
                    {course.days.map((day) => (
                      <span key={day} className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-100 uppercase tracking-wider">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact & Resources - Clean Row */}
                <div className="flex flex-wrap gap-8 py-6 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      <HelpCircle className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support</p>
                      <p className="text-base font-bold text-slate-900">{course.contactDetails}</p>
                    </div>
                  </div>

                  {course.brochureUrl && (
                    <button
                      onClick={(e) => handleBrochureDownload(e, course.brochureUrl!)}
                      className="flex items-center gap-4 group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Resources</p>
                        <p className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors underline decoration-blue-600/20 underline-offset-4">Brochure PDF</p>
                      </div>
                    </button>
                  )}
                </div>

                {/* Payment Section - Refined */}
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Investment</p>
                      <p className="text-4xl font-bold text-blue-600 tracking-tighter">₹{course.fee.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <PaymentDisplay />
                </div>
              </motion.div>
            </motion.div>
          }
          form={
            <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
              <div className="h-3 bg-blue-600" />
              <CardContent className="p-10 md:p-14">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                      <ShieldCheck className="h-6 w-6 text-blue-600" />
                      <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Registration</h2>
                    </div>

                    <div className="space-y-6">
                      {/* Player Name */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Player Name <span className="text-[#FF0000]">*</span></Label>
                        <div className="relative">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <Input
                            value={form.studentName}
                            onChange={(e) => set("studentName", e.target.value)}
                            required
                            placeholder="Enter player's full name"
                            className="h-16 pl-14 rounded-2xl border-slate-200 bg-slate-50/50 font-semibold text-slate-900 focus:ring-blue-600 transition-all placeholder:text-slate-300"
                          />
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Gender <span className="text-[#FF0000]">*</span></Label>
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
                                <div className="h-6 w-6 rounded-full border border-slate-200 peer-checked:border-blue-600 transition-all" />
                                <div className="absolute h-3 w-3 rounded-full bg-blue-600 scale-0 peer-checked:scale-100 transition-transform" />
                              </div>
                              <span className={cn("text-base font-semibold tracking-tight transition-colors", form.gender === g ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")}>
                                {g}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Category */}
                        <div className="space-y-3">
                          <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Category <span className="text-[#FF0000]">*</span></Label>
                          <div className="relative">
                            <select
                              className="w-full h-16 rounded-2xl border border-slate-100 bg-slate-50/50 px-5 text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer pr-12"
                              value={form.category}
                              onChange={(e) => set("category", e.target.value)}
                              required
                            >
                              <option value="">Select Category</option>
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Professional">Professional</option>
                              <option value="Under-7">Under-7</option>
                              <option value="Under-9">Under-9</option>
                              <option value="Under-11">Under-11</option>
                              <option value="Under-13">Under-13</option>
                              <option value="Under-15">Under-15</option>
                              <option value="Open">Open</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-3">
                          <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Date of Birth <span className="text-[#FF0000]">*</span></Label>
                          <Input
                            type="date"
                            value={form.dob}
                            onChange={(e) => set("dob", e.target.value)}
                            required
                            className="h-16 rounded-2xl border border-slate-100 bg-slate-50/50 font-semibold text-slate-900 px-5"
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Phone Number <span className="text-[#FF0000]">*</span></Label>
                        <Input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          required
                          placeholder="+91 XXXXX XXXXX"
                          className="h-16 rounded-2xl border border-slate-100 bg-slate-50/50 font-semibold text-slate-900 px-5"
                        />
                      </div>

                      {/* Address */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Full Residential Address <span className="text-[#FF0000]">*</span></Label>
                        <Textarea
                          value={form.address}
                          onChange={(e) => set("address", e.target.value)}
                          required
                          placeholder="Enter complete address"
                          className="rounded-2xl border border-slate-100 bg-slate-50/50 min-h-[120px] p-5 font-medium text-slate-900 resize-none focus:ring-blue-600 transition-all"
                        />
                      </div>

                      {/* Discovery Source */}
                      <div className="space-y-3">
                        <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">How did you find us? <span className="text-[#FF0000]">*</span></Label>
                        <div className="relative">
                          <select
                            className="w-full h-16 rounded-2xl border border-slate-100 bg-slate-50/50 px-5 text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer pr-12"
                            value={form.discoverySource}
                            onChange={(e) => set("discoverySource", e.target.value)}
                            required
                          >
                            <option value="">Select Option</option>
                            <option>Social Media</option>
                            <option>Google Search</option>
                            <option>Friend / Recommendation</option>
                            <option>Academy Advertisement</option>
                            <option>Through Coach</option>
                            <option>Other</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="space-y-8 pt-10 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Verification Documents</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Age Proof <span className="text-[#FF0000]">*</span></Label>
                        <div className="relative h-20">
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'age')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            required
                          />
                          <div className={cn(
                            "h-full w-full border border-dashed rounded-2xl flex items-center justify-center gap-3 px-5 transition-all",
                            files.age ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-400"
                          )}>
                            {files.age ? <CheckCircle2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                            <span className="text-sm font-semibold truncate">{files.age ? files.age.name : "Upload ID Proof"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[11px] font-semibold uppercase text-slate-400 tracking-[0.2em] ml-1">Payment Screenshot <span className="text-[#FF0000]">*</span></Label>
                        <div className="relative h-20">
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'payment')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            required
                          />
                          <div className={cn(
                            "h-full w-full border border-dashed rounded-2xl flex items-center justify-center gap-3 px-5 transition-all",
                            files.payment ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-400"
                          )}>
                            {files.payment ? <CheckCircle2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                            <span className="text-sm font-semibold truncate">{files.payment ? files.payment.name : "Upload Proof"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-20 bg-blue-600 hover:bg-slate-900 text-white text-xl font-bold rounded-3xl transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] uppercase tracking-wider"
                  >
                    {loading ? (
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
