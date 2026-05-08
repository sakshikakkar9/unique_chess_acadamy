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

const statusStyles: Record<string, { bg: string, color: string, border: string }> = {
  PENDING:   { bg: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" },
  UPCOMING:  { bg: "#dbeafe", color: "#1e40af", border: "1px solid #bfdbfe" },
  COMPLETED: { bg: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" },
  CANCELLED: { bg: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" },
  REJECTED:  { bg: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" },
  LIVE:      { bg: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" },
  // Map others to closest spec or default
  APPROVED:  { bg: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" },
  VERIFIED:  { bg: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" },
  CONFIRMED: { bg: "#dbeafe", color: "#1e40af", border: "1px solid #bfdbfe" },
  ONGOING:   { bg: "#dbeafe", color: "#1e40af", border: "1px solid #bfdbfe" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const normalizedStatus = status.toUpperCase();
  const styleConfig = statusStyles[normalizedStatus] || { bg: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" };

  return (
    <span
      className={cn(
        "inline-flex items-center",
        className
      )}
      style={{
        fontSize: '10px',
        fontWeight: 700,
        padding: '3px 9px',
        borderRadius: '20px',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        backgroundColor: styleConfig.bg,
        color: styleConfig.color,
        border: styleConfig.border
      }}
    >
      {normalizedStatus === "LIVE" && (
        <span
          style={{
            width: '6px',
            height: '6px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            marginRight: '6px',
            display: 'inline-block'
          }}
        />
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
