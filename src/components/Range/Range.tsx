import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

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
 * - Instant thumb tracking (no CSS transition while dragging)
 * - Optimistic local value so controlled mode stays in sync with the pointer
 * - Sparkle particles memoized (won't reshuffle every parent re-render)
 * - Glass styling, RTL, sizes, colors
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
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    // Optimistic value while dragging – paints with the pointer, not after parent setState
    const [dragValue, setDragValue] = useState<number | null>(null);
    const [showSparkles, setShowSparkles] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const lastEmittedRef = useRef<number | null>(null);

    const sourceValue = isControlled ? controlledValue! : internalValue;
    const clampedSource = Math.max(min, Math.min(max, sourceValue));
    // What we actually render
    const displayValue =
      dragValue !== null
        ? Math.max(min, Math.min(max, dragValue))
        : clampedSource;
    const percentage = ((displayValue - min) / (max - min)) * 100;
    const isAtMax = displayValue >= max;

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

    // Sparkles only when we first hit max (not every re-render at max)
    const wasAtMaxRef = useRef(false);
    useEffect(() => {
      if (isAtMax && !wasAtMaxRef.current && displayValue > min) {
        setShowSparkles(true);
        const timer = setTimeout(() => setShowSparkles(false), 800);
        wasAtMaxRef.current = true;
        return () => clearTimeout(timer);
      }
      if (!isAtMax) wasAtMaxRef.current = false;
    }, [isAtMax, displayValue, min]);

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

    const sizeStyles = {
      sm: {
        track: "h-1",
        thumb: "w-4 h-4",
        thumbInner: "w-2 h-2",
        value: "text-xs",
        label: "text-sm",
        gap: "gap-2",
      },
      md: {
        track: "h-1.5",
        thumb: "w-5 h-5",
        thumbInner: "w-2.5 h-2.5",
        value: "text-sm",
        label: "text-base",
        gap: "gap-2.5",
      },
      lg: {
        track: "h-2",
        thumb: "w-6 h-6",
        thumbInner: "w-3 h-3",
        value: "text-base",
        label: "text-lg",
        gap: "gap-3",
      },
    };

    const styles = sizeStyles[size];

    const getValueFromPosition = useCallback(
      (clientX: number) => {
        if (!trackRef.current) return displayValue;
        const rect = trackRef.current.getBoundingClientRect();
        let position = (clientX - rect.left) / rect.width;
        if (isRTL) position = 1 - position;
        const rawValue = position * (max - min) + min;
        const steppedValue = Math.round(rawValue / step) * step;
        return Math.max(min, Math.min(max, steppedValue));
      },
      [min, max, step, displayValue, isRTL],
    );

    const emitChange = useCallback(
      (newValue: number) => {
        // Skip redundant parent updates (cuts down App re-renders / particle resets)
        if (lastEmittedRef.current === newValue) return;
        lastEmittedRef.current = newValue;
        if (!isControlled) setInternalValue(newValue);
        onChange?.(newValue);
      },
      [isControlled, onChange],
    );

    const handleStart = useCallback(
      (clientX: number) => {
        if (disabled) return;
        setIsDragging(true);
        const newValue = getValueFromPosition(clientX);
        setDragValue(newValue);
        emitChange(newValue);
      },
      [disabled, getValueFromPosition, emitChange],
    );

    const handleMove = useCallback(
      (clientX: number) => {
        if (!isDragging || disabled) return;
        const newValue = getValueFromPosition(clientX);
        setDragValue(newValue);
        emitChange(newValue);
      },
      [isDragging, disabled, getValueFromPosition, emitChange],
    );

    const handleEnd = useCallback(() => {
      if (!isDragging) return;
      setIsDragging(false);
      const finalValue = dragValue !== null ? dragValue : clampedSource;
      setDragValue(null);
      onChangeComplete?.(finalValue);
    }, [isDragging, dragValue, clampedSource, onChangeComplete]);

    const handleMouseDown = (e: React.MouseEvent) => {
      handleStart(e.clientX);
      e.preventDefault();
    };

    useEffect(() => {
      if (!isDragging) return;
      const onMove = (e: MouseEvent) => handleMove(e.clientX);
      const onUp = () => handleEnd();
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      return () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
    }, [isDragging, handleMove, handleEnd]);

    const handleTouchStart = (e: React.TouchEvent) => {
      handleStart(e.touches[0].clientX);
    };

    useEffect(() => {
      if (!isDragging) return;
      const onMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
      const onEnd = () => handleEnd();
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd);
      return () => {
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);
      };
    }, [isDragging, handleMove, handleEnd]);

    const formatValue = () => `${prefix}${displayValue}${suffix}`;

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

    // Stable particle set – only regenerated when a sparkle burst starts
    const sparkleParticles = useMemo(() => {
      if (!showSparkles) return [];
      const sparkleColors = [
        "var(--color-primary)",
        "var(--color-secondary)",
        "var(--color-accent)",
        "#ffffff",
      ];
      return Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i / 12) * 360 + ((i * 7) % 30),
        distance: 16 + (i % 5) * 5,
        size: 2 + (i % 3),
        color: sparkleColors[i % sparkleColors.length],
        delay: (i % 4) * 0.04,
      }));
    }, [showSparkles]);

    const verticalCenter = {
      top: "50%",
      transform: "translateY(-50%)",
    } as const;

    // No transition while dragging = thumb locked to the pointer
    const trackTransition = isDragging ? "none" : "width 120ms ease-out";
    const thumbTransition = isDragging ? "none" : "transform 120ms ease-out";

    return (
      <div
        ref={ref}
        className={`${fullWidth ? "w-full" : "inline-block"} ${className}`}
        style={{ minWidth: "120px" }}
      >
        {label && (
          <label
            className={`block ${styles.label} font-medium text-[var(--color-text-secondary)] font-sans mb-1.5`}
          >
            {label}
          </label>
        )}

        <div
          className={`flex ${valuePosClasses[valuePosition] || valuePosClasses.right}`}
        >
          {showValue &&
            (valuePosition === "left" || valuePosition === "top") && (
              <span
                className={`
                ${styles.value}
                ${valueOrder[valuePosition]}
                font-mono font-medium
                ${colors.text}
                min-w-[2.5rem]
              `}
              >
                {formatValue()}
              </span>
            )}

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
                absolute left-0 right-0 w-full
                ${styles.track}
                rounded-full
                bg-[var(--color-bg-tertiary)]
              `}
              style={verticalCenter}
            />

            {/* Track fill */}
            <div
              className={`
                absolute
                ${styles.track}
                rounded-full
                ${colors.track}
                ${glow ? colors.glow : ""}
              `}
              style={{
                ...verticalCenter,
                width: `${percentage}%`,
                [isRTL ? "right" : "left"]: 0,
                transition: trackTransition,
              }}
            />

            {/* Thumb */}
            <div
              ref={thumbRef}
              className={`
                absolute
                ${styles.thumb}
                rounded-full
                bg-[var(--color-bg-secondary)]
                border-2
                ${colors.thumb}
                flex items-center justify-center
                shadow-[var(--shadow-float)]
                ${disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}
              `}
              style={{
                top: "50%",
                [isRTL ? "right" : "left"]: `${percentage}%`,
                transform: `translate(${isRTL ? "50%" : "-50%"}, -50%) scale(${isDragging ? 1.1 : 1})`,
                transition: thumbTransition,
                willChange: isDragging ? "transform, left, right" : "auto",
              }}
            >
              <div
                className={`
                  ${styles.thumbInner}
                  rounded-full
                  ${colors.track}
                  ${glow ? colors.glow : ""}
                `}
              />
              {showSparkles && sparkleParticles.length > 0 && (
                <div className="absolute inset-0 pointer-events-none overflow-visible">
                  {sparkleParticles.map((p) => (
                    <div
                      key={p.id}
                      className="range-sparkle"
                      style={{
                        left: "50%",
                        top: "50%",
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        borderRadius: "50%",
                        position: "absolute",
                        transform: "translate(-50%, -50%)",
                        // @ts-expect-error CSS custom properties
                        "--angle": `${p.angle}deg`,
                        "--distance": `${p.distance}px`,
                        animationDelay: `${p.delay}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {showValue &&
            (valuePosition === "right" || valuePosition === "bottom") && (
              <span
                className={`
                ${styles.value}
                ${valueOrder[valuePosition]}
                font-mono font-medium
                ${colors.text}
                min-w-[2.5rem]
              `}
              >
                {formatValue()}
              </span>
            )}
        </div>

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
