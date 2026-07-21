import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const UserIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const LockIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

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
