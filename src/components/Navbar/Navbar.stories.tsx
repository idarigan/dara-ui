import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "./Navbar";
import { LanguageChanger } from "../LanguageChanger/LanguageChanger";
import { ThemeChanger } from "../ThemeChanger/ThemeChanger";
import { useState, useEffect } from "react";
import Button from "../Button/Button";
import { Avatar } from "../Avatar/Avatar";
import { HomeIcon, ExploreIcon, SettingsIcon } from "../Icons";

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

const getDefaultLinks = () => [
  { label: "Home", href: "#", icon: <HomeIcon />, active: true },
  { label: "Explore", href: "#", icon: <ExploreIcon /> },
  { label: "Settings", href: "#", icon: <SettingsIcon /> },
];

const getSecondaryLinks = () => [
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
          links={getDefaultLinks()}
          onSearch={(query) => setSearch(query)}
        />
        <div className="min-h-[150vh] pt-20 px-6">
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
          links={getDefaultLinks()}
          onSearch={(query) => setSearch(query)}
          showLanguageChanger
          languageChanger={<LanguageChanger size="sm" iconOnly />}
        />
        <div className="min-h-[150vh] pt-20 px-6">
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
          links={getDefaultLinks()}
          onSearch={(query) => setSearch(query)}
          showThemeChanger
          themeChanger={<ThemeChanger size="sm" iconOnly />}
        />
        <div className="min-h-[150vh] pt-20 px-6">
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
          links={getDefaultLinks()}
          onSearch={(query) => setSearch(query)}
          showLanguageChanger
          languageChanger={<LanguageChanger size="sm" iconOnly />}
          showThemeChanger
          themeChanger={<ThemeChanger size="sm" iconOnly />}
        />
        <div className="min-h-[150vh] pt-20 px-6">
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
          links={getDefaultLinks()}
          secondaryLinks={getSecondaryLinks()}
          showSecondaryNav
          onSearch={(query) => setSearch(query)}
        />
        <div className="min-h-[150vh] pt-20 px-6">
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
          links={getDefaultLinks()}
          onSearch={(query) => setSearch(query)}
        />
        <div className="min-h-[150vh] pt-20 px-6">
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
          links={getDefaultLinks()}
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
        <div className="min-h-[150vh] pt-20 px-6">
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

    useEffect(() => {
      const prevDir = document.documentElement.dir;
      const prevLang = document.documentElement.lang;

      document.documentElement.dir = "rtl";
      document.documentElement.lang = "fa";

      return () => {
        document.documentElement.dir = prevDir || "ltr";
        document.documentElement.lang = prevLang || "en";
      };
    }, []);

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
        <div className="min-h-[150vh] pt-20 px-6">
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
};
