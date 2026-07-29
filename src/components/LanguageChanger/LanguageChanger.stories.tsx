import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LanguageChanger } from "./LanguageChanger";

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
      description: "Size of the language changer",
    },
    variant: {
      control: "select",
      options: ["dropdown", "toggle"],
      description: "Dropdown or cycling toggle pill",
    },
  },
  args: {
    size: "sm",
    defaultValue: "en",
    variant: "dropdown",
  },
} satisfies Meta<typeof LanguageChanger>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default (Dropdown) -----
export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Current language:{" "}
        <span className="text-[var(--color-primary)]" id="langDisplay">
          en
        </span>
      </p>
      <LanguageChanger
        {...args}
        onChange={(lang) => {
          const el = document.getElementById("langDisplay");
          if (el) el.textContent = lang;
        }}
      />
    </div>
  ),
};

// ----- Toggle variant -----
export const Toggle: Story = {
  args: {
    variant: "toggle",
    size: "md",
  },
  render: (args) => (
    <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Toggle cycles languages on click
      </p>
      <LanguageChanger {...args} />
    </div>
  ),
};

// ----- Sizes -----
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
      <div className="flex flex-col gap-3">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
          Dropdown
        </span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
            sm
          </span>
          <LanguageChanger size="sm" defaultValue="en" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
            md
          </span>
          <LanguageChanger size="md" defaultValue="en" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
            lg
          </span>
          <LanguageChanger size="lg" defaultValue="en" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
          Toggle
        </span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
            sm
          </span>
          <LanguageChanger variant="toggle" size="sm" defaultValue="en" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
            md
          </span>
          <LanguageChanger variant="toggle" size="md" defaultValue="en" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--color-text-tertiary)] font-mono w-12">
            lg
          </span>
          <LanguageChanger variant="toggle" size="lg" defaultValue="en" />
        </div>
      </div>
    </div>
  ),
};

// ----- Controlled -----
export const Controlled: Story = {
  render: () => {
    const [lang, setLang] = React.useState("en");

    return (
      <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
          Controlled language:{" "}
          <span className="text-[var(--color-primary)] font-bold">{lang}</span>
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            onClick={() => setLang("en")}
          >
            English
          </button>
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            onClick={() => setLang("fa")}
          >
            فارسی
          </button>
          <button
            className="px-3 py-1 text-xs rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            onClick={() => setLang("ar")}
          >
            العربية
          </button>
        </div>
        <LanguageChanger value={lang} onChange={setLang} />
      </div>
    );
  },
};

// ----- In Glass Card -----
export const InGlassCard: Story = {
  render: () => (
    <div className="glass p-6 flex flex-col gap-4 items-center">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Language Changer in Glass Card
      </p>
      <div className="flex gap-3">
        <LanguageChanger defaultValue="en" size="md" />
        <LanguageChanger variant="toggle" defaultValue="fa" size="md" />
      </div>
    </div>
  ),
};

// ----- RTL Example -----
export const RTLExample: Story = {
  render: () => {
    const [lang, setLang] = React.useState("fa");

    return (
      <div className="flex flex-col gap-4 items-center p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-standard)]">
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
          RTL example (Persian)
        </p>
        <div className="glass p-4 w-64 text-center">
          <p className="lang-fa text-sm" dir="rtl">
            این متن به زبان فارسی است
          </p>
        </div>
        <LanguageChanger value={lang} onChange={setLang} size="md" />
      </div>
    );
  },
};
