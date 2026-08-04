// src/components/SocialMedia/SocialMedia.tsx

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faGithub,
  faTwitter,
  faDiscord,
  faYoutube,
  faInstagram,
  faLinkedin,
  faBluesky,
} from "@fortawesome/free-brands-svg-icons";

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
   * Vertical offset from top (in pixels or percentage)
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
 * Platform icon and color mapping
 */
const PLATFORM_DATA: Record<
  string,
  { icon: IconDefinition; color: string; gradient: string }
> = {
  github: {
    icon: faGithub,
    color: "#24292e",
    gradient: "from-[#24292e] to-[#6e7681]",
  },
  twitter: {
    icon: faTwitter,
    color: "#1DA1F2",
    gradient: "from-[#1DA1F2] to-[#0d8bd4]",
  },
  discord: {
    icon: faDiscord,
    color: "#5865F2",
    gradient: "from-[#5865F2] to-[#4752c4]",
  },
  youtube: {
    icon: faYoutube,
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#cc0000]",
  },
  instagram: {
    icon: faInstagram,
    color: "#E4405F",
    gradient: "from-[#f09433] via-[#e6683c] to-[#dc2743]",
  },
  linkedin: {
    icon: faLinkedin,
    color: "#0A66C2",
    gradient: "from-[#0A66C2] to-[#084a8a]",
  },
  bluesky: {
    icon: faBluesky,
    color: "#1185FE",
    gradient: "from-[#1185FE] to-[#0d6fd4]",
  },
};

/**
 * Dara UI SocialMedia - Floating social media buttons with chevron
 *
 * Features:
 * - Floating chevron on the edge of the screen
 * - Expands to show social media buttons with smooth animation
 * - Auto-detects platform from URL
 * - Platform-specific colors and gradients
 * - Uses Font Awesome icons
 * - Glass morphism styling
 * - Smooth expand/collapse animation
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
    return PLATFORM_DATA[key] || PLATFORM_DATA.github;
  };

  // Size mapping
  const sizeMap = {
    sm: {
      button: "w-10 h-10 text-sm",
      icon: "h-4 w-4",
      chevron: "w-8 h-8",
    },
    md: {
      button: "w-12 h-12 text-base",
      icon: "h-5 w-5",
      chevron: "w-10 h-10",
    },
    lg: {
      button: "w-14 h-14 text-lg",
      icon: "h-6 w-6",
      chevron: "w-12 h-12",
    },
  };

  // Toggle expansion with smooth animation
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
    },
    right: {
      container: `right-0`,
      chevron: `right-[${offset}px]`,
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
        {/* Expanded menu - smooth animation */}
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
                    background: `linear-gradient(135deg, ${platformData.color}, ${platformData.color}dd)`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded();
                  }}
                >
                  <FontAwesomeIcon
                    icon={platformData.icon}
                    className={`${sizeStyles.icon} flex-shrink-0`}
                  />
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

        {/* Chevron toggle button - glass morphism */}
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
