import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RowActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const RowActionMenu: React.FC<RowActionMenuProps> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right - window.scrollX,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !triggerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("scroll", () => setIsOpen(false), { passive: true });
      window.addEventListener("resize", () => setIsOpen(false));
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", () => setIsOpen(false));
      window.removeEventListener("resize", () => setIsOpen(false));
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={toggleMenu}
        className="size-11 flex items-center justify-center rounded-lg text-uca-text-muted hover:text-uca-text-primary hover:bg-uca-bg-elevated transition-colors"
      >
        <MoreVertical className="size-5" />
      </button>

      {isOpen &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: `${menuPosition.top + 4}px`,
              right: `${menuPosition.right}px`,
              minWidth: '160px'
            }}
            className="z-[100] bg-uca-bg-surface border border-uca-border rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onEdit();
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-uca-accent-blue hover:bg-uca-bg-elevated transition-colors text-left"
            >
              <Pencil className="size-4 text-uca-accent-blue" />
              <span>Edit Record</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onDelete();
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-uca-accent-red hover:bg-uca-bg-elevated transition-colors text-left"
            >
              <Trash2 className="size-4 text-uca-accent-red" />
              <span>Delete Record</span>
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

export default RowActionMenu;
