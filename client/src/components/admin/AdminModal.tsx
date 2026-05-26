import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
        "bg-uca-bg-surface border border-uca-border shadow-2xl flex flex-col w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-hidden p-0",
        "rounded-t-2xl sm:rounded-2xl"
      )}>
        {/* Mobile Swipe Indicator */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-uca-bg-elevated" />
        </div>

        {/* Header */}
        <div className="flex items-center px-5 py-4 sm:px-6 sm:py-4 border-b border-uca-border bg-uca-bg-surface shadow-sm sticky top-0 z-10 shrink-0">
          <DialogTitle className="text-lg font-bold text-uca-text-primary">{title}</DialogTitle>
        </div>

        <DialogDescription className="sr-only">
          Modal for {title}
        </DialogDescription>

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
      </DialogContent>
    </Dialog>
  );
};

export default AdminModal;
