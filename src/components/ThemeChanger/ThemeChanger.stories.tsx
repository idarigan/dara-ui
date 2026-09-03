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
      description: "Component size",
    },
    autoDetect: {
      control: "boolean",
      description: "Auto-detect themes from CSS",
    },
    iconOnly: {
      control: "boolean",
      description: "Show only the icon in a fixed circle",
    },
    fixedWidth: {
      control: "text",
      description: "Fixed width for the trigger button",
    },
  },
  args: {
    size: "md",
    autoDetect: true,
    iconOnly: false,
  },
} satisfies Meta<typeof ThemeChanger>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ThemeChanger with full label + icon + chevron
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Current theme is applied via data-theme attribute
      </p>
      <ThemeChanger {...args} />
    </div>
  ),
};

/**
 * Icon-only mode - perfect for navigation bars
 * Fixed size circle with just the theme icon
 */
export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Icon-only mode - fixed size circle with only the icon
      </p>
      <div className="flex items-center gap-4">
        <ThemeChanger iconOnly size="sm" />
        <ThemeChanger iconOnly size="md" />
        <ThemeChanger iconOnly size="lg" />
      </div>
    </div>
  ),
};

/**
 * Fixed width ensures the dropdown stays consistent
 * regardless of selected theme label length
 */
export const FixedWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Fixed width keeps the dropdown consistent regardless of selected label
      </p>
      <div className="flex items-center gap-4">
        <ThemeChanger fixedWidth="120px" size="sm" />
        <ThemeChanger fixedWidth="160px" size="md" />
        <ThemeChanger fixedWidth="200px" size="lg" />
      </div>
    </div>
  ),
};

/**
 * Different size variants for various UI contexts
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <div className="flex items-center gap-4">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
          sm
        </span>
        <ThemeChanger size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
          md
        </span>
        <ThemeChanger size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
          lg
        </span>
        <ThemeChanger size="lg" />
      </div>
    </div>
  ),
};

/**
 * Custom themes with custom icons and labels
 */
export const CustomThemes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Custom theme list with SVG icons
      </p>
      <ThemeChanger autoDetect={false} />
    </div>
  ),
};

/**
 * Controlled mode with external state management
 */
export const Controlled: Story = {
  render: () => {
    const [theme, setTheme] = React.useState("nightfall");

    return (
      <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
          Controlled mode:{" "}
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
        </div>
        <ThemeChanger value={theme} onChange={setTheme} />
      </div>
    );
  },
};

/**
 * Icon-only with consistent sizing for navbar use
 */
export const IconOnlyNavbar: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Perfect for compact navigation bars
      </p>
      <div className="flex items-center gap-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]">
        <span className="text-sm font-heading font-bold text-[var(--color-text-primary)]">
          Logo
        </span>
        <ThemeChanger iconOnly size="sm" />
        <ThemeChanger iconOnly size="md" />
        <ThemeChanger iconOnly size="lg" />
      </div>
    </div>
  ),
};
