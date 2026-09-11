import React, { useState, useRef, useEffect } from "react";
import {
  GithubIcon,
  XTwitterIcon,
  DiscordIcon,
  YoutubeIcon,
  InstagramIcon,
  LinkedinIcon,
  BlueskyIcon,
} from "../Icons";

export interface SocialLink {
  platform: string;
  url: string;
  label?: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface SocialMediaProps {
  links: SocialLink[];
  position?: "left" | "right";
  offset?: number;
  verticalOffset?: string | number;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
}

// Platform data - maps platform names to icons and colors
const PLATFORM_DATA: Record<string, { icon: React.ReactNode; color: string }> =
  {
    github: {
      icon: <GithubIcon className="h-4 w-4" />,
      color: "#f0f6fc",
    },
    twitter: {
      icon: <XTwitterIcon className="h-4 w-4" />,
      color: "#000",
    },
    discord: {
      icon: <DiscordIcon className="h-4 w-4" />,
      color: "#5865F2",
    },
    youtube: {
      icon: <YoutubeIcon className="h-4 w-4" />,
      color: "#FF0000",
    },
    instagram: {
      icon: <InstagramIcon className="h-4 w-4" />,
      color: "#E4405F",
    },
    linkedin: {
      icon: <LinkedinIcon className="h-4 w-4" />,
      color: "#0A66C2",
    },
    bluesky: {
      icon: <BlueskyIcon className="h-4 w-4" />,
      color: "#1185FE",
    },
  };

/**
 * Dara UI SocialMedia - Floating social media links with expand/collapse
 *
 * Features:
 * - Expandable side panel with social icons
 * - Self-contained SVG icons (no external dependencies)
 * - Light/dark mode adaptive colors
 * - Click outside to close
 * - Smooth expand/collapse animation
 * - Left or right positioning
 * - RTL aware
 */
export const SocialMedia: React.FC<SocialMediaProps> = ({
  links,
  position = "right",
  offset = 5,
  verticalOffset = "50%",
  size = "md",
  showLabels = false,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect if we're in dark mode by checking the theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDarkMode(theme === "nightfall" || theme === "dracula" || !theme);
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const detectPlatform = (url: string): string => {
    const urlLower = url.toLowerCase();
    if (urlLower.includes("github.com")) return "github";
    if (urlLower.includes("twitter.com") || urlLower.includes("x.com"))
      return "twitter";
    if (urlLower.includes("discord.com") || urlLower.includes("discord.gg"))
      return "discord";
    if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be"))
      return "youtube";
    if (urlLower.includes("instagram.com")) return "instagram";
    if (urlLower.includes("linkedin.com")) return "linkedin";
    if (urlLower.includes("bsky.app") || urlLower.includes("bluesky"))
      return "bluesky";
    return "github";
  };

  const getPlatformData = (platform: string) => {
    const key = platform.toLowerCase();
    return PLATFORM_DATA[key] || PLATFORM_DATA.github;
  };

  const sizeMap = {
    sm: {
      button: "w-9 h-9 text-sm",
      icon: "h-3.5 w-3.5",
      chevron: "w-8 h-8",
      gap: "gap-2",
      buttonPx: 36,
      chevronPx: 32,
    },
    md: {
      button: "w-11 h-11 text-base",
      icon: "h-4.5 w-4.5",
      chevron: "w-10 h-10",
      gap: "gap-2.5",
      buttonPx: 44,
      chevronPx: 40,
    },
    lg: {
      button: "w-13 h-13 text-lg",
      icon: "h-5.5 w-5.5",
      chevron: "w-12 h-12",
      gap: "gap-3",
      buttonPx: 52,
      chevronPx: 48,
    },
  };

  const toggleExpanded = () => {
    if (isExpanded) {
      setIsClosing(true);
      setTimeout(() => {
        setIsExpanded(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsExpanded(true);
      setIsClosing(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isExpanded &&
        !isClosing
      ) {
        toggleExpanded();
      }
    };
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, isClosing]);

  const getVerticalOffset = () => {
    if (typeof verticalOffset === "number") {
      return `${verticalOffset}px`;
    }
    return verticalOffset;
  };

  const isLeft = position === "left";
  const sizeStyles = sizeMap[size] || sizeMap.md;

  const positionStyles = {
    left: {
      container: `left-0`,
      chevron: `left-[${offset}px]`,
      menu: `left-[${offset}px]`,
      transform: "translateX(0)",
    },
    right: {
      container: `right-0`,
      chevron: `right-[${offset}px]`,
      menu: `right-[${offset}px]`,
      transform: "translateX(0)",
    },
  };

  const pos = positionStyles[position];
  const buttonPx = sizeStyles.buttonPx;
  const gapPx = 8;

  // Helper to determine if a color is dark
  const isDarkColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  // Get adaptive icon color
  const getAdaptiveColor = (link: SocialLink) => {
    const color = link.color || getPlatformData(detectPlatform(link.url)).color;

    // If user provided a color, use it
    if (link.color) return color;

    // In dark mode: keep the color as-is
    if (isDarkMode) return color;

    // In light mode
    if (isDarkColor(color)) {
      // Lighten dark colors for light mode
      return color === "#24292e" ? "#57606a" : color;
    }

    return color;
  };

  // Render icon helper - clones the icon with proper sizing
  const renderIcon = (link: SocialLink, iconSizeClass: string) => {
    const platform = detectPlatform(link.url);
    const platformData = getPlatformData(platform);

    // If custom icon is provided as React node
    if (link.icon && React.isValidElement(link.icon)) {
      return React.cloneElement(link.icon as React.ReactElement, {
        className: `${iconSizeClass} flex-shrink-0`,
      });
    }

    // Use platform default icon with proper sizing
    const defaultIcon = platformData.icon;
    if (React.isValidElement(defaultIcon)) {
      return React.cloneElement(defaultIcon as React.ReactElement, {
        className: `${iconSizeClass} flex-shrink-0`,
      });
    }

    return defaultIcon;
  };

  // Get icon color - user provided or adapted
  const getIconColor = (link: SocialLink) => {
    if (link.color) return link.color;
    const platform = detectPlatform(link.url);
    return getAdaptiveColor(link);
  };

  return (
    <div
      ref={containerRef}
      className={`fixed z-40 ${pos.container} ${className}`}
      style={{
        top: getVerticalOffset(),
        transform: "translateY(-50%)",
        ...(isLeft ? { left: `${offset + 5}px` } : { right: `${offset}px` }),
      }}
    >
      <div className="relative flex items-center">
        {/* Social buttons - expand outward from chevron */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2
            flex items-center
            ${sizeStyles.gap}
            transition-opacity duration-300 ease-[var(--ease-in-out)]
            ${isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            ${isClosing ? "opacity-0" : ""}
            ${isLeft ? "left-0" : "right-0"}
          `}
          style={{
            paddingRight: isLeft ? "0" : `${buttonPx + gapPx}px`,
            paddingLeft: isLeft ? `${buttonPx + gapPx}px` : "0",
          }}
        >
          {links.map((link, index) => {
            const label =
              link.label ||
              detectPlatform(link.url).charAt(0).toUpperCase() +
                detectPlatform(link.url).slice(1);
            const iconColor = getIconColor(link);

            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in new tab)`}
                className={`
                  flex items-center justify-center
                  ${sizeStyles.button}
                  rounded-full
                  flex-shrink-0
                  shadow-lg
                  hover:shadow-xl
                  transition-all duration-200
                  hover:scale-110
                  hover:-translate-y-0.5
                  ${showLabels ? "px-4" : ""}
                  group
                  relative
                `}
                style={{
                  width:
                    size === "sm" ? "36px" : size === "lg" ? "52px" : "44px",
                  height:
                    size === "sm" ? "36px" : size === "lg" ? "52px" : "44px",
                  minWidth:
                    size === "sm" ? "36px" : size === "lg" ? "52px" : "44px",
                  minHeight:
                    size === "sm" ? "36px" : size === "lg" ? "52px" : "44px",
                  background: "var(--glass-bg, rgba(255,255,255,0.05))",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid ${iconColor}44`,
                  borderRadius: "50%",
                  transition:
                    "border-color 0.25s ease, box-shadow 0.25s ease, scale 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = iconColor;
                  e.currentTarget.style.boxShadow = `0 0 24px ${iconColor}44`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${iconColor}44`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span
                  className={`${sizeStyles.icon} flex-shrink-0 flex items-center justify-center`}
                  style={{
                    color: iconColor,
                  }}
                >
                  {renderIcon(link, sizeStyles.icon)}
                </span>
                {showLabels && (
                  <span className="text-xs font-medium truncate max-w-[80px] text-[var(--color-text-primary)]">
                    {label}
                  </span>
                )}
              </a>
            );
          })}
        </div>
        {/* Chevron toggle button - glass morphism */}
        <button
          onClick={toggleExpanded}
          className={`
            ${sizeStyles.chevron}
            rounded-full
            flex items-center justify-center
            transition-all duration-300
            hover:scale-110
            hover:shadow-[var(--shadow-glow-primary)]
            relative
            z-10
            flex-shrink-0
          `}
          style={{
            width: size === "sm" ? "32px" : size === "lg" ? "48px" : "40px",
            height: size === "sm" ? "32px" : size === "lg" ? "48px" : "40px",
            background: "var(--glass-bg, rgba(255,255,255,0.05))",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid var(--color-border-primary)",
            borderRadius: "50%",
          }}
          aria-label={isExpanded ? "Close social menu" : "Open social menu"}
        >
          <svg
            className={`
              w-4 h-4
              text-[var(--color-text-primary)]
              transition-transform duration-300
              ${isExpanded ? "rotate-180" : "rotate-0"}
            `}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isLeft ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

SocialMedia.displayName = "SocialMedia";
export default SocialMedia;
