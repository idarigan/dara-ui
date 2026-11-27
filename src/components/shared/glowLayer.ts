// ============================================
// GLOW LAYER
// ============================================
//
// Glows (box-shadows) of elements that live in the normal, window-scrolled
// page are re-painted as "halos" in one absolutely positioned layer on
// <html>. That lets a glow spill over `overflow: hidden` parents, and because
// the layer is part of the document it scrolls natively on the compositor —
// it can never lag behind or be left behind while scrolling.
//
// Everything else keeps its own NATIVE box-shadow:
//   - elements that are fixed / sticky, or inside a fixed / sticky ancestor
//   - elements inside any scroll container that is not the viewport
//     (app-shell <main overflow-auto>, sidebars, modals, and a <body> that
//     scrolls instead of the window)
// A halo could only follow those one frame late (main thread vs. compositor),
// which is exactly the "glow left behind after scrolling" ghost.
//
// Halos never paint over fixed / sticky UI (navbar, toasts, back-to-top,
// modals …): the layer is kept one z-index below the lowest of them, and any
// that can't be out-stacked (z-index auto/0) are cut out of the halo with a
// clip-path. Mark custom elements with `data-glow-occluder` to force this, or
// `data-glow-occluder="false"` to opt out.
// ============================================

const ROOT_ATTR = "data-dara-glow";
const LAYER_ATTR = "data-dara-glow-layer";
const NATIVE_ATTR = "data-dara-glow-native";
const OCCLUDER_ATTR = "data-glow-occluder";
const DEFAULT_Z_INDEX = 2147483000;
const IDLE_FRAMES = 30;
const VIEWPORT_MARGIN = 240;
const FALLBACK_EXTENT = 120;
const OCCLUDER_SCAN_MS = 250;

type GlowMode = "page" | "native";

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

/** Where fixed / sticky UI usually hides — cheap pre-filter for occluders. */
const OCCLUDER_CANDIDATES = [
  "body > *",
  "nav",
  "header",
  "footer",
  "aside",
  "dialog",
  '[role="dialog"]',
  '[role="alert"]',
  '[role="status"]',
  '[class*="fixed"]',
  '[class*="sticky"]',
  '[style*="fixed"]',
  '[style*="sticky"]',
  `[${OCCLUDER_ATTR}]`,
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
  mode: GlowMode;
  epoch: number;
  applied: Applied;
}

