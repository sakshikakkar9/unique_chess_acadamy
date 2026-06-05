import React from "react";
import { Course } from "@/types";
import {
  Clock, Calendar, Globe,
  FileText, ShieldCheck, Star,
  Check, ArrowRight, Upload, CheckCircle2,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentDisplay from "@/components/shared/PaymentDisplay";
import { formatINR, formatTime } from "@/lib/formatUtils";

interface CoursePublicViewProps {
  course: Course;
  isRegistrationDisabled?: boolean;
  registrationStatus?: string;
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
  isRegistrationDisabled = false,
  registrationStatus = "OPEN",
  form = {},
  set = () => {},
  handleFileChange = () => {},
  handleSubmit = (e) => e.preventDefault(),
  loading = false,
  files = {},
  isPreview = false
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* RIGHT COLUMN: Sticky Form (Shown first on mobile) */}
      <div className="lg:sticky lg:top-24 lg:order-2">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Form header */}
          <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-blue-400" />
              <div>
                <p className="text-sm font-bold text-white">Registration Form</p>
              </div>
            </div>
            {/* Status Badge */}
            <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", registrationStatus === "OPEN" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>
              {registrationStatus}
            </div>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className={cn("space-y-4 transition-all", isRegistrationDisabled && "opacity-40 grayscale pointer-events-none")}>
            <div className="space-y-1.5">
              <LabelItem label="Student Full Name" required />
              <input
                value={form.studentName || ""}
                onChange={(e) => set("studentName", e.target.value)}
                required
                disabled={isRegistrationDisabled || isPreview}
                pattern="[A-Za-z\s]+"
                title="Only letters and spaces are allowed"
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
                    disabled={isRegistrationDisabled || isPreview}
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
                    disabled={isRegistrationDisabled || isPreview}
                  >
                    <option value="">Select Age</option>
                    <option value="U-7">U-7</option>
                    <option value="U-9">U-9</option>
                    <option value="U-11">U-11</option>
                    <option value="U-13">U-13</option>
                    <option value="U-15">U-15</option>
                    <option value="U-17">U-17</option>
                    <option value="U-19">U-19</option>
                    <option value="Open">Open</option>
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
                  disabled={isRegistrationDisabled || isPreview}
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
                  disabled={isRegistrationDisabled || isPreview}
                  pattern="\d{10}"
                  maxLength={10}
                  title="Phone number must be exactly 10 digits"
                  placeholder="10-digit number"
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
                disabled={isRegistrationDisabled || isPreview}
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
                  disabled={isRegistrationDisabled || isPreview}
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
                  <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'age')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!isPreview} disabled={isRegistrationDisabled || isPreview} />
                  <div className={cn("h-[42px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.age ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400 group-hover/file:border-blue-400")}>
                    {files.age ? <CheckCircle2 className="size-4" /> : <Upload className="size-4" />}
                    <span className="text-xs font-bold uppercase tracking-wider truncate">{files.age ? "Uploaded" : "Upload"}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <LabelItem label="Payment Proof" required />
                <div className="relative group/file">
                  <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'payment')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!isPreview} disabled={isRegistrationDisabled || isPreview} />
                  <div className={cn("h-[42px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.payment ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400 group-hover/file:border-blue-400")}>
                    {files.payment ? <CheckCircle2 className="size-4" /> : <Upload className="size-4" />}
                    <span className="text-xs font-bold uppercase tracking-wider truncate">{files.payment ? "Uploaded" : "Upload"}</span>
                  </div>
                </div>
              </div>
            </div>

            </div>
            <button
              type="submit"
              disabled={loading || isRegistrationDisabled || isPreview}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed h-auto mt-4"
            >
              {loading ? "Processing..." : <>Enroll Now <ArrowRight className="size-4" /></>}
            </button>
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
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Course Details</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
              {course.title}
            </h1>

                       <div className="w-full flex justify-start">
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl lg:max-w-2xl">
    {[
      {
        icon: <Clock className="size-4 text-blue-500 shrink-0" />,
        label: 'Duration',
        value: course.duration ?? '—'
      },
      {
        icon: <Star className="size-4 text-amber-500 shrink-0" />,
        label: 'Level',
        value: course.skillLevel ?? '—'
      },
      {
        icon: <Globe className="size-4 text-green-500 shrink-0" />,
        label: 'Mode',
        value: course.mode ?? '—'
      },
      {
        icon: <Clock className="size-4 text-purple-500 shrink-0" />,
        label: 'Class Time',
        value: course.classTime ? formatTime(course.classTime) : '—'
      },
    ].map(info => (
      <div 
        key={info.label} 
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-left flex items-center gap-3 h-full"
      >
        <div className="flex items-center justify-center shrink-0">
          {info.icon}
        </div>
        <div className="flex flex-col justify-center items-start min-w-0 flex-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left leading-none mb-1">
            {info.label}
          </p>
          {/* Removed truncation and enabled word wrapping for full visibility */}
          <p className="text-sm font-semibold text-slate-900 text-left leading-snug break-words w-full">
            {info.value}
          </p>
        </div>
      </div>
    ))}
  </div>
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
        <div className="flex flex-col justify-between h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
          <div className="flex flex-col h-full space-y-6">
            
            {/* Clean, High-Contrast Fee Banner */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Course Fee</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{formatINR(course.fee ?? 0)}</p>
              </div>
              <div className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-emerald-100">
                Secure UPI
              </div>
            </div>

            {/* Stacked Layout: Instructions First */}
            <div className="w-full">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">How to pay:</h4>
              <ol className="space-y-3.5">
                {[
                  'Scan the QR code with any UPI app',
                  'Enter the course fee amount',
                  'Add your name in payment remarks',
                  'Upload payment screenshot below',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold flex items-center justify-center border border-blue-100 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-600 leading-relaxed font-medium">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Mobile-Optimized QR Display Container */}
            <div className="w-full max-w-[240px] aspect-square bg-white border border-slate-200/80 rounded-none overflow-hidden p-0 mx-auto flex items-center justify-center">
  {/* Forces the QR code inside <PaymentDisplay /> to completely fill the square */}
  <div className="w-full h-full flex items-center justify-center 
    [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:rounded-none
    [&_p]:hidden [&_span]:hidden [&_div]:border-none [&_div]:bg-transparent [&_div]:p-0 [&_div]:rounded-none">
    <PaymentDisplay />
  </div>
</div>
          </div>

          {/* Help & Contact */}
          {course.contactDetails && (
            <div className="p-6 pt-0 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-slate-500 text-sm font-medium">Questions? Call <span className="text-slate-900 font-bold">{course.contactDetails}</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LabelItem = ({ label, required = false }: { label: string; required?: boolean }) => (
  <label className={cn("block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5", required && "required-field")}>
    {label}
  </label>
);
