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

export type BuiltInTheme = "nightfall" | "daylight" | "dracula";

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
   * Available themes when used without a ThemeProvider
   */
  availableThemes?: ThemeOption[];
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
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C12 2 5 9 5 15C5 18.866 8.134 22 12 22C15.866 22 19 18.866 19 15C19 9 12 2 12 2Z" />
  </svg>
);

const PaletteIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a9 9 0 100 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.3A3.7 3.7 0 0021 11c0-4.4-4-8-9-8z" />
    <circle cx="7.5" cy="11" r="1" />
    <circle cx="11" cy="7.5" r="1" />
    <circle cx="16" cy="8" r="1" />
  </svg>
);

const getDefaultIcon = (value: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    nightfall: <MoonIcon />,
    daylight: <SunIcon />,
    dracula: <DraculaIcon />,
    dark: <MoonIcon />,
    light: <SunIcon />,
  };
  return iconMap[value] || <PaletteIcon />;
};

/**
 * Built-in Dara UI themes
 */
export const BUILT_IN_THEMES: ThemeOption[] = [
  { value: "nightfall", label: "Nightfall", icon: <MoonIcon /> },
  { value: "daylight", label: "Daylight", icon: <SunIcon /> },
  { value: "dracula", label: "Dracula", icon: <DraculaIcon /> },
];

const STORAGE_KEY = "dara-ui-theme";

const withIcons = (list: ThemeOption[]): ThemeOption[] =>
  list.map((theme) => ({
    ...theme,
    icon: theme.icon ?? getDefaultIcon(theme.value),
  }));

const resolveThemes = (
  builtIn?: BuiltInTheme[],
  custom?: ThemeOption[],
): ThemeOption[] => {
  const extra = custom ?? [];
  const base = BUILT_IN_THEMES.filter(
    (theme) => !builtIn || builtIn.includes(theme.value as BuiltInTheme),
  ).map((theme) => extra.find((item) => item.value === theme.value) ?? theme);

  extra.forEach((item) => {
    if (!base.some((theme) => theme.value === item.value)) base.push(item);
  });

  return withIcons(base.length > 0 ? base : [BUILT_IN_THEMES[0]]);
};

const readStored = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeStored = (value: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // storage unavailable
  }
};

const applyTheme = (themeValue: string) => {
  document.documentElement.setAttribute("data-theme", themeValue);
};

// ============================================
// Theme Context & Provider
// ============================================

export interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
  themes: ThemeOption[];
}

