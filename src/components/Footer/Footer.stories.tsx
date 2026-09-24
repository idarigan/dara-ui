import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./Footer";
import { Button } from "../Button/Button";

const meta = {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "sticky", "minimal"],
    },
    tagline: { control: "text" },
  },
  args: {
    variant: "default",
    tagline: "Building fast, thoughtful web experiences.",
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

const brand = (
  <span
    className="font-heading font-bold text-lg tracking-tight"
    style={{
      background: "var(--gradient-primary)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}
  >
    YOUR.NAME
  </span>
);

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Blog", href: "#" },
      { label: "GitHub", href: "#", external: true },
    ],
  },
  {
    title: "Contact",
    content: (
      <a
        href="mailto:idarigan@outlook.com"
        className="text-sm text-[var(--color-primary)] hover:underline"
        dir="ltr"
      >
        idarigan@outlook.com
      </a>
    ),
  },
];

export const Default: Story = {
  args: {
    variant: "default",
    brand,
    tagline: "Building fast, thoughtful web experiences.",
    columns,
    bottomBar: (
      <>
        © 2026 Your Name ·{" "}
        <a href="#" className="text-[var(--color-primary)] hover:underline">
          Built with Dara UI
        </a>
      </>
    ),
  },
};

export const Minimal: Story = {
  args: {
    variant: "minimal",
    brand,
    bottomBar: "© 2026 Your Name",
  },
};

export const Sticky: Story = {
  render: () => (
    <div className="min-h-screen bg-[var(--color-bg-primary)] p-8">
      <h1 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
        Sticky footer demo
      </h1>
      <p className="text-[var(--color-text-secondary)]">
        The footer is pinned to the bottom of the viewport.
      </p>
      <Footer
        variant="sticky"
        brand={brand}
        social={<Button size="sm">Subscribe</Button>}
        bottomBar="© 2026 Your Name"
      />
    </div>
  ),
  args: {
    variant: "sticky",
  },
};
