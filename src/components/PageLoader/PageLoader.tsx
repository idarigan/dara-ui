import React, { useEffect, useState } from "react";

export type LoaderShape = "spinner" | "ring" | "dots" | "pulse" | "bars";

export type LoaderColor =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "danger"
  | "warning";

export interface PageLoaderProps {
  /**
   * Whether the loader is visible
   * @default true
   */
  isLoading?: boolean;
  /**
   * Loader shape/variant
   * @default "spinner"
   */
  shape?: LoaderShape;
  /**
   * Semantic color variant
   * @default "primary"
   */
  color?: LoaderColor;
  /**
   * Arbitrary CSS color (overrides `color` when provided)
   * @example "var(--color-primary)" or "#7c5cff"
   */
  customColor?: string;
  /**
   * Loading label text
   */
  label?: string;
  /**
   * Progress value (0-100). Omit for indeterminate.
   */
  progress?: number;
  /**
   * Show progress percentage
   * @default false
   */
  showProgress?: boolean;
  /**
   * Size of the loader
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Blur the backdrop
   * @default true
   */
  blur?: boolean;
  /**
   * Show the Dara UI brand mark
   * @default false
   */
  showBrand?: boolean;
  /**
   * Minimum display time in ms (prevents flash)
   * @default 0
   */
  minDuration?: number;
  /**
   * Render inline (no fixed positioning, no backdrop)
   * Used for inline previews inside cards
   * @default false
   */
  inline?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI PageLoader - Full-screen loading overlay
 *
 * Features:
 * - Multiple loader shapes (spinner, ring, dots, pulse, bars)
 * - Optional progress bar with percentage
 * - Glass backdrop with blur
 * - Theme-aware colors + custom color support
 * - Minimum display time to prevent flash
 * - Smooth fade in/out
 * - `inline` mode for embedding inside cards / previews
 * - Glows follow the painted shape via drop-shadow (not bounding box)
 */
export const PageLoader: React.FC<PageLoaderProps> = ({
  isLoading = true,
  shape = "spinner",
  color = "primary",
  customColor,
  label,
  progress,
  showProgress = false,
  size = "md",
  blur = true,
  showBrand = false,
  minDuration = 0,
  inline = false,
  className = "",
}) => {
  const [mounted, setMounted] = useState(isLoading);
  const [visible, setVisible] = useState(false);
  const [startTime] = useState(Date.now());

  // Resolve the actual color: customColor wins, otherwise map to token
  const resolvedColor = customColor || `var(--color-${color})`;

  // Handle mount/unmount with min duration + fade (skip in inline mode)
  useEffect(() => {
    if (inline) {
      setMounted(isLoading);
      setVisible(isLoading);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    if (isLoading) {
      setMounted(true);
      timer = setTimeout(() => setVisible(true), 20);
    } else {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setMounted(false), 300);
      }, remaining);
    }

    return () => clearTimeout(timer);
  }, [isLoading, minDuration, startTime, inline]);

  // Lock body scroll while visible (skip in inline mode)
  useEffect(() => {
    if (inline) return;
    if (mounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted, inline]);

  if (!mounted) return null;

  const sizeMap = {
    sm: { box: 32, stroke: 3, dots: 6, bars: 20 },
    md: { box: 48, stroke: 4, dots: 8, bars: 28 },
    lg: { box: 64, stroke: 5, dots: 10, bars: 36 },
  };

  const s = sizeMap[size];

  // Glow filters follow the painted shape, not the SVG bounding box
  const circleGlow = `drop-shadow(0 0 6px ${resolvedColor}) drop-shadow(0 0 12px color-mix(in srgb, ${resolvedColor} 45%, transparent))`;
  const softGlow = `drop-shadow(0 0 5px ${resolvedColor}) drop-shadow(0 0 10px color-mix(in srgb, ${resolvedColor} 40%, transparent))`;

  // ----- Spinner -----
  const Spinner = () => (
    <svg
      className="animate-spin"
      width={s.box}
      height={s.box}
      viewBox="0 0 50 50"
      aria-hidden="true"
      style={{ filter: circleGlow, overflow: "visible" }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="var(--color-border-primary)"
        strokeWidth={s.stroke}
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={resolvedColor}
        strokeWidth={s.stroke}
        strokeLinecap="round"
        strokeDasharray="90 150"
      />
    </svg>
  );

  // ----- Ring (segmented) -----
  const Ring = () => (
    <svg
      className="animate-spin"
      width={s.box}
      height={s.box}
      viewBox="0 0 50 50"
      aria-hidden="true"
      style={{
        animationDuration: "1.2s",
        filter: softGlow,
        overflow: "visible",
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        return (
          <rect
            key={i}
            x="24"
            y="4"
            width="2"
            height="8"
            rx="1"
            fill={resolvedColor}
            opacity={0.15 + (i / 12) * 0.85}
            transform={`rotate(${angle} 25 25)`}
          />
        );
      })}
    </svg>
  );

  // ----- Dots -----
  const Dots = () => (
    <div className="flex items-center gap-2" style={{ filter: softGlow }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: s.dots,
            height: s.dots,
            backgroundColor: resolvedColor,
            animation: `pageLoaderDot 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );

  // ----- Pulse -----
  const Pulse = () => (
    <div
      className="relative"
      style={{ width: s.box, height: s.box, filter: softGlow }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: resolvedColor,
          animation: "pageLoaderPulse 1.5s ease-out infinite",
        }}
      />
      <span
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: resolvedColor,
          animation: "pageLoaderPulse 1.5s ease-out 0.5s infinite",
        }}
      />
      <span
        className="absolute rounded-full"
        style={{
          top: "50%",
          left: "50%",
          width: s.dots * 1.5,
          height: s.dots * 1.5,
          backgroundColor: resolvedColor,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );

  // ----- Bars -----
  const Bars = () => (
    <div
      className="flex items-end gap-1.5"
      style={{ height: s.bars, filter: softGlow }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: 3,
            height: "100%",
            backgroundColor: resolvedColor,
            animation: `pageLoaderBar 1s ease-in-out ${i * 0.1}s infinite`,
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );

  const shapeMap = {
    spinner: <Spinner />,
    ring: <Ring />,
    dots: <Dots />,
    pulse: <Pulse />,
    bars: <Bars />,
  };

  // Inline mode: fixed-size box so the layout never shifts when the loader
  // toggles. Everything is centered inside an invisible shell that matches
  // the largest shape's footprint.
  if (inline) {
    const inlineBox = s.box + 24;

    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 ${className}`}
        role="status"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {showBrand && (
          <span
            className="font-heading font-bold text-xl tracking-tight"
            style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            DARA UI
          </span>
        )}

        {/* Fixed-size box keeps the card from resizing */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: inlineBox, height: inlineBox }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              opacity: isLoading ? 1 : 0,
              transition: "opacity 220ms cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: isLoading ? "auto" : "none",
            }}
          >
            {shapeMap[shape]}
          </div>
        </div>

        {label && (
          <p className="text-xs text-[var(--color-text-secondary)] font-mono tracking-wide">
            {label}
          </p>
        )}
      </div>
    );
  }

  // Full-screen overlay mode
  return (
    <div
      className={`
        fixed inset-0 z-[10000]
        flex items-center justify-center
        transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0"}
        ${blur ? "backdrop-blur-[12px]" : ""}
        ${className}
      `}
      style={{
        background: blur
          ? "color-mix(in srgb, var(--color-bg-primary) 75%, transparent)"
          : "var(--color-bg-primary)",
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Brand mark */}
        {showBrand && (
          <span
            className="font-heading font-bold text-2xl tracking-tight mb-2"
            style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            DARA UI
          </span>
        )}

        {/* Loader shape */}
        {shapeMap[shape]}

        {/* Label */}
        {label && (
          <p className="text-sm text-[var(--color-text-secondary)] font-mono tracking-wide">
            {label}
          </p>
        )}

        {/* Progress bar */}
        {showProgress && progress !== undefined && (
          <div className="w-56 flex flex-col items-center gap-2">
            <div className="w-full h-1.5 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(0, Math.min(100, progress))}%`,
                  backgroundColor: resolvedColor,
                  filter: softGlow,
                }}
              />
            </div>
            <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pageLoaderDot {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes pageLoaderPulse {
          0% { transform: scale(0.4); opacity: 0.7; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes pageLoaderBar {
          0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

PageLoader.displayName = "PageLoader";
export default PageLoader;
