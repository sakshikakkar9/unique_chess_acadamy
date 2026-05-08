import React from "react";
import { Course } from "@/types";
import {
  Clock, Calendar, BarChart3,
  CreditCard, User, HelpCircle, FileText, Zap, ShieldCheck, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentDisplay from "@/components/shared/PaymentDisplay";

interface CoursePreviewProps {
  course: Course;
}

const CoursePreview: React.FC<CoursePreviewProps> = ({ course }) => {
  const DEFAULT_BANNER = "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Left Section: Information */}
      <div className="lg:col-span-5 space-y-10">
        <div className="space-y-10">
          {/* Banner */}
          <div className={cn(
            "relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white",
            course.posterOrientation === 'PORTRAIT' ? "aspect-[3/4]" : "aspect-video"
          )}>
            <img
              src={course.custom_banner_url || DEFAULT_BANNER}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-[#0284c7] text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg">
                {course.mode}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#0284c7] uppercase tracking-[0.2em]">
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
                <BarChart3 className="h-5 w-5 text-[#0284c7]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Skill Level</p>
                <p className="text-base font-bold text-slate-900">{course.skillLevel}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-[#0284c7]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Duration</p>
                <p className="text-base font-bold text-slate-900">{course.duration}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-[#0284c7]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Age Group</p>
                <p className="text-base font-bold text-slate-900">{course.ageGroup}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5 text-[#0284c7]" />
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
              {course.days?.map((day) => (
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
              <div className="flex items-center gap-4 group cursor-default">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-[#0284c7]" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-[#0284c7] uppercase tracking-widest">Resources</p>
                  <p className="text-base font-bold text-slate-900">Brochure PDF</p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Section - Refined */}
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Investment</p>
                <p className="text-4xl font-bold text-[#0284c7] tracking-tighter">₹{course.fee.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>

            <PaymentDisplay />
          </div>
        </div>
      </div>

      {/* Right Section: Registration Form (Preview) */}
      <div className="lg:col-span-7">
        <div className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
          <div className="h-3 bg-[#0284c7]" />
          <div className="p-10 md:p-14">
            <div className="space-y-10">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                <ShieldCheck className="h-6 w-6 text-[#0284c7]" />
                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Registration Form</h2>
              </div>
              <div className="p-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center space-y-4">
                 <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                   <Trophy className="h-8 w-8 text-[#0284c7]" />
                 </div>
                 <p className="text-slate-500 font-medium">This is a preview of how users will see the enrollment form. In the live version, this will be a fully interactive enrollment experience.</p>
              </div>
              <button disabled className="w-full h-20 bg-slate-200 text-slate-400 text-xl font-bold rounded-3xl uppercase tracking-wider">
                COMPLETE ENROLLMENT (PREVIEW)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
