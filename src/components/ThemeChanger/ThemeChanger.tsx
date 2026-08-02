// src/components/ThemeChanger/ThemeChanger.tsx

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";

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
  /**
   * Whether to use the Theme context
   * @default true
   */
  useContext?: boolean;
}

/**
 * Default Dara UI themes
 */
const DEFAULT_THEMES: ThemeOption[] = [
  { value: "nightfall", label: "Nightfall", icon: "🌙" },
  { value: "daylight", label: "Daylight", icon: "☀️" },
  { value: "bloody-moon", label: "Bloody Moon", icon: "🌕" },
];

// ============================================
// Theme Context & Provider
// ============================================

export interface ThemeContextValue {
  /**
   * Current theme value
   */
  theme: string;
  /**
   * Set the current theme
   */
  setTheme: (theme: string) => void;
  /**
   * Available themes
   */
  themes: ThemeOption[];
}

export interface ThemeProviderProps {
  /**
   * Initial theme
   */
  defaultTheme?: string;
  /**
   * Available themes (overrides default)
   */
  themes?: ThemeOption[];
  /**
   * Whether to auto-detect themes from CSS
   * @default true
   */
  autoDetect?: boolean;
  /**
   * Children
   */
  children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Get default icon for theme
 */
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

/**
 * ThemeProvider - Provides theme context to children
 *
 * Features:
 * - Self-contained theme system
 * - Auto-detects themes from CSS
 * - Theme persistence in localStorage
 * - Auto-updates data-theme attribute on html
 * - Triggers re-render of all consuming components on theme change
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  defaultTheme,
  themes: customThemes,
  autoDetect = true,
  children,
}) => {
  const STORAGE_KEY = "dara-ui-theme";

  // Get initial theme from localStorage or default
  const getInitialTheme = (): string => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
    return defaultTheme || DEFAULT_THEMES[0]?.value || "nightfall";
  };

  const [availableThemes, setAvailableThemes] =
    useState<ThemeOption[]>(DEFAULT_THEMES);
  const [theme, setThemeState] = useState<string>(getInitialTheme);

  // Auto-detect themes from DOM
  useEffect(() => {
    if (!autoDetect && customThemes) {
      setAvailableThemes(customThemes);
      return;
    }

    if (customThemes) {
      setAvailableThemes(customThemes);
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
      setAvailableThemes(detectedThemes);
      // Update theme if current theme not in detected list
      if (!detectedThemes.some((t) => t.value === theme)) {
        const newTheme = detectedThemes[0]?.value || "nightfall";
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    } else if (customThemes) {
      setAvailableThemes(customThemes);
    }
  }, [autoDetect, customThemes]);

  // Apply theme to document
  const applyTheme = useCallback((themeValue: string) => {
    document.documentElement.setAttribute("data-theme", themeValue);
  }, []);

  // Apply on mount and when theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Set theme and apply to document
  const setTheme = useCallback(
    (themeValue: string) => {
      const themeOption = availableThemes.find((t) => t.value === themeValue);
      if (!themeOption) return;

      setThemeState(themeValue);
      applyTheme(themeValue);
      localStorage.setItem(STORAGE_KEY, themeValue);

      // Dispatch event for other components
      window.dispatchEvent(
        new CustomEvent("dara-theme-change", { detail: { theme: themeValue } }),
      );
    },
    [availableThemes, applyTheme],
  );

  // Apply initial theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    const themeOption = availableThemes.find((t) => t.value === initialTheme);
    if (themeOption) {
      applyTheme(initialTheme);
    }
  }, [availableThemes, applyTheme]);

  // Listen for theme changes from other components (e.g., ThemeChanger)
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      const { theme: newTheme } = event.detail;
      if (newTheme && newTheme !== theme) {
        setThemeState(newTheme);
      }
    };

    window.addEventListener(
      "dara-theme-change",
      handleThemeChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "dara-theme-change",
        handleThemeChange as EventListener,
      );
    };
  }, [theme]);

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      setTheme,
      themes: availableThemes,
    }),
    [theme, setTheme, availableThemes],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * useTheme - Hook for accessing theme context
 *
 * @example
 * ```tsx
 * const { theme, setTheme, themes } = useTheme();
 *
 * // Change theme
 * <button onClick={() => setTheme('daylight')}>Switch to Daylight</button>
 * ```
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ============================================
// ThemeChanger Component
// ============================================

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
 * - All ThemeChanger instances sync through Theme context
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
  useContext: useThemeContext = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [themes, setThemes] = useState<ThemeOption[]>(DEFAULT_THEMES);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const STORAGE_KEY = "dara-ui-theme";

  // Try to get context if available
  let contextValue: ThemeContextValue | null = null;
  let isInContext = false;

  try {
    const ctx = useTheme();
    contextValue = ctx;
    isInContext = useThemeContext && true;
  } catch {
    isInContext = false;
    contextValue = null;
  }

  // Determine if controlled or uncontrolled
  const isControlled = controlledValue !== undefined;

  // For internal state - only used when not in context or controlled
  const [internalValue, setInternalValue] = useState<string>(() => {
    // Try to load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
    return defaultValue || DEFAULT_THEMES[0]?.value || "nightfall";
  });

  // Current theme: priority: controlled > context > internal
  let currentTheme: string;
  if (isControlled) {
    currentTheme = controlledValue;
  } else if (isInContext && contextValue) {
    currentTheme = contextValue.theme;
  } else {
    currentTheme = internalValue;
  }

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
        if (!isControlled && !isInContext) {
          setInternalValue(newValue);
        }
        applyTheme(newValue);
      }
    } else if (availableThemes) {
      setThemes(availableThemes);
    }
  }, [autoDetect, availableThemes]);

  // Apply theme to document
  const applyTheme = useCallback((themeValue: string) => {
    document.documentElement.setAttribute("data-theme", themeValue);
  }, []);

  // Apply on mount and when theme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

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
  const handleSelect = useCallback(
    (themeValue: string) => {
      // If we're in context, use context's setTheme
      if (isInContext && contextValue) {
        contextValue.setTheme(themeValue);
      } else if (!isControlled) {
        setInternalValue(themeValue);
      }

      applyTheme(themeValue);
      onChange?.(themeValue);
      setIsOpen(false);

      // Dispatch event for other components
      window.dispatchEvent(
        new CustomEvent("dara-theme-change", { detail: { theme: themeValue } }),
      );
    },
    [isInContext, contextValue, isControlled, onChange, applyTheme],
  );

  // Size styles
  const sizeStyles = {
    sm: {
      trigger: "px-3 py-1.5 text-xs",
      option: "px-3 py-1.5 text-xs",
      icon: "h-3 w-3",
      iconOnlySize: "w-8 h-8",
      chevronSize: "h-3 w-3",
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