interface Region {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface TiltBox {
  x: number;
  y: number;
  w: number;
  h: number;
  matrix: string;
  ox: number;
  oy: number;
}

interface Occluder {
  el: HTMLElement;
  /** viewport rect, refreshed every sync */
  rect: Region;
}

const entries = new Map<HTMLElement, GlowEntry>();
const halos = new WeakSet<Node>();

let users = 0;
let pageLayer: HTMLDivElement | null = null;
let mutations: MutationObserver | null = null;
let rootMutations: MutationObserver | null = null;
let resizes: ResizeObserver | null = null;
let frame = 0;
let idle = 0;
let epoch = 0;

let baseZ = DEFAULT_Z_INDEX;
let layerZ = "";
let occluderEpoch = -1;
let occluderScanAt = 0;
/** fixed/sticky UI the halos must stay under, but can't out-stack → clipped */
let clipOccluders: Occluder[] = [];

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

function isFlat(style: CSSStyleDeclaration): boolean {
  const transform = style.transform;
  const flatTransform =
    !transform ||
    transform === "none" ||
    transform === "matrix(1, 0, 0, 1, 0, 0)";

  return flatTransform && (!style.perspective || style.perspective === "none");
}

function inspectAncestors(el: HTMLElement, style: CSSStyleDeclaration) {
  let opacity = toNumber(style.opacity);
  let flat = true;

  for (let node = el.parentElement; node; node = node.parentElement) {
    const parent = getComputedStyle(node);
    if (opacity > 0) opacity *= toNumber(parent.opacity);
    if (flat && !isFlat(parent)) flat = false;
  }

  return { opacity, flat };
}

function tiltBox(
  el: HTMLElement,
  style: CSSStyleDeclaration,
  rect: DOMRect,
): TiltBox | null {
  if (!style.transform || style.transform === "none") return null;

  const matrix = new DOMMatrix(style.transform);
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  if (matrix.isIdentity || !w || !h) return null;

  const [ox, oy] = style.transformOrigin.split(" ").map(parseFloat);
  let minX = Infinity;
  let minY = Infinity;

  for (const [cx, cy] of [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ]) {
    const point = matrix.transformPoint(new DOMPoint(cx - ox, cy - oy, 0, 1));
    if (point.w <= 0.01) return null;
    minX = Math.min(minX, point.x / point.w + ox);
    minY = Math.min(minY, point.y / point.w + oy);
  }

  return {
    x: rect.left - minX,
    y: rect.top - minY,
    w,
    h,
    matrix: style.transform,
    ox,
    oy,
  };
}

function isScrollable(el: HTMLElement, style: CSSStyleDeclaration): boolean {
  const scrolls = /(auto|scroll|overlay)/.test(
    `${style.overflowX} ${style.overflowY}`,
  );
  const hidden = /hidden/.test(`${style.overflowX} ${style.overflowY}`);

  if (scrolls) return true;
  return (
    hidden &&
    (el.scrollHeight > el.clientHeight + 1 ||
      el.scrollWidth > el.clientWidth + 1)
  );
}

/**
 * True when <body> scrolls by itself instead of the viewport — e.g. a project
 * with `html, body { height: 100%; overflow-x: hidden }`. Body overflow only
 * reaches the viewport when <html> overflow is `visible`.
 */
function bodyIsScroller(): boolean {
  const body = document.body;
  if (!body) return false;

  const html = getComputedStyle(document.documentElement);
  if (html.overflowX === "visible" && html.overflowY === "visible") {
    return false;
  }

  const style = getComputedStyle(body);
  return (
    /(auto|scroll|overlay|hidden)/.test(`${style.overflowX} ${style.overflowY}`) &&
    (body.scrollHeight > body.clientHeight + 1 ||
      body.scrollWidth > body.clientWidth + 1)
  );
}

function detectMode(el: HTMLElement): GlowMode {
  const own = getComputedStyle(el);
  if (own.position === "fixed" || own.position === "sticky") return "native";

  for (
    let node = el.parentElement;
    node && node !== document.body && node !== document.documentElement;
    node = node.parentElement
  ) {
    const style = getComputedStyle(node);
    if (style.display === "contents") continue;
    if (
      style.position === "fixed" ||
      style.position === "sticky" ||
      isScrollable(node, style)
    ) {
      return "native";
    }
  }

  return bodyIsScroller() ? "native" : "page";
}

function collectClippers(el: HTMLElement): HTMLElement[] {
  const list: HTMLElement[] = [];

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
// OCCLUDERS (fixed / sticky UI the glow must stay under)
// ============================================

/**
 * z-index this element competes with at the root stacking context: the
 * z-index of its outermost ancestor that opens a stacking context.
 * `null` = it can't be out-stacked by a positive z-index (auto / 0 / negative).
 */
function rootZ(el: HTMLElement): number | null {
  let z: number | null = null;

  for (
    let node: HTMLElement | null = el;
    node && node !== document.documentElement;
    node = node.parentElement
  ) {
    const style = getComputedStyle(node);
    const positioned = style.position !== "static";
    const value = parseInt(style.zIndex, 10);
    if (positioned && !Number.isNaN(value)) z = value;
  }

  return z;
}

function hasInteractiveContent(el: HTMLElement): boolean {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT);
  let budget = 60;

  for (let node = walker.nextNode(); node && budget-- > 0; ) {
    if (getComputedStyle(node as Element).pointerEvents !== "none") return true;
    node = walker.nextNode();
  }

  return false;
}

function isOccluder(el: HTMLElement): boolean {
  if (el === pageLayer || halos.has(el)) return false;

  const flag = el.getAttribute(OCCLUDER_ATTR);
  if (flag === "false") return false;

  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (toNumber(style.opacity) < 0.01) return false;
  if (flag !== null) return true;

  if (style.position !== "fixed" && style.position !== "sticky") return false;

  // Decorative full-page layers (particles, noise, cursor …) are
  // pointer-events: none all the way down. A navbar wrapper that is
  // pointer-events: none but holds clickable content still counts.
  if (style.pointerEvents === "none" && !hasInteractiveContent(el)) {
    return false;
  }

  return true;
}

function scanOccluders() {
  const found: HTMLElement[] = [];

  document.querySelectorAll<HTMLElement>(OCCLUDER_CANDIDATES).forEach((el) => {
    if (!isOccluder(el)) return;
    // Nested inside an occluder we already have? the outer one covers it.
    if (found.some((outer) => outer.contains(el))) return;
    found.push(el);
  });

  let minZ = Infinity;
  const clipped: HTMLElement[] = [];

  for (const el of found) {
    const z = rootZ(el);
    // Backgrounds sitting behind the page aren't on top of anything.
    if (z !== null && z < 0) continue;
    if (z === null || z <= 1) clipped.push(el);
    else minZ = Math.min(minZ, z);
  }

  baseZ =
    parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--glow-layer-z")
        .trim(),
      10,
    ) || DEFAULT_Z_INDEX;

