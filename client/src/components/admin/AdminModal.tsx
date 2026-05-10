import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={cn(
          "relative z-50 bg-uca-bg-surface border border-uca-border shadow-2xl flex flex-col w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-hidden overscroll-contain transition-all",
          "rounded-t-2xl sm:rounded-2xl",
          "animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-250 ease-out"
        )}
      >
        {/* Mobile Swipe Indicator */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-uca-bg-elevated" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 sm:px-6 sm:py-4 border-b border-uca-border bg-uca-bg-surface shadow-sm sticky top-0 z-10 shrink-0">
          <h3 className="text-lg font-bold text-uca-text-primary">{title}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-uca-text-muted hover:text-uca-text-primary hover:bg-uca-bg-elevated -mr-2"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 sm:px-6 sm:py-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 border-t border-uca-border bg-uca-bg-surface shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModal;
