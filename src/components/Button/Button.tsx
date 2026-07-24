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
 * Dara UI Button
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
    // Base styles
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-heading font-semibold tracking-wide transition-all duration-180 rounded-full active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none";

    // Variants
    const variants = {
      primary:
        "bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-glow-primary)] hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-glow-primary)]",
      secondary:
        "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-secondary)]",
      glass:
        "glass rounded-full text-[var(--color-text-primary)] hover:bg-[var(--glass-bg)]",
      danger:
        "bg-[var(--color-danger)] text-[var(--color-text-inverse)] shadow-[var(--shadow-glow-danger)] hover:bg-[var(--color-danger-hover)] hover:shadow-[var(--shadow-glow-danger)]",
      success:
        "bg-[var(--color-success)] text-[var(--color-text-inverse)] shadow-[var(--shadow-glow-success)] hover:bg-[var(--color-success-hover)] hover:shadow-[var(--shadow-glow-success)]",
      outline:
        "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-secondary)]",
    };

    // Sizes
    const sizes = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg",
    };

    // Glow effects
    const glowStyles = {
      purple: "hover:shadow-[var(--shadow-glow-primary)]",
      cyan: "hover:shadow-[var(--shadow-glow-secondary)]",
      pink: "hover:shadow-[var(--shadow-glow-accent)]",
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
