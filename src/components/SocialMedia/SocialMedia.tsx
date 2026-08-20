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

  return (
    <div
      ref={containerRef}
      // FIX: z-index lowered to 40 so it stays under navbar (z-50)
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
            const platform = detectPlatform(link.url);
            const platformData = getPlatformData(platform);
            const label =
              link.label ||
              platform.charAt(0).toUpperCase() + platform.slice(1);

            const delay = isClosing
              ? (links.length - 1 - index) * 40
              : index * 40;

            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in new tab)`}
                className={`
                  flex items-center gap-2
                  ${sizeStyles.button}
                  rounded-full
                  !text-white
                  shadow-lg
                  hover:shadow-xl
                  transition-all duration-200
                  hover:scale-110
                  hover:-translate-y-0.5
                  ${showLabels ? "px-4" : "justify-center"}
                  group
                  relative
                  flex-shrink-0
                `}
              >
                <FontAwesomeIcon
                  icon={platformData.icon}
                  className={`${sizeStyles.icon} flex-shrink-0`}
                  aria-hidden="true"
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
