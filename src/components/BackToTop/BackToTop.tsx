import React, { useState, useEffect, useCallback } from "react";

export interface BackToTopProps {
  /**
   * Scroll distance in pixels before the button appears, 0 keeps it always visible
   * @default 0
   */
  showAfter?: number;
  /**
   * Screen side, "auto" follows the document direction (right in LTR, left in RTL)
   * @default "auto"
   */
  position?: "auto" | "left" | "right";
  /**
   * Distance from the screen edges in pixels
   * @default 24
   */
  offset?: number;
  /**
   * Button size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Accessible label and tooltip text
   * @default "Back to top"
   */
  label?: string;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI BackToTop - Floating button that scrolls the page to the top
 *
 * Features:
 * - Glass circle with glow on hover
 * - Sits on the inline-end side, so it flips with the document direction
 * - Optional scroll threshold before it appears
 * - Smooth scroll that respects prefers-reduced-motion
 * - Safe-area aware on mobile
 */
export const BackToTop: React.FC<BackToTopProps> = ({
  showAfter = 0,
  position = "auto",
  offset = 24,
  size = "md",
  label = "Back to top",
  className = "",
}) => {
  const [visible, setVisible] = useState(showAfter <= 0);
  const [isRTL, setIsRTL] = useState(false);

  // Live RTL detection
  useEffect(() => {
    const updateDir = () => setIsRTL(document.documentElement.dir === "rtl");
    updateDir();
    const observer = new MutationObserver(updateDir);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setVisible(window.scrollY >= showAfter);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [showAfter]);

  const handleClick = useCallback(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, []);

  const sizes = {
    sm: { box: "w-10 h-10", icon: "h-4 w-4" },
    md: { box: "w-12 h-12", icon: "h-5 w-5" },
    lg: { box: "w-14 h-14", icon: "h-6 w-6" },
  };

  const side = position === "auto" ? (isRTL ? "left" : "right") : position;

  return (
    <div
      className={`
        fixed z-[45]
        transition-all duration-300 ease-[var(--ease-in-out)]
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}
        ${className}
      `}
      style={{
        bottom: `max(${offset}px, env(safe-area-inset-bottom))`,
        [side]: offset,
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        title={label}
        tabIndex={visible ? 0 : -1}
        className={`
          glass flex items-center justify-center
          ${sizes[size].box}
          text-[var(--color-text-primary)]
          hover:-translate-y-1
          hover:text-[var(--color-primary)]
          hover:shadow-[var(--shadow-glow-primary)]
          active:scale-95
        `}
      >
        <svg
          className={sizes[size].icon}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
  );
};

BackToTop.displayName = "BackToTop";
export default BackToTop;
