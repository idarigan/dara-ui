import { create } from "@storybook/theming/create";

const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="168" height="40" viewBox="0 0 168 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><rect x="2" y="4" width="32" height="32" rx="10" fill="url(#g)"/><path d="M12 11h6.5a9 9 0 0 1 0 18H12z M16 15v10h2.5a5 5 0 0 0 0-10z" fill="#ffffff" fill-rule="evenodd"/><text x="44" y="27" font-family="Space Grotesk, Inter, Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="1" fill="#f1f5f9">DARA UI</text></svg>`;

export default create({
  base: "dark",

  // ----- Brand -----
  brandTitle: "Dara UI",
  brandUrl: "https://dara-ui.vercel.app",
  brandImage: `data:image/svg+xml,${encodeURIComponent(logo)}`,
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
