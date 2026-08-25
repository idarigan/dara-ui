import React, { useState, useRef } from "react";
import { Progress } from "../Progress/Progress";

export interface StatsWidgetData {
  /**
   * Stat label (e.g., "Force Alignment", "Combat")
   */
  label: string;
  /**
   * Current value
   */
  value: number;
  /**
   * Maximum value (for percentage calculation)
   * @default 100
   */
  max?: number;
  /**
   * Unit display (e.g., "%", "XP", "pts")
   * @default "%"
   */
  unit?: string;
  /**
   * Trend change (e.g., +12, -5)
   */
  trend?: number;
  /**
   * Color variant for the progress
   */
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "danger"
    | "warning"
    | "gradient";
}

export interface StatsWidgetProps {
  /**
   * Stats data array
   */
  stats: StatsWidgetData[];
  /**
   * Display variant
   * @default "radial"
   */
  variant?: "radial" | "bar";
  /**
   * Title of the widget
   */
  title?: string;
  /**
   * Glow variant color
   * @default "none"
   */
  glow?: "primary" | "secondary" | "accent" | "none";
  /**
   * Layout mode
   * @default "vertical"
   */
  layout?: "vertical" | "horizontal";
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI StatsWidget - RPG-style stats display
 *
 * Features:
 * - Radial and bar progress variants
 * - Custom labels, units, and colors
 * - Mini trend indicators
 * - 3D tilt effect on hover
 * - Theme-aware colors
 * - Uses Progress component
 */
export const StatsWidget: React.FC<StatsWidgetProps> = ({
  stats,
  variant = "radial",
  title,
  glow = "none",
  layout = "vertical",
  className = "",
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle 3D tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  // Glow styles
  const glowStyles = {
    primary: "glow-primary",
    secondary: "glow-secondary",
    accent: "glow-accent",
    none: "",
  };

  const glowClass = glowStyles[glow] || "";
  const isHorizontal = layout === "horizontal";

  // Render trend indicator
  const renderTrend = (trend?: number) => {
    if (trend === undefined || trend === 0) return null;

    const isPositive = trend > 0;
    const color = isPositive ? "var(--color-success)" : "var(--color-danger)";
    const arrow = isPositive ? "▲" : "▼";

    return (
      <span
        className="text-xs font-mono font-medium flex-shrink-0"
        style={{ color }}
      >
        {arrow} {Math.abs(trend)}%
      </span>
    );
  };

  // Render a single stat
  const renderStat = (stat: StatsWidgetData, index: number) => {
    const percentage = stat.max ? (stat.value / stat.max) * 100 : stat.value;
    const displayValue = stat.max
      ? `${Math.round(stat.value)} / ${stat.max}`
      : `${Math.round(stat.value)}`;
    const unit = stat.unit || "%";

    if (variant === "radial") {
      const size = isHorizontal ? 56 : 64;
      const color = stat.color || "primary";

      return (
        <div
          key={index}
          className="flex flex-col items-center flex-shrink-0"
          style={{
            width: isHorizontal ? 80 : 84,
          }}
        >
          <Progress
            variant="radial"
            value={percentage}
            color={color}
            size={size <= 56 ? "sm" : size <= 64 ? "md" : "lg"}
            radialSize={size}
            showLabel
          />
          <div className="flex items-center gap-1.5 mt-1.5 max-w-full">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono text-center leading-tight truncate min-w-0">
              {stat.label}
            </p>
            {renderTrend(stat.trend)}
          </div>
        </div>
      );
    }

    // Bar variant
    const color = stat.color || "primary";

    return (
      <div
        key={index}
        className="flex flex-col gap-0.5 w-full"
        style={{
          transform: "translateZ(5px)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--color-text-secondary)] truncate">
            {stat.label}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-mono font-medium text-[var(--color-text-primary)]">
              {displayValue}
              <span className="text-[10px] text-[var(--color-text-tertiary)]">
                {unit}
              </span>
            </span>
            {renderTrend(stat.trend)}
          </div>
        </div>
        <Progress
          variant="horizontal"
          value={percentage}
          color={color}
          size="sm"
          showLabel={false}
          animated
        />
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      className={`
        glass p-6 float-card
        relative
        transition-all duration-300
        ${glowClass}
        ${isHorizontal ? "flex flex-col md:flex-row gap-6" : "flex flex-col"}
        ${className}
      `}
      style={{
        transform: isHovering
          ? `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
        transformStyle: "preserve-3d",
        transition: "transform 0.2s ease-out, box-shadow 0.4s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Title */}
      {title && (
        <div
          className={`
            ${isHorizontal ? "flex-shrink-0 md:w-48" : "w-full"}
            flex items-center justify-between
            ${isHorizontal ? "md:flex-col md:items-start md:justify-start" : "mb-4"}
          `}
          style={{
            transform: "translateZ(20px)",
          }}
        >
          <p className="font-mono text-xs text-[var(--color-primary)] uppercase tracking-wider">
            {title}
          </p>
          {isHorizontal && (
            <span className="text-[10px] text-[var(--color-text-tertiary)] font-mono md:mt-1">
              {stats.length} stats
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div
        className={`
          ${isHorizontal ? "flex-1 min-w-0" : "w-full"}
          ${
            variant === "radial"
              ? isHorizontal
                ? "flex flex-wrap gap-4 justify-start"
                : "flex flex-wrap gap-4 justify-center"
              : "flex flex-col gap-4"
          }
        `}
        style={{
          transform: "translateZ(10px)",
        }}
      >
        {stats.map((stat, index) => renderStat(stat, index))}
      </div>
    </div>
  );
};

StatsWidget.displayName = "StatsWidget";
export default StatsWidget;
