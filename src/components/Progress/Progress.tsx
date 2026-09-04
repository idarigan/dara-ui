import React from "react";

export interface ProgressProps {
  /**
   * Progress value (0-100)
   */
  value?: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Progress variant
   * @default "horizontal"
   */
  variant?: "horizontal" | "radial";
  /**
   * Progress size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Color variant
   * @default "primary"
   */
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "danger"
    | "warning"
    | "gradient";
  /**
   * Show value label
   * @default false
   */
  showLabel?: boolean;
  /**
   * Label format function
   * @default (value, max) => `${Math.round((value/max)*100)}%`
   */
  labelFormat?: (value: number, max: number) => string;
  /**
   * Custom label text (overrides value formatting)
   */
  label?: string;
  /**
   * Label position (horizontal only)
   * @default "inside"
   */
  labelPosition?: "left" | "right" | "top" | "bottom" | "inside";
  /**
   * Animate progress changes
   * @default true
   */
  animated?: boolean;
  /**
   * Thickness of the progress bar
   * @default 8
   */
  thickness?: number;
  /**
   * Radial size in pixels (radial only)
   * @default 80
   */
  radialSize?: number;
  /**
   * Show percentage, ratio, or custom
   * @default "percentage"
   */
  displayType?: "percentage" | "ratio" | "custom";
  /**
   * Glow effect on the progress fill
   * @default false
   */
  glow?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI Progress - Horizontal and radial progress indicators
 *
 * Features:
 * - Horizontal and radial variants
 * - Multiple color variants including gradient
 * - Optional glow effect on both bars and radial rings (disabled by default)
 * - Animated transitions
 * - Label formatting with percentage, ratio, or custom text
 * - Label inside the bar with proper positioning
 * - Theme-aware colors
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      variant = "horizontal",
      size = "md",
      color = "primary",
      showLabel = false,
      labelFormat,
      label,
      labelPosition = "inside",
      animated = true,
      thickness = 8,
      radialSize = 80,
      displayType = "percentage",
      glow = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    // Clamp value between 0 and max
    const clampedValue = Math.max(0, Math.min(value, max));
    const percentage = (clampedValue / max) * 100;

    // Size mapping for horizontal
    const horizontalSizes = {
      sm: "h-1.5",
      md: "h-2.5",
      lg: "h-4",
    };

    // Size mapping for radial
    const radialSizes = {
      sm: 64,
      md: 80,
      lg: 100,
    };

    // Color mapping for horizontal
    const colorMap = {
      primary: "bg-[var(--color-primary)]",
      secondary: "bg-[var(--color-secondary)]",
      accent: "bg-[var(--color-accent)]",
      success: "bg-[var(--color-success)]",
      danger: "bg-[var(--color-danger)]",
      warning: "bg-[var(--color-warning)]",
      gradient:
        "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]",
    };

    // Color mapping for radial
    const radialColorMap = {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      accent: "var(--color-accent)",
      success: "var(--color-success)",
      danger: "var(--color-danger)",
      warning: "var(--color-warning)",
      gradient: "url(#radialGradient)",
    };

    // Glow colors
    const glowColors = {
      primary: "rgba(167, 139, 250, 0.35)",
      secondary: "rgba(0, 217, 255, 0.35)",
      accent: "rgba(255, 77, 157, 0.35)",
      success: "rgba(0, 255, 153, 0.35)",
      danger: "rgba(255, 83, 112, 0.35)",
      warning: "rgba(255, 200, 87, 0.35)",
      gradient: "rgba(167, 139, 250, 0.35)",
    };

    // Generate label text
    const getLabelText = (): string => {
      if (label) return label;
      if (labelFormat) return labelFormat(clampedValue, max);

      switch (displayType) {
        case "ratio":
          return `${Math.round(clampedValue)} / ${max}`;
        case "custom":
          return label || `${Math.round(clampedValue)}`;
        case "percentage":
        default:
          return `${Math.round(percentage)}%`;
      }
    };

    const labelText = getLabelText();

