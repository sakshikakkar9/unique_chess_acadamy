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
  PENDING:   "bg-amber-500/10 text-amber-500 border-amber-500/20",
  UPCOMING:  "bg-uca-accent-blue/10 text-uca-accent-blue border-uca-accent-blue/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  CANCELLED: "bg-uca-accent-red/10 text-uca-accent-red border-uca-accent-red/20",
  REJECTED:  "bg-uca-accent-red/10 text-uca-accent-red border-uca-accent-red/20",
  LIVE:      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  APPROVED:  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  VERIFIED:  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  CONFIRMED: "bg-uca-accent-blue/10 text-uca-accent-blue border-uca-accent-blue/20",
  ONGOING:   "bg-uca-accent-blue/10 text-uca-accent-blue border-uca-accent-blue/20",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const normalizedStatus = status?.toUpperCase();
  const styleClasses = statusStyles[normalizedStatus] || "bg-uca-bg-elevated text-uca-text-muted border-uca-border";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors",
        styleClasses,
        className
      )}
    >
      {normalizedStatus === "LIVE" && (
        <span className="size-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
