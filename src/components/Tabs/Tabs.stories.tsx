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
    content: <div className="p-4 text-white/60">📁 Archive content</div>,
  },
  {
    label: "Quests",
    content: <div className="p-4 text-white/60">⚔️ Quests content</div>,
  },
  {
    label: "Stats",
    content: <div className="p-4 text-white/60">📊 Stats content</div>,
  },
  {
    label: "Settings",
    content: <div className="p-4 text-white/60">⚙️ Settings content</div>,
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    defaultValue: "Archive",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-96">
      <Tabs items={defaultItems} defaultValue="Archive" glowColor="primary" />
      <Tabs items={defaultItems} defaultValue="Archive" glowColor="secondary" />
      <Tabs items={defaultItems} defaultValue="Archive" glowColor="accent" />
      <Tabs items={defaultItems} defaultValue="Archive" glowColor="success" />
      <Tabs items={defaultItems} defaultValue="Archive" glowColor="danger" />
      <Tabs items={defaultItems} defaultValue="Archive" glowColor="none" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Tabs items={defaultItems} defaultValue="Archive" size="sm" />
      <Tabs items={defaultItems} defaultValue="Archive" size="md" />
      <Tabs items={defaultItems} defaultValue="Archive" size="lg" />
    </div>
  ),
};

export const Alignments: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-96">
      <Tabs items={defaultItems} defaultValue="Archive" align="left" />
      <Tabs items={defaultItems} defaultValue="Archive" align="center" />
      <Tabs items={defaultItems} defaultValue="Archive" align="right" />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [active, setActive] = useState("Archive");
    return (
      <div className="flex flex-col gap-4 w-96">
        <p className="text-xs text-white/40 font-mono">
          Active: <span className="text-[#7c5cff]">{active}</span>
        </p>
        <Tabs items={defaultItems} activeValue={active} onChange={setActive} />
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
        content: <div className="p-4 text-white/60">Home content</div>,
      },
      {
        label: "Profile",
        icon: "👤",
        content: <div className="p-4 text-white/60">Profile content</div>,
      },
      {
        label: "Settings",
        icon: "⚙️",
        content: <div className="p-4 text-white/60">Settings content</div>,
      },
    ],
    defaultValue: "Home",
  },
};
