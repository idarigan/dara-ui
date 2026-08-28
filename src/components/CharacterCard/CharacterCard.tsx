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
   * @default "primary"
   */
  glow?: "primary" | "secondary" | "accent" | "none";
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
  glow = "primary",
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
    primary: "glow-primary",
    secondary: "glow-secondary",
    accent: "glow-accent",
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
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const center = size / 2;
    const itemWidth = isHorizontal ? 60 : 68;

    // Extra padding so the blur has room
    const pad = 8;
    const svgSize = size + pad * 2;
    const svgCenter = svgSize / 2;

    // Resolve color for the stroke attribute
    const strokeColor =
      stat.color === "secondary"
        ? "var(--color-secondary)"
        : stat.color === "accent"
          ? "var(--color-accent)"
          : stat.color === "success"
            ? "var(--color-success)"
            : stat.color === "danger"
              ? "var(--color-danger)"
              : stat.color === "warning"
                ? "var(--color-warning)"
                : "var(--color-primary)";

    return (
      <div
        className="flex flex-col items-center flex-shrink-0"
        style={{ width: itemWidth }}
      >
        <div
          className="relative"
          style={{ width: size, height: size }}
          role="img"
          aria-label={`${stat.label}: ${stat.value}%`}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            className="block overflow-visible"
            aria-hidden="true"
            style={{ overflow: "visible" }}
          >
            {/* Soft glow – follows only the progress arc */}
            {percentage > 0 && (
              <circle
                cx={svgCenter}
                cy={svgCenter}
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth + 3}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${svgCenter} ${svgCenter})`}
                style={{
                  filter: "blur(4px)",
                  opacity: 0.45,
                }}
              />
            )}

            {/* Background track */}
            <circle
              cx={svgCenter}
              cy={svgCenter}
              r={radius}
              fill="none"
              stroke="var(--color-border-secondary)"
              strokeWidth={strokeWidth}
            />

            {/* Progress arc */}
            <circle
              cx={svgCenter}
              cy={svgCenter}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${svgCenter} ${svgCenter})`}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />

            {/* Center value */}
            <text
              x={svgCenter}
              y={svgCenter}
              textAnchor="middle"
              dominantBaseline="central"
              className="font-heading font-bold"
              style={{
                fontSize: size < 52 ? "11px" : "13px",
                fill: "var(--color-text-primary)",
              }}
            >
              {stat.value}
              <tspan
                style={{
                  fontSize: size < 52 ? "8px" : "9px",
                  fill: "var(--color-text-secondary)",
                }}
              >
                %
              </tspan>
            </text>
          </svg>
        </div>

        {/* Label */}
        <p className="text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)] font-mono mt-1.5 text-center leading-tight max-w-full">
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
            glow={glow !== "none" ? "primary" : undefined}
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

        {/* Quote */}
        {quote && !isHorizontal && (
          <p
            className="text-[var(--color-text-secondary)] text-sm italic mt-4 leading-relaxed"
            style={{ transform: "translateZ(10px)" }}
          >
            "{quote}"
          </p>
        )}
      </div>

      {/* Right/Content Section */}
      <div
        className={`
          ${isHorizontal ? "flex-1 min-w-0" : "w-full mt-5"}
          flex flex-col
        `}
        style={{ transform: "translateZ(15px)" }}
      >
        {/* Quote */}
        {quote && isHorizontal && (
          <p
            className="text-[var(--color-text-secondary)] text-sm italic mb-4 leading-relaxed line-clamp-2"
            style={{ transform: "translateZ(10px)" }}
          >
            "{quote}"
          </p>
        )}

        {/* Details */}
        <div
          className={`
            ${isHorizontal ? "flex flex-wrap gap-x-2 gap-y-1.5 mb-4" : "grid grid-cols-2 gap-y-2.5 mb-5"}
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
            className="flex flex-wrap gap-2 mb-4"
            style={{ transform: "translateZ(5px)" }}
          >
            {traits.map((trait, index) => (
              <Badge key={index} variant="secondary" size="sm" outline>
                {trait}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        {stats.length > 0 && (
          <div
            className={`
              ${isHorizontal ? "flex flex-wrap gap-3 justify-start" : "flex flex-wrap gap-3 justify-center"}
              pt-4 border-t border-[var(--color-border-secondary)]
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
