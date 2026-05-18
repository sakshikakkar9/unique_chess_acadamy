import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { EllipsisVertical, Pencil, Trash2, Eye, Check } from "lucide-react";

interface RowActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onConfirm?: () => void;
}

const RowActionMenu: React.FC<RowActionMenuProps> = ({ onEdit, onDelete, onView, onConfirm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0, flip: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropH = 160; // Approx height for items
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldFlip = spaceBelow < dropH;

      setMenuPosition({
        top: shouldFlip
          ? rect.top + window.scrollY - 8
          : rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right - window.scrollX,
        flip: shouldFlip
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isOpen &&
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
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
        <EllipsisVertical className="size-5" />
      </button>

      {mounted && isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`,
              minWidth: '160px',
              transformOrigin: menuPosition.flip ? 'bottom right' : 'top right',
              transform: menuPosition.flip ? 'translateY(-100%)' : 'none'
            }}
            className="z-[100] bg-uca-bg-surface border border-uca-border rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 ease-out"
          >
            {onView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onView();
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-uca-text-primary hover:bg-uca-bg-elevated transition-colors text-left"
              >
                <Eye className="size-4 text-uca-text-muted" />
                <span>View</span>
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onEdit();
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-uca-accent-blue hover:bg-uca-bg-elevated transition-colors text-left"
              >
                <Pencil className="size-4 text-uca-accent-blue" />
                <span>Edit</span>
              </button>
            )}
            {onConfirm && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onConfirm();
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-emerald-500 hover:bg-uca-bg-elevated transition-colors text-left"
              >
                <Check className="size-4 text-emerald-500" />
                <span>Confirm</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onDelete();
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-uca-accent-red hover:bg-uca-bg-elevated transition-colors text-left"
              >
                <Trash2 className="size-4 text-uca-accent-red" />
                <span>Delete</span>
              </button>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default RowActionMenu;
