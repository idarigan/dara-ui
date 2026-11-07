import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "../Input/Input";
import { useI18n } from "../LanguageChanger/LanguageChanger";

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  subLinks?: NavLink[];
}

export interface NavbarProps {
  brand?: React.ReactNode;
  links?: NavLink[];
  showSecondaryNav?: boolean;
  secondaryLinks?: NavLink[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showLanguageChanger?: boolean;
  showThemeChanger?: boolean;
  languageChanger?: React.ReactNode;
  themeChanger?: React.ReactNode;
  languageChangerMobile?: React.ReactNode;
  themeChangerMobile?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  /**
   * Enable IntersectionObserver-based scroll-spy.
   * Each link's `href` (e.g. "#about") is observed; the section closest to
   * the top of the viewport becomes active.
   * @default false
   */
  scrollSpy?: boolean;
  /**
   * Offset from viewport top (px) where a section is considered "active"
   * @default 140
   */
  scrollSpyOffset?: number;
  /**
   * Called with the currently-active section id whenever it changes
   */
  onActiveChange?: (id: string) => void;
}

// ============================================
// GLASS SURFACES
// ============================================

const glassSurface: React.CSSProperties = {
  background:
    "linear-gradient(145deg, color-mix(in srgb, var(--color-bg-elevated) 82%, transparent), color-mix(in srgb, var(--color-bg-tertiary) 55%, transparent))",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid var(--glass-border-strong)",
  boxShadow:
    "0 8px 26px rgba(0,0,0,0.16), inset 0 1px 0 var(--glass-highlight)",
};

const glassSurfaceMerged: React.CSSProperties = {
  ...glassSurface,
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  boxShadow:
    "0 12px 34px rgba(0,0,0,0.2), inset 0 1px 0 var(--glass-highlight)",
};

const SurfaceLayer: React.FC<{
  visible: boolean;
  style: React.CSSProperties;
}> = ({ visible, style }) => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 ease-[var(--ease-out)]"
    style={{ ...style, opacity: visible ? 1 : 0 }}
  />
);

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  links = [],
  showSecondaryNav = false,
  secondaryLinks = [],
  showSearch = true,
  searchPlaceholder = "Search...",
  onSearch,
  showLanguageChanger = false,
  showThemeChanger = false,
  languageChanger,
  themeChanger,
  languageChangerMobile,
  themeChangerMobile,
  rightContent,
  className = "",
  scrollSpy = false,
  scrollSpyOffset = 140,
  onActiveChange,
}) => {
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSecondaryNavOpen, setIsSecondaryNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const navbarRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // RTL detection
  const isRTL =
    typeof document !== "undefined" && document.documentElement.dir === "rtl";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Merge on the very first scroll event, no debounce
  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // ============================================
  // SCROLL SPY
  // ============================================
  useEffect(() => {
    if (!scrollSpy || typeof window === "undefined") return;

    // Collect all sections referenced by nav links (#id)
    const sectionIds = links
      .map((link) => link.href.replace(/^#/, ""))
      .filter(Boolean);

    if (sectionIds.length === 0) return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Track visibility ratios for all sections; the most-visible section wins
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          ratios.set(id, entry.intersectionRatio);
        });

        // Find the section with the highest intersection ratio that's
        // currently above the scrollSpyOffset line
        let best: { id: string; score: number } | null = null;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const ratio = ratios.get(section.id) ?? 0;

          // Section must be at or below the navbar and visible
          if (rect.bottom < scrollSpyOffset) return;
          if (rect.top > window.innerHeight) return;

          // Score prioritizes sections whose top is closest to the offset line
          const distanceFromOffset = Math.abs(rect.top - scrollSpyOffset);
          const score = ratio * 1000 - distanceFromOffset;

          if (!best || score > best.score) {
            best = { id: section.id, score };
          }
        });

        if (best && (best as { id: string }).id !== activeSection) {
          const nextId = (best as { id: string }).id;
          setActiveSection(nextId);
          onActiveChange?.(nextId);
        }
      },
      {
        rootMargin: `-${scrollSpyOffset}px 0px -50% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [scrollSpy, scrollSpyOffset, links, activeSection, onActiveChange]);

  // Escape closes mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim() && onSearch) {
        onSearch(searchQuery);
      }
    },
    [searchQuery, onSearch],
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchExpanded((prev) => !prev);
    if (!isSearchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchExpanded]);

  const handleSearchBlur = useCallback(() => {
    if (isMobile && !searchQuery) {
      setIsSearchExpanded(false);
    }
  }, [isMobile, searchQuery]);

  const handleLinkClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavEnter = useCallback(() => {
    setIsSecondaryNavOpen(true);
  }, []);

  const handleNavLeave = useCallback(() => {
    setIsSecondaryNavOpen(false);
  }, []);

  // Compute link.active dynamically when scrollSpy is on
  const isLinkActive = useCallback(
    (link: NavLink) => {
      if (!scrollSpy) return !!link.active;
      const id = link.href.replace(/^#/, "");
      return id !== "" && id === activeSection;
    },
    [scrollSpy, activeSection],
  );

  const defaultBrand = (
    <span
      className="font-heading font-bold text-lg tracking-tight"
      style={{
        background: "var(--gradient-primary)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      DARA UI
    </span>
  );

  const renderBrand = useCallback(() => {
    if (brand) {
      if (typeof brand === "string") {
        return (
          <span className="font-heading font-bold text-lg tracking-tight text-[var(--color-text-primary)]">
            {brand}
          </span>
        );
      }
      return brand;
    }
    return defaultBrand;
  }, [brand]);

  return (
    <>
      {/* MAIN NAVBAR */}
      <nav
        ref={navbarRef}
        className={`fixed top-3 left-0 right-0 z-50 px-4 pointer-events-none ${className}`}
      >
        <div
          className="relative mx-auto flex items-center justify-between gap-2.5 p-1.5 rounded-full pointer-events-auto"
          style={{
            maxWidth: "1800px",
            width: isScrolled ? "min(960px, 100%)" : "100%",
            transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          onMouseEnter={handleNavEnter}
          onMouseLeave={handleNavLeave}
        >
          {/* Merged pill surface */}
          <SurfaceLayer visible={isScrolled} style={glassSurfaceMerged} />

          {/* LEFT capsule - brand */}
          <div className="relative flex-shrink-0 flex items-center rounded-full px-5 min-h-12">
            <SurfaceLayer visible={!isScrolled} style={glassSurface} />
            <a
              href="/"
              className="relative z-[1] block"
              onClick={handleLinkClick}
            >
              {renderBrand()}
            </a>
          </div>

          {/* RIGHT capsule - links + controls */}
          <div className="relative flex items-center rounded-full px-2 md:px-3 py-1.5 min-h-12">
            <SurfaceLayer visible={!isScrolled} style={glassSurface} />

            <div className="relative z-[1] flex items-center gap-1">
              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-1">
                {links.map((link, index) => {
                  const active = isLinkActive(link);
                  return (
                    <a
                      key={index}
                      href={link.href}
                      className={`
                        px-4 py-1.5 rounded-full text-sm font-medium
                        transition-all duration-180
                        flex items-center gap-2
                        hover:-translate-y-0.5
                        ${
                          active
                            ? "bg-[var(--color-primary-solid)] !text-white shadow-[var(--shadow-glow-primary)] hover:bg-[var(--color-primary-hover)]"
                            : "!text-[var(--color-text-secondary)] hover:!text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/30"
                        }
                      `}
                      onClick={handleLinkClick}
                    >
                      {link.icon && (
                        <span className="flex-shrink-0">{link.icon}</span>
                      )}
                      {link.label}
                    </a>
                  );
                })}
              </div>

              {/* Right-side controls */}
              <div className="flex items-center gap-2 justify-end md:ms-2">
                {/* Search - Desktop */}
                {showSearch && !isMobile && (
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Input
                      ref={searchInputRef}
                      type="search"
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      size="sm"
                      className="w-44 lg:w-56"
                      leftIcon={
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
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      }
                    />
                  </form>
                )}

                {/* Search - Mobile expandable */}
                {showSearch && isMobile && (
                  <div
                    className={`
                      flex items-center transition-all duration-300 ease-[var(--ease-in-out)]
                      ${isSearchExpanded ? "w-40" : "w-8"}
                    `}
                  >
                    {isSearchExpanded && (
                      <form
                        onSubmit={handleSearchSubmit}
                        className="w-full mr-1"
                      >
                        <Input
                          ref={searchInputRef}
                          type="search"
                          placeholder={searchPlaceholder}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onBlur={handleSearchBlur}
                          size="sm"
                          className="w-full"
                        />
                      </form>
                    )}
                    <button
                      onClick={toggleSearch}
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/30 transition-all duration-180"
                      aria-label={
                        isSearchExpanded ? "Close search" : "Open search"
                      }
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {isSearchExpanded ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                )}

                {/* Language & Theme - ONLY on desktop */}
                {!isMobile && showLanguageChanger && languageChanger}
                {!isMobile && showThemeChanger && themeChanger}

                {/* Right Content */}
                {rightContent}

                {/* Hamburger - Mobile only */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden relative w-10 h-10 rounded-full bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] transition-all duration-180 flex items-center justify-center flex-shrink-0"
                  aria-label="Toggle menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span
                    className={`absolute block w-5 h-0.5 rounded-full bg-[var(--color-text-primary)] transition-all duration-300 ease-[var(--ease-in-out)] ${
                      isMobileMenuOpen ? "rotate-45" : "-translate-y-1.5"
                    }`}
                  />
                  <span
                    className={`absolute block w-5 h-0.5 rounded-full bg-[var(--color-text-primary)] transition-all duration-300 ease-[var(--ease-in-out)] ${
                      isMobileMenuOpen ? "opacity-0 scale-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`absolute block w-5 h-0.5 rounded-full bg-[var(--color-text-primary)] transition-all duration-300 ease-[var(--ease-in-out)] ${
                      isMobileMenuOpen ? "-rotate-45" : "translate-y-1.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Navigation (desktop) - drops below the bar */}
          {showSecondaryNav && !isMobile && secondaryLinks.length > 0 && (
            <div
              className={`
                absolute left-1/2 top-full -translate-x-1/2 pt-2
                transition-all duration-300 ease-[var(--ease-in-out)]
                ${
                  isSecondaryNavOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }
              `}
            >
              <div
                className="flex items-center justify-center gap-1 rounded-full px-2 py-1.5"
                style={glassSurface}
              >
                {secondaryLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium transition-all duration-180 flex items-center gap-1.5
                      hover:-translate-y-0.5
                      ${
                        link.active
                          ? "bg-[var(--color-primary-solid)] !text-white shadow-[var(--shadow-glow-primary)]"
                          : "!text-[var(--color-text-tertiary)] hover:!text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/30"
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    {link.icon && (
                      <span className="flex-shrink-0">{link.icon}</span>
                    )}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`
          fixed inset-0 z-[55]
          bg-black/60 backdrop-blur-[6px]
          transition-all duration-300 ease-[var(--ease-in-out)]
          md:hidden
          ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={toggleMobileMenu}
        aria-hidden="true"
      />

      {/* MOBILE DRAWER - RTL AWARE */}
      <div
        ref={mobileMenuRef}
        className={`
          fixed top-0 z-[60]
          ${isRTL ? "left-0 rounded-r-[var(--radius-large)]" : "right-0 rounded-l-[var(--radius-large)]"}
          w-80 max-w-[85vw] h-full
          bg-[var(--color-bg-secondary)]/98
          backdrop-blur-[24px]
          border-l border-[var(--color-border-primary)]
          shadow-[var(--shadow-float)]
          transition-all duration-400 ease-[var(--ease-in-out)]
          md:hidden
          flex flex-col
          ${
            isMobileMenuOpen
              ? "translate-x-0 opacity-100"
              : isRTL
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"
          }
        `}
        style={{
          transform: isMobileMenuOpen
            ? "translateX(0)"
            : isRTL
              ? "translateX(-100%)"
              : "translateX(100%)",
          transition:
            "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-primary)]">
          <a href="/" className="block" onClick={handleLinkClick}>
            {renderBrand()}
          </a>
          <button
            onClick={toggleMobileMenu}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/40 transition-all duration-180"
            aria-label="Close menu"
          >
            <svg
              className="h-5 w-5"
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
        </div>

        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map((link, index) => {
            const active = isLinkActive(link);
            return (
              <a
                key={index}
                href={link.href}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-md)]
                  transition-all duration-180
                  ${
                    active
                      ? "bg-[var(--color-primary-solid)] !text-white shadow-[var(--shadow-glow-primary)]"
                      : "!text-[var(--color-text-secondary)] hover:!text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/30"
                  }
                `}
                onClick={handleLinkClick}
              >
                {link.icon && (
                  <span className="flex-shrink-0">{link.icon}</span>
                )}
                <span className="font-medium">{link.label}</span>
              </a>
            );
          })}

          {showSecondaryNav && secondaryLinks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[var(--color-border-primary)] space-y-1">
              <p
                className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono px-4 mb-2"
                dir="auto"
              >
                {t("navbar.more")}
              </p>
              {secondaryLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)]
                    transition-all duration-180
                    ${
                      link.active
                        ? "bg-[var(--color-primary-solid)] !text-white"
                        : "!text-[var(--color-text-secondary)] hover:!text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/30"
                    }
                  `}
                  onClick={handleLinkClick}
                >
                  {link.icon && (
                    <span className="flex-shrink-0">{link.icon}</span>
                  )}
                  <span className="font-medium">{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer - Language & Theme */}
        <div className="p-5 border-t border-[var(--color-border-primary)] space-y-4">
          {showSearch && (
            <form onSubmit={handleSearchSubmit}>
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
                className="w-full"
                leftIcon={
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </form>
          )}
          <div className="flex items-center gap-3">
            {showLanguageChanger && (languageChangerMobile || languageChanger)}
            {showThemeChanger && (themeChangerMobile || themeChanger)}
          </div>

          {rightContent && <div className="pt-1">{rightContent}</div>}
        </div>
      </div>
    </>
  );
};

Navbar.displayName = "Navbar";
export default Navbar;
