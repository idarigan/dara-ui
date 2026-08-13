import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { daraTheme } from "./theme";
import "../src/styles/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    docs: {
      theme: daraTheme,
    },

    backgrounds: {
      default: "nightfall",
      values: [
        { name: "Nightfall", value: "#0B0F19" },
        { name: "Daylight", value: "#FFFFFF" },
        { name: "Dracula", value: "#1A1B26" },
      ],
    },

    a11y: {
      test: "todo",
    },

    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Introduction",
          "Getting Started",
          "Themes",
          "Components",
          [
            "Button",
            "Badge",
            "Input",
            "Card",
            "Tabs",
            "Accordion",
            "Dropdown",
            "Modal",
            "Avatar",
            "Tooltip",
            "Progress",
            "Range",
            "Checkbox",
            "Switch",
            "Radio",
            "XPBar",
            "StatsWidget",
            "QuestCard",
            "CharacterCard",
            "ProductCard",
            "BlogCard",
            "Navbar",
            "Sidebar",
            "SocialMedia",
            "Toast",
            "ThemeChanger",
            "LanguageChanger",
            "GradientRing",
            "AuroraBlobs",
            "Particles",
            "NoiseOverlay",
          ],
        ],
      },
    },
  },

  decorators: [
    withThemeByDataAttribute({
      themes: {
        nightfall: "nightfall",
        daylight: "daylight",
        dracula: "dracula",
      },
      defaultTheme: "nightfall",
      attributeName: "data-theme",
    }),
    (Story) => {
      document.documentElement.setAttribute("data-theme", "nightfall");
      return <Story />;
    },
  ],
};

export default preview;
