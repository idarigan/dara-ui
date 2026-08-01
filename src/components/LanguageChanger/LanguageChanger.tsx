import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";

export interface LanguageOption {
  /**
   * Language code (e.g., "en", "fa", "fr")
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
  /**
   * Direction for this language
   * @default "ltr"
   */
  dir?: "ltr" | "rtl";
}

export interface LanguageChangerProps {
  /**
   * Controlled value
   */
  value?: string;
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Callback when language changes
   */
  onChange?: (lang: string) => void;
  /**
   * Available languages (overrides default)
   */
  availableLanguages?: LanguageOption[];
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
   * Whether to use the I18n context
   * @default true
   */
  useContext?: boolean;
}

/**
 * Default Dara UI languages
 */
export const DEFAULT_LANGUAGES: LanguageOption[] = [
  { value: "en", label: "English", icon: "🇺🇸", dir: "ltr" },
  { value: "fa", label: "فارسی", icon: "🇮🇷", dir: "rtl" },
  { value: "fr", label: "Français", icon: "🇫🇷", dir: "ltr" },
];

/**
 * Dara UI LanguageChanger - Dropdown for switching between languages
 *
 * Features:
 * - Auto-detects available languages from default list
 * - Supports custom language lists
 * - Clean dropdown with icon support
 * - Icon-only mode for compact navigation bars
 * - Fixed width option for consistent sizing
 * - Controlled or uncontrolled modes
 * - Applies language via lang and dir attributes on html element
 * - Persists language preference in localStorage
 * - Size variants (sm, md, lg)
 * - Dropdown is always centered under the trigger
 * - Menu width matches the button when iconOnly or fixedWidth is used
 * - All LanguageChanger instances sync through I18n context
 */
