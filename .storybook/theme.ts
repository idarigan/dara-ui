import { create } from "@storybook/theming/create";

export const daraTheme = create({
  base: "dark",

  // ----- Brand -----
  brandTitle: "Dara UI",
  brandUrl: "https://dara-ui-d.vercel.app",
  brandImage: "/logo.svg",
  brandTarget: "_self",

  // ----- Colors -----
  colorPrimary: "#7c5cff",
  colorSecondary: "#7c5cff",

  // ----- UI -----
  appBg: "#0b0f1a",
  appContentBg: "#111827",
  appPreviewBg: "#0b0f1a",
  appBorderColor: "#2a3a52",
  appBorderRadius: 10,

  // ----- Text -----
  textColor: "#f1f5f9",
  textInverseColor: "#0b0f1a",
  textMutedColor: "#8b9cb3",

  // ----- Toolbar -----
  barBg: "#111827",
  barTextColor: "#a8b4c8",
  barSelectedColor: "#a78bfa",
  barHoverColor: "#a78bfa",

  // ----- Inputs -----
  inputBg: "#1a2332",
  inputBorder: "#2a3a52",
  inputTextColor: "#f1f5f9",
  inputBorderRadius: 10,

  // ----- Fonts -----
  fontBase:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono", "SF Mono", monospace',
});

export default daraTheme;
