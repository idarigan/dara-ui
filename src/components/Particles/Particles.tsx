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
   * Additional className
   */
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
}

// Stable defaults – never recreated across renders
const DEFAULT_COLORS = ["#7C5CFF", "#00D9FF", "#FF4D9D", "#ffffff"];
const DEFAULT_OPACITY: [number, number] = [0.15, 0.5];
const DEFAULT_SIZE: [number, number] = [0.5, 2.5];
const DEFAULT_SPEED: [number, number] = [0.1, 0.4];

/**
 * Dara UI Particles - Animated starfield/particle background
 *
 * Features:
 * - Configurable particle count, colors, sizes, and speeds
 * - Smooth floating animation
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
    className = "",
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationIdRef = useRef<number>(0);

    // Keep latest config in refs so resize can use them without effect churn
    const configRef = useRef({
      count,
      colors,
      opacityRange,
      sizeRange,
      speedRange,
    });
    configRef.current = { count, colors, opacityRange, sizeRange, speedRange };

    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }, []);

    const createParticles = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { count, colors, opacityRange, sizeRange, speedRange } =
        configRef.current;

      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
          speedY:
            Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0],
          speedX: (Math.random() - 0.5) * 0.2,
          opacity:
            Math.random() * (opacityRange[1] - opacityRange[0]) +
            opacityRange[0],
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      particlesRef.current = particles;
    }, []);

    // Mount once: start loop, handle resize. Only recreate when count changes.
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      resizeCanvas();
      createParticles();

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((particle) => {
          particle.y += particle.speedY;
          particle.x += particle.speedX;

          if (particle.y > canvas.height + 10) {
            particle.y = -10;
            particle.x = Math.random() * canvas.width;
          }
          if (particle.x < -10) particle.x = canvas.width + 10;
          if (particle.x > canvas.width + 10) particle.x = -10;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = particle.opacity;
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        animationIdRef.current = requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        resizeCanvas();
        createParticles();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animationIdRef.current);
        window.removeEventListener("resize", handleResize);
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