export interface ThemeProviderProps {
  /**
   * Theme used when nothing is stored yet
   */
  defaultTheme?: string;
  /**
   * Built-in themes to keep. Omit to keep all, pass [] to remove them all
   */
  builtIn?: BuiltInTheme[];
  /**
   * Extra themes, defined in CSS with [data-theme="value"]
   * A theme with the same value as a built-in one replaces it
   */
  themes?: ThemeOption[];
  children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * ThemeProvider - Applies the active theme and shares the theme list
 *
 * Features:
 * - Keep all, some or none of the built-in themes
 * - Add custom themes with their own icons
 * - Persists the choice in localStorage
 * - Falls back to the first available theme when the stored one is gone
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  defaultTheme,
  builtIn,
  themes: customThemes,
  children,
}) => {
  const builtInKey = builtIn ? builtIn.join("|") : "*";
  const availableThemes = useMemo(
    () => resolveThemes(builtIn, customThemes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [builtInKey, customThemes],
  );

  const pickTheme = useCallback(
    (stored: string | null): string => {
      const values = availableThemes.map((theme) => theme.value);
      if (stored && values.includes(stored)) return stored;
      if (defaultTheme && values.includes(defaultTheme)) return defaultTheme;
      return values[0];
    },
    [availableThemes, defaultTheme],
  );

  const [theme, setThemeState] = useState<string>(() =>
    pickTheme(readStored()),
  );

  useEffect(() => {
    if (!availableThemes.some((item) => item.value === theme)) {
      setThemeState(pickTheme(null));
    }
  }, [availableThemes, theme, pickTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback(
    (themeValue: string) => {
      if (!availableThemes.some((item) => item.value === themeValue)) return;
      setThemeState(themeValue);
      writeStored(themeValue);
    },
    [availableThemes],
  );

  const value: ThemeContextValue = useMemo(
    () => ({ theme, setTheme, themes: availableThemes }),
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

const iconPixels = { sm: 16, md: 20, lg: 24 };

const renderIcon = (icon: React.ReactNode, px: number) => (
  <span
    className="inline-flex flex-shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full [&>img]:h-full [&>img]:w-full [&>img]:object-contain"
    style={{ width: px, height: px }}
    aria-hidden="true"
  >
    {icon}
  </span>
);

/**
 * Dara UI ThemeChanger - Dropdown for switching between themes
 *
 * Features:
 * - Reads the theme list from ThemeProvider
 * - Custom icon per theme (any React node, SVG or image)
 * - Hides itself when only one theme is available
 * - Icon-only mode for compact navigation bars
 * - Fixed width option for consistent sizing
 * - Controlled or uncontrolled modes
 * - Persists theme preference in localStorage
 * - Size variants (sm, md, lg)
 * - Dropdown is always centered under the trigger
 * - Menu width matches the button when iconOnly or fixedWidth is used
 */
export const ThemeChanger: React.FC<ThemeChangerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  availableThemes,
  size = "md",
  iconOnly = false,
  fixedWidth,
  className = "",
  useContext: useThemeContext = true,
  openUpward = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const context = useContext(ThemeContext);
  const isInContext = useThemeContext && context !== undefined;
  const isControlled = controlledValue !== undefined;

  const standaloneThemes = useMemo(
    () => withIcons(availableThemes ?? BUILT_IN_THEMES),
    [availableThemes],
  );
  const themes = isInContext ? context.themes : standaloneThemes;

  const [internalValue, setInternalValue] = useState<string>(() => {
    const values = standaloneThemes.map((theme) => theme.value);
    const stored = readStored();
    if (stored && values.includes(stored)) return stored;
    if (defaultValue && values.includes(defaultValue)) return defaultValue;
    return values[0];
  });

  let currentTheme: string;
  if (isControlled) {
    currentTheme = controlledValue;
  } else if (isInContext) {
    currentTheme = context.theme;
  } else {
    currentTheme = internalValue;
  }

  // Standalone mode applies the theme itself
  useEffect(() => {
    if (!isInContext) applyTheme(currentTheme);
  }, [isInContext, currentTheme]);

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
      if (isInContext) {
        context.setTheme(themeValue);
      } else {
        if (!isControlled) setInternalValue(themeValue);
        applyTheme(themeValue);
        writeStored(themeValue);
      }

      onChange?.(themeValue);
      setIsOpen(false);
    },
    [isInContext, context, isControlled, onChange],
  );

  // Nothing to switch between
  if (themes.length <= 1) return null;

  // Size styles
  const sizeStyles = {
    sm: {
      trigger: "px-3 py-1.5 text-xs",
      option: "px-3 py-1.5 text-xs",
      chevronSize: "h-3 w-3",
      iconOnlyWidth: "32px",
    },
    md: {
      trigger: "px-4 py-2 text-sm",
      option: "px-4 py-2 text-sm",
      chevronSize: "h-4 w-4",
      iconOnlyWidth: "40px",
    },
    lg: {
      trigger: "px-5 py-2.5 text-base",
      option: "px-5 py-2.5 text-base",
      chevronSize: "h-5 w-5",
      iconOnlyWidth: "48px",
    },
  };

  const px = iconPixels[size];
  const currentOption = themes.find((t) => t.value === currentTheme);
  const menuWidth = iconOnly
    ? sizeStyles[size].iconOnlyWidth
    : fixedWidth || "140px";

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
          {currentOption?.icon && renderIcon(currentOption.icon, px)}
        </button>

        <div
          className={`
            absolute z-50
            left-1/2 -translate-x-1/2
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
                {theme.icon && renderIcon(theme.icon, px)}
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
          {currentOption?.icon && renderIcon(currentOption.icon, px)}
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
        className="absolute z-50 left-1/2 -translate-x-1/2 pointer-events-none"
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
                {theme.icon && renderIcon(theme.icon, px)}
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
