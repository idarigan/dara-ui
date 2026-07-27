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
   */
  labelFormat?: (value: number, max: number) => string;
  /**
   * Label position (horizontal only)
   * @default "right"
   */
  labelPosition?: "left" | "right" | "top" | "bottom";
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
 * - Animated transitions
 * - Label formatting
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
      labelPosition = "right",
      animated = true,
      thickness = 8,
      radialSize = 80,
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

    // Color mapping
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

    // Color mapping for radial (stroke color)
    const radialColorMap = {
      primary: "stroke-[var(--color-primary)]",
      secondary: "stroke-[var(--color-secondary)]",
      accent: "stroke-[var(--color-accent)]",
      success: "stroke-[var(--color-success)]",
      danger: "stroke-[var(--color-danger)]",
      warning: "stroke-[var(--color-warning)]",
      gradient: "stroke-[var(--color-primary)]", // gradient doesn't work well on stroke, use primary
    };

    // Color mapping for radial glow
    const radialGlowColor = {
      primary: "rgba(124,92,255,0.3)",
      secondary: "rgba(0,217,255,0.3)",
      accent: "rgba(255,77,157,0.3)",
      success: "rgba(0,255,153,0.3)",
      danger: "rgba(255,83,112,0.3)",
      warning: "rgba(255,200,87,0.3)",
      gradient: "rgba(124,92,255,0.3)",
    };

    // Default label format
    const defaultLabelFormat = (val: number, maxVal: number) => {
      return `${Math.round((val / maxVal) * 100)}%`;
    };

    const formatLabel = labelFormat || defaultLabelFormat;
    const labelText = formatLabel(clampedValue, max);

    // Horizontal variant
    if (variant === "horizontal") {
      const barClass = animated
        ? "transition-all duration-[var(--transition-base)] ease-[var(--ease-in-out)]"
        : "";

      // Get label position classes
      const labelPosClasses = {
        left: "flex-row items-center gap-3",
        right: "flex-row items-center gap-3",
        top: "flex-col items-start gap-1.5",
        bottom: "flex-col items-start gap-1.5",
      };

      const labelOrder = {
        left: "order-first",
        right: "order-last",
        top: "order-first",
        bottom: "order-last",
      };

      const containerClass = labelPosClasses[labelPosition];
      const labelOrderClass = labelOrder[labelPosition];

      // Determine if label should be before or after bar
      const isLabelBefore = labelPosition === "left" || labelPosition === "top";

      return (
        <div
          ref={ref}
          className={`w-full ${containerClass} ${className}`}
          {...props}
        >
          {showLabel && isLabelBefore && (
            <span
              className={`font-mono text-xs font-medium text-[var(--color-text-secondary)] ${labelOrderClass}`}
            >
              {labelText}
            </span>
          )}

          <div className="flex-1 w-full">
            {/* Track */}
            <div
              className={`
                w-full rounded-full
                bg-[var(--color-bg-tertiary)]
                ${horizontalSizes[size]}
                overflow-hidden
              `}
            >
              {/* Fill */}
              <div
                className={`
                  h-full rounded-full
                  ${colorMap[color]}
                  ${barClass}
                `}
                style={{
                  width: `${percentage}%`,
                  transition: animated ? "width 0.4s ease" : "none",
                }}
                role="progressbar"
                aria-valuenow={clampedValue}
                aria-valuemin={0}
                aria-valuemax={max}
              >
                {/* Optional: show label inside bar for small values */}
                {showLabel && percentage > 15 && labelPosition === "right" && (
                  <span className="px-2 text-xs font-medium text-[var(--color-text-inverse)]">
                    {labelText}
                  </span>
                )}
              </div>
            </div>
          </div>

          {showLabel && !isLabelBefore && (
            <span
              className={`font-mono text-xs font-medium text-[var(--color-text-secondary)] ${labelOrderClass}`}
            >
              {labelText}
            </span>
          )}
        </div>
      );
    }

    // Radial variant
    const actualSize = radialSize || radialSizes[size];
    const center = actualSize / 2;
    const radius = (actualSize - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // Glow effect for radial
    const glowColor = radialGlowColor[color];

    return (
      <div
        ref={ref}
        className={`relative inline-flex flex-col items-center justify-center ${className}`}
        {...props}
      >
        {/* SVG Container */}
        <div
          className="relative"
          style={{ width: actualSize, height: actualSize }}
        >
          {/* Glow ring */}
          {percentage > 0 && (
            <svg
              className="absolute inset-0"
              width={actualSize}
              height={actualSize}
              style={{
                filter: `blur(8px)`,
                opacity: 0.4,
              }}
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={glowColor}
                strokeWidth={thickness}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
              />
            </svg>
          )}

          {/* Main ring */}
          <svg
            className="relative"
            width={actualSize}
            height={actualSize}
            viewBox={`0 0 ${actualSize} ${actualSize}`}
          >
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
              className={`
                ${radialColorMap[color]}
                transition-all duration-[var(--transition-base)] ease-[var(--ease-in-out)]
              `}
              strokeWidth={thickness}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
              role="progressbar"
              aria-valuenow={clampedValue}
              aria-valuemin={0}
              aria-valuemax={max}
              style={{
                transition: animated ? "stroke-dashoffset 0.6s ease" : "none",
              }}
            />
          </svg>

          {/* Center content - label */}
          {showLabel && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-heading font-bold text-base text-[var(--color-text-primary)]">
                {labelText}
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
