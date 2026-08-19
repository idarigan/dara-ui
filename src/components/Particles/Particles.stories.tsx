import type { Meta, StoryObj } from "@storybook/react-vite";
import { Particles } from "./Particles";

const meta: Meta<typeof Particles> = {
  title: "Components/Particles",
  component: Particles,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Particles>;

export const Default: Story = {
  render: () => (
    <div className="relative h-64 overflow-hidden rounded-[var(--radius-large)] bg-[var(--color-bg-primary)]">
      <Particles count={60} />
      <div className="relative z-10 flex h-full items-center justify-center text-[var(--color-text-primary)]">
        Particle field
      </div>
    </div>
  ),
};
