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
    },
    padding: {
      control: "select",
      options: ["sm", "md", "lg", "none"],
    },
    radius: {
      control: "select",
      options: ["sm", "md", "standard", "large", "xl", "full"],
    },
    float: { control: "boolean" },
    glow: {
      control: "select",
      options: ["", "purple", "cyan", "pink", "primary", "secondary", "accent"],
    },
  },
  args: {
    variant: "glass",
    padding: "md",
    radius: "standard",
    float: false,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h3 className="font-heading text-xl font-bold">Default Card</h3>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Glass variant with medium padding.
        </p>
      </>
    ),
  },
};

export const Variants: Story = {
  render: function VariantsStory() {
    return (
      <div className="flex flex-wrap gap-4">
        <Card variant="glass" className="w-56">
          <h3 className="font-heading font-bold">Glass</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            blur(20px)
          </p>
        </Card>
        <Card variant="solid" className="w-56">
          <h3 className="font-heading font-bold">Solid</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            More opaque
          </p>
        </Card>
        <Card variant="outline" className="w-56">
          <h3 className="font-heading font-bold">Outline</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Border only
          </p>
        </Card>
      </div>
    );
  },
  args: {},
};

export const WithGlow: Story = {
  render: function WithGlowStory() {
    return (
      <div className="flex flex-wrap gap-4">
        <Card glow="purple" className="w-56">
          <h3 className="font-heading font-bold">Purple Glow</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Shadow glow
          </p>
        </Card>
        <Card glow="cyan" className="w-56">
          <h3 className="font-heading font-bold">Cyan Glow</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Shadow glow
          </p>
        </Card>
        <Card glow="pink" className="w-56">
          <h3 className="font-heading font-bold">Pink Glow</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Shadow glow
          </p>
        </Card>
      </div>
    );
  },
  args: {},
};

export const FloatCards: Story = {
  render: function FloatCardsStory() {
    return (
      <div className="flex flex-wrap gap-4">
        <Card float className="w-56">
          <h3 className="font-heading font-bold">Float Card</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Hover to float ✨
          </p>
        </Card>
        <Card float glow="purple" className="w-56">
          <h3 className="font-heading font-bold">Float + Glow</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Hover to float ✨
          </p>
        </Card>
      </div>
    );
  },
  args: {},
};

export const ContentExamples: Story = {
  render: function ContentExamplesStory() {
    return (
      <div className="flex flex-wrap gap-4">
        <Card className="w-64">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📦</span>
            <h3 className="font-heading font-bold">Package</h3>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm">
            A simple card with content.
          </p>
        </Card>
        <Card glow="purple" className="w-64">
          <div className="w-12 h-12 rounded-standard bg-[var(--color-primary)]/20 flex items-center justify-center text-2xl mb-3">
            🎯
          </div>
          <h3 className="font-heading font-bold">Feature Card</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            With glow effect.
          </p>
        </Card>
      </div>
    );
  },
  args: {},
};
