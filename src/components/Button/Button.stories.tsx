import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "danger", "warning"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    glow: { control: "boolean" },
    outline: { control: "boolean" },
  },
  args: {
    children: "Badge",
    variant: "primary",
    size: "md",
    glow: false,
    outline: false,
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  ),
};

export const OutlineVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge outline variant="primary">
        Primary
      </Badge>
      <Badge outline variant="secondary">
        Secondary
      </Badge>
      <Badge outline variant="success">
        Success
      </Badge>
      <Badge outline variant="danger">
        Danger
      </Badge>
      <Badge outline variant="warning">
        Warning
      </Badge>
    </div>
  ),
};

export const WithGlow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge glow variant="primary">
        Glow Primary
      </Badge>
      <Badge glow variant="success">
        Glow Success
      </Badge>
      <Badge glow variant="danger">
        Glow Danger
      </Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="primary">📦 Package</Badge>
      <Badge variant="success">✅ Done</Badge>
      <Badge variant="warning">⚠️ Pending</Badge>
      <Badge variant="danger">❌ Failed</Badge>
    </div>
  ),
};
