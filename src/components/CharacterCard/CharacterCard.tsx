import React, { useState, useRef } from "react";

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
   * Array of custom traits/props (e.g., ["INTJ", "Human/Cyborg"])
   */
  traits?: string[];
  /**
   * Array of stats to display
   */
  stats?: CharacterStat[];
  /**
   * Layout variant
   * @default "vertical"
   */
  variant?: "vertical" | "horizontal";
  /**
   * Glow variant color
   * @default "purple"
   */
  glow?: "purple" | "cyan" | "pink" | "none";
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI CharacterCard - RPG-style character profile card
 *
 * Features:
 * - Portrait with fallback to initials
 * - Name, subtitle, quote
 * - Stats with radial progress rings
 * - 3D tilt effect on hover
 * - Vertical and horizontal layouts
 * - Glow variants
 * - Theme-aware colors
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
  variant = "vertical",
  glow = "purple",
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

  // Get initials from name
  const getInitials = (): string => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Glow styles
  const glowStyles = {
    purple: "glow-purple",
    cyan: "glow-cyan",
    pink: "glow-pink",
    none: "",
  };

  const glowClass = glowStyles[glow] || "";

  // Stat color mapping
  const statColors = {
    primary: "stroke-[var(--color-primary)]",
    secondary: "stroke-[var(--color-secondary)]",
    accent: "stroke-[var(--color-accent)]",
    success: "stroke-[var(--color-success)]",
    danger: "stroke-[var(--color-danger)]",
    warning: "stroke-[var(--color-warning)]",
  };

  // Get stat color
  const getStatColor = (color?: string) => {
    if (color && color in statColors) {
      return statColors[color as keyof typeof statColors];
    }
    return "stroke-[var(--color-primary)]";
  };

  // Horizontal layout
  if (variant === "horizontal") {
    return (
      <div
        ref={cardRef}
        className={`
          glass p-6 float-card
          relative flex flex-col md:flex-row gap-6
          transition-all duration-300
          ${glowClass}
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
        {/* Left Column - Portrait + Name + Subtitle */}
        <div
          className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-3 flex-shrink-0"
          style={{
            transform: "translateZ(20px)",
          }}
        >
          {/* Portrait / Avatar */}
          <div
            className={`
              w-16 h-16 rounded-full flex items-center justify-center
              flex-shrink-0 text-2xl
              bg-[var(--color-bg-tertiary)]
              border-2 border-[var(--color-border-secondary)]
              overflow-hidden
              ${glow !== "none" ? `ring-2 ring-[var(--color-primary)]/30` : ""}
            `}
          >
            {portrait ? (
              <img
                src={portrait}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : icon ? (
              <span>{icon}</span>
            ) : (
              <span className="font-heading font-bold text-xl text-[var(--color-text-primary)]">
                {getInitials()}
              </span>
            )}
          </div>

          {/* Name and subtitle */}
          <div className="text-center md:text-left">
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

        {/* Right Column - Quote + Details + Stats */}
        <div className="flex-1 min-w-0">
          {/* Quote */}
          {quote && (
            <p
              className="text-[var(--color-text-secondary)] text-sm italic mb-3 leading-relaxed"
              style={{
                transform: "translateZ(10px)",
              }}
            >
              "{quote}"
            </p>
          )}

          {/* Details Grid - horizontal layout with fixed widths */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 mb-3"
            style={{
              transform: "translateZ(8px)",
            }}
          >
            {mbti && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono">
                  MBTI
                </p>
                <p className="text-sm font-medium text-[var(--color-text-secondary)] truncate">
                  {mbti}
                </p>
              </div>
            )}
            {species && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono">
                  Species
                </p>
                <p className="text-sm font-medium text-[var(--color-text-secondary)] truncate">
                  {species}
                </p>
              </div>
            )}
            {affiliation && (
              <div className="col-span-2">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono">
                  Affiliation
                </p>
                <p className="text-sm font-medium text-[var(--color-text-secondary)] truncate">
                  {affiliation}
                </p>
              </div>
            )}
          </div>

          {/* Traits */}
          {traits.length > 0 && (
            <div
              className="flex flex-wrap gap-2 mb-3"
              style={{
                transform: "translateZ(5px)",
              }}
            >
              {traits.map((trait, index) => (
                <span
                  key={index}
                  className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-secondary)] text-[var(--color-text-secondary)] whitespace-nowrap"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}

          {/* Stats - horizontal layout with consistent spacing */}
          {stats.length > 0 && (
            <div
              className="flex flex-wrap gap-4 justify-start pt-3 border-t border-[var(--color-border-secondary)]"
              style={{
                transform: "translateZ(5px)",
              }}
            >
              {stats.map((stat, index) => {
                const percentage = Math.min(100, Math.max(0, stat.value));
                const circumference = 2 * Math.PI * 24;
                const offset =
                  circumference - (percentage / 100) * circumference;

                return (
                  <div key={index} className="text-center flex-shrink-0">
                    <div className="relative inline-flex">
                      <svg width="56" height="56" className="stat-ring">
                        {/* Background ring */}
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          stroke="var(--color-border-secondary)"
                          strokeWidth="4"
                          fill="none"
                        />
                        {/* Progress ring */}
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          className={getStatColor(stat.color)}
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          style={{
                            transition: "stroke-dashoffset 0.8s ease",
                          }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-heading font-bold text-xs text-[var(--color-text-primary)]">
                        {stat.value}
                        <span className="text-[8px] text-[var(--color-text-tertiary)]">
                          %
                        </span>
                      </span>
                    </div>
                    <p className="text-[9px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono mt-0.5 max-w-[56px] truncate">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vertical layout (default)
  return (
    <div
      ref={cardRef}
      className={`
        glass p-6 float-card
        relative flex flex-col
        transition-all duration-300
        ${glowClass}
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
      {/* Character Info Section */}
      <div className="flex items-center gap-4 mb-4">
        {/* Portrait / Avatar */}
        <div
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            flex-shrink-0 text-2xl
            bg-[var(--color-bg-tertiary)]
            border-2 border-[var(--color-border-secondary)]
            overflow-hidden
            ${glow !== "none" ? `ring-2 ring-[var(--color-primary)]/30` : ""}
          `}
          style={{
            transform: "translateZ(20px)",
          }}
        >
          {portrait ? (
            <img
              src={portrait}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : icon ? (
            <span>{icon}</span>
          ) : (
            <span className="font-heading font-bold text-xl text-[var(--color-text-primary)]">
              {getInitials()}
            </span>
          )}
        </div>

        {/* Name and subtitle */}
        <div
          style={{
            transform: "translateZ(15px)",
          }}
        >
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

      {/* Quote */}
      {quote && (
        <p
          className="text-[var(--color-text-secondary)] text-sm italic mb-4 leading-relaxed"
          style={{
            transform: "translateZ(10px)",
          }}
        >
          "{quote}"
        </p>
      )}

      {/* Details Grid */}
      <div
        className="grid grid-cols-2 gap-2 mb-4"
        style={{
          transform: "translateZ(8px)",
        }}
      >
        {mbti && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono">
              MBTI
            </p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              {mbti}
            </p>
          </div>
        )}
        {species && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono">
              Species
            </p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              {species}
            </p>
          </div>
        )}
        {affiliation && (
          <div className="col-span-2">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono">
              Affiliation
            </p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              {affiliation}
            </p>
          </div>
        )}
      </div>

      {/* Traits */}
      {traits.length > 0 && (
        <div
          className="flex flex-wrap gap-2 mb-4"
          style={{
            transform: "translateZ(5px)",
          }}
        >
          {traits.map((trait, index) => (
            <span
              key={index}
              className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-secondary)] text-[var(--color-text-secondary)]"
            >
              {trait}
            </span>
          ))}
        </div>
      )}

      {/* Stats - vertical layout with proper label alignment */}
      {stats.length > 0 && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 justify-items-center pt-3 border-t border-[var(--color-border-secondary)]"
          style={{
            transform: "translateZ(5px)",
          }}
        >
          {stats.map((stat, index) => {
            const percentage = Math.min(100, Math.max(0, stat.value));
            const circumference = 2 * Math.PI * 28;
            const offset = circumference - (percentage / 100) * circumference;

            return (
              <div key={index} className="text-center w-full">
                <div className="relative inline-flex">
                  <svg width="64" height="64" className="stat-ring">
                    {/* Background ring */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="var(--color-border-secondary)"
                      strokeWidth="4"
                      fill="none"
                    />
                    {/* Progress ring */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      className={getStatColor(stat.color)}
                      strokeWidth="4"
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
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono mt-1 truncate max-w-[70px] mx-auto">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

CharacterCard.displayName = "CharacterCard";
export default CharacterCard;
