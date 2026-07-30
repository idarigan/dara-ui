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
    },
    autoDetect: {
      control: "boolean",
    },
  },
  args: {
    size: "md",
    autoDetect: true,
  },
} satisfies Meta<typeof ThemeChanger>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ThemeChanger with auto-detection
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
 * Different sizes
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
 * Custom themes
 */
export const CustomThemes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Custom theme list with SVG icons
      </p>
      <ThemeChanger
        availableThemes={[
          { value: "nightfall", label: "Night", icon: "🌙" },
          { value: "daylight", label: "Day", icon: "☀️" },
          { value: "bloody-moon", label: "Blood", icon: "🔴" },
        ]}
        autoDetect={false}
      />
    </div>
  ),
};

/**
 * Controlled
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
