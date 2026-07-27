// src/components/Tooltip/Tooltip.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export type TooltipPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface TooltipProps {
  /**
   * Tooltip content
   */
  content: React.ReactNode;
  /**
   * Child element that triggers the tooltip
   */
  children: React.ReactNode;
  /**
   * Tooltip placement relative to the trigger
   * @default "top"
   */
  placement?: TooltipPlacement;
  /**
   * Delay before showing the tooltip (ms)
   * @default 300
   */
  delay?: number;
  /**
   * Delay before hiding the tooltip (ms)
   * @default 0
   */
  hideDelay?: number;
  /**
   * Maximum width of the tooltip
   * @default "240px"
   */
  maxWidth?: string;
  /**
   * Show arrow indicator
   * @default true
   */
  arrow?: boolean;
  /**
   * Tooltip variant
   * @default "glass"
   */
  variant?: "glass" | "solid" | "outline";
  /**
   * Tooltip size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Disable the tooltip
   * @default false
   */
  disabled?: boolean;
  /**
   * Open state (controlled)
   */
  open?: boolean;
  /**
   * Callback when tooltip opens
   */
  onOpen?: () => void;
  /**
   * Callback when tooltip closes
   */
  onClose?: () => void;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI Tooltip - Popup tooltips with positioning and animations
 *
 * Features:
 * - Multiple placements (top, bottom, left, right, corners)
 * - Glass, solid, and outline variants
 * - Arrow indicator
 * - Delay controls
 * - Controlled/Uncontrolled modes
 * - Portal rendering for correct z-index
 * - Proper fade + position (no corner jump)
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  delay = 300,
  hideDelay = 0,
  maxWidth = "240px",
  arrow = true,
  variant = "glass",
  size = "md",
  disabled = false,
  open: controlledOpen,
  onOpen,
  onClose,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  // Start way off-screen so the first paint is never visible
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = controlledOpen !== undefined;
  const isVisible = isControlled ? controlledOpen : isOpen;

  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3.5 py-2 text-sm",
    lg: "px-[18px] py-2.5 text-base",
  };

  const variantStyles = {
    glass: "glass",
    solid: "glass-solid",
    outline: "glass-outline",
  };

  const ANIMATION_DURATION = 150; // keep in sync with CSS

  // Calculate position relative to trigger
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRef.current.offsetWidth;
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const gap = 8;

    let top = 0;
    let left = 0;

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    switch (placement) {
      case "top":
        top = triggerRect.top - tooltipHeight - gap;
        left = triggerCenterX - tooltipWidth / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + gap;
        left = triggerCenterX - tooltipWidth / 2;
        break;
      case "left":
        top = triggerCenterY - tooltipHeight / 2;
        left = triggerRect.left - tooltipWidth - gap;
        break;
      case "right":
        top = triggerCenterY - tooltipHeight / 2;
        left = triggerRect.right + gap;
        break;
      case "top-left":
        top = triggerRect.top - tooltipHeight - gap;
        left = triggerRect.left;
        break;
      case "top-right":
        top = triggerRect.top - tooltipHeight - gap;
        left = triggerRect.right - tooltipWidth;
        break;
      case "bottom-left":
        top = triggerRect.bottom + gap;
        left = triggerRect.left;
        break;
      case "bottom-right":
        top = triggerRect.bottom + gap;
        left = triggerRect.right - tooltipWidth;
        break;
      default:
        top = triggerRect.top - tooltipHeight - gap;
        left = triggerCenterX - tooltipWidth / 2;
    }

    // Keep inside viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 10) left = 10;
    if (left + tooltipWidth > viewportWidth - 10) {
      left = viewportWidth - tooltipWidth - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipHeight > viewportHeight - 10) {
      top = viewportHeight - tooltipHeight - 10;
    }

    setCoords({ top, left });
  }, [placement]);

  // Animation lifecycle
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let raf1: number;
    let raf2: number;

    if (isVisible) {
      setMounted(true);
      setVisible(false);

      // Double rAF = wait until the portal is in the DOM *and* laid out
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          calculatePosition();
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      timer = setTimeout(() => {
        setMounted(false);
        // Reset so the next open never starts at a previous position
        setCoords({ top: -9999, left: -9999 });
      }, ANIMATION_DURATION);
    }

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isVisible, calculatePosition]);

  // Show / hide helpers
  const showTooltip = useCallback(() => {
    if (disabled) return;

    if (showTimeout.current) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
    }
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }

    showTimeout.current = setTimeout(() => {
      if (!isControlled) setIsOpen(true);
      onOpen?.();
    }, delay);
  }, [disabled, delay, isControlled, onOpen]);

  const hideTooltip = useCallback(() => {
    if (showTimeout.current) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
    }

    hideTimeout.current = setTimeout(() => {
      if (!isControlled) setIsOpen(false);
      onClose?.();
    }, hideDelay);
  }, [hideDelay, isControlled, onClose]);

  // Mouse + focus events
  const handleMouseEnter = useCallback(() => showTooltip(), [showTooltip]);
  const handleMouseLeave = useCallback(() => hideTooltip(), [hideTooltip]);
  const handleFocus = useCallback(() => showTooltip(), [showTooltip]);
  const handleBlur = useCallback(() => hideTooltip(), [hideTooltip]);

  // Recalculate on resize / scroll
  useEffect(() => {
    if (!isVisible) return;

    const handleUpdate = () => calculatePosition();
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
    };
  }, [isVisible, calculatePosition]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (showTimeout.current) clearTimeout(showTimeout.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  // Don't keep anything in the tree when closed
  if (!mounted) {
    return (
      <div
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </div>
    );
  }

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </div>

      {createPortal(
        <div
          ref={tooltipRef}
          className={`
            fixed z-[10002]
            font-sans text-[var(--color-text-primary)]
            transition-opacity duration-150 ease-out
            ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${className}
          `}
          style={{
            top: coords.top,
            left: coords.left,
            maxWidth,
          }}
          role="tooltip"
          aria-hidden={!visible}
        >
          {content}

          {/* Arrow */}
          {arrow && (
            <div
              className={`
                absolute w-2.5 h-2.5
                bg-inherit
                transform rotate-45
                ${placement === "top" ? "bottom-[-5px] left-1/2 -translate-x-1/2 border-t border-l" : ""}
                ${placement === "bottom" ? "top-[-5px] left-1/2 -translate-x-1/2 border-b border-r" : ""}
                ${placement === "left" ? "right-[-5px] top-1/2 -translate-y-1/2 border-t border-r" : ""}
                ${placement === "right" ? "left-[-5px] top-1/2 -translate-y-1/2 border-b border-l" : ""}
                ${placement === "top-left" ? "bottom-[-5px] left-3 border-t border-l" : ""}
                ${placement === "top-right" ? "bottom-[-5px] right-3 border-t border-r" : ""}
                ${placement === "bottom-left" ? "top-[-5px] left-3 border-b border-l" : ""}
                ${placement === "bottom-right" ? "top-[-5px] right-3 border-b border-r" : ""}
              `}
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "var(--glass-border, rgba(255,255,255,0.1))",
              }}
            />
          )}
        </div>,
        document.body,
      )}
    </>
  );
};

Tooltip.displayName = "Tooltip";
export default Tooltip;
