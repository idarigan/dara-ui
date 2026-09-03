import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Introduction",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="text-center max-w-2xl p-8">
      <h1 className="font-heading text-4xl font-bold text-gradient-primary mb-4">
        Dara UI
      </h1>
      <p className="text-[var(--color-text-secondary)] text-lg mb-6">
        A design system discovered inside a futuristic archive hidden beneath .
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm">
          Glassmorphism
        </span>
        <span className="px-3 py-1 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-sm">
          Cyberpunk
        </span>
        <span className="px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm">
          Gothic
        </span>
        <span className="px-3 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-sm">
          Apple Minimalism
        </span>
      </div>
    </div>
  ),
};
