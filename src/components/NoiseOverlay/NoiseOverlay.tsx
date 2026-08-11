import React from "react";

export interface NoiseOverlayProps {
  /**
   * Opacity of the noise
   * @default 0.035
   */
  opacity?: number;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI NoiseOverlay - Subtle noise texture overlay
 *
 * Features:
 * - SVG-based noise texture
 * - Configurable opacity
 * - Fixed position overlay
 * - Used for adding texture to the background
 */
export const NoiseOverlay: React.FC<NoiseOverlayProps> = ({
  opacity = 0.035,
  className = "",
}) => {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9998] ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }}
    />
  );
};

NoiseOverlay.displayName = "NoiseOverlay";
export default NoiseOverlay;
