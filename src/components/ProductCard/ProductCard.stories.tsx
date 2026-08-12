import type { Meta, StoryObj } from "@storybook/react";
import { ProductCard } from "./ProductCard";

const meta = {
  title: "Components/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: "select",
      options: ["vertical", "horizontal", "compact"],
    },
    glow: {
      control: "select",
      options: ["none", "purple", "cyan", "pink"],
    },
    onSale: { control: "boolean" },
    inStock: { control: "boolean" },
    showQuickActions: { control: "boolean" },
    fullWidthMobile: { control: "boolean" },
    rating: { control: "number", min: 0, max: 5, step: 0.5 },
    reviewCount: { control: "number" },
  },
  args: {
    title: "Cyberpunk 2077 - Collector's Edition",
    price: 79.99,
    currency: "$",
    description:
      "Limited edition collector's set with art book, steelbook case, and exclusive digital content.",
    rating: 4.5,
    reviewCount: 128,
    category: "Gaming",
    tags: ["limited", "collector"],
    badge: "Limited",
    badgeVariant: "danger",
    inStock: true,
    onSale: false,
    showQuickActions: true,
    fullWidthMobile: false,
    glow: "none",
    layout: "vertical",
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {
  args: {
    image: "https://picsum.photos/seed/cyberpunk/300/300",
  },
};

// ----- With Image -----
export const WithImage: Story = {
  args: {
    image: "https://picsum.photos/seed/cyberpunk/300/300",
  },
};

// ----- On Sale -----
export const OnSale: Story = {
  args: {
    image: "https://picsum.photos/seed/holocron/300/300",
    title: "Jedi Holocron - Limited Run",
    price: 149.99,
    originalPrice: 199.99,
    onSale: true,
    badge: "Sale",
    badgeVariant: "danger",
  },
};

// ----- Out of Stock -----
export const OutOfStock: Story = {
  args: {
    image: "https://picsum.photos/seed/controller/300/300",
    title: "Neon Samurai Controller",
    price: 59.99,
    inStock: false,
  },
};

// ----- Horizontal Layout -----
export const HorizontalLayout: Story = {
  args: {
    image: "https://picsum.photos/seed/cyberpunk2/300/300",
    layout: "horizontal",
    glow: "purple",
  },
};

// ----- Compact Layout -----
export const CompactLayout: Story = {
  args: {
    image: "https://picsum.photos/seed/cyberpunk3/100/100",
    layout: "compact",
    glow: "cyan",
  },
};

// ----- With Glow -----
export const WithGlow: Story = {
  args: {
    image: "https://picsum.photos/seed/glow1/300/300",
    glow: "purple",
  },
};

// ----- No Quick Actions -----
export const NoQuickActions: Story = {
  args: {
    image: "https://picsum.photos/seed/cyberpunk/300/300",
    showQuickActions: false,
  },
};

// ----- Full Width Mobile -----
export const FullWidthMobile: Story = {
  args: {
    image: "https://picsum.photos/seed/responsive1/300/300",
    fullWidthMobile: true,
  },
};

// ----- Interactive Playground -----
export const Interactive: Story = {
  args: {
    image: "https://picsum.photos/seed/cyberpunk/300/300",
    title: "Cyberpunk 2077 - Collector's Edition",
    price: 79.99,
    currency: "$",
    description:
      "Limited edition collector's set with art book, steelbook case, and exclusive digital content.",
    rating: 4.5,
    reviewCount: 128,
    category: "Gaming",
    tags: ["limited", "collector", "exclusive"],
    badge: "Limited",
    badgeVariant: "danger",
    inStock: true,
    onSale: false,
    showQuickActions: true,
    fullWidthMobile: false,
    glow: "purple",
    layout: "vertical",
  },
};
