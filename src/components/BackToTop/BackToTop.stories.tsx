import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BackToTop } from "./BackToTop";

const meta = {
  title: "Components/BackToTop",
  component: BackToTop,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["auto", "left", "right"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    showAfter: { control: "number" },
    offset: { control: "number" },
    label: { control: "text" },
  },
  args: {
    position: "auto",
    size: "md",
    showAfter: 0,
    offset: 24,
    label: "Back to top",
  },
} satisfies Meta<typeof BackToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

const Page = () => (
  <div className="p-8 space-y-6">
    <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)]">
      Scroll down
    </h1>
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="glass p-8 rounded-[var(--radius-standard)]">
        <p className="text-[var(--color-text-secondary)]">Section {i + 1}</p>
      </div>
    ))}
  </div>
);

export const Default: Story = {
  render: (args) => (
    <>
      <Page />
      <BackToTop {...args} />
    </>
  ),
};

export const AppearsAfterScroll: Story = {
  args: { showAfter: 300 },
  render: (args) => (
    <>
      <Page />
      <BackToTop {...args} />
    </>
  ),
};

export const LeftSide: Story = {
  args: { position: "left" },
  render: (args) => (
    <>
      <Page />
      <BackToTop {...args} />
    </>
  ),
};

export const RTL: Story = {
  render: function RTLStory(args) {
    useEffect(() => {
      const prevDir = document.documentElement.dir;
      const prevLang = document.documentElement.lang;

      document.documentElement.dir = "rtl";
      document.documentElement.lang = "fa";

      return () => {
        document.documentElement.dir = prevDir || "ltr";
        document.documentElement.lang = prevLang || "en";
      };
    }, []);

    return (
      <>
        <Page />
        <BackToTop {...args} label="بازگشت به بالا" />
      </>
    );
  },
};
