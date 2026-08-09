import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { useState } from "react";

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

// ----- Sizes -----
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Switch size="sm" label="Small" defaultChecked />
      <Switch size="md" label="Medium" defaultChecked />
      <Switch size="lg" label="Large" defaultChecked />
    </div>
  ),
};

// ----- RTL Support -----
export const RTLSupport: Story = {
  render: () => {
    // Set RTL for demo
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "fa";

    return (
      <div className="flex flex-col gap-4">
        <Switch label="فعال سازی حالت شب" defaultChecked />
        <Switch label="فعال کردن اعلان‌ها" />
        <Switch label="حالت خودکار" defaultChecked glow />
      </div>
    );
  },
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

// ----- Disabled -----
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch label="Disabled off" disabled />
      <Switch label="Disabled on" disabled defaultChecked />
    </div>
  ),
};

// ----- Controlled -----
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col gap-4">
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
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
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
  render: () => {
    const [values, setValues] = useState({
      option1: true,
      option2: false,
      option3: false,
    });

    const handleChange = (key: keyof typeof values) => (checked: boolean) => {
      setValues((prev) => ({ ...prev, [key]: checked }));
    };

    return (
      <div className="flex flex-col gap-4 p-6 glass rounded-[var(--radius-md)]">
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
