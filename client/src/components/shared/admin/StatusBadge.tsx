import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status.toLowerCase()) {
      case "open":
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "coming soon":
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "completed":
      case "inactive":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border",
      getStyles()
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
