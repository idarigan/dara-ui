import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { fn } from "@storybook/test";

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
      options: ["primary", "secondary", "glass", "danger", "success"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    glow: {
      control: "select",
      options: ["", "purple", "cyan", "pink"],
    },
    fullWidth: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    onClick: fn(),
  },
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
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="glass">Glass</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="success">Success</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithGlow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button glow="purple" variant="primary">
        Purple Glow
      </Button>
      <Button glow="cyan" variant="primary">
        Cyan Glow
      </Button>
      <Button glow="pink" variant="primary">
        Pink Glow
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button loading>Loading</Button>
      <Button loading variant="success">
        Processing
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button disabled>Disabled</Button>
      <Button disabled variant="secondary">
        Disabled Secondary
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button leftIcon="🚀">Launch</Button>
      <Button rightIcon="→" variant="secondary">
        Next
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-80">
      <Button fullWidth>Full Width Button</Button>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    children: "Click me!",
    variant: "primary",
    size: "md",
    glow: "purple",
  },
};
