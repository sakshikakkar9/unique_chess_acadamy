'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  EllipsisVertical as EllipsisVerticalIcon,
  Pencil as PencilSquareIcon,
  Trash2 as TrashIcon,
  CircleCheck as CheckCircleIcon,
  CircleX as XCircleIcon,
  Slash as NoSymbolIcon,
  RotateCcw as ArrowPathIcon,
} from 'lucide-react';
import { ItemStatus, MANUAL_STATUSES } from '@/lib/statusUtils';

interface Props {
  currentStatus: ItemStatus;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (newStatus: ItemStatus | 'restore') => void;
}

export default function StatusActionMenu({
  currentStatus,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      // Don't close if clicking trigger or menu content
      if (
        triggerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  const handleOpen = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const dropH = 220;
    const below = window.innerHeight - r.bottom;
    setPos({
      top: below > dropH
        ? r.bottom + window.scrollY + 4
        : r.top + window.scrollY - dropH - 4,
      left: r.right - 172 + window.scrollX,
    });
    setOpen(p => !p);
  };

  const isManual = MANUAL_STATUSES.includes(currentStatus);

  // Build menu items based on current status
  const items = [
    // Edit — always shown
    {
      label: 'Edit',
      icon: <PencilSquareIcon className="size-4 text-blue-500" />,
      textClass: 'text-slate-700',
      onClick: () => { onEdit(); setOpen(false); },
      show: true,
      dividerAfter: false,
    },

    // Restore to Active — only when manually set
    {
      label: 'Restore to Active',
      icon: <ArrowPathIcon className="size-4 text-blue-500" />,
      textClass: 'text-blue-600',
      onClick: () => {
        onStatusChange('restore');
        setOpen(false);
      },
      show: isManual,
      dividerAfter: false,
    },

    // Mark Completed — only when not already completed
    {
      label: 'Mark as Completed',
      icon: <CheckCircleIcon className="size-4 text-green-500" />,
      textClass: 'text-slate-700',
      onClick: () => {
        onStatusChange('completed');
        setOpen(false);
      },
      show: currentStatus !== 'completed',
      dividerAfter: false,
    },

    // Mark Rejected — only when not already rejected
    {
      label: 'Mark as Rejected',
      icon: <XCircleIcon className="size-4 text-red-500" />,
      textClass: 'text-slate-700',
      onClick: () => {
        onStatusChange('rejected');
        setOpen(false);
      },
      show: currentStatus !== 'rejected',
      dividerAfter: false,
    },

    // Mark Cancelled — only when not already cancelled
    {
      label: 'Mark as Cancelled',
      icon: <NoSymbolIcon className="size-4 text-orange-500" />,
      textClass: 'text-slate-700',
      onClick: () => {
        onStatusChange('cancelled');
        setOpen(false);
      },
      show: currentStatus !== 'cancelled',
      dividerAfter: true,   // divider before Delete
    },

    // Delete — always shown, always last
    {
      label: 'Delete',
      icon: <TrashIcon className="size-4 text-red-500" />,
      textClass: 'text-red-600',
      onClick: () => { onDelete(); setOpen(false); },
      show: true,
      dividerAfter: false,
    },
  ].filter(i => i.show);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className="p-2 rounded-lg hover:bg-slate-100
                   min-w-[44px] min-h-[44px]
                   flex items-center justify-center
                   transition-colors duration-150"
        aria-label="Actions"
      >
        <EllipsisVerticalIcon className="size-5 text-slate-400" />
      </button>

      {mounted && open && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
            width: '172px',
          }}
          className="bg-white border border-slate-200
                     rounded-xl shadow-xl overflow-hidden
                     py-1"
        >
          {items.map((item, i) => (
            <div key={i}>
              <button
                onClick={item.onClick}
                className={`w-full flex items-center gap-2.5
                            px-4 py-2.5 text-sm font-medium
                            hover:bg-slate-50 transition-colors
                            duration-100 text-left
                            ${item.textClass}`}
              >
                {item.icon}
                {item.label}
              </button>
              {item.dividerAfter && (
                <div className="h-px bg-slate-100 mx-3 my-1" />
              )}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
