// ============================================
// GLOW LAYER
// ============================================

const ROOT_ATTR = "data-dara-glow";
const LAYER_ATTR = "data-dara-glow-layer";
const DEFAULT_Z_INDEX = "2147483000";
const IDLE_FRAMES = 30;
const VIEWPORT_MARGIN = 240;
const FALLBACK_EXTENT = 120;

export const GLOW_SELECTOR = [
  "[data-glow-lift]",
  '[data-glow="true"]',
  ".glow-primary",
  ".glow-secondary",
  ".glow-accent",
  ".float-card",
  ".xp-bar-fill",
  '[class*="shadow-[var(--shadow-glow-"]',
  '[class*="shadow-[var(--shadow-btn-"]',
  '[class*="shadow-[0_0_50px_color-mix("]',
].join(", ");

const WAKE_EVENTS = [
  "scroll",
  "pointerover",
  "pointerout",
  "pointerdown",
  "pointerup",
  "focusin",
  "focusout",
  "input",
  "change",
  "load",
  "transitionrun",
  "transitionend",
  "transitioncancel",
  "animationstart",
  "animationiteration",
  "animationend",
] as const;

// ============================================
// STATE
// ============================================

interface Applied {
  visible: boolean;
  transform: string;
  width: string;
  height: string;
  radius: string;
  shadow: string;
  opacity: string;
  clip: string;
}

interface GlowEntry {
  el: HTMLElement;
  halo: HTMLDivElement | null;
  clippers: HTMLElement[];
  epoch: number;
  applied: Applied;
}

interface Region {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const entries = new Map<HTMLElement, GlowEntry>();
const halos = new WeakSet<Node>();

let users = 0;
let layer: HTMLDivElement | null = null;
let mutations: MutationObserver | null = null;
let rootMutations: MutationObserver | null = null;
let resizes: ResizeObserver | null = null;
let frame = 0;
let idle = 0;
let epoch = 0;

const noop = () => {};

// ============================================
// SHADOW PARSING
// ============================================

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function toNumber(value: string): number {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 1 : parsed;
}

function splitLayers(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === "," && depth === 0) {
      parts.push(value.slice(start, i));
      start = i + 1;
    }
  }

  parts.push(value.slice(start));
  return parts;
}

