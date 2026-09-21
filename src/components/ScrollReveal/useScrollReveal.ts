import { useEffect, useRef, useState } from "react";

export interface UseScrollRevealOptions {
  /**
   * IntersectionObserver threshold
   * @default 0.15
   */
  threshold?: number;
  /**
   * Only trigger once
   * @default true
   */
  once?: boolean;
  /**
   * Root margin
   * @default "0px 0px -10% 0px"
   */
  rootMargin?: string;
}

/**
 * useScrollReveal - Hook version of ScrollReveal for custom elements
 *
 * Returns a ref to attach and a boolean indicating visibility.
 * Use with any element: cards, inputs, sections, etc.
 *
 * @example
 * ```tsx
 * const { ref, isVisible } = useScrollReveal();
 * <div ref={ref} style={{ opacity: isVisible ? 1 : 0 }}>
 *   Content
 * </div>
 * ```
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {},
) {
  const {
    threshold = 0.15,
    once = true,
    rootMargin = "0px 0px -10% 0px",
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, isVisible };
}

export default useScrollReveal;
