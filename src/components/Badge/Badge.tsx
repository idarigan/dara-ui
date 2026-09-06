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
   * If true, adds glow effect
   * @default false
   */
  glow?: boolean;
  /**
   * If true, outline style
   * @default false
   */
  outline?: boolean;
  /**
   * Badge content
   */
  children: React.ReactNode;
}

/**
 * Dara UI Badge - Theme-aware status indicators
 *
 * Features:
 * - Multiple variants with consistent colors
 * - Size variants
 * - Glow and outline options
 * - RTL support via dir attribute
 */
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
    const baseStyles =
      "inline-flex items-center justify-center font-accent font-medium transition-all duration-180 rounded-full";

    const sizes = {
      sm: "px-2.5 py-0.5 text-xs",
      md: "px-3.5 py-1 text-sm",
      lg: "px-5 py-1.5 text-base",
    };

    // Solid variants
    const solidVariants = {
      primary: "bg-[var(--color-primary-solid)] text-white",
      secondary: "bg-[var(--color-secondary-solid)] text-white",
      success: "bg-[var(--color-success-solid)] text-white",
      danger: "bg-[var(--color-danger-solid)] text-white",
      warning: "bg-[var(--color-warning-solid)] text-white",
    };

    // Outline variants
    const outlineVariants = {
      primary:
        "border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent",
      secondary:
        "border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] bg-transparent",
      success:
        "border-2 border-[var(--color-success)] text-[var(--color-success)] bg-transparent",
      danger:
        "border-2 border-[var(--color-danger)] text-[var(--color-danger)] bg-transparent",
      warning:
        "border-2 border-[var(--color-warning)] text-[var(--color-warning)] bg-transparent",
    };

    // Glow styles
    const glowStyles = {
      primary: "shadow-[var(--shadow-glow-primary)]",
      secondary: "shadow-[var(--shadow-glow-secondary)]",
      success: "shadow-[var(--shadow-glow-success)]",
      danger: "shadow-[var(--shadow-glow-danger)]",
      warning: "shadow-[var(--shadow-glow-warning)]",
    };

    const variantStyle = outline
      ? outlineVariants[variant]
      : solidVariants[variant];
    const glowStyle = glow ? glowStyles[variant] : "";

    const classes = [
      baseStyles,
      variantStyle,
      sizes[size],
      glowStyle,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} dir="auto" {...props}>
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
export default Badge;
