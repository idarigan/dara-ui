import React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Image source URL
   */
  src?: string;
  /**
   * Alternative text for the image
   */
  alt?: string;
  /**
   * Avatar size
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Display a fallback icon instead of image
   * @default false
   */
  fallback?: boolean;
  /**
   * Fallback text to display (usually initials)
   */
  fallbackText?: string;
  /**
   * Shape of the avatar
   * @default "circle"
   */
  shape?: "circle" | "rounded" | "square";
  /**
   * Border style
   * @default false
   */
  bordered?: boolean;
  /**
   * Glow effect around the avatar
   */
  glow?: "purple" | "cyan" | "pink" | "primary" | "secondary" | "accent";
  /**
   * Online status indicator
   */
  status?: "online" | "offline" | "away" | "busy";
  /**
   * Group avatar (multiple avatars stacked)
   * @default false
   */
  group?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * Dara UI Avatar - Display user profile images with fallback support
 *
 * Features:
 * - Image support with fallback to initials or icon
 * - Multiple sizes (xs, sm, md, lg, xl)
 * - Shape variants (circle, rounded, square)
 * - Border and glow effects
 * - Online status indicator
 * - Group stacking
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = "",
      size = "md",
      fallback = false,
      fallbackText,
      shape = "circle",
      bordered = false,
      glow,
      status,
      group = false,
      onClick,
      className = "",
      ...props
    },
    ref,
  ) => {
    // Size mapping
    const sizes = {
      xs: "w-6 h-6 text-[10px]",
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-lg",
    };

    // Shape mapping
    const shapes = {
      circle: "rounded-full",
      rounded: "rounded-[var(--radius-md)]",
      square: "rounded-none",
    };

    // Glow styles
    const glowStyles = {
      purple: "shadow-[var(--shadow-glow-primary)]",
      cyan: "shadow-[var(--shadow-glow-secondary)]",
      pink: "shadow-[var(--shadow-glow-accent)]",
      primary: "shadow-[var(--shadow-glow-primary)]",
      secondary: "shadow-[var(--shadow-glow-secondary)]",
      accent: "shadow-[var(--shadow-glow-accent)]",
    };

    // Status indicator colors
    const statusColors = {
      online: "bg-[var(--color-success)]",
      offline: "bg-[var(--color-text-tertiary)]",
      away: "bg-[var(--color-warning)]",
      busy: "bg-[var(--color-danger)]",
    };

    // Status indicator sizes
    const statusSizes = {
      xs: "w-1.5 h-1.5",
      sm: "w-2 h-2",
      md: "w-2.5 h-2.5",
      lg: "w-3 h-3",
      xl: "w-3.5 h-3.5",
    };

    // Border styles
    const borderClass = bordered
      ? "border-2 border-[var(--color-border-secondary)]"
      : "";

    // Glow class
    const glowClass = glow ? glowStyles[glow] : "";

    // Click handler
    const handleClick = () => {
      if (onClick) onClick();
    };

    // Get initials from fallbackText
    const getInitials = () => {
      if (!fallbackText) return "";
      const parts = fallbackText.trim().split(" ");
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
      ).toUpperCase();
    };

    // Fallback icon (user icon)
    const FallbackIcon = () => (
      <svg
        className="w-1/2 h-1/2 text-[var(--color-text-tertiary)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    );

    // Render content
    const renderContent = () => {
      // If we have an image and not forcing fallback
      if (src && !fallback) {
        return (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails, show fallback
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        );
      }

      // If we have fallback text
      if (fallbackText) {
        return (
          <span className="font-heading font-semibold text-inherit">
            {getInitials()}
          </span>
        );
      }

      // Default fallback icon
      return <FallbackIcon />;
    };

    // Group rendering - stack multiple avatars
    if (group) {
      return (
        <div ref={ref} className={`flex -space-x-2 ${className}`} {...props}>
          {React.Children.map(props.children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(
                child as React.ReactElement<AvatarProps>,
                {
                  size: size,
                  shape: shape,
                  bordered: true,
                  className: "ring-2 ring-[var(--color-bg-primary)]",
                },
              );
            }
            return child;
          })}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`
          relative inline-flex items-center justify-center
          flex-shrink-0
          bg-[var(--color-bg-tertiary)]
          text-[var(--color-text-secondary)]
          transition-all duration-[var(--transition-fast)]
          ${sizes[size]}
          ${shapes[shape]}
          ${borderClass}
          ${glowClass}
          ${onClick ? "cursor-pointer hover:opacity-80" : ""}
          ${className}
        `}
        onClick={handleClick}
        {...props}
      >
        {renderContent()}

        {/* Status indicator */}
        {status && (
          <span
            className={`
              absolute bottom-0 right-0
              rounded-full
              ring-2 ring-[var(--color-bg-primary)]
              ${statusColors[status]}
              ${statusSizes[size]}
            `}
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export default Avatar;
