import React from "react";

export interface RankTier {
  /**
   * Display label for the rank (e.g., "Common", "Plat", "Hero")
   */
  label: string;
  /**
   * XP required to achieve this rank
   */
  requiredXP: number;
}

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
   * Custom label for the progress bar header (replaces "XP Progress")
   */
  customLabel?: string;
  /**
   * Custom word for "Level" (e.g., "Rank", "Tier")
   * @default "Level"
   */
  levelLabel?: string;
  /**
   * Custom word for "XP" (e.g., "EXP", "Points", "Score")
   * @default "XP"
   */
  xpLabel?: string;
  /**
   * Rank tiers array - each tier has a label and required XP
   * When provided, displays the current rank badge
   */
  ranks?: RankTier[];
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
 * - Level display with customizable labels
 * - "X XP to next level" helper text
 * - Rank tier system with badge display
 * - Glow effect on fill
 * - Theme-aware colors
 * - RTL support
 */
export const XPBar: React.FC<XPBarProps> = ({
  value = 0,
  max = 5000,
  level = 1,
  showLabel = true,
  customLabel,
  levelLabel = "Level",
  xpLabel = "XP",
  ranks,
  className = "",
}) => {
  // Clamp value between 0 and max
  const clampedValue = Math.max(0, Math.min(value, max));
  const percentage = (clampedValue / max) * 100;
  const xpToNext = max - clampedValue;

  // Determine current rank based on XP value
  const getCurrentRank = (): RankTier | null => {
    if (!ranks || ranks.length === 0) return null;

    let currentRank = ranks[0];
    for (const rank of ranks) {
      if (clampedValue >= rank.requiredXP) {
        currentRank = rank;
      }
    }
    return currentRank;
  };

  const currentRank = getCurrentRank();

  // Get the next rank
  const getNextRank = (): RankTier | null => {
    if (!ranks || ranks.length === 0) return null;

    for (const rank of ranks) {
      if (clampedValue < rank.requiredXP) {
        return rank;
      }
    }
    return null;
  };

  const nextRank = getNextRank();

  // Calculate XP needed for next rank
  const xpToNextRank = nextRank ? nextRank.requiredXP - clampedValue : null;

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Determine bar label text
  const getBarLabel = (): string => {
    if (ranks && nextRank) {
      return `${formatNumber(xpToNextRank || 0)} ${xpLabel} to ${nextRank.label}`;
    }
    return `${formatNumber(xpToNext)} ${xpLabel} to next ${levelLabel}`;
  };

  return (
    <div className={`glass p-6 float-card ${className}`}>
      {/* XP Progress label */}
      <p className="font-mono text-xs text-[var(--color-primary)] uppercase tracking-wider mb-4">
        {customLabel || "XP Progress"}
      </p>

      {/* Level/Rank and XP display */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-accent text-sm text-[var(--color-text-primary)]/80">
            {ranks && currentRank ? (
              <>
                {levelLabel} {level} · {currentRank.label}
              </>
            ) : (
              <>
                {levelLabel} {level}
              </>
            )}
          </span>
        </div>
        <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
          {formatNumber(clampedValue)} /{" "}
          {ranks && nextRank
            ? formatNumber(nextRank.requiredXP)
            : formatNumber(max)}{" "}
          {xpLabel}
        </span>
      </div>

      {/* Progress bar track */}
      <div className="xp-bar-track" dir="ltr">
        <div
          className="xp-bar-fill"
          style={{
            width:
              ranks && nextRank
                ? `${(clampedValue / nextRank.requiredXP) * 100}%`
                : `${percentage}%`,
          }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={ranks && nextRank ? nextRank.requiredXP : max}
        />
      </div>

      {/* XP to next level/rank */}
      {showLabel && (
        <p className="font-mono text-xs text-[var(--color-text-tertiary)] mt-2">
          {getBarLabel()}
        </p>
      )}
    </div>
  );
};

XPBar.displayName = "XPBar";
export default XPBar;
