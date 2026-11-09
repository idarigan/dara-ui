import { addons } from "@storybook/manager-api";
import { daraTheme } from "./theme";

addons.setConfig({
  theme: daraTheme,
});

const style = document.createElement("style");
style.textContent = `
  [class*="sidebar-header"] img,
  [class*="SidebarHeader"] img,
  a[href*="dara-ui"] img {
    width: 30px !important;
    height: 30px !important;
  }
`;
document.head.appendChild(style);
