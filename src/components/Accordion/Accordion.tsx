import React, { useState, useCallback, useRef, useEffect } from "react";

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
 * Dara UI Accordion
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

  // Store refs for each content panel to measure height
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [contentHeights, setContentHeights] = useState<Record<string, number>>(
    {},
  );

  // Toggle accordion item
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

  // Measure content heights when items change
  useEffect(() => {
    const heights: Record<string, number> = {};
    items.forEach((item) => {
      const el = contentRefs.current.get(item.id);
      if (el) {
        // Force a reflow to get accurate scrollHeight
        el.style.maxHeight = "none";
        heights[item.id] = el.scrollHeight;
        // Reset max-height so the transition works
        el.style.maxHeight = "0px";
      }
    });
    setContentHeights(heights);
  }, [items]);

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const contentSizeStyles = {
    sm: "px-5 py-3 text-sm",
    md: "px-6 py-4 text-base",
    lg: "px-8 py-6 text-lg",
  };

  return (
    <div className={`${glass ? "glass" : ""} overflow-hidden ${className}`}>
      {items.map((item, index) => {
        const isOpen = openItems.includes(item.id);
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        const isOnly = items.length === 1;
        const contentHeight = contentHeights[item.id] || 0;

        let radiusClass = "";
        if (isOnly) radiusClass = "rounded-[--radius-md]";
        else if (isFirst) radiusClass = "rounded-t-[--radius-md]";
        else if (isLast) radiusClass = "rounded-b-[--radius-md]";

        return (
          <div
            key={item.id}
            className={`
              border-b border-[var(--color-border-secondary)] last:border-b-0
              transition-colors duration-180
              ${radiusClass}
            `}
          >
            {/* Trigger button */}
            <button
              onClick={() => toggleItem(item.id)}
              disabled={item.disabled}
              className={`
                w-full flex items-center justify-between
                font-heading font-semibold
                transition-colors duration-180
                ${sizeStyles[size]}
                ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${isOpen ? "text-[var(--color-primary)]" : "text-[var(--color-text-primary)]"}
                hover:bg-[var(--color-bg-elevated)]/30
                focus:outline-none
              `}
              aria-expanded={isOpen}
              aria-disabled={item.disabled}
            >
              <span className="flex items-center gap-2">
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                {item.title}
              </span>
              <span
                className={`
                  transition-transform duration-250 text-[var(--color-text-secondary)]
                  ${isOpen ? "rotate-180" : "rotate-0"}
                `}
                aria-hidden="true"
              >
                <svg
                  className="h-4 w-4"
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

            {/* Content - dynamic max-height based on actual content */}
            <div
              ref={(el) => {
                if (el) {
                  contentRefs.current.set(item.id, el);
                } else {
                  contentRefs.current.delete(item.id);
                }
              }}
              className={`
                overflow-hidden
                transition-[max-height,padding] duration-350 ease-[var(--ease-in-out)]
                ${isOpen ? "border-t border-[var(--color-border-secondary)]" : ""}
              `}
              style={{
                maxHeight: isOpen ? `${contentHeight}px` : "0px",
                paddingTop: isOpen ? "0" : "0",
                paddingBottom: isOpen ? "0" : "0",
              }}
            >
              <div
                className={`${contentSizeStyles[size]} text-[var(--color-text-secondary)]`}
              >
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
