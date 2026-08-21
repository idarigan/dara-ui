import type { Meta, StoryObj } from "@storybook/react";
import { CharacterCard } from "./CharacterCard";

const meta = {
  title: "Components/CharacterCard",
  component: CharacterCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    subtitle: { control: "text" },
    quote: { control: "text" },
    mbti: { control: "text" },
    species: { control: "text" },
    affiliation: { control: "text" },
    glow: {
      control: "select",
      options: ["none", "primary", "secondary", "accent"],
    },
  },
  args: {
    name: "Dara",
    subtitle: "Jedi Archivist",
    quote: "The dark is not to be feared - it is to be archived.",
    mbti: "INTJ",
    species: "Human/Cyborg",
    affiliation: "Jedi Order",
    glow: "primary",
  },
} satisfies Meta<typeof CharacterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {
  args: {
    icon: "🦇",
    traits: ["MBTI: INTJ", "Species: Human/Cyborg"],
    stats: [
      { label: "Force Alignment", value: 73, color: "primary" },
      { label: "Combat", value: 85, color: "secondary" },
      { label: "Intelligence", value: 92, color: "accent" },
      { label: "Wisdom", value: 68, color: "warning" },
    ],
  },
};

// ----- With Portrait -----
export const WithPortrait: Story = {
  args: {
    portrait: "https://i.pravatar.cc/150?img=5",
    icon: undefined,
    traits: ["MBTI: ENFP", "Species: Human"],
    stats: [
      { label: "Charisma", value: 88, color: "primary" },
      { label: "Intelligence", value: 76, color: "secondary" },
      { label: "Strength", value: 62, color: "accent" },
    ],
  },
};

// ----- With Emoji Icon -----
export const WithEmojiIcon: Story = {
  args: {
    icon: "🧙",
    name: "Merlin",
    subtitle: "Archmage",
    quote: "Magic is just science we don't understand yet.",
    mbti: "INTP",
    species: "Human",
    affiliation: "Camelot",
    traits: ["MBTI: INTP", "Species: Human", "Archmage"],
    stats: [
      { label: "Arcane Power", value: 95, color: "primary" },
      { label: "Wisdom", value: 90, color: "secondary" },
      { label: "Combat", value: 45, color: "danger" },
    ],
    glow: "accent",
  },
};

// ----- Different Glows -----
export const DifferentGlows: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="w-72">
        <CharacterCard
          name="Dara"
          subtitle="Jedi Archivist"
          quote="The dark is not to be feared - it is to be archived."
          icon="🦇"
          mbti="INTJ"
          species="Human/Cyborg"
          affiliation="Jedi Order"
          traits={["MBTI: INTJ", "Human/Cyborg"]}
          stats={[
            { label: "Force", value: 73, color: "primary" },
            { label: "Combat", value: 85, color: "secondary" },
          ]}
          glow="primary"
        />
      </div>
      <div className="w-72">
        <CharacterCard
          name="Cipher"
          subtitle="Netrunner"
          quote="The code is the key to everything."
          icon="🔮"
          mbti="INTP"
          species="Cyborg"
          affiliation="Netwatch"
          traits={["MBTI: INTP", "Cyborg"]}
          stats={[
            { label: "Hacking", value: 95, color: "secondary" },
            { label: "Stealth", value: 78, color: "accent" },
          ]}
          glow="secondary"
        />
      </div>
      <div className="w-72">
        <CharacterCard
          name="Shadow"
          subtitle="Night Hunter"
          quote="I move in the darkness where they cannot see."
          icon="🌙"
          mbti="ISTP"
          species="Vampire"
          affiliation="Night Council"
          traits={["MBTI: ISTP", "Vampire"]}
          stats={[
            { label: "Agility", value: 92, color: "accent" },
            { label: "Stealth", value: 88, color: "danger" },
          ]}
          glow="accent"
        />
      </div>
    </div>
  ),
};

// ----- With Full Stats -----
export const FullStats: Story = {
  args: {
    icon: "⚔️",
    name: "Aric Voss",
    subtitle: "Battle Master",
    quote:
      "A warrior's strength is measured not by their blade, but by their will.",
    mbti: "ESTJ",
    species: "Human",
    affiliation: "Imperial Guard",
    traits: ["MBTI: ESTJ", "Human", "Master-at-Arms"],
    stats: [
      { label: "Strength", value: 92, color: "danger" },
      { label: "Agility", value: 78, color: "accent" },
      { label: "Endurance", value: 85, color: "warning" },
      { label: "Combat", value: 96, color: "primary" },
      { label: "Leadership", value: 82, color: "secondary" },
      { label: "Wisdom", value: 65, color: "success" },
    ],
    glow: "secondary",
  },
};

// ----- Simple -----
export const Simple: Story = {
  args: {
    icon: "👤",
    name: "John Doe",
    subtitle: "Adventurer",
    quote: "Every journey begins with a single step.",
    traits: ["Explorer", "Curious"],
    stats: [
      { label: "Courage", value: 75, color: "primary" },
      { label: "Luck", value: 60, color: "warning" },
    ],
    glow: "none",
  },
};
