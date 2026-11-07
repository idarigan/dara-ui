import React, { useEffect, useRef, useCallback } from "react";

export interface ParticlesProps {
  /**
   * Number of particles
   * @default 60
   */
  count?: number;
  /**
   * Colors for particles
   * @default ["#7C5CFF", "#00D9FF", "#FF4D9D", "#ffffff"]
   */
  colors?: string[];
  /**
   * Opacity range [min, max]
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
  color: string;
}

// Stable defaults
const DEFAULT_COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent)",
  "#ffffff",
];
const DEFAULT_OPACITY: [number, number] = [0.15, 0.5];
const DEFAULT_SIZE: [number, number] = [0.5, 2.5];
const DEFAULT_SPEED: [number, number] = [0.1, 0.4];

/**
 * Dara UI Particles - Animated starfield/particle background
 *
 * Features:
 * - Configurable particle count, colors, sizes, and speeds
 * - Smooth floating animation
 * - Optional mouse interaction with a single cheap distance check per particle
 * - Pauses while the tab is hidden and respects reduced motion
 * - Particles are created once (and on resize / count change only)
 * - Safe under frequent parent re-renders (e.g. controlled Range)
 */
export const Particles: React.FC<ParticlesProps> = React.memo(
  ({
    count = 60,
    colors = DEFAULT_COLORS,
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
    const animationIdRef = useRef<number>(0);
    const pointerRef = useRef({ x: -9999, y: -9999, active: false });

    // Keep latest config in refs so resize can use them without effect churn
    const configRef = useRef({
      count,
      colors,
      opacityRange,
      sizeRange,
      speedRange,
      interactive,
      interactionRadius,
      interactionStrength,
    });
    configRef.current = {
      count,
      colors,
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

    // Resolve CSS custom properties to concrete rgb strings once
    const resolveColors = useCallback((): string[] => {
      if (typeof window === "undefined") return configRef.current.colors;
      const root = document.documentElement;
      return configRef.current.colors.map((c) => {
        const trimmed = c.trim();
        if (trimmed.startsWith("var(")) {
          const varName = trimmed.slice(4, -1).trim();
          const resolved = getComputedStyle(root)
            .getPropertyValue(varName)
            .trim();
          return resolved || "#ffffff";
        }
        return trimmed;
      });
    }, []);

    const createParticles = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { count, opacityRange, sizeRange, speedRange } = configRef.current;
      const resolvedColors = resolveColors();

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
          color:
            resolvedColors[Math.floor(Math.random() * resolvedColors.length)],
        });
      }
      particlesRef.current = particles;
    }, [resolveColors]);

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
      createParticles();

      const onThemeChange = () => createParticles();
      const observer = new MutationObserver(onThemeChange);
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
          ctx.fillStyle = particle.color;
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
    }, [count, resizeCanvas, createParticles]);

    return (
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 z-0 pointer-events-none ${className}`}
      />
    );
  },
);

Particles.displayName = "Particles";
export default Particles;
