import React, { useEffect, useState } from "react";

export type LoaderShape = "spinner" | "ring" | "dots" | "pulse" | "bars";

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
 * - Theme-aware colors
 * - Minimum display time to prevent flash
 * - Smooth fade in/out
 */
export const PageLoader: React.FC<PageLoaderProps> = ({
  isLoading = true,
  shape = "spinner",
  label,
  progress,
  showProgress = false,
  size = "md",
  blur = true,
  showBrand = false,
  minDuration = 0,
  className = "",
}) => {
  const [mounted, setMounted] = useState(isLoading);
  const [visible, setVisible] = useState(false);
  const [startTime] = useState(Date.now());

  // Handle mount/unmount with min duration + fade
  useEffect(() => {
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
  }, [isLoading, minDuration, startTime]);

  // Lock body scroll while visible
  useEffect(() => {
    if (mounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  if (!mounted) return null;

  const sizeMap = {
    sm: { box: 32, stroke: 3, dots: 6, bars: 20 },
    md: { box: 48, stroke: 4, dots: 8, bars: 28 },
    lg: { box: 64, stroke: 5, dots: 10, bars: 36 },
  };

  const s = sizeMap[size];

  // ----- Spinner -----
  const Spinner = () => (
    <svg
      className="animate-spin"
      width={s.box}
      height={s.box}
      viewBox="0 0 50 50"
      aria-hidden="true"
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
        stroke="var(--color-primary)"
        strokeWidth={s.stroke}
        strokeLinecap="round"
        strokeDasharray="90 150"
        style={{ filter: "drop-shadow(0 0 6px var(--color-primary))" }}
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
      style={{ animationDuration: "1.2s" }}
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
            fill="var(--color-primary)"
            opacity={0.15 + (i / 12) * 0.85}
            transform={`rotate(${angle} 25 25)`}
          />
        );
      })}
    </svg>
  );

  // ----- Dots -----
  const Dots = () => (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="rounded-full bg-[var(--color-primary)]"
          style={{
            width: s.dots,
            height: s.dots,
            animation: `pageLoaderDot 1.2s ease-in-out ${i * 0.15}s infinite`,
            boxShadow: "0 0 8px var(--color-primary)",
          }}
        />
      ))}
    </div>
  );

  // ----- Pulse -----
  const Pulse = () => (
    <div className="relative" style={{ width: s.box, height: s.box }}>
      <span
        className="absolute inset-0 rounded-full bg-[var(--color-primary)]"
        style={{ animation: "pageLoaderPulse 1.5s ease-out infinite" }}
      />
      <span
        className="absolute inset-0 rounded-full bg-[var(--color-primary)]"
        style={{ animation: "pageLoaderPulse 1.5s ease-out 0.5s infinite" }}
      />
      <span
        className="absolute rounded-full bg-[var(--color-primary)]"
        style={{
          top: "50%",
          left: "50%",
          width: s.dots * 1.5,
          height: s.dots * 1.5,
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 12px var(--color-primary)",
        }}
      />
    </div>
  );

  // ----- Bars -----
  const Bars = () => (
    <div className="flex items-end gap-1.5" style={{ height: s.bars }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="rounded-full bg-[var(--color-primary)]"
          style={{
            width: 3,
            height: "100%",
            animation: `pageLoaderBar 1s ease-in-out ${i * 0.1}s infinite`,
            transformOrigin: "bottom",
            boxShadow: "0 0 6px var(--color-primary)",
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
                className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
                style={{
                  width: `${Math.max(0, Math.min(100, progress))}%`,
                  boxShadow: "0 0 12px var(--color-primary)",
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
