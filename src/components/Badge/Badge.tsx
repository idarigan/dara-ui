import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge color variant
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  /**
   * Badge size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * true? badge will have a glow effect
   * @default false
   */
  glow?: boolean;
  /**
   * true? badge will be outlined (transparent background)
   * @default false
   */
  outline?: boolean;
  /**
   * Badge content
   */
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "primary",
      size = "md",
      glow = false,
      outline = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    // Base styles
    const baseStyles =
      "inline-flex items-center justify-center font-accent font-medium transition-all duration-[var(--transition-fast)]";

    // Size styles
    const sizes = {
      sm: "px-2.5 py-0.5 text-xs rounded-full",
      md: "px-3.5 py-1 text-sm rounded-full",
      lg: "px-5 py-1.5 text-base rounded-full",
    };

    // Variant styles (solid)
    const solidVariants = {
      primary:
        "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
      secondary:
        "bg-[var(--color-secondary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-secondary-hover)]",
      success:
        "bg-[var(--color-success)] text-[var(--color-bg-primary)] hover:bg-[var(--color-success-hover)]",
      danger:
        "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-hover)]",
      warning:
        "bg-[var(--color-warning)] text-[var(--color-bg-primary)] hover:bg-[var(--color-warning-hover)]",
    };

    // Variant styles (outline)
    const outlineVariants = {
      primary:
        "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]",
      secondary:
        "border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary-light)]",
      success:
        "border-2 border-[var(--color-success)] text-[var(--color-success)] hover:bg-[var(--color-success-light)]",
      danger:
        "border-2 border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]",
      warning:
        "border-2 border-[var(--color-warning)] text-[var(--color-warning)] hover:bg-[var(--color-warning-light)]",
    };

    // Glow styles
    const glowStyles = glow
      ? {
          primary: "shadow-[var(--shadow-glow-primary)]",
          secondary: "shadow-[var(--shadow-glow-secondary)]",
          success: "shadow-[var(--shadow-glow-success)]",
          danger: "shadow-[var(--shadow-glow-danger)]",
          warning: "shadow-[var(--shadow-glow-warning)]",
        }[variant]
      : "";

    // Build className
    const classes = [
      baseStyles,
      outline ? outlineVariants[variant] : solidVariants[variant],
      sizes[size],
      glowStyles,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
