import type { Meta, StoryObj } from "@storybook/react";
import { QuestCard } from "./QuestCard";
import { useState } from "react";
import Button from "../Button/Button";

const meta = {
  title: "Components/QuestCard",
  component: QuestCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    xp: { control: "number" },
    xpLabel: { control: "text" },
    deadline: { control: "text" },
    rank: { control: "text" },
    glow: {
      control: "select",
      options: ["none", "primary", "secondary", "accent"],
    },
    done: { control: "boolean" },
  },
  args: {
    title: "Build CMS",
    description:
      "Deploy the encrypted Jedi archive interface before the snow melts.",
    xp: 300,
    xpLabel: "XP",
    deadline: "tomorrow",
    rank: "S",
    glow: "none",
    done: false,
  },
} satisfies Meta<typeof QuestCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {};

// ----- With Requirements -----
export const WithRequirements: Story = {
  args: {
    requirements: [
      "Complete 3 code reviews",
      "Write 5 unit tests",
      "Deploy to staging",
    ],
  },
};

// ----- Various Ranks -----
export const VariousRanks: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <QuestCard
        title="Build CMS"
        description="Deploy the encrypted Jedi archive interface"
        xp={300}
        deadline="tomorrow"
        rank="S"
        glow="secondary"
      />
      <QuestCard
        title="Secure Archives"
        description="Implement end-to-end encryption for all stored data"
        xp={200}
        deadline="3 days"
        rank="A"
        glow="primary"
      />
      <QuestCard
        title="Map Night City"
        description="Create a comprehensive map of the cyberpunk district"
        xp={150}
        deadline="1 week"
        rank="B"
        glow="accent"
      />
      <QuestCard
        title="Fix Bugs"
        description="Resolve all critical issues before the next release"
        xp={75}
        deadline="tonight"
        rank="C"
        glow="none"
      />
    </div>
  ),
};

// ----- Different Glows -----
export const DifferentGlows: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <QuestCard
        title="No Glow"
        description="Standard card without glow effect"
        xp={100}
        deadline="tomorrow"
        rank="B"
      />
      <QuestCard
        title="Primary Glow"
        description="Mysterious Primary aura"
        xp={150}
        deadline="3 days"
        rank="A"
        glow="primary"
      />
      <QuestCard
        title="Secondary Glow"
        description="Cyberpunk Secondary aura"
        xp={200}
        deadline="1 week"
        rank="S"
        glow="secondary"
      />
      <QuestCard
        title="Accent Glow"
        description="Neon Accent aura"
        xp={120}
        deadline="tonight"
        rank="A"
        glow="accent"
      />
    </div>
  ),
};

// ----- With Custom XP Label -----
export const CustomXPLabel: Story = {
  args: {
    xpLabel: "EXP",
    xp: 500,
    title: "Complete Training",
    description: "Finish the mandatory Jedi training program",
    deadline: "2 days",
    rank: "A",
    glow: "secondary",
  },
};

// ----- Interactive -----
export const Interactive: Story = {
  render: function InteractiveStory() {
    const [completed, setCompleted] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4 w-80">
        <QuestCard
          title="Build CMS"
          description="Deploy the encrypted Jedi archive interface before the snow melts."
          xp={300}
          deadline="tomorrow"
          rank="S"
          glow="secondary"
          done={completed}
          onComplete={() => setCompleted(true)}
        />
        <Button variant="outline" size="sm" onClick={() => setCompleted(false)}>
          Reset Quest
        </Button>
      </div>
    );
  },
};

// ----- Full Featured -----
export const FullFeatured: Story = {
  args: {
    title: "Legendary Quest: The Lost Archive",
    description:
      "Journey into the depths of the forgotten vault and retrieve the ancient holocron before it falls into the wrong hands.",
    xp: 1000,
    xpLabel: "EXP",
    deadline: "2024-12-25",
    rank: "S+",
    glow: "primary",
    requirements: [
      "Reach level 25",
      "Defeat the Shadow Guardian",
      "Collect 3 ancient artifacts",
      "Solve the sphinx riddle",
    ],
  },
};
