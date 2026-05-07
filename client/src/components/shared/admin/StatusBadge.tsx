import React from "react";
import { cn } from "@/lib/utils";

export type StatusType =
  | "PENDING"
  | "APPROVED"
  | "VERIFIED"
  | "CONFIRMED"
  | "CANCELLED"
  | "REJECTED"
  | "COMPLETED"
  | "UPCOMING"
  | "ONGOING"
  | "LIVE";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-600 border-amber-200/50",
  APPROVED:  "bg-emerald-50 text-emerald-600 border-emerald-200/50",
  VERIFIED:  "bg-emerald-50 text-emerald-600 border-emerald-200/50",
  CONFIRMED: "bg-sky-50 text-sky-600 border-sky-200/50",
  CANCELLED: "bg-rose-50 text-rose-600 border-rose-200/50",
  REJECTED:  "bg-rose-50 text-rose-600 border-rose-200/50",
  COMPLETED: "bg-slate-50 text-slate-600 border-slate-200/50",
  UPCOMING:  "bg-emerald-50 text-emerald-600 border-emerald-200/50",
  ONGOING:   "bg-sky-50 text-sky-600 border-sky-200/50",
  LIVE:      "bg-emerald-50 text-emerald-600 border-emerald-200/50",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const normalizedStatus = status.toUpperCase();
  const style = statusStyles[normalizedStatus] || "bg-slate-50 text-slate-500 border-slate-200/50";

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider",
      style,
      className
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
