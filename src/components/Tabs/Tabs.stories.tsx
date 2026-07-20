import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { useState } from "react";

// Icons
const HomeIcon = () => (
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

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

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["left", "center", "right"],
      description: "Tab alignment",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Tab size",
    },
    glowColor: {
      control: "select",
      options: ["primary", "secondary", "accent", "success", "danger", "none"],
      description: "Glow color for active indicator",
    },
    fullWidth: {
      control: "boolean",
      description: "Tabs take full width",
    },
  },
  args: {
    align: "left",
    size: "md",
    glowColor: "primary",
    fullWidth: false,
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
  {
    label: "Home",
    content: (
      <div className="p-4 text-[var(--color-text-secondary)]">
        🏠 Home content — Welcome to the dashboard!
      </div>
    ),
  },
  {
    label: "Profile",
    content: (
      <div className="p-4 text-[var(--color-text-secondary)]">
        👤 Profile content — Your user settings and info.
      </div>
    ),
  },
  {
    label: "Settings",
    content: (
      <div className="p-4 text-[var(--color-text-secondary)]">
        ⚙️ Settings content — Configure your preferences.
      </div>
    ),
  },
];

// Default
export const Default: Story = {
  args: {
    items: defaultItems,
    defaultValue: "Home",
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-96">
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Primary (default)
        </p>
        <Tabs items={defaultItems} defaultValue="Home" glowColor="primary" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Secondary
        </p>
        <Tabs items={defaultItems} defaultValue="Home" glowColor="secondary" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Accent
        </p>
        <Tabs items={defaultItems} defaultValue="Home" glowColor="accent" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Success
        </p>
        <Tabs items={defaultItems} defaultValue="Home" glowColor="success" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Danger
        </p>
        <Tabs items={defaultItems} defaultValue="Home" glowColor="danger" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          No Glow
        </p>
        <Tabs items={defaultItems} defaultValue="Home" glowColor="none" />
      </div>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Small
        </p>
        <Tabs items={defaultItems} defaultValue="Home" size="sm" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Medium (default)
        </p>
        <Tabs items={defaultItems} defaultValue="Home" size="md" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Large
        </p>
        <Tabs items={defaultItems} defaultValue="Home" size="lg" />
      </div>
    </div>
  ),
};

// Alignments
export const Alignments: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-96">
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Left (default)
        </p>
        <Tabs items={defaultItems} defaultValue="Home" align="left" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Center
        </p>
        <Tabs items={defaultItems} defaultValue="Home" align="center" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Right
        </p>
        <Tabs items={defaultItems} defaultValue="Home" align="right" />
      </div>
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  render: () => (
    <div className="w-96">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
        Full Width
      </p>
      <Tabs items={defaultItems} defaultValue="Home" fullWidth />
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  args: {
    items: [
      {
        label: "Home",
        icon: <HomeIcon />,
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            🏠 Home dashboard
          </div>
        ),
      },
      {
        label: "Profile",
        icon: <UserIcon />,
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            👤 Your profile
          </div>
        ),
      },
      {
        label: "Settings",
        icon: <SettingsIcon />,
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            ⚙️ Settings panel
          </div>
        ),
      },
    ],
    defaultValue: "Home",
  },
};

// Disabled Tabs
export const DisabledTabs: Story = {
  args: {
    items: [
      {
        label: "Home",
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            🏠 Home content
          </div>
        ),
      },
      {
        label: "Profile",
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            👤 Profile content
          </div>
        ),
        disabled: true,
      },
      {
        label: "Settings",
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            ⚙️ Settings content
          </div>
        ),
      },
    ],
    defaultValue: "Home",
  },
};

// Controlled
export const Controlled: Story = {
  render: () => {
    const [active, setActive] = useState("Home");

    const items = [
      {
        label: "Home",
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            🏠 Home — Active value:{" "}
            <span className="font-mono text-[var(--color-primary)]">
              {active}
            </span>
          </div>
        ),
      },
      {
        label: "Profile",
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            👤 Profile — Active value:{" "}
            <span className="font-mono text-[var(--color-primary)]">
              {active}
            </span>
          </div>
        ),
      },
      {
        label: "Settings",
        content: (
          <div className="p-4 text-[var(--color-text-secondary)]">
            ⚙️ Settings — Active value:{" "}
            <span className="font-mono text-[var(--color-primary)]">
              {active}
            </span>
          </div>
        ),
      },
    ];

    return (
      <div className="flex flex-col gap-4 w-96">
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
          Controlled — Current:{" "}
          <span className="text-[var(--color-primary)]">{active}</span>
        </p>
        <Tabs
          items={items}
          activeValue={active}
          onChange={(value) => setActive(value)}
        />
      </div>
    );
  },
};

// Rich Content
export const RichContent: Story = {
  render: () => {
    const items = [
      {
        label: "📊 Stats",
        content: (
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-[var(--color-border-secondary)] pb-2">
              <span className="text-[var(--color-text-secondary)] text-sm">
                Total Users
              </span>
              <span className="font-heading text-xl font-bold">12,847</span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--color-border-secondary)] pb-2">
              <span className="text-[var(--color-text-secondary)] text-sm">
                Active Sessions
              </span>
              <span className="font-heading text-xl font-bold text-[var(--color-success)]">
                342
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-secondary)] text-sm">
                Pending Tasks
              </span>
              <span className="font-heading text-xl font-bold text-[var(--color-warning)]">
                18
              </span>
            </div>
          </div>
        ),
      },
      {
        label: "📝 Notes",
        content: (
          <div className="p-4 space-y-2">
            <div className="glass p-3 rounded-[var(--radius-md)]">
              <p className="text-sm text-[var(--color-text-secondary)]">
                • Review Q4 report
              </p>
            </div>
            <div className="glass p-3 rounded-[var(--radius-md)]">
              <p className="text-sm text-[var(--color-text-secondary)]">
                • Update documentation
              </p>
            </div>
            <div className="glass p-3 rounded-[var(--radius-md)]">
              <p className="text-sm text-[var(--color-text-secondary)]">
                • Deploy to production
              </p>
            </div>
          </div>
        ),
      },
      {
        label: "🎯 Tasks",
        content: (
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)]">
              <span className="text-[var(--color-success)]">✅</span>
              <span className="text-sm text-[var(--color-text-secondary)]">
                Design system complete
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)]">
              <span className="text-[var(--color-warning)]">⏳</span>
              <span className="text-sm text-[var(--color-text-secondary)]">
                Component library
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)]">
              <span className="text-[var(--color-danger)]">❌</span>
              <span className="text-sm text-[var(--color-text-secondary)]">
                Legacy cleanup
              </span>
            </div>
          </div>
        ),
      },
    ];

    return <Tabs items={items} defaultValue="📊 Stats" className="w-96" />;
  },
};

// Interactive Playground
export const Interactive: Story = {
  args: {
    items: defaultItems,
    defaultValue: "Home",
    align: "left",
    size: "md",
    glowColor: "primary",
    fullWidth: false,
  },
};