    // ----- Horizontal Variant (unchanged) -----
    if (variant === "horizontal") {
      const barClass = animated
        ? "transition-all duration-[var(--transition-base)] ease-[var(--ease-in-out)]"
        : "";

      const actualThickness = thickness || 8;

      const labelPosClasses = {
        left: "flex-row items-center gap-3",
        right: "flex-row items-center gap-3",
        top: "flex-col items-start gap-1.5",
        bottom: "flex-col items-start gap-1.5",
        inside: "flex-row items-center gap-3",
      };

      const labelOrder = {
        left: "order-first",
        right: "order-last",
        top: "order-first",
        bottom: "order-last",
        inside: "order-last",
      };

      const containerClass =
        labelPosClasses[labelPosition as keyof typeof labelPosClasses] ||
        labelPosClasses.right;
      const labelOrderClass =
        labelOrder[labelPosition as keyof typeof labelOrder] ||
        labelOrder.right;

      const isLabelBefore = labelPosition === "left" || labelPosition === "top";
      const isLabelInside = labelPosition === "inside";

      const sizeClass =
        horizontalSizes[size as keyof typeof horizontalSizes] ||
        horizontalSizes.md;

      const glowColor =
        glowColors[color as keyof typeof glowColors] || glowColors.primary;

      return (
        <div
          className={`w-full ${containerClass} ${className}`}
          style={{ minWidth: "100px" }}
          {...props}
        >
          {showLabel && isLabelBefore && (
            <span
              className={`
                font-mono text-xs font-medium text-[var(--color-text-secondary)]
                flex-shrink-0
                ${labelOrderClass}
              `}
            >
              {labelText}
            </span>
          )}

          <div className="flex-1 w-full relative">
            {glow && percentage > 0 && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none z-0"
                style={{
                  width: `${percentage}%`,
                  height: `${actualThickness}px`,
                  boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
                  opacity: 0.7,
                }}
              />
            )}

            <div
              className={`
                w-full rounded-full
                bg-[var(--color-bg-tertiary)]
                ${sizeClass}
                overflow-hidden
                relative z-10
              `}
              style={{
                height: `${
                  isLabelInside
                    ? Math.max(
                        actualThickness,
                        size === "lg" ? 22 : size === "sm" ? 16 : 18,
                      )
                    : actualThickness
                }px`,
              }}
              role="progressbar"
              aria-label={`${label || "Progress"}: ${Math.round(percentage)}%`}
              aria-valuenow={clampedValue}
              aria-valuemin={0}
              aria-valuemax={max}
            >
              <div
                className={`h-full rounded-full ${colorMap[color]} ${barClass} relative flex items-center justify-end`}
                style={{
                  width: `${percentage}%`,
                  transition: animated ? "width 0.4s ease" : "none",
                }}
              >
                {showLabel && isLabelInside && percentage > 15 && (
                  <span
                    className={`
                      font-mono font-semibold text-[var(--color-text-inverse)]
                      truncate
                      ml-auto
                      px-2.5
                    `}
                    style={{
                      fontSize:
                        size === "lg"
                          ? "0.8rem"
                          : size === "sm"
                            ? "0.65rem"
                            : "0.7rem",
                      lineHeight: 1,
                      textShadow: "0 1px 2px rgba(0,0,0,0.25)",
                      maxWidth: "100%",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {labelText}
                  </span>
                )}
              </div>
            </div>

            {showLabel && isLabelInside && percentage <= 15 && (
              <span
                className={`
                  absolute top-1/2 -translate-y-1/2
                  font-mono font-medium text-[var(--color-text-secondary)]
                  text-[10px] sm:text-xs
                  truncate
                  pointer-events-none
                  z-20
                `}
                style={{
                  left: `${Math.max(percentage, 2)}%`,
                }}
              >
                {labelText}
              </span>
            )}
          </div>

          {showLabel && !isLabelBefore && !isLabelInside && (
            <span
              className={`
                font-mono text-xs font-medium text-[var(--color-text-secondary)]
                flex-shrink-0
                ${labelOrderClass}
              `}
            >
              {labelText}
            </span>
          )}
        </div>
      );
    }

    // --- Radial Variant with full color support ---
    const actualSize =
      radialSize || radialSizes[size as keyof typeof radialSizes] || 80;
    const center = actualSize / 2;
    const radius = (actualSize - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const glowColor =
      glowColors[color as keyof typeof glowColors] || glowColors.primary;
    const displayLabel = showLabel ? labelText : "";

    // Get the stroke color for the radial progress
    const getStrokeColor = () => {
      if (color === "gradient") {
        return "url(#radialGradient)";
      }
      return `var(--color-${color})`;
    };

    // Get the stroke color for the glow ring
    const getGlowStrokeColor = () => {
      if (color === "gradient") {
        return "url(#glowGradient)";
      }
      return `var(--color-${color})`;
    };

    return (
      <div
        ref={ref}
        className={`relative inline-flex flex-col items-center justify-center ${className}`}
        {...props}
      >
        <div
          className="relative"
          style={{ width: actualSize, height: actualSize }}
          role="progressbar"
          aria-label={`${label || "Progress"}: ${Math.round(percentage)}%`}
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <svg
            className="relative w-full h-full"
            viewBox={`0 0 ${actualSize} ${actualSize}`}
            aria-hidden="true"
          >
            <defs>
              {/* Gradient for the main ring */}
              <linearGradient
                id="radialGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-secondary)" />
              </linearGradient>
              {/* Gradient for the glow ring */}
              <linearGradient
                id="glowGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-secondary)" />
              </linearGradient>
            </defs>

            {/* Glow ring (outer glow) */}
            {glow && percentage > 0 && (
              <circle
                cx={center}
                cy={center}
                r={radius + thickness / 2}
                fill="none"
                stroke={getGlowStrokeColor()}
                strokeWidth={thickness + 6}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
                style={{
                  filter: "blur(10px)",
                  opacity: 0.35,
                  transition: animated ? "stroke-dashoffset 0.6s ease" : "none",
                }}
              />
            )}

            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--color-bg-tertiary)"
              strokeWidth={thickness}
            />

            {/* Progress arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={getStrokeColor()}
              strokeWidth={thickness}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
              style={{
                transition: animated ? "stroke-dashoffset 0.6s ease" : "none",
              }}
            />
          </svg>

          {/* Center label */}
          {showLabel && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <span
                className="font-heading font-bold leading-none"
                style={{
                  fontSize:
                    actualSize < 60
                      ? "0.65rem"
                      : actualSize < 80
                        ? "0.75rem"
                        : "0.9rem",
                  color: "var(--color-text-primary)",
                  textShadow:
                    "0 0 30px var(--color-bg-primary), 0 0 60px var(--color-bg-primary)",
                }}
              >
                {displayLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";
export default Progress;
