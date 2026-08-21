import type { Meta, StoryObj } from "@storybook/react";
import { BlogCard } from "./BlogCard";

const meta = {
  title: "Components/BlogCard",
  component: BlogCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    glow: {
      control: "select",
      options: ["none", "primary", "secondary", "accent"],
    },
    featured: { control: "boolean" },
    showCategory: { control: "boolean" },
    showAuthor: { control: "boolean" },
    showReadTime: { control: "boolean" },
    fullWidthMobile: { control: "boolean" },
    readTime: { control: "number" },
  },
  args: {
    title: "The Future of Glassmorphism in UI Design",
    excerpt:
      "Explore how glassmorphism is evolving and why it's becoming the go-to aesthetic for modern interfaces in 2024.",
    author: "Jane Doe",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    date: new Date("2024-11-15"),
    readTime: 5,
    category: "Design",
    tags: ["design", "tutorial"],
    featured: false,
    showCategory: true,
    showAuthor: true,
    showReadTime: true,
    fullWidthMobile: false,
    glow: "none",
    layout: "vertical",
  },
} satisfies Meta<typeof BlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {
  args: {
    coverImage: "https://picsum.photos/seed/glassmorphism/400/250",
  },
};

// ----- With Cover Image -----
export const WithCoverImage: Story = {
  args: {
    coverImage: "https://picsum.photos/seed/glassmorphism/400/250",
  },
};

// ----- Horizontal Layout -----
export const HorizontalLayout: Story = {
  args: {
    coverImage: "https://picsum.photos/seed/horizontal1/400/250",
    layout: "horizontal",
    glow: "primary",
  },
};

// ----- Featured -----
export const Featured: Story = {
  args: {
    coverImage: "https://picsum.photos/seed/cyberpunk-aesthetic/800/400",
    featured: true,
    glow: "accent",
  },
};

// ----- With Glow -----
export const WithGlow: Story = {
  args: {
    coverImage: "https://picsum.photos/seed/glow-blog1/400/250",
    glow: "primary",
  },
};

// ----- Without Category -----
export const WithoutCategory: Story = {
  args: {
    coverImage: "https://picsum.photos/seed/glassmorphism/400/250",
    showCategory: false,
  },
};

// ----- Without Author -----
export const WithoutAuthor: Story = {
  args: {
    coverImage: "https://picsum.photos/seed/glassmorphism/400/250",
    showAuthor: false,
  },
};

// ----- Without Read Time -----
export const WithoutReadTime: Story = {
  args: {
    coverImage: "https://picsum.photos/seed/glassmorphism/400/250",
    showReadTime: false,
  },
};

// ----- Full Width Mobile -----
export const FullWidthMobile: Story = {
  args: {
    coverImage: "https://picsum.photos/seed/resp-blog1/400/250",
    fullWidthMobile: true,
  },
};

// ----- Interactive Playground -----
export const Interactive: Story = {
  args: {
    coverImage: "https://picsum.photos/seed/glassmorphism/400/250",
    title: "The Future of Glassmorphism in UI Design",
    excerpt:
      "Explore how glassmorphism is evolving and why it's becoming the go-to aesthetic for modern interfaces in 2024.",
    author: "Jane Doe",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    date: new Date("2024-11-15"),
    readTime: 5,
    category: "Design",
    tags: ["design", "tutorial", "ui"],
    featured: false,
    showCategory: true,
    showAuthor: true,
    showReadTime: true,
    fullWidthMobile: false,
    glow: "primary",
    layout: "vertical",
  },
};
