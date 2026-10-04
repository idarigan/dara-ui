import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "hero"],
    },
    shape: {
      control: "select",
      options: ["circle", "rounded", "square"],
    },
    status: {
      control: "select",
      options: ["online", "offline", "away", "busy"],
    },
    glow: {
      control: "select",
      options: ["", "primary", "secondary", "accent"],
    },
    bordered: { control: "boolean" },
    fallback: { control: "boolean" },
  },
  args: {
    size: "md",
    shape: "circle",
    bordered: false,
    fallback: false,
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default (with image) -----
export const Default: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=1",
    alt: "User avatar",
    size: "md",
  },
};

// ----- Sizes -----
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs" fallbackText="JD" />
      <Avatar size="sm" fallbackText="JD" />
      <Avatar size="md" fallbackText="JD" />
      <Avatar size="lg" fallbackText="JD" />
      <Avatar size="xl" fallbackText="JD" />
      <Avatar size="hero" fallbackText="JD" />
    </div>
  ),
};

// ----- Hero Size -----
export const HeroSize: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Avatar
        size="hero"
        src="https://i.pravatar.cc/300?img=5"
        alt="Profile"
        glow="primary"
        bordered
      />
      <Avatar
        size="hero"
        src="https://i.pravatar.cc/300?img=9"
        alt="Profile"
        shape="rounded"
        glow="secondary"
      />
      <Avatar size="hero" fallbackText="Dara" glow="accent" />
    </div>
  ),
};

// ----- Profile Block (Hero + Text) -----
export const ProfileBlock: Story = {
  render: () => (
    <div className="glass p-6 rounded-[var(--radius-large)] flex items-center gap-6 max-w-lg">
      <Avatar
        size="hero"
        src="https://i.pravatar.cc/300?img=12"
        alt="Dara"
        glow="primary"
        bordered
        status="online"
      />
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-heading text-2xl font-bold text-[var(--color-text-primary)]">
          Dara
        </h3>
        <p className="text-sm font-mono text-[var(--color-primary)]">
          @dara_ui
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
          Building futuristic interfaces one glassmorphism card at a time.
          Archivist of the digital snowstorm.
        </p>
      </div>
    </div>
  ),
};

// ----- Shapes -----
export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar shape="circle" fallbackText="JD" />
      <Avatar shape="rounded" fallbackText="JD" />
      <Avatar shape="square" fallbackText="JD" />
    </div>
  ),
};

// ----- With Status -----
export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar status="online" fallbackText="JD" />
      <Avatar status="away" fallbackText="JD" />
      <Avatar status="busy" fallbackText="JD" />
      <Avatar status="offline" fallbackText="JD" />
    </div>
  ),
};

// ----- With Glow -----
export const WithGlow: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar glow="primary" fallbackText="JD" />
      <Avatar glow="secondary" fallbackText="JD" />
      <Avatar glow="accent" fallbackText="JD" />
    </div>
  ),
};

// ----- Bordered -----
export const Bordered: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar bordered fallbackText="JD" />
      <Avatar bordered glow="primary" fallbackText="JD" />
    </div>
  ),
};

// ----- Fallback Initials -----
export const FallbackInitials: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallbackText="JD" />
      <Avatar fallbackText="John Doe" />
      <Avatar fallbackText="Jane Smith" />
      <Avatar fallbackText="A" />
    </div>
  ),
};

// ----- Fallback Icon -----
export const FallbackIcon: Story = {
  args: {
    fallback: true,
    size: "md",
  },
};

// ----- With Click -----
export const WithClick: Story = {
  render: () => (
    <Avatar
      fallbackText="JD"
      onClick={() => alert("Avatar clicked!")}
      glow="primary"
    />
  ),
};

// ----- Group -----
export const Group: Story = {
  render: () => (
    <Avatar group size="md">
      <Avatar fallbackText="JD" />
      <Avatar fallbackText="JS" />
      <Avatar fallbackText="AK" />
      <Avatar fallbackText="MR" />
    </Avatar>
  ),
};
