import type { Meta, StoryObj } from "@storybook/react";
import { ScrollReveal } from "./ScrollReveal";

const meta = {
  title: "Components/ScrollReveal",
  component: ScrollReveal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    animation: {
      control: "select",
      options: [
        "fade",
        "fade-up",
        "fade-down",
        "fade-left",
        "fade-right",
        "zoom-in",
        "zoom-out",
        "flip-up",
        "flip-down",
        "slide-up",
        "slide-down",
      ],
    },
    delay: { control: "number" },
    duration: { control: "number" },
    distance: { control: "number" },
    threshold: { control: "number", min: 0, max: 1, step: 0.05 },
    once: { control: "boolean" },
  },
  args: {
    animation: "fade-up",
    delay: 0,
    duration: 600,
    distance: 40,
    threshold: 0.15,
    once: true,
  },
} satisfies Meta<typeof ScrollReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ScrollDemo = ({
  animation,
  delay,
  duration,
  distance,
  once,
}: {
  animation?:
    | "fade"
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "zoom-in"
    | "zoom-out"
    | "flip-up"
    | "flip-down"
    | "slide-up"
    | "slide-down";
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}) => (
  <div className="p-8 space-y-6">
    <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)]">
      Scroll down to reveal
    </h1>
    {Array.from({ length: 8 }).map((_, i) => (
      <ScrollReveal
        key={i}
        animation={animation}
        delay={delay}
        duration={duration}
        distance={distance}
        once={once}
      >
        <div className="glass p-8 rounded-[var(--radius-standard)]">
          <h3 className="font-heading font-bold text-[var(--color-text-primary)]">
            Item {i + 1}
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            This element animates into view as you scroll.
          </p>
        </div>
      </ScrollReveal>
    ))}
    <div style={{ height: "80vh" }} />
  </div>
);

export const Default: Story = {
  render: () => <ScrollDemo />,
};

export const FadeUp: Story = {
  render: () => <ScrollDemo animation="fade-up" />,
};

export const FadeLeft: Story = {
  render: () => <ScrollDemo animation="fade-left" />,
};

export const ZoomIn: Story = {
  render: () => <ScrollDemo animation="zoom-in" />,
};

export const FlipUp: Story = {
  render: () => <ScrollDemo animation="flip-up" />,
};

export const WithStagger: Story = {
  render: () => (
    <div className="p-8 space-y-4">
      <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)] mb-8">
        Staggered reveal
      </h1>
      {Array.from({ length: 6 }).map((_, i) => (
        <ScrollReveal key={i} animation="fade-up" delay={i * 100}>
          <div className="glass p-6 rounded-[var(--radius-standard)]">
            <p className="text-[var(--color-text-primary)]">
              Delayed by {i * 100}ms
            </p>
          </div>
        </ScrollReveal>
      ))}
      <div style={{ height: "80vh" }} />
    </div>
  ),
};

export const AllAnimations: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)] mb-8">
        All animation presets
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(
          [
            "fade",
            "fade-up",
            "fade-down",
            "fade-left",
            "fade-right",
            "zoom-in",
            "zoom-out",
            "flip-up",
            "flip-down",
            "slide-up",
            "slide-down",
          ] as const
        ).map((anim) => (
          <ScrollReveal key={anim} animation={anim}>
            <div className="glass p-6 rounded-[var(--radius-standard)]">
              <p className="font-mono text-xs text-[var(--color-primary)]">
                {anim}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <div style={{ height: "80vh" }} />
    </div>
  ),
};

export const ReTrigger: Story = {
  render: () => <ScrollDemo animation="fade-up" once={false} />,
};
