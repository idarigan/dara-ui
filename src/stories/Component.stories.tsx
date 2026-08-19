import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Component",
  component: () => <div>Component</div>,
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
