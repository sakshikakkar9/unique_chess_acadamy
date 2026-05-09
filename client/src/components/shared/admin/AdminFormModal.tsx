import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave: () => void;
  isLoading?: boolean;
  saveText?: string;
}

const AdminFormModal: React.FC<AdminFormModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSave,
  isLoading,
  saveText = "Save changes",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] sm:max-h-[85vh] flex flex-col p-0 overflow-hidden
        fixed bottom-0 sm:bottom-auto left-0 sm:left-auto translate-x-0 sm:-translate-x-1/2 sm:translate-y-0
        rounded-t-[2rem] sm:rounded-[1.5rem] border-x-0 sm:border-x border-b-0 sm:border-b shadow-2xl transition-all duration-300">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-4">
            {children}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t border-border mt-auto flex flex-col-reverse sm:flex-row gap-3">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button className="w-full sm:w-auto" onClick={onSave} disabled={isLoading}>
            {isLoading ? "Saving..." : saveText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminFormModal;
