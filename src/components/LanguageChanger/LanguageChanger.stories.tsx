import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LanguageChanger, I18nProvider, useI18n } from "./LanguageChanger";

const meta = {
  title: "Components/LanguageChanger",
  component: LanguageChanger,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
    iconOnly: {
      control: "boolean",
      description: "Show only the icon in a fixed circle",
    },
    fixedWidth: {
      control: "text",
      description: "Fixed width for the trigger button",
    },
  },
  args: {
    size: "md",
    iconOnly: false,
  },
} satisfies Meta<typeof LanguageChanger>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample translations for demo
const sampleTranslations = {
  en: {
    welcome: {
      title: "Welcome to Dara UI",
      subtitle: "A design system for the future",
    },
    greeting: "Hello {{name}}!",
    theme: "Theme",
    language: "Language",
  },
  fa: {
    welcome: {
      title: "به دارا UI خوش آمدید",
      subtitle: "یک سیستم طراحی برای آینده",
    },
    greeting: "سلام {{name}}!",
    theme: "تم",
    language: "زبان",
  },
  fr: {
    welcome: {
      title: "Bienvenue sur Dara UI",
      subtitle: "Un système de design pour le futur",
    },
    greeting: "Bonjour {{name}}!",
    theme: "Thème",
    language: "Langue",
  },
  de: {
    welcome: {
      title: "Willkommen bei Dara UI",
      subtitle: "Ein Designsystem für die Zukunft",
    },
    greeting: "Hallo {{name}}!",
    theme: "Thema",
    language: "Sprache",
  },
};

/**
 * Default LanguageChanger with full label + icon + chevron
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Current language is applied via lang and dir attributes
      </p>
      <LanguageChanger {...args} />
    </div>
  ),
};

/**
 * Icon-only mode - perfect for navigation bars
 */
export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Icon-only mode - fixed size circle with only the icon
      </p>
      <div className="flex items-center gap-4">
        <LanguageChanger iconOnly size="sm" />
        <LanguageChanger iconOnly size="md" />
        <LanguageChanger iconOnly size="lg" />
      </div>
    </div>
  ),
};

/**
 * Fixed width ensures the dropdown stays consistent
 */
export const FixedWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Fixed width keeps the dropdown consistent regardless of selected label
      </p>
      <div className="flex items-center gap-4">
        <LanguageChanger fixedWidth="120px" size="sm" />
        <LanguageChanger fixedWidth="160px" size="md" />
        <LanguageChanger fixedWidth="200px" size="lg" />
      </div>
    </div>
  ),
};

/**
 * Different size variants
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <div className="flex items-center gap-4">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
          sm
        </span>
        <LanguageChanger size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
          md
        </span>
        <LanguageChanger size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
          lg
        </span>
        <LanguageChanger size="lg" />
      </div>
    </div>
  ),
};

/**
 * Custom languages with custom icons
 */
export const CustomLanguages: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Custom language list with custom icons
      </p>
      <LanguageChanger
        availableLanguages={[
          { value: "en", label: "English", icon: "🇬🇧", dir: "ltr" },
          { value: "fa", label: "فارسی", icon: "🇮🇷", dir: "rtl" },
          { value: "fr", label: "Français", icon: "🇫🇷", dir: "ltr" },
        ]}
      />
    </div>
  ),
};

/**
 * With I18nProvider - shows translation in action
 */
export const WithTranslations: Story = {
  render: () => {
    const DemoContent = () => {
      const { t, language, setLanguage } = useI18n();

      return (
        <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)] w-96">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
              Current language:
            </span>
            <span className="text-xs text-[var(--color-primary)] font-bold">
              {language}
            </span>
          </div>

          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)]">
              {t("welcome.title")}
            </h2>
            <p className="text-[var(--color-text-secondary)] text-sm">
              {t("welcome.subtitle")}
            </p>
            <p className="text-[var(--color-text-secondary)] text-sm mt-2">
              {t("greeting", { name: "Developer" })}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            {["en", "fa", "fr", "de"].map((lang) => (
              <button
                key={lang}
                className={`px-3 py-1 text-xs rounded-[var(--radius-md)] transition-colors ${
                  language === lang
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
                }`}
                onClick={() => setLanguage(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <LanguageChanger />
        </div>
      );
    };

    return (
      <I18nProvider translations={sampleTranslations} defaultLanguage="en">
        <DemoContent />
      </I18nProvider>
    );
  },
};

/**
 * Controlled mode
 */
export const Controlled: Story = {
  render: () => {
    const [lang, setLang] = React.useState("en");

    return (
      <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
          Controlled mode:{" "}
          <span className="text-[var(--color-primary)] font-bold">{lang}</span>
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            onClick={() => setLang("en")}
          >
            Set English
          </button>
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            onClick={() => setLang("fa")}
          >
            Set فارسی
          </button>
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            onClick={() => setLang("fr")}
          >
            Set Français
          </button>
        </div>
        <LanguageChanger value={lang} onChange={setLang} />
      </div>
    );
  },
};

/**
 * Icon-only with consistent sizing for navbar use
 */
export const IconOnlyNavbar: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Perfect for compact navigation bars
      </p>
      <div className="flex items-center gap-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]">
        <span className="text-sm font-heading font-bold text-[var(--color-text-primary)]">
          Logo
        </span>
        <LanguageChanger iconOnly size="sm" />
        <LanguageChanger iconOnly size="md" />
        <LanguageChanger iconOnly size="lg" />
      </div>
    </div>
  ),
};
