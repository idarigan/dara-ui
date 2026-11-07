import type { Meta, StoryObj } from "@storybook/react";
import { Topography } from "./Topography";

const meta = {
  title: "Components/Topography",
  component: Topography,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["auto", "light", "dark"],
    },
    markers: {
      control: "select",
      options: ["none", "cross", "dot"],
    },
    interactive: { control: "boolean" },
    lineCount: { control: "number", min: 4, max: 40 },
    lineWidth: { control: "number", min: 0.5, max: 4, step: 0.1 },
    speed: { control: "number", min: 0, max: 1, step: 0.05 },
    elevation: { control: "number", min: 0.2, max: 1.2, step: 0.05 },
    tilt: { control: "number", min: 30, max: 90 },
    fps: { control: "number", min: 10, max: 60 },
  },
  args: {
    mode: "auto",
    markers: "dot",
    interactive: true,
    lineCount: 18,
    lineWidth: 1.5,
    speed: 0.25,
    elevation: 0.65,
    tilt: 90,
    fps: 30,
  },
} satisfies Meta<typeof Topography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="relative min-h-screen bg-[var(--color-bg-primary)]">
      <Topography {...args} />
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="glass p-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)]">
            Topography
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Move the mouse to lean the terrain and light up the lines
          </p>
        </div>
      </div>
    </div>
  ),
};

export const WithCrosses: Story = {
  args: {
    markers: "cross",
  },
  render: (args) => (
    <div className="relative min-h-screen bg-[var(--color-bg-primary)]">
      <Topography {...args} />
    </div>
  ),
};

export const Static: Story = {
  args: {
    interactive: false,
    speed: 0,
    morph: 0,
  },
  render: (args) => (
    <div className="relative min-h-screen bg-[var(--color-bg-primary)]">
      <Topography {...args} />
    </div>
  ),
};
