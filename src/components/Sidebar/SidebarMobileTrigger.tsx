import React, { useState } from "react";

export interface SidebarMobileTriggerProps {
  /**
   * Sidebar content (rendered inside the drawer when open)
   */
  children: React.ReactNode;
  /**
   * Drawer width on mobile
   * @default "85vw"
   */
  width?: string;
  /**
   * Show a floating action button
   * @default true
   */
  showFab?: boolean;
  /**
   * Additional className for the container
   */
  className?: string;
}

/**
 * Dara UI SidebarMobileTrigger - Wraps a Sidebar for mobile usage
 *
 * Features:
 * - Floating glass FAB button visible only on mobile
 * - Slide-in drawer from the correct edge (RTL aware)
 * - Backdrop with blur
 * - Swipe-to-close from the drawer's edge
 * - Body scroll lock while open
 */
export const SidebarMobileTrigger: React.FC<SidebarMobileTriggerProps> = ({
  children,
  width = "85vw",
  showFab = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Live RTL detection
  const [isRTL, setIsRTL] = React.useState(false);
  React.useEffect(() => {
    const updateDir = () => setIsRTL(document.documentElement.dir === "rtl");
    updateDir();
    const observer = new MutationObserver(updateDir);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
    return () => observer.disconnect();
  }, []);

  // Body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStart;
    const threshold = 60;

    // In LTR, swipe left closes (drawer on left) or swipe right closes (drawer on right)
    // Since mobile drawer here is on the LEFT in LTR, a leftward swipe should close
    if (!isRTL && deltaX < -threshold) setIsOpen(false);
    if (isRTL && deltaX > threshold) setIsOpen(false);
    setTouchStart(null);
  };

  return (
    <div className={className}>
      {/* The sidebar is hidden on mobile when wrapped */}
      <div className="hidden md:block h-full">{children}</div>

      {/* Floating trigger for mobile */}
      {showFab && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            md:hidden fixed bottom-6 z-[70]
            w-14 h-14 rounded-full
            glass-heavy flex items-center justify-center
            shadow-[var(--shadow-float)]
            text-[var(--color-text-primary)]
            transition-all duration-180
            hover:scale-105
            active:scale-95
          "
          style={{
            right: isRTL ? "auto" : "1.5rem",
            left: isRTL ? "1.5rem" : "auto",
          }}
          aria-label="Open menu"
          aria-expanded={isOpen}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Mobile drawer */}
      <div
        className={`
          md:hidden fixed inset-0 z-[80]
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden={!isOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`
            absolute top-0 h-full
            bg-[var(--color-bg-secondary)]/98 backdrop-blur-[24px]
            border-[var(--color-border-primary)]
            shadow-[var(--shadow-float)]
            transition-transform duration-400 ease-[var(--ease-in-out)]
            flex flex-col
            ${isRTL ? "right-0 border-l" : "left-0 border-r"}
          `}
          style={{
            width,
            transform: isOpen
              ? "translateX(0)"
              : isRTL
                ? "translateX(100%)"
                : "translateX(-100%)",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 z-10 w-9 h-9 rounded-full glass flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-180"
            style={{
              right: isRTL ? "auto" : "0.75rem",
              left: isRTL ? "0.75rem" : "auto",
            }}
            aria-label="Close menu"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Sidebar content */}
          <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
};

SidebarMobileTrigger.displayName = "SidebarMobileTrigger";
export default SidebarMobileTrigger;
