import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card visual variant
   * @default "glass"
   */
  variant?: "glass" | "solid" | "outline";
  /**
   * Card padding
   * @default "md"
   */
  padding?: "sm" | "md" | "lg" | "none";
  /**
   * Border radius
   * @default "standard"
   */
  radius?: "sm" | "md" | "standard" | "large" | "xl" | "full";
  /**
   * Float hover effect
   * @default false
   */
  float?: boolean;
  /**
   * Glow effect color
   */
  glow?: "purple" | "cyan" | "pink";
  /**
   * Card content
   */
  children: React.ReactNode;
}

/**
 * Dara UI Card
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "glass",
      padding = "md",
      radius = "standard",
      float = false,
      glow,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    // Variants
    const variants = {
      glass: "glass",
      solid: "glass-solid",
      outline: "glass-outline",
    };

    const paddings = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      none: "p-0",
    };

    const radiusMap = {
      sm: "rounded-sm",
      md: "rounded-md",
      standard: "rounded-standard",
      large: "rounded-large",
      xl: "rounded-xl",
      full: "rounded-full",
    };

    const glowStyles = {
      purple: "glow-purple",
      cyan: "glow-cyan",
      pink: "glow-pink",
    };

    const floatClass = float ? "float-card" : "";

    const classes = [
      variants[variant],
      paddings[padding],
      radiusMap[radius],
      floatClass,
      glow ? glowStyles[glow] : "",
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
