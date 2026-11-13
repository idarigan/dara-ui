// ============================================
// TYPES
// ============================================

export interface RainAudio {
  /**
   * Starts playback, resolves true once the audio context is running
   */
  start: () => Promise<boolean>;
  /**
   * Suspends the audio context
   */
  pause: () => void;
  /**
   * Resumes a suspended audio context
   */
  resume: () => void;
  /**
   * Rain density from 0 to 1
   */
  setIntensity: (value: number) => void;
  /**
   * Master volume from 0 to 1
   */
  setVolume: (value: number) => void;
  /**
   * Plays a thunder strike starting right now
   */
  thunder: (power?: number) => void;
  /**
   * Whether the audio context is currently running
   */
  isRunning: () => boolean;
  /**
   * Fades out and releases all audio resources
   */
  destroy: () => void;
}

type ContextConstructor = typeof AudioContext;
type NoiseKind = "white" | "pink" | "brown";

// ============================================
// CONSTANTS
// ============================================

const NOISE_SECONDS = 6;
const WHITE_SECONDS = 2;
const TICK_MS = 60;
const FADE_OUT = 0.5;

// ============================================
// HELPERS
// ============================================

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getContextConstructor = (): ContextConstructor | null => {
  const w = window as unknown as {
    AudioContext?: ContextConstructor;
    webkitAudioContext?: ContextConstructor;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
};

const fillNoise = (data: Float32Array, kind: NoiseKind) => {
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  let last = 0;

  for (let i = 0; i < data.length; i++) {
    const w = Math.random() * 2 - 1;

    if (kind === "white") {
      data[i] = w;
    } else if (kind === "pink") {
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    } else {
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.5;
    }
  }
};

const createNoiseBuffer = (
  ctx: AudioContext,
  seconds: number,
  kind: NoiseKind,
) => {
  const buffer = ctx.createBuffer(
    2,
    Math.floor(ctx.sampleRate * seconds),
    ctx.sampleRate,
  );
  for (let channel = 0; channel < 2; channel++) {
    fillNoise(buffer.getChannelData(channel), kind);
  }
  return buffer;
};

const createLoop = (ctx: AudioContext, buffer: AudioBuffer) => {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.start(0, Math.random() * buffer.duration);
  return source;
};

const createFilter = (
  ctx: AudioContext,
  type: BiquadFilterType,
  frequency: number,
  q = 0.707,
) => {
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = q;
  return filter;
};

// ============================================
// THUNDER VOICES
// ============================================

const playCrack = (
  ctx: AudioContext,
  out: AudioNode,
  noise: AudioBuffer,
  when: number,
  power: number,
) => {
  const source = ctx.createBufferSource();
  source.buffer = noise;

  const high = createFilter(ctx, "highpass", 900);
  const low = createFilter(ctx, "lowpass", 9000);
  low.frequency.setValueAtTime(9000, when);
  low.frequency.exponentialRampToValueAtTime(1800, when + 0.2);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(power * 0.9, when + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.22);

  source.connect(high);
  high.connect(low);
  low.connect(gain);
  gain.connect(out);
  source.start(when, Math.random() * (noise.duration - 0.5), 0.3);
};

const playBoom = (
  ctx: AudioContext,
  out: AudioNode,
  when: number,
  power: number,
) => {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(110, when);
  osc.frequency.exponentialRampToValueAtTime(38, when + 0.45);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(power * 0.9, when + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.6);

  osc.connect(gain);
  gain.connect(out);
  osc.start(when);
  osc.stop(when + 0.7);
};

const playRumble = (
  ctx: AudioContext,
  out: AudioNode,
  noise: AudioBuffer,
  when: number,
  power: number,
) => {
  const duration = 2.6 + 2.4 * power;

  const source = ctx.createBufferSource();
  source.buffer = noise;

  const low = createFilter(ctx, "lowpass", 520);
  low.frequency.setValueAtTime(520, when);
  low.frequency.exponentialRampToValueAtTime(60, when + duration);
  const high = createFilter(ctx, "highpass", 25);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(power * 2.6, when + 0.12);

  let time = 0.12;
  while (time < duration * 0.75) {
    time += 0.25 + Math.random() * 0.5;
    const level = power * (0.9 + Math.random() * 1.6) * (1 - time / duration);
    gain.gain.linearRampToValueAtTime(Math.max(level, 0.001), when + time);
  }
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  source.connect(low);
  low.connect(high);
  high.connect(gain);
  gain.connect(out);
  source.start(
    when,
    Math.random() * Math.max(0, noise.duration - duration - 0.1),
    duration + 0.1,
  );
};

// ============================================
// ENGINE
// ============================================

/**
 * Dara UI rain audio - Synthesized rain and thunder, no audio files
 *
 * Features:
 * - Layered filtered noise for the rain wash, body and hiss
 * - Randomized stereo drop ticks scaled by intensity
 * - Slow gusts that breathe the rain volume
 * - Thunder with a crack, a boom and a rolling rumble
 * - Thunder starts the moment it is called, so it can be locked to a flash
 */
export const createRainAudio = (): RainAudio => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let wash: GainNode | null = null;
  let body: GainNode | null = null;
  let hiss: GainNode | null = null;
  let gust: GainNode | null = null;
  let white: AudioBuffer | null = null;
  let brown: AudioBuffer | null = null;
  let timer = 0;
  let intensity = 0.4;
  let volume = 0.5;
  let destroyed = false;

  // ============================================
  // LEVELS
  // ============================================
  const applyIntensity = () => {
    if (!ctx || !wash || !body || !hiss || !gust) return;
    const t = ctx.currentTime;
    wash.gain.setTargetAtTime(0.1 + 0.5 * intensity, t, 0.3);
    body.gain.setTargetAtTime(0.05 + 0.3 * intensity, t, 0.3);
    hiss.gain.setTargetAtTime(0.01 + 0.07 * intensity, t, 0.3);
    gust.gain.setTargetAtTime(0.02 + 0.06 * intensity, t, 0.3);
  };

  const applyVolume = (smooth = 0.08) => {
    if (!ctx || !master) return;
    master.gain.setTargetAtTime(volume, ctx.currentTime, smooth);
  };

  // ============================================
  // DROPS
  // ============================================
  const scheduleDrop = (when: number) => {
    if (!ctx || !master || !white) return;

    const source = ctx.createBufferSource();
    source.buffer = white;

    const filter = createFilter(
      ctx,
      "bandpass",
      1800 + Math.random() * 5200,
      3 + Math.random() * 7,
    );

    const peak = (0.03 + Math.random() * 0.12) * (0.4 + intensity * 0.6);
    const decay = 0.012 + Math.random() * 0.03;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(peak, when + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.002 + decay);

    source.connect(filter);
    filter.connect(gain);

    if (typeof ctx.createStereoPanner === "function") {
      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 2 - 1;
      gain.connect(pan);
      pan.connect(master);
    } else {
      gain.connect(master);
    }

    source.start(when, Math.random() * (white.duration - 0.1), 0.05);
  };

  const tick = () => {
    if (!ctx) return;

    if (ctx.state === "running") {
      const expected = (6 + 80 * intensity) * (TICK_MS / 1000);
      let count = Math.floor(expected);
      if (Math.random() < expected - count) count++;

      for (let i = 0; i < count; i++) {
        scheduleDrop(ctx.currentTime + (Math.random() * TICK_MS) / 1000);
      }
    }

    timer = window.setTimeout(tick, TICK_MS);
  };

  // ============================================
  // GRAPH
  // ============================================
  const build = (c: AudioContext) => {
    const pink = createNoiseBuffer(c, NOISE_SECONDS, "pink");
    white = createNoiseBuffer(c, WHITE_SECONDS, "white");
    brown = createNoiseBuffer(c, NOISE_SECONDS, "brown");

    const out = c.createGain();
    out.gain.value = 0;
    const compressor = c.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 24;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.3;
    out.connect(compressor);
    compressor.connect(c.destination);

    const washGain = c.createGain();
    washGain.gain.value = 0;
    const washLoop = createLoop(c, pink);
    washLoop
      .connect(createFilter(c, "highpass", 500))
      .connect(createFilter(c, "lowpass", 7000))
      .connect(washGain);
    washGain.connect(out);

    const bodyGain = c.createGain();
    bodyGain.gain.value = 0;
    createLoop(c, pink)
      .connect(createFilter(c, "bandpass", 900, 0.5))
      .connect(bodyGain);
    bodyGain.connect(out);

    const hissGain = c.createGain();
    hissGain.gain.value = 0;
    createLoop(c, pink)
      .connect(createFilter(c, "highpass", 4500))
      .connect(hissGain);
    hissGain.connect(out);

    const lfo = c.createOscillator();
    lfo.frequency.value = 0.13;
    const gustGain = c.createGain();
    gustGain.gain.value = 0;
    lfo.connect(gustGain);
    gustGain.connect(washGain.gain);
    lfo.start();

    master = out;
    wash = washGain;
    body = bodyGain;
    hiss = hissGain;
    gust = gustGain;
  };

  // ============================================
  // CONTROLS
  // ============================================
  const start = async () => {
    if (destroyed) return false;

    if (!ctx) {
      const Constructor = getContextConstructor();
      if (!Constructor) return false;

      const created = new Constructor();
      ctx = created;
      build(created);
      applyIntensity();
      applyVolume(0.5);
      tick();
    }

    const c = ctx;
    if (c.state === "suspended") {
      try {
        await c.resume();
      } catch {
        return false;
      }
    }

    return c.state === "running";
  };

  const pause = () => {
    if (ctx && ctx.state === "running") void ctx.suspend().catch(() => {});
  };

  const resume = () => {
    if (ctx && ctx.state === "suspended") void ctx.resume().catch(() => {});
  };

  const thunder = (power = 1) => {
    if (!ctx || !master || !white || !brown || ctx.state !== "running") return;

    const p = clamp(power, 0, 1);
    const when = ctx.currentTime + 0.01;

    playCrack(ctx, master, white, when, p);
    playCrack(ctx, master, white, when + 0.13, p * 0.55);
    playBoom(ctx, master, when, p);
    playRumble(ctx, master, brown, when, p);
  };

  const destroy = () => {
    destroyed = true;
    window.clearTimeout(timer);

    const c = ctx;
    const m = master;
    ctx = null;
    master = null;
    wash = null;
    body = null;
    hiss = null;
    gust = null;
    if (!c || !m) return;

    m.gain.cancelScheduledValues(c.currentTime);
    m.gain.setTargetAtTime(0, c.currentTime, FADE_OUT / 4);
    window.setTimeout(
      () => {
        void c.close().catch(() => {});
      },
      FADE_OUT * 1000 + 100,
    );
  };

  return {
    start,
    pause,
    resume,
    setIntensity: (value) => {
      intensity = clamp(value, 0, 1);
      applyIntensity();
    },
    setVolume: (value) => {
      volume = clamp(value, 0, 1);
      applyVolume();
    },
    thunder,
    isRunning: () => ctx?.state === "running",
    destroy,
  };
};
