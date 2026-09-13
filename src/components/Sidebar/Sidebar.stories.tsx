import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import {
  HomeIcon,
  FolderIcon,
  UserIcon,
  SettingsIcon,
  DocsIcon,
  MailIcon,
  LogoutIcon,
} from "../Icons";

// Content components for each item
const DashboardContent = () => (
  <div>
    <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
      Dashboard
    </h2>
    <p className="text-[var(--color-text-secondary)]">
      Welcome to your dashboard. Here you can see an overview of your projects
      and team activity.
    </p>
  </div>
);

const ProjectsContent = () => (
  <div>
    <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
      Projects
    </h2>
    <p className="text-[var(--color-text-secondary)]">
      Manage all your projects in one place. You have 12 active projects.
    </p>
  </div>
);

const TeamContent = () => (
  <div>
    <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
      Team
    </h2>
    <p className="text-[var(--color-text-secondary)]">
      Your team members and their roles. 5 members online.
    </p>
  </div>
);

const InvoicesContent = () => (
  <div>
    <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
      Invoices
    </h2>
    <p className="text-[var(--color-text-secondary)]">
      View and manage all your invoices.
    </p>
  </div>
);

const ReportsContent = () => (
  <div>
    <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
      Reports
    </h2>
    <p className="text-[var(--color-text-secondary)]">
      Generate and view detailed reports.
    </p>
  </div>
);

const ArchiveContent = () => (
  <div>
    <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
      Archive
    </h2>
    <p className="text-[var(--color-text-secondary)]">
      Access archived documents and records.
    </p>
  </div>
);

const InboxContent = () => (
  <div>
    <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
      Inbox
    </h2>
    <p className="text-[var(--color-text-secondary)]">
      Your unread messages and conversations.
    </p>
  </div>
);

const SentContent = () => (
  <div>
    <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
      Sent
    </h2>
    <p className="text-[var(--color-text-secondary)]">
      Messages you have sent to others.
    </p>
  </div>
);

const DraftsContent = () => (
  <div>
    <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
      Drafts
    </h2>
    <p className="text-[var(--color-text-secondary)]">
      Your saved drafts and pending messages.
    </p>
  </div>
);

const SettingsContent = () => (
  <div>
    <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
      Settings
    </h2>
    <p className="text-[var(--color-text-secondary)]">
      Configure your application preferences and account settings.
    </p>
  </div>
);

const groups = [
  {
    label: "Main",
    icon: <HomeIcon />,
    defaultExpanded: true,
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <HomeIcon />,
        active: true,
        content: <DashboardContent />,
      },
      {
        id: "projects",
        label: "Projects",
        icon: <FolderIcon />,
        badge: 12,
        content: <ProjectsContent />,
      },
      {
        id: "team",
        label: "Team",
        icon: <UserIcon />,
        content: <TeamContent />,
      },
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
          {
            id: "docs-invoices",
            label: "Invoices",
            content: <InvoicesContent />,
          },
          {
            id: "docs-reports",
            label: "Reports",
            badge: 3,
            content: <ReportsContent />,
          },
          {
            id: "docs-archive",
            label: "Archive",
            content: <ArchiveContent />,
          },
        ],
        content: <div>Documents overview</div>,
      },
      {
        id: "messages",
        label: "Messages",
        icon: <MailIcon />,
        badge: 5,
        subItems: [
          {
            id: "msgs-inbox",
            label: "Inbox",
            content: <InboxContent />,
          },
          {
            id: "msgs-sent",
            label: "Sent",
            content: <SentContent />,
          },
          {
            id: "msgs-drafts",
            label: "Drafts",
            content: <DraftsContent />,
          },
        ],
        content: <div>Messages overview</div>,
      },
      {
        id: "settings",
        label: "Settings",
        icon: <SettingsIcon />,
        content: <SettingsContent />,
      },
    ],
  },
];

const brand = (
  <span
    className="font-heading font-bold text-lg tracking-tight truncate"
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
  <button className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-180 w-full px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-elevated)]/30 text-sm">
    <LogoutIcon />
    <span>Logout</span>
  </button>
);

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
    showGroupLabels: true,
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Sidebar {...args} brand={brand} groups={groups} footer={footer} />
    </div>
  ),
};

export const Collapsed: Story = {
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Sidebar
        {...args}
        brand={brand}
        groups={groups}
        footer={footer}
        defaultCollapsed
      />
    </div>
  ),
};

export const IconOnly: Story = {
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Sidebar
        {...args}
        brand={brand}
        groups={groups}
        footer={footer}
        iconOnly
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState("dashboard");
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <Sidebar
          {...args}
          brand={brand}
          groups={groups}
          footer={footer}
          activeItemId={activeId}
          onItemClick={setActiveId}
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
        />
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-3 flex-wrap justify-center bg-[var(--color-bg-secondary)] p-3 rounded-[var(--radius-md)] glass"
          style={{
            marginLeft: collapsed ? "32px" : "130px",
          }}
        >
          <button
            className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] bg-[var(--color-primary-solid)] text-white hover:bg-[var(--color-primary-hover)]"
            onClick={() => setActiveId("dashboard")}
          >
            Dashboard
          </button>
          <button
            className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] bg-[var(--color-secondary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-secondary-hover)]"
            onClick={() => setActiveId("projects")}
          >
            Projects
          </button>
          <button
            className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] glass hover:bg-[var(--color-bg-elevated)]/30"
            onClick={() => setActiveId("docs-invoices")}
          >
            Invoices
          </button>
          <button
            className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] glass hover:bg-[var(--color-bg-elevated)]/30"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </div>
    );
  },
};
