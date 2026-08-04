import type { Meta, StoryObj } from "@storybook/react";
import { SocialMedia } from "./SocialMedia";

const meta = {
  title: "Components/SocialMedia",
  component: SocialMedia,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["left", "right"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    showLabels: {
      control: "boolean",
    },
    offset: {
      control: "number",
    },
  },
  args: {
    position: "right",
    size: "md",
    showLabels: false,
    offset: 20,
  },
} satisfies Meta<typeof SocialMedia>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultLinks = [
  { platform: "github", url: "https://github.com" },
  { platform: "twitter", url: "https://twitter.com" },
  { platform: "discord", url: "https://discord.com" },
  { platform: "youtube", url: "https://youtube.com" },
  { platform: "instagram", url: "https://instagram.com" },
  { platform: "linkedin", url: "https://linkedin.com" },
  { platform: "bluesky", url: "https://bsky.app" },
];

export const Default: Story = {
  args: {
    links: defaultLinks,
  },
};

export const LeftPosition: Story = {
  args: {
    links: defaultLinks,
    position: "left",
  },
};

export const WithLabels: Story = {
  args: {
    links: defaultLinks,
    showLabels: true,
  },
};

export const Small: Story = {
  args: {
    links: defaultLinks,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    links: defaultLinks,
    size: "lg",
    showLabels: true,
  },
};

export const CustomLinks: Story = {
  args: {
    links: [
      {
        platform: "github",
        url: "https://github.com/dara-ui",
        label: "GitHub",
      },
      {
        platform: "twitter",
        url: "https://twitter.com/dara-ui",
        label: "Twitter",
      },
      {
        platform: "discord",
        url: "https://discord.gg/dara-ui",
        label: "Discord",
      },
    ],
    showLabels: true,
  },
};