function flatten(value: string): string {
  let depth = 0;
  let out = "";

  for (const char of value) {
    if (char === "(") {
      if (depth === 0) out += "_";
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (depth === 0) {
      out += char;
    }
  }

  return out;
}

function shadowExtent(halo: HTMLElement): number {
  const value = getComputedStyle(halo).boxShadow;
  if (!value || value === "none") return 0;

  let extent = 0;

  splitLayers(value).forEach((part) => {
    if (/\binset\b/.test(part)) return;

    const lengths = (flatten(part).match(/-?\d*\.?\d+px/g) || []).map(
      parseFloat,
    );

    if (lengths.length < 2) {
      extent = Math.max(extent, FALLBACK_EXTENT);
      return;
    }

    const [x, y, blur = 0, spread = 0] = lengths;
    extent = Math.max(
      extent,
      Math.max(Math.abs(x), Math.abs(y)) + blur + spread,
    );
  });

  return Math.ceil(extent);
}

// ============================================
// ELEMENT SOURCES
// ============================================

function readShadow(el: HTMLElement, style: CSSStyleDeclaration): string {
  const inline = el.style.getPropertyValue("box-shadow").trim();
  if (inline && inline !== "none") return inline;

  const sourced = style.getPropertyValue("--glow-shadow").trim();
  return sourced && sourced !== "none" ? sourced : "";
}

function effectiveOpacity(el: HTMLElement, style: CSSStyleDeclaration): number {
  let value = toNumber(style.opacity);

  for (
    let node = el.parentElement;
    node && value > 0;
    node = node.parentElement
  ) {
    value *= toNumber(getComputedStyle(node).opacity);
  }

  return value;
}

function collectClippers(el: HTMLElement): HTMLElement[] {
  const list: HTMLElement[] = [];
  if (getComputedStyle(el).position === "fixed") return list;

  for (
    let node = el.parentElement;
    node && node !== document.body && node !== document.documentElement;
    node = node.parentElement
  ) {
    const style = getComputedStyle(node);
    if (style.display === "contents") continue;

    if (style.overflowX !== "visible" || style.overflowY !== "visible") {
      list.push(node);
    }

    if (style.position === "fixed") break;
  }

  return list;
}

function visibleRegion(clippers: HTMLElement[], rect: DOMRect): Region | null {
  const region: Region = {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
  };

  for (const clipper of clippers) {
    const box = clipper.getBoundingClientRect();
    region.left = Math.max(region.left, box.left);
    region.top = Math.max(region.top, box.top);
    region.right = Math.min(region.right, box.right);
    region.bottom = Math.min(region.bottom, box.bottom);
  }

  if (region.right - region.left < 1 || region.bottom - region.top < 1) {
    return null;
  }

  return region;
}

// ============================================
// HALOS
// ============================================

function blankApplied(): Applied {
  return {
    visible: false,
    transform: "",
    width: "",
    height: "",
    radius: "",
    shadow: "",
    opacity: "",
    clip: "",
  };
}

function createHalo(entry: GlowEntry): HTMLDivElement {
  const halo = document.createElement("div");
  halo.setAttribute("aria-hidden", "true");

  Object.assign(halo.style, {
    position: "absolute",
    top: "0",
    left: "0",
    display: "none",
    pointerEvents: "none",
    boxSizing: "border-box",
    background: "transparent",
    transition: "box-shadow 0.4s ease, border-radius 0.2s ease",
  });

  layer?.appendChild(halo);
  halos.add(halo);
  entry.halo = halo;
  return halo;
}

function hide(entry: GlowEntry): boolean {
  if (!entry.halo || !entry.applied.visible) return false;

  entry.halo.style.display = "none";
  entry.applied.visible = false;
  return true;
}

function apply(entry: GlowEntry, vw: number, vh: number): boolean {
  const { el } = entry;
  const style = getComputedStyle(el);

  if (style.visibility === "hidden" || style.display === "none") {
    return hide(entry);
  }

  const rect = el.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return hide(entry);

  if (
    rect.right < -VIEWPORT_MARGIN ||
    rect.bottom < -VIEWPORT_MARGIN ||
    rect.left > vw + VIEWPORT_MARGIN ||
    rect.top > vh + VIEWPORT_MARGIN
  ) {
    return hide(entry);
  }

  const opacity = effectiveOpacity(el, style);
  if (opacity < 0.01) return hide(entry);

  if (entry.epoch !== epoch) {
    entry.clippers = collectClippers(el);
    entry.epoch = epoch;
  }

  const region = visibleRegion(entry.clippers, rect);
  if (!region) return hide(entry);

  const halo = entry.halo ?? createHalo(entry);
  const applied = entry.applied;
  let changed = false;

  if (!applied.visible) {
    halo.style.display = "block";
    applied.visible = true;
    changed = true;
  }

  const shadow = readShadow(el, style) || "none";
  if (applied.shadow !== shadow) {
    halo.style.boxShadow = shadow;
    applied.shadow = shadow;
    changed = true;
  }

  const transform = `translate3d(${round(rect.left)}px, ${round(rect.top)}px, 0)`;
  if (applied.transform !== transform) {
    halo.style.transform = transform;
    applied.transform = transform;
    changed = true;
  }

  const width = `${round(rect.width)}px`;
  if (applied.width !== width) {
    halo.style.width = width;
    applied.width = width;
    changed = true;
  }

  const height = `${round(rect.height)}px`;
  if (applied.height !== height) {
    halo.style.height = height;
    applied.height = height;
    changed = true;
  }

  const radius = [
    style.borderTopLeftRadius,
    style.borderTopRightRadius,
    style.borderBottomRightRadius,
    style.borderBottomLeftRadius,
  ].join(" ");
  if (applied.radius !== radius) {
    halo.style.borderTopLeftRadius = style.borderTopLeftRadius;
    halo.style.borderTopRightRadius = style.borderTopRightRadius;
    halo.style.borderBottomRightRadius = style.borderBottomRightRadius;
    halo.style.borderBottomLeftRadius = style.borderBottomLeftRadius;
    applied.radius = radius;
    changed = true;
  }

  const opacityValue = String(round(opacity));
  if (applied.opacity !== opacityValue) {
    halo.style.opacity = opacityValue;
    applied.opacity = opacityValue;
    changed = true;
  }

  const trimmed =
    region.left > rect.left + 0.5 ||
    region.top > rect.top + 0.5 ||
    region.right < rect.right - 0.5 ||
    region.bottom < rect.bottom - 0.5;

  let clip = "";
  if (trimmed) {
    const extent = shadowExtent(halo);
    clip = `inset(${round(region.top - extent - rect.top)}px ${round(
      rect.right - region.right - extent,
    )}px ${round(rect.bottom - region.bottom - extent)}px ${round(
      region.left - extent - rect.left,
    )}px)`;
  }

  if (applied.clip !== clip) {
    halo.style.clipPath = clip;
    applied.clip = clip;
    changed = true;
  }

  return changed;
}

function sync(): boolean {
  if (!layer) return false;

  if (!layer.isConnected) {
    (document.body || document.documentElement).appendChild(layer);
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let changed = false;

  entries.forEach((entry, el) => {
    if (!el.isConnected) {
      unregister(el);
      changed = true;
      return;
    }

    if (apply(entry, vw, vh)) changed = true;
  });

  return changed;
}

// ============================================
// REGISTRY
// ============================================

function register(el: HTMLElement) {
  if (entries.has(el)) return;

  entries.set(el, {
    el,
    halo: null,
    clippers: [],
    epoch: -1,
    applied: blankApplied(),
  });

  resizes?.observe(el);
}

function unregister(el: HTMLElement) {
  const entry = entries.get(el);
  if (!entry) return;

  if (entry.halo) {
    halos.delete(entry.halo);
    entry.halo.remove();
  }

  entries.delete(el);
  resizes?.unobserve(el);
}

function reconcile(el: HTMLElement) {
  if (el.matches(GLOW_SELECTOR)) register(el);
  else unregister(el);
}

function scan(node: Node) {
  if (!(node instanceof HTMLElement) || node === layer) return;

  if (node.matches(GLOW_SELECTOR)) register(node);
  node.querySelectorAll<HTMLElement>(GLOW_SELECTOR).forEach(register);
}

// ============================================
// LOOP
// ============================================

function schedule() {
  if (!frame && layer) frame = requestAnimationFrame(tick);
}

function wake() {
  idle = 0;
  schedule();
}

function tick() {
  frame = 0;
  if (!layer) return;

  const changed = sync();

  // Drop the records produced by our own halo writes
  mutations?.takeRecords();

  idle = changed ? 0 : idle + 1;
  if (idle < IDLE_FRAMES) schedule();
}

function onMutations(records: MutationRecord[]) {
  let structural = false;

  for (const record of records) {
    const target = record.target;
    if (target === layer || halos.has(target)) continue;

    if (record.type === "childList") {
      record.addedNodes.forEach(scan);
      structural = true;
    } else if (
      record.attributeName !== "style" &&
      target instanceof HTMLElement
    ) {
      reconcile(target);
      structural = true;
    }
  }

  if (structural) epoch++;
  wake();
}

// ============================================
// LIFECYCLE
// ============================================

function mount() {
  const root = document.documentElement;
  const zIndex =
    getComputedStyle(root).getPropertyValue("--glow-layer-z").trim() ||
    DEFAULT_Z_INDEX;

  layer = document.createElement("div");
  layer.className = "dara-glow-layer";
  layer.setAttribute(LAYER_ATTR, "");
  layer.setAttribute("aria-hidden", "true");

  Object.assign(layer.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "0",
    height: "0",
    overflow: "visible",
    pointerEvents: "none",
    zIndex,
  });

  (document.body || root).appendChild(layer);
  root.setAttribute(ROOT_ATTR, "");

  resizes =
    typeof ResizeObserver === "undefined" ? null : new ResizeObserver(wake);

  mutations = new MutationObserver(onMutations);
  mutations.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style", "data-glow", "data-glow-lift"],
  });

  rootMutations = new MutationObserver(wake);
  rootMutations.observe(root, { attributes: true });

  WAKE_EVENTS.forEach((name) =>
    document.addEventListener(name, wake, { capture: true, passive: true }),
  );
  window.addEventListener("resize", wake, { passive: true });
  document.fonts?.ready.then(wake);

  document.querySelectorAll<HTMLElement>(GLOW_SELECTOR).forEach(register);
  wake();
}

function unmount() {
  cancelAnimationFrame(frame);
  frame = 0;
  idle = 0;

  mutations?.disconnect();
  rootMutations?.disconnect();
  resizes?.disconnect();
  mutations = null;
  rootMutations = null;
  resizes = null;

  WAKE_EVENTS.forEach((name) =>
    document.removeEventListener(name, wake, { capture: true }),
  );
  window.removeEventListener("resize", wake);

  Array.from(entries.keys()).forEach(unregister);

  layer?.remove();
  layer = null;
  document.documentElement.removeAttribute(ROOT_ATTR);
}

// ============================================
// PUBLIC API
// ============================================

export function startGlowLayer(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return noop;
  }

  users++;
  if (users === 1) mount();

  let stopped = false;

  return () => {
    if (stopped) return;
    stopped = true;
    users--;
    if (users === 0) unmount();
  };
}

export function refreshGlowLayer() {
  epoch++;
  wake();
}
