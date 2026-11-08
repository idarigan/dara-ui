import React, { useEffect, useRef, useCallback } from "react";

export interface ParticlesProps {
  /**
   * Number of particles
   * @default 60
   */
  count?: number;
  /**
   * Particle colors - one color string or an array of colors
   * Replaces the theme colors when provided
   * @default theme tokens (primary, secondary, accent, text)
   */
  colors?: string | string[];
  /**
   * Opacity of the whole layer (0-1)
   * @default 0.5
   */
  opacity?: number;
  /**
   * Opacity range per particle [min, max]
   * @default [0.15, 0.5]
   */
  opacityRange?: [number, number];
  /**
   * Size range [min, max] in pixels
   * @default [0.5, 2.5]
   */
  sizeRange?: [number, number];
  /**
   * Speed range [min, max]
   * @default [0.1, 0.4]
   */
  speedRange?: [number, number];
  /**
   * Particles are pushed away by the mouse pointer
   * @default true
   */
  interactive?: boolean;
  /**
   * Pointer influence radius in pixels
   * @default 140
   */
  interactionRadius?: number;
  /**
   * Pointer push strength multiplier
   * @default 1
   */
  interactionStrength?: number;
  /**
   * Additional className
   */
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  colorIndex: number;
}

// Stable defaults
const DEFAULT_COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent)",
  "var(--color-text-primary)",
];
const DEFAULT_OPACITY: [number, number] = [0.15, 0.5];
const DEFAULT_SIZE: [number, number] = [0.5, 2.5];
const DEFAULT_SPEED: [number, number] = [0.1, 0.4];

const normalizeColors = (colors?: string | string[]): string[] => {
  const list = (Array.isArray(colors) ? colors : colors ? [colors] : []).filter(
    Boolean,
  );
  return list.length > 0 ? list : DEFAULT_COLORS;
};

// Resolve CSS custom properties to concrete color strings
const resolveToken = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed.startsWith("var(")) return trimmed;
  const [name, fallback] = trimmed.slice(4, -1).split(/,(.+)/);
  const resolved = getComputedStyle(document.documentElement)
    .getPropertyValue(name.trim())
    .trim();
  return resolved || (fallback ? resolveToken(fallback) : "#ffffff");
};

/**
 * Dara UI Particles - Animated starfield/particle background
 *
 * Features:
 * - Configurable particle count, colors, sizes, and speeds
 * - Theme-aware default colors that follow the active theme tokens
 * - One color or many, passed as a string or an array
 * - Layer opacity control
 * - Optional mouse interaction with a single cheap distance check per particle
 * - Pauses while the tab is hidden and respects reduced motion
 * - Particles are created once (and on resize / count change only)
 * - Safe under frequent parent re-renders (e.g. controlled Range)
 */
export const Particles: React.FC<ParticlesProps> = React.memo(
  ({
    count = 60,
    colors,
    opacity = 0.5,
    opacityRange = DEFAULT_OPACITY,
    sizeRange = DEFAULT_SIZE,
    speedRange = DEFAULT_SPEED,
    interactive = true,
    interactionRadius = 140,
    interactionStrength = 1,
    className = "",
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const paletteRef = useRef<string[]>([]);
    const animationIdRef = useRef<number>(0);
    const pointerRef = useRef({ x: -9999, y: -9999, active: false });

    const colorList = normalizeColors(colors);
    const colorKey = colorList.join("|");

    // Keep latest config in refs so resize can use them without effect churn
    const configRef = useRef({
      count,
      colorList,
      opacityRange,
      sizeRange,
      speedRange,
      interactive,
      interactionRadius,
      interactionStrength,
    });
    configRef.current = {
      count,
      colorList,
      opacityRange,
      sizeRange,
      speedRange,
      interactive,
      interactionRadius,
      interactionStrength,
    };

    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }, []);

    const refreshPalette = useCallback(() => {
      paletteRef.current = configRef.current.colorList.map(resolveToken);
    }, []);

    const createParticles = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { count, opacityRange, sizeRange, speedRange } = configRef.current;
      const paletteSize = Math.max(1, paletteRef.current.length);

      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: 0,
          dy: 0,
          vx: 0,
          vy: 0,
          size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
          speedY:
            Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0],
          speedX: (Math.random() - 0.5) * 0.2,
          opacity:
            Math.random() * (opacityRange[1] - opacityRange[0]) +
            opacityRange[0],
          colorIndex: Math.floor(Math.random() * paletteSize),
        });
      }
      particlesRef.current = particles;
    }, []);

    // Mount once: start loop, handle resize and pointer
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      resizeCanvas();
      refreshPalette();
      createParticles();

      const observer = new MutationObserver(refreshPalette);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const { interactive, interactionRadius, interactionStrength } =
          configRef.current;
        const pointer = pointerRef.current;
        const usePointer = interactive && pointer.active && !reduceMotion;
        const radius = interactionRadius;
        const radiusSq = radius * radius;
        const palette = paletteRef.current;

        particlesRef.current.forEach((particle) => {
          if (!reduceMotion) {
            particle.y += particle.speedY;
            particle.x += particle.speedX;
          }

          if (particle.y > canvas.height + 10) {
            particle.y = -10;
            particle.x = Math.random() * canvas.width;
            particle.dx = particle.dy = particle.vx = particle.vy = 0;
          }
          if (particle.x < -10) particle.x = canvas.width + 10;
          if (particle.x > canvas.width + 10) particle.x = -10;

          if (usePointer) {
            const diffX = particle.x + particle.dx - pointer.x;
            const diffY = particle.y + particle.dy - pointer.y;
            const distSq = diffX * diffX + diffY * diffY;

            if (distSq < radiusSq && distSq > 0.01) {
              const dist = Math.sqrt(distSq);
              const falloff = 1 - dist / radius;
              const force = falloff * falloff * 2.2 * interactionStrength;
              particle.vx += (diffX / dist) * force;
              particle.vy += (diffY / dist) * force;
            }
          }

          particle.vx *= 0.9;
          particle.vy *= 0.9;
          particle.dx = (particle.dx + particle.vx) * 0.97;
          particle.dy = (particle.dy + particle.vy) * 0.97;

          ctx.beginPath();
          ctx.arc(
            particle.x + particle.dx,
            particle.y + particle.dy,
            particle.size,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle =
            palette[particle.colorIndex % palette.length] || "#fff";
          ctx.globalAlpha = particle.opacity;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      };

      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);
        if (document.hidden) return;
        draw();
      };

      if (reduceMotion) {
        draw();
      } else {
        animate();
      }

      const onPointerMove = (e: PointerEvent) => {
        pointerRef.current.x = e.clientX;
        pointerRef.current.y = e.clientY;
        pointerRef.current.active = true;
      };
      const onPointerLeave = () => {
        pointerRef.current.active = false;
      };
      const onPointerUp = (e: PointerEvent) => {
        if (e.pointerType === "touch") pointerRef.current.active = false;
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);

      const handleResize = () => {
        resizeCanvas();
        createParticles();
        if (reduceMotion) draw();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animationIdRef.current);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        document.documentElement.removeEventListener(
          "pointerleave",
          onPointerLeave,
        );
        observer.disconnect();
      };
    }, [count, colorKey, resizeCanvas, refreshPalette, createParticles]);

    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`fixed inset-0 z-0 pointer-events-none ${className}`}
        style={{ opacity: Math.min(1, Math.max(0, opacity)) }}
      />
    );
  },
);

Particles.displayName = "Particles";
export default Particles;
