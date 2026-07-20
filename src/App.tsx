import React, { useState, useEffect } from "react";
import Button from "./components/Button/Button";
import { Badge } from "./components/Badge/Badge";
import { Input } from "./components/Input/Input";
import { Card } from "./components/Card/Card";
import { Tabs } from "./components/Tabs/Tabs";
import { Accordion } from "./components/Accordion/Accordion";
import { Dropdown } from "./components/Dropdown/Dropdown";
import useDirection from "./hooks/useDirection";
import "./styles/index.css";

type Theme = "nightfall" | "daylight" | "bloody-moon";

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

// Tab items for Tabs demo
const tabItems = [
  {
    label: "📁 Archive",
    content: (
      <div className="py-4 text-[var(--color-text-secondary)]">
        Browse encrypted Jedi records, holocrons, and mission logs from the
        Calgary archive.
      </div>
    ),
  },
  {
    label: "⚔️ Quests",
    content: (
      <div className="py-4 text-[var(--color-text-secondary)]">
        Active missions, bounties, and side-quests await your attention,
        Padawan.
      </div>
    ),
  },
  {
    label: "📊 Stats",
    content: (
      <div className="py-4 text-[var(--color-text-secondary)]">
        Track your Force alignment, XP gains, and cybernetic enhancement levels.
      </div>
    ),
  },
  {
    label: "⚙️ Settings",
    content: (
      <div className="py-4 text-[var(--color-text-secondary)]">
        Configure your HUD, theme mode, and archive encryption preferences.
      </div>
    ),
  },
];

// Accordion items for demo
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
            <span className="text-[var(--color-danger)]">Bloody Moon</span> —
            Dark, intense, red-accented
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

// Dropdown options
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

