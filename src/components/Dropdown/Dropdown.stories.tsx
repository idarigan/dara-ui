import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";
import { useState } from "react";

// Icons
const UserIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid.js" },
  { value: "qwik", label: "Qwik" },
];

const optionsWithIcons = [
  { value: "user", label: "User Profile", icon: <UserIcon /> },
  { value: "settings", label: "Settings", icon: <SettingsIcon /> },
  { value: "favorites", label: "Favorites", icon: <StarIcon /> },
  { value: "done", label: "Completed", icon: <CheckIcon /> },
];

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Dropdown size",
    },
    searchable: {
      control: "boolean",
      description: "Enable search filter",
    },
    disabled: {
      control: "boolean",
      description: "Disable dropdown",
    },
    fullWidth: {
      control: "boolean",
      description: "Full width dropdown",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    helperText: {
      control: "text",
      description: "Helper text",
    },
    error: {
      control: "boolean",
      description: "Error state",
    },
    errorMessage: {
      control: "text",
      description: "Error message",
    },
  },
  args: {
    options: options,
    placeholder: "Select a framework...",
    size: "md",
    searchable: false,
    disabled: false,
    fullWidth: false,
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default
export const Default: Story = {
  args: {
    defaultValue: "react",
  },
};

// With Placeholder
export const WithPlaceholder: Story = {
  args: {
    placeholder: "Choose an option...",
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Small
        </p>
        <Dropdown options={options} size="sm" placeholder="Small dropdown" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Medium (default)
        </p>
        <Dropdown options={options} size="md" placeholder="Medium dropdown" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Large
        </p>
        <Dropdown options={options} size="lg" placeholder="Large dropdown" />
      </div>
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="w-64">
      <Dropdown
        options={optionsWithIcons}
        placeholder="Select an option with icon..."
        defaultValue="user"
      />
    </div>
  ),
};

// Searchable
export const Searchable: Story = {
  render: () => (
    <div className="w-64">
      <Dropdown
        options={options}
        placeholder="Search for a framework..."
        searchable
        defaultValue="react"
      />
    </div>
  ),
};

// Searchable with Icons
export const SearchableWithIcons: Story = {
  render: () => (
    <div className="w-64">
      <Dropdown
        options={optionsWithIcons}
        placeholder="Search with icons..."
        searchable
        searchPlaceholder="Search options..."
      />
    </div>
  ),
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="w-64">
      <Dropdown
        options={options}
        label="Framework"
        placeholder="Select a framework..."
        helperText="Choose your preferred framework"
      />
    </div>
  ),
};

// Error State
export const ErrorState: Story = {
  render: () => (
    <div className="w-64">
      <Dropdown
        options={options}
        label="Framework"
        placeholder="Select a framework..."
        error
        errorMessage="Please select a valid framework"
      />
    </div>
  ),
};

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Dropdown
        options={options}
        placeholder="Disabled dropdown"
        disabled
        defaultValue="react"
      />
    </div>
  ),
};

// Controlled
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("react");

    return (
      <div className="flex flex-col gap-4 w-64">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
            Selected:{" "}
            <span className="text-[var(--color-primary)] font-bold">
              {value}
            </span>
          </p>
          <button
            className="px-2 py-1 text-xs bg-[var(--color-primary)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--color-primary-hover)]"
            onClick={() => setValue("vue")}
          >
            Set to Vue
          </button>
          <button
            className="px-2 py-1 text-xs bg-[var(--color-secondary)] text-[var(--color-bg-primary)] rounded-[var(--radius-sm)] hover:bg-[var(--color-secondary-hover)]"
            onClick={() => setValue("svelte")}
          >
            Set to Svelte
          </button>
        </div>
        <Dropdown
          options={options}
          value={value}
          onChange={setValue}
          placeholder="Select a framework..."
        />
      </div>
    );
  },
};

// Full Width
export const FullWidth: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Dropdown options={options} placeholder="Full width dropdown" fullWidth />
    </div>
  ),
};

// Large Option Set
export const LargeOptionSet: Story = {
  render: () => {
    const manyOptions = Array.from({ length: 20 }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1} - ${["Alpha", "Beta", "Gamma", "Delta", "Epsilon"][i % 5]} ${["One", "Two", "Three", "Four", "Five"][i % 5]}`,
    }));

    return (
      <div className="w-64">
        <Dropdown
          options={manyOptions}
          placeholder="Select from many options..."
          searchable
        />
      </div>
    );
  },
};

// Disabled Options
export const DisabledOptions: Story = {
  render: () => {
    const optionsWithDisabled = [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue.js", disabled: true },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte", disabled: true },
      { value: "solid", label: "Solid.js" },
    ];

    return (
      <div className="w-64">
        <Dropdown
          options={optionsWithDisabled}
          placeholder="Some options are disabled..."
          defaultValue="react"
        />
      </div>
    );
  },
};

// Interactive Playground
export const Interactive: Story = {
  args: {
    options: options,
    defaultValue: "react",
    placeholder: "Select a framework...",
    label: "Framework",
    helperText: "Choose your preferred framework",
    size: "md",
    searchable: false,
    disabled: false,
    fullWidth: false,
    error: false,
    errorMessage: "Please select a valid framework",
  },
};