  const z = String(Math.max(1, Math.min(baseZ, minZ - 1)));
  if (pageLayer && z !== layerZ) {
    pageLayer.style.zIndex = z;
    layerZ = z;
  }

  clipOccluders = clipped.map((el) => ({
    el,
    rect: { left: 0, top: 0, right: 0, bottom: 0 },
  }));
}

function refreshOccluderRects() {
  clipOccluders = clipOccluders.filter((o) => o.el.isConnected);
  for (const occluder of clipOccluders) {
    const box = occluder.el.getBoundingClientRect();
    occluder.rect = {
      left: box.left,
      top: box.top,
      right: box.right,
      bottom: box.bottom,
    };
  }
}

// ============================================
// NATIVE MODE
// ============================================

function setNative(el: HTMLElement, native: boolean) {
  if (native) el.setAttribute(NATIVE_ATTR, "");
  else el.removeAttribute(NATIVE_ATTR);
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

  pageLayer?.appendChild(halo);
  halos.add(halo);
  entry.halo = halo;
  return halo;
}

function dropHalo(entry: GlowEntry) {
  if (!entry.halo) return;
  halos.delete(entry.halo);
  entry.halo.remove();
  entry.halo = null;
  entry.applied = blankApplied();
}

function hide(entry: GlowEntry): boolean {
  if (!entry.halo || !entry.applied.visible) return false;

  entry.halo.style.display = "none";
  entry.applied.visible = false;
  return true;
}

function rectPath(l: number, t: number, r: number, b: number): string {
  return `M${round(l)} ${round(t)}H${round(r)}V${round(b)}H${round(l)}Z`;
}

function apply(entry: GlowEntry, vw: number, vh: number): boolean {
  const { el } = entry;

  if (entry.epoch !== epoch) {
    const mode = detectMode(el);
    entry.clippers = mode === "page" ? collectClippers(el) : [];

    if (mode !== entry.mode) {
      entry.mode = mode;
      setNative(el, mode === "native");
      if (mode === "native") dropHalo(entry);
    }

    entry.epoch = epoch;
  }

  // Native: the element paints its own box-shadow — nothing to sync.
  if (entry.mode === "native") return false;

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

  const { opacity, flat } = inspectAncestors(el, style);
  if (opacity < 0.01) return hide(entry);

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

  const trimmed =
    region.left > rect.left + 0.5 ||
    region.top > rect.top + 0.5 ||
    region.right < rect.right - 0.5 ||
    region.bottom < rect.bottom - 0.5;

  // Low-z fixed/sticky UI this glow would spill onto
  const extent = shadow === "none" ? 0 : shadowExtent(halo);
  const holes = clipOccluders.filter(
    ({ el: o, rect: r }) =>
      !o.contains(el) &&
      r.left < rect.right + extent &&
      r.right > rect.left - extent &&
      r.top < rect.bottom + extent &&
      r.bottom > rect.top - extent,
  );

  const tilt =
    !trimmed && !holes.length && flat ? tiltBox(el, style, rect) : null;
  const offsetX = window.scrollX;
  const offsetY = window.scrollY;

  const transform = tilt
    ? `translate3d(${round(tilt.x + offsetX)}px, ${round(
        tilt.y + offsetY,
      )}px, 0) translate(${round(tilt.ox)}px, ${round(tilt.oy)}px) ${
        tilt.matrix
      } translate(${round(-tilt.ox)}px, ${round(-tilt.oy)}px)`
    : `translate3d(${round(rect.left + offsetX)}px, ${round(
        rect.top + offsetY,
      )}px, 0)`;
  if (applied.transform !== transform) {
    halo.style.transform = transform;
    halo.style.transformOrigin = "0 0";
    applied.transform = transform;
    changed = true;
  }

  const width = `${round(tilt ? tilt.w : rect.width)}px`;
  if (applied.width !== width) {
    halo.style.width = width;
    applied.width = width;
    changed = true;
  }

  const height = `${round(tilt ? tilt.h : rect.height)}px`;
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

  // Clip-path in halo-local coordinates (origin = element's top-left).
  let clip = "";
  if (trimmed || holes.length) {
    const outer = trimmed
      ? rectPath(
          region.left - extent - rect.left,
          region.top - extent - rect.top,
          region.right + extent - rect.left,
          region.bottom + extent - rect.top,
        )
      : rectPath(-extent, -extent, rect.width + extent, rect.height + extent);

    const cuts = holes
      .map(({ rect: r }) =>
        rectPath(
          r.left - rect.left,
          r.top - rect.top,
          r.right - rect.left,
          r.bottom - rect.top,
        ),
      )
      .join("");

    clip = `path(evenodd, "${outer}${cuts}")`;
  }

  if (applied.clip !== clip) {
    halo.style.clipPath = clip;
    applied.clip = clip;
    changed = true;
  }

  return changed;
}

