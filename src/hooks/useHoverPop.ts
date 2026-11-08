import { useEffect } from "react";
import type { RefObject } from "react";

export interface HoverPopOptions {
  /**
   * Cursor glow follow speed (0-1), lower is smoother and slower
   * @default 0.14
   */
  ease?: number;
}

/**
 * useHoverPop - hover micro-interactions for glass cards
 *
 * Features:
 * - Icon pop animation always plays to completion after mouse out
 * - Cursor glow position eases toward the pointer with a slight delay
 * - Works on `.float-card` elements and on any element with `data-glow`
 * - Only runs while the pointer is moving over the element
 */
export function useHoverPop<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { ease = 0.14 }: HoverPopOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;

    const hasGlow = () => el.matches(".float-card, [data-glow]");

    const paint = () => {
      el.style.setProperty("--glow-x", `${current.x}px`);
      el.style.setProperty("--glow-y", `${current.y}px`);
    };

    const locate = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
    };

    const step = () => {
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      current.x += dx * ease;
      current.y += dy * ease;
      paint();

      if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
        raf = requestAnimationFrame(step);
      } else {
        raf = 0;
      }
    };

    const onEnter = (e: MouseEvent) => {
      el.dataset.pop = "true";
      if (!hasGlow()) return;
      locate(e);
      current.x = target.x;
      current.y = target.y;
      paint();
    };

    const onMove = (e: MouseEvent) => {
      if (!hasGlow()) return;
      locate(e);
      if (reduce) {
        current.x = target.x;
        current.y = target.y;
        paint();
        return;
      }
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onAnimationEnd = (e: AnimationEvent) => {
      if (e.animationName === "daraIconPop") {
        delete el.dataset.pop;
      }
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("animationend", onAnimationEnd);
    el.addEventListener("animationcancel", onAnimationEnd);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("animationend", onAnimationEnd);
      el.removeEventListener("animationcancel", onAnimationEnd);
    };
  }, [ref, ease]);
}

export default useHoverPop;
