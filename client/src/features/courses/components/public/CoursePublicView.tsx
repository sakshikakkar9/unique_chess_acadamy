import React from "react";
import { Course } from "@/types";
import {
  Clock, Calendar, Globe,
  FileText, ShieldCheck, Star,
  Check, ArrowRight, Upload, CheckCircle2,
  ChevronDown, IndianRupee
} from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentDisplay from "@/components/shared/PaymentDisplay";
import { formatINR, formatTime } from "@/lib/formatUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CoursePublicViewProps {
  course: Course;
  form?: any;
  set?: (key: string, value: string) => void;
  handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>, type: 'age' | 'payment') => void;
  handleSubmit?: (e: React.FormEvent) => void;
  loading?: boolean;
  files?: any;
  isPreview?: boolean;
  onBrochureDownload?: (e: React.MouseEvent, url: string) => void;
}

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2000&auto=format&fit=crop";

export const CoursePublicView: React.FC<CoursePublicViewProps> = ({
  course,
  form = {},
  set = () => {},
  handleFileChange = () => {},
  handleSubmit = (e) => e.preventDefault(),
  loading = false,
  files = {},
  isPreview = false
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* LEFT COLUMN: Course Info & Payment (Shown first on mobile) */}
      <Card className="p-6 space-y-8">
        {/* Section 1 — Course Header */}
        <div className="space-y-6">
          <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden">
            <img
              src={course.custom_banner_url || DEFAULT_BANNER}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
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

        {/* Section 2 — Training Schedule */}
        {course.days && course.days.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
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
          </div>
        )}

        {/* Section 3 — About Program */}
        {course.description && (
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-slate-100">
                <FileText className="size-4 text-slate-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">About This Program</h3>
            </div>
            <div className="prose prose-sm max-w-none text-slate-600 ql-editor ql-viewer p-0" dangerouslySetInnerHTML={{ __html: course.description }} />
          </div>
        )}

        {/* Section 4 — Payment Portal */}
        <div className="pt-6 border-t border-slate-100">
          <Card className="bg-slate-900 border-none px-8 py-6 flex items-center justify-between rounded-xl mb-8">
            <div>
              <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Course Investment</p>
              <p className="text-4xl font-black text-white">{formatINR(course.fee ?? 0)}</p>
            </div>
            <div className="text-white opacity-20">
              <IndianRupee className="size-12" strokeWidth={3} />
            </div>
          </Card>

          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            <div className="flex-1 w-full">
              <p className="text-sm font-bold text-slate-900 mb-4">How to pay:</p>
              <div className="grid gap-3">
                {[
                  { title: "Scan & Pay", desc: "Scan the QR code with any UPI app" },
                  { title: "Amount", desc: "Enter the exact course fee amount" },
                  { title: "Remarks", desc: "Add student name in payment remarks" },
                  { title: "Screenshot", desc: "Upload payment proof in the form" },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 leading-none mb-1">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-3 w-full lg:w-auto">
              <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm max-w-[200px] mx-auto lg:mx-0">
                <PaymentDisplay />
              </div>
              <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest">Scan to pay</p>
            </div>
          </div>

          {/* Help & Brochure */}
          <div className={cn("flex items-center justify-between gap-4 pt-8 mt-8 border-t border-slate-100", (!course.contactDetails && !course.brochureUrl) && "hidden")}>
            <p className={cn("text-slate-500 text-sm font-medium", !course.contactDetails && "hidden")}>
              Questions? Call <span className="text-slate-900 font-bold">{course.contactDetails}</span>
            </p>
            <Button
              onClick={(e) => onBrochureDownload?.(e, course.brochureUrl!)}
              size="sm"
              className={cn("bg-blue-600 hover:bg-blue-700 font-bold text-[10px] uppercase tracking-widest rounded-xl", !course.brochureUrl && "hidden")}
            >
              <FileText className="size-3.5" />
              Brochure
            </Button>
          </div>
        </div>
      </Card>

      {/* RIGHT COLUMN: Sticky Form */}
      <div className="lg:sticky lg:top-24">
        <Card className="overflow-hidden">
          {/* Form header */}
          <div className="bg-slate-900 px-5 py-4 flex items-center gap-3">
            <ShieldCheck className="size-5 text-blue-400" />
            <div>
              <p className="text-sm font-bold text-white">Registration Form</p>
            </div>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="space-y-1.5">
              <LabelItem label="Student Full Name" required />
              <input
                value={form.studentName || ""}
                onChange={(e) => set("studentName", e.target.value)}
                required
                disabled={isPreview}
                placeholder="Enter full name"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 h-auto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <LabelItem label="Gender" required />
                <div className="relative">
                  <select
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 appearance-none h-[42px]"
                    value={form.gender || "Male"}
                    onChange={(e) => set("gender", e.target.value)}
                    required
                    disabled={isPreview}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <LabelItem label="Category" required />
                <div className="relative">
                  <select
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 appearance-none h-[42px]"
                    value={form.category || ""}
                    onChange={(e) => set("category", e.target.value)}
                    required
                    disabled={isPreview}
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
                <LabelItem label="Date of Birth" required />
                <input
                  type="date"
                  value={form.dob || ""}
                  onChange={(e) => set("dob", e.target.value)}
                  required
                  disabled={isPreview}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 h-auto"
                />
              </div>
              <div className="space-y-1.5">
                <LabelItem label="Phone Number" required />
                <input
                  type="tel"
                  value={form.phone || ""}
                  onChange={(e) => set("phone", e.target.value)}
                  required
                  disabled={isPreview}
                  placeholder="+91"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 h-auto"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <LabelItem label="Address" required />
              <textarea
                value={form.address || ""}
                onChange={(e) => set("address", e.target.value)}
                required
                disabled={isPreview}
                placeholder="Residential address"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 min-h-[80px] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <LabelItem label="How did you get the course info?" required />
              <div className="relative">
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 appearance-none h-[42px]"
                  value={form.discoverySource || "Social Media"}
                  onChange={(e) => set("discoverySource", e.target.value)}
                  required
                  disabled={isPreview}
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
                <LabelItem label="Age Proof" required />
                <div className="relative group/file">
                  <input type="file" onChange={(e) => handleFileChange(e, 'age')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!isPreview} disabled={isPreview} />
                  <div className={cn("h-[42px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.age ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400 group-hover/file:border-blue-400")}>
                    {files.age ? <CheckCircle2 className="size-4" /> : <Upload className="size-4" />}
                    <span className="text-xs font-bold uppercase tracking-wider truncate">{files.age ? "Uploaded" : "Upload"}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <LabelItem label="Payment Proof" required />
                <div className="relative group/file">
                  <input type="file" onChange={(e) => handleFileChange(e, 'payment')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!isPreview} disabled={isPreview} />
                  <div className={cn("h-[42px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.payment ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400 group-hover/file:border-blue-400")}>
                    {files.payment ? <CheckCircle2 className="size-4" /> : <Upload className="size-4" />}
                    <span className="text-xs font-bold uppercase tracking-wider truncate">{files.payment ? "Uploaded" : "Upload"}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || isPreview}
              className={cn(
                "w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-6 rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-4",
                isPreview && "hidden"
              )}
            >
              {loading ? "Processing..." : <>Enroll Now <ArrowRight className="size-4" /></>}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

const LabelItem = ({ label, required = false }: { label: string; required?: boolean }) => (
  <label className={cn("block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5", required && "required-field")}>
    {label}
  </label>
);
