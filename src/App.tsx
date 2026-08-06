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
import { Sidebar } from "./components/Sidebar";
import type { SidebarGroup, SidebarItem } from "./components/Sidebar";
import useDirection from "./hooks/useDirection";

import {
  I18nProvider,
  useI18n,
  LanguageChanger,
} from "./components/LanguageChanger";
import { translations } from "./translations";

import "./styles/index.css";
import StatsWidget from "./components/StatsWidget";

type Theme = "nightfall" | "daylight" | "dracula";

// ============================================
// Icons
// ============================================

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

const FolderIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);

const DocsIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

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

const ExploreIcon = () => (
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
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// ============================================
// Tab items for Tabs demo
// ============================================

const tabItems = [
  {
    label: "Archive",
    value: "archive",
    content: (
      <div className="py-4 text-[var(--color-text-secondary)]">
        Browse encrypted Jedi records, holocrons, and mission logs from the
        Calgary archive.
      </div>
    ),
  },
  {
    label: "Quests",
    value: "quests",
    content: (
      <div className="py-4 text-[var(--color-text-secondary)]">
        Active missions, bounties, and side-quests await your attention,
        Padawan.
      </div>
    ),
  },
  {
    label: "Stats",
    value: "stats",
    content: (
      <div className="py-4 text-[var(--color-text-secondary)]">
        Track your Force alignment, XP gains, and cybernetic enhancement levels.
      </div>
    ),
  },
  {
    label: "Settings",
    value: "settings",
    content: (
      <div className="py-4 text-[var(--color-text-secondary)]">
        Configure your HUD, theme mode, and archive encryption preferences.
      </div>
    ),
  },
];

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
        inside a futuristic archive hidden beneath Calgary during a snowstorm.
        It blends glassmorphism, cyberpunk, gothic aesthetics, Apple minimalism,
        and anime HUD elements.
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
            <span className="text-[var(--color-primary)]">Nightfall</span> —
            Dark, mysterious, glass-heavy
          </li>
          <li>
            <span className="text-[var(--color-warning)]">Daylight</span> —
            Light, clean, minimal
          </li>
          <li>
            <span className="text-[var(--color-danger)]">Dracula</span> — Dark,
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

// Accordion items with icons
const accordionItemsWithIcons = [
  {
    id: "1",
    title: "Dashboard",
    icon: (
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
    ),
    content: (
      <div className="text-[var(--color-text-secondary)]">
        📊 Dashboard overview with key metrics and recent activity.
      </div>
    ),
  },
  {
    id: "2",
    title: "Projects",
    icon: (
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
          d="M3.75 13.5l14.25-11.25L13.5 3.75 3.75 13.5zM3.75 13.5L6.75 16.5M13.5 3.75L16.5 6.75M12 12l-3 3M9 15l-3 3"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 12l3-3M15 9l3-3"
        />
      </svg>
    ),
    content: (
      <div className="text-[var(--color-text-secondary)]">
        🚀 Active projects and their current status.
      </div>
    ),
  },
  {
    id: "3",
    title: "Settings",
    icon: (
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
    ),
    content: (
      <div className="text-[var(--color-text-secondary)]">
        ⚙️ Configure your application preferences.
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

  return (
    <div className="flex gap-3 flex-wrap">
      <Button
        variant="success"
        onClick={() => toast.success("Mission complete! +300 XP earned.")}
      >
        Success Toast
      </Button>
      <Button
        variant="danger"
        onClick={() => toast.error("Connection lost. Retrying...")}
      >
        Error Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Please check your connection")}
      >
        Warning Toast
      </Button>
      <Button
        variant="glass"
        onClick={() => toast.info("Archives are being indexed")}
      >
        Info Toast
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

  // ----- Navbar links with i18n support -----
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

  return (
    <>
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
          <LanguageChanger iconOnly size="sm" placement="top" />
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
            <div className="flex gap-2 flex-wrap items-center">
              <Button
                size="sm"
                variant={theme === "nightfall" ? "primary" : "outline"}
                onClick={() => changeTheme("nightfall")}
              >
                🌙 {t("header.nightfall")}
              </Button>
              <Button
                size="sm"
                variant={theme === "daylight" ? "primary" : "outline"}
                onClick={() => changeTheme("daylight")}
              >
                ☀️ {t("header.daylight")}
              </Button>
              <Button
                size="sm"
                variant={theme === "dracula" ? "primary" : "outline"}
                onClick={() => changeTheme("dracula")}
              >
                🍷 {t("header.dracula")}
              </Button>
              <Button size="sm" variant="outline" onClick={toggleDirection}>
                {direction === "ltr"
                  ? `🔁 ${t("header.rtl")}`
                  : `🔁 ${t("header.ltr")}`}
              </Button>
            </div>
          </div>

          {/* ============================================
            BADGES SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("badges.title")}</h2>

            {/* Badge Variants */}
            <div className="mb-6">
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
                {t("badges.withIcons")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary">
                  <span className="mr-1">📦</span> {t("badges.package")}
                </Badge>
                <Badge variant="success">
                  <span className="mr-1">✅</span> {t("badges.done")}
                </Badge>
                <Badge variant="warning">
                  <span className="mr-1">⚠️</span> {t("badges.warning")}
                </Badge>
                <Badge variant="danger">
                  <span className="mr-1">❌</span> {t("badges.failed")}
                </Badge>
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
              <Button variant="glass">{t("buttons.glass")}</Button>
              <Button variant="danger">{t("buttons.danger")}</Button>
              <Button variant="success">{t("buttons.success")}</Button>
              <Button variant="outline">{t("buttons.outline")}</Button>
            </div>
          </section>

          {/* Buttons: states */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("buttons.states")}
            </h2>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary">{t("buttons.normal")}</Button>
              <Button
                variant="primary"
                className="bg-[var(--color-primary-hover)] shadow-[var(--shadow-glow-primary)]"
              >
                {t("buttons.hover")}
              </Button>
              <Button variant="primary" className="scale-95">
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

          {/* ============================================
            AVATAR SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">{t("avatar.title")}</h2>

            {/* Sizes */}
            <div className="mb-6">
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
                {t("avatar.glowEffects")}
              </p>
              <div className="flex items-center gap-4">
                <Avatar glow="purple" fallbackText="JD" />
                <Avatar glow="cyan" fallbackText="JD" />
                <Avatar glow="pink" fallbackText="JD" />
              </div>
            </div>

            {/* With Image */}
            <div className="mb-6">
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
                  glow="purple"
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
                {t("avatar.clickable")}
              </p>
              <Avatar
                fallbackText="JD"
                onClick={() => alert("Avatar clicked!")}
                glow="purple"
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
                {t("tooltip.variants")}
              </p>
              <div className="flex items-center gap-4">
                <Tooltip content={t("tooltip.glassTooltip")} variant="glass">
                  <Button variant="glass">{t("buttons.glass")}</Button>
                </Tooltip>
                <Tooltip content={t("tooltip.solidTooltip")} variant="solid">
                  <Button variant="secondary">{t("buttons.secondary")}</Button>
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
                {t("cards.floatGlow")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card float glow="purple">
                  <h3 className="font-heading font-bold">
                    {t("cards.purpleGlow")}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    Hover to float ✨
                  </p>
                </Card>
                <Card float glow="cyan">
                  <h3 className="font-heading font-bold">
                    {t("cards.cyanGlow")}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    Hover to float ✨
                  </p>
                </Card>
                <Card float glow="pink">
                  <h3 className="font-heading font-bold">
                    {t("cards.pinkGlow")}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    Hover to float ✨
                  </p>
                </Card>
              </div>
            </div>

            {/* Feature Cards */}
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
                {t("cards.featureCards")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card glow="purple" className="text-center">
                  <div className="text-4xl mb-2">🚀</div>
                  <h3 className="font-heading font-bold">
                    {t("cards.launch")}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    {t("cards.deployProject")}
                  </p>
                </Card>
                <Card variant="solid" className="text-center">
                  <div className="text-4xl mb-2">📊</div>
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
                🔮 {t("modal.openModal")}
              </Button>
              <Button variant="glass" onClick={() => setIsModalOpen(true)}>
                📜 {t("modal.viewContent")}
              </Button>
            </div>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title={`🗂️ ${t("modal.archiveAccess")}`}
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
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

            {/* Basic XP Bar */}
            <div className="glass mb-5 p-6 float-card">
              <XPBar value={3400} max={5000} level={14} />
            </div>

            {/* With custom labels */}
            <div className="glass mb-5 p-6 float-card glow-cyan">
              <XPBar
                value={3400}
                max={5000}
                level={14}
                customLabel={`★ ${t("xpbar.rankProgress")}`}
                levelLabel="Rank"
                xpLabel={t("xpbar.exp")}
              />
            </div>

            {/* With rank tiers */}
            <div className="glass mb-5 p-6 float-card glow-purple">
              <XPBar
                value={3400}
                max={5000}
                level={14}
                levelLabel={t("xpbar.tier")}
                xpLabel={t("xpbar.points")}
                customLabel={`🏆 ${t("xpbar.rankProgress")}`}
                ranks={[
                  { label: "Common", requiredXP: 0 },
                  { label: "Uncommon", requiredXP: 1000 },
                  { label: "Rare", requiredXP: 2500 },
                  { label: "Epic", requiredXP: 4000 },
                  { label: "Legendary", requiredXP: 6000 },
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
                customLabel={`⚔️ ${t("xpbar.missionProgress")}`}
                ranks={[
                  { label: "Recruit", requiredXP: 0 },
                  { label: "Soldier", requiredXP: 300 },
                  { label: "Veteran", requiredXP: 600 },
                  { label: "Elite", requiredXP: 900 },
                  { label: "Commander", requiredXP: 1200 },
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
              <Button glow="purple" variant="primary">
                {t("glow.glowPurple")}
              </Button>
              <Button glow="cyan" variant="success">
                {t("glow.glowCyan")}
              </Button>
              <Button glow="pink" variant="danger">
                {t("glow.glowPink")}
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
                glow="cyan"
              />

              <QuestCard
                title={t("quest.secureArchives")}
                description={t("quest.secureArchivesDesc")}
                xp={200}
                deadline="3 days"
                rank="A"
                glow="purple"
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
                glow="purple"
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
                glow="pink"
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
                glow="purple"
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
                glow="cyan"
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
                glow="pink"
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
                glow="purple"
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
                glow="cyan"
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
                glow="pink"
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
                glow="purple"
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
                glow="cyan"
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
                title={`📈 ${t("statsWidget.progress")}`}
                glow="pink"
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
                glow="purple"
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
                title={`⚔️ ${t("statsWidget.battleStats")}`}
                glow="cyan"
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
                title={`📊 ${t("statsWidget.skillProgress")}`}
                glow="purple"
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
                <ThemeChanger
                  availableThemes={[
                    { value: "nightfall", label: "Nightfall", icon: "🌙" },
                    { value: "daylight", label: "Daylight", icon: "☀️" },
                    { value: "bloody-moon", label: "Bloody Moon", icon: "🌕" },
                  ]}
                  autoDetect={false}
                  size="md"
                />
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

              {/* Custom Languages */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
                  {t("languageChanger.customLanguages")}
                </span>
                <LanguageChanger
                  availableLanguages={[
                    { value: "en", label: "English", icon: "🇬🇧", dir: "ltr" },
                    { value: "fa", label: "فارسی", icon: "🇮🇷", dir: "rtl" },
                    { value: "fr", label: "Français", icon: "🇫🇷", dir: "ltr" },
                  ]}
                  size="md"
                />
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
              <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-primary text-white text-center">
                {t("gradients.primary")}
              </div>
              <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-accent text-white text-center">
                {t("gradients.accent")}
              </div>
              <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-success text-white text-center">
                {t("gradients.success")}
              </div>
              <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-danger text-white text-center">
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
              <div className="p-6 rounded-[var(--radius-standard)] glow-purple text-center bg-[var(--color-bg-tertiary)]">
                {t("effects.glowPurple")}
              </div>
              <div className="p-6 rounded-[var(--radius-standard)] glow-pink text-center bg-[var(--color-bg-tertiary)]">
                {t("effects.glowPink")}
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
          <section className="p-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
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
            SIDEBAR SHOWCASE
            ============================================ */}
          <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-2xl font-semibold mb-6">
              {t("sidebar.title")}
            </h2>

            <div className="relative min-h-[400px] rounded-[var(--radius-standard)] overflow-hidden bg-[var(--color-bg-tertiary)]/30">
              {/* Sidebar demo inside a container */}
              <div className="relative h-[400px]">
                <Sidebar
                  brand={
                    <span
                      className="font-heading font-bold text-sm tracking-tight"
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
                  groups={[
                    {
                      label: t("sidebar.main"),
                      icon: <HomeIcon />,
                      defaultExpanded: true,
                      items: [
                        {
                          id: "demo-dashboard",
                          label: t("sidebar.dashboard"),
                          icon: <HomeIcon />,
                          active: true,
                        },
                        {
                          id: "demo-projects",
                          label: t("sidebar.projects"),
                          icon: <FolderIcon />,
                          badge: 12,
                        },
                        {
                          id: "demo-team",
                          label: t("sidebar.team"),
                          icon: <UserIcon />,
                        },
                      ],
                    },
                    {
                      label: t("sidebar.management"),
                      icon: <SettingsIcon />,
                      items: [
                        {
                          id: "demo-documents",
                          label: t("sidebar.documents"),
                          icon: <DocsIcon />,
                          subItems: [
                            {
                              id: "demo-invoices",
                              label: t("sidebar.invoices"),
                            },
                            {
                              id: "demo-reports",
                              label: t("sidebar.reports"),
                              badge: 3,
                            },
                            { id: "demo-archive", label: t("sidebar.archive") },
                          ],
                        },
                        {
                          id: "demo-messages",
                          label: t("sidebar.messages"),
                          icon: <MailIcon />,
                          badge: 5,
                          subItems: [
                            { id: "demo-inbox", label: t("sidebar.inbox") },
                            { id: "demo-sent", label: t("sidebar.sent") },
                            { id: "demo-drafts", label: t("sidebar.drafts") },
                          ],
                        },
                        {
                          id: "demo-settings",
                          label: t("sidebar.settings"),
                          icon: <SettingsIcon />,
                        },
                      ],
                    },
                  ]}
                  footer={
                    <button className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-180 w-full px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-elevated)]/30 text-sm">
                      <LogoutIcon />
                      <span>{t("sidebar.logout")}</span>
                    </button>
                  }
                  className="relative z-10 h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-[var(--color-text-tertiary)] text-sm font-mono">
                    ← {t("sidebar.hint")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================
            SOCIAL MEDIA SHOWCASE
            ============================================ */}
          <SocialMedia
            links={[
              { platform: "github", url: "https://github.com/dara-ui" },
              { platform: "twitter", url: "https://twitter.com/dara-ui" },
              { platform: "discord", url: "https://discord.gg/dara-ui" },
              { platform: "youtube", url: "https://youtube.com/@dara-ui" },
              { platform: "instagram", url: "https://instagram.com/dara-ui" },
              {
                platform: "linkedin",
                url: "https://linkedin.com/company/dara-ui",
              },
              { platform: "bluesky", url: "https://bsky.app/profile/dara-ui" },
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
