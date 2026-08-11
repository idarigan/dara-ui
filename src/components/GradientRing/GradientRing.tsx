import React from "react";

export interface GradientRingProps {
  /**
   * Size of the ring in pixels
   * @default 280
   */
  size?: number;
  /**
   * Colors for the conic gradient
   * @default ["#7c5cff", "#00d9ff", "#ff4d9d", "#7c5cff"]
   */
  colors?: string[];
  /**
   * Blur amount in pixels
   * @default 60
   */
  blur?: number;
  /**
   * Opacity of the ring
   * @default 0.5
   */
  opacity?: number;
  /**
   * Animation duration in seconds
   * @default 15
   */
  duration?: number;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI GradientRing - Spinning conic gradient ring
 *
 * Features:
 * - Customizable size, colors, and blur
 * - Smooth spinning animation
 * - Used as a decorative element behind hero sections
 */
export const GradientRing: React.FC<GradientRingProps> = ({
  size = 280,
  colors = ["#7c5cff", "#00d9ff", "#ff4d9d", "#7c5cff"],
  blur = 60,
  opacity = 0.5,
  duration = 15,
  className = "",
}) => {
  const gradient = `conic-gradient(from 0deg, ${colors.join(", ")})`;

  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: gradient,
        filter: `blur(${blur}px)`,
        opacity,
        animation: `spin ${duration}s linear infinite`,
        zIndex: -1,
      }}
    />
  );
};

GradientRing.displayName = "GradientRing";
export default GradientRing;
