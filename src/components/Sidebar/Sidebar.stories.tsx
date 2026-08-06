import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

// Icons
const HomeIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const FolderIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
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

const SettingsIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

const DocsIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const MailIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const groups = [
  {
    label: "Main",
    icon: <HomeIcon />,
    defaultExpanded: true,
    items: [
      { id: "dashboard", label: "Dashboard", icon: <HomeIcon />, active: true },
      { id: "projects", label: "Projects", icon: <FolderIcon />, badge: 12 },
      { id: "team", label: "Team", icon: <UserIcon /> },
    ],
  },
  {
    label: "Management",
    icon: <SettingsIcon />,
    items: [
      {
        id: "documents",
        label: "Documents",
        icon: <DocsIcon />,
        subItems: [
          { id: "docs-invoices", label: "Invoices" },
          { id: "docs-reports", label: "Reports", badge: 3 },
          { id: "docs-archive", label: "Archive" },
        ],
      },
      {
        id: "messages",
        label: "Messages",
        icon: <MailIcon />,
        badge: 5,
        subItems: [
          { id: "msgs-inbox", label: "Inbox" },
          { id: "msgs-sent", label: "Sent" },
          { id: "msgs-drafts", label: "Drafts" },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        icon: <SettingsIcon />,
        disabled: true,
      },
    ],
  },
];

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    collapsible: { control: "boolean" },
    iconOnly: { control: "boolean" },
    showGroupLabels: { control: "boolean" },
  },
  args: {
    collapsible: true,
    showLabels: true,
    showGroupLabels: true,
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const brand = (
  <span
    className="font-heading font-bold text-lg tracking-tight"
    style={{
      background: "var(--gradient-primary)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}
  >
    DARA UI
  </span>
);

const footer = (
  <button className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-180 w-full px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-elevated)]/30">
    <LogoutIcon />
    <span>Logout</span>
  </button>
);

export const Default: Story = {
  render: (args) => (
    <div className="min-h-screen">
      <Sidebar {...args} brand={brand} groups={groups} footer={footer} />
      <div
        className="p-8"
        style={{ marginLeft: args.iconOnly ? "64px" : "260px" }}
      >
        <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)] mb-4">
          Dashboard
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Press{" "}
          <kbd className="px-2 py-1 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-sm)] font-mono text-sm">
            Ctrl+B
          </kbd>{" "}
          to toggle the sidebar.
        </p>
      </div>
    </div>
  ),
};

export const Collapsed: Story = {
  render: (args) => (
    <div className="min-h-screen">
      <Sidebar
        {...args}
        brand={brand}
        groups={groups}
        footer={footer}
        defaultCollapsed
      />
      <div className="p-8 ml-[64px]">
        <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)] mb-4">
          Collapsed Sidebar
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Hover over icons to see tooltips.
        </p>
      </div>
    </div>
  ),
};

export const IconOnly: Story = {
  render: (args) => (
    <div className="min-h-screen">
      <Sidebar
        {...args}
        brand={brand}
        groups={groups}
        footer={footer}
        iconOnly
      />
      <div className="p-8 ml-[64px]">
        <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)] mb-4">
          Icon Only Mode
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Always shows icons without labels.
        </p>
      </div>
    </div>
  ),
};

export const WithoutGroups: Story = {
  render: (args) => {
    const flatGroups = [
      {
        label: "",
        items: [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: <HomeIcon />,
            active: true,
          },
          {
            id: "projects",
            label: "Projects",
            icon: <FolderIcon />,
            badge: 12,
          },
          { id: "team", label: "Team", icon: <UserIcon /> },
          { id: "settings", label: "Settings", icon: <SettingsIcon /> },
        ],
      },
    ];

    return (
      <div className="min-h-screen">
        <Sidebar
          {...args}
          brand={brand}
          groups={flatGroups}
          showGroupLabels={false}
        />
        <div className="p-8 ml-[260px]">
          <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            Without Groups
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Flat navigation without group headers.
          </p>
        </div>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState("dashboard");
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div className="min-h-screen">
        <Sidebar
          {...args}
          brand={brand}
          groups={groups}
          activeItemId={activeId}
          onItemClick={setActiveId}
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
          footer={footer}
        />
        <div className="p-8 ml-[260px]">
          <h1 className="font-heading text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            Controlled Sidebar
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-4">
            Active:{" "}
            <span className="text-[var(--color-primary)] font-bold">
              {activeId}
            </span>
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
              onClick={() => setActiveId("dashboard")}
            >
              Dashboard
            </button>
            <button
              className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-secondary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-secondary-hover)]"
              onClick={() => setActiveId("projects")}
            >
              Projects
            </button>
            <button
              className="px-4 py-2 rounded-[var(--radius-md)] glass hover:bg-[var(--color-bg-elevated)]/30"
              onClick={() => setActiveId("documents")}
            >
              Documents
            </button>
            <button
              className="px-4 py-2 rounded-[var(--radius-md)] glass hover:bg-[var(--color-bg-elevated)]/30"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "Expand" : "Collapse"}
            </button>
          </div>
        </div>
      </div>
    );
  },
};
