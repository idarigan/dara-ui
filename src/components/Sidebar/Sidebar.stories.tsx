import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import type { ReactNode } from "react";
import { Card } from "../Card/Card";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Avatar } from "../Avatar/Avatar";
import { Progress } from "../Progress/Progress";
import { StatsWidget } from "../StatsWidget/StatsWidget";
import { Switch } from "../Switch/Switch";
import { Input } from "../Input/Input";
import {
  HomeIcon,
  FolderIcon,
  UserIcon,
  SettingsIcon,
  DocsIcon,
  MailIcon,
  LogoutIcon,
  SearchIcon,
} from "../Icons";

// ----------------------------------------------------------------
// Content panels — built only from Dara UI components
// ----------------------------------------------------------------

const Panel = ({
  title,
  badge,
  action,
  children,
}: {
  title: string;
  badge?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)]">
          {title}
        </h2>
        {badge}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const DashboardContent = () => (
  <Panel
    title="Dashboard"
    badge={
      <Badge variant="success" size="sm" glow>
        Live
      </Badge>
    }
    action={
      <Button size="sm" variant="outline">
        Export
      </Button>
    }
  >
    <StatsWidget
      title="This week"
      variant="bar"
      glow="primary"
      stats={[
        { label: "Deploys", value: 42, max: 60, trend: 12, color: "primary" },
        { label: "Uptime", value: 99, unit: "%", trend: 1, color: "success" },
        { label: "Open issues", value: 7, max: 40, trend: -3, color: "warning" },
      ]}
    />
    <Card glow="secondary">
      <Progress
        value={68}
        label="Quarterly goal"
        labelPosition="top"
        showLabel
        color="gradient"
        glow
      />
    </Card>
  </Panel>
);

const projects = [
  { name: "Aurora", status: "Active", value: 82, color: "primary" as const },
  { name: "Nightfall", status: "Review", value: 54, color: "secondary" as const },
  { name: "Archive", status: "Paused", value: 23, color: "warning" as const },
];

const ProjectsContent = () => (
  <Panel
    title="Projects"
    badge={<Badge size="sm">12 active</Badge>}
    action={
      <Button size="sm" glow="primary">
        New project
      </Button>
    }
  >
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.name} float padding="md">
          <div className="mb-4 flex items-center justify-between gap-2">
            <span className="font-heading font-semibold">{project.name}</span>
            <Badge
              size="sm"
              outline
              variant={project.status === "Paused" ? "warning" : "primary"}
            >
              {project.status}
            </Badge>
          </div>
          <Progress value={project.value} size="sm" color={project.color} showLabel />
        </Card>
      ))}
    </div>
  </Panel>
);

const team = [
  { name: "Dara Rahimi", role: "Design lead", status: "online" as const },
  { name: "Sam Lee", role: "Frontend", status: "away" as const },
  { name: "Niloo Karimi", role: "Backend", status: "busy" as const },
  { name: "Alex Moreau", role: "QA", status: "offline" as const },
];

const TeamContent = () => (
  <Panel
    title="Team"
    badge={
      <Badge variant="success" size="sm">
        1 online
      </Badge>
    }
    action={
      <Button size="sm" variant="glass" leftIcon={<UserIcon />}>
        Invite
      </Button>
    }
  >
    <Card padding="sm">
      <div className="flex flex-col divide-y divide-[var(--color-border-secondary)]">
        {team.map((member) => (
          <div key={member.name} className="flex items-center gap-3 px-2 py-3">
            <Avatar
              fallback
              fallbackText={member.name}
              status={member.status}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{member.name}</div>
              <div className="text-sm text-[var(--color-text-tertiary)]">
                {member.role}
              </div>
            </div>
            <Button size="sm" variant="outline">
              Message
            </Button>
          </div>
        ))}
      </div>
    </Card>
  </Panel>
);

const DocumentList = ({
  title,
  rows,
}: {
  title: string;
  rows: { name: string; meta: string; tag: string; variant: "primary" | "success" | "warning" | "danger" }[];
}) => (
  <Panel
    title={title}
    action={
      <Input
        size="sm"
        type="search"
        placeholder={`Search ${title.toLowerCase()}…`}
        leftIcon={<SearchIcon />}
      />
    }
  >
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <Card key={row.name} padding="sm" variant="solid">
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="min-w-0">
              <div className="truncate font-medium">{row.name}</div>
              <div className="text-sm text-[var(--color-text-tertiary)]">
                {row.meta}
              </div>
            </div>
            <Badge size="sm" variant={row.variant}>
              {row.tag}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  </Panel>
);

