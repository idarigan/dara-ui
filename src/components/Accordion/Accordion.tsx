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

/**
 * Dara UI Accordion - matching original demo styling
 * Uses simple max-height animation like the original
 */
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

  // Size styles - from original demo
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

  return (
    <div className={`${glass ? "glass" : ""} overflow-hidden ${className}`}>
      {items.map((item, index) => {
        const isOpen = openItems.includes(item.id);
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        const isOnly = items.length === 1;

        let radiusClass = "";
        if (isOnly) radiusClass = "rounded-[--radius-md]";
        else if (isFirst) radiusClass = "rounded-t-[--radius-md]";
        else if (isLast) radiusClass = "rounded-b-[--radius-md]";

        // Glass styles from original demo
        const glassStyles = glass
          ? "glass hover:bg-white/10"
          : "bg-[#1a2332] hover:bg-[#1f2a3f]";

        return (
          <div
            key={item.id}
            className={`
              border-b border-white/5 last:border-b-0
              transition-colors duration-180
              ${radiusClass}
            `}
          >
            {/* Trigger button - matches original demo */}
            <button
              onClick={() => toggleItem(item.id)}
              disabled={item.disabled}
              className={`
                w-full flex items-center justify-between
                font-heading font-semibold
                transition-colors duration-180
                ${sizeStyles[size]}
                ${glassStyles}
                ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${isOpen ? "text-[#7c5cff]" : "text-white"}
                hover:bg-white/5
                focus:outline-none
              `}
              aria-expanded={isOpen}
              aria-disabled={item.disabled}
            >
              <span>{item.title}</span>
              <span
                className={`
                  transition-transform duration-250 text-white/40
                  ${isOpen ? "rotate-180" : "rotate-0"}
                `}
              >
                ▾
              </span>
            </button>

            {/* Content */}
            <div
              className={`
                accordion-content
                ${isOpen ? "open" : ""}
              `}
            >
              <div className={`${contentSizeStyles[size]} text-white/50`}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

Accordion.displayName = "Accordion";
export default Accordion;
