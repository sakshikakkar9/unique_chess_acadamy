import React from "react";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8", className)}>
      <div>
        <h1
          className="text-[#0c1a3a]"
          style={{
            fontSize: '26px',
            fontWeight: 800,
            letterSpacing: '-0.6px',
            lineHeight: '1.2'
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-[#64748b] mt-1"
            style={{
              fontSize: '12px'
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default AdminPageHeader;
