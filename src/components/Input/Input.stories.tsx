import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { UserIcon, SearchIcon, LockIcon } from "../Icons";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "search", "email", "tel", "number", "url"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    validation: {
      control: "select",
      options: ["", "success", "error", "warning"],
    },
    glowFocus: { control: "boolean" },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    type: "text",
    size: "md",
    glowFocus: true,
    fullWidth: false,
    disabled: false,
    placeholder: "Enter text...",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input placeholder="Text input" />
      <Input type="password" placeholder="Password" />
      <Input type="search" placeholder="Search..." />
      <Input type="email" placeholder="Email" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input leftIcon={<UserIcon />} placeholder="Username" />
      <Input leftIcon={<LockIcon />} type="password" placeholder="Password" />
      <Input leftIcon={<SearchIcon />} type="search" placeholder="Search..." />
    </div>
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input
        validation="success"
        successMessage="Valid!"
        placeholder="Success"
      />
      <Input validation="error" errorMessage="Invalid!" placeholder="Error" />
      <Input
        validation="warning"
        helperText="Please check"
        placeholder="Warning"
      />
    </div>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="Username" placeholder="Enter username" />
      <Input
        label="Email"
        type="email"
        placeholder="Enter email"
        helperText="We'll never share your email."
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input disabled placeholder="Disabled input" />
      <Input disabled label="Disabled" placeholder="Disabled with label" />
    </div>
  ),
};
