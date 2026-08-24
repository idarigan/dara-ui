import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./Radio";
import { useState } from "react";

const meta = {
  title: "Components/Radio",
  component: Radio,
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
    label: "Radio",
  },
} satisfies Meta<typeof Radio>;

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
      <Radio size="sm" label="Small" defaultChecked />
      <Radio size="md" label="Medium" defaultChecked />
      <Radio size="lg" label="Large" defaultChecked />
    </div>
  ),
};

// ----- RTL Support -----
export const RTLSupport: Story = {
  render: () => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "fa";

    return (
      <div className="flex flex-col gap-4 items-start">
        <Radio label="پذیرش شرایط" defaultChecked />
        <Radio label="تایید اطلاعات" />
        <Radio label="فعال سازی حالت شب" defaultChecked glow />
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
      <Radio label="Required field" error />
      <Radio label="Invalid selection" error defaultChecked />
    </div>
  ),
};

// ----- Disabled -----
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Radio label="Disabled unchecked" disabled />
      <Radio label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

// ----- Controlled -----
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col gap-4 items-start">
        <Radio
          label="Controlled radio"
          checked={checked}
          onCheckedChange={setChecked}
          glow
        />
        <div className="text-xs text-[var(--color-text-secondary)] font-mono">
          Status: {checked ? "✅ Selected" : "⬜ Deselected"}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-primary-solid)] text-white hover:bg-[var(--color-primary-hover)]"
            onClick={() => setChecked(true)}
          >
            Select
          </button>
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]"
            onClick={() => setChecked(false)}
          >
            Deselect
          </button>
        </div>
      </div>
    );
  },
};

// ----- Group -----
export const Group: Story = {
  render: () => {
    const [selected, setSelected] = useState("option1");

    return (
      <div className="flex flex-col gap-3 p-6 glass rounded-[var(--radius-md)]">
        <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
          Select your preference:
        </p>
        <Radio
          label="Enable notifications"
          name="preference"
          value="option1"
          checked={selected === "option1"}
          onCheckedChange={(checked) => {
            if (checked) setSelected("option1");
          }}
          glow
        />
        <Radio
          label="Dark mode"
          name="preference"
          value="option2"
          checked={selected === "option2"}
          onCheckedChange={(checked) => {
            if (checked) setSelected("option2");
          }}
        />
        <Radio
          label="Auto-save"
          name="preference"
          value="option3"
          checked={selected === "option3"}
          onCheckedChange={(checked) => {
            if (checked) setSelected("option3");
          }}
        />
        <div className="mt-2 text-xs text-[var(--color-text-tertiary)] font-mono">
          Selected: {selected}
        </div>
      </div>
    );
  },
};
