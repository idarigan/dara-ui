import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeChanger } from "./ThemeChanger";

const meta = {
  title: "Components/ThemeChanger",
  component: ThemeChanger,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the theme changer",
    },
  },
  args: {
    size: "sm",
    defaultValue: "nightfall",
  },
} satisfies Meta<typeof ThemeChanger>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Current theme:{" "}
        <span className="text-[var(--color-primary)]" id="themeDisplay">
          nightfall
        </span>
      </p>
      <ThemeChanger
        {...args}
        onChange={(theme) => {
          const el = document.getElementById("themeDisplay");
          if (el) el.textContent = theme;
        }}
      />
    </div>
  ),
};

// ----- Sizes -----
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <div className="flex items-center gap-4">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
          sm
        </span>
        <ThemeChanger size="sm" defaultValue="nightfall" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
          md
        </span>
        <ThemeChanger size="md" defaultValue="nightfall" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
          lg
        </span>
        <ThemeChanger size="lg" defaultValue="nightfall" />
      </div>
    </div>
  ),
};

// ----- Controlled -----
export const Controlled: Story = {
  render: () => {
    const [theme, setTheme] = React.useState("nightfall");

    return (
      <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
          Controlled theme:{" "}
          <span className="text-[var(--color-primary)] font-bold">{theme}</span>
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            onClick={() => setTheme("nightfall")}
          >
            Set Nightfall
          </button>
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            onClick={() => setTheme("daylight")}
          >
            Set Daylight
          </button>
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            onClick={() => setTheme("bloody-moon")}
          >
            Set Bloody Moon
          </button>
        </div>
        <ThemeChanger value={theme} onChange={setTheme} />
      </div>
    );
  },
};

// ----- In Glass Card -----
export const InGlassCard: Story = {
  render: () => (
    <div className="glass p-6 flex flex-col gap-4 items-center">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Theme Changer in Glass Card
      </p>
      <ThemeChanger defaultValue="nightfall" size="md" />
    </div>
  ),
};
