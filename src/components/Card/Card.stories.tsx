import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["glass", "solid", "outline"],
      description: "Card visual style",
    },
    padding: {
      control: "select",
      options: ["sm", "md", "lg", "none"],
      description: "Card padding",
    },
    radius: {
      control: "select",
      options: ["sm", "md", "standard", "large", "xl", "full"],
      description: "Card border radius",
    },
    float: {
      control: "boolean",
      description: "Float hover effect",
    },
    glow: {
      control: "select",
      options: ["none", "primary", "secondary", "accent", "success", "danger"],
      description: "Glow effect color",
    },
    fullWidth: {
      control: "boolean",
      description: "Full width card",
    },
  },
  args: {
    variant: "glass",
    padding: "md",
    radius: "standard",
    float: false,
    glow: "none",
    fullWidth: false,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default
export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <div className="space-y-2">
        <h3 className="font-heading text-xl font-bold">Default Card</h3>
        <p className="text-[var(--color-text-secondary)] text-sm">
          This is a default glass card with medium padding and standard radius.
        </p>
      </div>
    </Card>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card variant="glass" className="w-64">
        <div className="space-y-2">
          <h3 className="font-heading font-bold">Glass</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            backdrop-filter: blur(20px)
          </p>
        </div>
      </Card>
      <Card variant="solid" className="w-64">
        <div className="space-y-2">
          <h3 className="font-heading font-bold">Solid</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            More opaque, less blur
          </p>
        </div>
      </Card>
      <Card variant="outline" className="w-64">
        <div className="space-y-2">
          <h3 className="font-heading font-bold">Outline</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Transparent with border
          </p>
        </div>
      </Card>
    </div>
  ),
};

// Padding
export const Paddings: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card padding="sm" className="w-48">
        <span className="font-mono text-xs">padding: sm</span>
      </Card>
      <Card padding="md" className="w-48">
        <span className="font-mono text-xs">padding: md</span>
      </Card>
      <Card padding="lg" className="w-48">
        <span className="font-mono text-xs">padding: lg</span>
      </Card>
      <Card padding="none" className="w-48">
        <div className="p-4 bg-[var(--color-primary-light)] rounded-inherit">
          <span className="font-mono text-xs">padding: none</span>
        </div>
      </Card>
    </div>
  ),
};

// Radius
export const Radii: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card radius="sm" className="w-40">
        <span className="font-mono text-xs">radius: sm</span>
      </Card>
      <Card radius="md" className="w-40">
        <span className="font-mono text-xs">radius: md</span>
      </Card>
      <Card radius="standard" className="w-40">
        <span className="font-mono text-xs">radius: standard</span>
      </Card>
      <Card radius="large" className="w-40">
        <span className="font-mono text-xs">radius: large</span>
      </Card>
      <Card radius="xl" className="w-40">
        <span className="font-mono text-xs">radius: xl</span>
      </Card>
      <Card radius="full" className="w-40">
        <span className="font-mono text-xs">radius: full</span>
      </Card>
    </div>
  ),
};

// Float Effect
export const FloatEffect: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card float className="w-64">
        <div className="space-y-2">
          <h3 className="font-heading font-bold">Float Card</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Hover me to float ✨
          </p>
        </div>
      </Card>
      <Card float glow="primary" className="w-64">
        <div className="space-y-2">
          <h3 className="font-heading font-bold">Float + Glow</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Float with primary glow ✨
          </p>
        </div>
      </Card>
    </div>
  ),
};

