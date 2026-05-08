import React from "react";
import { Tournament } from "@/types";
import { format } from "date-fns";
import { Calendar, MapPin, Trophy, FileText, Phone, CreditCard, Info, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OrientationWrapper from "@/features/tournaments/components/OrientationWrapper";
import PaymentDisplay from "@/components/shared/PaymentDisplay";

interface TournamentPreviewProps {
  tournament: Tournament;
}

const TournamentPreview: React.FC<TournamentPreviewProps> = ({ tournament }) => {
  return (
    <OrientationWrapper
      orientation={tournament.posterOrientation}
      poster={
        <div className={cn(
          "relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white",
          tournament.posterOrientation === 'PORTRAIT' ? "aspect-[3/4]" : "aspect-video"
        )}>
          <img
            src={tournament.imageUrl || "/placeholder.jpg"}
            alt={tournament.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6">
            <span className="px-4 py-2 bg-[#0284c7] text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg">
              {tournament.category || "Professional"}
            </span>
          </div>
        </div>
      }
      details={
        <div className="space-y-12">
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="px-4 py-1.5 bg-sky-100 text-[#0284c7] rounded-full text-[10px] font-bold uppercase tracking-[0.15em]">
                Arena Details
              </span>
              <h1 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                {tournament.title}
              </h1>
            </div>

            {tournament.description && (
              <div
                className="text-slate-600 font-medium leading-relaxed text-lg border-l-4 border-[#0284c7]/20 pl-6 ql-editor ql-viewer p-0"
                dangerouslySetInnerHTML={{ __html: tournament.description }}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md">
                <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
                  <Calendar className="h-7 w-7 text-[#0284c7]" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Schedule</p>
                  <p className="text-base font-bold text-slate-900 tracking-tight">
                    {tournament.startDate ? format(new Date(tournament.startDate), "MMM d, yyyy") : 'TBD'}
                    {tournament.endDate && ` - ${format(new Date(tournament.endDate), "MMM d, yyyy")}`}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md">
                <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
                  <MapPin className="h-7 w-7 text-[#0284c7]" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Venue</p>
                  <p className="text-base font-bold text-slate-900 tracking-tight">{tournament.location}</p>
                </div>
              </div>

              <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md">
                <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
                  <Trophy className="h-7 w-7 text-[#0284c7]" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Prize Pool</p>
                  <p className="text-base font-bold text-slate-900 tracking-tight">{tournament.totalPrizePool}</p>
                </div>
              </div>

              <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4 shadow-md">
                <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
                  <Trophy className="h-7 w-7 text-[#0284c7]" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Category</p>
                  <p className="text-base font-bold text-slate-900 tracking-tight">{tournament.category}</p>
                </div>
              </div>
            </div>

            {tournament.otherDetails && (
              <div className="space-y-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] ml-1">Tournament Rules & Info</p>
                <div
                  className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-base text-slate-600 font-medium leading-relaxed shadow-md border-l-4 border-l-[#0284c7] ql-editor ql-viewer"
                  dangerouslySetInnerHTML={{ __html: tournament.otherDetails }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tournament.brochureUrl && (
                <div className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-lg">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-sky-50 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-[#0284c7]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-0.5">Brochure</p>
                      <p className="text-lg font-bold text-slate-900">Download PDF</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-8 bg-slate-900 rounded-[2.5rem] flex items-center gap-6 text-white shadow-xl overflow-hidden relative">
                <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="h-8 w-8 text-sky-400" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-1">Direct Help</p>
                  <p className="text-xl font-bold tracking-tight">{tournament.contactDetails}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="px-10 py-8 bg-white border border-slate-100 rounded-[3rem] shadow-lg flex items-center justify-between relative overflow-hidden group">
                <div className="relative">
                  <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">Registration Entry Fee</p>
                  <p className="text-5xl font-bold text-[#0284c7] tracking-tighter">₹{tournament.entryFee.toLocaleString()}</p>
                </div>
                <div className="relative h-16 w-16 bg-[#0284c7] rounded-2xl flex items-center justify-center shadow-lg">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
              </div>

              {tournament.discountDetails && (
                <div className="flex items-start gap-4 p-6 bg-sky-50/50 rounded-[2rem] border border-sky-100/50">
                  <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                    <Info className="h-6 w-6 text-[#0284c7]" />
                  </div>
                  <p className="text-sm font-semibold text-sky-700 leading-relaxed italic uppercase tracking-tight">{tournament.discountDetails}</p>
                </div>
              )}

              <PaymentDisplay />
            </div>
          </div>
        </div>
      }
      form={
        <div className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
          <div className="h-3 bg-[#0284c7]" />
          <div className="p-10 md:p-14">
            <div className="space-y-10">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                <User className="h-6 w-6 text-[#0284c7]" />
                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Static Registration Form</h2>
              </div>
              <div className="p-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center space-y-4">
                 <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                   <Trophy className="h-8 w-8 text-[#0284c7]" />
                 </div>
                 <p className="text-slate-500 font-medium">This is a preview of how users will see the registration form. In the live version, this will be a fully interactive enrollment experience.</p>
              </div>
              <button disabled className="w-full h-20 bg-slate-200 text-slate-400 text-xl font-bold rounded-3xl uppercase tracking-wider">
                COMPLETE REGISTRATION (PREVIEW)
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default TournamentPreview;
