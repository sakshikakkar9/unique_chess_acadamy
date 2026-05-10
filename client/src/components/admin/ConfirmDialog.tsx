import React from "react";
import { AlertTriangle } from "lucide-react";
import AdminModal from "./AdminModal";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = "Delete",
  isLoading = false,
}) => {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      footer={
        <div className="flex gap-3 w-full">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 border border-uca-border rounded-lg py-2 text-sm font-medium text-uca-text-primary hover:bg-uca-bg-elevated h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-uca-accent-red hover:bg-red-700 rounded-lg py-2 text-sm font-semibold text-white h-11 transition-all active:scale-[0.97]"
          >
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center py-4">
        <div className="size-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
          <AlertTriangle className="size-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-bold text-uca-text-primary text-center">
          {title}
        </h3>
        <p className="text-sm text-uca-text-muted text-center mt-2 max-w-[280px]">
          {description}
        </p>
      </div>
    </AdminModal>
  );
};

export default ConfirmDialog;
