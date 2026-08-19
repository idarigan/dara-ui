import type { Meta, StoryObj } from "@storybook/react-vite";
import { NoiseOverlay } from "./NoiseOverlay";

const meta: Meta<typeof NoiseOverlay> = {
  title: "Components/NoiseOverlay",
  component: NoiseOverlay,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof NoiseOverlay>;

export const Default: Story = {
  render: () => (
    <div className="relative h-64 overflow-hidden rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
      <NoiseOverlay />
      <div className="relative z-10 flex h-full items-center justify-center text-[var(--color-text-primary)]">
        Noise overlay
      </div>
    </div>
  ),
};
