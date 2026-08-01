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
 * - Uses Avatar and Badge components
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

  const handleMouseEnter = () => setIsHovering(true);
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
  const renderStatRing = (stat: CharacterStat) => {
    const percentage = Math.min(100, Math.max(0, stat.value));
    const size = isHorizontal ? 48 : 56;
    const strokeWidth = 3.5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const colorClass = getStatColor(stat.color);

    // Fixed width so every item is identical → perfect equal spacing between ring centers
    const itemWidth = isHorizontal ? 60 : 68;

    return (
      <div
        className="flex flex-col items-center flex-shrink-0"
        style={{ width: itemWidth }}
      >
        <div className="relative" style={{ width: size, height: size }}>
          {/* Glow ring behind */}
          {percentage > 0 && (
            <svg
              className="absolute inset-0"
              width={size}
              height={size}
              style={{ filter: "blur(6px)", opacity: 0.25 }}
              viewBox={`0 0 ${size} ${size}`}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                className={colorClass}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </svg>
          )}

          {/* Main ring */}
          <svg
            className="relative"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--color-border-secondary)"
              strokeWidth={strokeWidth}
            />
            {/* Progress arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              className={colorClass}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>

          {/* Center value */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading font-bold text-xs text-[var(--color-text-primary)]">
              {stat.value}
              <span className="text-[8px] text-[var(--color-text-tertiary)]">
                %
              </span>
            </span>
          </div>
        </div>

        {/* Label – perfectly centered under the ring, still has max-width */}
        <p className="text-[9px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono mt-1.5 text-center leading-tight max-w-full">
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
        transition: "transform 0.2s ease-out, box-shadow 0.4s ease",
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
        style={{ transform: "translateZ(20px)" }}
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
          <div className="min-w-0 flex-1">
            <h4 className="font-heading font-bold text-lg text-[var(--color-text-primary)] truncate">
              {name}
            </h4>
            {subtitle && (
              <p className="text-[var(--color-text-tertiary)] text-xs font-mono truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Quote - only show in vertical mode */}
        {quote && !isHorizontal && (
          <p
            className="text-[var(--color-text-secondary)] text-sm italic mt-3 leading-relaxed"
            style={{ transform: "translateZ(10px)" }}
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
        style={{ transform: "translateZ(15px)" }}
      >
        {/* Quote - only show in horizontal mode */}
        {quote && isHorizontal && (
          <p
            className="text-[var(--color-text-secondary)] text-sm italic mb-3 leading-relaxed line-clamp-2"
            style={{ transform: "translateZ(10px)" }}
          >
            "{quote}"
          </p>
        )}

        {/* Details */}
        <div
          className={`
    ${isHorizontal ? "flex flex-wrap gap-x-2 gap-y-1 mb-3" : "grid grid-cols-2 gap-y-2 mb-4"}
  `}
          style={{ transform: "translateZ(8px)" }}
        >
          {mbti && (
            <div
              className={`flex items-center gap-0.5 min-w-0 ${isHorizontal ? "max-w-[calc(50%-0.5rem)]" : ""}`}
            >
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono flex-shrink-0">
                MBTI:
              </span>
              <span className="text-xs font-medium text-[var(--color-text-secondary)] truncate min-w-0">
                {mbti}
              </span>
            </div>
          )}

          {species && (
            <div
              className={`flex items-center gap-0.5 min-w-0 ${isHorizontal ? "max-w-[calc(50%-0.5rem)]" : ""}`}
            >
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono flex-shrink-0">
                Species:
              </span>
              <span className="text-xs font-medium text-[var(--color-text-secondary)] truncate min-w-0">
                {species}
              </span>
            </div>
          )}

          {affiliation && (
            <div
              className={`
      flex items-center gap-1.5 min-w-0
      ${isHorizontal ? "max-w-full" : "col-span-2"}
    `}
            >
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono flex-shrink-0">
                Affiliation:
              </span>
              <span className="text-sm font-medium text-[var(--color-text-secondary)] truncate min-w-0">
                {affiliation}
              </span>
            </div>
          )}
        </div>

        {/* Traits */}
        {traits.length > 0 && (
          <div
            className="flex flex-wrap gap-2 mb-3"
            style={{ transform: "translateZ(5px)" }}
          >
            {traits.map((trait, index) => (
              <Badge key={index} variant="secondary" size="sm" outline>
                {trait}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats – equal spacing + perfectly centered labels */}
        {stats.length > 0 && (
          <div
            className={`
              ${isHorizontal ? "flex flex-wrap gap-3 justify-start" : "flex flex-wrap gap-3 justify-center"}
              pt-3 border-t border-[var(--color-border-secondary)]
            `}
            style={{ transform: "translateZ(5px)" }}
          >
            {stats.map((stat) => renderStatRing(stat))}
          </div>
        )}
      </div>
    </div>
  );
};

CharacterCard.displayName = "CharacterCard";
export default CharacterCard;
