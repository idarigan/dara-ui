// src/components/SocialMedia/SocialMedia.tsx

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface SocialLink {
  /**
   * Platform name (e.g., "github", "twitter", "discord")
   */
  platform: string;
  /**
   * URL to the social profile
   */
  url: string;
  /**
   * Custom label (overrides platform name)
   */
  label?: string;
  /**
   * Custom icon (overrides default)
   */
  icon?: React.ReactNode;
}

export interface SocialMediaProps {
  /**
   * Array of social links
   */
  links: SocialLink[];
  /**
   * Position of the chevron
   * @default "right"
   */
  position?: "left" | "right";
  /**
   * Offset from the edge (in pixels)
   * @default 20
   */
  offset?: number;
  /**
   * Vertical offset from top (in pixels)
   * @default "50%"
   */
  verticalOffset?: string | number;
  /**
   * Size of the buttons
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to show labels
   * @default false
   */
  showLabels?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Platform color mapping with gradients
 */
const PLATFORM_COLORS: Record<
  string,
  { bg: string; gradient: string; icon: React.ReactNode }
> = {
  github: {
    bg: "bg-[#24292e]",
    gradient: "from-[#24292e] to-[#6e7681]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.399s2.04.132 3 .399c2.292-1.552 3.3-1.23 3.3-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  twitter: {
    bg: "bg-[#1DA1F2]",
    gradient: "from-[#1DA1F2] to-[#0d8bd4]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  discord: {
    bg: "bg-[#5865F2]",
    gradient: "from-[#5865F2] to-[#4752c4]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.222 0c1.406 0 2.54 1.135 2.607 2.535v18.874c0 1.4-1.135 2.535-2.54 2.535H5.897c-1.405 0-2.54-1.135-2.54-2.535V2.535C3.357 1.135 4.492 0 5.897 0h14.325zm-4.688 3.5h-1.35v1.35h1.35V3.5zm-2.707 0H11.48v1.35h1.347V3.5zm-2.707 0H8.79v1.35h1.33V3.5zm7.14 8.535c-.158-2.42-1.193-4.41-2.63-5.843-.275-.29-.582-.498-.927-.65-.34-.15-.762-.225-1.266-.225-.504 0-.926.075-1.267.225-.345.152-.652.36-.927.65-1.437 1.434-2.472 3.423-2.63 5.843-.008.14-.013.29-.013.45 0 1.09.395 2.09 1.185 3.01.76.884 1.773 1.425 3.04 1.623.137.017.272.043.402.078.258.07.504.177.74.322.08.05.165.096.252.14.139.07.285.13.435.18.14.047.28.085.42.114.07.015.14.025.21.035.22.03.446.045.68.045.233 0 .46-.015.68-.045.07-.01.14-.02.21-.035.14-.029.28-.067.42-.114.15-.05.296-.11.435-.18.087-.044.172-.09.252-.14.236-.145.482-.252.74-.322.13-.035.265-.061.402-.078 1.267-.198 2.28-.74 3.04-1.623.79-.92 1.185-1.92 1.185-3.01 0-.16-.005-.31-.013-.45z" />
      </svg>
    ),
  },
  youtube: {
    bg: "bg-[#FF0000]",
    gradient: "from-[#FF0000] to-[#cc0000]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  instagram: {
    bg: "bg-[#E4405F]",
    gradient: "from-[#f09433] via-[#e6683c] to-[#dc2743]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  linkedin: {
    bg: "bg-[#0A66C2]",
    gradient: "from-[#0A66C2] to-[#084a8a]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  bluesky: {
    bg: "bg-[#1185FE]",
    gradient: "from-[#1185FE] to-[#0d6fd4]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.796-7.995C2.648 1.367 1.762 1.654 1.208 1.907.74 2.131.5 2.753.5 3.305c0 .483.378 3.826.625 4.874.814 3.492 3.713 4.595 6.385 4.595-3.912.576-4.902 2.275-2.832 5.348 3.709 3.837 5.323-.453 5.323-4.806 0 4.353 1.614 8.643 5.323 4.806 2.07-3.073 1.08-4.772-2.832-5.348 2.672 0 5.571-1.103 6.385-4.595.247-1.048.625-4.391.625-4.874 0-.552-.24-1.174-.708-1.398-.554-.253-1.44-.54-3.996 1.498-2.75 1.942-5.71 5.881-6.797 7.995z" />
      </svg>
    ),
  },
};

