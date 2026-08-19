import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Sparkles
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  createdAt: number;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (options: {
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
  }) => string;
  dismissToast: (id: string) => void;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;

  // Confirmation dialog prompt helper (Promise-based)
  confirmAction: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    options: ConfirmDialogOptions;
    resolve: (val: boolean) => void;
  } | null>(null);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      type,
      title,
      message,
      duration = 4500
    }: {
      type: ToastType;
      title?: string;
      message: string;
      duration?: number;
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const newToast: ToastItem = {
        id,
        type,
        title,
        message,
        duration,
        createdAt: Date.now()
      };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Keep max 5 visible toasts

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const success = useCallback(
    (message: string, title?: string) =>
      showToast({ type: 'success', title: title || 'Action Completed', message }),
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string) =>
      showToast({
        type: 'error',
        title: title || 'Notice',
        message: message || 'An unexpected error occurred. Please try again.',
        duration: 6000
      }),
    [showToast]
  );

  const warning = useCallback(
    (message: string, title?: string) =>
      showToast({ type: 'warning', title: title || 'Attention', message, duration: 5000 }),
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string) =>
      showToast({ type: 'info', title: title || 'Farm Update', message }),
    [showToast]
  );

  const confirmAction = useCallback(
    (options: ConfirmDialogOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmDialog({
          isOpen: true,
          options,
          resolve
        });
      });
    },
    []
  );

  const handleConfirmResponse = (result: boolean) => {
    if (confirmDialog) {
      confirmDialog.resolve(result);
      setConfirmDialog(null);
    }
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        success,
        error,
        warning,
        info,
        confirmAction
      }}
    >
      {children}

      {/* Global Floating Toast Container (Top-Right) */}
      <div
        className="fixed top-4 right-4 z-[99999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
        aria-live="assertive"
      >
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';
          const isInfo = toast.type === 'info';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto w-full rounded-2xl p-4 shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-top-4 flex items-start gap-3 relative overflow-hidden ${
                isSuccess
                  ? 'bg-[#0D2B1D]/95 text-[#FDFBF5] border-emerald-500/40 shadow-emerald-950/40'
                  : isError
                  ? 'bg-[#2A0D12]/95 text-white border-rose-500/40 shadow-rose-950/40'
                  : isWarning
                  ? 'bg-[#2A1E0D]/95 text-white border-amber-500/40 shadow-amber-950/40'
                  : 'bg-[#0D2B1D]/95 text-[#FDFBF5] border-[#D4AF37]/40 shadow-black/50'
              }`}
              role="alert"
            >
              {/* Type Icon */}
              <div className="shrink-0 mt-0.5">
                {isSuccess && (
                  <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {isError && (
                  <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
                {isWarning && (
                  <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                )}
                {isInfo && (
                  <div className="p-1.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 pr-4">
                {toast.title && (
                  <div
                    className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                      isSuccess
                        ? 'text-emerald-400'
                        : isError
                        ? 'text-rose-300'
                        : isWarning
                        ? 'text-amber-400'
                        : 'text-[#D4AF37]'
                    }`}
                  >
                    {toast.title}
                  </div>
                )}
                <div className="text-xs sm:text-sm font-medium leading-snug break-words">
                  {toast.message}
                </div>
              </div>

              {/* Manual Dismiss Button */}
              <button
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 p-1 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Progress Line */}
              {toast.duration && toast.duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
                  <div
                    className={`h-full animate-progress-shrink ${
                      isSuccess
                        ? 'bg-emerald-400'
                        : isError
                        ? 'bg-rose-400'
                        : isWarning
                        ? 'bg-amber-400'
                        : 'bg-[#D4AF37]'
                    }`}
                    style={{ animationDuration: `${toast.duration}ms` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Global Confirmation Prompt Modal */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={() => handleConfirmResponse(false)}
          />
          <div className="relative bg-[#0D2B1D] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200 z-10">
            <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${
              confirmDialog.options.type === 'danger'
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                : confirmDialog.options.type === 'warning'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37]'
            }">
              {confirmDialog.options.type === 'danger' ? (
                <AlertTriangle className="w-7 h-7 text-rose-400" />
              ) : confirmDialog.options.type === 'warning' ? (
                <AlertCircle className="w-7 h-7 text-amber-400" />
              ) : (
                <Info className="w-7 h-7 text-[#D4AF37]" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wide">
                {confirmDialog.options.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#FDFBF5]/70 leading-relaxed">
                {confirmDialog.options.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmResponse(false)}
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-[#FDFBF5]/80 hover:text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer"
              >
                {confirmDialog.options.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmResponse(true)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg cursor-pointer ${
                  confirmDialog.options.type === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
                    : 'bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] shadow-[#D4AF37]/20'
                }`}
              >
                {confirmDialog.options.confirmText || 'Yes, Proceed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
