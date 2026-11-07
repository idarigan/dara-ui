import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * useHoverPop - lets the icon pop animation finish after the pointer leaves
 *
 * Marks the element on mouse enter and clears the mark only once the
 * animation has ended, so the pop always plays to completion.
 */
export function useHoverPop<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = () => {
      el.dataset.pop = "true";
    };

    const end = (e: AnimationEvent) => {
      if (e.animationName === "daraIconPop") {
        delete el.dataset.pop;
      }
    };

    el.addEventListener("mouseenter", start);
    el.addEventListener("animationend", end);
    el.addEventListener("animationcancel", end);

    return () => {
      el.removeEventListener("mouseenter", start);
      el.removeEventListener("animationend", end);
      el.removeEventListener("animationcancel", end);
    };
  }, [ref]);
}

export default useHoverPop;
