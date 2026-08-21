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
      description: "Border radius of the card",
    },
    float: { control: "boolean" },
    glow: {
      control: "select",
      options: ["", "primary", "secondary", "accent"],
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
};

export const RadiusExamples: Story = {
  render: function RadiusExamplesStory() {
    return (
      <div className="flex flex-wrap gap-4">
        <Card radius="sm" className="w-48">
          <h3 className="font-heading font-bold text-sm">Radius: sm</h3>
          <p className="text-[var(--color-text-secondary)] text-xs">6px</p>
        </Card>
        <Card radius="md" className="w-48">
          <h3 className="font-heading font-bold text-sm">Radius: md</h3>
          <p className="text-[var(--color-text-secondary)] text-xs">10px</p>
        </Card>
        <Card radius="standard" className="w-48">
          <h3 className="font-heading font-bold text-sm">Radius: standard</h3>
          <p className="text-[var(--color-text-secondary)] text-xs">18px</p>
        </Card>
        <Card radius="large" className="w-48">
          <h3 className="font-heading font-bold text-sm">Radius: large</h3>
          <p className="text-[var(--color-text-secondary)] text-xs">24px</p>
        </Card>
        <Card radius="xl" className="w-48">
          <h3 className="font-heading font-bold text-sm">Radius: xl</h3>
          <p className="text-[var(--color-text-secondary)] text-xs">32px</p>
        </Card>
        <Card radius="full" className="w-48">
          <h3 className="font-heading font-bold text-sm">Radius: full</h3>
          <p className="text-[var(--color-text-secondary)] text-xs">9999px</p>
        </Card>
      </div>
    );
  },
};

export const WithGlow: Story = {
  render: function WithGlowStory() {
    return (
      <div className="flex flex-wrap gap-4">
        <Card glow="primary" className="w-56">
          <h3 className="font-heading font-bold">Primary Glow</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Shadow glow
          </p>
        </Card>
        <Card glow="secondary" className="w-56">
          <h3 className="font-heading font-bold">Secondary Glow</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Shadow glow
          </p>
        </Card>
        <Card glow="accent" className="w-56">
          <h3 className="font-heading font-bold">Accent Glow</h3>
          <p className="text-[var(--color-text-accent)] text-sm">Shadow glow</p>
        </Card>
      </div>
    );
  },
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
        <Card float glow="primary" className="w-56">
          <h3 className="font-heading font-bold">Float + Glow</h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Hover to float ✨
          </p>
        </Card>
      </div>
    );
  },
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
        <Card glow="primary" className="w-64">
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
};

export const Interactive: Story = {
  args: {
    variant: "glass",
    padding: "md",
    radius: "standard",
    float: false,
    glow: "",
    children: (
      <>
        <h3 className="font-heading text-xl font-bold">Interactive Card</h3>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Change the props in the controls panel.
        </p>
      </>
    ),
  },
};
