import React, { useState, useRef } from "react";
import { Avatar } from "../Avatar/Avatar";
import { Badge } from "../Badge/Badge";

export interface CharacterStat {
  /**
   * Stat label (e.g., "Force Alignment", "Combat", "Intelligence")
   */
  label: string;
  /**
   * Stat value (0-100)
   */
  value: number;
  /**
   * Color variant for the stat ring
   */
  color?: "primary" | "secondary" | "accent" | "success" | "danger" | "warning";
}

export interface CharacterCardProps {
  /**
   * Character name
   */
  name: string;
  /**
   * Character subtitle (e.g., "Jedi Archivist")
   */
  subtitle?: string;
  /**
   * Character quote
   */
  quote?: string;
  /**
   * Portrait image URL
   */
  portrait?: string;
  /**
   * Custom emoji/icon instead of portrait
   */
  icon?: string;
  /**
   * MBTI personality type
   */
  mbti?: string;
  /**
   * Species
   */
  species?: string;
  /**
   * Affiliation (e.g., "Jedi Order", "Rebel Alliance")
   */
  affiliation?: string;
  /**
   * Array of custom traits/props
   */
  traits?: string[];
  /**
   * Array of stats to display
   */
  stats?: CharacterStat[];
  /**
   * Glow variant color
   * @default "purple"
   */
  glow?: "purple" | "cyan" | "pink" | "none";
  /**
   * Layout mode
   * @default "vertical"
   */
  layout?: "vertical" | "horizontal";
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI CharacterCard - RPG-style character profile card
 *
 * Features:
 * - Vertical and horizontal layouts
 * - Portrait with fallback to initials
 * - Name, subtitle, quote
 * - Stats with radial progress rings
 * - 3D tilt effect on hover
 * - Glow variants
 * - Theme-aware colors
 * - Uses Avatar, Badge components
 */
export const CharacterCard: React.FC<CharacterCardProps> = ({
  name,
  subtitle,
  quote,
  portrait,
  icon,
  mbti,
  species,
  affiliation,
  traits = [],
  stats = [],
  glow = "purple",
  layout = "vertical",
  className = "",
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle 3D tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  // Glow styles
  const glowStyles = {
    purple: "glow-purple",
    cyan: "glow-cyan",
    pink: "glow-pink",
    none: "",
  };

  const glowClass = glowStyles[glow] || "";

  // Determine if horizontal
  const isHorizontal = layout === "horizontal";

  // Stat color mapping for radial rings
  const statColors = {
    primary: "stroke-[var(--color-primary)]",
    secondary: "stroke-[var(--color-secondary)]",
    accent: "stroke-[var(--color-accent)]",
    success: "stroke-[var(--color-success)]",
    danger: "stroke-[var(--color-danger)]",
    warning: "stroke-[var(--color-warning)]",
  };

  const getStatColor = (color?: string) => {
    if (color && color in statColors) {
      return statColors[color as keyof typeof statColors];
    }
    return "stroke-[var(--color-primary)]";
  };

  // Render radial stat ring
  const renderStatRing = (stat: CharacterStat, index: number) => {
    const percentage = Math.min(100, Math.max(0, stat.value));
    const size = isHorizontal ? 56 : 64;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div key={index} className="text-center flex-shrink-0">
        <div className="relative inline-flex">
          <svg
            width={size}
            height={size}
            className="stat-ring"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--color-border-secondary)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className={getStatColor(stat.color)}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 0.8s ease",
              }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-heading font-bold text-sm text-[var(--color-text-primary)]">
            {stat.value}
            <span className="text-[10px] text-[var(--color-text-tertiary)]">
              %
            </span>
          </span>
        </div>
        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono mt-1">
          {stat.label}
        </p>
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      className={`
        glass p-6 float-card
        relative
        transition-all duration-300
        ${glowClass}
        ${isHorizontal ? "flex flex-col md:flex-row gap-6" : "flex flex-col"}
        ${className}
      `}
      style={{
        transform: isHovering
          ? `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
        transformStyle: "preserve-3d",
        transition: "transform 0.2s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left/Header Section */}
      <div
        className={`
          ${isHorizontal ? "flex-shrink-0 md:w-48" : "w-full"}
          flex flex-col
        `}
        style={{
          transform: "translateZ(20px)",
        }}
      >
        {/* Portrait and Name */}
        <div className="flex items-center gap-4">
          <Avatar
            src={portrait}
            fallbackText={name}
            fallback={!portrait && !icon}
            size="lg"
            glow={glow !== "none" ? "purple" : undefined}
            bordered
          />
          <div>
            <h4 className="font-heading font-bold text-lg text-[var(--color-text-primary)]">
              {name}
            </h4>
            {subtitle && (
              <p className="text-[var(--color-text-tertiary)] text-xs font-mono">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Quote - only show in vertical mode */}
        {quote && !isHorizontal && (
          <p
            className="text-[var(--color-text-secondary)] text-sm italic mt-3 leading-relaxed"
            style={{
              transform: "translateZ(10px)",
            }}
          >
            "{quote}"
          </p>
        )}
      </div>

      {/* Right/Content Section */}
      <div
        className={`
          ${isHorizontal ? "flex-1 min-w-0" : "w-full"}
          flex flex-col
        `}
        style={{
          transform: "translateZ(15px)",
        }}
      >
        {/* Quote - only show in horizontal mode */}
        {quote && isHorizontal && (
          <p
            className="text-[var(--color-text-secondary)] text-sm italic mb-3 leading-relaxed"
            style={{
              transform: "translateZ(10px)",
            }}
          >
            "{quote}"
          </p>
        )}

        {/* Details - flex wrap for horizontal, grid for vertical */}
        <div
          className={`
            ${isHorizontal ? "flex flex-wrap gap-x-4 gap-y-1 mb-3" : "grid grid-cols-2 gap-2 mb-4"}
          `}
          style={{
            transform: "translateZ(8px)",
          }}
        >
          {mbti && (
            <div className={isHorizontal ? "flex items-center gap-1.5" : ""}>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono">
                MBTI:
              </span>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                {mbti}
              </span>
            </div>
          )}
          {species && (
            <div className={isHorizontal ? "flex items-center gap-1.5" : ""}>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono">
                Species:
              </span>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                {species}
              </span>
            </div>
          )}
          {affiliation && (
            <div
              className={`
                ${isHorizontal ? "flex items-center gap-1.5" : "col-span-2"}
              `}
            >
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono">
                Affiliation:
              </span>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                {affiliation}
              </span>
            </div>
          )}
        </div>

        {/* Traits - using Badge component */}
        {traits.length > 0 && (
          <div
            className="flex flex-wrap gap-2 mb-3"
            style={{
              transform: "translateZ(5px)",
            }}
          >
            {traits.map((trait, index) => (
              <Badge key={index} variant="secondary" size="sm" outline>
                {trait}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats - using radial progress rings */}
        {stats.length > 0 && (
          <div
            className={`
              ${isHorizontal ? "flex flex-wrap gap-3 justify-start" : "flex flex-wrap gap-4 justify-center"}
              pt-3 border-t border-[var(--color-border-secondary)]
            `}
            style={{
              transform: "translateZ(5px)",
            }}
          >
            {stats.map((stat, index) => renderStatRing(stat, index))}
          </div>
        )}
      </div>
    </div>
  );
};

CharacterCard.displayName = "CharacterCard";
export default CharacterCard;
