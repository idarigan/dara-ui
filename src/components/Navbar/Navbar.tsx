// src/components/Navbar/Navbar.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "../Input/Input";

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
  rightContent?: React.ReactNode;
  className?: string;
}

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
  rightContent,
  className = "",
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSecondaryNavOpen, setIsSecondaryNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const toggleSearch = () => {
    setIsSearchExpanded((prev) => !prev);
    if (!isSearchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleSearchBlur = () => {
    if (isMobile && !searchQuery) {
      setIsSearchExpanded(false);
    }
  };

  const handleLinkClick = () => setIsMobileMenuOpen(false);

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

  const renderBrand = () => {
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
  };

  return (
    <>
      {/* MAIN NAVBAR */}
      <nav
        ref={navbarRef}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300 ease-[var(--ease-in-out)]
          ${isScrolled ? "px-3 md:px-4" : ""}
          ${className}
        `}
        style={{
          paddingTop: isScrolled ? "12px" : "0",
          paddingBottom: isScrolled ? "12px" : "0",
        }}
      >
        <div
          className={`
            mx-auto
            transition-all duration-300 ease-[var(--ease-in-out)]
            ${
              isScrolled
                ? "glass-heavy rounded-full shadow-[var(--shadow-float)] py-2 px-5 md:px-8"
                : "bg-[var(--color-bg-secondary)]/80 backdrop-blur-[20px] border-b border-[var(--color-border-primary)] py-3 px-5 md:px-8 rounded-none"
            }
          `}
        >
          {/* 3-COLUMN LAYOUT */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* LEFT - Brand */}
            <div className="flex-shrink-0">
              <a href="/" className="block" onClick={handleLinkClick}>
                {renderBrand()}
              </a>
            </div>

            {/* CENTER - Desktop links */}
            <div className="hidden md:flex items-center justify-center gap-1">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium
                    transition-all duration-180
                    flex items-center gap-2
                    ${
                      link.active
                        ? "bg-[var(--color-primary)] !text-white shadow-[var(--shadow-glow-primary)] hover:bg-[var(--color-primary-hover)]"
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
              ))}
            </div>

            {/* RIGHT - Controls */}
            <div className="flex items-center gap-2 justify-end">
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
                    <form onSubmit={handleSearchSubmit} className="w-full mr-1">
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

          {/* Secondary Navigation (desktop) */}
          {showSecondaryNav && !isMobile && (
            <div
              className={`overflow-hidden transition-all duration-300 ease-[var(--ease-in-out)] ${
                isSecondaryNavOpen
                  ? "max-h-20 opacity-100 mt-2"
                  : "max-h-0 opacity-0"
              }`}
              onMouseEnter={() => setIsSecondaryNavOpen(true)}
              onMouseLeave={() => setIsSecondaryNavOpen(false)}
            >
              <div className="flex items-center justify-center gap-1 pt-2 border-t border-[var(--color-border-primary)]">
                {secondaryLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium transition-all duration-180 flex items-center gap-1.5
                      ${
                        link.active
                          ? "bg-[var(--color-primary)] !text-white shadow-[var(--shadow-glow-primary)]"
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
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-md)]
                transition-all duration-180
                ${
                  link.active
                    ? "bg-[var(--color-primary)] !text-white shadow-[var(--shadow-glow-primary)]"
                    : "!text-[var(--color-text-secondary)] hover:!text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/30"
                }
              `}
              onClick={handleLinkClick}
            >
              {link.icon && <span className="flex-shrink-0">{link.icon}</span>}
              <span className="font-medium">{link.label}</span>
            </a>
          ))}

          {showSecondaryNav && secondaryLinks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[var(--color-border-primary)] space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono px-4 mb-2">
                More
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
                        ? "bg-[var(--color-primary)] !text-white"
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
            {showLanguageChanger && languageChanger}
            {showThemeChanger && themeChanger}
          </div>

          {rightContent && <div className="pt-1">{rightContent}</div>}
        </div>
      </div>
    </>
  );
};

Navbar.displayName = "Navbar";
export default Navbar;
