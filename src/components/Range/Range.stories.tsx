import type { Meta, StoryObj } from "@storybook/react";
import { Range } from "./Range";
import { useState } from "react";
import Button from "../Button/Button";

const meta = {
  title: "Components/Range",
  component: Range,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "accent",
        "success",
        "danger",
        "warning",
      ],
    },
    valuePosition: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
    },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    showValue: { control: "boolean" },
    glow: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    showValue: true,
    glow: true,
    disabled: false,
    fullWidth: true,
    size: "md",
    color: "primary",
    valuePosition: "right",
    suffix: "%",
  },
} satisfies Meta<typeof Range>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {};

// ----- With Label -----
export const WithLabel: Story = {
  args: {
    label: "Volume",
    defaultValue: 75,
    suffix: "%",
  },
};

// ----- Colors -----
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Range defaultValue={50} color="primary" label="Primary" />
      <Range defaultValue={50} color="secondary" label="Secondary" />
      <Range defaultValue={50} color="accent" label="Accent" />
      <Range defaultValue={50} color="success" label="Success" />
      <Range defaultValue={50} color="danger" label="Danger" />
      <Range defaultValue={50} color="warning" label="Warning" />
    </div>
  ),
};

// ----- Sizes -----
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Range defaultValue={50} size="sm" label="Small" />
      <Range defaultValue={50} size="md" label="Medium (default)" />
      <Range defaultValue={50} size="lg" label="Large" />
    </div>
  ),
};

// ----- Value Positions -----
export const ValuePositions: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Range defaultValue={50} valuePosition="left" label="Left" />
      <Range defaultValue={50} valuePosition="right" label="Right (default)" />
      <Range defaultValue={50} valuePosition="top" label="Top" />
      <Range defaultValue={50} valuePosition="bottom" label="Bottom" />
    </div>
  ),
};

// ----- Custom Suffix/Prefix -----
export const CustomSuffixPrefix: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Range defaultValue={75} suffix="%" label="Percentage" />
      <Range defaultValue={42} suffix="px" label="Pixels" />
      <Range defaultValue={99} prefix="$" suffix="" label="Price" />
      <Range
        defaultValue={1500}
        prefix="تومان "
        suffix=""
        label="Persian Rial"
      />
    </div>
  ),
};

// ----- Without Glow -----
export const WithoutGlow: Story = {
  args: {
    glow: false,
    defaultValue: 65,
    label: "No Glow",
  },
};

// ----- Disabled -----
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Range defaultValue={50} disabled label="Disabled" />
      <Range defaultValue={80} disabled label="Disabled at 80%" />
    </div>
  ),
};

// ----- Controlled -----
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(45);
    const [completeValue, setCompleteValue] = useState(45);

    return (
      <div className="flex flex-col gap-4 w-80">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
            Value:{" "}
            <span className="text-[var(--color-primary)] font-bold">
              {value}%
            </span>
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
            Complete:{" "}
            <span className="text-[var(--color-secondary)] font-bold">
              {completeValue}%
            </span>
          </p>
        </div>
        <Range
          value={value}
          onChange={setValue}
          onChangeComplete={setCompleteValue}
          label="Controlled Range"
          suffix="%"
        />
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="primary" onClick={() => setValue(25)}>
            Set 25%
          </Button>
          <Button size="sm" variant="success" onClick={() => setValue(75)}>
            Set 75%
          </Button>
          <Button size="sm" variant="danger" onClick={() => setValue(100)}>
            Set 100%
          </Button>
          <Button size="sm" variant="outline" onClick={() => setValue(0)}>
            Reset
          </Button>
        </div>
      </div>
    );
  },
};

// ----- Interactive Playground -----
export const Interactive: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
    label: "Interactive Range",
    suffix: "%",
    color: "primary",
    size: "md",
    valuePosition: "right",
    showValue: true,
    glow: true,
    disabled: false,
    fullWidth: true,
  },
};
