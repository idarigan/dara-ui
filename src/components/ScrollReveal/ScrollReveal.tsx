import React, { useEffect, useRef, useState } from "react";

export type ScrollRevealAnimation =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "flip-up"
  | "flip-down"
  | "slide-up"
  | "slide-down";

export interface ScrollRevealProps {
  /**
   * Content to reveal
   */
  children: React.ReactNode;
  /**
   * Animation type
   * @default "fade-up"
   */
  animation?: ScrollRevealAnimation;
  /**
   * Delay before animation starts (ms)
   * @default 0
   */
  delay?: number;
  /**
   * Duration of the animation (ms)
   * @default 600
   */
  duration?: number;
  /**
   * Distance to travel in pixels (for directional animations)
   * @default 40
   */
  distance?: number;
  /**
   * IntersectionObserver threshold (0-1)
   * @default 0.15
   */
  threshold?: number;
  /**
   * Only animate once (don't re-trigger on scroll back)
   * @default true
   */
  once?: boolean;
  /**
   * Root margin for IntersectionObserver
   * @default "0px 0px -10% 0px"
   */
  rootMargin?: string;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI ScrollReveal - Animate elements into view on scroll
 *
 * Features:
 * - Multiple animation presets (fade, slide, zoom, flip)
 * - Configurable delay, duration, distance
 * - IntersectionObserver-based (performant)
 * - Respects prefers-reduced-motion
 * - Runs once by default
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  distance = 40,
  threshold = 0.15,
  once = true,
  rootMargin = "0px 0px -10% 0px",
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Respect reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip animation entirely if user prefers reduced motion
    if (prefersReducedMotion) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasAnimated(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, prefersReducedMotion]);

  // Calculate transform for initial state based on animation
  const getInitialTransform = (): string => {
    if (prefersReducedMotion) return "none";
    switch (animation) {
      case "fade":
        return "none";
      case "fade-up":
      case "slide-up":
        return `translateY(${distance}px)`;
      case "fade-down":
      case "slide-down":
        return `translateY(-${distance}px)`;
      case "fade-left":
        return `translateX(${distance}px)`;
      case "fade-right":
        return `translateX(-${distance}px)`;
      case "zoom-in":
        return "scale(0.92)";
      case "zoom-out":
        return "scale(1.08)";
      case "flip-up":
        return "perspective(1000px) rotateX(-25deg)";
      case "flip-down":
        return "perspective(1000px) rotateX(25deg)";
      default:
        return `translateY(${distance}px)`;
    }
  };

  const shouldAnimate = isVisible || hasAnimated;

  const style: React.CSSProperties = prefersReducedMotion
    ? {}
    : {
        opacity: shouldAnimate ? 1 : 0,
        transform: shouldAnimate ? "none" : getInitialTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
        willChange: shouldAnimate ? "auto" : "opacity, transform",
      };

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      data-scroll-reveal={animation}
      data-scroll-reveal-visible={shouldAnimate ? "true" : "false"}
    >
      {children}
    </div>
  );
};

ScrollReveal.displayName = "ScrollReveal";
export default ScrollReveal;
