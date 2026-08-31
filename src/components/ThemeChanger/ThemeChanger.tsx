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
   * Optional icon (React node or SVG)
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
  /**
   * Open the dropdown upward (useful inside mobile drawers / bottom of screen)
   * @default false
   */
  openUpward?: boolean;
}

/**
 * SVG Theme Icons
 */
const MoonIcon = () => (
  <svg
    className="flex-shrink-0"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg
    className="flex-shrink-0"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const DraculaIcon = () => (
  <svg
    className="flex-shrink-0"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const GothicIcon = () => (
  <svg
    className="flex-shrink-0"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

/**
 * Default Dara UI themes with SVG icons
 */
const DEFAULT_THEMES: ThemeOption[] = [
  { value: "nightfall", label: "Nightfall", icon: <MoonIcon /> },
  { value: "daylight", label: "Daylight", icon: <SunIcon /> },
  { value: "bloody-moon", label: "Bloody Moon", icon: <GothicIcon /> },
];

// ============================================
// Theme Context & Provider
// ============================================

export interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
  themes: ThemeOption[];
}

export interface ThemeProviderProps {
  defaultTheme?: string;
  themes?: ThemeOption[];
  autoDetect?: boolean;
  children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getDefaultIcon = (value: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    nightfall: <MoonIcon />,
    daylight: <SunIcon />,
    dark: <MoonIcon />,
    light: <SunIcon />,
    dracula: <DraculaIcon />,
    wine: <GothicIcon />,
    gothic: <GothicIcon />,
    cyber: <MoonIcon />,
  };
  return iconMap[value] || <MoonIcon />;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  defaultTheme,
  themes: customThemes,
  autoDetect = true,
  children,
}) => {
  const STORAGE_KEY = "dara-ui-theme";

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

  useEffect(() => {
    if (!autoDetect && customThemes) {
      setAvailableThemes(customThemes);
      return;
    }

    if (customThemes) {
      setAvailableThemes(customThemes);
      return;
    }

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
      // fallback
    }

    if (detectedThemes.length > 0) {
      setAvailableThemes(detectedThemes);
      if (!detectedThemes.some((t) => t.value === theme)) {
        const newTheme = detectedThemes[0]?.value || "nightfall";
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    } else if (customThemes) {
      setAvailableThemes(customThemes);
    }
  }, [autoDetect, customThemes]);

  const applyTheme = useCallback((themeValue: string) => {
    document.documentElement.setAttribute("data-theme", themeValue);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = useCallback(
    (themeValue: string) => {
      const themeOption = availableThemes.find((t) => t.value === themeValue);
      if (!themeOption) return;

      setThemeState(themeValue);
      applyTheme(themeValue);
      localStorage.setItem(STORAGE_KEY, themeValue);

      window.dispatchEvent(
        new CustomEvent("dara-theme-change", { detail: { theme: themeValue } }),
      );
    },
    [availableThemes, applyTheme],
  );

  useEffect(() => {
    const initialTheme = getInitialTheme();
    const themeOption = availableThemes.find((t) => t.value === initialTheme);
    if (themeOption) {
      applyTheme(initialTheme);
    }
  }, [availableThemes, applyTheme]);

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
 * - Auto-detects available themes from CSS
 * - Supports custom theme lists
 * - Clean dropdown with SVG icon support
 * - Icon-only mode for compact navigation bars
 * - Fixed width option for consistent sizing
 * - Controlled or uncontrolled modes
 * - Persists theme preference in localStorage
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
  openUpward = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [themes, setThemes] = useState<ThemeOption[]>(DEFAULT_THEMES);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const STORAGE_KEY = "dara-ui-theme";

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

  const isControlled = controlledValue !== undefined;

  const [internalValue, setInternalValue] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
    return defaultValue || DEFAULT_THEMES[0]?.value || "nightfall";
  });

  let currentTheme: string;
  if (isControlled) {
    currentTheme = controlledValue;
  } else if (isInContext && contextValue) {
    currentTheme = contextValue.theme;
  } else {
    currentTheme = internalValue;
  }

  // Auto-detect themes
  useEffect(() => {
    if (!autoDetect && availableThemes) {
      setThemes(availableThemes);
      return;
    }

    if (availableThemes) {
      setThemes(availableThemes);
      return;
    }

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
      // fallback
    }

    if (detectedThemes.length > 0) {
      setThemes(detectedThemes);
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

  const applyTheme = useCallback((themeValue: string) => {
    document.documentElement.setAttribute("data-theme", themeValue);
  }, []);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  // Click outside to close
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

  const handleSelect = useCallback(
    (themeValue: string) => {
      if (isInContext && contextValue) {
        contextValue.setTheme(themeValue);
      } else if (!isControlled) {
        setInternalValue(themeValue);
      }

      applyTheme(themeValue);
      onChange?.(themeValue);
      setIsOpen(false);

      window.dispatchEvent(
        new CustomEvent("dara-theme-change", { detail: { theme: themeValue } }),
      );
    },
    [isInContext, contextValue, isControlled, onChange, applyTheme],
  );

  // Ensure themes have icons
  const displayThemes = useMemo(
    () =>
      themes.map((theme) => ({
        ...theme,
        icon: theme.icon || getDefaultIcon(theme.value),
      })),
    [themes],
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

  const currentOption = displayThemes.find((t) => t.value === currentTheme);
  const menuWidth = iconOnly
    ? sizeStyles[size].iconOnlyWidth
    : fixedWidth || "140px";

  // Render icon helper - ensures consistent sizing
  const renderIcon = (icon: React.ReactNode) => {
    if (React.isValidElement(icon)) {
      // Clone the element and add consistent sizing
      return React.cloneElement(icon, {
        className: `flex-shrink-0 ${
          size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"
        } ${icon.props.className || ""}`,
        width: size === "sm" ? "16" : size === "lg" ? "24" : "20",
        height: size === "sm" ? "16" : size === "lg" ? "24" : "20",
        viewBox: icon.props.viewBox || "0 0 24 24",
      });
    }
    return icon;
  };

  // Icon-only mode
  if (iconOnly) {
    return (
      <div ref={dropdownRef} className={`relative inline-flex ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            inline-flex items-center justify-center
            bg-[var(--color-bg-tertiary)]
            text-[var(--color-text-primary)]
            border border-[var(--color-border-primary)]
            rounded-full
            hover:bg-[var(--color-bg-elevated)]
            hover:border-[var(--color-border-secondary)]
            transition-all duration-180
            active:scale-95
            ${sizeStyles[size].trigger}
            flex-shrink-0
          `}
          style={{
            width: fixedWidth || sizeStyles[size].iconOnlyWidth,
            minWidth: fixedWidth || sizeStyles[size].iconOnlyWidth,
            height: fixedWidth || sizeStyles[size].iconOnlyWidth,
            minHeight: fixedWidth || sizeStyles[size].iconOnlyWidth,
          }}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`Current theme: ${currentOption?.label || "Theme"}`}
        >
          {currentOption?.icon && renderIcon(currentOption.icon)}
        </button>

        <div
          className={`
            absolute z-50
            left-1/2 -translate-x-1/2
            ${openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"}
            glass
            rounded-[var(--radius-md)]
            py-1
            shadow-[var(--shadow-float)]
            transition-all duration-[var(--transition-fast)] ease-[var(--ease-in-out)]
            overflow-hidden
            ${
              isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : openUpward
                  ? "opacity-0 translate-y-2 pointer-events-none"
                  : "opacity-0 -translate-y-2 pointer-events-none"
            }
          `}
          style={{
            width: menuWidth,
            minWidth: menuWidth,
            position: "absolute",
            top: openUpward ? "auto" : "100%",
            bottom: openUpward ? "100%" : "auto",
            marginTop: openUpward ? "0" : "6px",
            marginBottom: openUpward ? "6px" : "0",
          }}
          role="listbox"
        >
          {displayThemes.map((theme) => {
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
                {theme.icon && renderIcon(theme.icon)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Dropdown mode
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
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
          {currentOption?.icon && renderIcon(currentOption.icon)}
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

      {/* Dropdown Menu */}
      <div
        className={`
        absolute z-50
        left-1/2 -translate-x-1/2
        ${openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"}
        pointer-events-none
      `}
        style={{
          width: menuWidth,
          minWidth: menuWidth,
          top: openUpward ? "auto" : "100%",
          bottom: openUpward ? "100%" : "auto",
          marginTop: openUpward ? "0" : "6px",
          marginBottom: openUpward ? "6px" : "0",
        }}
      >
        <div
          className={`
          glass
          rounded-[var(--radius-md)]
          py-1
          shadow-[var(--shadow-float)]
          transition-all duration-[var(--transition-fast)] ease-[var(--ease-in-out)]
          overflow-hidden
          ${
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : openUpward
                ? "opacity-0 translate-y-2 pointer-events-none"
                : "opacity-0 -translate-y-2 pointer-events-none"
          }
        `}
        >
          {displayThemes.map((theme) => {
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
                {theme.icon && renderIcon(theme.icon)}
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
    </div>
  );
};

ThemeChanger.displayName = "ThemeChanger";
export default ThemeChanger;
