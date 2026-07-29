import React from "react";
import { Dropdown } from "../Dropdown/Dropdown";

export interface ThemeChangerProps {
  /**
   * Controlled theme value
   */
  value?: string;
  /**
   * Default theme (uncontrolled)
   * @default "nightfall"
   */
  defaultValue?: string;
  /**
   * Fired when theme changes
   */
  onChange?: (theme: string) => void;
  /**
   * Available themes — user wires their own list
   */
  themes?: Array<{ value: string; label: string; icon?: React.ReactNode }>;
  /**
   * Compact size for navbar use
   * @default "sm"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Extra class on the Dropdown root
   */
  className?: string;
}

// ── Icons ──
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

// Built-in list (3 themes from tokens.css)
const defaultThemes = [
  { value: "nightfall", label: "Nightfall", icon: <MoonIcon /> },
  { value: "daylight", label: "Daylight", icon: <SunIcon /> },
  { value: "bloody-moon", label: "Bloody Moon", icon: <BloodMoonIcon /> },
];

/**
 * ThemeChanger — compact Dropdown theme switcher
 *
 * - Uses Dropdown at button size
 * - Sets data-theme on <html>
 * - Controlled + uncontrolled
 * - Pass your own themes array or use the 3 built-ins
 */
export const ThemeChanger: React.FC<ThemeChangerProps> = ({
  value,
  defaultValue = "nightfall",
  onChange,
  themes = defaultThemes,
  size = "sm",
  className = "",
}) => {
  const [internalTheme, setInternalTheme] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentTheme = isControlled ? value : internalTheme;

  // Apply theme to document
  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  // Apply on mount + when controlled value flips
  React.useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const handleChange = (themeValue: string) => {
    if (!isControlled) {
      setInternalTheme(themeValue);
    }
    applyTheme(themeValue);
    onChange?.(themeValue);
  };

  return (
    <Dropdown
      options={themes}
      value={currentTheme}
      onChange={handleChange}
      placeholder="Theme"
      size={size}
      className={`min-w-[120px] ${className}`}
    />
  );
};

ThemeChanger.displayName = "ThemeChanger";
export default ThemeChanger;
