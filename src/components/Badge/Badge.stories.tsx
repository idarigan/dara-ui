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
      description: "Badge color variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Badge size",
    },
    glow: {
      control: "boolean",
      description: "Adds glow effect",
    },
    outline: {
      control: "boolean",
      description: "Outlined style with transparent background",
    },
    children: {
      control: "text",
      description: "Badge content",
    },
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

// ----- Default -----
export const Default: Story = {
  args: {
    children: "Badge",
    variant: "primary",
    size: "md",
  },
};

// ----- Variants -----
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3 flex-wrap">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  ),
};

// ----- Sizes -----
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3 flex-wrap">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

// ----- Outline Variants -----
export const OutlineVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3 flex-wrap">
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

// ----- With Glow -----
export const WithGlow: Story = {
  render: () => (
    <div className="flex items-center gap-3 flex-wrap">
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

// ----- Outline + Glow -----
export const OutlineWithGlow: Story = {
  render: () => (
    <div className="flex items-center gap-3 flex-wrap">
      <Badge outline glow variant="primary">
        Outline Glow
      </Badge>
      <Badge outline glow variant="success">
        Outline Glow
      </Badge>
      <Badge outline glow variant="danger">
        Outline Glow
      </Badge>
    </div>
  ),
};

// ----- With Icons -----
export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-3 flex-wrap">
      <Badge variant="primary">
        <span className="mr-1">📦</span> Package
      </Badge>
      <Badge variant="success">
        <span className="mr-1">✅</span> Done
      </Badge>
      <Badge variant="warning">
        <span className="mr-1">⚠️</span> Pending
      </Badge>
      <Badge variant="danger">
        <span className="mr-1">❌</span> Failed
      </Badge>
    </div>
  ),
};

// ----- Status Badges (Common use cases) -----
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="success">Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="danger">Inactive</Badge>
        <Badge variant="secondary">Archived</Badge>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Badge outline variant="success">
          Active
        </Badge>
        <Badge outline variant="warning">
          Pending
        </Badge>
        <Badge outline variant="danger">
          Inactive
        </Badge>
        <Badge outline variant="secondary">
          Archived
        </Badge>
      </div>
    </div>
  ),
};

// ----- Number Badges -----
export const NumberBadges: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Badge variant="primary">+42</Badge>
      <Badge variant="success">99+</Badge>
      <Badge variant="danger">3</Badge>
      <Badge outline variant="primary">
        7
      </Badge>
    </div>
  ),
};

// ----- All Variants (reference) -----
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Solid Row */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="warning">Warning</Badge>
      </div>
      {/* Outline Row */}
      <div className="flex items-center gap-3 flex-wrap">
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
      {/* Glow Row */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge glow variant="primary">
          Primary
        </Badge>
        <Badge glow variant="success">
          Success
        </Badge>
        <Badge glow variant="danger">
          Danger
        </Badge>
        <Badge glow variant="warning">
          Warning
        </Badge>
      </div>
      {/* Sizes Row */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
    </div>
  ),
};
