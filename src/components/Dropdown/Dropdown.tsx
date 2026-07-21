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
   * If true, dropdown will take full width
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

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
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
        className={`${fullWidth ? "w-full" : ""} flex flex-col gap-1.5 ${className}`}
      >
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-secondary)] font-body">
            {label}
          </label>
        )}

        {/* Dropdown Container */}
        <div ref={dropdownRef} className="relative w-full">
          {/* Trigger Button */}
          <button
            onClick={toggleDropdown}
            disabled={disabled}
            className={`
              w-full flex items-center justify-between
              font-body text-[var(--color-text-primary)]
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
              className={`truncate ${
                !selectedOption ? "text-[var(--color-text-tertiary)]" : ""
              }`}
            >
              {selectedOption?.icon && (
                <span className="mr-2 inline-flex">{selectedOption.icon}</span>
              )}
              {displayLabel}
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
                className={`${iconSizes[size]}`}
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
          {isOpen && (
            <div
              className={`
                absolute z-50 w-full mt-1.5
                glass max-h-60 overflow-auto
                rounded-[var(--radius-md)]
                py-1
                shadow-[var(--shadow-float)]
                animate-in fade-in-0 zoom-in-95 slide-in-from-top-2
                duration-[var(--transition-fast)]
              `}
              role="listbox"
              aria-label="Dropdown options"
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
                      w-full font-body text-[var(--color-text-primary)]
                      placeholder:text-[var(--color-text-tertiary)]
                      bg-[var(--color-bg-tertiary)]
                      border border-[var(--color-border-secondary)]
                      rounded-[var(--radius-sm)]
                      outline-none
                      transition-all duration-[var(--transition-fast)]
                      focus:border-[var(--color-primary)]
                      focus:ring-1 focus:ring-[var(--color-primary)]/20
                      ${sizeStyles[size].search}
                    `}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Options */}
              {filteredOptions.length === 0 ? (
                <div
                  className={`
                    text-[var(--color-text-tertiary)] text-center
                    ${sizeStyles[size].option}
                  `}
                >
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === selectedValue;

                  return (
                    <button
                      key={option.value}
                      onClick={() => selectOption(option.value)}
                      disabled={option.disabled}
                      className={`
                        w-full flex items-center gap-2
                        text-left
                        transition-colors duration-[var(--transition-fast)]
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
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(helperText || errorMessage) && (
          <div className="flex items-center gap-1.5 text-xs font-body">
            {error && errorMessage && (
              <>
                <span className="text-[var(--color-danger)]">⚠️</span>
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
