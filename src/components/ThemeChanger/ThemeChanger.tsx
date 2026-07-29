import React from "react";
import { Dropdown } from "../Dropdown/Dropdown";
import type { DropdownOption } from "../Dropdown/Dropdown";

export interface ThemeOption {
  /**
   * Value written to data-theme (or passed to applyTheme)
   * e.g. "nightfall" | "daylight" | "bloody-moon" | your custom id
   */
  value: string;
  /**
   * Label shown in the dropdown
   */
  label: string;
  /**
   * Optional icon
   */
  icon?: React.ReactNode;
  /**
   * Disable this option
   */
  disabled?: boolean;
}

export interface ThemeChangerProps {
  /**
   * Controlled theme value
   */
  value?: string;
  /**
   * Default theme (uncontrolled)
   * @default first item in themes, or "nightfall"
   */
  defaultValue?: string;
  /**
   * Fired when theme changes
   */
  onChange?: (theme: string) => void;
  /**
   * Themes the user is allowed to pick.
   * Pass only the ones you want — nothing is forced.
   * If omitted, uses the 3 built-in Dara themes.
   */
  themes?: ThemeOption[];
  /**
   * Custom applier. Default writes data-theme on <html>.
   * Use this if you drive themes via className, CSS vars, etc.
   *
   * @example
   * applyTheme={(id) => {
   *   document.documentElement.className = id;
   * }}
   */
  applyTheme?: (theme: string) => void;
  /**
   * Compact size for navbar use
   * @default "sm"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Stretch to 100% of parent
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Extra class on the Dropdown root
   */
  className?: string;
}

// ── Built-in icons ──
const MoonIcon = () => (
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
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const SunIcon = () => (
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
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const BloodMoonIcon = () => (
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
      d="M12 3c.132 0 .263.002.394.007A9 9 0 0020.993 11.606 9 9 0 1112 3z"
    />
    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

/**
 * Built-in Dara themes (from tokens.css).
 * Import and pick what you need, or ignore and pass your own list.
 */
export const DARA_THEMES: ThemeOption[] = [
  { value: "nightfall", label: "Nightfall", icon: <MoonIcon /> },
  { value: "daylight", label: "Daylight", icon: <SunIcon /> },
  { value: "bloody-moon", label: "Bloody Moon", icon: <BloodMoonIcon /> },
];

// Default: write data-theme on <html>
const defaultApplyTheme = (theme: string) => {
  document.documentElement.setAttribute("data-theme", theme);
};

/**
 * ThemeChanger — compact Dropdown theme switcher
 *
 * - Pass `themes` to control which options appear
 * - value / onChange for controlled mode
 * - applyTheme override if you do not use data-theme
 * - Reuses Dropdown fixed widths (no text-length resize)
 */
export const ThemeChanger: React.FC<ThemeChangerProps> = ({
  value,
  defaultValue,
  onChange,
  themes = DARA_THEMES,
  applyTheme = defaultApplyTheme,
  size = "sm",
  fullWidth = false,
  className = "",
}) => {
  const resolvedDefault = defaultValue ?? themes[0]?.value ?? "nightfall";

  const [internalTheme, setInternalTheme] = React.useState(resolvedDefault);
  const isControlled = value !== undefined;
  const currentTheme = isControlled ? value : internalTheme;

  // Apply on mount + whenever current theme changes
  React.useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  const handleChange = (themeValue: string) => {
    if (!isControlled) {
      setInternalTheme(themeValue);
    }
    applyTheme(themeValue);
    onChange?.(themeValue);
  };

  // Map to DropdownOption shape
  const options: DropdownOption[] = themes.map((t) => ({
    value: t.value,
    label: t.label,
    icon: t.icon,
    disabled: t.disabled,
  }));

  return (
    <Dropdown
      options={options}
      value={currentTheme}
      onChange={handleChange}
      placeholder="Theme"
      size={size}
      fullWidth={fullWidth}
      className={className}
    />
  );
};

ThemeChanger.displayName = "ThemeChanger";
export default ThemeChanger;
