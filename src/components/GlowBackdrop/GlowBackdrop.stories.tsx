import type { Meta, StoryObj } from "@storybook/react";
import { GlowBackdrop } from "./GlowBackdrop";

const meta: Meta<typeof GlowBackdrop> = {
  title: "Components/GlowBackdrop",
  component: GlowBackdrop,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    color: { control: "text" },
    mode: {
      control: "select",
      options: ["auto", "light", "dark"],
    },
    intensity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    blur: { control: { type: "number", min: 0, max: 40 } },
  },
  args: {
    mode: "auto",
    intensity: 0.3,
    opacity: 1,
    blur: 0,
  },
};

export default meta;
type Story = StoryObj<typeof GlowBackdrop>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-64 overflow-hidden rounded-[var(--radius-large)] bg-[var(--color-bg-primary)]">
    {children}
    <div className="relative z-10 flex h-full items-center justify-center">
      <div className="glass p-6 text-center">
        <h3 className="font-heading font-bold text-[var(--color-text-primary)]">
          Glow backdrop
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Follows the primary color of the theme
        </p>
      </div>
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => (
    <Stage>
      <GlowBackdrop {...args} />
    </Stage>
  ),
};

export const Intense: Story = {
  args: { intensity: 0.6 },
  render: (args) => (
    <Stage>
      <GlowBackdrop {...args} />
    </Stage>
  ),
};

export const Blurred: Story = {
  args: { blur: 24 },
  render: (args) => (
    <Stage>
      <GlowBackdrop {...args} />
    </Stage>
  ),
};

export const CustomColor: Story = {
  args: { color: "var(--color-accent-solid)" },
  render: (args) => (
    <Stage>
      <GlowBackdrop {...args} />
    </Stage>
  ),
};
