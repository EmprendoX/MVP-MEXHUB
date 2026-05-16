'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type ToastType = 'success' | 'info' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const accent =
    toast.type === 'success'
      ? 'border-success/60 bg-success/15 text-success'
      : toast.type === 'error'
      ? 'border-alert/60 bg-alert/15 text-alert'
      : 'border-primary/60 bg-primary/15 text-primary';

  return (
    <div
      className={`pointer-events-auto px-4 py-3 rounded-lg border ${accent} shadow-soft min-w-[240px] max-w-sm flex items-start gap-3 animate-fade-in-up`}
      role="status"
    >
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-current opacity-60 hover:opacity-100"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      show: (msg: string) => {
        if (typeof window !== 'undefined') console.log('[toast]', msg);
      },
    };
  }
  return ctx;
}