// Glow Effects
export const GlowEffects: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card glow="primary" className="w-56">
        <div className="space-y-1">
          <span className="font-mono text-xs text-[var(--color-primary)]">
            primary
          </span>
          <p className="text-sm">Purple glow</p>
        </div>
      </Card>
      <Card glow="secondary" className="w-56">
        <div className="space-y-1">
          <span className="font-mono text-xs text-[var(--color-secondary)]">
            secondary
          </span>
          <p className="text-sm">Cyan glow</p>
        </div>
      </Card>
      <Card glow="accent" className="w-56">
        <div className="space-y-1">
          <span className="font-mono text-xs text-[var(--color-accent)]">
            accent
          </span>
          <p className="text-sm">Pink glow</p>
        </div>
      </Card>
      <Card glow="success" className="w-56">
        <div className="space-y-1">
          <span className="font-mono text-xs text-[var(--color-success)]">
            success
          </span>
          <p className="text-sm">Green glow</p>
        </div>
      </Card>
      <Card glow="danger" className="w-56">
        <div className="space-y-1">
          <span className="font-mono text-xs text-[var(--color-danger)]">
            danger
          </span>
          <p className="text-sm">Red glow</p>
        </div>
      </Card>
    </div>
  ),
};

// Float + Glow Combinations
export const FloatWithGlow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card float glow="primary" className="w-64">
        <div className="space-y-2">
          <h3 className="font-heading font-bold">Primary Glow</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Float + primary glow
          </p>
        </div>
      </Card>
      <Card float glow="secondary" className="w-64">
        <div className="space-y-2">
          <h3 className="font-heading font-bold">Secondary Glow</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Float + secondary glow
          </p>
        </div>
      </Card>
      <Card float glow="accent" className="w-64">
        <div className="space-y-2">
          <h3 className="font-heading font-bold">Accent Glow</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Float + accent glow
          </p>
        </div>
      </Card>
    </div>
  ),
};

// Card Content Examples
export const ContentExamples: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {/* Simple Card */}
      <Card className="w-64">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <h3 className="font-heading font-bold">Package</h3>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm">
            A simple card with an icon, title, and description text.
          </p>
          <div className="flex gap-2 pt-2">
            <span className="text-xs text-[var(--color-primary)] font-mono">
              #design
            </span>
            <span className="text-xs text-[var(--color-secondary)] font-mono">
              #ui
            </span>
          </div>
        </div>
      </Card>

      {/* Feature Card */}
      <Card glow="primary" className="w-64">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-standard bg-[var(--color-primary-light)] flex items-center justify-center text-2xl">
            🎯
          </div>
          <h3 className="font-heading font-bold">Feature Card</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            A feature card with a glow effect and an icon.
          </p>
          <button className="btn-dara btn-primary text-sm px-4 py-1.5">
            Learn More
          </button>
        </div>
      </Card>

      {/* Stats Card */}
      <Card variant="solid" className="w-64">
        <div className="space-y-3">
          <p className="text-[var(--color-text-tertiary)] text-xs font-mono uppercase tracking-wider">
            Total Users
          </p>
          <p className="text-3xl font-heading font-bold text-gradient-primary">
            12,847
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-success)] text-sm">↑ 12.5%</span>
            <span className="text-[var(--color-text-tertiary)] text-xs">
              from last month
            </span>
          </div>
        </div>
      </Card>
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Card fullWidth>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-heading font-bold">Full Width Card</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">
              This card stretches to fill its container.
            </p>
          </div>
          <span className="text-2xl">📐</span>
        </div>
      </Card>
      <Card fullWidth variant="solid">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-heading font-bold">Solid Full Width</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Solid variant with full width.
            </p>
          </div>
          <span className="text-2xl">📏</span>
        </div>
      </Card>
    </div>
  ),
};

// Interactive Playground
export const Interactive: Story = {
  args: {
    variant: "glass",
    padding: "md",
    radius: "standard",
    float: false,
    glow: "none",
    fullWidth: false,
  },
  render: (args) => (
    <Card {...args} className="w-96">
      <div className="space-y-3">
        <h3 className="font-heading text-xl font-bold">Interactive Card</h3>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Play with the controls in the Storybook panel to see different
          combinations of variant, padding, radius, float, and glow.
        </p>
        <div className="flex gap-2 pt-2">
          <span className="px-2 py-0.5 text-xs bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full">
            Interactive
          </span>
          <span className="px-2 py-0.5 text-xs bg-[var(--color-secondary-light)] text-[var(--color-secondary)] rounded-full">
            Demo
          </span>
        </div>
      </div>
    </Card>
  ),
};
