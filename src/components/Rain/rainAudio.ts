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
   * How close and bright the rain sounds from 0 to 1
   */
  setPresence: (value: number) => void;
  /**
   * Master volume from 0 to 1
   */
  setVolume: (value: number) => void;
  /**
   * Plays a thunder strike, power sets how loud and how close it is
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
const BROWN_SECONDS = 12;
const TICK_MS = 50;
const FADE_OUT = 0.5;

// ============================================
// HELPERS
// ============================================

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const rand = (min: number, max: number) => min + Math.random() * (max - min);

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

const createImpulse = (ctx: AudioContext, seconds: number, decay: number) => {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
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

const createLfo = (ctx: AudioContext, frequency: number, target: AudioNode) => {
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = frequency;
  lfo.connect(target);
  lfo.start();
  return lfo;
};

// ============================================
// THUNDER VOICES
// ============================================

const playCrackle = (
  ctx: AudioContext,
  out: AudioNode,
  noise: AudioBuffer,
  when: number,
  power: number,
) => {
  const source = ctx.createBufferSource();
  source.buffer = noise;

  const high = createFilter(ctx, "highpass", 600);
  const sweep = createFilter(ctx, "lowpass", 8000);
  sweep.frequency.setValueAtTime(8000, when);
  sweep.frequency.exponentialRampToValueAtTime(900, when + 1.1);

  const peak = 0.4 + 0.6 * power;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(peak, when + 0.002);
  gain.gain.exponentialRampToValueAtTime(peak * 0.2, when + 0.09);

  let t = 0.09;
  while (t < 1.1) {
    const rise = t + 0.01 + Math.random() * 0.03;
    const level = peak * (0.15 + 0.5 * Math.random()) * (1 - t / 1.2);
    gain.gain.linearRampToValueAtTime(level, when + rise);
    const fall = rise + 0.03 + Math.random() * 0.08;
    gain.gain.linearRampToValueAtTime(level * 0.12, when + fall);
    t = fall;
  }
  gain.gain.linearRampToValueAtTime(0.0001, when + 1.4);

  source.connect(high);
  high.connect(sweep);
  sweep.connect(gain);
  gain.connect(out);
  source.start(when, Math.random() * (noise.duration - 1.6), 1.5);
};

const playRumble = (
  ctx: AudioContext,
  out: AudioNode,
  noise: AudioBuffer,
  when: number,
  power: number,
  distance: number,
  scale: number,
  level: number,
) => {
  const duration = (3.2 + 3 * power + 2.2 * distance) / scale;
  const peak = (0.9 + 1.8 * power) * level;
  const rise = 0.12 + distance * 0.5 + Math.random() * 0.15;

  const source = ctx.createBufferSource();
  source.buffer = noise;

  const low = createFilter(ctx, "lowpass", (420 - 220 * distance) * scale);
  low.frequency.setValueAtTime((420 - 220 * distance) * scale, when);
  low.frequency.exponentialRampToValueAtTime(50 * scale, when + duration);
  const high = createFilter(ctx, "highpass", 20 * scale);

  const roll = ctx.createGain();
  roll.gain.value = 0.85;
  createLfo(
    ctx,
    rand(5, 12),
    (() => {
      const depth = ctx.createGain();
      depth.gain.value = 0.15;
      depth.connect(roll.gain);
      return depth;
    })(),
  ).stop(when + duration + 0.1);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(peak, when + rise);

  let t = rise;
  while (t < duration * 0.7) {
    t += 0.18 + Math.random() * 0.55;
    const fade = Math.pow(Math.max(0, 1 - t / duration), 1.3);
    const next = peak * (0.25 + 0.9 * Math.random()) * fade;
    gain.gain.linearRampToValueAtTime(Math.max(next, 0.001), when + t);
  }
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  source.connect(low);
  low.connect(high);
  high.connect(roll);
  roll.connect(gain);
  gain.connect(out);
  source.start(
    when,
    Math.random() * Math.max(0, noise.duration - duration - 0.2),
    duration + 0.2,
  );
};

// ============================================
// ENGINE
// ============================================

/**
 * Dara UI rain audio - Synthesized rain and thunder, no audio files
 *
 * Features:
 * - Layered filtered noise for the rain wash, body, low patter and hiss
 * - Randomized stereo drop impacts in three sizes scaled by intensity
 * - Irregular gusts that breathe the rain volume
 * - Presence control that moves the rain from distant and soft to close and crisp
 * - Shared room reverb that gives rain and thunder a natural space
 * - Thunder with a ragged crackle and a long rolling rumble
 * - Thunder distance from power, far strikes arrive later, darker and wetter
 */
