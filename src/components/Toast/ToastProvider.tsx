import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { ToastContainer } from "./Toast";
import type { ToastType } from "./Toast";

export interface ToastOptions {
  /**
   * Toast message
   */
  message: string;
  /**
   * Toast type
   * @default "info"
   */
  type?: ToastType;
  /**
   * Duration in ms before auto-dismiss
   * @default 3000
   */
  duration?: number;
}

interface ToastContextValue {
  /**
   * Show a toast notification
   */
  showToast: (options: ToastOptions) => void;
  /**
   * Show a success toast
   */
  success: (message: string, duration?: number) => void;
  /**
   * Show an error toast
   */
  error: (message: string, duration?: number) => void;
  /**
   * Show a warning toast
   */
  warning: (message: string, duration?: number) => void;
  /**
   * Show an info toast
   */
  info: (message: string, duration?: number) => void;
  /**
   * Clear all toasts
   */
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Toast Provider - wraps your app to enable toast functionality
 *
 * Features:
 * - Maximum 5 toasts visible at once (FIFO)
 * - Auto-dismiss after duration
 * - Multiple toast types: success, error, warning, info
 * - Clean API with helper methods
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Maximum number of toasts that can be displayed simultaneously
  const MAX_TOASTS = 5;

  const [toasts, setToasts] = useState<(ToastOptions & { id: string })[]>([]);

  /**
   * removeToast - Removes a toast by ID
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * showToast - Displays a new toast notification
   *
   * Implements FIFO (First In First Out) ordering:
   * - If more than MAX_TOASTS are present, the oldest one is removed
   * - New toasts are added to the end of the array
   * - The container renders them in reverse order (newest on top)
   */
  const showToast = useCallback(
    (options: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      // Add new toast
      setToasts((prev) => {
        const newToasts = [...prev, { ...options, id }];
        // If we exceed the maximum, remove the oldest (first item)
        if (newToasts.length > MAX_TOASTS) {
          return newToasts.slice(1);
        }
        return newToasts;
      });

      // Auto-remove after duration + animation time
      const duration = options.duration || 3000;
      setTimeout(() => {
        removeToast(id);
      }, duration + 350);
    },
    [removeToast],
  );

  /**
   * success - Show a success toast
   */
  const success = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "success", duration });
    },
    [showToast],
  );

  /**
   * error - Show an error toast
   */
  const error = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "error", duration });
    },
    [showToast],
  );

  /**
   * warning - Show a warning toast
   */
  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "warning", duration });
    },
    [showToast],
  );

  /**
   * info - Show an info toast
   */
  const info = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "info", duration });
    },
    [showToast],
  );

  /**
   * clearAll - Remove all toasts immediately
   */
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    showToast,
    success,
    error,
    warning,
    info,
    clearAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

/**
 * useToast hook - for showing toast notifications
 *
 * @example
 * ```tsx
 * const toast = useToast();
 *
 * // Show a success toast
 * toast.success('Mission complete! +300 XP earned.');
 *
 * // Show an error toast
 * toast.error('Connection lost. Retrying...');
 *
 * // Show a warning toast with custom duration
 * toast.warning('Please check your connection', 5000);
 *
 * // Show an info toast
 * toast.info('Archives are being indexed');
 * ```
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default useToast;
