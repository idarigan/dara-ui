import React, { useEffect, useRef } from "react";
import {
  backgroundLayerStyle,
  backgroundCanvasStyle,
} from "../shared/backgroundLayer";
import { createRainAudio } from "./rainAudio";
import type { RainAudio } from "./rainAudio";

export interface RainProps {
  /**
   * Number of raindrops
   * @default 140
   */
  count?: number;
  /**
   * Rain color (any CSS color or a CSS variable)
   * @default "var(--color-secondary)"
   */
  color?: string;
  /**
   * Opacity of the whole layer (0-1)
   * @default 0.5
   */
  opacity?: number;
  /**
   * Random lightning strikes with a screen flash
   * @default false
   */
  lightning?: boolean;
  /**
   * Synthesized rain sound, thunder joins in whenever lightning is on
   * Starts after the first user interaction when the browser requires it
   * @default false
   */
  sound?: boolean;
  /**
   * Sound volume (0-1)
   * @default 0.5
   */
  volume?: number;
  /**
   * Raindrops are pushed away by the mouse pointer
   * @default true
   */
  interactive?: boolean;
  /**
   * Pointer influence radius in pixels
   * @default 120
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

interface Drop {
  x: number;
  y: number;
  len: number;
  speed: number;
  layer: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
}

interface Point {
  x: number;
  y: number;
}

interface Bolt {
  paths: Point[][];
  age: number;
}

// ============================================
// CONSTANTS
// ============================================

const ANGLE = (20 * Math.PI) / 180;
const SIN = Math.sin(ANGLE);
const COS = Math.cos(ANGLE);
const TAN = Math.tan(ANGLE);
const MAX_RATIO = 1.5;
const BOLT_LIFE = 0.6;

const LAYERS: {
  width: number;
  alpha: number;
  length: [number, number];
  speed: [number, number];
}[] = [
  { width: 0.7, alpha: 0.28, length: [8, 14], speed: [700, 900] },
  { width: 1, alpha: 0.5, length: [12, 20], speed: [950, 1200] },
  { width: 1.5, alpha: 0.8, length: [18, 28], speed: [1250, 1600] },
];

// ============================================
// HELPERS
// ============================================

const rand = (range: [number, number]) =>
  range[0] + Math.random() * (range[1] - range[0]);

const toIntensity = (count: number) => Math.min(1, Math.max(0.1, count / 500));

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

// Parses any CSS color through a 1x1 canvas
const parseColor = (
  probe: CanvasRenderingContext2D | null,
  value: string,
): number[] => {
  if (!probe) return [124, 92, 255];
  probe.fillStyle = "#7c5cff";
  probe.fillStyle = resolveToken(value);
  const out = probe.fillStyle as string;

  if (out.startsWith("#")) {
    return [
      parseInt(out.slice(1, 3), 16),
      parseInt(out.slice(3, 5), 16),
      parseInt(out.slice(5, 7), 16),
    ];
  }

  const parts = out.match(/[\d.]+/g);
  return parts ? parts.slice(0, 3).map(Number) : [124, 92, 255];
};

const spawnX = (width: number, height: number, dir: 1 | -1) => {
  const span = height * TAN;
  return Math.random() * (width + span) - (dir === 1 ? span : 0);
};

const createDrop = (
  width: number,
  height: number,
  dir: 1 | -1,
  scatter: boolean,
): Drop => {
  const r = Math.random();
  const layer = r < 0.45 ? 0 : r < 0.85 ? 1 : 2;
  const config = LAYERS[layer];
  const len = rand(config.length);
  const y = scatter ? Math.random() * (height + len) - len : -len;
  const x =
    spawnX(width, height, dir) + (scatter ? dir * Math.max(0, y) * TAN : 0);

  return {
    x,
    y,
    len,
    speed: rand(config.speed),
    layer,
    ox: 0,
    oy: 0,
    vx: 0,
    vy: 0,
  };
};

const buildBolt = (width: number, height: number): Bolt => {
  let x = width * (0.1 + Math.random() * 0.8);
  let y = 0;
  const endY = height * (0.5 + Math.random() * 0.4);
  const main: Point[] = [{ x, y }];
  const paths: Point[][] = [main];

  while (y < endY) {
    y += 16 + Math.random() * 28;
    x += (Math.random() - 0.5) * 70;
    main.push({ x, y });

    if (Math.random() < 0.16) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const steps = 3 + Math.floor(Math.random() * 4);
      const branch: Point[] = [{ x, y }];
      let bx = x;
      let by = y;

      for (let i = 0; i < steps; i++) {
        bx += side * (10 + Math.random() * 28);
        by += 8 + Math.random() * 22;
        branch.push({ x: bx, y: by });
      }
      paths.push(branch);
    }
  }

  return { paths, age: 0 };
};

const flashLevel = (age: number) => {
  if (age < 0.07) return 1;
  if (age < 0.13) return 0.2;
  if (age < 0.22) return 0.95;
  return Math.max(0, 1 - (age - 0.22) / 0.38);
};

/**
 * Dara UI Rain - Animated rain storm background
 *
 * Features:
 * - Constant slant of 20 degrees that mirrors with the document direction
 * - Endless drops recycled at the top, three depth layers
 * - Optional lightning with a jagged bolt and a screen flash
 * - Optional synthesized rain sound, with thunder locked to each lightning flash
 * - Optional mouse interaction that pushes drops away from the pointer
 * - Layer opacity control and theme-aware color
 * - Pauses while the tab is hidden and respects reduced motion
 * - Sized by its own fixed box, so it can never stretch the page
 */
export const Rain: React.FC<RainProps> = React.memo(
  ({
    count = 140,
    color = "var(--color-secondary)",
    opacity = 0.5,
    lightning = false,
    sound = false,
    volume = 0.5,
    interactive = true,
    interactionRadius = 120,
    interactionStrength = 1,
    className = "",
  }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<RainAudio | null>(null);

    // Keep latest config in a ref so the render loop never restarts
    const cfg = useRef({
      color,
      lightning,
      interactive,
      interactionRadius,
      interactionStrength,
    });
    cfg.current = {
      color,
      lightning,
      interactive,
      interactionRadius,
      interactionStrength,
    };

    useEffect(() => {
      const wrapper = wrapperRef.current;
      const canvas = canvasRef.current;
      if (!wrapper || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const probe = document.createElement("canvas");
      probe.width = 1;
      probe.height = 1;
      const probeCtx = probe.getContext("2d", { willReadFrequently: true });

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const view = { width: 1, height: 1, ratio: 1 };
      const pointer = { x: -9999, y: -9999, active: false };
      const readDir = (): 1 | -1 =>
        document.documentElement.dir === "rtl" ? -1 : 1;
      const st = {
        dir: readDir(),
        clock: 0,
        nextStrike: 2.5 + Math.random() * 3,
        bolt: null as Bolt | null,
      };
      const theme = {
        rgb: [124, 92, 255],
        css: "rgb(124,92,255)",
        light: false,
      };

      let drops: Drop[][] = [[], [], []];
      let lastColor = "";

      // ============================================
      // THEME
      // ============================================
      const readTheme = () => {
        const c = cfg.current;
        const rgb = parseColor(probeCtx, c.color);
        const bg = parseColor(probeCtx, "var(--color-bg-primary)");
        theme.rgb = rgb;
        theme.css = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        theme.light = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2] > 150;
        lastColor = c.color;
      };
      readTheme();

      // ============================================
      // DROPS
      // ============================================
      const seed = () => {
        drops = [[], [], []];
        for (let i = 0; i < count; i++) {
          const drop = createDrop(view.width, view.height, st.dir, true);
          drops[drop.layer].push(drop);
        }
      };

      const attributeObserver = new MutationObserver(() => {
        readTheme();
        const dir = readDir();
        if (dir !== st.dir) {
          st.dir = dir;
          seed();
        }
      });
      attributeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "dir"],
      });

      // ============================================
      // DRAW
      // ============================================
      const drawLightning = (bolt: Bolt) => {
        const level = flashLevel(bolt.age);
        if (level <= 0) return;

        const [r, g, b] = theme.rgb;
        ctx.fillStyle = `rgba(${r},${g},${b},${level * (theme.light ? 0.1 : 0.12)})`;
        ctx.fillRect(0, 0, view.width, view.height);

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.shadowColor = theme.css;
        ctx.shadowBlur = 24 * level;
        ctx.strokeStyle = theme.css;
        ctx.globalAlpha = 0.55 * level;
        ctx.lineWidth = 5;
        bolt.paths.forEach((path) => {
          ctx.beginPath();
          path.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        });

        ctx.shadowBlur = 0;
        ctx.strokeStyle = theme.light ? theme.css : "#ffffff";
        ctx.globalAlpha = level;
        ctx.lineWidth = 1.6;
        bolt.paths.forEach((path) => {
          ctx.beginPath();
          path.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        });

        ctx.globalAlpha = 1;
      };

      const draw = (dt: number) => {
        const c = cfg.current;
        const { width, height } = view;
        ctx.clearRect(0, 0, width, height);

        const k = dt * 60;
        const usePointer = c.interactive && pointer.active && !reduce;
        const radius = c.interactionRadius;
        const radiusSq = radius * radius;
        const decay = Math.pow(0.9, k);
        const settle = Math.pow(0.95, k);

        ctx.lineCap = "round";
        ctx.strokeStyle = theme.css;

        for (let l = 0; l < LAYERS.length; l++) {
          const layer = LAYERS[l];
          ctx.globalAlpha = layer.alpha;
          ctx.lineWidth = layer.width;
          ctx.beginPath();

          for (const drop of drops[l]) {
            if (!reduce) {
              const step = drop.speed * dt;
              drop.x += st.dir * SIN * step;
              drop.y += COS * step;
            }

            if (drop.y - COS * drop.len > height) {
              drop.x = spawnX(width, height, st.dir);
              drop.y = -drop.len - Math.random() * 40;
              drop.ox = drop.oy = drop.vx = drop.vy = 0;
            }

            if (usePointer) {
              const diffX = drop.x + drop.ox - pointer.x;
              const diffY = drop.y + drop.oy - pointer.y;
              const distSq = diffX * diffX + diffY * diffY;

              if (distSq < radiusSq && distSq > 0.01) {
                const dist = Math.sqrt(distSq);
                const falloff = 1 - dist / radius;
                const force =
                  falloff * falloff * 3.2 * c.interactionStrength * k;
                drop.vx += (diffX / dist) * force;
                drop.vy += (diffY / dist) * force * 0.35;
              }
            }

            drop.vx *= decay;
            drop.vy *= decay;
            drop.ox = (drop.ox + drop.vx) * settle;
            drop.oy = (drop.oy + drop.vy) * settle;

            const headX = drop.x + drop.ox;
            const headY = drop.y + drop.oy;
            ctx.moveTo(headX - st.dir * SIN * drop.len, headY - COS * drop.len);
            ctx.lineTo(headX, headY);
          }

          ctx.stroke();
        }

        ctx.globalAlpha = 1;

        if (c.lightning && !reduce) {
          st.clock += dt;

          if (!st.bolt && st.clock >= st.nextStrike) {
            st.bolt = buildBolt(width, height);
            audioRef.current?.thunder(0.6 + Math.random() * 0.4);
          }

          if (st.bolt) {
            st.bolt.age += dt;
            if (st.bolt.age > BOLT_LIFE) {
              st.bolt = null;
              st.nextStrike = st.clock + 3 + Math.random() * 7;
            } else {
              drawLightning(st.bolt);
            }
          }
        } else {
          st.bolt = null;
        }
      };

      // ============================================
      // LOOP
      // ============================================
      let raf = 0;
      let lastTime = 0;

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);

