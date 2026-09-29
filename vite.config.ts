/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { copyFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
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

        if (existsSync("build/style.css")) {
          copyFileSync("build/style.css", "dist/style.css");
          console.log("✓ Copied build/style.css → dist/style.css");
        } else {
          console.warn("⚠ build/style.css not found — run build:css first");
        }

        const srcFonts = path.resolve(dirname, "public/fonts");
        const distFonts = path.resolve(dirname, "dist/fonts");

        if (existsSync(srcFonts)) {
          mkdirSync(distFonts, { recursive: true });
          cpSync(srcFonts, distFonts, { recursive: true });
          console.log("✓ Copied public/fonts → dist/fonts");
        } else {
          console.warn(`⚠ public/fonts not found at ${srcFonts}`);
        }
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
