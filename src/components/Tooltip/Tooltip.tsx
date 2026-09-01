import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
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

  // Real design-system surfaces
  const variantClass =
    variant === "solid"
      ? "glass-solid"
      : variant === "outline"
        ? "glass-outline"
        : "glass";

  const ANIMATION_DURATION = 150;

  const calculatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tip = tooltipRef.current;
    if (!trigger || !tip) return false;

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipWidth = tip.offsetWidth;
    const tooltipHeight = tip.offsetHeight;

    if (tooltipWidth === 0 || tooltipHeight === 0) return false;

    const gap = 8;
    let top = 0;
    let left = 0;

    const cx = triggerRect.left + triggerRect.width / 2;
    const cy = triggerRect.top + triggerRect.height / 2;

    switch (placement) {
      case "top":
        top = triggerRect.top - tooltipHeight - gap;
        left = cx - tooltipWidth / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + gap;
        left = cx - tooltipWidth / 2;
        break;
      case "left":
        top = cy - tooltipHeight / 2;
        left = triggerRect.left - tooltipWidth - gap;
        break;
      case "right":
        top = cy - tooltipHeight / 2;
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
        left = cx - tooltipWidth / 2;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (left < 8) left = 8;
    if (left + tooltipWidth > vw - 8) left = vw - tooltipWidth - 8;
    if (top < 8) top = 8;
    if (top + tooltipHeight > vh - 8) top = vh - tooltipHeight - 8;

    setCoords({ top, left });
    return true;
  }, [placement]);

  useLayoutEffect(() => {
    if (!isVisible) {
      setVisible(false);
      const t = setTimeout(() => {
        setMounted(false);
        setCoords({ top: -9999, left: -9999 });
      }, ANIMATION_DURATION);
      return () => clearTimeout(t);
    }

    setMounted(true);
    setVisible(false);

    let attempts = 0;
    let raf = 0;

    const tryMeasure = () => {
      attempts += 1;
      if (calculatePosition()) {
        setVisible(true);
        return;
      }
      if (attempts < 8) {
        raf = requestAnimationFrame(tryMeasure);
      } else {
        setVisible(true);
      }
    };

    raf = requestAnimationFrame(tryMeasure);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    if (!isVisible) return;
    const onUpdate = () => calculatePosition();
    window.addEventListener("resize", onUpdate);
    window.addEventListener("scroll", onUpdate, true);
    return () => {
      window.removeEventListener("resize", onUpdate);
      window.removeEventListener("scroll", onUpdate, true);
    };
  }, [isVisible, calculatePosition]);

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

  useEffect(() => {
    return () => {
      if (showTimeout.current) clearTimeout(showTimeout.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  const arrowPos: Record<TooltipPlacement, string> = {
    top: "bottom-[-5px] left-1/2 -translate-x-1/2",
    bottom: "top-[-5px] left-1/2 -translate-x-1/2",
    left: "right-[-5px] top-1/2 -translate-y-1/2",
    right: "left-[-5px] top-1/2 -translate-y-1/2",
    "top-left": "bottom-[-5px] left-3",
    "top-right": "bottom-[-5px] right-3",
    "bottom-left": "top-[-5px] left-3",
    "bottom-right": "top-[-5px] right-3",
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {mounted &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`
              z-[10002]
              font-sans text-[var(--color-text-primary)]
              transition-opacity duration-150 ease-out
              pointer-events-none
              ${visible ? "opacity-100" : "opacity-0"}
              ${variantClass}
              ${sizeStyles[size]}
              ${className}
            `}
            style={{
              // CRITICAL: .glass sets position:relative and would override Tailwind "fixed"
              position: "fixed",
              top: coords.top,
              left: coords.left,
              maxWidth,
            }}
            role="tooltip"
          >
            {content}

            {arrow && (
              <div
                className={`absolute w-2.5 h-2.5 rotate-45 ${arrowPos[placement]}`}
                style={{
                  background: "inherit",
                  border:
                    "1px solid var(--glass-border, rgba(255,255,255,0.12))",
                }}
                aria-hidden="true"
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
