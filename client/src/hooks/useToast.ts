import { useState, useEffect, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// Simple singleton state for toasts
let listeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

const notify = () => {
  listeners.forEach(listener => listener([...toasts]));
};

export const useToast = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

  useEffect(() => {
    listeners.push(setCurrentToasts);
    return () => {
      listeners = listeners.filter(l => l !== setCurrentToasts);
    };
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, type, message }];
    notify();

    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    }, 3500);
  }, []);

  return {
    toasts: currentToasts,
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    info: (message: string) => addToast('info', message),
    dismiss: (id: string) => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    },
    // Compatibility with existing shadcn-like toast
    toast: ({ title, description, variant }: any) => {
      const type = variant === 'destructive' ? 'error' : 'success';
      addToast(type, description || title);
    }
  };
};
