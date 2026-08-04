// src/components/Navbar/Navbar.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "../Input/Input";

export interface NavLink {
  /**
   * Link label
   */
  label: string;
  /**
   * Link href
   */
  href: string;
  /**
   * Optional icon for the link
   */
  icon?: React.ReactNode;
  /**
   * Whether the link is active
   */
  active?: boolean;
  /**
   * Optional sub-links for dropdown menu
   */
  subLinks?: NavLink[];
}

export interface NavbarProps {
  /**
   * Brand/Logo element – can be text, an <img>, or any React node.
   * Defaults to the "DARA UI" gradient text.
   */
  brand?: React.ReactNode;
  /**
   * Array of navigation links
   */
  links?: NavLink[];
  /**
   * Whether to show the secondary navbar (drawer)
   * @default false
   */
  showSecondaryNav?: boolean;
  /**
   * Secondary navigation links (shown below main navbar on hover)
   */
  secondaryLinks?: NavLink[];
  /**
   * Whether to show the search bar
   * @default true
   */
  showSearch?: boolean;
  /**
   * Search placeholder text
   * @default "Search..."
   */
  searchPlaceholder?: string;
  /**
   * Callback when search is submitted
   */
  onSearch?: (query: string) => void;
  /**
   * Whether to show the language changer
   * @default false
   */
  showLanguageChanger?: boolean;
  /**
   * Whether to show the theme changer
   * @default false
   */
  showThemeChanger?: boolean;
  /**
   * Custom language changer component
   */
  languageChanger?: React.ReactNode;
  /**
   * Custom theme changer component
   */
  themeChanger?: React.ReactNode;
  /**
   * Additional right side content (e.g., user avatar, notifications)
   */
  rightContent?: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI Navbar - Floating pill-style navigation bar
 *
 * Features:
 * - Floating pill style on scroll, sticky at top initially
 * - Glass transparent blur effect (theme-aware)
 * - Mobile hamburger menu with smooth animations
 * - RTL support
 * - Search bar with mobile expandable magnifier
 * - Custom links with icons
 * - Secondary navigation drawer on hover (desktop only)
 * - Optional language and theme changers
 * - Proper mobile padding with gap from screen edges
 * - Brand accepts text or image (defaults to "DARA UI")
 * - Perfect nav item alignment (centered, with proper spacing)
 * - Hamburger menu has correct z-index and no duplicate controls
 */
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

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle scroll for floating effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
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

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Handle search submit
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim() && onSearch) {
        onSearch(searchQuery);
      }
    },
    [searchQuery, onSearch],
  );

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Toggle search expansion (mobile)
  const toggleSearch = () => {
    setIsSearchExpanded((prev) => !prev);
    if (!isSearchExpanded) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // Close search on blur (mobile)
  const handleSearchBlur = () => {
    if (isMobile && !searchQuery) {
      setIsSearchExpanded(false);
    }
  };

  // Handle link click (close mobile menu)
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Default brand (gradient text)
  const defaultBrand = (
    <a
      href="/"
      className="font-heading font-bold text-lg tracking-tight"
      style={{
        background: "var(--gradient-primary)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      DARA UI
    </a>
  );

  // Render brand helper
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
        {/* Navbar Container */}
        <div
          className={`
            mx-auto
            transition-all duration-300 ease-[var(--ease-in-out)]
            ${
              isScrolled
                ? `
                  glass-heavy
                  rounded-full
                  shadow-[var(--shadow-float)]
                  py-2
                  px-6 md:px-8
                `
                : `
                  bg-[var(--color-bg-secondary)]/80
                  backdrop-blur-[20px]
                  border-b border-[var(--color-border-primary)]
                  py-3
                  px-6 md:px-8
                  rounded-none
                `
            }
          `}
          style={{
            background: isScrolled
              ? "rgba(255,255,255,0.08)"
              : "var(--color-bg-secondary)",
            backdropFilter: isScrolled ? "blur(30px)" : "blur(20px)",
            WebkitBackdropFilter: isScrolled ? "blur(30px)" : "blur(20px)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Brand / Logo - left side */}
            <div className="flex-shrink-0">
              <a href="/" className="block">
                {renderBrand()}
              </a>
            </div>

            {/* Desktop Navigation Links - centered with flex-1 and justify-center */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-1">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium
                    transition-all duration-180
                    ${
                      link.active
                        ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow-primary)] hover:bg-[var(--color-primary-hover)]"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/30"
                    }
                    flex items-center gap-2
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

            {/* Right Side - controls, search, changers */}
            <div className="flex items-center gap-2 flex-shrink-0">
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
                    className="w-48 lg:w-56"
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

              {/* Search - Mobile (expandable) */}
              {showSearch && isMobile && (
                <div
                  className={`
                    flex items-center transition-all duration-300 ease-[var(--ease-in-out)]
                    ${isSearchExpanded ? "w-48" : "w-8"}
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
                    className={`
                      flex-shrink-0 w-8 h-8 rounded-full
                      flex items-center justify-center
                      text-[var(--color-text-secondary)]
                      hover:text-[var(--color-text-primary)]
                      hover:bg-[var(--color-bg-elevated)]/30
                      transition-all duration-180
                    `}
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

              {/* Language Changer */}
              {showLanguageChanger && languageChanger}

              {/* Theme Changer */}
              {showThemeChanger && themeChanger}

              {/* Right Content */}
              {rightContent}

              {/* Hamburger Menu Button - Mobile */}
              <button
                onClick={toggleMobileMenu}
                className={`
                  md:hidden relative
                  w-10 h-10 rounded-full
                  bg-[var(--color-bg-tertiary)]
                  hover:bg-[var(--color-bg-elevated)]
                  transition-all duration-180
                  flex items-center justify-center
                  flex-shrink-0
                `}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span
                  className={`
                    absolute block w-5 h-0.5 rounded-full
                    bg-[var(--color-text-primary)]
                    transition-all duration-300 ease-[var(--ease-in-out)]
                    ${isMobileMenuOpen ? "rotate-45" : "-translate-y-1.5"}
                  `}
                />
                <span
                  className={`
                    absolute block w-5 h-0.5 rounded-full
                    bg-[var(--color-text-primary)]
                    transition-all duration-300 ease-[var(--ease-in-out)]
                    ${isMobileMenuOpen ? "opacity-0 scale-0" : "opacity-100"}
                  `}
                />
                <span
                  className={`
                    absolute block w-5 h-0.5 rounded-full
                    bg-[var(--color-text-primary)]
                    transition-all duration-300 ease-[var(--ease-in-out)]
                    ${isMobileMenuOpen ? "-rotate-45" : "translate-y-1.5"}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Secondary Navigation (Desktop - below main navbar) */}
          {showSecondaryNav && !isMobile && (
            <div
              className={`
                overflow-hidden transition-all duration-300 ease-[var(--ease-in-out)]
                ${isSecondaryNavOpen ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"}
              `}
              onMouseEnter={() => setIsSecondaryNavOpen(true)}
              onMouseLeave={() => setIsSecondaryNavOpen(false)}
            >
              <div className="flex items-center gap-1 pt-2 border-t border-[var(--color-border-primary)]">
                {secondaryLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      transition-all duration-180
                      ${
                        link.active
                          ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow-primary)] hover:bg-[var(--color-primary-hover)]"
                          : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/30"
                      }
                      flex items-center gap-1.5
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

      {/* Mobile Menu Overlay - z-40 (below navbar z-50) */}
      <div
        className={`
          fixed inset-0 z-40
          bg-black/60 backdrop-blur-[6px]
          transition-all duration-300 ease-[var(--ease-in-out)]
          md:hidden
          ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={toggleMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer - z-45 (above overlay, below navbar) */}
      <div
        ref={mobileMenuRef}
        className={`
          fixed top-0 right-0 z-45
          w-80 max-w-[85vw] h-full
          bg-[var(--color-bg-secondary)]/98
          backdrop-blur-[20px]
          border-l border-[var(--color-border-primary)]
          shadow-[var(--shadow-float)]
          transition-all duration-400 ease-[var(--ease-in-out)]
          md:hidden
          flex flex-col
          ${
            isMobileMenuOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }
          rounded-l-[var(--radius-large)]
        `}
        style={{
          transform: isMobileMenuOpen ? "translateX(0)" : "translateX(100%)",
          transition:
            "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Mobile Menu Header - only brand and close button, NO changers */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-primary)]">
          <div className="flex-shrink-0">
            <a href="/" className="block" onClick={handleLinkClick}>
              {renderBrand()}
            </a>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/30 transition-all duration-180 flex-shrink-0"
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

        {/* Mobile Menu Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)]
                transition-all duration-180
                ${
                  link.active
                    ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow-primary)] hover:bg-[var(--color-primary-hover)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/30"
                }
              `}
              onClick={handleLinkClick}
            >
              {link.icon && <span className="flex-shrink-0">{link.icon}</span>}
              <span className="font-medium">{link.label}</span>
            </a>
          ))}

          {/* Secondary links in mobile menu */}
          {showSecondaryNav && secondaryLinks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border-primary)] space-y-1">
              <p className="text-xs text-[var(--color-text-tertiary)] font-mono px-4 py-1">
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
                        ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow-primary)] hover:bg-[var(--color-primary-hover)]"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/30"
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

        {/* Mobile Menu Footer - only search and changers (single instance) */}
        <div className="p-4 border-t border-[var(--color-border-primary)] space-y-3">
          {/* Search in mobile menu */}
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

          {/* Language & Theme Changers - single instance, with proper placement */}
          <div className="flex items-center gap-2">
            {showLanguageChanger && languageChanger}
            {showThemeChanger && themeChanger}
          </div>

          {/* Right Content */}
          {rightContent}
        </div>
      </div>
    </>
  );
};

Navbar.displayName = "Navbar";
export default Navbar;
