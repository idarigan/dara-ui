import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";
import { useState } from "react";
import Button from "../Button/Button";

const meta = {
  title: "Components/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["horizontal", "radial"],
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
        "gradient",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    showLabel: { control: "boolean" },
    animated: { control: "boolean" },
    glow: { control: "boolean" },
    value: { control: "number", min: 0, max: 100 },
    max: { control: "number", min: 1, max: 200 },
  },
  args: {
    value: 45,
    max: 100,
    variant: "horizontal",
    size: "md",
    color: "primary",
    showLabel: true,
    animated: true,
    glow: false,
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default (Horizontal) -----
export const Default: Story = {};

// ----- Horizontal Variants -----
export const HorizontalVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Progress value={75} color="primary" labelPosition="right" />
      <Progress value={60} color="secondary" labelPosition="right" />
      <Progress value={45} color="accent" labelPosition="right" />
      <Progress value={80} color="success" labelPosition="right" />
      <Progress value={30} color="danger" labelPosition="right" />
      <Progress value={90} color="warning" labelPosition="right" />
      <Progress value={55} color="gradient" labelPosition="right" />
    </div>
  ),
};

// ----- Horizontal Sizes -----
export const HorizontalSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Progress value={50} size="sm" labelPosition="right" />
      <Progress value={65} size="md" labelPosition="right" />
      <Progress value={80} size="lg" labelPosition="right" />
    </div>
  ),
};

// ----- Label Positions -----
export const LabelPositions: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Progress value={60} labelPosition="left" />
      <Progress value={60} labelPosition="right" />
      <Progress value={60} labelPosition="top" />
      <Progress value={60} labelPosition="bottom" />
    </div>
  ),
};

// ----- Radial Variants -----
export const RadialVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 items-center justify-center">
      <Progress variant="radial" value={75} color="primary" radialSize={80} />
      <Progress variant="radial" value={60} color="secondary" radialSize={80} />
      <Progress variant="radial" value={45} color="accent" radialSize={80} />
      <Progress variant="radial" value={80} color="success" radialSize={80} />
      <Progress variant="radial" value={30} color="danger" radialSize={80} />
      <Progress variant="radial" value={90} color="warning" radialSize={80} />
    </div>
  ),
};

// ----- Radial Sizes -----
export const RadialSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 items-center justify-center">
      <Progress variant="radial" value={50} size="sm" radialSize={64} />
      <Progress variant="radial" value={65} size="md" radialSize={80} />
      <Progress variant="radial" value={80} size="lg" radialSize={100} />
    </div>
  ),
};

// ----- No Label -----
export const NoLabel: Story = {
  args: {
    showLabel: false,
    value: 70,
  },
};

// ----- Custom Label Format -----
export const CustomLabelFormat: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Progress
        value={3}
        max={5}
        labelFormat={(val, maxVal) => `${val}/${maxVal}`}
        labelPosition="right"
      />
      <Progress
        value={75}
        max={100}
        labelFormat={(val) => `${val}% Completed`}
        labelPosition="right"
        color="success"
      />
    </div>
  ),
};

// ----- With Glow (Horizontal) -----
export const WithGlow: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
        Horizontal with glow effect
      </p>
      <Progress value={75} color="primary" labelPosition="right" glow />
      <Progress value={60} color="secondary" labelPosition="right" glow />
      <Progress value={45} color="accent" labelPosition="right" glow />
      <Progress value={80} color="success" labelPosition="right" glow />
      <Progress value={30} color="danger" labelPosition="right" glow />
      <Progress value={90} color="warning" labelPosition="right" glow />
      <Progress value={55} color="gradient" labelPosition="right" glow />
    </div>
  ),
};

// ----- With Glow (Radial) -----
export const WithGlowRadial: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 items-center justify-center">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono w-full text-center mb-2">
        Radial with glow effect
      </p>
      <Progress
        variant="radial"
        value={75}
        color="primary"
        radialSize={80}
        glow
      />
      <Progress
        variant="radial"
        value={60}
        color="secondary"
        radialSize={80}
        glow
      />
      <Progress
        variant="radial"
        value={45}
        color="accent"
        radialSize={80}
        glow
      />
      <Progress
        variant="radial"
        value={80}
        color="success"
        radialSize={80}
        glow
      />
      <Progress
        variant="radial"
        value={30}
        color="danger"
        radialSize={80}
        glow
      />
      <Progress
        variant="radial"
        value={90}
        color="warning"
        radialSize={80}
        glow
      />
    </div>
  ),
};

// ----- Interactive (with controls) -----
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(45);
    const [variant, setVariant] = useState<"horizontal" | "radial">(
      "horizontal",
    );
    const [showGlow, setShowGlow] = useState(false);

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={variant === "horizontal" ? "primary" : "outline"}
            onClick={() => setVariant("horizontal")}
          >
            Horizontal
          </Button>
          <Button
            size="sm"
            variant={variant === "radial" ? "primary" : "outline"}
            onClick={() => setVariant("radial")}
          >
            Radial
          </Button>
          <Button
            size="sm"
            variant={showGlow ? "primary" : "outline"}
            onClick={() => setShowGlow(!showGlow)}
          >
            {showGlow ? "Glow ON" : "Glow OFF"}
          </Button>
        </div>

        <Progress
          variant={variant}
          value={value}
          color="gradient"
          showLabel
          radialSize={100}
          size="lg"
          glow={showGlow}
        />

        <div className="flex gap-3 flex-wrap">
          <Button size="sm" onClick={() => setValue(Math.min(100, value + 10))}>
            +10%
          </Button>
          <Button size="sm" onClick={() => setValue(Math.max(0, value - 10))}>
            -10%
          </Button>
          <Button size="sm" variant="outline" onClick={() => setValue(45)}>
            Reset
          </Button>
          <Button size="sm" variant="success" onClick={() => setValue(100)}>
            Complete
          </Button>
        </div>
      </div>
    );
  },
};

// ----- Gradient Bar -----
export const GradientBar: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Progress value={65} color="gradient" labelPosition="right" />
      <Progress value={75} color="gradient" size="lg" labelPosition="right" />
      <Progress variant="radial" value={85} color="gradient" radialSize={100} />
    </div>
  ),
};

// ----- Without Animation -----
export const WithoutAnimation: Story = {
  args: {
    animated: false,
    value: 60,
  },
};
