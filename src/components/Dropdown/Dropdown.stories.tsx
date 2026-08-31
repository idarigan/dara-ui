import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";
import { useState } from "react";
import { UserIcon, SettingsIcon, StarIcon, CheckIcon } from "../Icons";

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
            className="px-2 py-1 text-xs bg-[var(--color-primary-solid)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--color-primary-hover)]"
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