function App() {
  const [theme, setTheme] = useState<Theme>("nightfall");
  const { direction, toggleDirection } = useDirection("ltr");

  // Controlled Tabs state
  const [activeTab, setActiveTab] = useState("📁 Archive");

  // Controlled Accordion state
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>(["1"]);
  const [accordionMode, setAccordionMode] = useState<"single" | "multiple">(
    "single",
  );

  // Controlled Dropdown state
  const [selectedFramework, setSelectedFramework] = useState("react");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen p-8 transition-theme">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-bold text-gradient-primary">
            Dara UI Components
          </h1>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={theme === "nightfall" ? "primary" : "outline"}
              onClick={() => changeTheme("nightfall")}
            >
              🌙 Nightfall
            </Button>
            <Button
              size="sm"
              variant={theme === "daylight" ? "primary" : "outline"}
              onClick={() => changeTheme("daylight")}
            >
              ☀️ Daylight
            </Button>
            <Button
              size="sm"
              variant={theme === "bloody-moon" ? "primary" : "outline"}
              onClick={() => changeTheme("bloody-moon")}
            >
              🍷 Bloody Moon
            </Button>
            <Button size="sm" variant="outline" onClick={toggleDirection}>
              {direction === "ltr" ? "🔁 RTL" : "🔁 LTR"}
            </Button>
          </div>
        </div>

        {/* ----- BADGE SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Badges</h2>

          {/* Variants */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Variants
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </div>

          {/* Outline */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Outline
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge outline variant="primary">
                Primary
              </Badge>
              <Badge outline variant="secondary">
                Secondary
              </Badge>
              <Badge outline variant="success">
                Success
              </Badge>
              <Badge outline variant="danger">
                Danger
              </Badge>
              <Badge outline variant="warning">
                Warning
              </Badge>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Sizes
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </div>

          {/* With Glow */}
          <div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              With Glow
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge glow variant="primary">
                Glow Primary
              </Badge>
              <Badge glow variant="success">
                Glow Success
              </Badge>
              <Badge glow variant="danger">
                Glow Danger
              </Badge>
            </div>
          </div>
        </section>

        {/* ----- BUTTON SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Button Variants</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="glass">Glass</Button>
          </div>
        </section>

        {/* ----- TABS SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Tabs</h2>
          <Tabs
            items={tabItems}
            activeValue={activeTab}
            onChange={setActiveTab}
            glowColor="primary"
          />
        </section>

        {/* ----- ACCORDION SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Accordion</h2>

          {/* Mode Switcher */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
              Mode:
            </span>
            <Button
              size="sm"
              variant={accordionMode === "single" ? "primary" : "outline"}
              onClick={() => {
                setAccordionMode("single");
                setOpenAccordionItems(["1"]);
              }}
            >
              Single
            </Button>
            <Button
              size="sm"
              variant={accordionMode === "multiple" ? "primary" : "outline"}
              onClick={() => {
                setAccordionMode("multiple");
                setOpenAccordionItems(["1", "2"]);
              }}
            >
              Multiple
            </Button>
            <span className="text-xs text-[var(--color-text-tertiary)] font-mono ml-2">
              {accordionMode === "single"
                ? "Only one item can be open at a time"
                : "Multiple items can be open simultaneously"}
            </span>
          </div>

          {/* Controlled Accordion */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Controlled — Open items:{" "}
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
              With Icons
            </p>
            <Accordion
              items={accordionItemsWithIcons}
              defaultOpenItems={["1"]}
              multiple={false}
            />
          </div>
        </section>

        {/* ----- DROPDOWN SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Dropdown</h2>

          {/* Basic Dropdowns */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Basic
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown
                options={frameworkOptions}
                placeholder="Select a framework..."
                defaultValue="react"
              />
              <Dropdown
                options={frameworkOptions}
                placeholder="With placeholder"
              />
            </div>
          </div>

          {/* With Icons */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              With Icons
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown
                options={dropdownOptionsWithIcons}
                placeholder="Select with icons..."
                defaultValue="user"
              />
              <Dropdown
                options={dropdownOptionsWithIcons}
                placeholder="Search with icons..."
                searchable
                searchPlaceholder="Search options..."
              />
            </div>
          </div>

          {/* Searchable */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Searchable
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown
                options={frameworkOptions}
                placeholder="Search frameworks..."
                searchable
                defaultValue="react"
                label="Framework"
                helperText="Type to filter options"
              />
              <Dropdown
                options={dropdownOptionsWithIcons}
                placeholder="Search with icons..."
                searchable
                searchPlaceholder="Search..."
                label="With Icons"
              />
            </div>
          </div>

          {/* Controlled */}
          <div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Controlled — Selected:{" "}
              <span className="text-[var(--color-primary)] font-bold">
                {selectedFramework}
              </span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown
                options={frameworkOptions}
                value={selectedFramework}
                onChange={setSelectedFramework}
                placeholder="Select a framework..."
                label="Controlled Dropdown"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedFramework("vue")}
                >
                  Set Vue
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedFramework("svelte")}
                >
                  Set Svelte
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedFramework("solid")}
                >
                  Set Solid
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ----- CARD SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Cards</h2>

          {/* Variants */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Variants
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="glass">
                <h3 className="font-heading font-bold">Glass</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  backdrop-filter: blur(20px)
                </p>
              </Card>
              <Card variant="solid">
                <h3 className="font-heading font-bold">Solid</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  More opaque, less blur
                </p>
              </Card>
              <Card variant="outline">
                <h3 className="font-heading font-bold">Outline</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Transparent with border
                </p>
              </Card>
            </div>
          </div>

          {/* Float + Glow */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Float + Glow
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card float glow="primary">
                <h3 className="font-heading font-bold">Primary Glow</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Hover to float ✨
                </p>
              </Card>
              <Card float glow="secondary">
                <h3 className="font-heading font-bold">Secondary Glow</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Hover to float ✨
                </p>
              </Card>
              <Card float glow="accent">
                <h3 className="font-heading font-bold">Accent Glow</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Hover to float ✨
                </p>
              </Card>
            </div>
          </div>

          {/* Feature Cards */}
          <div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Feature Cards
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card glow="primary" className="text-center">
                <div className="text-4xl mb-2">🚀</div>
                <h3 className="font-heading font-bold">Launch</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Deploy your project with one click.
                </p>
              </Card>
              <Card variant="solid" className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-heading font-bold">Analytics</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Track your performance metrics.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* ----- INPUT SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Inputs</h2>

          {/* Basic Inputs */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Basic Inputs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Text input" />
              <Input type="password" placeholder="Password" />
              <Input type="search" placeholder="Search..." />
              <Input type="email" placeholder="Email" />
            </div>
          </div>

          {/* With Labels */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              With Labels
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Username" placeholder="Enter username" />
              <Input
                label="Email"
                type="email"
                placeholder="Enter email"
                helperText="We'll never share your email."
              />
            </div>
          </div>

          {/* With Icons */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              With Icons
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input leftIcon={<UserIcon />} placeholder="Username" />
              <Input
                leftIcon={<SearchIcon />}
                type="search"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Validation States */}
          <div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Validation States
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Success"
                validation="success"
                successMessage="Valid input!"
              />
              <Input
                placeholder="Error"
                validation="error"
                errorMessage="Something went wrong"
              />
            </div>
          </div>
        </section>

        {/* ----- GLOW SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Glow Effects</h2>
          <div className="flex flex-wrap gap-3">
            <Button glow variant="primary">
              Glow Primary
            </Button>
            <Button glow variant="success">
              Glow Success
            </Button>
            <Button glow variant="danger">
              Glow Danger
            </Button>
          </div>
        </section>

        {/* ----- GRADIENT SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Gradients</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-primary text-white text-center">
              Primary
            </div>
            <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-accent text-white text-center">
              Accent
            </div>
            <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-success text-white text-center">
              Success
            </div>
            <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-danger text-white text-center">
              Danger
            </div>
          </div>
        </section>

        {/* ----- GLASS & GLOW SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Effects</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-[var(--radius-standard)] glass text-center">
              Glass Effect
            </div>
            <div className="p-6 rounded-[var(--radius-standard)] glow-primary text-center bg-[var(--color-bg-tertiary)]">
              Glow Primary
            </div>
            <div className="p-6 rounded-[var(--radius-standard)] glow-accent text-center bg-[var(--color-bg-tertiary)]">
              Glow Accent
            </div>
          </div>
        </section>

        {/* ----- TYPOGRAPHY SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Typography</h2>
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Text Secondary
            </p>
            <p className="text-base">Regular body text with Inter font</p>
            <p className="text-xl font-bold text-gradient-primary">
              Gradient Heading
            </p>
            <p className="text-lg font-medium text-[var(--color-accent)]">
              Accent colored text
            </p>
            <code className="px-3 py-1 rounded-[var(--radius-sm)] block">
              console.log("Code with JetBrains Mono");
            </code>
          </div>
        </section>

        {/* ----- PERSIAN TEXT SHOWCASE ----- */}
        <section className="p-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Persian Support</h2>
          <div className="space-y-4">
            <p className="lang-fa text-lg">
              این متن با فونت وزیرمتن نمایش داده می‌شود
            </p>
            <h3 className="lang-fa-heading text-xl">عنوان فارسی با قلم Kook</h3>
            <p className="lang-fa text-sm text-[var(--color-text-secondary)]">
              متن فارسی با اندازه کوچک و رنگ ثانویه
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
