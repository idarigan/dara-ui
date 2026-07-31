import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import Button from "../Button/Button";
import { Badge } from "../Badge/Badge";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: [
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ],
    },
    variant: {
      control: "select",
      options: ["glass", "solid", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    delay: { control: "number" },
    hideDelay: { control: "number" },
    arrow: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    content: "This is a tooltip",
    children: <Button variant="primary">Hover me</Button>,
    placement: "top",
    variant: "glass",
    size: "md",
    delay: 300,
    hideDelay: 0,
    arrow: true,
    disabled: false,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {
  args: {
    content: "This is a tooltip",
    children: <Button variant="primary">Hover me</Button>,
  },
};

// ----- Placements -----
export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-8">
      <Tooltip content="Top" placement="top">
        <Button size="sm" variant="glass">
          Top
        </Button>
      </Tooltip>
      <Tooltip content="Bottom" placement="bottom">
        <Button size="sm" variant="glass">
          Bottom
        </Button>
      </Tooltip>
      <Tooltip content="Left" placement="left">
        <Button size="sm" variant="glass">
          Left
        </Button>
      </Tooltip>
      <Tooltip content="Right" placement="right">
        <Button size="sm" variant="glass">
          Right
        </Button>
      </Tooltip>
      <Tooltip content="Top Left" placement="top-left">
        <Button size="sm" variant="glass">
          Top Left
        </Button>
      </Tooltip>
      <Tooltip content="Top Right" placement="top-right">
        <Button size="sm" variant="glass">
          Top Right
        </Button>
      </Tooltip>
      <Tooltip content="Bottom Left" placement="bottom-left">
        <Button size="sm" variant="glass">
          Bottom Left
        </Button>
      </Tooltip>
      <Tooltip content="Bottom Right" placement="bottom-right">
        <Button size="sm" variant="glass">
          Bottom Right
        </Button>
      </Tooltip>
    </div>
  ),
  args: {
    children: (
      <Button size="sm" variant="glass">
        Placement
      </Button>
    ),
  },
};

// ----- Variants -----
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Tooltip content="Glass tooltip" variant="glass">
        <Button variant="glass">Glass</Button>
      </Tooltip>
      <Tooltip content="Solid tooltip" variant="solid">
        <Button variant="secondary">Solid</Button>
      </Tooltip>
      <Tooltip content="Outline tooltip" variant="outline">
        <Button variant="outline">Outline</Button>
      </Tooltip>
    </div>
  ),
  args: {
    children: <Button>Variant</Button>,
  },
};

// ----- Sizes -----
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Tooltip content="Small tooltip" size="sm">
        <Button size="sm">Small</Button>
      </Tooltip>
      <Tooltip content="Medium tooltip" size="md">
        <Button size="md">Medium</Button>
      </Tooltip>
      <Tooltip content="Large tooltip" size="lg">
        <Button size="lg">Large</Button>
      </Tooltip>
    </div>
  ),
  args: {
    children: <Button>Size</Button>,
  },
};

// ----- Long Content -----
export const LongContent: Story = {
  render: () => (
    <Tooltip content="This is a longer tooltip with more detailed information about the element you're hovering over.">
      <Button variant="primary">Hover for details</Button>
    </Tooltip>
  ),
  args: {
    children: <Button variant="primary">Long</Button>,
  },
};

// ----- With Badge -----
export const WithBadge: Story = {
  render: () => (
    <Tooltip content="You have 42 unread messages">
      <Badge variant="primary" glow>
        <span className="cursor-pointer">42</span>
      </Badge>
    </Tooltip>
  ),
  args: {
    children: (
      <Badge variant="primary" glow>
        42
      </Badge>
    ),
  },
};

// ----- Disabled -----
export const Disabled: Story = {
  render: () => (
    <Tooltip content="This tooltip is disabled" disabled>
      <Button variant="secondary">Disabled Tooltip</Button>
    </Tooltip>
  ),
  args: {
    children: <Button variant="secondary">Disabled</Button>,
  },
};

// ----- No Arrow -----
export const NoArrow: Story = {
  render: () => (
    <Tooltip content="No arrow on this tooltip" arrow={false}>
      <Button variant="glass">No Arrow</Button>
    </Tooltip>
  ),
  args: {
    children: <Button variant="glass">No Arrow</Button>,
  },
};

// ----- Interactive Playground -----
export const Interactive: Story = {
  args: {
    content: "Interactive tooltip",
    children: <Button variant="primary">Hover me</Button>,
    placement: "top",
    variant: "glass",
    size: "md",
    delay: 300,
    hideDelay: 0,
    arrow: true,
  },
};
