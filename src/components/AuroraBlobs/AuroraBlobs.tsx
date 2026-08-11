import React from "react";

export interface AuroraBlobsProps {
  /**
   * Colors for the three blobs
   * @default ["rgba(124,92,255,0.25)", "rgba(0,217,255,0.2)", "rgba(255,77,157,0.18)"]
   */
  colors?: [string, string, string];
  /**
   * Sizes for the three blobs in pixels
   * @default [500, 400, 350]
   */
  sizes?: [number, number, number];
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI AuroraBlobs - Animated gradient blob background
 *
 * Features:
 * - Three animated gradient blobs
 * - Smooth drifting animation
 * - Theme-aware colors
 * - Used as a subtle atmospheric background effect
 */
export const AuroraBlobs: React.FC<AuroraBlobsProps> = ({
  colors = [
    "rgba(124,92,255,0.25)",
    "rgba(0,217,255,0.2)",
    "rgba(255,77,157,0.18)",
  ],
  sizes = [500, 400, 350],
  className = "",
}) => {
  const blobPositions = [
    { top: "-150px", left: "-100px", animDuration: "20s" },
    {
      top: "50%",
      right: "-120px",
      animDuration: "25s",
      animDirection: "reverse",
    },
    { bottom: "-100px", left: "30%", animDuration: "22s" },
  ];

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${className}`}
    >
      {blobPositions.map((pos, index) => (
        <div
          key={index}
          className="aurora-blob absolute rounded-full blur-[120px] opacity-35"
          style={{
            width: sizes[index],
            height: sizes[index],
            background: colors[index],
            top: pos.top,
            left: pos.left,
            right: pos.right as string | undefined,
            bottom: pos.bottom as string | undefined,
            animationDuration: pos.animDuration,
            animationDirection: pos.animDirection as "reverse" | undefined,
            animationName: "drift",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        />
      ))}
    </div>
  );
};

AuroraBlobs.displayName = "AuroraBlobs";
export default AuroraBlobs;
