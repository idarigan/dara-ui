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
 * Dara UI Badge
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
    // Glass-based badges
    const baseStyles =
      "inline-flex items-center justify-center font-accent font-medium transition-all duration-180 rounded-full";

    const sizes = {
      sm: "px-2.5 py-0.5 text-xs",
      md: "px-3.5 py-1 text-sm",
      lg: "px-5 py-1.5 text-base",
    };

    // Solid variants
    const solidVariants = {
      primary: "bg-[#7c5cff] text-white",
      secondary: "bg-[#00d9ff] text-[#0b0f19]",
      success: "bg-[#00ff99] text-[#0b0f19]",
      danger: "bg-[#ff5370] text-white",
      warning: "bg-[#ffc857] text-[#0b0f19]",
    };

    // Outline variants
    const outlineVariants = {
      primary: "border-2 border-[#7c5cff] text-[#7c5cff] bg-transparent",
      secondary: "border-2 border-[#00d9ff] text-[#00d9ff] bg-transparent",
      success: "border-2 border-[#00ff99] text-[#00ff99] bg-transparent",
      danger: "border-2 border-[#ff5370] text-[#ff5370] bg-transparent",
      warning: "border-2 border-[#ffc857] text-[#ffc857] bg-transparent",
    };

    // Glow styles
    const glowStyles = {
      primary: "shadow-[0_0_30px_rgba(124,92,255,0.2)]",
      secondary: "shadow-[0_0_25px_rgba(0,217,255,0.15)]",
      success: "shadow-[0_0_25px_rgba(0,255,153,0.15)]",
      danger: "shadow-[0_0_25px_rgba(255,83,112,0.15)]",
      warning: "shadow-[0_0_25px_rgba(255,200,87,0.15)]",
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
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
export default Badge;
