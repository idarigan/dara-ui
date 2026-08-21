import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "accent",
        "glass",
        "danger",
        "success",
        "outline",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    glow: {
      control: "select",
      options: ["", "primary", "secondary", "accent"],
    },
    fullWidth: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
};

export const Variants: Story = {
  render: function VariantsStory() {
    return (
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="glass">Glass</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="success">Success</Button>
        <Button variant="outline">Outline</Button>
      </div>
    );
  },
  args: {},
};

export const Sizes: Story = {
  render: function SizesStory() {
    return (
      <div className="flex flex-wrap gap-3 items-center">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    );
  },
  args: {},
};

export const WithGlow: Story = {
  render: function WithGlowStory() {
    return (
      <div className="flex flex-wrap gap-3">
        <Button glow="primary" variant="primary">
          Primary Glow
        </Button>
        <Button glow="secondary" variant="secondary">
          Secondary Glow
        </Button>
        <Button glow="accent" variant="accent">
          Accent Glow
        </Button>
      </div>
    );
  },
  args: {},
};

export const Loading: Story = {
  render: function LoadingStory() {
    return (
      <div className="flex flex-wrap gap-3">
        <Button loading>Loading</Button>
        <Button loading variant="success">
          Processing
        </Button>
      </div>
    );
  },
  args: {},
};

export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <div className="flex flex-wrap gap-3">
        <Button disabled>Disabled</Button>
        <Button disabled variant="secondary">
          Disabled Secondary
        </Button>
      </div>
    );
  },
  args: {},
};

export const WithIcons: Story = {
  render: function WithIconsStory() {
    return (
      <div className="flex flex-wrap gap-3">
        <Button leftIcon={<span>🚀</span>}>Launch</Button>
        <Button rightIcon={<span>→</span>} variant="secondary">
          Next
        </Button>
      </div>
    );
  },
  args: {},
};

export const FullWidth: Story = {
  render: function FullWidthStory() {
    return (
      <div className="w-80">
        <Button fullWidth>Full Width Button</Button>
      </div>
    );
  },
  args: {},
};

export const Interactive: Story = {
  args: {
    children: "Click me!",
    variant: "primary",
    size: "md",
    glow: "primary",
  },
};
