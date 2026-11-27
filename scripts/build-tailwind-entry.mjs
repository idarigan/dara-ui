#!/usr/bin/env node
/**
 * Generates dist/tailwind.css — the entry for projects that ALSO use Tailwind v4.
 *
 * Why: dist/style.css contains Dara's own compiled Tailwind utilities
 * (grid-cols-1, sm:grid-cols-2, hidden, md:block …). When it is loaded next to
 * the consumer's Tailwind build, the same class names exist twice, in two
 * independently-sorted `@layer utilities` blocks. Whichever sheet loads last
 * re-declares e.g. `.grid-cols-1` AFTER the consumer's `md:` / `lg:` rules and
 * silently wins — so only some breakpoints work.
 *
 * Fix: this file keeps everything Dara-specific (tokens, fonts, glass, glow,
 * keyframes …) but strips Tailwind's generated layers, and adds an `@source`
 * pointing at Dara's compiled JS. The consumer's Tailwind then generates every
 * utility (theirs + Dara's) once, in one correctly ordered layer.
 *
 * Usage (after `vite build`):  node scripts/build-tailwind-entry.mjs [in] [out]
 * Defaults: dist/style.css -> dist/tailwind.css
 */
import fs from "node:fs";
import path from "node:path";

const input = path.resolve(process.argv[2] ?? "dist/style.css");
const output = path.resolve(process.argv[3] ?? path.join(path.dirname(input), "tailwind.css"));

const TAILWIND_LAYERS = new Set(["theme", "base", "components", "utilities", "properties"]);

/** Index of the `}` that closes the `{` at `open` (skips strings & comments). */
function matchBrace(css, open) {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    const ch = css[i];
    if (ch === "/" && css[i + 1] === "*") { i = css.indexOf("*/", i + 2) + 1; continue; }
    if (ch === '"' || ch === "'") {
      for (i++; i < css.length && css[i] !== ch; i++) if (css[i] === "\\") i++;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) return i;
  }
  throw new Error(`Unbalanced braces at ${open}`);
}

function strip(css) {
  let out = "";
  let i = 0;
  while (i < css.length) {
    // keep comments verbatim except Tailwind's banner
    if (css.startsWith("/*", i)) {
      const end = css.indexOf("*/", i + 2) + 2;
      const comment = css.slice(i, end);
      if (!/tailwindcss v\d/.test(comment)) out += comment;
      i = end;
      continue;
    }
    if (css[i] === "@") {
      const m = /^@(layer|property)\s*([^{;]*)([{;])/.exec(css.slice(i));
      if (m) {
        const [whole, kind, rawName, term] = m;
        const names = rawName.split(",").map((s) => s.trim()).filter(Boolean);
        const isTw = kind === "property" || names.every((n) => TAILWIND_LAYERS.has(n));
        if (isTw) {
          i = term === ";" ? i + whole.length : matchBrace(css, i + whole.length - 1) + 1;
          continue;
        }
      }
    }
    out += css[i++];
  }
  return out.replace(/\n{3,}/g, "\n\n").trim();
}

const css = fs.readFileSync(input, "utf8");
const header = `/* Dara UI — Tailwind v4 entry.
   In your app's main CSS:
     @import "tailwindcss";
     @import "dara-ui/tailwind.css";
   Do NOT also import dara-ui/style.css. */
@source "./**/*.{js,mjs,cjs}";
`;
fs.writeFileSync(output, header + "\n" + strip(css) + "\n");
console.log(`dara-ui: wrote ${path.relative(process.cwd(), output)}`);
