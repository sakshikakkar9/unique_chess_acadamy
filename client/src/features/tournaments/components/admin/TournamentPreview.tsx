import React from "react";
import { Tournament } from "@/types";
import { format } from "date-fns";
import { Calendar, MapPin, Trophy, FileText, Phone, CreditCard, Info, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OrientationWrapper from "@/components/shared/layout/OrientationWrapper";
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
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-[0.2em]">
                Arena Details
              </span>
              <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                {tournament.title}
              </h1>
            </div>

            {tournament.description && (
              <div
                className="text-slate-600 font-medium leading-relaxed text-base ql-editor ql-viewer p-0"
                dangerouslySetInnerHTML={{ __html: tournament.description }}
              />
            )}

            {/* Info Grid - Clean & Minimal */}
            <div className="grid grid-cols-2 gap-y-8 gap-x-12 py-4 border-t border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Schedule</p>
                  <p className="text-base font-bold text-slate-900 tracking-tight">
                    {tournament.startDate ? format(new Date(tournament.startDate), "MMM d, yyyy") : 'TBD'}
                    {tournament.endDate && ` - ${format(new Date(tournament.endDate), "MMM d, yyyy")}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Venue</p>
                  <p className="text-base font-bold text-slate-900 tracking-tight line-clamp-1">{tournament.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Prize Pool</p>
                  <p className="text-base font-bold text-slate-900 tracking-tight">{tournament.totalPrizePool}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Category</p>
                  <p className="text-base font-bold text-slate-900 tracking-tight">{tournament.category}</p>
                </div>
              </div>
            </div>

            {tournament.otherDetails && (
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Rules & Regulations</p>
                <div
                  className="text-base text-slate-600 font-medium leading-relaxed ql-editor ql-viewer p-0"
                  dangerouslySetInnerHTML={{ __html: tournament.otherDetails }}
                />
              </div>
            )}

            {/* Contact & Resources - Clean Row */}
            <div className="flex flex-wrap gap-8 py-6 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support</p>
                  <p className="text-base font-bold text-slate-900">{tournament.contactDetails}</p>
                </div>
              </div>

              {tournament.brochureUrl && (
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-sky-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Resources</p>
                    <p className="text-base font-bold text-slate-900">Brochure PDF</p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Section - Refined */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Registration Fee</p>
                  <p className="text-4xl font-bold text-sky-600 tracking-tighter">₹{tournament.entryFee.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>

              {tournament.discountDetails && (
                <div className="flex items-center gap-3 px-1">
                  <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                  <p className="text-xs font-bold text-sky-600 uppercase tracking-wider italic">
                    Special Note: {tournament.discountDetails}
                  </p>
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
