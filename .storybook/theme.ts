import { create } from "storybook/internal/theming";

export const daraTheme = create({
  base: "dark",

  // Brand
  brandTitle: "Dara UI",
  brandUrl: "https://dara-ui.vercel.app",
  brandImage: "/favicon.svg",
  brandTarget: "_self",

  // Colors
  colorPrimary: "#7C5CFF",
  colorSecondary: "#7C5CFF",

  // UI
  appBg: "#0B0F19",
  appContentBg: "#0B0F19",
  appBorderColor: "rgba(255,255,255,0.08)",
  appBorderRadius: 12,

  // Typography
  fontBase:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',

  // Text colors
  textColor: "#E2E8F0",
  textInverseColor: "#0B0F19",
  textMutedColor: "#94A3B8",

  // Toolbar
  barTextColor: "#94A3B8",
  barSelectedColor: "#7C5CFF",
  barBg: "rgba(18,24,38,0.9)",

  // Form colors
  inputBg: "rgba(255,255,255,0.05)",
  inputBorder: "rgba(255,255,255,0.12)",
  inputTextColor: "#E2E8F0",
  inputBorderRadius: 8,

  // Glow effects
  booleanBg: "rgba(124,92,255,0.15)",
  booleanSelectedBg: "#7C5CFF",

  // Buttons
  buttonBg: "rgba(255,255,255,0.05)",
  buttonBorder: "rgba(255,255,255,0.12)",
});
