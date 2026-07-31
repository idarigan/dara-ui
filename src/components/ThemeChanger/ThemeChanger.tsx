import React, { useState, useRef, useEffect } from "react";

export interface ThemeOption {
  /**
   * Theme value (used as data-theme attribute)
   */
  value: string;
  /**
   * Display label
   */
  label: string;
  /**
   * Optional icon (emoji or React node)
   */
  icon?: React.ReactNode;
}

export interface ThemeChangerProps {
  /**
   * Controlled value
   */
  value?: string;
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Callback when theme changes
   */
  onChange?: (theme: string) => void;
  /**
   * Available themes (overrides auto-detect)
   */
  availableThemes?: ThemeOption[];
  /**
   * Whether to auto-detect themes from CSS
   * @default true
   */
  autoDetect?: boolean;
  /**
   * Component size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * If true, shows only the icon in a fixed-size circular button
   * @default false
   */
  iconOnly?: boolean;
  /**
   * Fixed width for the dropdown trigger (in px or rem)
   * When set, the trigger maintains consistent width
   * @example "140px" or "10rem"
   */
  fixedWidth?: string;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Default Dara UI themes
 */
const DEFAULT_THEMES: ThemeOption[] = [
  { value: "nightfall", label: "Nightfall", icon: "🌙" },
  { value: "daylight", label: "Daylight", icon: "☀️" },
  { value: "bloody-moon", label: "Bloody Moon", icon: "🌕" },
];

/**
 * Dara UI ThemeChanger - Dropdown for switching between themes
 *
 * Features:
 * - Auto-detects available themes from CSS [data-theme] attributes
 * - Supports custom theme lists
 * - Clean dropdown with icon support
 * - Icon-only mode for compact navigation bars
 * - Fixed width option for consistent sizing
 * - Controlled or uncontrolled modes
 * - Applies theme via data-theme attribute on html element
 * - Size variants (sm, md, lg)
 * - Dropdown is always centered under the trigger
 * - Menu width matches the button when iconOnly or fixedWidth is used
 */
export const ThemeChanger: React.FC<ThemeChangerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  availableThemes,
  autoDetect = true,
  size = "md",
  iconOnly = false,
  fixedWidth,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [themes, setThemes] = useState<ThemeOption[]>(DEFAULT_THEMES);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine if controlled or uncontrolled
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue || DEFAULT_THEMES[0]?.value || "nightfall",
  );

  const currentTheme = isControlled ? controlledValue : internalValue;

  // Auto-detect themes from DOM
  useEffect(() => {
    if (!autoDetect && availableThemes) {
      setThemes(availableThemes);
      return;
    }

    if (availableThemes) {
      setThemes(availableThemes);
      return;
    }

    // Try to detect themes from CSS
    const detectedThemes: ThemeOption[] = [];
    const styleSheets = document.styleSheets;

    try {
      for (const sheet of styleSheets) {
        try {
          const rules = sheet.cssRules || sheet.rules;
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule) {
              const match = rule.selectorText?.match(
                /\[data-theme="([^"]+)"\]/,
              );
              if (match && match[1]) {
                const themeValue = match[1];
                // Generate a nice label from the value
                const label = themeValue
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
                if (!detectedThemes.some((t) => t.value === themeValue)) {
                  detectedThemes.push({
                    value: themeValue,
                    label: label,
                    icon: getDefaultIcon(themeValue),
                  });
                }
              }
            }
          }
        } catch {
          // Cross-origin stylesheets may throw errors, skip them
          continue;
        }
      }
    } catch {
      // If detection fails, fall back to default themes
    }

    if (detectedThemes.length > 0) {
      setThemes(detectedThemes);
      // Update internal value if current theme not in detected list
      if (!detectedThemes.some((t) => t.value === currentTheme)) {
        const newValue = detectedThemes[0]?.value || "nightfall";
        if (!isControlled) {
          setInternalValue(newValue);
        }
        applyTheme(newValue);
      }
    } else if (availableThemes) {
      setThemes(availableThemes);
    }
  }, [autoDetect, availableThemes]);

  // Apply theme to document
  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  // Apply on mount and when theme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle theme selection
  const handleSelect = (themeValue: string) => {
    if (!isControlled) {
      setInternalValue(themeValue);
    }
    applyTheme(themeValue);
    onChange?.(themeValue);
    setIsOpen(false);
  };

  // Get default icon for theme
  const getDefaultIcon = (value: string): string => {
    const iconMap: Record<string, string> = {
      nightfall: "🌙",
      daylight: "☀️",
      "bloody-moon": "🌕",
      dark: "🌙",
      light: "☀️",
      dracula: "🧛",
      wine: "🍷",
      gothic: "🖤",
      cyber: "💜",
    };
    return iconMap[value] || "🎨";
  };

  // Size styles
  const sizeStyles = {
    sm: {
      trigger: "px-3 py-1.5 text-xs",
      option: "px-3 py-1.5 text-xs",
      icon: "h-3 w-3",
      iconOnlySize: "w-8 h-8",
      chevronSize: "h-3 w-3",
      // matching width for icon-only menu
      iconOnlyWidth: "32px",
    },
    md: {
      trigger: "px-4 py-2 text-sm",
      option: "px-4 py-2 text-sm",
      icon: "h-4 w-4",
      iconOnlySize: "w-10 h-10",
      chevronSize: "h-4 w-4",
      iconOnlyWidth: "40px",
    },
    lg: {
      trigger: "px-5 py-2.5 text-base",
      option: "px-5 py-2.5 text-base",
      icon: "h-5 w-5",
      iconOnlySize: "w-12 h-12",
      chevronSize: "h-5 w-5",
      iconOnlyWidth: "48px",
    },
  };

  // Find current theme option
  const currentOption = themes.find((t) => t.value === currentTheme);

  // Determine menu width
  // - iconOnly → exact same size as the circular button
  // - fixedWidth → exact same width as the trigger
  // - otherwise → sensible min width
  const menuWidth = iconOnly
    ? sizeStyles[size].iconOnlyWidth
    : fixedWidth || "140px";

  // Icon-only mode - fixed size circle with only the icon
  if (iconOnly) {
    return (
      <div ref={dropdownRef} className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center justify-center
            bg-[var(--color-bg-tertiary)]
            text-[var(--color-text-primary)]
            border border-[var(--color-border-primary)]
            rounded-full
            hover:bg-[var(--color-bg-elevated)]
            hover:border-[var(--color-border-secondary)]
            transition-all duration-180
            active:scale-95
            ${sizeStyles[size].iconOnlySize}
          `}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          title={currentOption?.label || "Theme"}
        >
          {currentOption?.icon && (
            <span className="text-base">{currentOption.icon}</span>
          )}
        </button>

        {/* Dropdown Menu - perfectly centered under the icon button + same width */}
        <div
          className={`
            absolute z-50 mt-1.5
            left-0 right-0
            glass
            rounded-[var(--radius-md)]
            py-1
            shadow-[var(--shadow-float)]
            transition-all duration-[var(--transition-fast)] ease-[var(--ease-in-out)]
            overflow-hidden
            ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
          `}
          style={{
            width: menuWidth,
            minWidth: menuWidth,
          }}
          role="listbox"
        >
          {themes.map((theme) => {
            const isActive = theme.value === currentTheme;
            return (
              <button
                key={theme.value}
                type="button"
                onClick={() => handleSelect(theme.value)}
                className={`
                  w-full flex items-center justify-center gap-2
                  ${sizeStyles[size].option}
                  ${
                    isActive
                      ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                      : "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/50"
                  }
                  transition-colors duration-150
                `}
                role="option"
                aria-selected={isActive}
                title={theme.label}
              >
                {theme.icon && (
                  <span className="flex-shrink-0 text-base">{theme.icon}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Full dropdown mode with label + icon + chevron
  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center
          bg-[var(--color-bg-tertiary)]
          text-[var(--color-text-primary)]
          border border-[var(--color-border-primary)]
          rounded-full
          hover:bg-[var(--color-bg-elevated)]
          hover:border-[var(--color-border-secondary)]
          transition-all duration-180
          active:scale-95
          ${sizeStyles[size].trigger}
        `}
        style={{
          width: fixedWidth || "auto",
          minWidth: fixedWidth || "auto",
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Left side: icon + label */}
        <span className="flex items-center gap-2 flex-1 min-w-0">
          {currentOption?.icon && (
            <span className="flex-shrink-0 text-base">
              {currentOption.icon}
            </span>
          )}
          <span className="font-mono tracking-wide truncate">
            {currentOption?.label || "Theme"}
          </span>
        </span>

        {/* Right side: chevron */}
        <svg
          className={`
            flex-shrink-0 ml-2
            transition-transform duration-[var(--transition-med)] ease-[var(--ease-in-out)]
            ${isOpen ? "rotate-180" : "rotate-0"}
            ${sizeStyles[size].chevronSize}
          `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu - perfectly centered under the button + matching width when fixedWidth is set */}
      <div
        className={`
          absolute z-50 mt-1.5
          left-1/2 -translate-x-1/2
          glass
          rounded-[var(--radius-md)]
          py-1
          shadow-[var(--shadow-float)]
          transition-all duration-[var(--transition-fast)] ease-[var(--ease-in-out)]
          overflow-hidden
          ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
        `}
        style={{
          width: menuWidth,
          minWidth: menuWidth,
        }}
        role="listbox"
      >
        {themes.map((theme) => {
          const isActive = theme.value === currentTheme;
          return (
            <button
              key={theme.value}
              type="button"
              onClick={() => handleSelect(theme.value)}
              className={`
                w-full flex items-center gap-2 text-left
                ${sizeStyles[size].option}
                ${
                  isActive
                    ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/50"
                }
                transition-colors duration-150
              `}
              role="option"
              aria-selected={isActive}
            >
              {theme.icon && (
                <span className="flex-shrink-0 text-base">{theme.icon}</span>
              )}
              <span className="truncate">{theme.label}</span>
              {isActive && (
                <svg
                  className="ml-auto h-4 w-4 flex-shrink-0 text-[var(--color-primary)]"
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
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

ThemeChanger.displayName = "ThemeChanger";
export default ThemeChanger;
