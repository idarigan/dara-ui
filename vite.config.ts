/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import {
  mkdirSync,
  cpSync,
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";
import tailwindcss from "@tailwindcss/vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["src"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/**/*.stories.ts",
        "src/App.tsx",
        "src/main.tsx",
        "src/stories/**",
      ],
      outDirs: ["dist"],
      tsconfigPath: "./tsconfig.app.json",
      insertTypesEntry: true,
    }),
    {
      name: "copy-assets-to-dist",
      writeBundle() {
        mkdirSync("dist", { recursive: true });

        if (!existsSync("build/style.css")) {
          throw new Error("build/style.css not found, run build:css first");
        }

        let css = readFileSync("build/style.css", "utf-8");

        css = css.replace(
          /url\(\s*(['"]?)(?:\.{1,2}\/)+(?:src\/)?assets\/fonts\//g,
          "url($1./fonts/",
        );

        if (/assets\/fonts/.test(css)) {
          throw new Error("style.css still has unresolved font urls");
        }

        writeFileSync("dist/style.css", css);
        console.log("✓ Copied + rewrote build/style.css → dist/style.css");

        const srcFonts = path.resolve(dirname, "src/assets/fonts");
        const distFonts = path.resolve(dirname, "dist/fonts");

        if (!existsSync(srcFonts)) {
          throw new Error(`Fonts folder not found at ${srcFonts}`);
        }

        mkdirSync(distFonts, { recursive: true });
        cpSync(srcFonts, distFonts, { recursive: true });
        console.log("✓ Copied src/assets/fonts → dist/fonts");

        const present = new Set(readdirSync(distFonts));
        const referenced = [
          ...css.matchAll(/url\(\s*['"]?\.\/fonts\/([^'")\s]+)/g),
        ].map((m) => m[1]);
        const missing = [...new Set(referenced)].filter(
          (file) => !present.has(file),
        );

        if (missing.length > 0) {
          throw new Error(`Missing font files: ${missing.join(", ")}`);
        }

        console.log(`✓ Verified ${new Set(referenced).size} font files`);
      },
    },
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(dirname, "src/index.ts"),
      name: "DaraUI",
      formats: ["es", "cjs"],
      fileName: (format) => `dara-ui.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
