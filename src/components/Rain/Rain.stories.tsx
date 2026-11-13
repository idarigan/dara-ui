import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Rain } from "./Rain";

const meta: Meta<typeof Rain> = {
  title: "Components/Rain",
  component: Rain,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    count: { control: { type: "number", min: 0, max: 900 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    color: { control: "text" },
    lightning: { control: "boolean" },
    sound: { control: "boolean" },
    volume: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    interactive: { control: "boolean" },
    interactionRadius: { control: { type: "number", min: 40, max: 300 } },
    interactionStrength: {
      control: { type: "number", min: 0, max: 3, step: 0.1 },
    },
  },
  args: {
    count: 140,
    opacity: 0.5,
    lightning: false,
    sound: false,
    volume: 0.5,
    interactive: true,
  },
};

export default meta;
type Story = StoryObj<typeof Rain>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-64 overflow-hidden rounded-[var(--radius-large)] bg-[var(--color-bg-primary)]">
    {children}
    <div className="relative z-10 flex h-full items-center justify-center text-[var(--color-text-primary)]">
      Rain storm
    </div>
  </div>
);

// ----- Default -----
export const Default: Story = {
  render: (args) => (
    <Stage>
      <Rain {...args} />
    </Stage>
  ),
};

// ----- With Lightning -----
export const WithLightning: Story = {
  args: { lightning: true, opacity: 0.7 },
  render: (args) => (
    <Stage>
      <Rain {...args} />
    </Stage>
  ),
};

// ----- With Sound -----
export const WithSound: Story = {
  args: { sound: true, volume: 0.5 },
  render: (args) => (
    <Stage>
      <Rain {...args} />
    </Stage>
  ),
};

// ----- With Sound And Thunder -----
export const WithSoundAndThunder: Story = {
  args: { sound: true, lightning: true, opacity: 0.7, volume: 0.6 },
  render: (args) => (
    <Stage>
      <Rain {...args} />
    </Stage>
  ),
};

// ----- Heavy Storm -----
export const HeavyStorm: Story = {
  args: { count: 600, lightning: true },
  render: (args) => (
    <Stage>
      <Rain {...args} />
    </Stage>
  ),
};

// ----- Custom Color -----
export const CustomColor: Story = {
  args: { color: "var(--color-accent)" },
  render: (args) => (
    <Stage>
      <Rain {...args} />
    </Stage>
  ),
};

// ----- RTL -----
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
      <Stage>
        <Rain {...args} />
      </Stage>
    );
  },
};