export const LanguageChanger: React.FC<LanguageChangerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  availableLanguages,
  size = "md",
  iconOnly = false,
  fixedWidth,
  className = "",
  useContext: useI18nContext = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [languages, setLanguages] =
    useState<LanguageOption[]>(DEFAULT_LANGUAGES);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const STORAGE_KEY = "dara-ui-language";

  // Try to get context if available
  let contextValue: I18nContextValue | null = null;
  try {
    contextValue = useI18n();
  } catch {
    // Not inside I18nProvider
  }

  const isInContext = useI18nContext && contextValue !== null;

  // Determine if controlled or uncontrolled
  const isControlled = controlledValue !== undefined;

  // For internal state - only used when not in context or controlled
  const [internalValue, setInternalValue] = useState<string>(() => {
    // Try to load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const lang = DEFAULT_LANGUAGES.find((l) => l.value === stored);
      if (lang) return stored;
    }
    return defaultValue || DEFAULT_LANGUAGES[0]?.value || "en";
  });

  // Current language: priority: controlled > context > internal
  let currentLang: string;
  if (isControlled) {
    currentLang = controlledValue;
  } else if (isInContext) {
    currentLang = contextValue.language;
  } else {
    currentLang = internalValue;
  }

  // Set languages from props or defaults
  useEffect(() => {
    if (availableLanguages) {
      setLanguages(availableLanguages);
    }
  }, [availableLanguages]);

  // Apply language to document
  const applyLanguage = useCallback(
    (lang: string) => {
      const langOption = languages.find((l) => l.value === lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = langOption?.dir || "ltr";

      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, lang);

      // Dispatch custom event for components using useI18n
      window.dispatchEvent(
        new CustomEvent("dara-language-change", { detail: { lang } }),
      );
    },
    [languages],
  );

  // Apply on mount and when language changes
  useEffect(() => {
    applyLanguage(currentLang);
  }, [currentLang, applyLanguage]);

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

  // Handle language selection
  const handleSelect = useCallback(
    (lang: string) => {
      // If we're in context, use context's setLanguage
      if (isInContext) {
        contextValue.setLanguage(lang);
      } else if (!isControlled) {
        setInternalValue(lang);
      }

      applyLanguage(lang);
      onChange?.(lang);
      setIsOpen(false);
    },
    [isInContext, contextValue, isControlled, onChange, applyLanguage],
  );

  // Get default icon for language
  const getDefaultIcon = (value: string): string => {
    const iconMap: Record<string, string> = {
      en: "🇺🇸",
      fa: "🇮🇷",
      fr: "🇫🇷",
      de: "🇩🇪",
      es: "🇪🇸",
      ar: "🇸🇦",
      it: "🇮🇹",
      pt: "🇵🇹",
      ru: "🇷🇺",
      ja: "🇯🇵",
      ko: "🇰🇷",
      zh: "🇨🇳",
    };
    return iconMap[value] || "🌐";
  };

  // Ensure languages have icons
  const displayLanguages = useMemo(
    () =>
      languages.map((lang) => ({
        ...lang,
        icon: lang.icon || getDefaultIcon(lang.value),
      })),
    [languages],
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

  // Find current language option
  const currentOption = displayLanguages.find((l) => l.value === currentLang);

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
          title={currentOption?.label || "Language"}
        >
          {currentOption?.icon && (
            <span className="text-base">{currentOption.icon}</span>
          )}
        </button>

        {/* Dropdown Menu */}
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
          {displayLanguages.map((lang) => {
            const isActive = lang.value === currentLang;
            return (
              <button
                key={lang.value}
                type="button"
                onClick={() => handleSelect(lang.value)}
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
                title={lang.label}
              >
                {lang.icon && (
                  <span className="flex-shrink-0 text-base">{lang.icon}</span>
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
            {currentOption?.label || "Language"}
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

      {/* Dropdown Menu */}
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
        {displayLanguages.map((lang) => {
          const isActive = lang.value === currentLang;
          return (
            <button
              key={lang.value}
              type="button"
              onClick={() => handleSelect(lang.value)}
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
              {lang.icon && (
                <span className="flex-shrink-0 text-base">{lang.icon}</span>
              )}
              <span className="truncate">{lang.label}</span>
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

LanguageChanger.displayName = "LanguageChanger";
export default LanguageChanger;

// ============================================
// I18n Context & Provider
// ============================================

export interface I18nContextValue {
  /**
   * Current language code
   */
  language: string;
  /**
   * Set the current language
   */
  setLanguage: (lang: string) => void;
  /**
   * Translation function - resolves nested keys
   * @example t('welcome.title') => "Welcome"
   * @example t('greeting', { name: "John" }) => "Hello John"
   */
  t: (key: string, params?: Record<string, string | number>) => string;
  /**
   * Available languages
   */
  languages: LanguageOption[];
  /**
   * Direction for current language
   */
  dir: "ltr" | "rtl";
}

export interface I18nProviderProps {
  /**
   * Initial language
   */
  defaultLanguage?: string;
  /**
   * Translations object - keyed by language code
   * @example { en: { welcome: "Welcome" }, fa: { welcome: "خوش آمدید" } }
   */
  translations: Record<string, Record<string, any>>;
  /**
   * Available languages (overrides default)
   */
  languages?: LanguageOption[];
  /**
   * Children
   */
  children: React.ReactNode;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

/**
 * I18nProvider - Provides translation context to children
 *
 * Features:
 * - Self-contained i18n system, no external dependencies
 * - Nested key resolution (e.g., 'welcome.title')
 * - Parameter interpolation (e.g., 'Hello {{name}}')
 * - Language persistence in localStorage
 * - Auto-updates dir attribute on html
 * - Triggers re-render of all consuming components on language change
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({
  defaultLanguage,
  translations,
  languages: customLanguages,
  children,
}) => {
  const STORAGE_KEY = "dara-ui-language";

  // Determine default languages
  const defaultLanguages: LanguageOption[] =
    customLanguages || DEFAULT_LANGUAGES;

  // Get initial language from localStorage or default
  const getInitialLang = (): string => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && defaultLanguages.some((l) => l.value === stored)) {
      return stored;
    }
    return defaultLanguage || defaultLanguages[0]?.value || "en";
  };

  const [language, setLanguageState] = useState<string>(getInitialLang);

  // Translation function with nested key resolution and parameter interpolation
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const currentTranslations =
        translations[language] || translations.en || {};

      // Resolve nested keys (e.g., 'welcome.title')
      const keys = key.split(".");
      let value: any = currentTranslations;
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          // Fallback to English if available
          const fallback = translations.en || {};
          let fallbackValue: any = fallback;
          for (const fk of keys) {
            if (
              fallbackValue &&
              typeof fallbackValue === "object" &&
              fk in fallbackValue
            ) {
              fallbackValue = fallbackValue[fk];
            } else {
              return key; // Return the key if not found anywhere
            }
          }
          value = fallbackValue;
          break;
        }
      }

      if (typeof value !== "string") {
        return key;
      }

      // Parameter interpolation
      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (_, paramName) => {
          return String(params[paramName] ?? `{{${paramName}}}`);
        });
      }

      return value;
    },
    [language, translations],
  );

  // Set language and apply to document
  const setLanguage = useCallback(
    (lang: string) => {
      const langOption = defaultLanguages.find((l) => l.value === lang);
      if (!langOption) return;

      setLanguageState(lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = langOption.dir || "ltr";
      localStorage.setItem(STORAGE_KEY, lang);

      // Dispatch event for other components
      window.dispatchEvent(
        new CustomEvent("dara-language-change", { detail: { lang } }),
      );
    },
    [defaultLanguages],
  );

  // Apply initial language on mount
  useEffect(() => {
    const initialLang = getInitialLang();
    const langOption = defaultLanguages.find((l) => l.value === initialLang);
    if (langOption) {
      document.documentElement.lang = initialLang;
      document.documentElement.dir = langOption.dir || "ltr";
    }
  }, [defaultLanguages]);

  // Listen for language changes from other components (e.g., LanguageChanger)
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const { lang } = event.detail;
      if (lang && lang !== language) {
        setLanguageState(lang);
      }
    };

    window.addEventListener(
      "dara-language-change",
      handleLanguageChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "dara-language-change",
        handleLanguageChange as EventListener,
      );
    };
  }, [language]);

  // Get current language direction
  const currentDir =
    defaultLanguages.find((l) => l.value === language)?.dir || "ltr";

  const value: I18nContextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: defaultLanguages,
      dir: currentDir,
    }),
    [language, setLanguage, t, defaultLanguages, currentDir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

/**
 * useI18n - Hook for accessing i18n context
 *
 * @example
 * ```tsx
 * const { t, language, setLanguage } = useI18n();
 *
 * // Translate a key
 * <h1>{t('welcome.title')}</h1>
 *
 * // With parameters
 * <p>{t('greeting', { name: user.name })}</p>
 *
 * // Change language
 * <button onClick={() => setLanguage('fa')}>فارسی</button>
 * ```
 */
export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
