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
  platform: string;
  url: string;
  label?: string;
  icon?: IconDefinition | React.ReactNode;
  color?: string; // Optional custom color
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

const PLATFORM_DATA: Record<string, { icon: IconDefinition; color: string }> = {
  github: {
    icon: faGithub,
    color: "#24292e",
  },
  twitter: {
    icon: faTwitter,
    color: "#1DA1F2",
  },
  discord: {
    icon: faDiscord,
    color: "#5865F2",
  },
  youtube: {
    icon: faYoutube,
    color: "#FF0000",
  },
  instagram: {
    icon: faInstagram,
    color: "#E4405F",
  },
  linkedin: {
    icon: faLinkedin,
    color: "#0A66C2",
  },
  bluesky: {
    icon: faBluesky,
    color: "#1185FE",
  },
};

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

  // Render icon helper - supports both FontAwesome and custom React nodes
  const renderIcon = (link: SocialLink, iconSizeClass: string) => {
    const platform = detectPlatform(link.url);
    const platformData = getPlatformData(platform);

    // If custom icon is provided as React node
    if (link.icon && React.isValidElement(link.icon)) {
      return React.cloneElement(link.icon as React.ReactElement, {
        className: `${iconSizeClass} flex-shrink-0`,
        "aria-hidden": true,
      });
    }

    // If custom icon is provided as IconDefinition
    if (link.icon) {
      return (
        <FontAwesomeIcon
          icon={link.icon as IconDefinition}
          className={`${iconSizeClass} flex-shrink-0`}
          aria-hidden="true"
        />
      );
    }

    // Fallback to platform default
    return (
      <FontAwesomeIcon
        icon={platformData.icon}
        className={`${iconSizeClass} flex-shrink-0`}
        aria-hidden="true"
      />
    );
  };

  // Get icon color - user provided or platform default
  const getIconColor = (link: SocialLink) => {
    if (link.color) return link.color;
    const platform = detectPlatform(link.url);
    const data = getPlatformData(platform);
    return data.color;
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
                  glass
                  text-[var(--color-text-primary)]
                  border border-[var(--color-border-primary)]
                  hover:border-[var(--color-border-secondary)]
                  shadow-lg
                  hover:shadow-xl
                  transition-all duration-200
                  hover:scale-110
                  hover:-translate-y-0.5
                  ${showLabels ? "px-4" : ""}
                  group
                  relative
                  flex-shrink-0
                `}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
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
            glass
            flex items-center justify-center
            transition-all duration-300
            hover:scale-110
            hover:shadow-[var(--shadow-glow-primary)]
            relative
            z-10
            flex-shrink-0
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
