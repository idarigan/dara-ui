import React from "react";
import { Dropdown } from "../Dropdown/Dropdown";
import type { DropdownOption } from "../Dropdown/Dropdown";

export interface LanguageOption {
  /**
   * Language code (en, fa, ar, ...)
   */
  value: string;
  /**
   * Display label
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

export interface LanguageChangerProps {
  /**
   * Controlled language value
   */
  value?: string;
  /**
   * Default language (uncontrolled)
   * @default first item in languages, or "en"
   */
  defaultValue?: string;
  /**
   * Fired when language changes
   */
  onChange?: (lang: string) => void;
  /**
   * Languages the user can pick — pass only what you support
   */
  languages?: LanguageOption[];
  /**
   * "dropdown" = compact Dropdown
   * "toggle"   = simple pill that cycles the list
   * @default "dropdown"
   */
  variant?: "dropdown" | "toggle";
  /**
   * Compact size for navbar use
   * @default "sm"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Stretch to 100% of parent (dropdown only)
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Extra class on the root
   */
  className?: string;
}

/** Built-in language list — import and filter as needed */
export const DARA_LANGUAGES: LanguageOption[] = [
  { value: "en", label: "English", icon: "🇺🇸" },
  { value: "fa", label: "فارسی", icon: "🇮🇷" },
  { value: "fr", label: "Français", icon: "🇫🇷" },
  { value: "de", label: "Deutsch", icon: "🇩🇪" },
];

// RTL languages
const RTL_LANGS = new Set(["fa", "ar", "he", "ur"]);

/**
 * LanguageChanger — compact language switcher
 *
 * - variant="dropdown" → Dropdown with fixed width
 * - variant="toggle"   → pill that cycles languages
 * - Pass `languages` to control which options appear
 * - Sets lang + dir on <html>
 */
export const LanguageChanger: React.FC<LanguageChangerProps> = ({
  value,
  defaultValue,
  onChange,
  languages = DARA_LANGUAGES,
  variant = "dropdown",
  size = "sm",
  fullWidth = false,
  className = "",
}) => {
  const resolvedDefault = defaultValue ?? languages[0]?.value ?? "en";

  const [internalLang, setInternalLang] = React.useState(resolvedDefault);
  const isControlled = value !== undefined;
  const currentLang = isControlled ? value : internalLang;

  // Apply language to document
  const applyLanguage = (lang: string) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
  };

  React.useEffect(() => {
    applyLanguage(currentLang);
  }, [currentLang]);

  const handleChange = (langValue: string) => {
    if (!isControlled) {
      setInternalLang(langValue);
    }
    applyLanguage(langValue);
    onChange?.(langValue);
  };

  // ── Toggle variant ──
  if (variant === "toggle") {
    const currentOption =
      languages.find((l) => l.value === currentLang) || languages[0];

    const cycleNext = () => {
      const idx = languages.findIndex((l) => l.value === currentLang);
      const next = languages[(idx + 1) % languages.length];
      if (next) handleChange(next.value);
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
    };

    return (
      <button
        type="button"
        onClick={cycleNext}
        className={`
          inline-flex items-center gap-2
          rounded-full font-heading font-semibold tracking-wide
          bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]
          border border-[var(--color-border-primary)]
          hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-secondary)]
          transition-all duration-180 active:scale-95
          ${sizeStyles[size]}
          ${className}
        `}
        aria-label={`Language: ${currentOption?.label ?? currentLang}`}
      >
        {currentOption?.icon && (
          <span className="inline-flex flex-shrink-0">
            {currentOption.icon}
          </span>
        )}
        <span>{currentOption?.label ?? currentLang}</span>
      </button>
    );
  }

  // ── Dropdown variant ──
  const options: DropdownOption[] = languages.map((l) => ({
    value: l.value,
    label: l.label,
    icon: l.icon,
    disabled: l.disabled,
  }));

  return (
    <Dropdown
      options={options}
      value={currentLang}
      onChange={handleChange}
      placeholder="Language"
      size={size}
      fullWidth={fullWidth}
      className={className}
    />
  );
};

LanguageChanger.displayName = "LanguageChanger";
export default LanguageChanger;
