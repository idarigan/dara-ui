import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "glass";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  glow?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      glow = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-[var(--transition-fast)] rounded-[var(--radius-full)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.96]";

    const variants = {
      primary:
        "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]",
      secondary:
        "bg-[var(--color-secondary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-secondary-hover)] active:bg-[var(--color-secondary-active)]",
      outline:
        "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] active:bg-[var(--color-primary)]/20",
      ghost:
        "text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] active:bg-[var(--color-primary)]/20",
      danger:
        "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-hover)] active:bg-[var(--color-danger)]/80",
      success:
        "bg-[var(--color-success)] text-[var(--color-bg-primary)] hover:bg-[var(--color-success-hover)] active:bg-[var(--color-success)]/80",
      glass:
        "glass text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/50 active:bg-[var(--color-bg-elevated)]/70",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg",
    };

    const glowStyles = glow
      ? {
          primary: "hover:shadow-[var(--shadow-glow-primary)]",
          secondary: "hover:shadow-[var(--shadow-glow-secondary)]",
          outline: "hover:shadow-[var(--shadow-glow-primary)]",
          ghost: "hover:shadow-[var(--shadow-glow-primary)]",
          danger: "hover:shadow-[var(--shadow-glow-danger)]",
          success: "hover:shadow-[var(--shadow-glow-success)]",
          glass: "hover:shadow-[var(--shadow-glow-primary)]",
        }[variant]
      : "";

    const classes = [
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth ? "w-full" : "",
      loading ? "opacity-70 cursor-wait" : "",
      glowStyles,
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
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
