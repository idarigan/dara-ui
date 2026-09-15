import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual style variant
   * @default "primary"
   */
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "glass"
    | "danger"
    | "success"
    | "outline";
  /**
   * Button size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * If true, button will take full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * If true, shows loading spinner
   * @default false
   */
  loading?: boolean;
  /**
   * Glow effect color - primary, secondary, or accent
   */
  glow?: "" | "primary" | "secondary" | "accent";
  /**
   * Icon on the left side
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon on the right side
   */
  rightIcon?: React.ReactNode;
}

/**
 * Dara UI Button - Glassmorphism style with cyberpunk aesthetics
 *
 * Features:
 * - Multiple variants: primary, secondary, accent, glass, danger, success, outline
 * - Three sizes: sm, md, lg
 * - Glow effects with theme-aware shadows
 * - Loading state with spinner
 * - Full width option
 * - Icon support on both sides
 * - Smooth hover animations with scale and lift
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      glow,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-heading font-semibold tracking-wide transition-all duration-180 rounded-full active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none relative overflow-hidden hover:-translate-y-0.5";

    const variants = {
      primary:
        "bg-[var(--color-primary-solid)] text-white shadow-[var(--shadow-btn-primary)] hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-btn-primary-hover)] hover:brightness-105",
      secondary:
        "bg-[var(--color-secondary-solid)] text-white shadow-[var(--shadow-btn-secondary)] hover:bg-[var(--color-secondary-hover)] hover:shadow-[var(--shadow-btn-secondary-hover)] hover:brightness-105",
      accent:
        "bg-[var(--color-accent-solid)] text-white shadow-[var(--shadow-btn-accent)] hover:bg-[var(--color-accent-hover)] hover:shadow-[var(--shadow-btn-accent-hover)] hover:brightness-105",
      glass:
        "glass text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/40 hover:border-[var(--color-border-secondary)] hover:shadow-[var(--shadow-float)]",
      danger:
        "bg-[var(--color-danger-solid)] text-white shadow-[var(--shadow-btn-danger)] hover:bg-[var(--color-danger-hover)] hover:shadow-[var(--shadow-btn-danger-hover)] hover:brightness-105",
      success:
        "bg-[var(--color-success-solid)] text-white shadow-[var(--shadow-btn-success)] hover:bg-[var(--color-success-hover)] hover:shadow-[var(--shadow-btn-success-hover)] hover:brightness-105",
      outline:
        "bg-transparent text-[var(--color-text-primary)] border-2 border-[var(--color-border-primary)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-[var(--shadow-btn-primary)]",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-sm min-h-[32px]",
      md: "px-6 py-2.5 text-base min-h-[40px]",
      lg: "px-8 py-3.5 text-lg min-h-[48px]",
    };

    const glowStyles = {
      primary:
        "hover:shadow-[0_0_50px_color-mix(in_srgb,_var(--color-primary-solid)_50%,_transparent)]",
      secondary:
        "hover:shadow-[0_0_50px_color-mix(in_srgb,_var(--color-secondary-solid)_50%,_transparent)]",
      accent:
        "hover:shadow-[0_0_50px_color-mix(in_srgb,_var(--color-accent-solid)_50%,_transparent)]",
    };

    const classes = [
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth ? "w-full" : "",
      loading ? "opacity-80 pointer-events-none" : "",
      glow ? glowStyles[glow] : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="spinner inline-block w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
        )}
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
