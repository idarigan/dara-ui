import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "./Navbar";
import { LanguageChanger } from "../LanguageChanger/LanguageChanger";
import { ThemeChanger } from "../ThemeChanger/ThemeChanger";
import { useState } from "react";
import Button from "../Button/Button";
import { Avatar } from "../Avatar/Avatar";

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

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    showSearch: { control: "boolean" },
    showLanguageChanger: { control: "boolean" },
    showThemeChanger: { control: "boolean" },
    showSecondaryNav: { control: "boolean" },
  },
  args: {
    showSearch: true,
    showLanguageChanger: false,
    showThemeChanger: false,
    showSecondaryNav: false,
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultLinks = [
  { label: "Home", href: "#", icon: <HomeIcon />, active: true },
  { label: "Explore", href: "#", icon: <ExploreIcon /> },
  { label: "Settings", href: "#", icon: <SettingsIcon /> },
];

const secondaryLinks = [
  { label: "Dashboard", href: "#" },
  { label: "Projects", href: "#" },
  { label: "Team", href: "#" },
  { label: "Analytics", href: "#" },
  { label: "Reports", href: "#" },
];

export const Default: Story = {
  render: (args) => {
    const [_, setSearch] = useState("");

    return (
      <div className="relative h-[70vh] overflow-y-auto border border-[var(--color-border-primary)] rounded-[var(--radius-large)]">
        <Navbar
          {...args}
          links={defaultLinks}
          onSearch={(query) => setSearch(query)}
        />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <h1 className="font-heading text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Scroll to see the navbar transform
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            The navbar starts sticky at the top and transforms into a floating
            pill when you scroll down.
          </p>
        </div>
      </div>
    );
  },
};

export const WithLanguageChanger: Story = {
  render: (args) => {
    const [_, setSearch] = useState("");

    return (
      <div className="relative h-[70vh] overflow-y-auto border border-[var(--color-border-primary)] rounded-[var(--radius-large)]">
        <Navbar
          {...args}
          links={defaultLinks}
          onSearch={(query) => setSearch(query)}
          showLanguageChanger
          languageChanger={<LanguageChanger size="sm" iconOnly />}
        />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <h1 className="font-heading text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            With Language Changer
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Language changer integrated into the navbar.
          </p>
        </div>
      </div>
    );
  },
};

export const WithThemeChanger: Story = {
  render: (args) => {
    const [_, setSearch] = useState("");

    return (
      <div className="relative h-[70vh] overflow-y-auto border border-[var(--color-border-primary)] rounded-[var(--radius-large)]">
        <Navbar
          {...args}
          links={defaultLinks}
          onSearch={(query) => setSearch(query)}
          showThemeChanger
          themeChanger={<ThemeChanger size="sm" iconOnly />}
        />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <h1 className="font-heading text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            With Theme Changer
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Theme changer integrated into the navbar.
          </p>
        </div>
      </div>
    );
  },
};

export const WithBothChangers: Story = {
  render: (args) => {
    const [_, setSearch] = useState("");

    return (
      <div className="relative h-[70vh] overflow-y-auto border border-[var(--color-border-primary)] rounded-[var(--radius-large)]">
        <Navbar
          {...args}
          links={defaultLinks}
          onSearch={(query) => setSearch(query)}
          showLanguageChanger
          languageChanger={<LanguageChanger size="sm" iconOnly />}
          showThemeChanger
          themeChanger={<ThemeChanger size="sm" iconOnly />}
        />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <h1 className="font-heading text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            With Both Changers
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Both language and theme changers integrated.
          </p>
        </div>
      </div>
    );
  },
};

export const WithSecondaryNav: Story = {
  render: (args) => {
    const [_, setSearch] = useState("");

    return (
      <div className="relative h-[70vh] overflow-y-auto border border-[var(--color-border-primary)] rounded-[var(--radius-large)]">
        <Navbar
          {...args}
          links={defaultLinks}
          secondaryLinks={secondaryLinks}
          showSecondaryNav
          onSearch={(query) => setSearch(query)}
        />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <h1 className="font-heading text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            With Secondary Navigation
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Hover over the navbar to reveal the secondary navigation drawer.
          </p>
        </div>
      </div>
    );
  },
};

export const WithCustomBrand: Story = {
  render: (args) => {
    const [_, setSearch] = useState("");

    return (
      <div className="relative h-[70vh] overflow-y-auto border border-[var(--color-border-primary)] rounded-[var(--radius-large)]">
        <Navbar
          {...args}
          brand={
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span className="font-heading font-bold text-lg text-[var(--color-text-primary)]">
                My App
              </span>
            </div>
          }
          links={defaultLinks}
          onSearch={(query) => setSearch(query)}
        />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <h1 className="font-heading text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Custom Brand
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Custom brand element with icon and text.
          </p>
        </div>
      </div>
    );
  },
};

export const WithRightContent: Story = {
  render: (args) => {
    const [_, setSearch] = useState("");

    return (
      <div className="relative h-[70vh] overflow-y-auto border border-[var(--color-border-primary)] rounded-[var(--radius-large)]">
        <Navbar
          {...args}
          links={defaultLinks}
          onSearch={(query) => setSearch(query)}
          rightContent={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="primary">
                Sign In
              </Button>
              <Avatar size="sm" fallbackText="JD" />
            </div>
          }
        />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <h1 className="font-heading text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            With Right Content
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Custom right side content with sign in button and avatar.
          </p>
        </div>
      </div>
    );
  },
};

export const RTL: Story = {
  render: (args) => {
    const [_, setSearch] = useState("");
    return (
      <div className="relative h-[70vh] overflow-y-auto border border-[var(--color-border-primary)] rounded-[var(--radius-large)]">
        <Navbar
          {...args}
          links={[
            { label: "خانه", href: "#", icon: <HomeIcon />, active: true },
            { label: "کاوش", href: "#", icon: <ExploreIcon /> },
            { label: "تنظیمات", href: "#", icon: <SettingsIcon /> },
          ]}
          onSearch={(query) => setSearch(query)}
          showLanguageChanger
          languageChanger={<LanguageChanger size="sm" iconOnly />}
        />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <h1 className="font-heading text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            RTL Support
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Navbar automatically adapts to RTL direction.
          </p>
        </div>
      </div>
    );
  },
  decorators: [
    (Story) => {
      // Set RTL only while this story is mounted
      React.useEffect(() => {
        const prevDir = document.documentElement.dir;
        const prevLang = document.documentElement.lang;

        document.documentElement.dir = "rtl";
        document.documentElement.lang = "fa";

        return () => {
          document.documentElement.dir = prevDir || "ltr";
          document.documentElement.lang = prevLang || "en";
        };
      }, []);

      return <Story />;
    },
  ],
};
