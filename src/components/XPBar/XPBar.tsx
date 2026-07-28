import React from "react";

export interface XPBarProps {
  /**
   * Current XP value
   * @default 0
   */
  value?: number;
  /**
   * Maximum XP for current level
   * @default 5000
   */
  max?: number;
  /**
   * Current level number
   * @default 1
   */
  level?: number;
  /**
   * Show label text
   * @default true
   */
  showLabel?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI XPBar - RPG-style experience progress bar
 *
 * Features:
 * - Gradient fill animation (purple to cyan)
 * - Level display
 * - "X XP to next level" helper text
 * - Glow effect on fill
 * - Theme-aware colors
 */
export const XPBar: React.FC<XPBarProps> = ({
  value = 0,
  max = 5000,
  level = 1,
  showLabel = true,
  className = "",
}) => {
  // Clamp value between 0 and max
  const clampedValue = Math.max(0, Math.min(value, max));
  const percentage = (clampedValue / max) * 100;
  const xpToNext = max - clampedValue;

  return (
    <div className={`glass p-6 float-card ${className}`}>
      {/* XP Progress label */}
      <p className="font-mono text-xs text-[var(--color-primary)] uppercase tracking-wider mb-4">
        XP Progress
      </p>

      {/* Level and XP display */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-accent text-sm text-[var(--color-text-primary)]/80">
          Level {level}
        </span>
        <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
          {clampedValue.toLocaleString()} / {max.toLocaleString()} XP
        </span>
      </div>

      {/* Progress bar track */}
      <div className="xp-bar-track">
        <div
          className="xp-bar-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>

      {/* XP to next level */}
      {showLabel && (
        <p className="font-mono text-xs text-[var(--color-text-tertiary)] mt-2">
          {xpToNext.toLocaleString()} XP to next level
        </p>
      )}
    </div>
  );
};

XPBar.displayName = "XPBar";
export default XPBar;
