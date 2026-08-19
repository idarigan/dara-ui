import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual style variant
   * @default "primary"
   */
  variant?:
    | "primary"
    | "secondary"
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
   * Glow effect color
   */
  glow?: "purple" | "cyan" | "pink";
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
 * Dara UI Button - with enhanced hover glow and elevation effects
 *
 * Features:
 * - All variants have visible hover glow effects matching the original demo
 * - Hover elevation with transform: translateY(-2px)
 * - Smooth transition animations
 * - Active scale effect
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
    // Base styles with hover elevation
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-heading font-semibold tracking-wide transition-all duration-180 rounded-full active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none relative overflow-hidden hover:-translate-y-0.5";

    // Variants with enhanced glow effects matching the original demo
    const variants = {
      primary:
        "bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-glow-primary)] hover:bg-[var(--color-primary-hover)] hover:shadow-[0_0_45px_rgba(124,92,255,0.5)] hover:shadow-[0_3px_42px_rgba(124,92,255,0.3)]",
      secondary:
        "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-secondary)] hover:shadow-[0_0_35px_rgba(0,217,255,0.2)] hover:shadow-[0_3px_42px_rgba(0,0,0,0.2)]",
      glass:
        "glass rounded-full text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/40 hover:shadow-[0_0_35px_rgba(255,255,255,0.08)] hover:shadow-[0_3px_42px_rgba(0,0,0,0.15)]",
      danger:
        "bg-[var(--color-danger)] text-[var(--color-text-inverse)] shadow-[var(--shadow-glow-danger)] hover:bg-[var(--color-danger-hover)] hover:shadow-[0_0_45px_rgba(255,83,112,0.5)] hover:shadow-[0_3px_42px_rgba(255,83,112,0.3)]",
      success:
        "bg-[var(--color-success)] text-[var(--color-text-inverse)] shadow-[var(--shadow-glow-success)] hover:bg-[var(--color-success-hover)] hover:shadow-[0_0_45px_rgba(0,255,153,0.5)] hover:shadow-[0_3px_42px_rgba(0,255,153,0.3)]",
      outline:
        "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-elevated)]/30 hover:border-[var(--color-primary)] hover:shadow-[0_0_35px_rgba(124,92,255,0.15)] hover:shadow-[0_3px_42px_rgba(0,0,0,0.1)]",
    };

    // Sizes
    const sizes = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg",
    };

    // Glow effects - applied on hover
    const glowStyles = {
      purple:
        "hover:shadow-[0_0_50px_rgba(124,92,255,0.5)] hover:shadow-[0_3px_42px_rgba(124,92,255,0.3)]",
      cyan: "hover:shadow-[0_0_50px_rgba(0,217,255,0.5)] hover:shadow-[0_3px_42px_rgba(0,217,255,0.3)]",
      pink: "hover:shadow-[0_0_50px_rgba(255,77,157,0.5)] hover:shadow-[0_3px_42px_rgba(255,77,157,0.3)]",
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
        {leftIcon && <span>{leftIcon}</span>}
        {children}
        {rightIcon && <span>{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
