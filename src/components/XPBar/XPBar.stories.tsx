import type { Meta, StoryObj } from "@storybook/react";
import { XPBar } from "./XPBar";
import { useState } from "react";
import Button from "../Button/Button";

const meta = {
  title: "Components/XPBar",
  component: XPBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "number",
      description: "Current XP value",
    },
    max: {
      control: "number",
      description: "Maximum XP for current level",
    },
    level: {
      control: "number",
      description: "Current level number",
    },
    showLabel: {
      control: "boolean",
      description: "Show 'X XP to next level' label",
    },
  },
  args: {
    value: 3400,
    max: 5000,
    level: 14,
    showLabel: true,
  },
} satisfies Meta<typeof XPBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {};

// ----- Different Levels -----
export const DifferentLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <XPBar value={1200} max={3000} level={5} />
      <XPBar value={3400} max={5000} level={14} />
      <XPBar value={7800} max={10000} level={27} />
      <XPBar value={150} max={1000} level={2} />
    </div>
  ),
};

// ----- Various Progress States -----
export const VariousProgress: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <XPBar value={0} max={5000} level={14} />
      <XPBar value={1250} max={5000} level={14} />
      <XPBar value={3400} max={5000} level={14} />
      <XPBar value={4800} max={5000} level={14} />
      <XPBar value={5000} max={5000} level={14} />
    </div>
  ),
};

// ----- Without Label -----
export const WithoutLabel: Story = {
  args: {
    showLabel: false,
  },
};

// ----- Interactive -----
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(3400);
    const [level, setLevel] = useState(14);
    const max = 5000;

    const addXP = (amount: number) => {
      let newValue = value + amount;
      let newLevel = level;

      // Level up logic
      while (newValue >= max) {
        newValue -= max;
        newLevel++;
      }

      setValue(newValue);
      setLevel(newLevel);
    };

    return (
      <div className="flex flex-col items-center gap-6 w-80">
        <XPBar value={value} max={max} level={level} />

        <div className="flex gap-2 flex-wrap justify-center">
          <Button size="sm" onClick={() => addXP(50)}>
            +50 XP
          </Button>
          <Button size="sm" variant="secondary" onClick={() => addXP(200)}>
            +200 XP
          </Button>
          <Button size="sm" variant="success" onClick={() => addXP(500)}>
            +500 XP
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setValue(0);
              setLevel(1);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  },
};

// ----- With Custom Max -----
export const CustomMax: Story = {
  args: {
    value: 750,
    max: 1000,
    level: 3,
  },
};

// ----- Large Numbers -----
export const LargeNumbers: Story = {
  args: {
    value: 12450,
    max: 20000,
    level: 42,
  },
};
