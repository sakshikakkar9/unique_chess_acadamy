import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { format } from "date-fns";
import {
  User, Phone, Calendar, MapPin, ShieldCheck, Zap, Info, Clock, Mail, Copy,
  ArrowRight, CreditCard, Image as PhotoIcon, Trophy, BookOpen, UserCircle,
  Check, X, ExternalLink
} from "lucide-react";
import { Button } from "../../components/ui/button";
import StatusBadge from "../../components/shared/admin/StatusBadge";
import { cn } from "../../lib/utils";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";

interface StudentDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  type: 'student' | 'course' | 'tournament' | 'demo';
  onAction?: (id: string | number, action: any, payload?: any) => void;
  isSubmitting?: boolean;
}

export const StudentDetailSheet: React.FC<StudentDetailSheetProps> = ({
  open,
  onOpenChange,
  data,
  type,
  onAction,
  isSubmitting = false
}) => {
  const { success } = useToast();
  const navigate = useNavigate();

  if (!data) return null;

  const student = data.student || data;
  const isEnrollment = type === 'course' || type === 'tournament' || type === 'demo';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success(`${label} Copied`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl rounded-l-[2rem] p-0 border-uca-border bg-uca-bg-base shadow-2xl overflow-y-auto scrollbar-none">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-uca-navy p-6 sm:p-8 text-white relative overflow-hidden shrink-0 border-b border-uca-border">
            <SheetHeader className="mb-5 sm:mb-6 relative z-10 text-left">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-2.5 py-1 bg-white/10 text-[9px] font-black uppercase tracking-[0.2em] rounded border border-white/20">
                  {type === 'student' ? 'STUDENT PROFILE' :
                   type === 'course' ? 'COURSE ENROLLMENT' :
                   type === 'tournament' ? 'TOURNAMENT ENTRY' : 'DEMO REQUEST'}
                </span>
                <StatusBadge status={data.status || data.accountStatus} />
              </div>
              <SheetTitle className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                {student.fullName || student.studentName}
              </SheetTitle>
              <div className="flex flex-col gap-1 mt-1">
                {isEnrollment && (
                  <p className="text-uca-accent-blue font-bold text-sm flex items-center gap-2">
                    {type === 'tournament' ? <Trophy className="size-4 shrink-0" /> : <BookOpen className="size-4 shrink-0" />}
                    {data.tournament?.title || data.course?.title || 'Initial Demo Session'}
                  </p>
                )}
                <p className="text-uca-text-muted font-bold text-xs flex items-center gap-2">
                  <User className="size-3.5 text-uca-accent-blue shrink-0" />
                  ID: {(data.ucaId || student.ucaId || data.referenceId || data.id?.toString())?.toUpperCase()}
                </p>
              </div>
            </SheetHeader>

            <div className="flex flex-wrap gap-3 relative z-10">
              {data.referenceId && (
                <div className="bg-uca-bg-elevated px-3 sm:px-4 py-2 rounded-lg border border-uca-border flex flex-col gap-0.5">
                  <p className="text-[8px] font-black text-uca-text-muted uppercase tracking-widest">Reference ID</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-mono font-bold tracking-wider text-uca-accent-blue">
                      {data.referenceId}
                    </p>
                    <button onClick={() => handleCopy(data.referenceId, "Ref ID")} className="text-uca-text-muted hover:text-uca-text-primary transition-colors">
                      <Copy className="size-3" />
                    </button>
                  </div>
                </div>
              )}
              <div className="bg-uca-bg-elevated px-3 sm:px-4 py-2 rounded-lg border border-uca-border flex flex-col gap-0.5">
                <p className="text-[8px] font-black text-uca-text-muted uppercase tracking-widest">
                  {type === 'student' ? 'Joined On' : 'Submission Date'}
                </p>
                <p className="text-xs font-bold text-uca-text-primary">
                  {data.createdAt ? format(new Date(data.createdAt), "PPP") : 'N/A'}
                </p>
              </div>
              {student.experienceLevel && (
                <div className="bg-uca-bg-elevated px-3 sm:px-4 py-2 rounded-lg border border-uca-border flex flex-col gap-0.5 text-uca-text-primary">
                  <p className="text-[8px] font-black text-uca-text-muted uppercase tracking-widest">Experience</p>
                  <p className="text-xs font-bold">{student.experienceLevel}</p>
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 sm:p-8 space-y-8 sm:space-y-10 bg-uca-bg-base">
            {/* Student Profile Section */}
            <section>
              <div className="flex items-center gap-3 mb-4 sm:mb-5 text-uca-text-primary">
                <User className="size-4 text-uca-accent-blue" />
                <h4 className="text-xs font-black uppercase tracking-widest">Student Profile</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border">
                  <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">Gender</p>
                  <p className="font-bold text-uca-text-primary text-sm">{student.gender || 'N/A'}</p>
                </div>
                <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border">
                  <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">Birth Date</p>
                  <p className="font-bold text-uca-text-primary text-sm">
                    {student.dob ? format(new Date(student.dob), "PPP") : 'N/A'}
                  </p>
                </div>
                <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border">
                  <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">Phone</p>
                  <p className="font-bold text-uca-text-primary text-sm">{student.phone}</p>
                </div>
                <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border">
                  <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">Email</p>
                  <p className="font-bold text-uca-text-primary text-xs truncate">{student.email || 'N/A'}</p>
                </div>
                <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border sm:col-span-2">
                  <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">Address</p>
                  <p className="font-bold text-uca-text-primary text-xs leading-relaxed">{student.address || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Chess Profile / Entry Details */}
            {(type === 'student' || type === 'tournament' || type === 'course') && (
              <section>
                <div className="flex items-center gap-3 mb-4 sm:mb-5 text-uca-text-primary">
                  <ShieldCheck className="size-4 text-uca-accent-blue" />
                  <h4 className="text-xs font-black uppercase tracking-widest">
                    {type === 'student' ? 'Chess Profile' : 'Entry Details'}
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border">
                    <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">FIDE ID</p>
                    <p className="text-lg font-black text-uca-text-primary">{student.fideId || data.fideId || 'N/A'}</p>
                  </div>
                  <div className="bg-uca-bg-surface p-4 rounded-xl border border-uca-border">
                    <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">Rating</p>
                    <p className="text-lg font-black text-uca-accent-blue">{student.fideRating || data.fideRating || '0'}</p>
                  </div>

                  {isEnrollment && type !== 'demo' && (
                    <div className="bg-uca-bg-elevated p-4 rounded-xl border border-uca-border col-span-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black text-uca-text-muted uppercase tracking-widest mb-1.5">Transaction ID</p>
                          <p className="font-mono font-bold text-uca-text-primary text-sm">{data.transactionId || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <StatusBadge status={data.paymentStatus || 'PENDING'} />
                          {data.paymentStatus !== 'VERIFIED' && onAction && (
                            <button
                              className="block mt-1 text-[9px] font-black text-uca-accent-blue uppercase hover:underline"
                              onClick={() => onAction(data.id, 'paymentStatus', 'VERIFIED')}
                            >
                              Verify Payment
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Activity History for Student Profile */}
            {type === 'student' && (
              <section>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-3 text-uca-text-primary">
                    <Zap className="size-4 text-uca-accent-blue" />
                    <h4 className="text-xs font-black uppercase tracking-widest">Activity History</h4>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/students/${student.id}`)}
                    className="text-[10px] font-black text-uca-accent-blue uppercase hover:underline flex items-center gap-1"
                  >
                    Full Details <ArrowRight className="size-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {[...(data.registrations || []), ...(data.enrollments || [])].slice(0, 3).map((item: any, idx: number) => {
                    const isTournament = !!item.tournament;
                    return (
                      <div key={item.id || idx} className="p-3 sm:p-4 rounded-xl border border-uca-border bg-uca-bg-surface flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {isTournament
                            ? <Trophy className="size-4 text-amber-500 shrink-0" />
                            : <BookOpen className="size-4 text-uca-accent-blue shrink-0" />}
                          <span className="text-xs font-bold text-uca-text-primary truncate">
                            {item.tournament?.title || item.course?.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-uca-text-muted shrink-0">
                          {item.status}
                        </span>
                      </div>
                    );
                  })}
                  {(!data.registrations?.length && !data.enrollments?.length) && (
                    <p className="text-center py-4 text-[10px] font-black text-uca-text-muted uppercase tracking-widest bg-uca-bg-elevated/20 rounded-xl border border-dashed border-uca-border">
                      No activity found
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Documents for Enrollments */}
            {isEnrollment && type !== 'demo' && (
              <section className="pb-8">
                <div className="flex items-center gap-3 mb-5 text-uca-text-primary">
                  <PhotoIcon className="size-4 text-uca-accent-blue" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Documents</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => window.open(data.ageProofUrl)}
                    className="group relative aspect-video bg-uca-bg-surface rounded-xl overflow-hidden border border-uca-border hover:border-uca-accent-blue/50 transition-colors"
                  >
                    <img src={data.ageProofUrl || '/placeholder-doc.png'} className="size-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt="Age proof" />
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-white bg-black/40">View Age Proof</span>
                  </button>
                  <button
                    onClick={() => window.open(data.paymentProofUrl)}
                    className="group relative aspect-video bg-uca-bg-surface rounded-xl overflow-hidden border border-uca-border hover:border-uca-accent-blue/50 transition-colors"
                  >
                    <img src={data.paymentProofUrl || '/placeholder-doc.png'} className="size-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt="Payment proof" />
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-white bg-black/40">View Payment Proof</span>
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-uca-bg-surface border-t border-uca-border flex gap-3 shrink-0">
            {type === 'student' ? (
              <>
                <Button
                  className="flex-1 h-11 sm:h-12 bg-uca-navy hover:bg-uca-navy-hover text-white rounded-lg font-bold text-xs uppercase tracking-widest"
                  onClick={() => onAction && onAction(student.id, 'edit')}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-11 sm:h-12 rounded-lg font-bold text-xs uppercase tracking-widest border-uca-border bg-uca-bg-base text-uca-text-muted hover:text-red-500 hover:border-red-500"
                  onClick={() => onAction && onAction(student.id, 'delete')}
                >
                  Delete Profile
                </Button>
              </>
            ) : (
              <>
                {data.status === "PENDING" && onAction && (
                  <Button
                    className="flex-1 h-11 sm:h-12 bg-uca-navy hover:bg-uca-navy-hover text-white rounded-lg font-bold text-xs uppercase tracking-widest"
                    disabled={isSubmitting}
                    onClick={() => onAction(data.id, 'status', type === 'course' ? 'CONFIRMED' : (type === 'tournament' ? 'APPROVED' : 'COMPLETED'))}
                  >
                    {isSubmitting ? <Clock className="size-4 animate-spin" /> : 'Approve Entry'}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 h-11 sm:h-12 rounded-lg font-bold text-xs uppercase tracking-widest border-uca-border bg-uca-bg-base text-uca-text-muted hover:text-uca-text-primary"
                  disabled={isSubmitting}
                  onClick={() => onAction && onAction(data.id, 'status', type === 'course' ? 'CANCELLED' : (type === 'tournament' ? 'CANCELLED' : 'CANCELLED'))}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
