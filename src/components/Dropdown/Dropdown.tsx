import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useId,
} from "react";

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

// ============================================
// GLASS SURFACE
// ============================================
const menuSurface: React.CSSProperties = {
  backgroundColor: "var(--color-bg-secondary)",
  background: "color-mix(in srgb, var(--color-bg-secondary) 95%, transparent)",
  backdropFilter: "blur(14px) saturate(130%)",
  WebkitBackdropFilter: "blur(14px) saturate(130%)",
  border: "1px solid var(--glass-border-strong)",
  outline: "1px solid var(--glass-outline)",
  boxShadow:
    "0 8px 26px color-mix(in srgb, var(--shadow-color) 22%, transparent), inset 0 1px 0 var(--glass-highlight)",
};

const selectionSurface: React.CSSProperties = {
  background: "var(--glass-bg)",
  border: "1px solid var(--glass-border-strong)",
};

type MenuPlacement = "top" | "bottom";

interface IndicatorPosition {
  top: number;
  height: number;
  visible: boolean;
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
    const [activeIndex, setActiveIndex] = useState(-1);
    const [menuPlacement, setMenuPlacement] = useState<MenuPlacement>("bottom");
    const [indicator, setIndicator] = useState<IndicatorPosition>({
      top: 0,
      height: 0,
      visible: false,
    });

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionsListRef = useRef<HTMLDivElement>(null);
    const typeaheadRef = useRef({ value: "", time: 0 });

    const selectedValue = isControlled ? controlledValue : internalValue;

    // Find selected option
    const selectedOption = options.find((opt) => opt.value === selectedValue);

    // Filter options based on search term
    const filteredOptions = useMemo(
      () =>
        searchable
          ? options.filter((opt) =>
              opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
            )
          : options,
      [options, searchable, searchTerm],
    );

    const dropdownId = useId();
    const triggerId = `${dropdownId}-trigger`;
    const labelId = `${dropdownId}-label`;
    const listboxId = `${dropdownId}-listbox`;

    const selectedIndex = filteredOptions.findIndex(
      (option) => option.value === selectedValue,
    );

    const getFirstEnabledIndex = useCallback(
      (items: DropdownOption[]) =>
        items.findIndex((option) => !option.disabled),
      [],
    );

    const getLastEnabledIndex = useCallback((items: DropdownOption[]) => {
      for (let index = items.length - 1; index >= 0; index -= 1) {
        if (!items[index].disabled) return index;
      }
      return -1;
    }, []);

    // Open dropdown and determine its position
    const openDropdown = useCallback(() => {
      if (disabled || isOpen) return;

      const trigger = dropdownRef.current?.querySelector("button");
      if (trigger) {
        const rect = trigger.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        setMenuPlacement(
          spaceBelow < 260 && spaceAbove > spaceBelow ? "top" : "bottom",
        );
      }

      setSearchTerm("");
      setActiveIndex(
        selectedIndex >= 0
          ? selectedIndex
          : getFirstEnabledIndex(filteredOptions),
      );
      setIsOpen(true);
    }, [
      disabled,
      isOpen,
      selectedIndex,
      getFirstEnabledIndex,
      filteredOptions,
    ]);

    // Close dropdown
    const closeDropdown = useCallback(() => {
      setIsOpen(false);
      setSearchTerm("");
      setIndicator((current) => ({ ...current, visible: false }));
    }, []);

    // Toggle dropdown
    const toggleDropdown = useCallback(() => {
      if (disabled) return;

      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }, [disabled, isOpen, closeDropdown, openDropdown]);

    // Select an option
    const selectOption = useCallback(
      (option: DropdownOption) => {
        if (option.disabled) return;

        if (!isControlled) {
          setInternalValue(option.value);
        }

        onChange?.(option.value);
        closeDropdown();
      },
      [isControlled, onChange, closeDropdown],
    );

