import React, { useState, useRef } from "react";

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
   * Float hover effect with 3D tilt
   * @default false
   */
  float?: boolean;
  /**
   * Glow effect color
   */
  glow?: "primary" | "secondary" | "accent";
  /**
   * Card content
   */
  children?: React.ReactNode;
}

/**
 * Dara UI Card
 *
 * Features:
 * - Glass, solid, and outline variants
 * - 3D tilt effect on hover when float is enabled
 * - Smooth animated glow transitions
 * - Theme-aware colors
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
    // 3D tilt state
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Handle 3D tilt on mouse move
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !float) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseEnter = () => {
      if (float) setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setRotation({ x: 0, y: 0 });
    };

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

    // Radius mapping
    const radiusMap = {
      sm: "rounded-[var(--radius-sm)]",
      md: "rounded-[var(--radius-md)]",
      standard: "rounded-[var(--radius-standard)]",
      large: "rounded-[var(--radius-large)]",
      xl: "rounded-[var(--radius-xl)]",
      full: "rounded-[var(--radius-full)]",
    };

    // Glow mapping
    const glowStyles = {
      primary: "glow-purple",
      secondary: "glow-cyan",
      accent: "glow-pink",
    };

    const floatClass = float ? "float-card" : "";
    const glowClass = glow ? glowStyles[glow] : "";

    const classes = [
      variants[variant],
      paddings[padding],
      radiusMap[radius],
      floatClass,
      glowClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
          }
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
        }}
        className={classes}
        style={{
          transform:
            float && isHovering
              ? `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
              : "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
          transformStyle: float ? "preserve-3d" : "flat",
          transition: float
            ? "transform 0.2s ease-out, box-shadow 0.4s ease"
            : "none",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
export default Card;
