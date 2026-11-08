import type { Meta, StoryObj } from "@storybook/react";
import { Particles } from "./Particles";

const meta: Meta<typeof Particles> = {
  title: "Components/Particles",
  component: Particles,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    count: { control: { type: "number", min: 0, max: 400 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    colors: { control: "object" },
    interactive: { control: "boolean" },
  },
  args: {
    count: 60,
    opacity: 0.5,
    interactive: true,
  },
};

export default meta;
type Story = StoryObj<typeof Particles>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-64 overflow-hidden rounded-[var(--radius-large)] bg-[var(--color-bg-primary)]">
    {children}
    <div className="relative z-10 flex h-full items-center justify-center text-[var(--color-text-primary)]">
      Particle field
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => (
    <Stage>
      <Particles {...args} />
    </Stage>
  ),
};

export const SingleColor: Story = {
  args: { colors: "#22d3ee" },
  render: (args) => (
    <Stage>
      <Particles {...args} />
    </Stage>
  ),
};

export const MultipleColors: Story = {
  args: { colors: ["#f472b6", "#fbbf24", "var(--color-success)"], count: 120 },
  render: (args) => (
    <Stage>
      <Particles {...args} />
    </Stage>
  ),
};
