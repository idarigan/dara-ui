import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export interface TabItem {
  label: string;
  content: React.ReactNode;
  value?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeValue?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
  glowColor?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "danger"
    | "none";
  fullWidth?: boolean;
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
  const isControlled = controlledActiveValue !== undefined;
  const [internalActiveValue, setInternalActiveValue] = useState<string>(
    defaultValue || items[0]?.value || items[0]?.label || "",
  );

  const activeValue = isControlled
    ? controlledActiveValue
    : internalActiveValue;
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const indicatorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const getTabValue = (item: TabItem, index: number): string => {
    return item.value || item.label || `tab-${index}`;
  };

  const handleTabChange = useCallback(
    (value: string) => {
      if (!isControlled) {
        setInternalActiveValue(value);
      }
      onChange?.(value);
    },
    [isControlled, onChange],
  );

  const updateIndicator = useCallback(() => {
    // Clear any pending indicator update
    if (indicatorTimeoutRef.current) {
      clearTimeout(indicatorTimeoutRef.current);
      indicatorTimeoutRef.current = null;
    }

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      if (activeTabRef.current && tabsRef.current) {
        const tabRect = activeTabRef.current.getBoundingClientRect();
        const containerRect = tabsRef.current.getBoundingClientRect();

        // Only update if values changed to prevent unnecessary re-renders
        const newLeft = tabRect.left - containerRect.left;
        const newWidth = tabRect.width;

        setIndicatorStyle((prev) => {
          if (prev.left === newLeft && prev.width === newWidth) {
            return prev;
          }
          return {
            left: newLeft,
            width: newWidth,
          };
        });
      }
    });
  }, []);

  // Update indicator when active value changes
  useEffect(() => {
    // Skip first render to avoid double rendering
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Still need to set initial indicator
      setTimeout(updateIndicator, 100);
      return;
    }

    // Small delay to ensure DOM is updated
    indicatorTimeoutRef.current = setTimeout(() => {
      updateIndicator();
    }, 30);

    return () => {
      if (indicatorTimeoutRef.current) {
        clearTimeout(indicatorTimeoutRef.current);
        indicatorTimeoutRef.current = null;
      }
    };
  }, [activeValue, items, updateIndicator]);

  // Handle resize with debounce
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        updateIndicator();
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    // Also update on orientation change
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
    };
  }, [updateIndicator]);

  // Size styles
  const sizeStyles = useMemo(
    () => ({
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-2.5 text-lg",
    }),
    [],
  );

  // Glow styles
  const glowStyles = useMemo(
    () => ({
      primary: "bg-[var(--color-primary)] shadow-[var(--shadow-glow-primary)]",
      secondary:
        "bg-[var(--color-secondary)] shadow-[var(--shadow-glow-secondary)]",
      accent: "bg-[var(--color-accent)] shadow-[var(--shadow-glow-accent)]",
      success: "bg-[var(--color-success)] shadow-[var(--shadow-glow-success)]",
      danger: "bg-[var(--color-danger)] shadow-[var(--shadow-glow-danger)]",
      none: "bg-[var(--color-border-primary)]",
    }),
    [],
  );

  const alignStyles = useMemo(
    () => ({
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    }),
    [],
  );

  // Get current active content with memoization
  const activeContent = useMemo(() => {
    return items.find((item, index) => getTabValue(item, index) === activeValue)
      ?.content;
  }, [items, activeValue]);

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={tabsRef}
        className={`
          relative flex border-b border-white/10
          ${alignStyles[align]}
          ${fullWidth ? "w-full" : ""}
        `}
        role="tablist"
      >
        {items.map((item, index) => {
          const value = getTabValue(item, index);
          const isActive = value === activeValue;

          return (
            <button
              key={value}
              ref={isActive ? activeTabRef : null}
              className={`
                relative flex items-center gap-2 font-medium font-sans
                transition-all duration-150
                rounded-t-[--radius-md]
                ${sizeStyles[size]}
                ${fullWidth ? "flex-1 justify-center" : ""}
                ${isActive ? "text-white" : "text-white/55 hover:text-white"}
                ${item.disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5cff]
                hover:bg-white/5
                select-none
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
        })}

        {/* Animated underline */}
        <div
          className={`
            absolute bottom-0 h-0.5 rounded-full
            transition-all duration-300 ease-[var(--ease-in-out)]
            ${glowStyles[glowColor]}
            will-change-transform
          `}
          style={{
            ...indicatorStyle,
            opacity: indicatorStyle.width ? 1 : 0,
          }}
        />
      </div>

      {/* Content with smooth crossfade animation */}
      <div className="pt-4 relative min-h-[60px] overflow-hidden">
        <div
          key={activeValue}
          className="
            transition-all duration-300 ease-[var(--ease-in-out)]
            animate-fade-slide-in
            will-change-transform
          "
        >
          {activeContent}
        </div>
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-slide-in {
          animation: fadeSlideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

Tabs.displayName = "Tabs";
export default Tabs;
