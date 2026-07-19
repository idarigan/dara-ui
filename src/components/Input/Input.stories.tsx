import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

// Icons
const SearchIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const UserIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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

const CheckIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
      description: "Input type",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Input size",
    },
    validation: {
      control: "select",
      options: ["", "success", "error", "warning"],
      description: "Validation state",
    },
    glowFocus: {
      control: "boolean",
      description: "Glow effect on focus",
    },
    fullWidth: {
      control: "boolean",
      description: "Full width input",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    helperText: {
      control: "text",
      description: "Helper text below input",
    },
    errorMessage: {
      control: "text",
      description: "Error message (shown when validation='error')",
    },
    successMessage: {
      control: "text",
      description: "Success message (shown when validation='success')",
    },
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

// Default
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input placeholder="Text input" />
      <Input type="password" placeholder="Password input" />
      <Input type="search" placeholder="Search input" />
      <Input type="email" placeholder="Email input" />
      <Input type="tel" placeholder="Phone input" />
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input leftIcon={<UserIcon />} placeholder="Username" />
      <Input leftIcon={<EmailIcon />} type="email" placeholder="Email" />
      <Input leftIcon={<LockIcon />} type="password" placeholder="Password" />
      <Input leftIcon={<SearchIcon />} type="search" placeholder="Search..." />
      <Input
        leftIcon={<UserIcon />}
        rightIcon={<CheckIcon />}
        placeholder="With right icon"
        validation="success"
        successMessage="Valid username"
      />
    </div>
  ),
};

// Validation States
export const ValidationStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input
        placeholder="Success state"
        validation="success"
        successMessage="Great! This is valid."
        rightIcon={<CheckIcon />}
      />
      <Input
        placeholder="Error state"
        validation="error"
        errorMessage="Oops! Something went wrong."
      />
      <Input
        placeholder="Warning state"
        validation="warning"
        helperText="Please check this field."
      />
    </div>
  ),
};

// With Labels
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
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        validation="error"
        errorMessage="Password must be at least 8 characters."
      />
    </div>
  ),
};

// Glow Focus
export const GlowFocus: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input placeholder="With glow (default)" glowFocus />
      <Input placeholder="Without glow" glowFocus={false} />
      <Input
        placeholder="Success glow"
        validation="success"
        successMessage="Valid!"
        glowFocus
      />
      <Input
        placeholder="Error glow"
        validation="error"
        errorMessage="Invalid!"
        glowFocus
      />
    </div>
  ),
};

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input disabled placeholder="Disabled input" />
      <Input disabled label="Disabled with label" placeholder="Disabled" />
      <Input
        disabled
        leftIcon={<UserIcon />}
        placeholder="Disabled with icon"
      />
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      <Input fullWidth placeholder="Full width input" />
      <Input fullWidth label="Full width with label" placeholder="Full width" />
    </div>
  ),
};

// Password with Toggle
export const PasswordToggle: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input type="password" placeholder="Enter password" />
      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        helperText="Minimum 8 characters"
      />
      <Input
        type="password"
        label="Confirm Password"
        placeholder="Re-enter password"
        validation="error"
        errorMessage="Passwords do not match"
      />
    </div>
  ),
};

// Search Input
export const SearchInput: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input
        type="search"
        leftIcon={<SearchIcon />}
        placeholder="Search..."
        fullWidth
      />
      <Input
        type="search"
        leftIcon={<SearchIcon />}
        placeholder="Search users..."
        label="Search"
        helperText="Search by name or email"
        fullWidth
      />
    </div>
  ),
};

// Interactive Playground
export const Interactive: Story = {
  args: {
    label: "Interactive Input",
    placeholder: "Type something...",
    helperText: "This is a helper text",
    size: "md",
    glowFocus: true,
    fullWidth: false,
    disabled: false,
  },
};
