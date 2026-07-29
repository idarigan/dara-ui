import type { Meta, StoryObj } from "@storybook/react";
import { StatsWidget } from "./StatsWidget";

const meta = {
  title: "Components/StatsWidget",
  component: StatsWidget,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["radial", "bar"],
    },
    layout: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    glow: {
      control: "select",
      options: ["none", "purple", "cyan", "pink"],
    },
    title: { control: "text" },
  },
  args: {
    title: "Stats Widget",
    variant: "radial",
    layout: "vertical",
    glow: "none",
  },
} satisfies Meta<typeof StatsWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default (Radial) -----
export const Default: Story = {
  args: {
    stats: [
      { label: "Force", value: 73, color: "primary", trend: 12 },
      { label: "Combat", value: 85, color: "secondary", trend: 8 },
      { label: "Intelligence", value: 92, color: "accent", trend: -3 },
      { label: "Wisdom", value: 68, color: "warning", trend: 5 },
    ],
  },
};

// ----- Bar Variant -----
export const BarVariant: Story = {
  args: {
    variant: "bar",
    stats: [
      { label: "Force", value: 73, color: "primary", trend: 12 },
      { label: "Combat", value: 85, color: "secondary", trend: 8 },
      { label: "Intelligence", value: 92, color: "accent", trend: -3 },
      { label: "Wisdom", value: 68, color: "warning", trend: 5 },
    ],
  },
};

// ----- Horizontal Layout -----
export const HorizontalLayout: Story = {
  args: {
    layout: "horizontal",
    stats: [
      { label: "Force", value: 73, color: "primary", trend: 12 },
      { label: "Combat", value: 85, color: "secondary", trend: 8 },
      { label: "Intelligence", value: 92, color: "accent", trend: -3 },
      { label: "Wisdom", value: 68, color: "warning", trend: 5 },
    ],
  },
};

// ----- With Glow -----
export const WithGlow: Story = {
  args: {
    glow: "purple",
    stats: [
      { label: "Force", value: 73, color: "primary", trend: 12 },
      { label: "Combat", value: 85, color: "secondary", trend: 8 },
      { label: "Intelligence", value: 92, color: "accent", trend: -3 },
      { label: "Wisdom", value: 68, color: "warning", trend: 5 },
    ],
  },
};

// ----- With Custom Units -----
export const CustomUnits: Story = {
  args: {
    title: "Character Stats",
    stats: [
      {
        label: "Health",
        value: 85,
        max: 100,
        unit: "HP",
        color: "danger",
        trend: -5,
      },
      {
        label: "Mana",
        value: 62,
        max: 100,
        unit: "MP",
        color: "secondary",
        trend: 15,
      },
      {
        label: "Stamina",
        value: 45,
        max: 100,
        unit: "SP",
        color: "warning",
        trend: 3,
      },
      {
        label: "Level",
        value: 14,
        max: 20,
        unit: "",
        color: "primary",
        trend: 0,
      },
    ],
  },
};

// ----- Game Stats -----
export const GameStats: Story = {
  args: {
    title: "⚔️ STATS",
    glow: "cyan",
    stats: [
      { label: "Strength", value: 78, color: "danger", trend: 22 },
      { label: "Agility", value: 92, color: "accent", trend: 8 },
      { label: "Endurance", value: 65, color: "warning", trend: -4 },
      { label: "Luck", value: 45, color: "success", trend: 12 },
    ],
  },
};

// ----- Mixed Stats (with different colors) -----
export const MixedColors: Story = {
  args: {
    title: "📊 STATS",
    glow: "pink",
    stats: [
      { label: "Hacking", value: 95, color: "secondary", trend: 5 },
      { label: "Stealth", value: 78, color: "accent", trend: 18 },
      { label: "Combat", value: 45, color: "danger", trend: -7 },
      { label: "Intelligence", value: 88, color: "primary", trend: 3 },
    ],
  },
};

// ----- Bar with Horizontal -----
export const BarHorizontal: Story = {
  args: {
    variant: "bar",
    layout: "horizontal",
    title: "📈 PROGRESS",
    glow: "purple",
    stats: [
      { label: "Strength", value: 78, color: "danger", trend: 22 },
      { label: "Agility", value: 92, color: "accent", trend: 8 },
      { label: "Endurance", value: 65, color: "warning", trend: -4 },
      { label: "Luck", value: 45, color: "success", trend: 12 },
    ],
  },
};

// ----- Simple (no trends) -----
export const Simple: Story = {
  args: {
    title: "Simple Stats",
    stats: [
      { label: "Health", value: 85, unit: "%", color: "danger" },
      { label: "Energy", value: 62, unit: "%", color: "secondary" },
      { label: "Focus", value: 45, unit: "%", color: "warning" },
    ],
  },
};
