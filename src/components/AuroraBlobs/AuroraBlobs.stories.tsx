import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuroraBlobs } from "./AuroraBlobs";

const meta: Meta<typeof AuroraBlobs> = {
  title: "Components/AuroraBlobs",
  component: AuroraBlobs,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof AuroraBlobs>;

export const Default: Story = {
  render: () => (
    <div className="relative h-64 overflow-hidden rounded-[var(--radius-large)] bg-[var(--color-bg-primary)]">
      <AuroraBlobs />
      <div className="relative z-10 flex h-full items-center justify-center text-[var(--color-text-primary)]">
        Content above blobs
      </div>
    </div>
  ),
};
