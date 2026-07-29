import React from "react";
import { Dropdown } from "../Dropdown/Dropdown";

export interface LanguageChangerProps {
  /**
   * Controlled language value
   */
  value?: string;
  /**
   * Default language (uncontrolled)
   * @default "en"
   */
  defaultValue?: string;
  /**
   * Fired when language changes
   */
  onChange?: (lang: string) => void;
  /**
   * Available languages — user wires their own list
   */
  languages?: Array<{ value: string; label: string; icon?: React.ReactNode }>;
  /**
   * "dropdown" = compact Dropdown (default)
   * "toggle"   = simple pill button that cycles the list
   * @default "dropdown"
   */
  variant?: "dropdown" | "toggle";
  /**
   * Compact size for navbar use
   * @default "sm"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Extra class on the root
   */
  className?: string;
}

// ── Language Icons ──
const EnIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3 9h18M3 13h18M3 17h18" strokeLinecap="round" />
    <path d="M9 5v14M15 5v14" />
  </svg>
);

const FaIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <text
      x="12"
      y="15.5"
      textAnchor="middle"
      fontSize="9"
      fill="currentColor"
      stroke="none"
      fontFamily="Vazirmatn, sans-serif"
      fontWeight="600"
    >
      فا
    </text>
  </svg>
);

const ArIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <text
      x="12"
      y="15.5"
      textAnchor="middle"
      fontSize="9"
      fill="currentColor"
      stroke="none"
      fontFamily="sans-serif"
      fontWeight="600"
    >
      ع
    </text>
  </svg>
);

const FrIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24">
    <rect x="3" y="5" width="6" height="14" fill="#0055A4" />
    <rect x="9" y="5" width="6" height="14" fill="#FFFFFF" />
    <rect x="15" y="5" width="6" height="14" fill="#EF4135" />
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      opacity={0.3}
    />
  </svg>
);

const DeIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="4.67" fill="#000000" />
    <rect x="3" y="9.67" width="18" height="4.67" fill="#DD0000" />
    <rect x="3" y="14.33" width="18" height="4.67" fill="#FFCE00" />
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      opacity={0.3}
    />
  </svg>
);

// Built-in list
const defaultLanguages = [
  { value: "en", label: "English", icon: <EnIcon /> },
  { value: "fa", label: "فارسی", icon: <FaIcon /> },
  { value: "ar", label: "العربية", icon: <ArIcon /> },
  { value: "fr", label: "Français", icon: <FrIcon /> },
  { value: "de", label: "Deutsch", icon: <DeIcon /> },
];

// RTL languages
const RTL_LANGS = new Set(["fa", "ar", "he", "ur"]);

/**
 * LanguageChanger — compact language switcher
 *
 * - variant="dropdown" → uses Dropdown at button size
 * - variant="toggle"   → simple pill that cycles languages (demo-style)
 * - Sets lang + dir on <html>
 * - Controlled + uncontrolled
 * - Pass your own languages array or use the built-ins
 */
export const LanguageChanger: React.FC<LanguageChangerProps> = ({
  value,
  defaultValue = "en",
  onChange,
  languages = defaultLanguages,
  variant = "dropdown",
  size = "sm",
  className = "",
}) => {
  const [internalLang, setInternalLang] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentLang = isControlled ? value : internalLang;

  // Apply language to document
  const applyLanguage = (lang: string) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
  };

  // Apply on mount + when controlled value flips
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

  // ── Toggle variant (demo-style pill) ──
  if (variant === "toggle") {
    const currentOption =
      languages.find((l) => l.value === currentLang) || languages[0];

    const cycleNext = () => {
      const idx = languages.findIndex((l) => l.value === currentLang);
      const next = languages[(idx + 1) % languages.length];
      handleChange(next.value);
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
        aria-label={`Language: ${currentOption.label}`}
      >
        {currentOption.icon && (
          <span className="inline-flex">{currentOption.icon}</span>
        )}
        <span>{currentOption.label}</span>
      </button>
    );
  }

  // ── Dropdown variant (default) ──
  return (
    <Dropdown
      options={languages}
      value={currentLang}
      onChange={handleChange}
      placeholder="Language"
      size={size}
      className={`min-w-[110px] ${className}`}
    />
  );
};

LanguageChanger.displayName = "LanguageChanger";
export default LanguageChanger;
