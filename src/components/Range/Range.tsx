import React, { useState, useRef, useEffect, useCallback } from "react";

export interface RangeProps {
  /**
   * Current value (controlled)
   */
  value?: number;
  /**
   * Default value (uncontrolled)
   * @default 0
   */
  defaultValue?: number;
  /**
   * Minimum value
   * @default 0
   */
  min?: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Step increment
   * @default 1
   */
  step?: number;
  /**
   * Callback when value changes
   */
  onChange?: (value: number) => void;
  /**
   * Callback when value change is complete (mouse up / touch end)
   */
  onChangeComplete?: (value: number) => void;
  /**
   * Label text for the range
   */
  label?: string;
  /**
   * Suffix for the value display (e.g., "%", "تومان", "px")
   * @default "%"
   */
  suffix?: string;
  /**
   * Prefix for the value display (e.g., "$", "€")
   */
  prefix?: string;
  /**
   * Show the current value next to the range
   * @default true
   */
  showValue?: boolean;
  /**
   * Value display position
   * @default "right"
   */
  valuePosition?: "left" | "right" | "top" | "bottom";
  /**
   * Size of the range
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Color variant
   * @default "primary"
   */
  color?: "primary" | "secondary" | "accent" | "success" | "danger" | "warning";
  /**
   * Glow effect on the track
   * @default true
   */
  glow?: boolean;
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  /**
   * Full width
   * @default true
   */
  fullWidth?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI Range - Glassy range slider with sparkle animation
 *
 * Features:
 * - Glassmorphism styling matching Dara UI design system
 * - Smooth sliding with touch support
 * - Sparkle burst animation when reaching max value
 * - Live value display with customizable prefix/suffix
 * - Glow effect on the track
 * - Multiple sizes (sm, md, lg)
 * - Theme-aware colors
 * - RTL support
 * - Controlled and uncontrolled modes
 */
export const Range = React.forwardRef<HTMLDivElement, RangeProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      onChangeComplete,
      label,
      suffix = "%",
      prefix = "",
      showValue = true,
      valuePosition = "right",
      size = "md",
      color = "primary",
      glow = true,
      disabled = false,
      fullWidth = true,
      className = "",
    },
    ref,
  ) => {
    // Determine if controlled or uncontrolled
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const [showSparkles, setShowSparkles] = useState(false);

    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const value = isControlled ? controlledValue : internalValue;
    const clampedValue = Math.max(min, Math.min(max, value));
    const percentage = ((clampedValue - min) / (max - min)) * 100;
    const isAtMax = clampedValue >= max;

    // Live RTL detection
    const [isRTL, setIsRTL] = useState(false);
    useEffect(() => {
      const updateDir = () => {
        setIsRTL(document.documentElement.dir === "rtl");
      };
      updateDir();
      const observer = new MutationObserver(updateDir);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["dir"],
      });
      return () => observer.disconnect();
    }, []);

    // Trigger sparkles when reaching max
    useEffect(() => {
      if (isAtMax && clampedValue > min) {
        setShowSparkles(true);
        const timer = setTimeout(() => setShowSparkles(false), 800);
        return () => clearTimeout(timer);
      }
    }, [isAtMax, clampedValue, min]);

    // Get color classes
    const colorMap = {
      primary: {
        track: "bg-[var(--color-primary)]",
        glow: "shadow-[var(--shadow-glow-primary)]",
        thumb: "border-[var(--color-primary)]",
        text: "text-[var(--color-primary)]",
      },
      secondary: {
        track: "bg-[var(--color-secondary)]",
        glow: "shadow-[var(--shadow-glow-secondary)]",
        thumb: "border-[var(--color-secondary)]",
        text: "text-[var(--color-secondary)]",
      },
      accent: {
        track: "bg-[var(--color-accent)]",
        glow: "shadow-[var(--shadow-glow-accent)]",
        thumb: "border-[var(--color-accent)]",
        text: "text-[var(--color-accent)]",
      },
      success: {
        track: "bg-[var(--color-success)]",
        glow: "shadow-[var(--shadow-glow-success)]",
        thumb: "border-[var(--color-success)]",
        text: "text-[var(--color-success)]",
      },
      danger: {
        track: "bg-[var(--color-danger)]",
        glow: "shadow-[var(--shadow-glow-danger)]",
        thumb: "border-[var(--color-danger)]",
        text: "text-[var(--color-danger)]",
      },
      warning: {
        track: "bg-[var(--color-warning)]",
        glow: "shadow-[var(--shadow-glow-warning)]",
        thumb: "border-[var(--color-warning)]",
        text: "text-[var(--color-warning)]",
      },
    };

    const colors = colorMap[color];

    // Size styles
    const sizeStyles = {
      sm: {
        track: "h-1",
        thumb: "w-4 h-4",
        thumbInner: "w-2 h-2",
        value: "text-xs",
        label: "text-sm",
        gap: "gap-2",
        padding: "py-1 px-2",
      },
      md: {
        track: "h-1.5",
        thumb: "w-5 h-5",
        thumbInner: "w-2.5 h-2.5",
        value: "text-sm",
        label: "text-base",
        gap: "gap-2.5",
        padding: "py-1.5 px-3",
      },
      lg: {
        track: "h-2",
        thumb: "w-6 h-6",
        thumbInner: "w-3 h-3",
        value: "text-base",
        label: "text-lg",
        gap: "gap-3",
        padding: "py-2 px-4",
      },
    };

    const styles = sizeStyles[size];

    // Calculate value from mouse/touch position
    const getValueFromPosition = useCallback(
      (clientX: number) => {
        if (!trackRef.current) return clampedValue;
        const rect = trackRef.current.getBoundingClientRect();
        const trackWidth = rect.width;
        let position = (clientX - rect.left) / trackWidth;
        // In RTL, invert the position
        if (isRTL) position = 1 - position;
        const rawValue = position * (max - min) + min;
        const steppedValue = Math.round(rawValue / step) * step;
        return Math.max(min, Math.min(max, steppedValue));
      },
      [min, max, step, clampedValue, isRTL],
    );

    // Handle mouse/touch events
    const handleStart = useCallback(
      (clientX: number) => {
        if (disabled) return;
        setIsDragging(true);
        const newValue = getValueFromPosition(clientX);
        if (!isControlled) setInternalValue(newValue);
        onChange?.(newValue);
      },
      [disabled, getValueFromPosition, isControlled, onChange],
    );

    const handleMove = useCallback(
      (clientX: number) => {
        if (!isDragging || disabled) return;
        const newValue = getValueFromPosition(clientX);
        if (!isControlled) setInternalValue(newValue);
        onChange?.(newValue);
      },
      [isDragging, disabled, getValueFromPosition, isControlled, onChange],
    );

    const handleEnd = useCallback(() => {
      if (isDragging) {
        setIsDragging(false);
        onChangeComplete?.(clampedValue);
      }
    }, [isDragging, onChangeComplete, clampedValue]);

    // Mouse events
    const handleMouseDown = (e: React.MouseEvent) => {
      handleStart(e.clientX);
      e.preventDefault();
    };

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
      const handleMouseUp = () => handleEnd();

      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, handleMove, handleEnd]);

    // Touch events
    const handleTouchStart = (e: React.TouchEvent) => {
      handleStart(e.touches[0].clientX);
    };

    useEffect(() => {
      const handleTouchMove = (e: TouchEvent) => {
        handleMove(e.touches[0].clientX);
      };
      const handleTouchEnd = () => handleEnd();

      if (isDragging) {
        document.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        document.addEventListener("touchend", handleTouchEnd);
      }

      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }, [isDragging, handleMove, handleEnd]);

    // Format the value display
    const formatValue = () => {
      return `${prefix}${clampedValue}${suffix}`;
    };

    // Value position classes
    const valuePosClasses = {
      left: "flex-row items-center gap-3",
      right: "flex-row items-center gap-3",
      top: "flex-col items-start gap-1.5",
      bottom: "flex-col items-start gap-1.5",
    };

    const valueOrder = {
      left: "order-first",
      right: "order-last",
      top: "order-first",
      bottom: "order-last",
    };

    // Sparkle particles
    const Sparkles = () => {
      const particles = 12;
      const sparkleColors = [
        colors.text,
        "var(--color-secondary)",
        "var(--color-accent)",
        "#ffffff",
      ];

      return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {Array.from({ length: particles }).map((_, i) => {
            const angle = (i / particles) * 360 + Math.random() * 30;
            const distance = 16 + Math.random() * 24;
            const size = 2 + Math.random() * 3;
            const color =
              sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
            const delay = Math.random() * 0.15;

            return (
              <div
                key={i}
                className="range-sparkle"
                style={{
                  left: "50%",
                  top: "50%",
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: "50%",
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                  // @ts-expect-error CSS custom properties
                  "--angle": `${angle}deg`,
                  "--distance": `${distance}px`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={`${fullWidth ? "w-full" : "inline-block"} ${className}`}
      >
        {/* Label */}
        {label && (
          <label
            className={`block ${styles.label} font-medium text-[var(--color-text-secondary)] font-sans mb-1.5`}
          >
            {label}
          </label>
        )}

        {/* Range container with value */}
        <div
          className={`flex ${valuePosClasses[valuePosition] || valuePosClasses.right}`}
        >
          {/* Value display - left or top */}
          {showValue &&
            (valuePosition === "left" || valuePosition === "top") && (
              <span
                className={`
                ${styles.value}
                ${valueOrder[valuePosition]}
                font-mono font-medium
                ${colors.text}
                min-w-[2.5rem]
                transition-colors duration-180
              `}
              >
                {formatValue()}
              </span>
            )}

          {/* Track container */}
          <div
            ref={trackRef}
            className={`
              relative flex-1
              ${styles.gap}
              cursor-pointer
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              py-2
            `}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Track background */}
            <div
              className={`
                absolute top-1/2 -translate-y-1/2
                w-full
                ${styles.track}
                rounded-full
                bg-[var(--color-bg-tertiary)]
                overflow-visible
              `}
            />

            {/* Track fill */}
            <div
              className={`
                absolute top-1/2 -translate-y-1/2
                ${styles.track}
                rounded-full
                ${colors.track}
                ${glow ? colors.glow : ""}
                transition-all duration-150 ease-out
              `}
              style={{
                width: `${percentage}%`,
                [isRTL ? "right" : "left"]: 0,
              }}
            />

            {/* Thumb */}
            <div
              ref={thumbRef}
              className={`
                absolute top-1/2 -translate-y-1/2
                ${styles.thumb}
                rounded-full
                bg-[var(--color-bg-secondary)]
                border-2
                ${colors.thumb}
                transition-all duration-150 ease-out
                flex items-center justify-center
                shadow-[var(--shadow-float)]
                ${isDragging ? "scale-110" : "scale-100"}
                ${disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}
              `}
              style={{
                [isRTL ? "right" : "left"]: `${percentage}%`,
                transform: `translate(${isRTL ? "50%" : "-50%"}, -50%) scale(${isDragging ? 1.1 : 1})`,
                willChange: "transform, left, right",
              }}
            >
              {/* Thumb inner dot */}
              <div
                className={`
                  ${styles.thumbInner}
                  rounded-full
                  ${colors.track}
                  ${glow ? colors.glow : ""}
                  transition-all duration-150
                `}
              />

              {/* Sparkle effect on max */}
              {showSparkles && <Sparkles />}
            </div>
          </div>

          {/* Value display - right or bottom */}
          {showValue &&
            (valuePosition === "right" || valuePosition === "bottom") && (
              <span
                className={`
                ${styles.value}
                ${valueOrder[valuePosition]}
                font-mono font-medium
                ${colors.text}
                min-w-[2.5rem]
                transition-colors duration-180
              `}
              >
                {formatValue()}
              </span>
            )}
        </div>

        {/* Sparkle animation styles */}
        <style>{`
          .range-sparkle {
            animation: rangeSparkleBurst 0.7s ease-out forwards;
          }

          @keyframes rangeSparkleBurst {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(
                calc(-50% + cos(var(--angle)) * var(--distance)),
                calc(-50% + sin(var(--angle)) * var(--distance))
              ) scale(0);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  },
);

Range.displayName = "Range";
export default Range;
