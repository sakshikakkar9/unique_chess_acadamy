import React from 'react';
import { useToast, Toast as ToastType } from '@/hooks/useToast';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

const Toast: React.FC<{ toast: ToastType; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="size-5 text-green-500" />,
    error: <XCircle className="size-5 text-red-500" />,
    info: <Info className="size-5 text-blue-500" />,
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[260px] max-w-[360px] animate-in fade-in slide-in-from-right-4 duration-200",
        styles[toast.type]
      )}
    >
      {icons[toast.type]}
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="size-6 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
      >
        <X className="size-4 opacity-50" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onDismiss={dismiss} />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