    // Move the active option while skipping disabled options
    const moveActiveOption = useCallback(
      (direction: 1 | -1) => {
        if (filteredOptions.length === 0) return;

        let nextIndex = activeIndex;

        for (let step = 0; step < filteredOptions.length; step += 1) {
          nextIndex += direction;

          if (nextIndex < 0) {
            nextIndex = filteredOptions.length - 1;
          } else if (nextIndex >= filteredOptions.length) {
            nextIndex = 0;
          }

          if (!filteredOptions[nextIndex].disabled) {
            setActiveIndex(nextIndex);
            return;
          }
        }
      },
      [activeIndex, filteredOptions],
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        if (disabled) return;

        if (!isOpen) {
          if (
            event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            openDropdown();
          }
          return;
        }

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            moveActiveOption(1);
            break;

          case "ArrowUp":
            event.preventDefault();
            moveActiveOption(-1);
            break;

          case "Home":
            event.preventDefault();
            setActiveIndex(getFirstEnabledIndex(filteredOptions));
            break;

          case "End":
            event.preventDefault();
            setActiveIndex(getLastEnabledIndex(filteredOptions));
            break;

          case "Enter":
          case " ":
            event.preventDefault();
            if (activeIndex >= 0 && filteredOptions[activeIndex]) {
              selectOption(filteredOptions[activeIndex]);
            }
            break;

          case "Escape":
            event.preventDefault();
            closeDropdown();
            break;

          case "Tab":
            closeDropdown();
            break;

          default: {
            if (
              !searchable &&
              event.key.length === 1 &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.altKey
            ) {
              const now = Date.now();
              const previous = typeaheadRef.current;
              const nextValue =
                now - previous.time > 700
                  ? event.key.toLowerCase()
                  : previous.value + event.key.toLowerCase();

              typeaheadRef.current = { value: nextValue, time: now };

              const matchIndex = filteredOptions.findIndex(
                (option) =>
                  !option.disabled &&
                  option.label.toLowerCase().startsWith(nextValue),
              );

              if (matchIndex >= 0) {
                setActiveIndex(matchIndex);
              }
            }
          }
        }
      },
      [
        disabled,
        isOpen,
        openDropdown,
        moveActiveOption,
        getFirstEnabledIndex,
        getLastEnabledIndex,
        filteredOptions,
        activeIndex,
        selectOption,
        closeDropdown,
        searchable,
      ],
    );

    // Close dropdown when clicking outside
    useEffect(() => {
      const handlePointerDown = (event: PointerEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          closeDropdown();
        }
      };

      if (isOpen) {
        document.addEventListener("pointerdown", handlePointerDown);
      }

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
      };
    }, [isOpen, closeDropdown]);

    // Focus search input when opened
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Keep the active option visible while navigating
    useEffect(() => {
      if (!isOpen || activeIndex < 0) return;

      const activeOption = optionsListRef.current?.querySelector<HTMLElement>(
        `[data-option-index="${activeIndex}"]`,
      );

      activeOption?.scrollIntoView({ block: "nearest" });
    }, [isOpen, activeIndex, filteredOptions]);

    // Measure the active option for the gliding selection surface
    useLayoutEffect(() => {
      if (!isOpen || activeIndex < 0) {
        setIndicator((current) =>
          current.visible ? { ...current, visible: false } : current,
        );
        return;
      }

      const list = optionsListRef.current;
      const activeOption = list?.querySelector<HTMLElement>(
        `[data-option-index="${activeIndex}"]`,
      );

      if (!list || !activeOption || filteredOptions[activeIndex]?.disabled) {
        setIndicator((current) =>
          current.visible ? { ...current, visible: false } : current,
        );
        return;
      }

      const nextIndicator = {
        top: activeOption.offsetTop,
        height: activeOption.offsetHeight,
        visible: true,
      };

      setIndicator((current) =>
        current.top === nextIndicator.top &&
        current.height === nextIndicator.height &&
        current.visible === nextIndicator.visible
          ? current
          : nextIndicator,
      );
    }, [isOpen, activeIndex, filteredOptions]);

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
          <label
            id={labelId}
            htmlFor={triggerId}
            className="text-sm font-medium text-[var(--color-text-secondary)] font-sans"
          >
            {label}
          </label>
        )}

        {/* Dropdown Container */}
        <div ref={dropdownRef} className="relative w-full">
          {/* Trigger Button */}
          <button
            id={triggerId}
            type="button"
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
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
                  : "cursor-pointer bg-[var(--glass-bg)] hover:bg-[var(--color-bg-elevated)]"
              }
              ${
                error
                  ? "border border-[var(--color-danger)] focus:border-[var(--color-danger)]"
                  : "border border-[var(--glass-border-strong)] focus:border-[var(--color-primary)]"
              }
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20
              ${isOpen ? "border-[var(--color-primary)]" : ""}
            `}
            aria-labelledby={label ? labelId : undefined}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-expanded={isOpen}
            aria-disabled={disabled}
            aria-activedescendant={
              isOpen && activeIndex >= 0
                ? `${dropdownId}-option-${activeIndex}`
                : undefined
            }
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
              <span className="truncate" dir="auto">
                {displayLabel}
              </span>
            </span>
            <span
              className={`
                transition-transform duration-[var(--transition-med)] ease-[var(--ease-in-out)]
                ${isOpen ? "rotate-180" : "rotate-0"}
                text-[var(--color-text-tertiary)]
                flex-shrink-0
              `}
              aria-hidden="true"
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
            aria-hidden={!isOpen}
            className={`
              z-50 absolute w-full
              ${menuPlacement === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5"}
              rounded-[var(--radius-md)] p-1.5
              transition-[opacity,transform,visibility] duration-200
              ease-[var(--ease-in-out)]
              ${
                isOpen
                  ? "opacity-100 translate-y-0 scale-100 visible pointer-events-auto"
                  : `opacity-0 scale-[0.98] invisible pointer-events-none ${
                      menuPlacement === "bottom"
                        ? "-translate-y-1.5"
                        : "translate-y-1.5"
                    }`
              }
            `}
            style={{
              ...menuSurface,
              zIndex: 50,
              transformOrigin:
                menuPlacement === "bottom" ? "top center" : "bottom center",
            }}
          >
            {/* Search Input */}
            {searchable && (
              <div className="px-1 pb-2 mb-1 border-b border-[var(--glass-border-strong)]">
                <label htmlFor={`${dropdownId}-search`} className="sr-only">
                  {searchPlaceholder}
                </label>
                <input
                  ref={searchInputRef}
                  id={`${dropdownId}-search`}
                  type="text"
                  role="searchbox"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={searchPlaceholder}
                  className={`
                    w-full font-sans
                    text-[var(--color-text-primary)]
                    placeholder:text-[var(--color-text-tertiary)]
                    border border-[var(--glass-border-strong)]
                    rounded-[var(--radius-sm)]
                    outline-none
                    focus:border-[var(--color-primary)]
                    focus:ring-2 focus:ring-[var(--color-primary)]/15
                    transition-colors duration-150
                    ${sizeStyles[size].search}
                  `}
                  style={{
                    background:
                      "color-mix(in srgb, var(--color-bg-tertiary) 55%, transparent)",
                  }}
                  onClick={(event) => event.stopPropagation()}
                />
              </div>
            )}

            {/* Options */}
            <div
              ref={optionsListRef}
              id={listboxId}
              className="relative max-h-56 overflow-y-auto overscroll-contain py-0.5"
              role="listbox"
              aria-label={label || "Dropdown options"}
            >
              {filteredOptions.length === 0 ? (
                <div
                  className={`${sizeStyles[size].option} text-[var(--color-text-tertiary)] text-center`}
                >
                  No options found
                </div>
              ) : (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute left-1 right-1 rounded-[calc(var(--radius-md)-2px)] pointer-events-none"
                    style={{
                      ...selectionSurface,
                      top: indicator.top,
                      height: indicator.height,
                      opacity: isOpen && indicator.visible ? 1 : 0,
                      transform: `translateY(0)`,
                      transition:
                        "top 240ms cubic-bezier(0.2, 0.8, 0.2, 1), height 180ms ease, opacity 140ms ease",
                    }}
                  />

                  {filteredOptions.map((option, index) => {
                    const isSelected = option.value === selectedValue;
                    const isActive = index === activeIndex;

                    return (
                      <div
                        key={option.value}
                        id={`${dropdownId}-option-${index}`}
                        data-option-index={index}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={option.disabled || undefined}
                        onClick={() => selectOption(option)}
                        onMouseEnter={() => {
                          if (!option.disabled) setActiveIndex(index);
                        }}
                        className={`
                          relative z-[1] w-full flex items-center gap-2 text-left
                          rounded-[calc(var(--radius-md)-2px)]
                          ${sizeStyles[size].option}
                          transition-colors duration-150
                          ${
                            option.disabled
                              ? "opacity-40 cursor-not-allowed"
                              : "cursor-pointer"
                          }
                          ${
                            isSelected
                              ? "text-[var(--color-primary)]"
                              : "text-[var(--color-text-primary)]"
                          }
                          ${
                            isActive
                              ? ""
                              : "hover:bg-[var(--color-bg-elevated)]/30"
                          }
                        `}
                      >
                        {option.icon && (
                          <span
                            className="flex-shrink-0 inline-flex"
                            aria-hidden="true"
                          >
                            {option.icon}
                          </span>
                        )}
                        <span className="min-w-0 flex-1 truncate" dir="auto">
                          {option.label}
                        </span>
                        {isSelected && (
                          <span
                            className="ml-auto text-[var(--color-primary)] flex-shrink-0"
                            aria-hidden="true"
                          >
                            <svg
                              className={`${iconSizes[size]} opacity-90`}
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
                      </div>
                    );
                  })}
                </>
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
