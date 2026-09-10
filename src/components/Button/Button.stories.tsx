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
      <div className="flex flex-wrap gap-3 p-4 bg-[var(--color-bg-secondary)] rounded-[var(--radius-standard)]">
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
      <div className="flex flex-wrap gap-3 items-center p-4 bg-[var(--color-bg-secondary)] rounded-[var(--radius-standard)]">
        <Button size="sm" variant="primary">
          Small
        </Button>
        <Button size="md" variant="primary">
          Medium
        </Button>
        <Button size="lg" variant="primary">
          Large
        </Button>
      </div>
    );
  },
  args: {},
};

export const WithGlow: Story = {
  render: function WithGlowStory() {
    return (
      <div className="flex flex-wrap gap-3 p-4 bg-[var(--color-bg-secondary)] rounded-[var(--radius-standard)]">
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
      <div className="flex flex-wrap gap-3 p-4 bg-[var(--color-bg-secondary)] rounded-[var(--radius-standard)]">
        <Button loading variant="primary">
          Loading
        </Button>
        <Button loading variant="success">
          Processing
        </Button>
        <Button loading variant="danger">
          Deleting
        </Button>
      </div>
    );
  },
  args: {},
};

export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <div className="flex flex-wrap gap-3 p-4 bg-[var(--color-bg-secondary)] rounded-[var(--radius-standard)]">
        <Button disabled variant="primary">
          Disabled
        </Button>
        <Button disabled variant="secondary">
          Disabled Secondary
        </Button>
        <Button disabled variant="outline">
          Disabled Outline
        </Button>
      </div>
    );
  },
  args: {},
};

export const WithIcons: Story = {
  render: function WithIconsStory() {
    return (
      <div className="flex flex-wrap gap-3 p-4 bg-[var(--color-bg-secondary)] rounded-[var(--radius-standard)]">
        <Button
          leftIcon={
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
          variant="primary"
        >
          Launch
        </Button>
        <Button
          rightIcon={
            <svg
              className="h-4 w-4 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          }
          variant="secondary"
        >
          Next
        </Button>
        <Button
          leftIcon={
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          }
          variant="success"
        >
          Confirm
        </Button>
      </div>
    );
  },
  args: {},
};

export const FullWidth: Story = {
  render: function FullWidthStory() {
    return (
      <div className="w-80 p-4 bg-[var(--color-bg-secondary)] rounded-[var(--radius-standard)]">
        <Button fullWidth variant="primary">
          Full Width Button
        </Button>
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