const InvoicesContent = () => (
  <DocumentList
    title="Invoices"
    rows={[
      { name: "INV-2041", meta: "Nov 24 · $1,280.00", tag: "Paid", variant: "success" },
      { name: "INV-2040", meta: "Nov 18 · $640.00", tag: "Due", variant: "warning" },
      { name: "INV-2039", meta: "Nov 02 · $2,150.00", tag: "Overdue", variant: "danger" },
    ]}
  />
);

const ReportsContent = () => (
  <DocumentList
    title="Reports"
    rows={[
      { name: "Q3 performance", meta: "PDF · 2.4 MB", tag: "New", variant: "primary" },
      { name: "Accessibility audit", meta: "PDF · 860 KB", tag: "New", variant: "primary" },
      { name: "Usage by region", meta: "CSV · 120 KB", tag: "Ready", variant: "success" },
    ]}
  />
);

const ArchiveContent = () => (
  <DocumentList
    title="Archive"
    rows={[
      { name: "2025 roadmap", meta: "Archived Jan 12", tag: "Archived", variant: "warning" },
      { name: "Legacy tokens", meta: "Archived Mar 03", tag: "Archived", variant: "warning" },
    ]}
  />
);

const messages = [
  { from: "Sam Lee", text: "Pushed the new glow tokens 🚀", unread: true },
  { from: "Niloo Karimi", text: "API is ready for review", unread: true },
  { from: "Alex Moreau", text: "QA pass on the sidebar done", unread: false },
];

const MessageList = ({ title, empty }: { title: string; empty?: string }) => (
  <Panel
    title={title}
    action={
      <Button size="sm" variant="primary" leftIcon={<MailIcon />}>
        Compose
      </Button>
    }
  >
    {empty ? (
      <Card variant="outline">
        <p className="text-center text-[var(--color-text-secondary)]">{empty}</p>
      </Card>
    ) : (
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <Card key={message.from} padding="sm">
            <div className="flex items-center gap-3 px-2">
              <Avatar fallback fallbackText={message.from} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{message.from}</div>
                <div className="truncate text-sm text-[var(--color-text-secondary)]">
                  {message.text}
                </div>
              </div>
              {message.unread && (
                <Badge size="sm" variant="primary" glow>
                  New
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    )}
  </Panel>
);

const InboxContent = () => <MessageList title="Inbox" />;
const SentContent = () => <MessageList title="Sent" />;
const DraftsContent = () => (
  <MessageList title="Drafts" empty="No drafts — you're all caught up." />
);

const SettingsContent = () => (
  <Panel title="Settings">
    <Card>
      <div className="flex flex-col gap-5">
        <Input label="Display name" defaultValue="Dara" fullWidth />
        <Input label="Email" type="email" defaultValue="dara@example.com" fullWidth />
        <div className="flex flex-col gap-3">
          <Switch label="Email notifications" defaultChecked glow />
          <Switch label="Reduce motion" />
          <Switch label="Show glow effects" defaultChecked glow />
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </div>
      </div>
    </Card>
  </Panel>
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
        content: <InvoicesContent />,
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
        content: <InboxContent />,
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
  <span className="font-heading font-bold text-lg tracking-tight truncate text-gradient-primary">
    DARA UI
  </span>
);

const footer = (
  <Button variant="glass" size="sm" fullWidth leftIcon={<LogoutIcon />}>
    Logout
  </Button>
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
    groups,
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Sidebar {...args} brand={brand} footer={footer} />
    </div>
  ),
};

export const MobileTabs: Story = {
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-bg-primary)] p-4">
      <Sidebar {...args} forceMobile brand={brand} />
    </div>
  ),
};

export const Collapsed: Story = {
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Sidebar {...args} brand={brand} footer={footer} defaultCollapsed />
    </div>
  ),
};

export const IconOnly: Story = {
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Sidebar {...args} brand={brand} footer={footer} iconOnly />
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
          footer={footer}
          activeItemId={activeId}
          onItemClick={setActiveId}
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
        />
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
          style={{ marginLeft: collapsed ? "32px" : "130px" }}
        >
          <Card padding="sm" className="flex flex-wrap justify-center gap-3">
            <Button size="sm" onClick={() => setActiveId("dashboard")}>
              Dashboard
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setActiveId("projects")}
            >
              Projects
            </Button>
            <Button
              size="sm"
              variant="glass"
              onClick={() => setActiveId("docs-invoices")}
            >
              Invoices
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "Expand" : "Collapse"}
            </Button>
          </Card>
        </div>
      </div>
    );
  },
};

