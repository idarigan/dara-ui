/**
 * Dara UI - Main Demo Application
 *
 * This file serves as the primary showcase for all Dara UI components.
 * It demonstrates the complete component library with interactive examples
 * and full multilingual support (English, Persian, French).
 *
 * The app uses the I18nProvider to handle translations, allowing all UI text
 * to switch dynamically between languages while maintaining RTL support.
 */

// ============================================
// IMPORTS
// ============================================

import { useState, useEffect, useMemo } from "react";
import Button from "./components/Button/Button";
import { Badge } from "./components/Badge/Badge";
import { Input } from "./components/Input/Input";
import { Card } from "./components/Card/Card";
import { Tabs } from "./components/Tabs/Tabs";
import { Accordion } from "./components/Accordion/Accordion";
import { Dropdown } from "./components/Dropdown/Dropdown";
import { Modal } from "./components/Modal/Modal";
import { ToastProvider, useToast } from "./components/Toast";
import { Avatar } from "./components/Avatar/Avatar";
import { Tooltip } from "./components/Tooltip/Tooltip";
import { Progress } from "./components/Progress/Progress";
import { XPBar } from "./components/XPBar";
import { QuestCard } from "./components/QuestCard/QuestCard";
import { CharacterCard } from "./components/CharacterCard/CharacterCard";
import { ThemeProvider, ThemeChanger } from "./components/ThemeChanger";
import { Navbar } from "./components/Navbar";
import type { NavLink } from "./components/Navbar";
import { SocialMedia } from "./components/SocialMedia";
import useDirection from "./hooks/useDirection";
import StatsWidget from "./components/StatsWidget";
import Checkbox from "./components/Checkbox";
import Switch from "./components/Switch";
import Radio from "./components/Radio";
import { Range } from "./components/Range/Range";
import { ProductCard } from "./components/ProductCard/ProductCard";
import { BlogCard } from "./components/BlogCard/BlogCard";
import { Sidebar, SidebarMobileTrigger } from "./components/Sidebar";
import type { SidebarGroup } from "./components/Sidebar";
import {
  I18nProvider,
  useI18n,
  LanguageChanger,
} from "./components/LanguageChanger";
import { translations } from "./translations";

// Visual Effects - imported once
import { Particles } from "./components/Particles/Particles";
import { AuroraBlobs } from "./components/AuroraBlobs/AuroraBlobs";
import { GradientRing } from "./components/GradientRing/GradientRing";
import { NoiseOverlay } from "./components/NoiseOverlay/NoiseOverlay";

// Icons
import {
  SearchIcon,
  UserIcon,
  SettingsIcon,
  HomeIcon,
  ExploreIcon,
  CheckIcon,
  BellIcon,
  BellSlashIcon,
  MoonIcon,
  SunIcon,
  VolumeHighIcon,
  VolumeMuteIcon,
  StarIcon,
  FolderIcon,
  DocsIcon,
  MailIcon,
  LogoutIcon,
  SuccessIcon,
  ErrorIcon,
  WarningIcon,
  RocketIcon,
  AnalyticsIcon,
  SwordsIcon,
  ChartBarIcon,
} from "./components/Icons";

import "./styles/index.css";

type Theme = "nightfall" | "daylight" | "dracula";

// ============================================
// Accordion items for demo
// ============================================

const accordionItems = [
  {
    id: "1",
    title: "📜 What is Dara UI?",
    content: (
      <div>
        Dara UI is a design system that feels like an interface discovered
        inside a futuristic archive hidden beneath during a snowstorm. It blends
        glassmorphism, cyberpunk, gothic aesthetics, Apple minimalism, and anime
        HUD elements.
      </div>
    ),
  },
  {
    id: "2",
    title: "🎨 What themes are available?",
    content: (
      <div>
        <p className="mb-2">Three themes are available:</p>
        <ul className="list-disc list-inside space-y-1 text-[var(--color-text-tertiary)]">
          <li>
            <span className="text-[var(--color-primary)]">Nightfall</span> -
            Dark, mysterious, glass-heavy
          </li>
          <li>
            <span className="text-[var(--color-warning)]">Daylight</span> -
            Light, clean, minimal
          </li>
          <li>
            <span className="text-[var(--color-danger)]">Dracula</span> - Dark,
            intense, red-accented
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "3",
    title: "🔧 How do I install it?",
    content: (
      <div>
        <code className="block p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] font-mono text-sm">
          npm install dara-ui
          <br />
          # or
          <br />
          yarn add dara-ui
        </code>
        <p className="mt-2">Then import components:</p>
        <code className="block p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] font-mono text-sm">
          import {"{ Button, Card, Input }"} from 'dara-ui';
        </code>
      </div>
    ),
  },
];

// ============================================
// Dropdown options
// ============================================

const frameworkOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid.js" },
  { value: "qwik", label: "Qwik" },
];

const dropdownOptionsWithIcons = [
  { value: "user", label: "User Profile", icon: <UserIcon /> },
  { value: "settings", label: "Settings", icon: <SettingsIcon /> },
  { value: "favorites", label: "Favorites", icon: <StarIcon /> },
  { value: "done", label: "Completed", icon: <CheckIcon /> },
];

// ============================================
// Toast Demo Component
// ============================================

function ToastDemo() {
  const toast = useToast();
  const { t } = useI18n();

  return (
    <div className="flex gap-3 flex-wrap">
      <Button
        variant="success"
        onClick={() => toast.success(t("toast.successMsg"))}
      >
        {t("toast.successToast")}
      </Button>
      <Button variant="danger" onClick={() => toast.error(t("toast.errorMsg"))}>
        {t("toast.errorToast")}
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning(t("toast.warningMsg"))}
      >
        {t("toast.warningToast")}
      </Button>
      <Button variant="glass" onClick={() => toast.info(t("toast.infoMsg"))}>
        {t("toast.infoToast")}
      </Button>
    </div>
  );
}

// ============================================
// Main App Content
// ============================================

