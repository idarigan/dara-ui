import type { Meta, StoryObj } from "@storybook/react";
import { AuroraBlobs } from "../components/AuroraBlobs/AuroraBlobs";
import { Particles } from "../components/Particles/Particles";
import { GradientRing } from "../components/GradientRing/GradientRing";
import { NoiseOverlay } from "../components/NoiseOverlay/NoiseOverlay";

const meta = {
  title: "Visual Effects",
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: false,
          },
        ],
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AuroraBlobsDemo: Story = {
  render: () => (
    <div className="relative h-96 w-full overflow-hidden rounded-[var(--radius-large)] bg-[var(--color-bg-primary)]">
      <AuroraBlobs />
      <div className="relative z-10 flex h-full items-center justify-center text-[var(--color-text-primary)]">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold">Aurora Blobs</h2>
          <p className="text-[var(--color-text-secondary)]">
            Animated gradient blob background effect
          </p>
        </div>
      </div>
    </div>
  ),
};

export const ParticlesDemo: Story = {
  render: () => (
    <div className="relative h-96 w-full overflow-hidden rounded-[var(--radius-large)] bg-[var(--color-bg-primary)]">
      <Particles count={80} />
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center bg-[var(--color-bg-secondary)]/80 backdrop-blur-sm p-6 rounded-[var(--radius-large)] border border-[var(--color-border-primary)]">
          <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)]">
            Particles
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Animated starfield particle background
          </p>
        </div>
      </div>
    </div>
  ),
};

export const GradientRingDemo: Story = {
  render: () => (
    <div className="relative h-96 w-full overflow-hidden rounded-[var(--radius-large)] bg-[var(--color-bg-primary)] flex items-center justify-center">
      <GradientRing size={200} />
      <div className="relative z-10 text-center">
        <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)]">
          Gradient Ring
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Spinning conic gradient decorative ring
        </p>
      </div>
    </div>
  ),
};

export const NoiseOverlayDemo: Story = {
  render: () => (
    <div className="relative h-96 w-full overflow-hidden rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
      <NoiseOverlay opacity={0.05} />
      <div className="relative z-10 flex h-full items-center justify-center text-[var(--color-text-primary)]">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold">Noise Overlay</h2>
          <p className="text-[var(--color-text-secondary)]">
            Subtle noise texture overlay effect
          </p>
        </div>
      </div>
    </div>
  ),
};

export const AllEffects: Story = {
  render: () => (
    <div className="relative h-96 w-full overflow-hidden rounded-[var(--radius-large)] bg-[var(--color-bg-primary)]">
      <NoiseOverlay opacity={0.035} />
      <AuroraBlobs />
      <Particles count={40} />
      <GradientRing size={300} />
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center bg-[var(--color-bg-secondary)]/50 backdrop-blur-sm p-8 rounded-[var(--radius-large)] glass">
          <h2 className="font-heading text-3xl font-bold text-gradient-primary">
            All Effects Combined
          </h2>
          <p className="text-[var(--color-text-secondary)] mt-2">
            AuroraBlobs + Particles + GradientRing + NoiseOverlay
          </p>
        </div>
      </div>
    </div>
  ),
};
