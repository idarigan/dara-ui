import type { Meta, StoryObj } from "@storybook/react-vite";
import { GradientRing } from "./GradientRing";

const meta: Meta<typeof GradientRing> = {
  title: "Components/GradientRing",
  component: GradientRing,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GradientRing>;

export const Default: Story = {
  args: { size: 64 },
  render: (args) => (
    <GradientRing {...args}>
      <div
        className="flex h-full w-full items-center justify-center rounded-full bg-[var(--color-bg-tertiary)] text-sm font-bold text-[var(--color-text-primary)]"
        style={{ width: (args.size ?? 64) - 8, height: (args.size ?? 64) - 8 }}
      >
        DR
      </div>
    </GradientRing>
  ),
};