export const createRainAudio = (): RainAudio => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let wash: GainNode | null = null;
  let body: GainNode | null = null;
  let low: GainNode | null = null;
  let hiss: GainNode | null = null;
  let gustWash: GainNode | null = null;
  let gustBody: GainNode | null = null;
  let tone: BiquadFilterNode | null = null;
  let dropBus: GainNode | null = null;
  let reverbIn: GainNode | null = null;
  let white: AudioBuffer | null = null;
  let brown: AudioBuffer | null = null;
  let timer = 0;
  let intensity = 0.4;
  let presence = 0.5;
  let volume = 0.5;
  let destroyed = false;

  // ============================================
  // LEVELS
  // ============================================
  const applyLevels = () => {
    if (
      !ctx ||
      !wash ||
      !body ||
      !low ||
      !hiss ||
      !gustWash ||
      !gustBody ||
      !tone
    )
      return;

    const t = ctx.currentTime;
    const near = 0.25 + 0.75 * presence;
    const washLevel = (0.08 + 0.45 * intensity) * near;
    const bodyLevel = (0.04 + 0.28 * intensity) * near;

    wash.gain.setTargetAtTime(washLevel, t, 0.3);
    body.gain.setTargetAtTime(bodyLevel, t, 0.3);
    low.gain.setTargetAtTime(0.03 + 0.14 * intensity, t, 0.3);
    hiss.gain.setTargetAtTime((0.01 + 0.07 * intensity) * near, t, 0.3);
    gustWash.gain.setTargetAtTime(washLevel * 0.3, t, 0.3);
    gustBody.gain.setTargetAtTime(bodyLevel * 0.3, t, 0.3);
    tone.frequency.setTargetAtTime(2800 + 5200 * presence, t, 0.3);
  };

  const applyVolume = (smooth = 0.08) => {
    if (!ctx || !master) return;
    master.gain.setTargetAtTime(volume, ctx.currentTime, smooth);
  };

  // ============================================
  // DROPS
  // ============================================
  const scheduleDrop = (when: number) => {
    if (!ctx || !white || !dropBus) return;

    const roll = Math.random();
    const kind = roll < 0.72 ? 0 : roll < 0.95 ? 1 : 2;

    let freq: number;
    let q: number;
    let peak: number;
    let decay: number;

    if (kind === 0) {
      freq = rand(3000, 8500);
      q = rand(2, 7);
      peak = rand(0.03, 0.09);
      decay = rand(0.006, 0.02);
    } else if (kind === 1) {
      freq = rand(1400, 4000);
      q = rand(1.5, 4.5);
      peak = rand(0.06, 0.14);
      decay = rand(0.015, 0.045);
    } else {
      freq = rand(500, 1600);
      q = rand(1, 3);
      peak = rand(0.1, 0.2);
      decay = rand(0.04, 0.11);
    }

    const level = peak * (0.35 + 0.65 * intensity) * (0.4 + 0.6 * presence);

    const source = ctx.createBufferSource();
    source.buffer = white;

    const filter = createFilter(ctx, "bandpass", freq, q);
    if (kind === 2) {
      filter.frequency.setValueAtTime(freq * 1.4, when);
      filter.frequency.exponentialRampToValueAtTime(freq, when + decay);
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(level, when + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.002 + decay);

    source.connect(filter);
    filter.connect(gain);

    if (typeof ctx.createStereoPanner === "function") {
      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 2 - 1;
      gain.connect(pan);
      pan.connect(dropBus);
    } else {
      gain.connect(dropBus);
    }

    source.start(when, Math.random() * (white.duration - 0.2), 0.2);
  };

  const tick = () => {
    if (!ctx) return;

    if (ctx.state === "running") {
      const rate = (5 + 150 * intensity) * (0.55 + 0.45 * presence);
      const expected = rate * (TICK_MS / 1000);
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
    brown = createNoiseBuffer(c, BROWN_SECONDS, "brown");

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

    // ----- Room -----
    const convolver = c.createConvolver();
    convolver.buffer = createImpulse(c, 3.4, 2.4);
    const reverbTone = createFilter(c, "lowpass", 4200);
    const reverbOut = c.createGain();
    reverbOut.gain.value = 0.55;
    const reverbGate = c.createGain();
    reverbGate.gain.value = 1;
    reverbGate.connect(convolver);
    convolver.connect(reverbTone);
    reverbTone.connect(reverbOut);
    reverbOut.connect(out);

    // ----- Wash -----
    const toneFilter = createFilter(c, "lowpass", 6000);
    const washGain = c.createGain();
    washGain.gain.value = 0;
    createLoop(c, pink)
      .connect(createFilter(c, "highpass", 400))
      .connect(toneFilter)
      .connect(washGain);
    washGain.connect(out);
    const washSend = c.createGain();
    washSend.gain.value = 0.14;
    washGain.connect(washSend);
    washSend.connect(reverbGate);

    // ----- Body -----
    const bodyGain = c.createGain();
    bodyGain.gain.value = 0;
    createLoop(c, pink)
      .connect(createFilter(c, "bandpass", 1100, 0.45))
      .connect(bodyGain);
    bodyGain.connect(out);

    // ----- Low patter -----
    const lowGain = c.createGain();
    lowGain.gain.value = 0;
    createLoop(c, brown)
      .connect(createFilter(c, "bandpass", 160, 0.6))
      .connect(lowGain);
    lowGain.connect(out);

    // ----- Hiss -----
    const hissGain = c.createGain();
    hissGain.gain.value = 0;
    createLoop(c, pink)
      .connect(createFilter(c, "highpass", 5500))
      .connect(hissGain);
    hissGain.connect(out);

    // ----- Gusts -----
    const gustWashGain = c.createGain();
    gustWashGain.gain.value = 0;
    gustWashGain.connect(washGain.gain);
    createLfo(c, 0.09, gustWashGain);
    createLfo(c, 0.21, gustWashGain);

    const gustBodyGain = c.createGain();
    gustBodyGain.gain.value = 0;
    gustBodyGain.connect(bodyGain.gain);
    createLfo(c, 0.15, gustBodyGain);

    // ----- Drops -----
    const dropGain = c.createGain();
    dropGain.gain.value = 1;
    dropGain.connect(out);
    const dropSend = c.createGain();
    dropSend.gain.value = 0.16;
    dropGain.connect(dropSend);
    dropSend.connect(reverbGate);

    master = out;
    wash = washGain;
    body = bodyGain;
    low = lowGain;
    hiss = hissGain;
    gustWash = gustWashGain;
    gustBody = gustBodyGain;
    tone = toneFilter;
    dropBus = dropGain;
    reverbIn = reverbGate;
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
      applyLevels();
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
    if (!ctx || !master || !white || !brown || !reverbIn) return;
    if (ctx.state !== "running") return;

    const c = ctx;
    const p = clamp(power, 0, 1);
    const distance = 1 - p;
    const when = c.currentTime + 0.02 + distance * 1.2;

    const bus = c.createGain();
    bus.gain.value = 0.45 + 0.55 * p;
    const air = createFilter(c, "lowpass", 9000 - distance * 6500, 0.5);
    const wet = c.createGain();
    wet.gain.value = 0.25 + 0.6 * distance;

    bus.connect(air);
    air.connect(master);
    air.connect(wet);
    wet.connect(reverbIn);

    if (distance < 0.6) playCrackle(c, bus, white, when, p);
    playRumble(c, bus, brown, when, p, distance, 1, 1);
    playRumble(c, bus, brown, when, p, distance, 2, 0.45);

    window.setTimeout(
      () => {
        bus.disconnect();
        air.disconnect();
        wet.disconnect();
      },
      (when - c.currentTime + 12) * 1000,
    );
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
    low = null;
    hiss = null;
    gustWash = null;
    gustBody = null;
    tone = null;
    dropBus = null;
    reverbIn = null;
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
      applyLevels();
    },
    setPresence: (value) => {
      presence = clamp(value, 0, 1);
      applyLevels();
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
