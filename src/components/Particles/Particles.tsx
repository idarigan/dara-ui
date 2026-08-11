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

/**
 * Dara UI Particles - Animated starfield/particle background
 *
 * Features:
 * - Configurable particle count, colors, sizes, and speeds
 * - Smooth floating animation
 * - Theme-aware colors
 * - Used as a subtle background effect
 */
export const Particles: React.FC<ParticlesProps> = ({
  count = 60,
  colors = ["#7C5CFF", "#00D9FF", "#FF4D9D", "#ffffff"],
  opacityRange = [0.15, 0.5],
  sizeRange = [0.5, 2.5],
  speedRange = [0.1, 0.4],
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>();

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const createParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
        speedY: Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0],
        speedX: (Math.random() - 0.5) * 0.2,
        opacity:
          Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = particles;
  }, [count, colors, sizeRange, speedRange, opacityRange]);

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
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [resizeCanvas, createParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none ${className}`}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
};

Particles.displayName = "Particles";
export default Particles;
