import React, { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";

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
 * Dara UI Modal
 */
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
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Size styles
  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger enter animation after a tiny delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // Wait for exit animation to complete before removing from DOM
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 250); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus the modal container
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
    } else {
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && event.target === event.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose],
  );

  // Handle confirm
  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  }, [onConfirm, onClose]);

  // Don't render anything if shouldRender is false
  if (!shouldRender) return null;

  // Portal rendering
  return createPortal(
    <div
      ref={modalRef}
      className={`
        fixed inset-0 z-[10001]
        flex items-center justify-center
        bg-black/60 backdrop-blur-[6px]
        transition-all duration-[var(--transition-med)] ease-[var(--ease-in-out)]
        ${isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
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
          transition-all duration-[var(--transition-med)] ease-[var(--ease-in-out)]
          ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"}
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
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="text-[var(--color-text-secondary)] mb-4 font-body text-sm leading-relaxed">
          {children}
        </div>

        {/* Footer with actions */}
        {(confirmText || cancelText) && (
          <div className="flex gap-3 mt-6">
            {confirmText && (
              <button className="btn-dara btn-primary" onClick={handleConfirm}>
                {confirmText}
              </button>
            )}
            {cancelText && (
              <button className="btn-dara btn-glass" onClick={onClose}>
                {cancelText}
              </button>
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
