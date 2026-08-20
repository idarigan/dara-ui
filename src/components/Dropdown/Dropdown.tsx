import React, { useState, useRef, useEffect, useCallback } from "react";

export interface DropdownOption {
  /**
   * Option value (unique identifier)
   */
  value: string;
  /**
   * Option label to display
   */
  label: string;
  /**
   * Optional icon
   */
  icon?: React.ReactNode;
  /**
   * Disabled state
   */
  disabled?: boolean;
}

export interface DropdownProps {
  /**
   * Array of dropdown options
   */
  options: DropdownOption[];
  /**
   * Controlled: selected value
   */
  value?: string;
  /**
   * Default selected value (uncontrolled mode)
   */
  defaultValue?: string;
  /**
   * Controlled: callback when selection changes
   */
  onChange?: (value: string) => void;
  /**
   * Placeholder text when no option is selected
   * @default "Select an option..."
   */
  placeholder?: string;
  /**
   * If true, dropdown will be searchable
   * @default false
   */
  searchable?: boolean;
  /**
   * Search placeholder text
   * @default "Search..."
   */
  searchPlaceholder?: string;
  /**
   * If true, dropdown will be disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, dropdown takes 100% of parent width
   * When false, uses a fixed width per size (does not grow with label text)
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Size of the dropdown
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Additional className for the container
   */
  className?: string;
  /**
   * Label text for the dropdown
   */
  label?: string;
  /**
   * Helper text shown below dropdown
   */
  helperText?: string;
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Error message
   */
  errorMessage?: string;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = "Select an option...",
      searchable = false,
      searchPlaceholder = "Search...",
      disabled = false,
      fullWidth = false,
      size = "md",
      className = "",
      label,
      helperText,
      error = false,
      errorMessage,
    },
    ref,
  ) => {
    // Determine if controlled or uncontrolled
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<string | undefined>(
      defaultValue,
    );
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedValue = isControlled ? controlledValue : internalValue;

    // Find selected option
    const selectedOption = options.find((opt) => opt.value === selectedValue);

    // Filter options based on search term
    const filteredOptions = searchable
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : options;

    // Toggle dropdown
    const toggleDropdown = useCallback(() => {
      if (!disabled) {
        setIsOpen((prev) => !prev);
        if (!isOpen) {
          setSearchTerm("");
        }
      }
    }, [disabled, isOpen]);

    // Select an option
    const selectOption = useCallback(
      (value: string) => {
        if (!isControlled) {
          setInternalValue(value);
        }
        onChange?.(value);
        setIsOpen(false);
        setSearchTerm("");
      },
      [isControlled, onChange],
    );

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    // Focus search input when opened
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Size styles
    const sizeStyles = {
      sm: {
        trigger: "px-3 py-1.5 text-sm",
        option: "px-3 py-1.5 text-sm",
        search: "px-3 py-1.5 text-sm",
      },
      md: {
        trigger: "px-4 py-2.5 text-base",
        option: "px-4 py-2.5 text-base",
        search: "px-4 py-2.5 text-base",
      },
      lg: {
        trigger: "px-5 py-3.5 text-lg",
        option: "px-5 py-3.5 text-lg",
        search: "px-5 py-3.5 text-lg",
      },
    };

    // Fixed widths when not fullWidth - label length never resizes the trigger
    const fixedWidths = {
      sm: "w-36",
      md: "w-44",
      lg: "w-52",
    };

    // Icon size mapping
    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    // Get display label
    const displayLabel = selectedOption?.label || placeholder;

    return (
      <div
        ref={ref}
        className={`
          flex flex-col gap-1.5
          ${fullWidth ? "w-full" : fixedWidths[size]}
          ${className}
        `}
      >
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-secondary)] font-sans">
            {label}
          </label>
        )}

        {/* Dropdown Container */}
        <div ref={dropdownRef} className="relative w-full">
          {/* Trigger Button */}
          <button
            type="button"
            onClick={toggleDropdown}
            disabled={disabled}
            className={`
              w-full flex items-center justify-between gap-2
              font-sans text-[var(--color-text-primary)]
              transition-all duration-[var(--transition-fast)]
              rounded-[var(--radius-md)]
              ${sizeStyles[size].trigger}
              ${
                disabled
                  ? "opacity-60 cursor-not-allowed bg-[var(--color-bg-tertiary)]"
                  : "cursor-pointer bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)]"
              }
              ${
                error
                  ? "border border-[var(--color-danger)] focus:border-[var(--color-danger)]"
                  : "border border-[var(--color-border-primary)] focus:border-[var(--color-primary)]"
              }
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20
              ${isOpen ? "border-[var(--color-primary)]" : ""}
            `}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-disabled={disabled}
          >
            <span
              className={`
                flex items-center gap-2 min-w-0 truncate
                ${!selectedOption ? "text-[var(--color-text-tertiary)]" : ""}
              `}
            >
              {selectedOption?.icon && (
                <span className="flex-shrink-0 inline-flex">
                  {selectedOption.icon}
                </span>
              )}
              <span className="truncate">{displayLabel}</span>
            </span>
            <span
              className={`
                transition-transform duration-[var(--transition-med)] ease-[var(--ease-in-out)]
                ${isOpen ? "rotate-180" : "rotate-0"}
                text-[var(--color-text-tertiary)]
                flex-shrink-0
              `}
            >
              <svg
                className={iconSizes[size]}
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
            </span>
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute z-50 w-full mt-1.5 glass max-h-60 overflow-auto rounded-[var(--radius-md)] py-1 shadow-[var(--shadow-float)] transition-all duration-[var(--transition-fast)] ease-[var(--ease-in-out)] ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
            role="listbox"
            aria-label={label || "Dropdown options"}
          >
            {/* Search Input */}
            {searchable && (
              <div className="px-2 pb-1.5 border-b border-[var(--color-border-secondary)]">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={`
                    w-full font-sans
                    bg-[var(--color-bg-secondary)]
                    text-[var(--color-text-primary)]
                    border border-[var(--color-border-primary)]
                    rounded-[var(--radius-sm)]
                    outline-none
                    focus:border-[var(--color-primary)]
                    ${sizeStyles[size].search}
                  `}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options */}
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div
                  className={`${sizeStyles[size].option} text-[var(--color-text-tertiary)] text-center`}
                >
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === selectedValue;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        if (!option.disabled) {
                          selectOption(option.value);
                        }
                      }}
                      disabled={option.disabled}
                      className={`
                        w-full flex items-center gap-2 text-left
                        ${sizeStyles[size].option}
                        ${
                          option.disabled
                            ? "opacity-40 cursor-not-allowed"
                            : "cursor-pointer hover:bg-[var(--color-bg-elevated)]/50"
                        }
                        ${
                          isSelected
                            ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                            : "text-[var(--color-text-primary)]"
                        }
                        focus:outline-none focus:bg-[var(--color-bg-elevated)]/30
                      `}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                    >
                      {option.icon && (
                        <span className="flex-shrink-0">{option.icon}</span>
                      )}
                      <span className="truncate">{option.label}</span>
                      {isSelected && (
                        <span className="ml-auto text-[var(--color-primary)] flex-shrink-0">
                          <svg
                            className={`${iconSizes[size]} opacity-80`}
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
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Helper Text / Error Message */}
        {(helperText || errorMessage) && (
          <div className="flex items-center gap-1.5 text-xs font-sans">
            {error && errorMessage && (
              <>
                <svg
                  className="h-3.5 w-3.5 text-[var(--color-danger)] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
                <span className="text-[var(--color-danger)]">
                  {errorMessage}
                </span>
              </>
            )}
            {!error && helperText && (
              <span className="text-[var(--color-text-tertiary)]">
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
