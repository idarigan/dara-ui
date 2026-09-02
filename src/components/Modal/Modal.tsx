import React, { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../Button/Button";

export interface ModalProps {
  /**
   * Whether the modal is open
   * @default false
   */
  isOpen: boolean;
  /**
   * Callback when modal closes
   */
  onClose: () => void;
  /**
   * Modal title
   */
  title?: React.ReactNode;
  /**
   * Modal content
   */
  children: React.ReactNode;
  /**
   * Modal size
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Close on backdrop click
   * @default true
   */
  closeOnBackdropClick?: boolean;
  /**
   * Close on Escape key
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Confirm button text
   */
  confirmText?: string;
  /**
   * Cancel button text
   */
  cancelText?: string;
  /**
   * Callback when confirm is clicked
   */
  onConfirm?: () => void;
  /**
   * Additional className for modal content
   */
  className?: string;
}

/**
 * Dara UI Modal - Theme-aware modal with glass styling
 *
 * Features:
 * - Theme-aware overlay with backdrop blur
 * - Glass-heavy styling with CSS variables
 * - Scale-in animation
 * - Portal rendering
 * - Focus management
 * - Keyboard support (Escape to close)
 */
const ANIMATION_DURATION = 300;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  confirmText,
  cancelText,
  onConfirm,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Size styles
  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  // Handle open/close animation
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isOpen) {
      setMounted(true);
      setVisible(false);

      timer = setTimeout(() => {
        setVisible(true);
      }, 20);
    } else {
      setVisible(false);

      timer = setTimeout(() => {
        setMounted(false);
      }, ANIMATION_DURATION);
    }

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const t = setTimeout(() => modalRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
    previousFocusRef.current?.focus();
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose],
  );

  // Handle confirm
  const handleConfirm = useCallback(() => {
    onConfirm?.();
    onClose();
  }, [onConfirm, onClose]);

  // Don't render anything if shouldRender is false
  if (!mounted) return null;

  // Portal rendering
  return createPortal(
    <div
      ref={modalRef}
      className={`
        fixed inset-0 z-[10001]
        flex items-center justify-center
        bg-[var(--color-bg-primary)]/60 backdrop-blur-[6px]
        transition-all duration-300 ease-[var(--ease-in-out,cubic-bezier(0.4,0,0.2,1))]
        ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      tabIndex={-1}
    >
      <div
        className={`
          glass-heavy p-8
          w-[90%] ${sizeStyles[size]}
          transition-all duration-300 ease-[var(--ease-in-out,cubic-bezier(0.4,0,0.2,1))]
          ${visible ? "scale-100 opacity-100" : "scale-90 opacity-0"}
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h3
              id="modal-title"
              className="font-heading text-xl font-bold text-[var(--color-text-primary)]"
            >
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] text-2xl leading-none transition-colors duration-180"
            aria-label="Close modal"
            title="Close"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="text-[var(--color-text-secondary)] mb-4 font-sans text-sm leading-relaxed">
          {children}
        </div>

        {/* Footer - using Button component */}
        {(confirmText || cancelText) && (
          <div className="flex gap-3 mt-6">
            {confirmText && (
              <Button variant="primary" onClick={handleConfirm}>
                {confirmText}
              </Button>
            )}
            {cancelText && (
              <Button variant="glass" onClick={onClose}>
                {cancelText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

Modal.displayName = "Modal";
export default Modal;
