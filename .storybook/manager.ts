import { addons } from "@storybook/manager-api";
import { daraTheme } from "./theme";

addons.setConfig({
  theme: daraTheme,
});

const style = document.createElement("style");
style.textContent = `
  [class*="sidebar-header"] a,
  [class*="SidebarHeader"] a,
  a[href*="dara-ui"],
  a[href*="localhost"] {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
  }

  [class*="sidebar-header"] a::after,
  [class*="SidebarHeader"] a::after {
    content: "Dara UI";
    font-family: "Space Grotesk", "Inter", system-ui, sans-serif;
    font-weight: 700;
    font-size: 16px;
    letter-spacing: 0.02em;
    color: #f1f5f9;
  }

  [class*="sidebar-header"] img,
  [class*="SidebarHeader"] img,
  a[href*="dara-ui"] img,
  a[href*="localhost"] img {
    width: 30px !important;
    height: 30px !important;
    max-width: 30px !important;
    max-height: 30px !important;
    min-width: 0 !important;
    min-height: 0 !important;
    object-fit: contain !important;
    display: inline-block !important;
  }
`;

document.head.appendChild(style);
