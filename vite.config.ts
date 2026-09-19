/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { copyFileSync, mkdirSync } from "node:fs";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
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
      name: "copy-compiled-css",
      closeBundle() {
        mkdirSync("dist", { recursive: true });
        copyFileSync("build/style.css", "dist/style.css");
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