        if (document.hidden) {
          lastTime = 0;
          return;
        }

        const dt = lastTime
          ? Math.min(0.05, Math.max(0, (now - lastTime) / 1000))
          : 1 / 60;
        lastTime = now;

        if (cfg.current.color !== lastColor) readTheme();
        draw(dt);
      };

      // ============================================
      // EVENTS
      // ============================================
      const resize = () => {
        const width = Math.max(1, wrapper.clientWidth);
        const height = Math.max(1, wrapper.clientHeight);
        const ratio = Math.min(window.devicePixelRatio || 1, MAX_RATIO);
        const widthChanged = width !== view.width;

        view.width = width;
        view.height = height;
        view.ratio = ratio;

        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        if (widthChanged) seed();
        if (reduce) draw(0);
      };

      const onPointerMove = (e: PointerEvent) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
      };
      const onPointerLeave = () => {
        pointer.active = false;
      };
      const onPointerUp = (e: PointerEvent) => {
        if (e.pointerType === "touch") pointer.active = false;
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(wrapper);

      resize();
      if (!reduce) raf = requestAnimationFrame(frame);

      return () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        attributeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        document.documentElement.removeEventListener(
          "pointerleave",
          onPointerLeave,
        );
      };
    }, [count]);

    // ============================================
    // SOUND
    // ============================================
    useEffect(() => {
      if (!sound) return;

      const audio = createRainAudio();
      audio.setIntensity(toIntensity(count));
      audio.setVolume(volume);
      audioRef.current = audio;

      const gestures = ["pointerdown", "keydown", "touchstart"] as const;
      const unlock = () => {
        void audio.start().then((running) => {
          if (!running) return;
          gestures.forEach((name) => window.removeEventListener(name, unlock));
        });
      };

      if (navigator.userActivation?.hasBeenActive) unlock();
      gestures.forEach((name) =>
        window.addEventListener(name, unlock, { passive: true }),
      );

      const onVisibility = () => {
        if (document.hidden) audio.pause();
        else audio.resume();
      };
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        audioRef.current = null;
        gestures.forEach((name) => window.removeEventListener(name, unlock));
        document.removeEventListener("visibilitychange", onVisibility);
        audio.destroy();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sound]);

    useEffect(() => {
      audioRef.current?.setIntensity(toIntensity(count));
    }, [count, sound]);

    useEffect(() => {
      audioRef.current?.setVolume(volume);
    }, [volume, sound]);

    return (
      <div
        ref={wrapperRef}
        aria-hidden="true"
        className={className}
        style={{
          ...backgroundLayerStyle,
          zIndex: 0,
          opacity: Math.min(1, Math.max(0, opacity)),
        }}
      >
        <canvas ref={canvasRef} style={backgroundCanvasStyle} />
      </div>
    );
  },
);

Rain.displayName = "Rain";
export default Rain;
