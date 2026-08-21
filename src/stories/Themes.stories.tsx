import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "../components/Card/Card";
import { Button } from "../components/Button/Button";
import { Badge } from "../components/Badge/Badge";

const meta = {
  title: "Themes",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Theme Demo Component
 */
const ThemePreview = ({ theme, label }: { theme: string; label: string }) => {
  // Temporarily apply theme for the preview
  const originalTheme = document.documentElement.getAttribute("data-theme");

  // Apply theme for this specific container
  const containerStyle = {
    padding: "20px",
    borderRadius: "var(--radius-standard)",
    backgroundColor: "var(--color-bg-primary)",
    color: "var(--color-text-primary)",
    border: "1px solid var(--color-border-primary)",
  };

  return (
    <div data-theme={theme} style={{ display: "inline-block" }}>
      <div style={containerStyle}>
        <h3
          className="font-heading text-lg font-bold mb-3"
          style={{ color: "var(--color-text-primary)" }}
        >
          {label}
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="sm">
            Primary
          </Button>
          <Button variant="secondary" size="sm">
            Secondary
          </Button>
          <Button variant="accent" size="sm">
            Accent
          </Button>
          <Badge variant="primary" size="sm">
            Badge
          </Badge>
        </div>
        <div
          className="mt-3 text-xs font-mono"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          data-theme="{theme}"
        </div>
      </div>
    </div>
  );
};

export const ThemesOverview: Story = {
  render: () => {
    // Save current theme
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "nightfall";

    return (
      <div className="max-w-4xl w-full">
        <h1 className="font-heading text-3xl font-bold text-gradient-primary mb-6">
          Dara UI Themes
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          Each theme modifies the CSS variables to create a distinct visual
          experience while maintaining the same component behavior and
          interaction patterns.
        </p>

        {/* Theme Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border-primary)]">
            <thead>
              <tr className="bg-[var(--color-primary-light)]">
                <th className="px-4 py-3 text-left font-heading font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border-primary)]">
                  Theme
                </th>
                <th className="px-4 py-3 text-left font-heading font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border-primary)]">
                  Attribute
                </th>
                <th className="px-4 py-3 text-left font-heading font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border-primary)]">
                  Feel
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-[var(--color-bg-elevated)]/30 transition-colors">
                <td className="px-4 py-3 border-b border-[var(--color-border-secondary)] font-mono text-[var(--color-primary)]">
                  Nightfall
                </td>
                <td className="px-4 py-3 border-b border-[var(--color-border-secondary)] font-mono text-[var(--color-text-secondary)]">
                  data-theme="nightfall"
                </td>
                <td className="px-4 py-3 border-b border-[var(--color-border-secondary)] text-[var(--color-text-secondary)]">
                  Default dark archive - deep navy, purple primary
                </td>
              </tr>
              <tr className="hover:bg-[var(--color-bg-elevated)]/30 transition-colors">
                <td className="px-4 py-3 border-b border-[var(--color-border-secondary)] font-mono text-[var(--color-warning)]">
                  Daylight
                </td>
                <td className="px-4 py-3 border-b border-[var(--color-border-secondary)] font-mono text-[var(--color-text-secondary)]">
                  data-theme="daylight"
                </td>
                <td className="px-4 py-3 border-b border-[var(--color-border-secondary)] text-[var(--color-text-secondary)]">
                  Light surfaces, same accent language
                </td>
              </tr>
              <tr className="hover:bg-[var(--color-bg-elevated)]/30 transition-colors">
                <td className="px-4 py-3 font-mono text-[var(--color-accent)]">
                  Dracula
                </td>
                <td className="px-4 py-3 font-mono text-[var(--color-text-secondary)]">
                  data-theme="dracula"
                </td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  High-contrast purple / gothic
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Live Previews */}
        <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-4">
          Live Previews
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm mb-6">
          Each preview below is isolated with its own theme context.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ThemePreview theme="nightfall" label="🌙 Nightfall" />
          <ThemePreview theme="daylight" label="☀️ Daylight" />
          <ThemePreview theme="dracula" label="🧛 Dracula" />
        </div>

        <div className="mt-6 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
          <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
            💡 Each preview is isolated using the data-theme attribute on its
            container. The themes shown here are independent of the global
            theme.
          </p>
        </div>
      </div>
    );
  },
};
