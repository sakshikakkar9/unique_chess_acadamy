import React from "react";
import { Tournament } from "@/types";
import {
  Calendar, MapPin, Trophy,
  FileText, ShieldCheck, Clock,
  Check, ArrowRight, Upload, CheckCircle2,
  ChevronDown, IndianRupee
} from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentDisplay from "@/components/shared/PaymentDisplay";
import { formatINR, formatDateRange } from "@/lib/formatUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  isPreview = false
}) => {
  return (
    <div className="space-y-8 px-4 sm:px-0">
      {/* Tournament Header Section */}
      <Card className="rounded-2xl overflow-hidden">
        <div className="relative aspect-[21/9] sm:aspect-[3/1] bg-slate-100">
          <img
            src={tournament.imageUrl || DEFAULT_BANNER}
            alt={tournament.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {tournament.title}
              </h1>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-white/20 backdrop-blur-md border-white/20 rounded-full px-4 py-1.5 flex items-center gap-2 text-white hover:bg-white/30">
                  <Calendar className="size-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{formatDateRange(tournament.startDate, tournament.endDate)}</span>
                </Badge>
                <Badge variant="outline" className="bg-white/20 backdrop-blur-md border-white/20 rounded-full px-4 py-1.5 flex items-center gap-2 text-white hover:bg-white/30">
                  <MapPin className="size-4" />
                  <span className="text-xs font-bold uppercase tracking-wider truncate max-w-[200px]">{tournament.location || 'Online'}</span>
                </Badge>
                <Badge className="bg-blue-600 hover:bg-blue-700 rounded-full px-4 py-1.5 flex items-center gap-2 text-white border-none">
                  <Trophy className="size-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{formatINR(tournament.totalPrizePool ?? 0)}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 items-start">
        {/* LEFT COLUMN: Tournament Details (2/3 width) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-8 text-left">
          {/* Card 1 — Tournament Info Grid */}
          <Card className="overflow-hidden divide-y divide-slate-100">
            {[
              { icon: <Calendar className="size-5 text-blue-600" />, label: "Date & Time", value: formatDateRange(tournament.startDate, tournament.endDate) },
              { icon: <MapPin className="size-5 text-blue-600" />, label: "Tournament Venue", value: tournament.location || "Venue details will be shared soon" },
              { icon: <Trophy className="size-5 text-amber-500" />, label: "Total Prize Pool", value: formatINR(tournament.totalPrizePool ?? 0) },
              { icon: <ShieldCheck className="size-5 text-green-600" />, label: "Eligibility", value: tournament.category || "Open to all categories" },
            ].map((item, i) => (
              <div key={i} className="p-5 flex items-center gap-5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 leading-none mb-1">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </Card>

          {/* Card 2 — Overview */}
          {tournament.description && (
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-slate-100">
                  <FileText className="size-5 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Overview</h3>
              </div>
              <div className="prose prose-sm max-w-none text-slate-600 ql-editor ql-viewer p-0 text-left" dangerouslySetInnerHTML={{ __html: tournament.description }} />
            </Card>
          )}

          {/* Card 3 — Rules & Regulations */}
          {tournament.otherDetails && (
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-50">
                  <ShieldCheck className="size-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Rules & Regulations</h3>
              </div>
              <div className="prose prose-sm max-w-none text-slate-600 ql-editor ql-viewer p-0 text-left" dangerouslySetInnerHTML={{ __html: tournament.otherDetails.replace(/\s*\[\d+(,\s*\d+)*\]/g, '') }} />
            </Card>
          )}

          {/* Card 4 — Payment Portal */}
          <Card className="overflow-hidden">
            <Card className="bg-slate-900 border-none px-8 py-6 flex items-center justify-between m-4 rounded-xl">
              <div>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Tournament Entry Fee</p>
                <p className="text-4xl font-black text-white">{formatINR(tournament.entryFee ?? 0)}</p>
              </div>
              <div className="text-white opacity-20">
                <IndianRupee className="size-12" strokeWidth={3} />
              </div>
            </Card>

            <div className="p-8 flex flex-col sm:flex-row gap-10 items-center sm:items-start">
              <div className="flex-1 w-full">
                <p className="text-sm font-bold text-slate-900 mb-4">How to Register:</p>
                <div className="grid gap-3">
                  {[
                    { title: "Scan QR", desc: "Scan the QR code with any UPI app" },
                    { title: "Pay Fee", desc: `Pay the entry fee of ${formatINR(tournament.entryFee ?? 0)}` },
                    { title: "Screenshot", desc: "Keep a screenshot of the payment" },
                    { title: "Fill Form", desc: "Fill the registration form on the right" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
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
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm max-w-[200px]">
                  <PaymentDisplay />
                </div>
                <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest">Official UPI QR</p>
              </div>
            </div>

            {/* Help & Brochure */}
            <div className={cn("flex items-center justify-between gap-4 p-8 border-t border-slate-100", (!tournament.contactDetails && !tournament.brochureUrl) && "hidden")}>
              <p className={cn("text-slate-500 text-sm font-medium", !tournament.contactDetails && "hidden")}>
                Questions? Call <span className="text-slate-900 font-bold">{tournament.contactDetails}</span>
              </p>
              <Button
                onClick={(e) => onBrochureDownload?.(e, tournament.brochureUrl!)}
                className={cn("bg-blue-600 hover:bg-blue-700 font-bold text-xs uppercase tracking-widest rounded-xl px-6 py-6", !tournament.brochureUrl && "hidden")}
              >
                <FileText className="size-4" />
                Brochure
              </Button>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Sticky Registration Card (1/3 width) */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <Card className="rounded-2xl shadow-lg p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-blue-600" />
                <p className="text-sm font-bold text-slate-900">Registration Portal</p>
              </div>
              <Badge variant="outline" className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", registrationStatus === "OPEN" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200")}>
                {registrationStatus}
              </Badge>
            </div>

            <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 text-left">Registration Fee</p>
              <p className="text-3xl font-black text-slate-900 text-left">{formatINR(tournament.entryFee ?? 0)}</p>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={cn("space-y-4 transition-all", isRegistrationDisabled && "opacity-40 grayscale pointer-events-none")}>
                <div className="space-y-1.5 text-left">
                  <LabelItem label="Player Name" required />
                  <input
                    value={form.studentName || ""}
                    onChange={(e) => set("studentName", e.target.value)}
                    required
                    disabled={isRegistrationDisabled || isPreview}
                    placeholder="Full name"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 h-auto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
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

                <div className="grid grid-cols-2 gap-4 text-left">
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
                      placeholder="+91"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-150 placeholder:text-slate-300 h-auto"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
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

                <div className="grid grid-cols-2 gap-4 text-left">
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

                <div className="space-y-1.5 text-left">
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

                <div className="space-y-1.5 text-left">
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

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="space-y-1.5">
                    <LabelItem label="Age Proof" required />
                    <div className="relative group/file">
                      <input type="file" onChange={(e) => handleFileChange(e, 'payment1')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!isPreview} disabled={isRegistrationDisabled || isPreview} />
                      <div className={cn("h-[42px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.payment1 ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400")}>
                        {files.payment1 ? <CheckCircle2 className="size-3.5" /> : <Upload className="size-3.5" />}
                        <span className="text-[10px] font-bold uppercase tracking-wider truncate">{files.payment1 ? "Uploaded" : "Upload"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <LabelItem label="Payment Proof" required />
                    <div className="relative group/file">
                      <input type="file" onChange={(e) => handleFileChange(e, 'payment2')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!isPreview} disabled={isRegistrationDisabled || isPreview} />
                      <div className={cn("h-[42px] border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all px-4", files.payment2 ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400")}>
                        {files.payment2 ? <CheckCircle2 className="size-3.5" /> : <Upload className="size-3.5" />}
                        <span className="text-[10px] font-bold uppercase tracking-wider truncate">{files.payment2 ? "Uploaded" : "Upload"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending || isRegistrationDisabled || isPreview}
                className={cn(
                  "w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-7 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-6 shadow-lg shadow-blue-600/20 active:scale-[0.98]",
                  isPreview && "hidden"
                )}
              >
                {isPending ? "Processing..." : <>Register Now <ArrowRight className="size-4" /></>}
              </Button>
            </form>

            {tournament.regEndDate && registrationStatus === "OPEN" && (
              <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-6 text-center",
                new Date(tournament.regEndDate).getTime() - new Date().getTime() < 86400000 * 2 ? "text-red-500" : "text-slate-400"
              )}>
                Deadline: {new Date(tournament.regEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
              </p>
            )}
          </Card>
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
