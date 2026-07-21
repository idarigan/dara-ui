import React, { useState, useRef, useEffect, useCallback } from "react";

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  openItems?: string[];
  defaultOpenItems?: string[];
  onOpenChange?: (openItems: string[]) => void;
  multiple?: boolean;
  glass?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Individual accordion item with height animation
const AccordionItemComponent: React.FC<{
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  size: "sm" | "md" | "lg";
  glass: boolean;
  index: number;
  total: number;
}> = ({ item, isOpen, onToggle, size, glass, index, total }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      const timeout = setTimeout(() => {
        if (isOpen) {
          setHeight(contentRef.current?.scrollHeight || 0);
        } else {
          setHeight(0);
        }
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, item.content]);

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const contentSizeStyles = {
    sm: "px-3 pb-3 text-sm",
    md: "px-4 pb-4 text-base",
    lg: "px-6 pb-6 text-lg",
  };

  const isFirst = index === 0;
  const isLast = index === total - 1;
  const isOnly = total === 1;

  let radiusClass = "";
  if (isOnly) radiusClass = "rounded-[--radius-md]";
  else if (isFirst) radiusClass = "rounded-t-[--radius-md]";
  else if (isLast) radiusClass = "rounded-b-[--radius-md]";

  const glassStyles = glass
    ? "glass hover:bg-white/10"
    : "bg-[#1a2332] hover:bg-[#1f2a3f]";

  return (
    <div
      className={`border-b border-white/5 last:border-b-0 transition-colors duration-180 ${radiusClass}`}
    >
      <button
        onClick={onToggle}
        disabled={item.disabled}
        className={`
          w-full flex items-center justify-between
          font-body font-medium
          transition-all duration-180
          ${sizeStyles[size]}
          ${glassStyles}
          ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${isOpen ? "text-[#7c5cff]" : "text-white"}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5cff]
          focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]
        `}
        aria-expanded={isOpen}
        aria-disabled={item.disabled}
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <span className={isOpen ? "text-[#7c5cff]" : "text-white/40"}>
              {item.icon}
            </span>
          )}
          <span>{item.title}</span>
        </div>
        <span
          className={`
            transition-transform duration-220 ease-[var(--ease-in-out)]
            ${isOpen ? "rotate-180" : "rotate-0"}
            text-white/40
          `}
        >
          <svg
            className="h-5 w-5"
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

      <div
        style={{
          height: height,
          overflow: "hidden",
          transition: "height var(--transition-med) ease-[var(--ease-in-out)]",
        }}
      >
        <div
          ref={contentRef}
          className={`${contentSizeStyles[size]} text-white/60`}
        >
          {item.content}
        </div>
      </div>
    </div>
  );
};

export const Accordion: React.FC<AccordionProps> = ({
  items,
  openItems: controlledOpenItems,
  defaultOpenItems = [],
  onOpenChange,
  multiple = false,
  glass = true,
  className = "",
  size = "md",
}) => {
  const isControlled = controlledOpenItems !== undefined;
  const [internalOpenItems, setInternalOpenItems] =
    useState<string[]>(defaultOpenItems);

  const openItems = isControlled ? controlledOpenItems : internalOpenItems;

  const toggleItem = useCallback(
    (id: string) => {
      let newOpenItems: string[];

      if (multiple) {
        if (openItems.includes(id)) {
          newOpenItems = openItems.filter((itemId) => itemId !== id);
        } else {
          newOpenItems = [...openItems, id];
        }
      } else {
        if (openItems.includes(id) && openItems.length === 1) {
          newOpenItems = [];
        } else {
          newOpenItems = [id];
        }
      }

      if (!isControlled) {
        setInternalOpenItems(newOpenItems);
      }
      onOpenChange?.(newOpenItems);
    },
    [openItems, multiple, isControlled, onOpenChange],
  );

  return (
    <div className={`${glass ? "glass" : ""} overflow-hidden ${className}`}>
      {items.map((item, index) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          isOpen={openItems.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
          size={size}
          glass={glass}
          index={index}
          total={items.length}
        />
      ))}
    </div>
  );
};

Accordion.displayName = "Accordion";
export default Accordion;
