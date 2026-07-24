import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual style variant
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "glass" | "danger" | "success";
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
   * Glow effect color (from original demo)
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
 * Dara UI Button — matching original demo styling exactly
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
    // Base styles from original demo
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-heading font-semibold tracking-wide transition-all duration-180 rounded-full active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none";

    // Variants from original demo
    const variants = {
      primary:
        "bg-[#7c5cff] text-white shadow-[0_0_20px_rgba(124,92,255,0.3)] hover:bg-[#6a4ae8] hover:shadow-[0_0_35px_rgba(124,92,255,0.5)]",
      secondary:
        "bg-white/8 text-[#e2e8f0] border border-white/15 hover:bg-white/14 hover:border-white/25",
      glass:
        "bg-white/5 backdrop-blur-[12px] text-[#e2e8f0] border border-white/12 hover:bg-white/10",
      danger:
        "bg-[#ff5370] text-white shadow-[0_0_18px_rgba(255,83,112,0.25)] hover:bg-[#e84560] hover:shadow-[0_0_30px_rgba(255,83,112,0.4)]",
      success:
        "bg-[#00ff99] text-[#0b0f19] shadow-[0_0_18px_rgba(0,255,153,0.25)] hover:bg-[#00e688] hover:shadow-[0_0_30px_rgba(0,255,153,0.4)]",
    };

    // Sizes from original demo
    const sizes = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg",
    };

    // Glow effects from original demo
    const glowStyles = {
      purple: "hover:shadow-[0_0_30px_rgba(124,92,255,0.2)]",
      cyan: "hover:shadow-[0_0_25px_rgba(0,217,255,0.15)]",
      pink: "hover:shadow-[0_0_25px_rgba(255,77,157,0.15)]",
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
