import React, { useState, useRef, useEffect } from "react";

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

  const getTabValue = (item: TabItem, index: number): string => {
    return item.value || item.label || `tab-${index}`;
  };

  const handleTabChange = (value: string) => {
    if (!isControlled) {
      setInternalActiveValue(value);
    }
    onChange?.(value);
  };

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

  useEffect(() => {
    const timeout = setTimeout(updateIndicator, 10);
    return () => clearTimeout(timeout);
  }, [activeValue, items]);

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

  // Glow styles
  const glowStyles = {
    primary: "bg-[#7c5cff] shadow-[0_0_12px_rgba(124,92,255,0.6)]",
    secondary: "bg-[#00d9ff] shadow-[0_0_12px_rgba(0,217,255,0.6)]",
    accent: "bg-[#ff4d9d] shadow-[0_0_12px_rgba(255,77,157,0.6)]",
    success: "bg-[#00ff99] shadow-[0_0_12px_rgba(0,255,153,0.6)]",
    danger: "bg-[#ff5370] shadow-[0_0_12px_rgba(255,83,112,0.6)]",
    none: "bg-[#2a3a52]",
  };

  const alignStyles = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

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
                relative flex items-center gap-2 font-medium font-body
                transition-all duration-180
                rounded-t-[--radius-md]
                ${sizeStyles[size]}
                ${fullWidth ? "flex-1 justify-center" : ""}
                ${isActive ? "text-white" : "text-white/55 hover:text-white"}
                ${item.disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5cff]
                hover:bg-white/5
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
            transition-all duration-220 ease-[var(--ease-in-out)]
            ${glowStyles[glowColor]}
          `}
          style={{
            ...indicatorStyle,
            opacity: indicatorStyle.width ? 1 : 0,
          }}
        />
      </div>

      <div className="pt-4 relative">
        {items.map((item, index) => {
          const value = getTabValue(item, index);
          const isActive = value === activeValue;
          return (
            <div
              key={value}
              className={`
                transition-all duration-220 ease-[var(--ease-in-out)]
                ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 absolute pointer-events-none"}
              `}
              role="tabpanel"
              aria-hidden={!isActive}
              style={{
                display: isActive ? "block" : "none",
              }}
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
