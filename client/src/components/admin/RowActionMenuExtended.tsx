'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  EllipsisVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RowActionMenuExtendedProps {
  onEdit: () => void;
  onDelete: () => void;
  onMarkCompleted?: () => void;
  onMarkRejected?: () => void;
  currentStatus?: string;
}

export default function RowActionMenuExtended({
  onEdit, onDelete,
  onMarkCompleted, onMarkRejected,
  currentStatus,
}: RowActionMenuExtendedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const close = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleOpen = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropH = 200;
    const spaceBelow = window.innerHeight - rect.bottom;

    setPos({
      top: spaceBelow > dropH
        ? rect.bottom + window.scrollY + 4
        : rect.top + window.scrollY - dropH - 4,
      left: rect.right - 180 + window.scrollX,
    });
    setIsOpen(p => !p);
  };

  const status = currentStatus?.toUpperCase();

  const items = [
    {
      label: 'Edit',
      icon: <Pencil className="size-4 text-uca-accent-blue" />,
      onClick: () => { onEdit(); setIsOpen(false); },
      textClass: 'text-uca-text-primary',
      show: true,
      divider: false,
    },
    {
      label: 'Mark as Completed',
      icon: <CheckCircle2 className="size-4 text-emerald-500" />,
      onClick: () => { onMarkCompleted?.(); setIsOpen(false); },
      textClass: 'text-uca-text-primary',
      show: !!onMarkCompleted && status !== 'COMPLETED',
      divider: false,
    },
    {
      label: 'Mark as Rejected',
      icon: <XCircle className="size-4 text-uca-accent-red" />,
      onClick: () => { onMarkRejected?.(); setIsOpen(false); },
      textClass: 'text-uca-text-primary',
      show: !!onMarkRejected && status !== 'REJECTED',
      divider: true,   // divider before Delete
    },
    {
      label: 'Delete',
      icon: <Trash2 className="size-4 text-uca-accent-red" />,
      onClick: () => { onDelete(); setIsOpen(false); },
      textClass: 'text-uca-accent-red',
      show: true,
      divider: false,
    },
  ].filter(i => i.show);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className="p-2 rounded-lg hover:bg-uca-bg-elevated
                   min-w-[44px] min-h-[44px]
                   flex items-center justify-center
                   transition-all duration-150 border border-transparent hover:border-uca-border"
      >
        <EllipsisVertical className="size-5 text-uca-text-muted" />
      </button>

      {isOpen && createPortal(
        <div
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
            width: '180px',
          }}
          className="bg-uca-bg-surface border border-uca-border
                     rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          {items.map((item, i) => (
            <div key={i}>
              {item.divider && (
                <div className="h-px bg-uca-border mx-3" />
              )}
              <button
                onClick={item.onClick}
                className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-uca-bg-elevated transition-colors duration-100",
                    item.textClass
                )}
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