function AppContent() {
  // ----- Get translation function from i18n context -----
  const { t } = useI18n();

  const [theme, setTheme] = useState<Theme>("nightfall");
  const { direction, toggleDirection } = useDirection("ltr");
  const [activeTab, setActiveTab] = useState("archive");
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>(["1"]);
  const [accordionMode, setAccordionMode] = useState<"single" | "multiple">(
    "single",
  );
  const [selectedFramework, setSelectedFramework] = useState("react");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Handle search from navbar
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  // ----- Navbar links -----
  const navbarLinks: NavLink[] = useMemo(
    () => [
      { label: t("navbar.home"), href: "#", icon: <HomeIcon />, active: true },
      { label: t("navbar.explore"), href: "#", icon: <ExploreIcon /> },
      { label: t("navbar.settings"), href: "#", icon: <SettingsIcon /> },
    ],
    [t],
  );

  const secondaryNavLinks: NavLink[] = useMemo(
    () => [
      { label: t("navbar.dashboard"), href: "#" },
      { label: t("navbar.projects"), href: "#" },
      { label: t("navbar.team"), href: "#" },
      { label: t("navbar.analytics"), href: "#" },
    ],
    [t],
  );

  // ----- Tab items -----
  const tabItems = useMemo(
    () => [
      {
        label: t("tabs.archive"),
        value: "archive",
        content: (
          <div className="py-4 text-[var(--color-text-secondary)]">
            {t("tabs.archiveContent")}
          </div>
        ),
      },
      {
        label: t("tabs.quests"),
        value: "quests",
        content: (
          <div className="py-4 text-[var(--color-text-secondary)]">
            {t("tabs.questsContent")}
          </div>
        ),
      },
      {
        label: t("tabs.stats"),
        value: "stats",
        content: (
          <div className="py-4 text-[var(--color-text-secondary)]">
            {t("tabs.statsContent")}
          </div>
        ),
      },
      {
        label: t("tabs.settings"),
        value: "settings",
        content: (
          <div className="py-4 text-[var(--color-text-secondary)]">
            {t("tabs.settingsContent")}
          </div>
        ),
      },
    ],
    [t],
  );

  // ----- Accordion items -----
  const accordionItems = useMemo(
    () => [
      {
        id: "1",
        title: t("accordion.q1"),
        content: <div>{t("accordion.a1")}</div>,
      },
      {
        id: "2",
        title: t("accordion.q2"),
        content: <div>{t("accordion.a2")}</div>,
      },
      {
        id: "3",
        title: t("accordion.q3"),
        content: (
          <div>
            <code
              className="block p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] font-mono text-sm"
              dir="ltr"
              style={{ textAlign: "left", unicodeBidi: "embed" }}
            >
              npm install dara-ui
              <br />
              # or
              <br />
              yarn add dara-ui
            </code>
            <p className="mt-2" dir="auto">
              {t("common.thenImport")}
            </p>
            <code
              className="block p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] font-mono text-sm"
              dir="ltr"
              style={{ textAlign: "left", unicodeBidi: "embed" }}
            >
              import {"{ Button, Card, Input }"} from 'dara-ui';
            </code>
          </div>
        ),
      },
    ],
    [t],
  );

  // ----- Accordion items -----
  const accordionItemsWithIcons = useMemo(
    () => [
      {
        id: "1",
        title: t("accordion.dashboard"),
        icon: <HomeIcon />,
        content: (
          <div className="text-[var(--color-text-secondary)]">
            {t("accordion.dashboardContent")}
          </div>
        ),
      },
      {
        id: "2",
        title: t("accordion.projects"),
        icon: <ExploreIcon />,
        content: (
          <div className="text-[var(--color-text-secondary)]">
            {t("accordion.projectsContent")}
          </div>
        ),
      },
      {
        id: "3",
        title: t("accordion.settingsAccordion"),
        icon: <SettingsIcon />,
        content: (
          <div className="text-[var(--color-text-secondary)]">
            {t("accordion.settingsContentAccordion")}
          </div>
        ),
      },
    ],
    [t],
  );

  // ----- Sidebar groups -----
  const sidebarGroups: SidebarGroup[] = useMemo(
    () => [
      // ============================================
      // GROUP 1 - Main
      // ============================================
      {
        label: t("sidebar.main"),
        icon: <HomeIcon />,
        defaultExpanded: true,
        items: [
          // ----- Dashboard -----
          {
            id: "dashboard",
            label: t("sidebar.dashboard"),
            icon: <HomeIcon />,
            content: (
              <div className="flex flex-col gap-5">
                <div>
                  <h2
                    className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-1"
                    dir="auto"
                  >
                    {t("sidebar.dashboard")}
                  </h2>
                  <p
                    className="text-[var(--color-text-secondary)] text-sm"
                    dir="auto"
                  >
                    {t("sidebar.dashboardContent")}
                  </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Card glow="primary" className="text-center">
                    <div className="text-2xl font-heading font-bold text-[var(--color-primary)]">
                      12
                    </div>
                    <p
                      className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono mt-1"
                      dir="auto"
                    >
                      {t("sidebar.activeProjectsLabel")}
                    </p>
                  </Card>
                  <Card glow="secondary" className="text-center">
                    <div className="text-2xl font-heading font-bold text-[var(--color-secondary)]">
                      47
                    </div>
                    <p
                      className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono mt-1"
                      dir="auto"
                    >
                      {t("sidebar.completedTasksLabel")}
                    </p>
                  </Card>
                  <Card glow="accent" className="text-center">
                    <div className="text-2xl font-heading font-bold text-[var(--color-accent)]">
                      8
                    </div>
                    <p
                      className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono mt-1"
                      dir="auto"
                    >
                      {t("sidebar.teamMembersLabel")}
                    </p>
                  </Card>
                </div>

                {/* Storage widget */}
                <Card variant="solid">
                  <p
                    className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3"
                    dir="auto"
                  >
                    {t("sidebar.storageLabel")}
                  </p>
                  <Progress
                    value={72}
                    color="gradient"
                    labelPosition="right"
                    showLabel
                  />
                </Card>

                {/* Recent activity */}
                <Card variant="outline">
                  <p
                    className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3"
                    dir="auto"
                  >
                    {t("sidebar.recentActivityLabel")}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {[
                      {
                        avatar: "JD",
                        text: t("sidebar.activityUpload"),
                        time: t("sidebar.minutesAgo", { count: 5 }),
                      },
                      {
                        avatar: "JS",
                        text: t("sidebar.activityComment"),
                        time: t("sidebar.minutesAgo", { count: 22 }),
                      },
                      {
                        avatar: "AK",
                        text: t("sidebar.activityMerge"),
                        time: t("sidebar.hoursAgo", { count: 1 }),
                      },
                      {
                        avatar: "MR",
                        text: t("sidebar.activityDeploy"),
                        time: t("sidebar.hoursAgo", { count: 3 }),
                      },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Avatar size="sm" fallbackText={item.avatar} />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className="text-sm text-[var(--color-text-primary)] truncate"
                            dir="auto"
                          >
                            {item.text}
                          </span>
                          <span
                            className="text-[10px] font-mono text-[var(--color-text-tertiary)]"
                            dir="auto"
                          >
                            {item.time}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ),
          },

          // ----- Projects -----
          {
            id: "projects",
            label: t("sidebar.projects"),
            icon: <FolderIcon />,
            badge: 12,
            content: (
              <div className="flex flex-col gap-5">
                <div>
                  <h2
                    className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-1"
                    dir="auto"
                  >
                    {t("sidebar.projects")}
                  </h2>
                  <p
                    className="text-[var(--color-text-secondary)] text-sm"
                    dir="auto"
                  >
                    {t("sidebar.projectsContent")}
                  </p>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    }
                  >
                    {t("sidebar.deployAction")}
                  </Button>
                  <Button variant="secondary" size="sm">
                    {t("sidebar.reviewAction")}
                  </Button>
                  <Button variant="glass" size="sm">
                    {t("sidebar.inviteAction")}
                  </Button>
                </div>

                {/* Project cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      title: t("sidebar.projectAlpha"),
                      status: t("sidebar.inProgress"),
                      color: "primary" as const,
                      progress: 65,
                    },
                    {
                      title: t("sidebar.projectBeta"),
                      status: t("sidebar.completed"),
                      color: "success" as const,
                      progress: 100,
                    },
                    {
                      title: t("sidebar.projectGamma"),
                      status: t("sidebar.onHold"),
                      color: "warning" as const,
                      progress: 32,
                    },
                    {
                      title: t("sidebar.projectDelta"),
                      status: t("sidebar.review"),
                      color: "accent" as const,
                      progress: 88,
                    },
                  ].map((p, i) => (
                    <Card key={i} variant="solid" glow={p.color}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3
                          className="font-heading font-bold text-[var(--color-text-primary)] text-sm"
                          dir="auto"
                        >
                          {p.title}
                        </h3>
                        <Badge variant={p.color} size="sm" outline>
                          {p.status}
                        </Badge>
                      </div>
                      <Progress
                        value={p.progress}
                        color={p.color}
                        labelPosition="right"
                        showLabel
                        size="sm"
                      />
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },

          // ----- Team -----
          {
            id: "team",
            label: t("sidebar.team"),
            icon: <UserIcon />,
            content: (
              <div className="flex flex-col gap-5">
                <div>
                  <h2
                    className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-1"
                    dir="auto"
                  >
                    {t("sidebar.team")}
                  </h2>
                  <p
                    className="text-[var(--color-text-secondary)] text-sm"
                    dir="auto"
                  >
                    {t("sidebar.teamContent")}
                  </p>
                </div>

                {/* Member list */}
                <div className="flex flex-col gap-3">
                  {[
                    {
                      avatar: "JD",
                      name: "John Doe",
                      role: t("sidebar.memberRole1"),
                      status: "online" as const,
                    },
                    {
                      avatar: "JS",
                      name: "Jane Smith",
                      role: t("sidebar.memberRole2"),
                      status: "online" as const,
                    },
                    {
                      avatar: "AK",
                      name: "Alex Kim",
                      role: t("sidebar.memberRole3"),
                      status: "away" as const,
                    },
                    {
                      avatar: "MR",
                      name: "Maya Ross",
                      role: t("sidebar.memberRole4"),
                      status: "offline" as const,
                    },
                  ].map((m, i) => (
                    <Card
                      key={i}
                      variant="glass"
                      padding="sm"
                      className="flex items-center gap-3"
                    >
                      <Avatar
                        size="md"
                        fallbackText={m.avatar}
                        status={m.status}
                        glow={m.status === "online" ? "primary" : undefined}
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span
                          className="text-sm font-medium text-[var(--color-text-primary)] truncate"
                          dir="auto"
                        >
                          {m.name}
                        </span>
                        <span
                          className="text-[11px] text-[var(--color-text-tertiary)] truncate"
                          dir="auto"
                        >
                          {m.role}
                        </span>
                      </div>
                      <Badge
                        variant={
                          m.status === "online"
                            ? "success"
                            : m.status === "away"
                              ? "warning"
                              : "secondary"
                        }
                        size="sm"
                      >
                        {m.status}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
        ],
      },

      // ============================================
      // GROUP 2 - Management
      // ============================================
      {
        label: t("sidebar.management"),
        icon: <SettingsIcon />,
        items: [
          // ----- Documents (with sub-menu) -----
          {
            id: "documents",
            label: t("sidebar.documents"),
            icon: <DocsIcon />,
            subItems: [
              {
                id: "docs-invoices",
                label: t("sidebar.invoices"),
                content: (
                  <div className="flex flex-col gap-5">
                    <h2
                      className="font-heading text-2xl font-bold text-[var(--color-text-primary)]"
                      dir="auto"
                    >
                      {t("sidebar.invoices")}
                    </h2>
                    <div className="flex flex-col gap-3">
                      {[
                        {
                          num: 1042,
                          amount: "$1,250.00",
                          status: t("sidebar.invoicePaid"),
                          color: "success" as const,
                        },
                        {
                          num: 1041,
                          amount: "$890.00",
                          status: t("sidebar.invoicePaid"),
                          color: "success" as const,
                        },
                        {
                          num: 1040,
                          amount: "$2,100.00",
                          status: t("sidebar.invoicePending"),
                          color: "warning" as const,
                        },
                        {
                          num: 1039,
                          amount: "$450.00",
                          status: t("sidebar.invoiceOverdue"),
                          color: "danger" as const,
                        },
                      ].map((inv, i) => (
                        <Card
                          key={i}
                          variant="outline"
                          padding="sm"
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex flex-col min-w-0">
                            <span
                              className="text-sm font-medium text-[var(--color-text-primary)] truncate"
                              dir="auto"
                            >
                              {t("sidebar.invoiceNumber", { num: inv.num })}
                            </span>
                            <span className="text-xs font-mono text-[var(--color-text-tertiary)]">
                              {inv.amount}
                            </span>
                          </div>
                          <Badge variant={inv.color} size="sm" outline>
                            {inv.status}
                          </Badge>
                        </Card>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                id: "docs-reports",
                label: t("sidebar.reports"),
                badge: 3,
                content: (
                  <div className="flex flex-col gap-5">
                    <h2
                      className="font-heading text-2xl font-bold text-[var(--color-text-primary)]"
                      dir="auto"
                    >
                      {t("sidebar.reports")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          label: t("sidebar.reportWeekly"),
                          value: 62,
                          color: "primary" as const,
                        },
                        {
                          label: t("sidebar.reportMonthly"),
                          value: 84,
                          color: "secondary" as const,
                        },
                        {
                          label: t("sidebar.reportQuarterly"),
                          value: 47,
                          color: "accent" as const,
                        },
                      ].map((r, i) => (
                        <Card key={i} variant="solid" className="text-center">
                          <Progress
                            variant="radial"
                            value={r.value}
                            color={r.color}
                            radialSize={80}
                            showLabel
                          />
                          <p
                            className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-mono mt-2"
                            dir="auto"
                          >
                            {r.label}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                id: "docs-archive",
                label: t("sidebar.archive"),
                content: (
                  <div className="flex flex-col gap-5">
                    <h2
                      className="font-heading text-2xl font-bold text-[var(--color-text-primary)]"
                      dir="auto"
                    >
                      {t("sidebar.archive")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <BlogCard
                        title={t("blogCard.post1")}
                        excerpt={t("blogCard.excerpt1")}
                        coverImage="https://picsum.photos/seed/archive-blog/400/250"
                        author={t("blogCard.author1")}
                        date={new Date("2024-11-15")}
                        readTime={5}
                        category={t("blogCard.category1")}
                        link="#"
                      />
                      <BlogCard
                        title={t("blogCard.post2")}
                        excerpt={t("blogCard.excerpt2")}
                        coverImage="https://picsum.photos/seed/archive-blog2/400/250"
                        author={t("blogCard.author2")}
                        date={new Date("2024-11-10")}
                        readTime={8}
                        category={t("blogCard.category2")}
                        glow="secondary"
                        link="#"
                      />
                    </div>
                  </div>
                ),
              },
            ],
            content: <div>{t("sidebar.documents")}</div>,
          },

          // ----- Messages (with sub-menu) -----
          {
            id: "messages",
            label: t("sidebar.messages"),
            icon: <MailIcon />,
            badge: 5,
            subItems: [
              {
                id: "msgs-inbox",
                label: t("sidebar.inbox"),
                content: (
                  <div className="flex flex-col gap-5">
                    <h2
                      className="font-heading text-2xl font-bold text-[var(--color-text-primary)]"
                      dir="auto"
                    >
                      {t("sidebar.inbox")}
                    </h2>
                    <div className="flex flex-col gap-3">
                      {[
                        {
                          avatar: "JD",
                          name: "John Doe",
                          preview: t("sidebar.activityComment"),
                          time: t("sidebar.minutesAgo", { count: 5 }),
                        },
                        {
                          avatar: "JS",
                          name: "Jane Smith",
                          preview: t("sidebar.activityUpload"),
                          time: t("sidebar.minutesAgo", { count: 22 }),
                        },
                        {
                          avatar: "AK",
                          name: "Alex Kim",
                          preview: t("sidebar.activityMerge"),
                          time: t("sidebar.hoursAgo", { count: 2 }),
                        },
                      ].map((m, i) => (
                        <Card
                          key={i}
                          variant="glass"
                          padding="sm"
                          className="flex items-start gap-3"
                        >
                          <Avatar
                            size="md"
                            fallbackText={m.avatar}
                            status="online"
                          />
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className="text-sm font-medium text-[var(--color-text-primary)] truncate"
                                dir="auto"
                              >
                                {m.name}
                              </span>
                              <span
                                className="text-[10px] font-mono text-[var(--color-text-tertiary)] shrink-0"
                                dir="auto"
                              >
                                {m.time}
                              </span>
                            </div>
                            <span
                              className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5"
                              dir="auto"
                            >
                              {m.preview}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                id: "msgs-sent",
                label: t("sidebar.sent"),
                content: (
                  <div className="flex flex-col gap-5">
                    <h2
                      className="font-heading text-2xl font-bold text-[var(--color-text-primary)]"
                      dir="auto"
                    >
                      {t("sidebar.sent")}
                    </h2>
                    <p
                      className="text-[var(--color-text-secondary)] text-sm"
                      dir="auto"
                    >
                      {t("sidebar.sentContent")}
                    </p>
                  </div>
                ),
              },
              {
                id: "msgs-drafts",
                label: t("sidebar.drafts"),
                content: (
                  <div className="flex flex-col gap-5">
                    <h2
                      className="font-heading text-2xl font-bold text-[var(--color-text-primary)]"
                      dir="auto"
                    >
                      {t("sidebar.drafts")}
                    </h2>
                    <p
                      className="text-[var(--color-text-secondary)] text-sm"
                      dir="auto"
                    >
                      {t("sidebar.draftsContent")}
                    </p>
                  </div>
                ),
              },
            ],
            content: <div>{t("sidebar.messages")}</div>,
          },

          // ----- Settings -----
          {
            id: "settings",
            label: t("sidebar.settings"),
            icon: <SettingsIcon />,
            content: (
              <div className="flex flex-col gap-5">
                <div>
                  <h2
                    className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-1"
                    dir="auto"
                  >
                    {t("sidebar.settings")}
                  </h2>
                  <p
                    className="text-[var(--color-text-secondary)] text-sm"
                    dir="auto"
                  >
                    {t("sidebar.settingsContent")}
                  </p>
                </div>

                {/* Settings switches using i18n-aware labels */}
                <Card variant="solid" className="flex flex-col gap-4">
                  <Switch
                    label={t("switch.notifications")}
                    defaultChecked
                    glow
                    onIcon={<BellIcon />}
                    offIcon={<BellSlashIcon />}
                  />
                  <Switch
                    label={t("switch.darkMode")}
                    defaultChecked
                    onIcon={<MoonIcon />}
                    offIcon={<SunIcon />}
                  />
                  <Switch
                    label={t("switch.sound")}
                    onIcon={<VolumeHighIcon />}
                    offIcon={<VolumeMuteIcon />}
                  />
                </Card>

                {/* Quick upgrade CTA */}
                <Card
                  glow="accent"
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h3
                      className="font-heading font-bold text-[var(--color-text-primary)] text-sm"
                      dir="auto"
                    >
                      {t("sidebar.upgradeAction")}
                    </h3>
                    <p
                      className="text-xs text-[var(--color-text-secondary)] truncate"
                      dir="auto"
                    >
                      {t("sidebar.settingsContent")}
                    </p>
                  </div>
                  <Button variant="accent" size="sm">
                    {t("sidebar.upgradeAction")}
                  </Button>
                </Card>
              </div>
            ),
          },
        ],
      },
    ],
    [t],
  );

  return (
    <>
      {/* ===== VISUAL EFFECTS ===== */}
      <NoiseOverlay />
      <AuroraBlobs />
      <Particles />

      {/* ============================================
          NAVBAR
          ============================================ */}
      <Navbar
        brand={
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
        }
        links={navbarLinks}
        secondaryLinks={secondaryNavLinks}
        showSecondaryNav
        showSearch
        searchPlaceholder={t("inputs.search") || "Search..."}
        onSearch={handleSearch}
        showLanguageChanger
        languageChanger={<LanguageChanger iconOnly size="sm" />}
        languageChangerMobile={
          <LanguageChanger iconOnly size="sm" openUpward />
        }
        showThemeChanger
        themeChanger={<ThemeChanger iconOnly size="sm" />}
        themeChangerMobile={<ThemeChanger iconOnly size="sm" openUpward />}
      />
      {/* ============================================
          MAIN CONTENT
          ============================================ */}
      <div className="min-h-screen p-8 pt-20 transition-theme">
        <div className="max-w-4xl mx-auto">
          {/* ============================================
            HEADER
            ============================================ */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h1 className="text-4xl font-bold text-gradient-primary">
              {t("app.title")}
            </h1>
          </div>

          {/* ============================================
            HERO
            ============================================ */}
          <section className="text-center mb-24 relative">
            <GradientRing />
            <span className="section-label block mb-4" data-i18n="hero.version">
              {t("hero.version")}
            </span>
            <h1 className="font-heading text-7xl md:text-8xl font-bold mb-6 tracking-tight text-gradient-hero">
              {t("hero.title")}
            </h1>
            <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-2xl mx-auto font-body leading-relaxed mb-8">
              {t("hero.subtitle")}
            </p>
          </section>

          {/* ============================================
            BADGES SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("badges.title")}</h2>

            {/* Badge Variants */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("badges.variants")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary">{t("badges.primary")}</Badge>
                <Badge variant="secondary">{t("badges.secondary")}</Badge>
                <Badge variant="success">{t("badges.success")}</Badge>
                <Badge variant="danger">{t("badges.danger")}</Badge>
                <Badge variant="warning">{t("badges.warning")}</Badge>
              </div>
            </div>

            {/* Badge Sizes */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("badges.sizes")}
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <Badge size="sm">{t("badges.small")}</Badge>
                <Badge size="md">{t("badges.medium")}</Badge>
                <Badge size="lg">{t("badges.large")}</Badge>
              </div>
            </div>

            {/* Outline Badges */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("badges.outline")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge outline variant="primary">
                  {t("badges.primary")}
                </Badge>
                <Badge outline variant="secondary">
                  {t("badges.secondary")}
                </Badge>
                <Badge outline variant="success">
                  {t("badges.success")}
                </Badge>
                <Badge outline variant="danger">
                  {t("badges.danger")}
                </Badge>
                <Badge outline variant="warning">
                  {t("badges.warning")}
                </Badge>
              </div>
            </div>

            {/* Glow Badges */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("badges.withGlow")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge glow variant="primary">
                  {t("badges.glowPrimary")}
                </Badge>
                <Badge glow variant="success">
                  {t("badges.glowSuccess")}
                </Badge>
                <Badge glow variant="danger">
                  {t("badges.glowDanger")}
                </Badge>
              </div>
            </div>

            {/* Badges with Icons */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("badges.withIcons")}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary">
                    <FolderIcon className="h-3.5 w-3.5 me-1 flex-shrink-0" />
                    {t("badges.package")}
                  </Badge>
                  <Badge variant="success">
                    <SuccessIcon className="h-3.5 w-3.5 me-1 flex-shrink-0" />
                    {t("badges.done")}
                  </Badge>
                  <Badge variant="warning">
                    <WarningIcon className="h-3.5 w-3.5 me-1 flex-shrink-0" />
                    {t("badges.warning")}
                  </Badge>
                  <Badge variant="danger">
                    <ErrorIcon className="h-3.5 w-3.5 me-1 flex-shrink-0" />
                    {t("badges.failed")}
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================
            BUTTONS SHOWCASE
            ============================================ */}
          {/* Buttons: variants */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("buttons.title")}
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">{t("buttons.primary")}</Button>
              <Button variant="secondary">{t("buttons.secondary")}</Button>
              <Button variant="accent">{t("buttons.accent")}</Button>
              <Button variant="glass">{t("buttons.glass")}</Button>
              <Button variant="danger">{t("buttons.danger")}</Button>
              <Button variant="success">{t("buttons.success")}</Button>
              <Button variant="outline">{t("buttons.outline")}</Button>
            </div>
          </section>

          {/* Buttons: with glow */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("buttons.withGlow")}
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button glow="primary" variant="primary">
                {t("buttons.glowPrimary")}
              </Button>
              <Button glow="secondary" variant="secondary">
                {t("buttons.glowSecondary")}
              </Button>
              <Button glow="accent" variant="accent">
                {t("buttons.glowAccent")}
              </Button>
            </div>
          </section>

          {/* Buttons: states */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("buttons.states")}
            </h2>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary">{t("buttons.normal")}</Button>
              <Button variant="primary" className="hover:brightness-105">
                {t("buttons.hover")}
              </Button>
              <Button variant="primary" className="active:scale-95">
                {t("buttons.pressed")}
              </Button>
              <Button variant="primary" disabled>
                {t("buttons.disabled")}
              </Button>
              <Button variant="primary" loading>
                {t("buttons.loading")}
              </Button>
            </div>
          </section>

          {/* Buttons: sizes */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("buttons.sizesTitle")}
            </h2>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm" variant="primary">
                {t("buttons.small")}
              </Button>
              <Button size="md" variant="primary">
                {t("buttons.medium")}
              </Button>
              <Button size="lg" variant="primary">
                {t("buttons.large")}
              </Button>
            </div>
          </section>

          {/* Buttons: with icons */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("buttons.withIcons")}
            </h2>
            <div className="flex flex-wrap gap-3 items-center">
              <Button
                variant="primary"
                leftIcon={
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
              >
                {t("buttons.launch")}
              </Button>
              <Button
                variant="secondary"
                rightIcon={
                  <svg
                    className="h-4 w-4 rtl:-scale-x-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                }
              >
                {t("buttons.next")}
              </Button>
              <Button
                variant="success"
                leftIcon={
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                }
              >
                {t("buttons.confirm")}
              </Button>
            </div>
          </section>

          {/* ============================================
            AVATAR SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("avatar.title")}</h2>

            {/* Sizes */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("avatar.sizes")}
              </p>
              <div className="flex items-center gap-4">
                <Avatar size="xs" fallbackText="JD" />
                <Avatar size="sm" fallbackText="JD" />
                <Avatar size="md" fallbackText="JD" />
                <Avatar size="lg" fallbackText="JD" />
                <Avatar size="xl" fallbackText="JD" />
              </div>
            </div>

            {/* Shapes */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("avatar.shapes")}
              </p>
              <div className="flex items-center gap-4">
                <Avatar shape="circle" fallbackText="JD" />
                <Avatar shape="rounded" fallbackText="JD" />
                <Avatar shape="square" fallbackText="JD" />
              </div>
            </div>

            {/* With Status */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("avatar.status")}
              </p>
              <div className="flex items-center gap-4">
                <Avatar status="online" fallbackText="JD" />
                <Avatar status="away" fallbackText="JD" />
                <Avatar status="busy" fallbackText="JD" />
                <Avatar status="offline" fallbackText="JD" />
              </div>
            </div>

            {/* With Glow */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("avatar.glowEffects")}
              </p>
              <div className="flex items-center gap-4">
                <Avatar glow="primary" fallbackText="JD" />
                <Avatar glow="secondary" fallbackText="JD" />
                <Avatar glow="accent" fallbackText="JD" />
              </div>
            </div>

            {/* With Image */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("avatar.withImage")}
              </p>
              <div className="flex items-center gap-4">
                <Avatar
                  src="https://i.pravatar.cc/150?img=5"
                  alt="User avatar"
                  size="md"
                />
                <Avatar
                  src="https://i.pravatar.cc/150?img=9"
                  alt="User avatar"
                  size="md"
                  glow="primary"
                />
                <Avatar
                  src="https://i.pravatar.cc/150?img=12"
                  alt="User avatar"
                  size="md"
                  status="online"
                />
              </div>
            </div>

            {/* Group */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("avatar.group")}
              </p>
              <Avatar group size="md">
                <Avatar fallbackText="JD" />
                <Avatar fallbackText="JS" />
                <Avatar fallbackText="AK" />
                <Avatar fallbackText="MR" />
              </Avatar>
            </div>

            {/* Clickable */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("avatar.clickable")}
              </p>
              <Avatar
                fallbackText="JD"
                onClick={() => alert("Avatar clicked!")}
                glow="primary"
              />
            </div>
          </section>

          {/* ============================================
            TOOLTIP SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("tooltip.title")}
            </h2>

            {/* Placements */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("tooltip.placements")}
              </p>
              <div className="grid grid-cols-4 gap-4">
                <Tooltip content={t("tooltip.top")} placement="top">
                  <Button size="sm" variant="glass" className="w-full">
                    {t("tooltip.top")}
                  </Button>
                </Tooltip>
                <Tooltip content={t("tooltip.bottom")} placement="bottom">
                  <Button size="sm" variant="glass" className="w-full">
                    {t("tooltip.bottom")}
                  </Button>
                </Tooltip>
                <Tooltip content={t("tooltip.left")} placement="left">
                  <Button size="sm" variant="glass" className="w-full">
                    {t("tooltip.left")}
                  </Button>
                </Tooltip>
                <Tooltip content={t("tooltip.right")} placement="right">
                  <Button size="sm" variant="glass" className="w-full">
                    {t("tooltip.right")}
                  </Button>
                </Tooltip>
              </div>
            </div>

            {/* Variants */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("tooltip.variants")}
              </p>
              <div className="flex items-center gap-4">
                <Tooltip content={t("tooltip.glassTooltip")} variant="glass">
                  <Button variant="glass">{t("buttons.glass")}</Button>
                </Tooltip>
                <Tooltip content={t("tooltip.solidTooltip")} variant="solid">
                  <Button variant="secondary">{t("tooltip.solidLabel")}</Button>
                </Tooltip>
                <Tooltip
                  content={t("tooltip.outlineTooltip")}
                  variant="outline"
                >
                  <Button variant="outline">{t("buttons.outline")}</Button>
                </Tooltip>
              </div>
            </div>

            {/* With Badge */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("tooltip.withBadge")}
              </p>
              <Tooltip content={t("tooltip.unreadMessages", { count: 42 })}>
                <Badge variant="primary" glow className="cursor-pointer">
                  42
                </Badge>
              </Tooltip>
            </div>

            {/* Long Content */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("tooltip.longContent")}
              </p>
              <Tooltip content={t("tooltip.longTooltip")}>
                <Button variant="primary">{t("tooltip.hoverDetails")}</Button>
              </Tooltip>
            </div>
          </section>

          {/* ============================================
            TABS SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("tabs.title")}</h2>
            <Tabs
              items={tabItems}
              activeValue={activeTab}
              onChange={setActiveTab}
              glowColor="primary"
            />
          </section>

          {/* ============================================
            ACCORDION SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("accordion.title")}
            </h2>

            {/* Mode Switcher */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                {t("accordion.mode")}:
              </span>
              <Button
                size="sm"
                variant={accordionMode === "single" ? "primary" : "outline"}
                onClick={() => {
                  setAccordionMode("single");
                  setOpenAccordionItems(["1"]);
                }}
              >
                {t("accordion.single")}
              </Button>
              <Button
                size="sm"
                variant={accordionMode === "multiple" ? "primary" : "outline"}
                onClick={() => {
                  setAccordionMode("multiple");
                  setOpenAccordionItems(["1", "2"]);
                }}
              >
                {t("accordion.multiple")}
              </Button>
              <span className="text-xs text-[var(--color-text-tertiary)] font-mono ml-2">
                {accordionMode === "single"
                  ? t("accordion.singleDesc")
                  : t("accordion.multipleDesc")}
              </span>
            </div>

            {/* Controlled Accordion */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("accordion.controlled")}{" "}
                <span className="text-[var(--color-primary)]">
                  {openAccordionItems.length > 0
                    ? openAccordionItems.join(", ")
                    : "none"}
                </span>
              </p>
              <Accordion
                items={accordionItems}
                openItems={openAccordionItems}
                onOpenChange={setOpenAccordionItems}
                multiple={accordionMode === "multiple"}
              />
            </div>

            <div className="border-t border-[var(--color-border-secondary)] my-6"></div>

            {/* With Icons */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("accordion.withIcons")}
              </p>
              <Accordion
                items={accordionItemsWithIcons}
                defaultOpenItems={["1"]}
                multiple={false}
              />
            </div>
          </section>

          {/* ============================================
            DROPDOWN SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("dropdown.title")}
            </h2>

            {/* Basic Dropdowns */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("dropdown.basic")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dropdown
                  options={frameworkOptions}
                  placeholder={t("dropdown.selectFramework")}
                  defaultValue="react"
                />
                <Dropdown
                  options={frameworkOptions}
                  placeholder={t("dropdown.withPlaceholder")}
                />
              </div>
            </div>

            {/* With Icons */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("dropdown.withIcons")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dropdown
                  options={dropdownOptionsWithIcons}
                  placeholder={t("dropdown.selectWithIcons")}
                  defaultValue="user"
                />
                <Dropdown
                  options={dropdownOptionsWithIcons}
                  placeholder={t("dropdown.searchWithIcons")}
                  searchable
                  searchPlaceholder={t("dropdown.searchOptions")}
                />
              </div>
            </div>

            {/* Searchable */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("dropdown.searchable")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dropdown
                  options={frameworkOptions}
                  placeholder={t("dropdown.searchFrameworks")}
                  searchable
                  defaultValue="react"
                  label={t("dropdown.framework")}
                  helperText={t("dropdown.typeToFilter")}
                />
                <Dropdown
                  options={dropdownOptionsWithIcons}
                  placeholder={t("dropdown.searchWithIcons")}
                  searchable
                  searchPlaceholder={t("dropdown.searchOptions")}
                  label={t("dropdown.withIcons")}
                />
              </div>
            </div>

            {/* Controlled */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("dropdown.controlled")}{" "}
                <span className="text-[var(--color-primary)] font-bold">
                  {selectedFramework}
                </span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dropdown
                  options={frameworkOptions}
                  value={selectedFramework}
                  onChange={setSelectedFramework}
                  placeholder={t("dropdown.selectFramework")}
                  label={t("dropdown.framework")}
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedFramework("vue")}
                  >
                    {t("dropdown.setVue")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedFramework("svelte")}
                  >
                    {t("dropdown.setSvelte")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedFramework("solid")}
                  >
                    {t("dropdown.setSolid")}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================
            CARDS SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("cards.title")}</h2>

            {/* Variants */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("cards.variants")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card variant="glass">
                  <h3 className="font-heading font-bold">
                    {t("cards.glassCard")}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    backdrop-filter: blur(20px)
                  </p>
                </Card>
                <Card variant="solid">
                  <h3 className="font-heading font-bold">
                    {t("cards.solidCard")}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    More opaque, less blur
                  </p>
                </Card>
                <Card variant="outline">
                  <h3 className="font-heading font-bold">
                    {t("cards.outlineCard")}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    Transparent with border
                  </p>
                </Card>
              </div>
            </div>

            {/* Float + Glow */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("cards.floatGlow")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card float glow="primary">
                  <h3 className="font-heading font-bold">
                    {t("cards.primaryGlow")}
                  </h3>
                  <p
                    className="text-[var(--color-text-secondary)] text-sm"
                    dir="auto"
                  >
                    {t("common.hoverToFloat")}
                  </p>
                </Card>

                <Card float glow="secondary">
                  <h3 className="font-heading font-bold">
                    {t("cards.secondaryGlow")}
                  </h3>
                  <p
                    className="text-[var(--color-text-secondary)] text-sm"
                    dir="auto"
                  >
                    {t("common.hoverToFloat")}
                  </p>
                </Card>

                <Card float glow="accent">
                  <h3 className="font-heading font-bold">
                    {t("cards.accentGlow")}
                  </h3>
                  <p
                    className="text-[var(--color-text-secondary)] text-sm"
                    dir="auto"
                  >
                    {t("common.hoverToFloat")}
                  </p>
                </Card>
              </div>
            </div>

            {/* Feature Cards */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("cards.featureCards")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card glow="primary" className="text-center">
                  <div className="flex justify-center mb-3 text-[var(--color-primary)]">
                    <RocketIcon className="h-10 w-10" />
                  </div>
                  <h3 className="font-heading font-bold">
                    {t("cards.launch")}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    {t("cards.deployProject")}
                  </p>
                </Card>
                <Card variant="solid" className="text-center">
                  <div className="flex justify-center mb-3 text-[var(--color-secondary)]">
                    <AnalyticsIcon className="h-10 w-10" />
                  </div>
                  <h3 className="font-heading font-bold">
                    {t("cards.analytics")}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    {t("cards.trackPerformance")}
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* ============================================
            INPUT SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("inputs.title")}</h2>

            {/* Basic Inputs */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("inputs.basic")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder={t("inputs.textInput")} />
                <Input type="password" placeholder={t("inputs.password")} />
                <Input type="search" placeholder={t("inputs.search")} />
                <Input type="email" placeholder={t("inputs.email")} />
              </div>
            </div>

            {/* With Labels */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("inputs.withLabels")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t("inputs.username")}
                  placeholder={t("inputs.enterUsername")}
                />
                <Input
                  label={t("inputs.email")}
                  type="email"
                  placeholder={t("inputs.enterEmail")}
                  helperText={t("inputs.emailHelper")}
                />
              </div>
            </div>

            {/* With Icons */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("inputs.withIconsTitle")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  leftIcon={<UserIcon />}
                  placeholder={t("inputs.username")}
                />
                <Input
                  leftIcon={<SearchIcon />}
                  type="search"
                  placeholder={t("inputs.search")}
                />
              </div>
            </div>

            {/* Validation States */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("inputs.validation")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder={t("inputs.success")}
                  validation="success"
                  successMessage={t("inputs.validInput")}
                />
                <Input
                  placeholder={t("inputs.error")}
                  validation="error"
                  errorMessage={t("inputs.somethingWrong")}
                />
              </div>
            </div>
          </section>

          {/* ============================================
            MODAL SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("modal.title")}</h2>
            <div className="flex gap-3 flex-wrap">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                <SwordsIcon className="h-4 w-4" />
                {t("modal.openModal")}
              </Button>
              <Button variant="glass" onClick={() => setIsModalOpen(true)}>
                <FolderIcon className="h-4 w-4" />
                {t("modal.viewContent")}
              </Button>
            </div>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title={t("modal.archiveAccess")}
              confirmText={t("modal.acceptMission")}
              cancelText={t("modal.decline")}
              onConfirm={() => {
                console.log("Mission accepted!");
                setIsModalOpen(false);
              }}
            >
              {t("modal.modalDescription")}
            </Modal>
          </section>

          {/* ============================================
            TOAST SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("toast.title")}</h2>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6 font-sans">
              {t("toast.subtitle")}
            </p>
            <ToastDemo />
          </section>

          {/* ============================================
            PROGRESS SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("progress.title")}
            </h2>

            {/* Horizontal */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("progress.horizontal")}
              </p>
              <div className="flex flex-col gap-4 max-w-md">
                <Progress
                  value={75}
                  color="primary"
                  labelPosition="right"
                  showLabel
                />
                <Progress
                  value={60}
                  color="secondary"
                  labelPosition="right"
                  showLabel
                />
                <Progress
                  value={45}
                  color="accent"
                  labelPosition="right"
                  showLabel
                />
                <Progress
                  value={80}
                  color="success"
                  labelPosition="right"
                  showLabel
                />
                <Progress
                  value={30}
                  color="danger"
                  labelPosition="right"
                  showLabel
                />
                <Progress
                  value={55}
                  color="gradient"
                  labelPosition="right"
                  showLabel
                />
              </div>
            </div>

            {/* Label Inside */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("progress.labelInside")}
              </p>
              <div className="flex flex-col gap-4 max-w-md">
                <Progress
                  value={75}
                  color="primary"
                  labelPosition="inside"
                  showLabel
                />
                <Progress
                  value={45}
                  color="secondary"
                  labelPosition="inside"
                  showLabel
                />
                <Progress
                  value={30}
                  color="danger"
                  labelPosition="inside"
                  showLabel
                />
                <Progress
                  value={55}
                  color="gradient"
                  labelPosition="inside"
                  showLabel
                />
              </div>
            </div>

            {/* Display Types */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("progress.displayTypes")}
              </p>
              <div className="flex flex-col gap-4 max-w-md">
                <Progress
                  value={75}
                  displayType="percentage"
                  labelPosition="right"
                  showLabel
                />
                <Progress
                  value={3}
                  max={5}
                  displayType="ratio"
                  labelPosition="right"
                  showLabel
                />
                <Progress
                  value={75}
                  displayType="custom"
                  label={t("progress.almostDone")}
                  labelPosition="right"
                  showLabel
                />
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("progress.sizes")}
              </p>
              <div className="flex flex-col gap-4 max-w-md">
                <Progress
                  value={50}
                  size="sm"
                  labelPosition="right"
                  showLabel
                />
                <Progress
                  value={65}
                  size="md"
                  labelPosition="right"
                  showLabel
                />
                <Progress
                  value={80}
                  size="lg"
                  labelPosition="right"
                  showLabel
                />
              </div>
            </div>

            {/* Radial */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("progress.radial")}
              </p>
              <div className="flex flex-wrap gap-6">
                <Progress
                  variant="radial"
                  value={75}
                  color="primary"
                  showLabel
                />
                <Progress
                  variant="radial"
                  value={60}
                  color="secondary"
                  showLabel
                />
                <Progress
                  variant="radial"
                  value={45}
                  color="accent"
                  showLabel
                />
                <Progress
                  variant="radial"
                  value={80}
                  color="success"
                  showLabel
                />
                <Progress
                  variant="radial"
                  value={30}
                  color="danger"
                  showLabel
                />
                <Progress
                  variant="radial"
                  value={90}
                  color="warning"
                  showLabel
                />
                <Progress
                  variant="radial"
                  value={55}
                  color="gradient"
                  showLabel
                />
              </div>
            </div>

            {/* Radial with Custom Label */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("progress.radialCustom")}
              </p>
              <div className="flex flex-wrap gap-6">
                <Progress
                  variant="radial"
                  value={3}
                  max={5}
                  displayType="ratio"
                  showLabel
                />
                <Progress
                  variant="radial"
                  value={75}
                  displayType="custom"
                  label={t("progress.done")}
                  showLabel
                  color="success"
                />
                <Progress
                  variant="radial"
                  value={45}
                  label={t("progress.loading")}
                  showLabel
                  color="warning"
                />
              </div>
            </div>

            {/* Radial Sizes */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("progress.radialSizes")}
              </p>
              <div className="flex flex-wrap gap-6 items-end">
                <Progress variant="radial" value={50} size="sm" showLabel />
                <Progress variant="radial" value={65} size="md" showLabel />
                <Progress variant="radial" value={80} size="lg" showLabel />
              </div>
            </div>
          </section>

          {/* ============================================
            XPBAR SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("xpbar.title")}</h2>

            {/* Basic (custom labels for language changing awareness) */}
            <div className="glass mb-5 p-6 float-card glow-secondary">
              <XPBar
                value={3400}
                max={5000}
                level={14}
                customLabel={t("xpbar.rankProgress")}
                levelLabel={t("xpbar.rank")}
                xpLabel={t("xpbar.exp")}
              />
            </div>

            {/* With rank tiers */}
            <div className="glass mb-5 p-6 float-card glow-primary">
              <XPBar
                value={3400}
                max={5000}
                level={14}
                levelLabel={t("xpbar.tier")}
                xpLabel={t("xpbar.points")}
                customLabel={t("xpbar.rankProgress")}
                ranks={[
                  { label: t("rank.common"), requiredXP: 0 },
                  { label: t("rank.uncommon"), requiredXP: 1000 },
                  { label: t("rank.rare"), requiredXP: 2500 },
                  { label: t("rank.epic"), requiredXP: 4000 },
                  { label: t("rank.legendary"), requiredXP: 6000 },
                ]}
              />
            </div>

            {/* Game style with custom rank labels */}
            <div className="glass mb-5 p-6 float-card">
              <XPBar
                value={750}
                max={1200}
                level={3}
                levelLabel={t("xpbar.prestige")}
                xpLabel={t("xpbar.score")}
                customLabel={t("xpbar.missionProgress")}
                ranks={[
                  { label: t("rank.recruit"), requiredXP: 0 },
                  { label: t("rank.soldier"), requiredXP: 300 },
                  { label: t("rank.veteran"), requiredXP: 600 },
                  { label: t("rank.elite"), requiredXP: 900 },
                  { label: t("rank.commander"), requiredXP: 1200 },
                ]}
              />
            </div>
          </section>

          {/* ============================================
            GLOW SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("glow.title")}</h2>
            <div className="flex flex-wrap gap-3">
              <Button glow="primary" variant="primary">
                {t("glow.glowPrimary")}
              </Button>
              <Button glow="secondary" variant="success">
                {t("glow.glowSecondary")}
              </Button>
              <Button glow="accent" variant="danger">
                {t("glow.glowAccent")}
              </Button>
            </div>
          </section>

          {/* ============================================
            QUEST CARD SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("quest.title")}</h2>

            {/* Basic Quest Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuestCard
                title={t("quest.buildCMS")}
                description={t("quest.buildCMSDesc")}
                xp={300}
                deadline="tomorrow"
                rank="S"
                glow="secondary"
              />

              <QuestCard
                title={t("quest.secureArchives")}
                description={t("quest.secureArchivesDesc")}
                xp={200}
                deadline="3 days"
                rank="A"
                glow="primary"
                requirements={[
                  t("quest.completeReviews"),
                  t("quest.writeTests"),
                  t("quest.deployStaging"),
                ]}
              />
            </div>

            {/* Full Featured Quest Card */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuestCard
                title={t("quest.legendaryQuest")}
                description={t("quest.legendaryQuestDesc")}
                xp={1000}
                xpLabel={t("xpbar.exp")}
                deadline="2024-12-25"
                rank="S+"
                glow="primary"
                requirements={[
                  t("quest.reachLevel"),
                  t("quest.defeatGuardian"),
                  t("quest.collectArtifacts"),
                  t("quest.solveRiddle"),
                ]}
              />

              <QuestCard
                title={t("quest.mapNightCity")}
                description={t("quest.mapNightCityDesc")}
                xp={150}
                deadline="tonight"
                rank="B"
                glow="accent"
                requirements={[
                  t("quest.scanLocations"),
                  t("quest.interviewNPCs"),
                  t("quest.uploadArchive"),
                ]}
              />
            </div>
          </section>

          {/* ============================================
            CHARACTER CARD SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("character.title")}
            </h2>

            {/* Vertical Layout */}
            <p className="text-sm text-[var(--color-text-secondary)] mb-4 font-mono">
              {t("character.vertical")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <CharacterCard
                name={t("character.daraName")}
                subtitle={t("character.daraSubtitle")}
                quote={t("character.daraQuote")}
                icon="🦇"
                mbti="INTJ"
                species="Human/Cyborg"
                affiliation="Jedi Order"
                traits={["MBTI: INTJ", "Human/Cyborg"]}
                stats={[
                  { label: t("character.force"), value: 73, color: "primary" },
                  {
                    label: t("character.combat"),
                    value: 85,
                    color: "secondary",
                  },
                  {
                    label: t("character.intelligence"),
                    value: 92,
                    color: "accent",
                  },
                  { label: t("character.wisdom"), value: 68, color: "warning" },
                ]}
                glow="primary"
              />

              <CharacterCard
                name={t("character.cipherName")}
                subtitle={t("character.cipherSubtitle")}
                quote={t("character.cipherQuote")}
                portrait="https://i.pravatar.cc/150?img=11"
                mbti="INTP"
                species="Cyborg"
                affiliation="Netwatch"
                traits={["MBTI: INTP", "Cyborg"]}
                stats={[
                  {
                    label: t("character.hacking"),
                    value: 95,
                    color: "secondary",
                  },
                  { label: t("character.stealth"), value: 78, color: "accent" },
                  {
                    label: t("character.intelligence"),
                    value: 88,
                    color: "primary",
                  },
                  { label: t("character.combat"), value: 45, color: "danger" },
                ]}
                glow="secondary"
              />

              <CharacterCard
                name={t("character.shadowName")}
                subtitle={t("character.shadowSubtitle")}
                quote={t("character.shadowQuote")}
                icon="🌙"
                mbti="ISTP"
                species="Vampire"
                affiliation="Night Council"
                traits={["MBTI: ISTP", "Vampire"]}
                stats={[
                  { label: t("character.agility"), value: 92, color: "accent" },
                  { label: t("character.stealth"), value: 88, color: "danger" },
                  {
                    label: t("character.strength"),
                    value: 76,
                    color: "warning",
                  },
                  { label: t("character.wisdom"), value: 82, color: "primary" },
                ]}
                glow="accent"
              />
            </div>

            {/* Horizontal Layout */}
            <p className="text-sm text-[var(--color-text-secondary)] mb-4 font-mono">
              {t("character.horizontal")}
            </p>
            <div className="flex flex-col gap-6">
              <CharacterCard
                layout="horizontal"
                name={t("character.daraName")}
                subtitle={t("character.daraSubtitle")}
                quote={t("character.daraQuote")}
                icon="🦇"
                mbti="INTJ"
                species="Human/Cyborg"
                affiliation="Jedi Order"
                traits={["MBTI: INTJ", "Human/Cyborg"]}
                stats={[
                  { label: t("character.force"), value: 73, color: "primary" },
                  {
                    label: t("character.combat"),
                    value: 85,
                    color: "secondary",
                  },
                  {
                    label: t("character.intelligence"),
                    value: 92,
                    color: "accent",
                  },
                  { label: t("character.wisdom"), value: 68, color: "warning" },
                ]}
                glow="primary"
              />

              <CharacterCard
                layout="horizontal"
                name={t("character.cipherName")}
                subtitle={t("character.cipherSubtitle")}
                quote={t("character.cipherQuote")}
                portrait="https://i.pravatar.cc/150?img=11"
                mbti="INTP"
                species="Cyborg"
                affiliation="Netwatch"
                traits={["MBTI: INTP", "Cyborg"]}
                stats={[
                  {
                    label: t("character.hacking"),
                    value: 95,
                    color: "secondary",
                  },
                  { label: t("character.stealth"), value: 78, color: "accent" },
                  {
                    label: t("character.intelligence"),
                    value: 88,
                    color: "primary",
                  },
                  { label: t("character.combat"), value: 45, color: "danger" },
                ]}
                glow="secondary"
              />

              <CharacterCard
                layout="horizontal"
                name={t("character.shadowName")}
                subtitle={t("character.shadowSubtitle")}
                quote={t("character.shadowQuote")}
                icon="🌙"
                mbti="ISTP"
                species="Vampire"
                affiliation="Night Council"
                traits={["MBTI: ISTP", "Vampire"]}
                stats={[
                  { label: t("character.agility"), value: 92, color: "accent" },
                  { label: t("character.stealth"), value: 88, color: "danger" },
                  {
                    label: t("character.strength"),
                    value: 76,
                    color: "warning",
                  },
                  { label: t("character.wisdom"), value: 82, color: "primary" },
                ]}
                glow="accent"
              />
            </div>
          </section>

          {/* ============================================
            STATS WIDGET SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("statsWidget.title")}
            </h2>

            {/* Radial Variant */}
            <p className="text-sm text-[var(--color-text-secondary)] mb-4 font-mono">
              {t("statsWidget.radialVariant")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <StatsWidget
                title={t("statsWidget.forceStats")}
                glow="primary"
                stats={[
                  {
                    label: t("character.force"),
                    value: 73,
                    color: "primary",
                    trend: 12,
                  },
                  {
                    label: t("character.combat"),
                    value: 85,
                    color: "secondary",
                    trend: 8,
                  },
                  {
                    label: t("character.intelligence"),
                    value: 92,
                    color: "accent",
                    trend: -3,
                  },
                  {
                    label: t("character.wisdom"),
                    value: 68,
                    color: "warning",
                    trend: 5,
                  },
                ]}
              />

              <StatsWidget
                title={t("statsWidget.characterStats")}
                glow="secondary"
                stats={[
                  {
                    label: t("statsWidget.health"),
                    value: 85,
                    max: 100,
                    unit: "HP",
                    color: "danger",
                    trend: -5,
                  },
                  {
                    label: t("statsWidget.mana"),
                    value: 62,
                    max: 100,
                    unit: "MP",
                    color: "secondary",
                    trend: 15,
                  },
                  {
                    label: t("statsWidget.stamina"),
                    value: 45,
                    max: 100,
                    unit: "SP",
                    color: "warning",
                    trend: 3,
                  },
                  {
                    label: t("statsWidget.level"),
                    value: 14,
                    max: 20,
                    unit: "",
                    color: "primary",
                    trend: 0,
                  },
                ]}
              />
            </div>

            {/* Bar Variant */}
            <p className="text-sm text-[var(--color-text-secondary)] mb-4 font-mono">
              {t("statsWidget.barVariant")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <StatsWidget
                variant="bar"
                title={t("statsWidget.progress")}
                glow="accent"
                stats={[
                  {
                    label: t("character.strength"),
                    value: 78,
                    color: "danger",
                    trend: 22,
                  },
                  {
                    label: t("character.agility"),
                    value: 92,
                    color: "accent",
                    trend: 8,
                  },
                  {
                    label: t("statsWidget.endurance"),
                    value: 65,
                    color: "warning",
                    trend: -4,
                  },
                  {
                    label: t("statsWidget.luck"),
                    value: 45,
                    color: "success",
                    trend: 12,
                  },
                ]}
              />

              <StatsWidget
                variant="bar"
                title={t("statsWidget.skills")}
                glow="primary"
                stats={[
                  {
                    label: t("character.hacking"),
                    value: 95,
                    color: "secondary",
                    trend: 5,
                  },
                  {
                    label: t("character.stealth"),
                    value: 78,
                    color: "accent",
                    trend: 18,
                  },
                  {
                    label: t("character.combat"),
                    value: 45,
                    color: "danger",
                    trend: -7,
                  },
                  {
                    label: t("character.intelligence"),
                    value: 88,
                    color: "primary",
                    trend: 3,
                  },
                ]}
              />
            </div>

            {/* Horizontal Layout */}
            <p className="text-sm text-[var(--color-text-secondary)] mb-4 font-mono">
              {t("statsWidget.horizontalLayout")}
            </p>
            <div className="flex flex-col gap-6">
              <StatsWidget
                layout="horizontal"
                title={t("statsWidget.battleStats")}
                glow="secondary"
                stats={[
                  {
                    label: t("character.strength"),
                    value: 78,
                    color: "danger",
                    trend: 22,
                  },
                  {
                    label: t("character.agility"),
                    value: 92,
                    color: "accent",
                    trend: 8,
                  },
                  {
                    label: t("statsWidget.endurance"),
                    value: 65,
                    color: "warning",
                    trend: -4,
                  },
                  {
                    label: t("statsWidget.luck"),
                    value: 45,
                    color: "success",
                    trend: 12,
                  },
                ]}
              />

              <StatsWidget
                variant="bar"
                layout="horizontal"
                title={t("statsWidget.skillProgress")}
                glow="primary"
                stats={[
                  {
                    label: t("character.hacking"),
                    value: 95,
                    color: "secondary",
                    trend: 5,
                  },
                  {
                    label: t("character.stealth"),
                    value: 78,
                    color: "accent",
                    trend: 18,
                  },
                  {
                    label: t("character.combat"),
                    value: 45,
                    color: "danger",
                    trend: -7,
                  },
                  {
                    label: t("character.intelligence"),
                    value: 88,
                    color: "primary",
                    trend: 3,
                  },
                ]}
              />
            </div>
          </section>

          {/* ============================================
            PRODUCT CARDS SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("productCard.title")}
            </h2>

            {/* Vertical Layout */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("productCard.vertical")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ProductCard
                  title={t("productCard.product1")}
                  price={79.99}
                  currency="$"
                  image="https://picsum.photos/seed/cyberpunk/300/300"
                  description={t("productCard.desc1")}
                  rating={4.5}
                  reviewCount={128}
                  category={t("productCard.category1")}
                  tags={[t("productCard.tag1"), t("productCard.tag2")]}
                  badge={t("productCard.limited")}
                  badgeVariant="danger"
                  onAddToCart={() => console.log("Added to cart!")}
                />
                <ProductCard
                  title={t("productCard.product2")}
                  price={149.99}
                  currency="$"
                  image="https://picsum.photos/seed/holocron/300/300"
                  description={t("productCard.desc2")}
                  rating={5}
                  reviewCount={89}
                  category={t("productCard.category2")}
                  tags={[t("productCard.tag3"), t("productCard.tag1")]}
                  badge="New"
                  badgeVariant="primary"
                  onSale
                  originalPrice={199.99}
                  onAddToCart={() => console.log("Added to cart!")}
                />
                <ProductCard
                  title={t("productCard.product3")}
                  price={59.99}
                  currency="$"
                  image="https://picsum.photos/seed/controller/300/300"
                  description={t("productCard.desc3")}
                  rating={4}
                  reviewCount={203}
                  category={t("productCard.category3")}
                  tags={[t("productCard.tag3"), "rgb"]}
                  inStock={false}
                  onAddToCart={() => console.log("Added to cart!")}
                />
                <ProductCard
                  title={t("productCard.product4")}
                  price={34.99}
                  currency="$"
                  image="https://picsum.photos/seed/shard/300/300"
                  description={t("productCard.desc4")}
                  rating={3.5}
                  reviewCount={45}
                  category={t("productCard.category4")}
                  tags={[t("productCard.tag4"), "classified"]}
                  glow="secondary"
                  onAddToCart={() => console.log("Added to cart!")}
                />
              </div>
            </div>

            {/* Horizontal Layout */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("productCard.horizontal")}
              </p>
              <div className="grid grid-cols-1 gap-4 max-w-2xl">
                <ProductCard
                  title={t("productCard.product1")}
                  price={79.99}
                  currency="$"
                  image="https://picsum.photos/seed/cyberpunk2/300/300"
                  description={t("productCard.desc1")}
                  rating={4.5}
                  reviewCount={128}
                  category={t("productCard.category1")}
                  layout="horizontal"
                  glow="primary"
                  onAddToCart={() => console.log("Added to cart!")}
                />
                <ProductCard
                  title={t("productCard.product2")}
                  price={149.99}
                  currency="$"
                  image="https://picsum.photos/seed/holocron2/300/300"
                  description={t("productCard.desc2")}
                  rating={5}
                  reviewCount={89}
                  category={t("productCard.category2")}
                  layout="horizontal"
                  onSale
                  originalPrice={199.99}
                  glow="secondary"
                  onAddToCart={() => console.log("Added to cart!")}
                />
              </div>
            </div>

            {/* Compact Layout */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("productCard.compact")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <ProductCard
                  title={t("productCard.product1")}
                  price={79.99}
                  currency="$"
                  image="https://picsum.photos/seed/cyberpunk3/100/100"
                  layout="compact"
                  glow="primary"
                  onAddToCart={() => console.log("Added to cart!")}
                />
                <ProductCard
                  title={t("productCard.product2")}
                  price={149.99}
                  currency="$"
                  image="https://picsum.photos/seed/holocron3/100/100"
                  layout="compact"
                  onSale
                  originalPrice={199.99}
                  glow="secondary"
                  onAddToCart={() => console.log("Added to cart!")}
                />
                <ProductCard
                  title={t("productCard.product3")}
                  price={59.99}
                  currency="$"
                  image="https://picsum.photos/seed/controller3/100/100"
                  layout="compact"
                  inStock={false}
                  onAddToCart={() => console.log("Added to cart!")}
                />
                <ProductCard
                  title={t("productCard.product4")}
                  price={34.99}
                  currency="$"
                  image="https://picsum.photos/seed/shard3/100/100"
                  layout="compact"
                  glow="accent"
                  onAddToCart={() => console.log("Added to cart!")}
                />
              </div>
            </div>

            {/* Glow Effects */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("productCard.glows")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ProductCard
                  title={t("productCard.product1")}
                  price={79.99}
                  currency="$"
                  image="https://picsum.photos/seed/glow1/300/300"
                  glow="primary"
                  onAddToCart={() => console.log("Added to cart!")}
                />
                <ProductCard
                  title={t("productCard.product2")}
                  price={149.99}
                  currency="$"
                  image="https://picsum.photos/seed/glow2/300/300"
                  glow="secondary"
                  onAddToCart={() => console.log("Added to cart!")}
                />
                <ProductCard
                  title={t("productCard.product3")}
                  price={59.99}
                  currency="$"
                  image="https://picsum.photos/seed/glow3/300/300"
                  glow="accent"
                  onAddToCart={() => console.log("Added to cart!")}
                />
              </div>
            </div>

            {/* Responsive - Full width on mobile */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("productCard.responsive")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <ProductCard
                  title={t("productCard.product1")}
                  price={79.99}
                  currency="$"
                  image="https://picsum.photos/seed/responsive1/300/300"
                  description={t("productCard.desc1")}
                  fullWidthMobile
                  onAddToCart={() => console.log("Added to cart!")}
                />
                <ProductCard
                  title={t("productCard.product2")}
                  price={149.99}
                  currency="$"
                  image="https://picsum.photos/seed/responsive2/300/300"
                  description={t("productCard.desc2")}
                  fullWidthMobile
                  glow="primary"
                  onAddToCart={() => console.log("Added to cart!")}
                />
              </div>
            </div>
          </section>

          {/* ============================================
            BLOG CARDS SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("blogCard.title")}
            </h2>

            {/* Vertical Layout */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("blogCard.vertical")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <BlogCard
                  title={t("blogCard.post1")}
                  excerpt={t("blogCard.excerpt1")}
                  coverImage="https://picsum.photos/seed/glassmorphism/400/250"
                  author={t("blogCard.author1")}
                  authorAvatar="https://i.pravatar.cc/150?img=1"
                  date={new Date("2024-11-15")}
                  readTime={5}
                  category={t("blogCard.category1")}
                  tags={[t("blogCard.tag1"), t("blogCard.tag2")]}
                  link="#"
                />
                <BlogCard
                  title={t("blogCard.post2")}
                  excerpt={t("blogCard.excerpt2")}
                  coverImage="https://picsum.photos/seed/design-system/400/250"
                  author={t("blogCard.author2")}
                  authorAvatar="https://i.pravatar.cc/150?img=2"
                  date={new Date("2024-11-10")}
                  readTime={8}
                  category={t("blogCard.category2")}
                  tags={[t("blogCard.tag2"), t("blogCard.tag3")]}
                  glow="secondary"
                  link="#"
                />
                <BlogCard
                  title={t("blogCard.post3")}
                  excerpt={t("blogCard.excerpt3")}
                  coverImage="https://picsum.photos/seed/3d-hover/400/250"
                  author={t("blogCard.author3")}
                  authorAvatar="https://i.pravatar.cc/150?img=3"
                  date={new Date("2024-11-05")}
                  readTime={6}
                  category={t("blogCard.category3")}
                  tags={[t("blogCard.tag3"), t("blogCard.tag2")]}
                  glow="primary"
                  link="#"
                />
              </div>
            </div>

            {/* Horizontal Layout */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("blogCard.horizontal")}
              </p>
              <div className="grid grid-cols-1 gap-4 max-w-3xl">
                <BlogCard
                  title={t("blogCard.post1")}
                  excerpt={t("blogCard.excerpt1")}
                  coverImage="https://picsum.photos/seed/horizontal1/400/250"
                  author={t("blogCard.author1")}
                  authorAvatar="https://i.pravatar.cc/150?img=4"
                  date={new Date("2024-11-15")}
                  readTime={5}
                  category={t("blogCard.category1")}
                  layout="horizontal"
                  glow="primary"
                  link="#"
                />
                <BlogCard
                  title={t("blogCard.post2")}
                  excerpt={t("blogCard.excerpt2")}
                  coverImage="https://picsum.photos/seed/horizontal2/400/250"
                  author={t("blogCard.author2")}
                  authorAvatar="https://i.pravatar.cc/150?img=5"
                  date={new Date("2024-11-10")}
                  readTime={8}
                  category={t("blogCard.category2")}
                  layout="horizontal"
                  glow="secondary"
                  link="#"
                />
              </div>
            </div>

            {/* Featured */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("blogCard.featured")}
              </p>
              <div className="max-w-2xl">
                <BlogCard
                  title={t("blogCard.post4")}
                  excerpt={t("blogCard.excerpt4")}
                  coverImage="https://picsum.photos/seed/cyberpunk-aesthetic/800/400"
                  author={t("blogCard.author4")}
                  authorAvatar="https://i.pravatar.cc/150?img=6"
                  date={new Date("2024-11-01")}
                  readTime={10}
                  category={t("blogCard.category4")}
                  tags={[
                    t("blogCard.tag1"),
                    t("blogCard.tag4"),
                    t("blogCard.tag2"),
                  ]}
                  featured
                  glow="accent"
                  link="#"
                />
              </div>
            </div>

            {/* Glow Effects */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("blogCard.glows")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <BlogCard
                  title={t("blogCard.post1")}
                  excerpt={t("blogCard.excerpt1")}
                  coverImage="https://picsum.photos/seed/glow-blog1/400/250"
                  author={t("blogCard.author1")}
                  date={new Date("2024-11-15")}
                  readTime={5}
                  glow="primary"
                  link="#"
                />
                <BlogCard
                  title={t("blogCard.post2")}
                  excerpt={t("blogCard.excerpt2")}
                  coverImage="https://picsum.photos/seed/glow-blog2/400/250"
                  author={t("blogCard.author2")}
                  date={new Date("2024-11-10")}
                  readTime={8}
                  glow="secondary"
                  link="#"
                />
                <BlogCard
                  title={t("blogCard.post3")}
                  excerpt={t("blogCard.excerpt3")}
                  coverImage="https://picsum.photos/seed/glow-blog3/400/250"
                  author={t("blogCard.author3")}
                  date={new Date("2024-11-05")}
                  readTime={6}
                  glow="accent"
                  link="#"
                />
              </div>
            </div>

            {/* Responsive - Full width on mobile */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("blogCard.responsive")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <BlogCard
                  title={t("blogCard.post1")}
                  excerpt={t("blogCard.excerpt1")}
                  coverImage="https://picsum.photos/seed/resp-blog1/400/250"
                  author={t("blogCard.author1")}
                  date={new Date("2024-11-15")}
                  readTime={5}
                  fullWidthMobile
                  link="#"
                />
                <BlogCard
                  title={t("blogCard.post2")}
                  excerpt={t("blogCard.excerpt2")}
                  coverImage="https://picsum.photos/seed/resp-blog2/400/250"
                  author={t("blogCard.author2")}
                  date={new Date("2024-11-10")}
                  readTime={8}
                  fullWidthMobile
                  glow="primary"
                  link="#"
                />
              </div>
            </div>
          </section>

          {/* ============================================
            SIDEBAR SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("sidebar.title")}
            </h2>
            <p
              className="text-sm text-[var(--color-text-secondary)] mb-4 font-mono"
              dir="auto"
            >
              {t("sidebar.subtitle")}
            </p>
            <p
              className="text-xs text-[var(--color-text-tertiary)] mb-4 font-mono md:hidden"
              dir="auto"
            >
              {t("sidebar.mobileSidebarHint")}
            </p>

            {/* Desktop sidebar inside a framed container */}
            <div
              className="relative h-[680px] overflow-hidden rounded-[var(--radius-large)] border border-[var(--color-border-primary)]"
              dir={direction}
            >
              {/* SidebarMobileTrigger handles both desktop (hidden sidebar wrapper) and mobile (FAB + drawer) */}
              <SidebarMobileTrigger width="85vw">
                <Sidebar
                  brand={
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
                  }
                  groups={sidebarGroups}
                  footer={
                    <button className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-180 w-full px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-elevated)]/30 text-sm">
                      <LogoutIcon />
                      <span>{t("sidebar.logout")}</span>
                    </button>
                  }
                  height="680px"
                />
              </SidebarMobileTrigger>
            </div>
          </section>

          {/* ============================================
            THEME CHANGER SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("themeChanger.title")}
            </h2>

            <div className="flex flex-wrap gap-6 items-end">
              {/* Default */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("themeChanger.default")}
                </span>
                <ThemeChanger size="md" />
              </div>

              {/* Icon Only */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("themeChanger.iconOnly")}
                </span>
                <ThemeChanger iconOnly size="md" />
              </div>

              {/* Fixed Width */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("themeChanger.fixedWidth")}
                </span>
                <ThemeChanger fixedWidth="160px" size="md" />
              </div>

              {/* Small */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("themeChanger.small")}
                </span>
                <ThemeChanger size="sm" />
              </div>

              {/* Small Icon Only */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("themeChanger.smallIconOnly")}
                </span>
                <ThemeChanger iconOnly size="sm" />
              </div>

              {/* Custom Themes */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("themeChanger.customThemes")}
                </span>
                <ThemeChanger autoDetect={false} size="md" />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)]">
              <p className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
                  {t("themeChanger.demo")}:
                </span>{" "}
                {t("themeChanger.themeChangerDesc")}
              </p>
            </div>
          </section>

          {/* ============================================
            LANGUAGE CHANGER SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("languageChanger.title")}
            </h2>

            <div className="flex flex-wrap gap-6 items-end">
              {/* Default */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("languageChanger.default")}
                </span>
                <LanguageChanger size="md" />
              </div>

              {/* Icon Only */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("languageChanger.iconOnly")}
                </span>
                <LanguageChanger iconOnly size="md" />
              </div>

              {/* Fixed Width */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("languageChanger.fixedWidth")}
                </span>
                <LanguageChanger fixedWidth="160px" size="md" />
              </div>

              {/* Small */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("languageChanger.small")}
                </span>
                <LanguageChanger size="sm" />
              </div>

              {/* Small Icon Only */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("languageChanger.smallIconOnly")}
                </span>
                <LanguageChanger iconOnly size="sm" />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)]">
              <p className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
                  {t("languageChanger.demo")}:
                </span>{" "}
                {t("languageChanger.languageChangerDesc")}
              </p>
            </div>
          </section>

          {/* ============================================
            GRADIENT SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("gradients.title")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className="p-4 rounded-[var(--radius-standard)] text-white text-center"
                style={{ background: "var(--gradient-primary)" }}
                dir="auto"
              >
                {t("gradients.primary")}
              </div>
              <div
                className="p-4 rounded-[var(--radius-standard)] text-white text-center"
                style={{ background: "var(--gradient-accent)" }}
                dir="auto"
              >
                {t("gradients.accent")}
              </div>
              <div
                className="p-4 rounded-[var(--radius-standard)] text-white text-center"
                style={{ background: "var(--gradient-success)" }}
                dir="auto"
              >
                {t("gradients.success")}
              </div>
              <div
                className="p-4 rounded-[var(--radius-standard)] text-white text-center"
                style={{ background: "var(--gradient-danger)" }}
                dir="auto"
              >
                {t("gradients.danger")}
              </div>
            </div>
          </section>

          {/* ============================================
            EFFECTS SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("effects.title")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-[var(--radius-standard)] glass text-center">
                {t("effects.glassEffect")}
              </div>
              <div className="p-6 rounded-[var(--radius-standard)] glow-primary text-center bg-[var(--color-bg-tertiary)]">
                {t("effects.glowPrimary")}
              </div>
              <div className="p-6 rounded-[var(--radius-standard)] glow-accent text-center bg-[var(--color-bg-tertiary)]">
                {t("effects.glowAccent")}
              </div>
            </div>
          </section>

          {/* ============================================
            TYPOGRAPHY SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("typography.title")}
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                {t("typography.textSecondary")}
              </p>
              <p className="text-base">{t("typography.regularBody")}</p>
              <p className="text-xl font-bold text-gradient-primary">
                {t("typography.gradientHeading")}
              </p>
              <p className="text-lg font-medium text-[var(--color-accent)]">
                {t("typography.accentText")}
              </p>
              <code className="px-3 py-1 rounded-[var(--radius-sm)] block">
                {t("typography.codeExample")}
              </code>
            </div>
          </section>

          {/* ============================================
            PERSIAN TEXT SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("persian.title")}
            </h2>
            <div className="space-y-4">
              <p className="lang-fa text-lg">{t("persian.persianText")}</p>
              <h3 className="lang-fa-heading text-xl">
                {t("persian.persianHeading")}
              </h3>
              <p className="lang-fa text-sm text-[var(--color-text-secondary)]">
                {t("persian.persianDesc")}
              </p>
            </div>
          </section>

          {/* ============================================
            CHECKBOX SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("checkbox.title")}
            </h2>

            {/* Basic Checkboxes */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("checkbox.basic")}
              </p>
              <div className="flex flex-wrap gap-6">
                <Checkbox label={t("checkbox.unchecked")} />
                <Checkbox label={t("checkbox.checked")} defaultChecked />
                <Checkbox
                  label={t("checkbox.glowChecked")}
                  defaultChecked
                  glow
                />
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("checkbox.sizes")}
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <Checkbox
                  size="sm"
                  label={t("checkbox.small")}
                  defaultChecked
                />
                <Checkbox
                  size="md"
                  label={t("checkbox.medium")}
                  defaultChecked
                />
                <Checkbox
                  size="lg"
                  label={t("checkbox.large")}
                  defaultChecked
                />
              </div>
            </div>

            {/* States */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("checkbox.states")}
              </p>
              <div className="flex flex-wrap gap-6">
                <Checkbox label={t("checkbox.normal")} />
                <Checkbox label={t("checkbox.error")} error />
                <Checkbox label={t("checkbox.disabled")} disabled />
                <Checkbox
                  label={t("checkbox.disabledChecked")}
                  disabled
                  defaultChecked
                />
              </div>
            </div>

            {/* RTL Support */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("checkbox.rtlSupport")}
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="glass p-4 rounded-[var(--radius-md)] inline-block">
                  <div className="flex flex-col gap-3">
                    <Checkbox label={t("checkbox.rtlLabel1")} defaultChecked />
                    <Checkbox label={t("checkbox.rtlLabel2")} />
                    <Checkbox
                      label={t("checkbox.rtlLabel3")}
                      defaultChecked
                      glow
                    />
                  </div>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-3 font-mono">
                    {t("checkbox.rtlNote")}
                  </p>
                </div>
              </div>
            </div>

            {/* Controlled */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("checkbox.controlled")}
              </p>
              <div className="flex flex-wrap gap-6">
                {(() => {
                  const [controlledChecked, setControlledChecked] =
                    useState(false);
                  return (
                    <div className="flex flex-col gap-3">
                      <Checkbox
                        label={t("checkbox.controlledLabel")}
                        checked={controlledChecked}
                        onCheckedChange={setControlledChecked}
                        glow
                      />
                      <div className="text-xs text-[var(--color-text-secondary)] font-mono">
                        {t("checkbox.status")}:{" "}
                        {controlledChecked ? "✅ Checked" : "⬜ Unchecked"}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-primary-solid)] text-white hover:bg-[var(--color-primary-hover)]"
                          onClick={() => setControlledChecked(true)}
                        >
                          {t("checkbox.check")}
                        </button>
                        <button
                          className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]"
                          onClick={() => setControlledChecked(false)}
                        >
                          {t("checkbox.uncheck")}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Group Example */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("checkbox.group")}
              </p>
              <div className="glass p-6 rounded-[var(--radius-md)] inline-block">
                <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                  {t("checkbox.groupLabel")}
                </p>
                {(() => {
                  const [groupValues, setGroupValues] = useState({
                    option1: true,
                    option2: false,
                    option3: false,
                  });
                  const handleGroupChange =
                    (key: keyof typeof groupValues) => (checked: boolean) => {
                      setGroupValues((prev) => ({ ...prev, [key]: checked }));
                    };
                  return (
                    <>
                      <div className="flex flex-col gap-3">
                        <Checkbox
                          label={t("checkbox.groupOption1")}
                          checked={groupValues.option1}
                          onCheckedChange={handleGroupChange("option1")}
                          glow
                        />
                        <Checkbox
                          label={t("checkbox.groupOption2")}
                          checked={groupValues.option2}
                          onCheckedChange={handleGroupChange("option2")}
                        />
                        <Checkbox
                          label={t("checkbox.groupOption3")}
                          checked={groupValues.option3}
                          onCheckedChange={handleGroupChange("option3")}
                        />
                      </div>
                      <div className="mt-3 text-xs text-[var(--color-text-tertiary)] font-mono">
                        {t("checkbox.selectedCount")}:{" "}
                        {
                          Object.entries(groupValues).filter(([, v]) => v)
                            .length
                        }{" "}
                        of 3
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </section>

          {/* ============================================
            SWITCH SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("switch.title")}</h2>

            {/* Basic */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("switch.basic")}
              </p>
              <div className="flex flex-wrap gap-8">
                <Switch label={t("switch.off")} />
                <Switch label={t("switch.on")} defaultChecked />
                <Switch label={t("switch.glowOn")} defaultChecked glow />
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("switch.sizes")}
              </p>
              <div className="flex flex-wrap gap-8 items-end">
                <Switch size="sm" label={t("switch.small")} defaultChecked />
                <Switch size="md" label={t("switch.medium")} defaultChecked />
                <Switch size="lg" label={t("switch.large")} defaultChecked />
              </div>
            </div>

            {/* With icons */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("switch.withIcons")}
              </p>
              <div className="flex flex-wrap gap-8">
                <Switch
                  label={t("switch.notifications")}
                  defaultChecked
                  glow
                  onIcon={<BellIcon />}
                  offIcon={<BellSlashIcon />}
                />
                <Switch
                  label={t("switch.darkMode")}
                  onIcon={<MoonIcon />}
                  offIcon={<SunIcon />}
                />
                <Switch
                  label={t("switch.sound")}
                  defaultChecked
                  onIcon={<VolumeHighIcon />}
                  offIcon={<VolumeMuteIcon />}
                />
              </div>
            </div>

            {/* States */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("switch.states")}
              </p>
              <div className="flex flex-wrap gap-8">
                <Switch label={t("switch.normal")} />
                <Switch label={t("switch.disabledOff")} disabled />
                <Switch
                  label={t("switch.disabledOn")}
                  disabled
                  defaultChecked
                />
              </div>
            </div>

            {/* RTL */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("switch.rtlSupport")}
              </p>
              <div className="glass p-4 rounded-[var(--radius-md)] inline-block">
                <div className="flex flex-col gap-4">
                  <Switch label={t("switch.rtlLabel1")} defaultChecked glow />
                  <Switch label={t("switch.rtlLabel2")} />
                  <Switch label={t("switch.rtlLabel3")} defaultChecked />
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-3 font-mono">
                  {t("switch.rtlNote")}
                </p>
              </div>
            </div>

            {/* Controlled */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("switch.controlled")}
              </p>
              {(() => {
                const [on, setOn] = useState(false);
                return (
                  <div className="flex flex-col gap-3">
                    <Switch
                      label={t("switch.controlledLabel")}
                      checked={on}
                      onCheckedChange={setOn}
                      glow
                    />
                    <div className="text-xs text-[var(--color-text-secondary)] font-mono">
                      {t("switch.status")}: {on ? "✅ On" : "⬜ Off"}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-primary-solid)] text-white"
                        onClick={() => setOn(true)}
                      >
                        {t("switch.turnOn")}
                      </button>
                      <button
                        className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                        onClick={() => setOn(false)}
                      >
                        {t("switch.turnOff")}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Group */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("switch.group")}
              </p>
              <div className="glass p-6 rounded-[var(--radius-md)] inline-block">
                <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                  {t("switch.groupLabel")}
                </p>
                {(() => {
                  const [vals, setVals] = useState({
                    option1: true,
                    option2: false,
                    option3: false,
                  });
                  const set = (key: keyof typeof vals) => (v: boolean) =>
                    setVals((p) => ({ ...p, [key]: v }));
                  return (
                    <>
                      <div className="flex flex-col gap-4">
                        <Switch
                          label={t("switch.groupOption1")}
                          checked={vals.option1}
                          onCheckedChange={set("option1")}
                          glow
                        />
                        <Switch
                          label={t("switch.groupOption2")}
                          checked={vals.option2}
                          onCheckedChange={set("option2")}
                        />
                        <Switch
                          label={t("switch.groupOption3")}
                          checked={vals.option3}
                          onCheckedChange={set("option3")}
                        />
                      </div>
                      <div className="mt-3 text-xs text-[var(--color-text-tertiary)] font-mono">
                        {t("switch.enabledCount")}:{" "}
                        {Object.values(vals).filter(Boolean).length} of 3
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </section>

          {/* ============================================
            RADIO SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("radio.title")}</h2>

            {/* Primary group – plan picker */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("radio.group")}
              </p>
              <div className="glass p-6 rounded-[var(--radius-md)] inline-block max-w-md">
                <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">
                  {t("radio.groupLabel")}
                </p>
                {(() => {
                  const [plan, setPlan] = useState("pro");
                  return (
                    <>
                      <div className="flex flex-col gap-3">
                        <Radio
                          name="plan"
                          value="free"
                          label={t("radio.groupOption1")}
                          checked={plan === "free"}
                          onChange={() => setPlan("free")}
                        />
                        <Radio
                          name="plan"
                          value="pro"
                          label={t("radio.groupOption2")}
                          checked={plan === "pro"}
                          onChange={() => setPlan("pro")}
                          glow
                        />
                        <Radio
                          name="plan"
                          value="enterprise"
                          label={t("radio.groupOption3")}
                          checked={plan === "enterprise"}
                          onChange={() => setPlan("enterprise")}
                        />
                      </div>
                      <div className="mt-4 text-xs text-[var(--color-text-tertiary)] font-mono">
                        {t("radio.selected")}: {plan}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Horizontal group */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("radio.horizontalGroup")}
              </p>
              <div className="glass p-6 rounded-[var(--radius-md)] inline-block">
                {(() => {
                  const [theme, setTheme] = useState("nightfall");
                  return (
                    <div className="flex flex-wrap gap-6">
                      <Radio
                        name="theme-demo"
                        value="nightfall"
                        label={t("radio.nightfall")}
                        checked={theme === "nightfall"}
                        onChange={() => setTheme("nightfall")}
                        glow
                      />
                      <Radio
                        name="theme-demo"
                        value="daylight"
                        label={t("radio.daylight")}
                        checked={theme === "daylight"}
                        onChange={() => setTheme("daylight")}
                      />
                      <Radio
                        name="theme-demo"
                        value="dracula"
                        label={t("radio.dracula")}
                        checked={theme === "dracula"}
                        onChange={() => setTheme("dracula")}
                      />
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("radio.sizes")}
              </p>
              {(() => {
                const [size, setSize] = useState("md");
                return (
                  <div className="flex flex-wrap gap-6 items-center">
                    <Radio
                      name="size-demo"
                      value="sm"
                      size="sm"
                      label={t("radio.small")}
                      checked={size === "sm"}
                      onChange={() => setSize("sm")}
                    />
                    <Radio
                      name="size-demo"
                      value="md"
                      size="md"
                      label={t("radio.medium")}
                      checked={size === "md"}
                      onChange={() => setSize("md")}
                    />
                    <Radio
                      name="size-demo"
                      value="lg"
                      size="lg"
                      label={t("radio.large")}
                      checked={size === "lg"}
                      onChange={() => setSize("lg")}
                    />
                  </div>
                );
              })()}
            </div>

            {/* States */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("radio.states")}
              </p>
              <div className="flex flex-wrap gap-6">
                <Radio name="states" value="a" label={t("radio.normal")} />
                <Radio name="states" value="b" label={t("radio.error")} error />
                <Radio
                  name="states"
                  value="c"
                  label={t("radio.disabled")}
                  disabled
                />
                <Radio
                  name="states-disabled"
                  value="d"
                  label={t("radio.disabledChecked")}
                  disabled
                  defaultChecked
                />
              </div>
            </div>

            {/* RTL group */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("radio.rtlSupport")}
              </p>
              <div className="glass p-4 rounded-[var(--radius-md)] inline-block">
                {(() => {
                  const [lang, setLang] = useState("fa");
                  return (
                    <div className="flex flex-col gap-3">
                      <Radio
                        name="rtl-demo"
                        value="fa"
                        label={t("radio.rtlLabel1")}
                        checked={lang === "fa"}
                        onChange={() => setLang("fa")}
                        glow
                      />
                      <Radio
                        name="rtl-demo"
                        value="en"
                        label={t("radio.rtlLabel2")}
                        checked={lang === "en"}
                        onChange={() => setLang("en")}
                      />
                      <Radio
                        name="rtl-demo"
                        value="fr"
                        label={t("radio.rtlLabel3")}
                        checked={lang === "fr"}
                        onChange={() => setLang("fr")}
                      />
                    </div>
                  );
                })()}
                <p className="text-xs text-[var(--color-text-tertiary)] mt-3 font-mono">
                  {t("radio.rtlNote")}
                </p>
              </div>
            </div>
          </section>

          {/* ============================================
            RANGE SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("range.title")}</h2>

            {/* Basic */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("range.basic")}
              </p>
              <div className="flex flex-col gap-6 max-w-md">
                <Range defaultValue={65} label={t("range.volume")} suffix="%" />
                <Range
                  defaultValue={42}
                  label={t("range.brightness")}
                  suffix="%"
                  color="secondary"
                />
                <Range
                  defaultValue={80}
                  label={t("range.contrast")}
                  suffix="%"
                  color="accent"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("range.colors")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <Range
                  defaultValue={50}
                  color="primary"
                  label={t("range.primary")}
                  suffix="%"
                />
                <Range
                  defaultValue={50}
                  color="secondary"
                  label={t("range.secondary")}
                  suffix="%"
                />
                <Range
                  defaultValue={50}
                  color="accent"
                  label={t("range.accent")}
                  suffix="%"
                />
                <Range
                  defaultValue={50}
                  color="success"
                  label={t("range.success")}
                  suffix="%"
                />
                <Range
                  defaultValue={50}
                  color="danger"
                  label={t("range.danger")}
                  suffix="%"
                />
                <Range
                  defaultValue={50}
                  color="warning"
                  label={t("range.warning")}
                  suffix="%"
                />
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("range.sizes")}
              </p>
              <div className="flex flex-col gap-4 max-w-md">
                <Range
                  defaultValue={50}
                  size="sm"
                  label={t("range.small")}
                  suffix="%"
                />
                <Range
                  defaultValue={65}
                  size="md"
                  label={t("range.medium")}
                  suffix="%"
                />
                <Range
                  defaultValue={80}
                  size="lg"
                  label={t("range.large")}
                  suffix="%"
                />
              </div>
            </div>

            {/* Custom Suffix/Prefix */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("range.customUnits")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <Range
                  defaultValue={75}
                  suffix="px"
                  label={t("range.pixels")}
                  color="secondary"
                />
                <Range
                  defaultValue={99}
                  prefix="$"
                  suffix=""
                  label={t("range.price")}
                  color="success"
                />
                <Range
                  defaultValue={1500}
                  prefix="تومان "
                  suffix=""
                  label={t("range.rial")}
                  color="accent"
                />
                <Range
                  defaultValue={42}
                  suffix="°C"
                  label={t("range.temperature")}
                  color="warning"
                />
              </div>
            </div>

            {/* Value Positions */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("range.valuePositions")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <Range
                  defaultValue={50}
                  valuePosition="left"
                  label={t("range.left")}
                  suffix="%"
                />
                <Range
                  defaultValue={50}
                  valuePosition="right"
                  label={t("range.right")}
                  suffix="%"
                />
                <Range
                  defaultValue={50}
                  valuePosition="top"
                  label={t("range.top")}
                  suffix="%"
                />
                <Range
                  defaultValue={50}
                  valuePosition="bottom"
                  label={t("range.bottom")}
                  suffix="%"
                />
              </div>
            </div>

            {/* Sparkle at Max */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("range.sparkleAtMax")}
              </p>
              <div className="flex flex-col gap-4 max-w-md">
                <Range
                  defaultValue={95}
                  label={t("range.almostMax")}
                  suffix="%"
                  color="primary"
                />
                <Range
                  defaultValue={100}
                  label={t("range.atMax")}
                  suffix="%"
                  color="success"
                />
              </div>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-2 font-mono">
                {t("range.sparkleNote")}
              </p>
            </div>

            {/* Without Glow */}
            <div className="mb-6">
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("range.withoutGlow")}
              </p>
              <div className="flex flex-col gap-4 max-w-md">
                <Range
                  defaultValue={60}
                  glow={false}
                  label={t("range.noGlow")}
                  suffix="%"
                />
                <Range
                  defaultValue={75}
                  glow={false}
                  label={t("range.noGlow2")}
                  suffix="%"
                  color="secondary"
                />
              </div>
            </div>

            {/* Controlled */}
            <div>
              <p
                className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono"
                dir="auto"
              >
                {t("range.controlled")}
              </p>
              {(() => {
                const [controlledValue, setControlledValue] = useState(50);
                const [finalValue, setFinalValue] = useState(50);

                return (
                  <div className="flex flex-col gap-4 max-w-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                        {t("range.liveValue")}:{" "}
                        <span className="text-[var(--color-primary)] font-bold">
                          {controlledValue}%
                        </span>
                      </span>
                      <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                        {t("range.finalValue")}:{" "}
                        <span className="text-[var(--color-secondary)] font-bold">
                          {finalValue}%
                        </span>
                      </span>
                    </div>
                    <Range
                      value={controlledValue}
                      onChange={setControlledValue}
                      onChangeComplete={setFinalValue}
                      label={t("range.controlledLabel")}
                      suffix="%"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setControlledValue(25)}
                      >
                        {t("range.set25")}
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => setControlledValue(75)}
                      >
                        {t("range.set75")}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setControlledValue(100)}
                      >
                        {t("range.set100")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setControlledValue(0)}
                      >
                        {t("range.reset")}
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>

          {/* ============================================
            SOCIAL MEDIA SHOWCASE
            ============================================ */}
          <SocialMedia
            links={[
              {
                platform: "github",
                url: "https://github.com/dara-ui",
                color: "#f0f6fc",
              },
              {
                platform: "twitter",
                url: "https://twitter.com/dara-ui",
                color: "#000",
              },
              {
                platform: "discord",
                url: "https://discord.gg/dara-ui",
                color: "#5865F2",
              },
              {
                platform: "youtube",
                url: "https://youtube.com/@dara-ui",
                color: "#FF0000",
              },
              {
                platform: "instagram",
                url: "https://instagram.com/dara-ui",
                color: "#E4405F",
              },
              {
                platform: "linkedin",
                url: "https://linkedin.com/company/dara-ui",
                color: "#0A66C2",
              },
              {
                platform: "bluesky",
                url: "https://bsky.app/profile/dara-ui",
                color: "#1185FE",
              },
            ]}
            position="left"
            size="md"
            showLabels={false}
            verticalOffset="50%"
          />
        </div>
      </div>
    </>
  );
}

// ============================================
// App Component with Providers
// ============================================

function App() {
  return (
    <ToastProvider>
      <I18nProvider translations={translations} defaultLanguage="en">
        <ThemeProvider defaultTheme="nightfall">
          <AppContent />
        </ThemeProvider>
      </I18nProvider>
    </ToastProvider>
  );
}

export default App;
