import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
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
  /**
   * Callback when toast is dismissed
   */
  onDismiss?: () => void;
  /**
   * Toast ID for management
   */
  id?: string;
}

// ── SVG Icons for Toast ──
const SuccessIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
  switch (type) {
    case "success":
      return <SuccessIcon />;
    case "error":
      return <ErrorIcon />;
    case "warning":
      return <WarningIcon />;
    default:
      return <InfoIcon />;
  }
};

/**
 * Individual Toast Component
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Color mapping for toast types
  const typeColors = {
    success: {
      bg: "bg-[rgba(0,255,153,0.12)]",
      border: "border-[rgba(0,255,153,0.3)]",
      text: "text-[var(--color-success)]",
    },
    error: {
      bg: "bg-[rgba(255,83,112,0.12)]",
      border: "border-[rgba(255,83,112,0.3)]",
      text: "text-[var(--color-danger)]",
    },
    warning: {
      bg: "bg-[rgba(255,200,87,0.12)]",
      border: "border-[rgba(255,200,87,0.3)]",
      text: "text-[var(--color-warning)]",
    },
    info: {
      bg: "bg-[rgba(96,165,250,0.12)]",
      border: "border-[rgba(96,165,250,0.3)]",
      text: "text-[var(--color-info)]",
    },
  };

  // Enter animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  }, [onDismiss]);

  const colors = typeColors[type];

  return (
    <div
      className={`
        glass-heavy
        px-5 py-3.5
        rounded-[14px]
        font-accent text-sm font-medium
        border
        shadow-[0_8px_32px_rgba(0,0,0,0.35)]
        flex items-center gap-3
        w-[360px] max-w-[90vw]
        transition-all duration-[var(--transition-med)] ease-[var(--ease-in-out)]
        ${colors.bg}
        ${colors.border}
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-[calc(100%+24px)] opacity-0"}
        ${isExiting ? "scale-95 opacity-0" : ""}
      `}
      role="alert"
      aria-live="polite"
    >
      <span className={`${colors.text} flex-shrink-0`}>
        <ToastIcon type={type} />
      </span>
      <span className="text-[var(--color-text-primary)] flex-1">{message}</span>
      <button
        onClick={handleDismiss}
        className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors duration-180 flex-shrink-0 ml-2"
        aria-label="Dismiss toast"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

Toast.displayName = "Toast";

// ----- Toast Container -----
export interface ToastContainerProps {
  toasts: (ToastProps & { id: string })[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-6 right-6 z-[10000] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onDismiss={() => onRemove(toast.id)} />
        </div>
      ))}
    </div>,
    document.body,
  );
};

ToastContainer.displayName = "ToastContainer";

export default Toast;
