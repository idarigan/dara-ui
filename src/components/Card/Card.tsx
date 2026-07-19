import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card visual variant
   * @default "glass"
   */
  variant?: "glass" | "solid" | "outline";
  /**
   * Card padding size
   * @default "md"
   */
  padding?: "sm" | "md" | "lg" | "none";
  /**
   * Card border radius
   * @default "standard"
   */
  radius?: "sm" | "md" | "standard" | "large" | "xl" | "full";
  /**
   * Adds float hover effect (elevation + translate)
   * @default false
   */
  float?: boolean;
  /**
   * Glow effect color
   * @default "none"
   */
  glow?: "primary" | "secondary" | "accent" | "success" | "danger" | "none";
  /**
   * If true, card will take full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Card content
   */
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "glass",
      padding = "md",
      radius = "standard",
      float = false,
      glow = "none",
      fullWidth = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    // Base styles
    const baseStyles = "transition-all duration-[var(--transition-med)]";

    // Variant styles
    const variants = {
      glass: "glass",
      solid: "glass-solid",
      outline: "glass-outline",
    };

    // Padding styles
    const paddings = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      none: "p-0",
    };

    // Radius styles (using CSS custom properties)
    const radiusMap = {
      sm: "rounded-sm",
      md: "rounded-md",
      standard: "rounded-standard",
      large: "rounded-large",
      xl: "rounded-xl",
      full: "rounded-full",
    };

    // Glow styles
    const glowStyles = {
      primary: "shadow-[var(--shadow-glow-primary)]",
      secondary: "shadow-[var(--shadow-glow-secondary)]",
      accent: "shadow-[var(--shadow-glow-accent)]",
      success: "shadow-[var(--shadow-glow-success)]",
      danger: "shadow-[var(--shadow-glow-danger)]",
      none: "",
    };

    // Float hover effect
    const floatStyles = float
      ? "hover:translate-y-[-4px] hover:shadow-[var(--shadow-float),var(--shadow-glow-primary)]"
      : "";

    // Build className
    const classes = [
      baseStyles,
      variants[variant],
      paddings[padding],
      radiusMap[radius],
      glow !== "none" ? glowStyles[glow] : "",
      floatStyles,
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;
