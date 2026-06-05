import React from "react";
import { Tournament } from "@/types";
import {
  Calendar, MapPin, Trophy,
  FileText, ShieldCheck, Clock,
  Check, ArrowRight, Upload, CheckCircle2,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentDisplay from "@/components/shared/PaymentDisplay";
import { formatINR, formatDateRange } from "@/lib/formatUtils";

interface TournamentPublicViewProps {
  tournament: Tournament;
  isRegistrationDisabled?: boolean;
  registrationStatus?: string;
  form?: any;
  set?: (key: string, value: string) => void;
  handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>, type: 'payment1' | 'payment2') => void;
  handleSubmit?: (e: React.FormEvent) => void;
  isPending?: boolean;
  files?: any;
  isPreview?: boolean;
  onBrochureDownload?: (e: React.MouseEvent, url: string) => void;
}

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2000&auto=format&fit=crop";

export const TournamentPublicView: React.FC<TournamentPublicViewProps> = ({
  tournament,
  isRegistrationDisabled = false,
  registrationStatus = "OPEN",
  form = {},
  set = () => {},
  handleFileChange = () => {},
  handleSubmit = (e) => e.preventDefault(),
  isPending = false,
  files = {},
  isPreview = false,
  onBrochureDownload
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
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
              registrationStatus === "OPEN" ? "bg-emerald-500/20 text-emerald-400" :
              registrationStatus === "NOT_STARTED" ? "bg-amber-500/20 text-amber-400" :
              "bg-red-500/20 text-red-400"
            )}>
              {registrationStatus === "OPEN" ? "Open" : registrationStatus === "NOT_STARTED" ? "Soon" : "Closed"}
            </div>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className={cn("space-y-4 transition-all", isRegistrationDisabled && "opacity-40 grayscale pointer-events-none")}>
              <div className="space-y-1.5">
                <LabelItem label="Player Name" required />
                <input
                  value={form.studentName || ""}
                  onChange={(e) => set("studentName", e.target.value)}
                  required
                  disabled={isRegistrationDisabled || isPreview}
                  pattern="[A-Za-z\s]+"
                  title="Only letters and spaces are allowed"
                  placeholder="Full name"
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
                      <option value="Under-7">U-7</option>
                      <option value="Under-9">U-9</option>
                      <option value="Under-11">U-11</option>
                      <option value="Under-13">U-13</option>
                      <option value="Under-15">U-15</option>
                      <option value="Under-17">U-17</option>
                      <option value="Under-19">U-19</option>
                      <option value="Open">Open</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <LabelItem label="DOB" required />
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
                  <LabelItem label="Phone" required />
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
                <LabelItem label="Email Address" required />
                <input
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => set("email", e.target.value)}
                  required
                  disabled={isRegistrationDisabled || isPreview}
                  placeholder="email@example.com"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 h-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <LabelItem label="FIDE ID" />
                  <input
                    value={form.fideId || ""}
                    onChange={(e) => set("fideId", e.target.value)}
                    disabled={isRegistrationDisabled || isPreview}
                    placeholder="Optional"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 h-auto"
                  />
                </div>
                <div className="space-y-1.5">
                  <LabelItem label="FIDE Rating" />
                  <input
                    type="number"
                    value={form.fideRating || ""}
                    onChange={(e) => set("fideRating", e.target.value)}
                    disabled={isRegistrationDisabled || isPreview}
                    placeholder="0"
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
                  placeholder="Full residential address"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 min-h-[80px] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <LabelItem label="How did you get the tournament info?" required />
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
                    <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'payment1')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!isPreview} disabled={isRegistrationDisabled || isPreview} />
                    <div className={cn("h-[42px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.payment1 ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400")}>
                      {files.payment1 ? <CheckCircle2 className="size-3.5" /> : <Upload className="size-3.5" />}
                      <span className="text-[10px] font-bold uppercase tracking-wider truncate">{files.payment1 ? "Uploaded" : "Upload"}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <LabelItem label="Payment Proof" required />
                  <div className="relative group/file">
                    <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'payment2')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!isPreview} disabled={isRegistrationDisabled || isPreview} />
                    <div className={cn("h-[42px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.payment2 ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400")}>
                      {files.payment2 ? <CheckCircle2 className="size-3.5" /> : <Upload className="size-3.5" />}
                      <span className="text-[10px] font-bold uppercase tracking-wider truncate">{files.payment2 ? "Uploaded" : "Upload"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || isRegistrationDisabled || isPreview}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed h-auto mt-4"
            >
              {isPending ? "Processing..." : <>Register Now <ArrowRight className="size-4" /></>}
            </button>
          </form>
        </div>
      </div>

      {/* LEFT COLUMN: Tournament Info */}
      <div className="space-y-6 lg:order-1">
        {/* Card 1 — Tournament Header */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="relative aspect-video bg-slate-100">
            <img
              src={tournament.imageUrl || DEFAULT_BANNER}
              alt={tournament.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Tournament Details</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
              {tournament.title}
            </h1>

            {/* Info pills grid */}
            {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: <Calendar className="size-4 text-blue-500" />,
                  label: 'Schedule',
                  value: formatDateRange(tournament.startDate, tournament.endDate)
                },
                {
                  icon: <MapPin className="size-4 text-blue-500" />,
                  label: 'Venue',
                  value: tournament.location || '—'
                },
                {
                  icon: <Trophy className="size-4 text-amber-500" />,
                  label: 'Prize Pool',
                  value: formatINR(tournament.totalPrizePool ?? 0)
                },
                {
                  icon: <FileText className="size-4 text-green-500" />,
                  label: 'Category',
                  value: tournament.category || '—'
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
            </div> */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
  {[
    {
      icon: <Calendar className="size-4 text-blue-500 shrink-0" />,
      label: 'Schedule',
      value: formatDateRange(tournament.startDate, tournament.endDate)
    },
    {
      icon: <MapPin className="size-4 text-blue-500 shrink-0" />,
      label: 'Venue',
      value: tournament.location || '—'
    },
    {
      icon: <Trophy className="size-4 text-amber-500 shrink-0" />,
      label: 'Prize Pool',
      value: formatINR(tournament.totalPrizePool ?? 0)
    },
    {
      icon: <FileText className="size-4 text-green-500 shrink-0" />,
      label: 'Category',
      value: tournament.category || '—'
    },
  ].map(info => (
    <div 
      key={info.label} 
      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 flex items-start sm:items-center gap-3 h-full"
    >
      <div className="flex-shrink-0 flex items-center justify-center mt-0.5 sm:mt-0">
        {info.icon}
      </div>
      
      {/* Container with min-w-0 and flex-1 to allow flexible wrapping */}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
          {info.label}
        </p>
        {/* Removed truncate, added break-words and leading-snug for multi-line support */}
        <p className="text-sm font-bold text-slate-900 leading-snug break-words">
          {info.value}
        </p>
      </div>
    </div>
  ))}
</div>
          </div>
        </div>

        {/* Card 2 — Overview */}
        {tournament.description && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-lg bg-slate-100">
                <FileText className="size-4 text-slate-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Overview</h3>
            </div>
            <div className="prose prose-sm max-w-none text-slate-600 ql-editor ql-viewer p-0" dangerouslySetInnerHTML={{ __html: tournament.description }} />
          </div>
        )}

        {/* Card 3 — Rules & Regulations */}
        {tournament.otherDetails && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-lg bg-amber-50">
                <ShieldCheck className="size-4 text-amber-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Rules & Regulations</h3>
            </div>
            <div className="prose prose-sm max-w-none text-slate-600 ql-editor ql-viewer p-0" dangerouslySetInnerHTML={{ __html: tournament.otherDetails.replace(/\s*\[\d+(,\s*\d+)*\]/g, '') }} />
          </div>
        )}

        {/* Card 4 — Payment Portal */}
        {/* <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50 font-medium mb-1">Entry Fee</p>
              <p className="text-2xl font-black text-white">{formatINR(tournament.entryFee ?? 0)}</p>
            </div>
            <div className="text-3xl opacity-20 select-none text-white font-bold">₹</div>
          </div>

          <div className="p-6 flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 mb-3">How to pay:</p>
              <ol className="space-y-2.5">
                {[
                  'Scan the QR code with any UPI app',
                  'Enter the entry fee amount',
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
          </div> */}
         {/* Card 4 — Payment Portal */}
        <div className="flex flex-col justify-between h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
          <div className="flex flex-col h-full space-y-6">
            
            {/* Clean, High-Contrast Fee Banner */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Entry Fee</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{formatINR(tournament.entryFee ?? 0)}</p>
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
                  'Enter the entry fee amount',
                  'Add your name in payment remarks',
                  'Upload payment screenshot in the form',
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

            {/* Responsive QR Display Container — Handles small mobile viewports flawlessly */}
           <div className="w-full flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl p-4">
  
  {/* 1. aspect-square w-full max-w-[240px]: Ensures a perfect square layout on mobile so the image cannot stretch vertically.
    2. p-4: Adds a clean, uniform boundary around the native component layout.
  */}
 <div className="relative border border-slate-200/80 rounded-none bg-white shadow-sm w-full max-w-[240px] aspect-square flex items-center justify-center p-0 overflow-hidden">
  
  {/* Aggressively flattens all internal wrapper spacing and expands the core image to 100% */}
  <div className="w-full h-full flex items-center justify-center 
    [&_*]:p-0 [&_*]:m-0 [&_*]:border-none [&_*]:bg-transparent [&_*]:rounded-none
    [&_img]:w-full [&_img]:h-full [&_img]:object-cover
    [&_p]:hidden [&_span]:hidden">
    <PaymentDisplay />
  </div>

</div>
  
  {/* Subtext anchored neatly below the square scanner card */}
  <div className="text-center mt-3">
    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Scan to pay</p>
    <span className="text-[9px] text-slate-400 font-medium block">Accepts all major UPI apps</span>
  </div>
</div>
          </div>
        </div>
          {/* Card 5 — Help & Brochure (Wrapped in its own clean card container) */}
        {(tournament.contactDetails || tournament.brochureUrl) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {tournament.contactDetails && (
              <p className="text-slate-500 text-sm font-medium">
                Questions? Call <span className="text-slate-900 font-bold">{tournament.contactDetails}</span>
              </p>
            )}
            {tournament.brochureUrl && (
              <button
                type="button"
                onClick={(e) => onBrochureDownload?.(e, tournament.brochureUrl!)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
              >
                <FileText className="size-3.5" />
                Download Brochure
              </button>
            )}
          </div>
        )}
      </div> {/* Closes Left Column space-y-6 */}
    </div> 
  );
};

const LabelItem = ({ label, required = false }: { label: string; required?: boolean }) => (
  <label className={cn("block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5", required && "required-field")}>
    {label}
  </label>
);
