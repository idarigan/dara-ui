import React, { useState, useRef, useEffect } from "react";

export interface TabItem {
  /**
   * Tab label
   */
  label: string;
  /**
   * Tab content
   */
  content: React.ReactNode;
  /**
   * Optional tab value (defaults to label)
   */
  value?: string;
  /**
   * Optional icon
   */
  icon?: React.ReactNode;
  /**
   * Disabled state
   */
  disabled?: boolean;
}

export interface TabsProps {
  /**
   * Array of tab items
   */
  items: TabItem[];
  /**
   * Active tab value (controlled mode)
   */
  activeValue?: string;
  /**
   * Default active tab value (uncontrolled mode)
   */
  defaultValue?: string;
  /**
   * Callback when tab changes
   */
  onChange?: (value: string) => void;
  /**
   * Tab alignment
   * @default "left"
   */
  align?: "left" | "center" | "right";
  /**
   * Tab size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Glow color for active indicator
   * @default "primary"
   */
  glowColor?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "danger"
    | "none";
  /**
   * If true, tabs will take full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Additional className for the container
   */
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeValue: controlledActiveValue,
  defaultValue,
  onChange,
  align = "left",
  size = "md",
  glowColor = "primary",
  fullWidth = false,
  className = "",
}) => {
  // Determine if controlled or uncontrolled
  const isControlled = controlledActiveValue !== undefined;
  const [internalActiveValue, setInternalActiveValue] = useState<string>(
    defaultValue || items[0]?.value || items[0]?.label || "",
  );
  const [prevActiveValue, setPrevActiveValue] = useState<string>("");

  const activeValue = isControlled
    ? controlledActiveValue
    : internalActiveValue;
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Track previous active value for animation direction
  useEffect(() => {
    setPrevActiveValue(activeValue);
  }, [activeValue]);

  // Get tab value from item
  const getTabValue = (item: TabItem, index: number): string => {
    return item.value || item.label || `tab-${index}`;
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (!isControlled) {
      setInternalActiveValue(value);
    }
    onChange?.(value);
  };

  // Update indicator position
  const updateIndicator = () => {
    if (activeTabRef.current && tabsRef.current) {
      const tabRect = activeTabRef.current.getBoundingClientRect();
      const containerRect = tabsRef.current.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  };

  // Update indicator on mount and when active tab changes
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeout = setTimeout(updateIndicator, 10);
    return () => clearTimeout(timeout);
  }, [activeValue, items]);

  // Update indicator on resize
  useEffect(() => {
    const handleResize = () => updateIndicator();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-2.5 text-lg",
  };

  // Glow styles for indicator
  const glowStyles = {
    primary: "bg-[var(--color-primary)] shadow-[var(--shadow-glow-primary)]",
    secondary:
      "bg-[var(--color-secondary)] shadow-[var(--shadow-glow-secondary)]",
    accent: "bg-[var(--color-accent)] shadow-[var(--shadow-glow-accent)]",
    success: "bg-[var(--color-success)] shadow-[var(--shadow-glow-success)]",
    danger: "bg-[var(--color-danger)] shadow-[var(--shadow-glow-danger)]",
    none: "bg-[var(--color-border-primary)]",
  };

  // Align styles
  const alignStyles = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  // Render tab button
  const renderTabButton = (item: TabItem, index: number) => {
    const value = getTabValue(item, index);
    const isActive = value === activeValue;

    return (
      <button
        key={value}
        ref={isActive ? activeTabRef : null}
        className={`
          relative flex items-center gap-2 font-medium font-body
          transition-all duration-[var(--transition-fast)]
          rounded-t-[var(--radius-md)]
          ${sizeStyles[size]}
          ${fullWidth ? "flex-1 justify-center" : ""}
          ${
            isActive
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
          }
          ${item.disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2
          focus-visible:ring-offset-[var(--color-bg-secondary)]
          hover:bg-[var(--color-bg-tertiary)]/50
        `}
        onClick={() => !item.disabled && handleTabChange(value)}
        role="tab"
        aria-selected={isActive}
        aria-disabled={item.disabled}
        tabIndex={isActive ? 0 : -1}
        disabled={item.disabled}
      >
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab List */}
      <div
        ref={tabsRef}
        className={`
          relative flex border-b border-[var(--color-border-secondary)]
          ${alignStyles[align]}
          ${fullWidth ? "w-full" : ""}
        `}
        role="tablist"
      >
        {items.map((item, index) => renderTabButton(item, index))}

        {/* Animated Indicator */}
        <div
          className={`
            absolute bottom-0 h-0.5 rounded-full
            transition-all duration-[var(--transition-med)] ease-[var(--ease-in-out)]
            ${glowStyles[glowColor]}
          `}
          style={{
            ...indicatorStyle,
            opacity: indicatorStyle.width ? 1 : 0,
          }}
        />
      </div>

      {/* Tab Panels - Animated with height */}
      <div className="pt-4 relative">
        {items.map((item, index) => {
          const value = getTabValue(item, index);
          const isActive = value === activeValue;

          return (
            <div
              key={value}
              className={`
                transition-all duration-[var(--transition-med)] ease-[var(--ease-in-out)]
                ${
                  isActive
                    ? "opacity-100 translate-y-0 max-h-[1000px]"
                    : "opacity-0 translate-y-2 max-h-0 overflow-hidden"
                }
              `}
              role="tabpanel"
              aria-hidden={!isActive}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Tabs.displayName = "Tabs";

export default Tabs;
