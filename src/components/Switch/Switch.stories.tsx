import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { useState } from "react";
import { PlayIcon, PauseIcon } from "../Icons";

const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    glow: { control: "boolean" },
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  args: {
    size: "md",
    glow: false,
    disabled: false,
    label: "Switch",
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {
  args: {
    label: "Enable dark mode",
    defaultChecked: false,
  },
};

// ----- Checked -----
export const Checked: Story = {
  args: {
    label: "Enabled",
    defaultChecked: true,
  },
};

// ----- With Glow -----
export const WithGlow: Story = {
  args: {
    label: "Glow when on",
    defaultChecked: true,
    glow: true,
  },
};

// ----- With Custom Icons -----
export const WithCustomIcons: Story = {
  render: function WithCustomIconsStory() {
    return (
      <div className="flex flex-col gap-4 items-start">
        <Switch
          label="Play/Pause"
          onIcon={<PlayIcon />}
          offIcon={<PauseIcon />}
          defaultChecked
        />
        <Switch
          label="Music on/off"
          onIcon={<PlayIcon />}
          offIcon={<PauseIcon />}
        />
      </div>
    );
  },
};

// ----- Sizes -----
export const Sizes: Story = {
  render: function SizesStory() {
    return (
      <div className="flex flex-col gap-6 items-start">
        <Switch size="sm" label="Small" defaultChecked glow />
        <Switch size="md" label="Medium" defaultChecked glow />
        <Switch size="lg" label="Large" defaultChecked glow />
      </div>
    );
  },
};

// ----- RTL Support -----
export const RTLSupport: Story = {
  render: function RTLSupportStory() {
    const [isRTL, setIsRTL] = useState(false);

    const toggleRTL = () => {
      const newDir = isRTL ? "ltr" : "rtl";
      document.documentElement.dir = newDir;
      document.documentElement.lang = newDir === "rtl" ? "fa" : "en";
      setIsRTL(!isRTL);
    };

    return (
      <div className="flex flex-col gap-4 items-start p-6 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] min-w-[280px]">
        <button
          className="px-4 py-2 text-sm rounded-[var(--radius-md)] bg-[var(--color-primary-solid)] text-white hover:bg-[var(--color-primary-hover)] transition-colors"
          onClick={toggleRTL}
        >
          {isRTL ? "Switch to LTR" : "Switch to RTL"}
        </button>
        <div className="flex flex-col gap-4 mt-2 w-full">
          <Switch label="فعال سازی حالت شب" defaultChecked glow />
          <Switch label="فعال کردن اعلان‌ها" />
          <Switch label="حالت خودکار" defaultChecked />
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mt-2">
          Current direction:{" "}
          {isRTL ? "RTL (right-to-left)" : "LTR (left-to-right)"}
        </p>
      </div>
    );
  },
};

// ----- Disabled -----
export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <div className="flex flex-col gap-4 items-start">
        <Switch label="Disabled off" disabled />
        <Switch label="Disabled on" disabled defaultChecked />
      </div>
    );
  },
};

// ----- Controlled -----
export const Controlled: Story = {
  render: function ControlledStory() {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col gap-4 items-start">
        <Switch
          label="Controlled switch"
          checked={checked}
          onCheckedChange={setChecked}
          glow
        />
        <div className="text-xs text-[var(--color-text-secondary)] font-mono">
          Status: {checked ? "✅ On" : "⬜ Off"}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-primary-solid)] text-white hover:bg-[var(--color-primary-hover)]"
            onClick={() => setChecked(true)}
          >
            Turn On
          </button>
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]"
            onClick={() => setChecked(false)}
          >
            Turn Off
          </button>
        </div>
      </div>
    );
  },
};

// ----- Group -----
export const Group: Story = {
  render: function GroupStory() {
    const [values, setValues] = useState({
      option1: true,
      option2: false,
      option3: false,
    });

    const handleChange = (key: keyof typeof values) => (checked: boolean) => {
      setValues((prev) => ({ ...prev, [key]: checked }));
    };

    return (
      <div className="flex flex-col gap-4 p-6 glass rounded-[var(--radius-md)] min-w-[240px]">
        <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
          Settings:
        </p>
        <Switch
          label="Enable notifications"
          checked={values.option1}
          onCheckedChange={handleChange("option1")}
          glow
        />
        <Switch
          label="Dark mode"
          checked={values.option2}
          onCheckedChange={handleChange("option2")}
        />
        <Switch
          label="Auto-save"
          checked={values.option3}
          onCheckedChange={handleChange("option3")}
        />
        <div className="mt-2 text-xs text-[var(--color-text-tertiary)] font-mono">
          Enabled: {Object.entries(values).filter(([, v]) => v).length} of 3
        </div>
      </div>
    );
  },
};
