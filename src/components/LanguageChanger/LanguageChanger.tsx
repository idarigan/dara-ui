import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { translations as builtInTranslations } from "../../translations";

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

const STORAGE_KEY = "dara-ui-language";

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

// ============================================
// Translation lookup
// ============================================

type Dictionary = Record<string, any>;

const lookup = (source: Dictionary | undefined, keys: string[]) => {
  let value: any = source;
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
};

const translate = (
  dictionaries: Record<string, Dictionary>,
  language: string,
  key: string,
  params?: Record<string, string | number>,
): string => {
  const keys = key.split(".");
  const value =
    lookup(dictionaries[language], keys) ??
    lookup(dictionaries.en, keys) ??
    lookup(builtInTranslations.en, keys);

  if (typeof value !== "string") return key;

  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, paramName) => {
      return String(params[paramName] ?? `{{${paramName}}}`);
    });
  }

  return value;
};

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
   * Missing keys fall back to the built-in English labels
   * @example { en: { welcome: "Welcome" }, fa: { welcome: "خوش آمدید" } }
   */
  translations?: Record<string, Record<string, any>>;
  /**
   * Available languages (overrides default). One language makes the app single-language
   */
  languages?: LanguageOption[];
  /**
   * Children
   */
  children: React.ReactNode;
}

const fallbackContext: I18nContextValue = {
  language: "en",
  setLanguage: () => {},
  t: (key, params) =>
    translate(
      builtInTranslations as Record<string, Dictionary>,
      "en",
      key,
      params,
    ),
  languages: [DEFAULT_LANGUAGES[0]],
  dir: "ltr",
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

/**
 * I18nProvider - Provides translation context to children
 *
 * Features:
 * - Self-contained i18n system, no external dependencies
 * - Optional: without a provider every component uses built-in English labels
 * - Single-language mode with one entry in `languages`
 * - Nested key resolution (e.g., 'welcome.title')
 * - Parameter interpolation (e.g., 'Hello {{name}}')
 * - Language persistence in localStorage
 * - Auto-updates dir attribute on html
 * - Triggers re-render of all consuming components on language change
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({
  defaultLanguage,
  translations = builtInTranslations,
  languages: customLanguages,
  children,
}) => {
  const availableLanguages: LanguageOption[] = customLanguages?.length
    ? customLanguages
    : DEFAULT_LANGUAGES;

  const getInitialLang = (): string => {
    const stored = readStored();
    if (stored && availableLanguages.some((l) => l.value === stored)) {
      return stored;
    }
    if (
      defaultLanguage &&
      availableLanguages.some((l) => l.value === defaultLanguage)
    ) {
      return defaultLanguage;
    }
    return availableLanguages[0]?.value || "en";
  };

  const [language, setLanguageState] = useState<string>(getInitialLang);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string =>
      translate(
        translations as Record<string, Dictionary>,
        language,
        key,
        params,
      ),
    [language, translations],
  );

  // Set language and apply to document
  const setLanguage = useCallback(
    (lang: string) => {
      const langOption = availableLanguages.find((l) => l.value === lang);
      if (!langOption) return;

      setLanguageState(lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = langOption.dir || "ltr";
      writeStored(lang);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [availableLanguages.map((l) => l.value).join("|")],
  );

  // Apply the active language on mount and whenever it changes
  useEffect(() => {
    const langOption = availableLanguages.find((l) => l.value === language);
    if (langOption) {
      document.documentElement.lang = language;
      document.documentElement.dir = langOption.dir || "ltr";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Fall back when the active language is removed from the list
  useEffect(() => {
    if (!availableLanguages.some((l) => l.value === language)) {
      setLanguageState(availableLanguages[0]?.value || "en");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableLanguages.map((l) => l.value).join("|")]);

  const currentDir =
    availableLanguages.find((l) => l.value === language)?.dir || "ltr";

  const value: I18nContextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: availableLanguages,
      dir: currentDir,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, setLanguage, t, currentDir, availableLanguages.length],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

/**
 * useI18n - Hook for accessing i18n context
 *
 * Works without a provider and returns the built-in English labels.
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
  return useContext(I18nContext) ?? fallbackContext;
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
 * - Reads the language list from I18nProvider
 * - Hides itself when only one language is available
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if we're inside I18nProvider by checking context directly
  const context = useContext(I18nContext);
  const isInContext = useI18nContext && context !== undefined;

  // Determine if controlled or uncontrolled
  const isControlled = controlledValue !== undefined;

  const languages: LanguageOption[] = useMemo(
    () =>
      availableLanguages ??
      (isInContext ? context.languages : DEFAULT_LANGUAGES),
    [availableLanguages, isInContext, context],
  );

  // For internal state - only used when not in context or controlled
  const [internalValue, setInternalValue] = useState<string>(() => {
    const stored = readStored();
    if (stored && languages.some((l) => l.value === stored)) return stored;
    return defaultValue || languages[0]?.value || "en";
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

  // Apply language to document
  const applyLanguage = useCallback(
    (lang: string) => {
      const langOption = languages.find((l) => l.value === lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = langOption?.dir || "ltr";
      writeStored(lang);
    },
    [languages],
  );

  // Standalone mode applies the language itself
  useEffect(() => {
    if (!isInContext) applyLanguage(currentLang);
  }, [isInContext, currentLang, applyLanguage]);

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
      if (isInContext) {
        context.setLanguage(lang);
      } else {
        if (!isControlled) setInternalValue(lang);
        applyLanguage(lang);
      }

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

  // Nothing to switch between
  if (languages.length <= 1) return null;

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
