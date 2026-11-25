import React from "react";
import { backgroundLayerStyle } from "../shared/backgroundLayer";

export interface GlowBackdropProps {
  /**
   * Glow color (any CSS color or a CSS variable)
   * @default "var(--color-primary-solid)"
   */
  color?: string;
  /**
   * Rendering mode. "auto" follows the --backdrop-strength token of the active theme
   * @default "auto"
   */
  mode?: "auto" | "light" | "dark";
  /**
   * Glow strength (0-1)
   * @default 0.3
   */
  intensity?: number;
  /**
   * Opacity of the whole layer (0-1)
   * @default 1
   */
  opacity?: number;
  /**
   * Blur of the whole layer in pixels
   * @default 0
   */
  blur?: number;
  /**
   * Additional className
   */
  className?: string;
}

// ============================================
// HELPERS
// ============================================

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const MODE_STRENGTH = {
  auto: "var(--backdrop-strength, 1)",
  light: "0.55",
  dark: "1",
};

/**
 * Dara UI GlowBackdrop - Soft ambient glow background
 *
 * Features:
 * - Three radial glows painted from a single color
 * - Follows the primary theme color and re-tints on theme change
 * - Softer in light themes and stronger in dark themes
 * - Layer opacity and blur control
 * - Pure CSS, no canvas and no render loop
 * - Sized by its own fixed box, so it can never stretch the page
 */
export const GlowBackdrop: React.FC<GlowBackdropProps> = ({
  color = "var(--color-primary-solid)",
  mode = "auto",
  intensity = 0.3,
  opacity = 1,
  blur = 0,
  className = "",
}) => {
  const level = clamp(intensity, 0, 1);

  const tint = (factor: number) =>
    `color-mix(in srgb, ${color} calc(${level * factor} * var(--glow-strength) * 100%), transparent)`;

  const background = [
    `radial-gradient(ellipse at 20% 50%, ${tint(1)} 0%, transparent 60%)`,
    `radial-gradient(ellipse at 80% 20%, ${tint(0.85)} 0%, transparent 50%)`,
    `radial-gradient(ellipse at 50% 100%, ${tint(0.6)} 0%, transparent 55%)`,
  ].join(", ");

  return (
    <div
      aria-hidden="true"
      className={className}
      style={
        {
          ...backgroundLayerStyle,
          zIndex: 0,
          "--glow-strength": MODE_STRENGTH[mode],
          background,
          opacity: clamp(opacity, 0, 1),
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
        } as React.CSSProperties
      }
    />
  );
};

GlowBackdrop.displayName = "GlowBackdrop";
export default GlowBackdrop;
