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
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  hideDelay?: number;
  maxWidth?: string;
  arrow?: boolean;
  variant?: "glass" | "solid" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
}

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

  const variantStyles = {
    glass: "glass",
    solid: "glass-solid",
    outline: "glass-outline",
  };

  const ANIMATION_DURATION = 150;

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

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let raf1: number;
    let raf2: number;

    if (isVisible) {
      setMounted(true);
      setVisible(false);

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
        setCoords({ top: -9999, left: -9999 });
      }, ANIMATION_DURATION);
    }

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
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

  const handleMouseEnter = useCallback(() => showTooltip(), [showTooltip]);
  const handleMouseLeave = useCallback(() => hideTooltip(), [hideTooltip]);
  const handleFocus = useCallback(() => showTooltip(), [showTooltip]);
  const handleBlur = useCallback(() => hideTooltip(), [hideTooltip]);

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

  useEffect(() => {
    return () => {
      if (showTimeout.current) clearTimeout(showTimeout.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  // Debug: log mounted and visible states
  useEffect(() => {
    console.log(
      "Tooltip mounted:",
      mounted,
      "visible:",
      visible,
      "coords:",
      coords,
    );
  }, [mounted, visible, coords]);

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

      {mounted &&
        createPortal(
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
          >
            {content}

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
