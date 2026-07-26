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
 * - Smart positioning with collision detection
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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeout = useRef<NodeJS.Timeout | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const isControlled = controlledOpen !== undefined;
  const isVisible = isControlled ? controlledOpen : isOpen;

  // Size styles
  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3.5 py-2 text-sm",
    lg: "px-4.5 py-2.5 text-base",
  };

  // Variant styles
  const variantStyles = {
    glass: "glass",
    solid: "glass-solid",
    outline: "glass-outline",
  };

  // Arrow placement classes
  const arrowPlacement = {
    top: "bottom-[-6px] left-1/2 -translate-x-1/2 border-t-[var(--glass-border)]",
    bottom:
      "top-[-6px] left-1/2 -translate-x-1/2 border-b-[var(--glass-border)]",
    left: "right-[-6px] top-1/2 -translate-y-1/2 border-l-[var(--glass-border)]",
    right:
      "left-[-6px] top-1/2 -translate-y-1/2 border-r-[var(--glass-border)]",
    "top-left": "bottom-[-6px] left-3",
    "top-right": "bottom-[-6px] right-3",
    "bottom-left": "top-[-6px] left-3",
    "bottom-right": "top-[-6px] right-3",
  };

  // Arrow transform for different placements
  const arrowTransform = {
    top: "rotate-45",
    bottom: "rotate-45",
    left: "rotate-45",
    right: "rotate-45",
    "top-left": "rotate-45",
    "top-right": "rotate-45",
    "bottom-left": "rotate-45",
    "bottom-right": "rotate-45",
  };

  /**
   * calculatePosition - Determines the position of the tooltip relative to the trigger
   */
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Get tooltip dimensions if rendered
    let tooltipWidth = 0;
    let tooltipHeight = 0;
    if (tooltipRef.current) {
      tooltipWidth = tooltipRef.current.offsetWidth;
      tooltipHeight = tooltipRef.current.offsetHeight;
    }

    // Default padding between trigger and tooltip
    const padding = 10;

    // Calculate position based on placement
    let top = 0;
    let left = 0;

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    switch (placement) {
      case "top":
        top = triggerRect.top + scrollY - tooltipHeight - padding;
        left = triggerCenterX + scrollX - tooltipWidth / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollY + padding;
        left = triggerCenterX + scrollX - tooltipWidth / 2;
        break;
      case "left":
        top = triggerCenterY + scrollY - tooltipHeight / 2;
        left = triggerRect.left + scrollX - tooltipWidth - padding;
        break;
      case "right":
        top = triggerCenterY + scrollY - tooltipHeight / 2;
        left = triggerRect.right + scrollX + padding;
        break;
      case "top-left":
        top = triggerRect.top + scrollY - tooltipHeight - padding;
        left = triggerRect.left + scrollX;
        break;
      case "top-right":
        top = triggerRect.top + scrollY - tooltipHeight - padding;
        left = triggerRect.right + scrollX - tooltipWidth;
        break;
      case "bottom-left":
        top = triggerRect.bottom + scrollY + padding;
        left = triggerRect.left + scrollX;
        break;
      case "bottom-right":
        top = triggerRect.bottom + scrollY + padding;
        left = triggerRect.right + scrollX - tooltipWidth;
        break;
      default:
        top = triggerRect.top + scrollY - tooltipHeight - padding;
        left = triggerCenterX + scrollX - tooltipWidth / 2;
    }

    setPosition({ top, left });
  }, [placement]);

  /**
   * showTooltip - Shows the tooltip with optional delay
   */
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
      if (!isControlled) {
        setIsOpen(true);
      }
      onOpen?.();
      // Calculate position after tooltip renders
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }, delay);
  }, [disabled, delay, isControlled, onOpen, calculatePosition]);

  /**
   * hideTooltip - Hides the tooltip with optional delay
   */
  const hideTooltip = useCallback(() => {
    if (showTimeout.current) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
    }

    hideTimeout.current = setTimeout(() => {
      if (!isControlled) {
        setIsOpen(false);
      }
      onClose?.();
    }, hideDelay);
  }, [hideDelay, isControlled, onClose]);

  /**
   * mouseEnter - Trigger show on hover
   */
  const handleMouseEnter = useCallback(() => {
    showTooltip();
  }, [showTooltip]);

  /**
   * mouseLeave - Trigger hide on hover leave
   */
  const handleMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  /**
   * focus - Show on focus for accessibility
   */
  const handleFocus = useCallback(() => {
    showTooltip();
  }, [showTooltip]);

  /**
   * blur - Hide on blur for accessibility
   */
  const handleBlur = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  // Update position when tooltip opens or window resizes
  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(calculatePosition, 50);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, calculatePosition]);

  // Recalculate on window resize and scroll
  useEffect(() => {
    if (!isVisible) return;

    const handleUpdate = () => {
      calculatePosition();
    };

    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
    };
  }, [isVisible, calculatePosition]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeout.current) clearTimeout(showTimeout.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  // Render tooltip in portal
  const renderTooltip = () => {
    if (!isVisible || !content) return null;

    return createPortal(
      <div
        ref={tooltipRef}
        className={`
          fixed z-[10002]
          font-body text-[var(--color-text-primary)]
          transition-opacity duration-[var(--transition-fast)]
          ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        style={{
          top: position.top,
          left: position.left,
          maxWidth: maxWidth,
        }}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        {content}

        {/* Arrow */}
        {arrow && (
          <div
            className={`
              absolute w-3 h-3
              bg-inherit
              border-inherit
              transform ${arrowTransform[placement]}
              ${arrowPlacement[placement]}
            `}
            style={{
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "inherit",
            }}
          />
        )}
      </div>,
      document.body,
    );
  };

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
      {renderTooltip()}
    </>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