function sync(): boolean {
  if (!pageLayer) return false;

  if (!pageLayer.isConnected) {
    document.documentElement.appendChild(pageLayer);
  }

  const now = performance.now();
  if (occluderEpoch !== epoch && now - occluderScanAt > OCCLUDER_SCAN_MS) {
    scanOccluders();
    occluderEpoch = epoch;
    occluderScanAt = now;
  }
  refreshOccluderRects();

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // throttled occluder scan still pending → keep the loop alive for it
  let changed = occluderEpoch !== epoch;

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
    mode: "page",
    epoch: -1,
    applied: blankApplied(),
  });

  resizes?.observe(el);
}

function unregister(el: HTMLElement) {
  const entry = entries.get(el);
  if (!entry) return;

  dropHalo(entry);
  setNative(el, false);
  entries.delete(el);
  resizes?.unobserve(el);
}

function reconcile(el: HTMLElement) {
  if (el.matches(GLOW_SELECTOR)) register(el);
  else unregister(el);
}

function scan(node: Node) {
  if (!(node instanceof HTMLElement) || node === pageLayer) {
    return;
  }

  if (node.matches(GLOW_SELECTOR)) register(node);
  node.querySelectorAll<HTMLElement>(GLOW_SELECTOR).forEach(register);
}

// ============================================
// LOOP
// ============================================

function schedule() {
  if (!frame && pageLayer) frame = requestAnimationFrame(tick);
}

function wake() {
  idle = 0;
  schedule();
}

function onResize() {
  // overflow / position can change with media queries
  epoch++;
  wake();
}

function tick() {
  frame = 0;
  if (!pageLayer) return;

  const changed = sync();

  // Drop the records produced by our own halo / attribute writes
  mutations?.takeRecords();

  idle = changed ? 0 : idle + 1;
  if (idle < IDLE_FRAMES) schedule();
}

function onMutations(records: MutationRecord[]) {
  let structural = false;

  for (const record of records) {
    const target = record.target;
    if (target === pageLayer || halos.has(target)) continue;

    if (record.type === "childList") {
      record.addedNodes.forEach(scan);
      structural = true;
    } else if (
      record.attributeName !== "style" &&
      target instanceof HTMLElement
    ) {
      reconcile(target);
      structural = true;
    } else if (record.attributeName === "style") {
      // inline position / overflow / z-index changes affect mode & occluders
      const value = (target as HTMLElement).getAttribute?.("style") ?? "";
      if (/position|overflow|z-index|display/.test(value)) structural = true;
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

  const node = document.createElement("div");
  node.className = "dara-glow-layer";
  node.setAttribute(LAYER_ATTR, "");
  node.setAttribute(OCCLUDER_ATTR, "false");
  node.setAttribute("aria-hidden", "true");

  Object.assign(node.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "0",
    height: "0",
    overflow: "visible",
    pointerEvents: "none",
    zIndex: String(DEFAULT_Z_INDEX),
  });

  pageLayer = node;
  layerZ = "";
  occluderEpoch = -1;
  occluderScanAt = 0;
  root.appendChild(pageLayer);
  root.setAttribute(ROOT_ATTR, "");

  resizes =
    typeof ResizeObserver === "undefined" ? null : new ResizeObserver(wake);

  mutations = new MutationObserver(onMutations);
  mutations.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [
      "class",
      "style",
      "data-glow",
      "data-glow-lift",
      OCCLUDER_ATTR,
    ],
  });

  rootMutations = new MutationObserver(wake);
  rootMutations.observe(root, { attributes: true });

  WAKE_EVENTS.forEach((name) =>
    document.addEventListener(name, wake, {
      capture: true,
      passive: true,
    }),
  );
  window.addEventListener("resize", onResize, { passive: true });
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
  window.removeEventListener("resize", onResize);

  Array.from(entries.keys()).forEach(unregister);
  clipOccluders = [];

  pageLayer?.remove();
  pageLayer = null;
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
  occluderScanAt = 0;
  wake();
}
