import type { Meta, StoryObj } from "@storybook/react";
import { CustomCursor } from "./CustomCursor";
import Button from "../Button/Button";

const meta = {
  title: "Components/CustomCursor",
  component: CustomCursor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "number", min: 16, max: 64 } },
    color: { control: "text" },
  },
  args: {
    size: 32,
    color: "var(--color-primary-solid)",
  },
} satisfies Meta<typeof CustomCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

const Playground = () => (
  <div className="glass flex flex-col items-center gap-4 p-10">
    <p className="text-sm text-[var(--color-text-secondary)]">
      Default cursor here, pointer cursor over the buttons
    </p>
    <div className="flex gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => (
    <>
      <CustomCursor {...args} />
      <Playground />
    </>
  ),
};

export const CustomColor: Story = {
  args: { color: "var(--color-accent)" },
  render: (args) => (
    <>
      <CustomCursor {...args} />
      <Playground />
    </>
  ),
};
