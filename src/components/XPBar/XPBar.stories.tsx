import type { Meta, StoryObj } from "@storybook/react";
import { XPBar } from "./XPBar";
import { useState } from "react";
import Button from "../Button/Button";

const meta = {
  title: "Components/XPBar",
  component: XPBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "number",
      description: "Current XP value",
    },
    max: {
      control: "number",
      description: "Maximum XP for current level",
    },
    level: {
      control: "number",
      description: "Current level number",
    },
    showLabel: {
      control: "boolean",
      description: "Show 'X XP to next level' label",
    },
    customLabel: {
      control: "text",
      description: "Custom label for the progress bar header",
    },
    levelLabel: {
      control: "text",
      description: "Custom word for 'Level'",
    },
    xpLabel: {
      control: "text",
      description: "Custom word for 'XP'",
    },
  },
  args: {
    value: 3400,
    max: 5000,
    level: 14,
    showLabel: true,
  },
} satisfies Meta<typeof XPBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {};

// ----- Different Levels -----
export const DifferentLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <XPBar value={1200} max={3000} level={5} />
      <XPBar value={3400} max={5000} level={14} />
      <XPBar value={7800} max={10000} level={27} />
      <XPBar value={150} max={1000} level={2} />
    </div>
  ),
};

// ----- With Custom Labels -----
export const CustomLabels: Story = {
  args: {
    customLabel: "★ PROGRESS",
    levelLabel: "Rank",
    xpLabel: "EXP",
  },
};

// ----- With Ranks (Tiers) -----
export const WithRanks: Story = {
  args: {
    value: 3400,
    max: 5000,
    level: 14,
    ranks: [
      { label: "Common", requiredXP: 0 },
      { label: "Uncommon", requiredXP: 1000 },
      { label: "Rare", requiredXP: 2500 },
      { label: "Epic", requiredXP: 4000 },
      { label: "Legendary", requiredXP: 6000 },
    ],
  },
};

// ----- Various Ranks -----
export const VariousRanks: Story = {
  render: () => {
    const rankTiers = [
      { label: "Common", requiredXP: 0 },
      { label: "Uncommon", requiredXP: 1000 },
      { label: "Rare", requiredXP: 2500 },
      { label: "Epic", requiredXP: 4000 },
      { label: "Legendary", requiredXP: 6000 },
    ];

    return (
      <div className="flex flex-col gap-4 w-80">
        <XPBar value={500} max={5000} level={5} ranks={rankTiers} />
        <XPBar value={1500} max={5000} level={8} ranks={rankTiers} />
        <XPBar value={3000} max={5000} level={12} ranks={rankTiers} />
        <XPBar value={4500} max={5000} level={16} ranks={rankTiers} />
        <XPBar value={5500} max={5000} level={20} ranks={rankTiers} />
      </div>
    );
  },
};

// ----- Custom Rank Labels -----
export const CustomRankLabels: Story = {
  args: {
    value: 1250,
    max: 3000,
    level: 5,
    levelLabel: "Tier",
    xpLabel: "Points",
    customLabel: "🏆 RANK PROGRESS",
    ranks: [
      { label: "Bronze", requiredXP: 0 },
      { label: "Silver", requiredXP: 500 },
      { label: "Gold", requiredXP: 1200 },
      { label: "Platinum", requiredXP: 2000 },
      { label: "Diamond", requiredXP: 3000 },
    ],
  },
};

// ----- Game Style -----
export const GameStyle: Story = {
  args: {
    value: 750,
    max: 1200,
    level: 3,
    levelLabel: "Prestige",
    xpLabel: "Score",
    customLabel: "⚔️ MISSION PROGRESS",
    ranks: [
      { label: "Recruit", requiredXP: 0 },
      { label: "Soldier", requiredXP: 300 },
      { label: "Veteran", requiredXP: 600 },
      { label: "Elite", requiredXP: 900 },
      { label: "Commander", requiredXP: 1200 },
    ],
  },
};

// ----- Without Label -----
export const WithoutLabel: Story = {
  args: {
    showLabel: false,
  },
};

// ----- Interactive -----
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(3400);
    const [level, setLevel] = useState(14);
    const max = 5000;

    const rankTiers = [
      { label: "Common", requiredXP: 0 },
      { label: "Uncommon", requiredXP: 1000 },
      { label: "Rare", requiredXP: 2500 },
      { label: "Epic", requiredXP: 4000 },
      { label: "Legendary", requiredXP: 6000 },
    ];

    const addXP = (amount: number) => {
      let newValue = value + amount;
      let newLevel = level;

      while (newValue >= max) {
        newValue -= max;
        newLevel++;
      }

      setValue(newValue);
      setLevel(newLevel);
    };

    return (
      <div className="flex flex-col items-center gap-6 w-80">
        <XPBar
          value={value}
          max={max}
          level={level}
          ranks={rankTiers}
          levelLabel="Rank"
          xpLabel="EXP"
        />

        <div className="flex gap-2 flex-wrap justify-center">
          <Button size="sm" onClick={() => addXP(50)}>
            +50 EXP
          </Button>
          <Button size="sm" variant="secondary" onClick={() => addXP(200)}>
            +200 EXP
          </Button>
          <Button size="sm" variant="success" onClick={() => addXP(500)}>
            +500 EXP
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setValue(0);
              setLevel(1);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  },
};