/**
 * Dara UI SocialMedia - Floating social media buttons with chevron
 *
 * Features:
 * - Floating chevron on the edge of the screen
 * - Expands to show social media buttons
 * - Auto-detects platform from URL
 * - Platform-specific colors and gradients
 * - Smooth animations
 * - Glass morphism styling
 */
export const SocialMedia: React.FC<SocialMediaProps> = ({
  links,
  position = "right",
  offset = 20,
  verticalOffset = "50%",
  size = "md",
  showLabels = false,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect platform from URL
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

  // Get platform data
  const getPlatformData = (platform: string) => {
    const key = platform.toLowerCase();
    return PLATFORM_COLORS[key] || PLATFORM_COLORS.github;
  };

  // Size mapping
  const sizeMap = {
    sm: {
      button: "w-10 h-10 text-sm",
      icon: "w-4 h-4",
      chevron: "w-8 h-8",
    },
    md: {
      button: "w-12 h-12 text-base",
      icon: "w-5 h-5",
      chevron: "w-10 h-10",
    },
    lg: {
      button: "w-14 h-14 text-lg",
      icon: "w-6 h-6",
      chevron: "w-12 h-12",
    },
  };

  // Toggle expansion with animation
  const toggleExpanded = () => {
    if (!isExpanded) {
      setMounted(true);
      setIsVisible(false);
      setTimeout(() => {
        setIsVisible(true);
        setIsExpanded(true);
      }, 20);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setIsExpanded(false);
        setMounted(false);
      }, 300);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isExpanded
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
  }, [isExpanded]);

  // Get vertical offset style
  const getVerticalOffset = () => {
    if (typeof verticalOffset === "number") {
      return `${verticalOffset}px`;
    }
    return verticalOffset;
  };

  const isLeft = position === "left";
  const sizeStyles = sizeMap[size] || sizeMap.md;

  // Position styles
  const positionStyles = {
    left: {
      container: `left-0`,
      chevron: `left-[${offset}px]`,
      menu: `left-[${offset + 8}px]`,
    },
    right: {
      container: `right-0`,
      chevron: `right-[${offset}px]`,
      menu: `right-[${offset + 8}px]`,
    },
  };

  const pos = positionStyles[position];

  return (
    <div
      ref={containerRef}
      className={`fixed z-[100] ${pos.container} ${className}`}
      style={{
        top: getVerticalOffset(),
        transform: "translateY(-50%)",
      }}
    >
      {/* Main container */}
      <div className="relative flex items-center">
        {/* Expanded menu */}
        {isExpanded && (
          <div
            className={`
              absolute top-1/2 -translate-y-1/2
              ${isLeft ? "left-0" : "right-0"}
              flex items-center gap-2
              transition-all duration-300 ease-[var(--ease-in-out)]
              ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}
            `}
            style={{
              paddingLeft: isLeft ? sizeStyles.button.split(" ")[0] : "0",
              paddingRight: isLeft ? "0" : sizeStyles.button.split(" ")[0],
            }}
          >
            {links.map((link, index) => {
              const platform = detectPlatform(link.url);
              const platformData = getPlatformData(platform);
              const label =
                link.label ||
                platform.charAt(0).toUpperCase() + platform.slice(1);

              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center gap-2
                    ${sizeStyles.button}
                    rounded-full
                    ${platformData.bg}
                    text-white
                    shadow-lg
                    hover:shadow-xl
                    transition-all duration-200
                    hover:scale-110
                    ${showLabels ? "px-4" : "justify-center"}
                    group
                    relative
                  `}
                  style={{
                    background: `linear-gradient(135deg, var(--color-${platform}-start, #${platformData.bg}), var(--color-${platform}-end, #${platformData.bg}))`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded();
                  }}
                >
                  <span className="flex-shrink-0">
                    {link.icon || platformData.icon}
                  </span>
                  {showLabels && (
                    <span className="text-xs font-medium truncate max-w-[80px]">
                      {label}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        )}

        {/* Chevron toggle button */}
        <button
          onClick={toggleExpanded}
          className={`
            ${sizeStyles.chevron}
            rounded-full
            glass
            flex items-center justify-center
            transition-all duration-300
            hover:scale-110
            hover:shadow-[var(--shadow-glow-primary)]
            relative
            z-10
          `}
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
