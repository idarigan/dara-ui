import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { useState } from "react";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
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
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  args: {
    size: "md",
    glow: false,
    error: false,
    disabled: false,
    label: "Checkbox",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {
  args: {
    label: "Accept terms",
    defaultChecked: false,
  },
};

// ----- Checked -----
export const Checked: Story = {
  args: {
    label: "Checked",
    defaultChecked: true,
  },
};

// ----- With Glow -----
export const WithGlow: Story = {
  args: {
    label: "Glow when checked",
    defaultChecked: true,
    glow: true,
  },
};

// ----- Sizes -----
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox size="sm" label="Small" defaultChecked />
      <Checkbox size="md" label="Medium" defaultChecked />
      <Checkbox size="lg" label="Large" defaultChecked />
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
      <div className="flex flex-col gap-4 items-start">
        <Checkbox label="پذیرش شرایط" defaultChecked />
        <Checkbox label="تایید اطلاعات" />
        <Checkbox label="فعال سازی حالت شب" defaultChecked glow />
      </div>
    );
  },
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

// ----- Error State -----
export const ErrorState: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Required field" error />
      <Checkbox label="Invalid selection" error defaultChecked />
    </div>
  ),
};

// ----- Disabled -----
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

// ----- Controlled -----
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col gap-4 items-start">
        <Checkbox
          label="Controlled checkbox"
          checked={checked}
          onCheckedChange={setChecked}
          glow
        />
        <div className="text-xs text-[var(--color-text-secondary)] font-mono">
          Status: {checked ? "✅ Checked" : "⬜ Unchecked"}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
            onClick={() => setChecked(true)}
          >
            Check
          </button>
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]"
            onClick={() => setChecked(false)}
          >
            Uncheck
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
      <div className="flex flex-col gap-3 p-6 glass rounded-[var(--radius-md)]">
        <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
          Select your preferences:
        </p>
        <Checkbox
          label="Enable notifications"
          checked={values.option1}
          onCheckedChange={handleChange("option1")}
          glow
        />
        <Checkbox
          label="Dark mode"
          checked={values.option2}
          onCheckedChange={handleChange("option2")}
        />
        <Checkbox
          label="Auto-save"
          checked={values.option3}
          onCheckedChange={handleChange("option3")}
        />
        <div className="mt-2 text-xs text-[var(--color-text-tertiary)] font-mono">
          Selected: {Object.entries(values).filter(([, v]) => v).length} of 3
        </div>
      </div>
    );
  },
};
