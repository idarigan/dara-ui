import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { useState } from "react";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["left", "center", "right"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    glowColor: {
      control: "select",
      options: ["primary", "secondary", "accent", "success", "danger", "none"],
    },
    fullWidth: { control: "boolean" },
  },
  args: {
    align: "left",
    size: "md",
    glowColor: "primary",
    fullWidth: false,
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
  {
    label: "Archive",
    content: (
      <div className="p-4 text-[var(--color-text-secondary)]">
        📁 Archive content
      </div>
    ),
  },
  {
    label: "Quests",
    content: (
      <div className="p-4 text-[var(--color-text-secondary)]">
        ⚔️ Quests content
      </div>
    ),
  },
  {
    label: "Stats",
    content: (
      <div className="p-4 text-[var(--color-text-secondary)]">
        📊 Stats content
      </div>
    ),
  },
  {
    label: "Settings",
    content: (
      <div className="p-4 text-[var(--color-text-secondary)]">
        ⚙️ Settings content
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    defaultValue: "Archive",
  },
};

export const Variants: Story = {
  args: {
    items: defaultItems,
  },
  render: function VariantsStory(args) {
    return (
      <div className="flex flex-col gap-8 w-96">
        <Tabs {...args} defaultValue="Archive" glowColor="primary" />
        <Tabs {...args} defaultValue="Archive" glowColor="secondary" />
        <Tabs {...args} defaultValue="Archive" glowColor="accent" />
        <Tabs {...args} defaultValue="Archive" glowColor="success" />
        <Tabs {...args} defaultValue="Archive" glowColor="danger" />
        <Tabs {...args} defaultValue="Archive" glowColor="none" />
      </div>
    );
  },
};

export const Sizes: Story = {
  args: {
    items: defaultItems,
  },
  render: function SizesStory(args) {
    return (
      <div className="flex flex-col gap-6 w-80">
        <Tabs {...args} defaultValue="Archive" size="sm" />
        <Tabs {...args} defaultValue="Archive" size="md" />
        <Tabs {...args} defaultValue="Archive" size="lg" />
      </div>
    );
  },
};

export const Alignments: Story = {
  args: {
    items: defaultItems,
  },
  render: function AlignmentsStory(args) {
    return (
      <div className="flex flex-col gap-8 w-96">
        <Tabs {...args} defaultValue="Archive" align="left" />
        <Tabs {...args} defaultValue="Archive" align="center" />
        <Tabs {...args} defaultValue="Archive" align="right" />
      </div>
    );
  },
};

export const Controlled: Story = {
  args: {
    items: defaultItems,
  },
  render: function ControlledStory(args) {
    const [active, setActive] = useState("Archive");
    return (
      <div className="flex flex-col gap-4 w-96">
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
          Active: <span className="text-[var(--color-primary)]">{active}</span>
        </p>
        <Tabs {...args} activeValue={active} onChange={setActive} />
      </div>
    );
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        label: "Home",
        icon: "🏠",
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            Home content
          </div>
        ),
      },
      {
        label: "Profile",
        icon: "👤",
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            Profile content
          </div>
        ),
      },
      {
        label: "Settings",
        icon: "⚙️",
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            Settings content
          </div>
        ),
      },
    ],
    defaultValue: "Home",
  },
};
