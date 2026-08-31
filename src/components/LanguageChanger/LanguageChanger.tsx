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
   * Flag image URL (auto-generated from language code if not provided)
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
  /**
   * Dropdown placement
   * @default "bottom"
   */
  placement?: "bottom" | "top";
  /**
   * Open the dropdown upward
   * @default false
   */
  openUpward?: boolean;
}

/**
 * Default Dara UI languages with flag CDN URLs
 */
export const DEFAULT_LANGUAGES: LanguageOption[] = [
  { value: "en", label: "English", dir: "ltr" },
  { value: "fa", label: "فارسی", dir: "rtl" },
  { value: "fr", label: "Français", dir: "ltr" },
];

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

// ============================================
// LanguageChanger Component
// ============================================

/**
 * Get flag image URL from language code
 */
const getFlagUrl = (langCode: string): string => {
  // ISO 3166-1 alpha-2 country codes for languages
  const languageToCountry: Record<string, string> = {
    en: "gb",
    fa: "ir",
    fr: "fr",
    de: "de",
    es: "es",
    ar: "sa",
    it: "it",
    pt: "pt",
    ru: "ru",
    ja: "jp",
    ko: "kr",
    zh: "cn",
    nl: "nl",
    pl: "pl",
    tr: "tr",
    vi: "vn",
    th: "th",
    id: "id",
    ms: "my",
    hi: "in",
    ur: "pk",
    he: "il",
    el: "gr",
    cs: "cz",
    hu: "hu",
    sv: "se",
    no: "no",
    da: "dk",
    fi: "fi",
    ro: "ro",
    bg: "bg",
    hr: "hr",
    sk: "sk",
    sl: "si",
    lt: "lt",
    lv: "lv",
    et: "ee",
    uk: "ua",
    be: "by",
    ka: "ge",
    hy: "am",
    az: "az",
  };

  const countryCode = languageToCountry[langCode] || langCode;
  return `https://flagcdn.com/${countryCode}.svg`;
};

/**
 * FlagIcon component - renders a flag image from CDN
 */
const FlagIcon: React.FC<{ code: string; className?: string }> = ({
  code,
  className = "",
}) => {
  const [error, setError] = useState(false);
  const flagUrl = getFlagUrl(code);

  if (error) {
    // Fallback: show language code instead of flag
    return (
      <span
        className={`text-xs font-mono text-[var(--color-text-tertiary)] ${className}`}
      >
        {code.toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={flagUrl}
      alt={`${code} flag`}
      className={`flex-shrink-0 object-cover rounded-sm ${className}`}
      style={{
        width: "20px",
        height: "15px",
        minWidth: "20px",
        minHeight: "15px",
      }}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

/**
 * Dara UI LanguageChanger - Dropdown for switching between languages
 *
 * Features:
 * - Auto-detects available languages from default list
 * - Supports custom language lists
 * - Clean dropdown with flag icons from Flagpedia CDN
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
  placement = "bottom",
  openUpward = false,
  useContext: useI18nContext = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [languages, setLanguages] =
    useState<LanguageOption[]>(DEFAULT_LANGUAGES);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const STORAGE_KEY = "dara-ui-language";

  // Check if we're inside I18nProvider by checking context directly
  const context = useContext(I18nContext);
  const isInContext = useI18nContext && context !== undefined;

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
    currentLang = context.language;
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
        context.setLanguage(lang);
      } else if (!isControlled) {
        setInternalValue(lang);
      }

      applyLanguage(lang);
      onChange?.(lang);
      setIsOpen(false);
    },
    [isInContext, context, isControlled, onChange, applyLanguage],
  );

  // Ensure languages have icons (flag images)
  const displayLanguages = useMemo(
    () =>
      languages.map((lang) => ({
        ...lang,
        icon: lang.icon || <FlagIcon code={lang.value} />,
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
      flagSize: "w-4 h-3",
    },
    md: {
      trigger: "px-4 py-2 text-sm",
      option: "px-4 py-2 text-sm",
      icon: "h-4 w-4",
      iconOnlySize: "w-10 h-10",
      chevronSize: "h-4 w-4",
      iconOnlyWidth: "40px",
      flagSize: "w-5 h-3.5",
    },
    lg: {
      trigger: "px-5 py-2.5 text-base",
      option: "px-5 py-2.5 text-base",
      icon: "h-5 w-5",
      iconOnlySize: "w-12 h-12",
      chevronSize: "h-5 w-5",
      iconOnlyWidth: "48px",
      flagSize: "w-6 h-4.5",
    },
  };

  // Find current language option
  const currentOption = displayLanguages.find((l) => l.value === currentLang);

  // Determine menu width
  const menuWidth = iconOnly
    ? sizeStyles[size].iconOnlyWidth
    : fixedWidth || "140px";

  // Get placement classes
  const getPlacementClasses = () => {
    if (openUpward) {
      return "bottom-full mb-1.5";
    }
    if (placement === "top") {
      return "bottom-full mb-1.5";
    }
    return "top-full mt-1.5";
  };

  // Render flag icon helper
  const renderFlagIcon = (langCode: string, sizeClass: string) => {
    const flagUrl = getFlagUrl(langCode);
    return (
      <img
        src={flagUrl}
        alt={`${langCode} flag`}
        className={`flex-shrink-0 object-cover rounded-sm ${sizeClass}`}
        style={{
          width: size === "sm" ? "16px" : size === "lg" ? "24px" : "20px",
          height: size === "sm" ? "12px" : size === "lg" ? "18px" : "15px",
          minWidth: size === "sm" ? "16px" : size === "lg" ? "24px" : "20px",
          minHeight: size === "sm" ? "12px" : size === "lg" ? "18px" : "15px",
        }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
          const fallback = document.createElement("span");
          fallback.className =
            "text-xs font-mono text-[var(--color-text-tertiary)]";
          fallback.textContent = langCode.toUpperCase();
          e.currentTarget.parentNode?.appendChild(fallback);
        }}
        loading="lazy"
      />
    );
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
          aria-label={`Current language: ${currentOption?.label || "Language"}`}
        >
          {currentOption?.icon || renderFlagIcon(currentLang, "w-4 h-3")}
        </button>

        <div
          className={`
            absolute z-50
            left-1/2 -translate-x-1/2
            ${getPlacementClasses()}
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
                {typeof lang.icon === "string" ? (
                  <img
                    src={lang.icon}
                    alt={`${lang.value} flag`}
                    className="flex-shrink-0 object-cover rounded-sm w-4 h-3"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    loading="lazy"
                  />
                ) : (
                  lang.icon || renderFlagIcon(lang.value, "w-4 h-3")
                )}
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
          {currentOption?.icon || renderFlagIcon(currentLang, "w-4 h-3")}
          <span className="font-mono tracking-wide truncate">
            {currentOption?.label || "Language"}
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
        ${getPlacementClasses()}
        pointer-events-none
      `}
        style={{
          width: menuWidth,
          minWidth: menuWidth,
          top: "100%",
          marginTop: "6px",
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
          ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
        `}
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
                {typeof lang.icon === "string" ? (
                  <img
                    src={lang.icon}
                    alt={`${lang.value} flag`}
                    className="flex-shrink-0 object-cover rounded-sm w-4 h-3"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    loading="lazy"
                  />
                ) : (
                  lang.icon || renderFlagIcon(lang.value, "w-4 h-3")
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
    </div>
  );
};

LanguageChanger.displayName = "LanguageChanger";
export default LanguageChanger;
