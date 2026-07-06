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
      options: [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "danger",
        "success",
        "glass",
      ],
      description: "Button visual style variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Button size",
    },
    fullWidth: {
      control: "boolean",
      description: "Button takes full width of container",
    },
    loading: {
      control: "boolean",
      description: "Shows loading spinner",
    },
    disabled: {
      control: "boolean",
      description: "Disables button interaction",
    },
    glow: {
      control: "boolean",
      description: "Adds glow effect on hover",
    },
    children: {
      control: "text",
      description: "Button content",
    },
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
    <div className="flex items-center gap-4 flex-wrap">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="success">Success</Button>
      <Button variant="glass">Glass</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Button
        leftIcon={
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        }
      >
        Add Item
      </Button>
      <Button
        rightIcon={
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        }
        variant="secondary"
      >
        Next
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Button loading>Loading</Button>
      <Button loading variant="secondary">
        Processing
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

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Button disabled>Disabled</Button>
      <Button disabled variant="secondary">
        Disabled Secondary
      </Button>
    </div>
  ),
};

export const WithGlow: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Button glow variant="primary">
        Glow Primary
      </Button>
      <Button glow variant="success">
        Glow Success
      </Button>
      <Button glow variant="danger">
        Glow Danger
      </Button>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    children: "Click me!",
    variant: "primary",
    size: "md",
    fullWidth: false,
    loading: false,
    disabled: false,
    glow: false,
  },
};
