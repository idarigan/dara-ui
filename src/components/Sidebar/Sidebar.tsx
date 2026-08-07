import React, { useState, useRef, useEffect, useCallback } from "react";

export interface SidebarItem {
  /**
   * Unique identifier for the item
   */
  id: string;
  /**
   * Display label
   */
  label: string;
  /**
   * Icon element
   */
  icon?: React.ReactNode;
  /**
   * Whether the item is active
   */
  active?: boolean;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Sub-items for nested navigation
   */
  subItems?: SidebarItem[];
  /**
   * Optional badge text or number
   */
  badge?: string | number;
  /**
   * Optional href for link mode
   */
  href?: string;
  /**
   * Content to render when this item is selected (for demo/application)
   */
  content?: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
}

export interface SidebarGroup {
  /**
   * Group label
   */
  label: string;
  /**
   * Group icon
   */
  icon?: React.ReactNode;
  /**
   * Items in this group
   */
  items: SidebarItem[];
  /**
   * Whether the group is expanded (collapsible)
   */
  defaultExpanded?: boolean;
}

export interface SidebarProps {
  /**
   * Sidebar brand/logo
   */
  brand?: React.ReactNode;
  /**
   * Groups of sidebar items
   */
  groups: SidebarGroup[];
  /**
   * Whether the sidebar is collapsible
   * @default true
   */
  collapsible?: boolean;
  /**
   * Initially collapsed state
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Controlled collapsed state
   */
  collapsed?: boolean;
  /**
   * Callback when collapse state changes
   */
  onCollapseChange?: (collapsed: boolean) => void;
  /**
   * Icon-only mode (hides labels, shows icons only)
   * @default false
   */
  iconOnly?: boolean;
  /**
   * Whether to show group labels
   * @default true
   */
  showGroupLabels?: boolean;
  /**
   * Active item ID (controlled)
   */
  activeItemId?: string;
  /**
   * Default active item ID (uncontrolled)
   */
  defaultActiveItemId?: string;
  /**
   * Callback when an item is clicked
   */
  onItemClick?: (itemId: string) => void;
  /**
   * Width of the sidebar when expanded
   * @default "260px"
   */
  expandedWidth?: string;
  /**
   * Width of the sidebar when collapsed
   * @default "64px"
   */
  collapsedWidth?: string;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Footer content
   */
  footer?: React.ReactNode;
}

/**
 * Dara UI Sidebar - Collapsible navigation with groups and sub-menus
 *
 * Features:
 * - Collapsible with icon-only mode
 * - Groups with expandable sections
 * - Sub-menus (nested items)
 * - Active state with visual indicator
 * - RTL support
 * - Keyboard accessible
 * - Smooth animations
 * - Glass morphism styling
 */
export const Sidebar: React.FC<SidebarProps> = ({
  brand,
  groups = [],
  collapsible = true,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapseChange,
  iconOnly = false,
  showGroupLabels = true,
  activeItemId: controlledActiveId,
  defaultActiveItemId,
  onItemClick,
  expandedWidth = "260px",
  collapsedWidth = "64px",
  className = "",
  footer,
}) => {
  // ----- Collapse state -----
  const isControlledCollapse = controlledCollapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = isControlledCollapse
    ? controlledCollapsed
    : internalCollapsed;

  // Effectively icon-only when collapsed or explicitly set
  const isIconOnly = iconOnly || isCollapsed;

  // ----- Active item state -----
  const isControlledActive = controlledActiveId !== undefined;
  const [internalActiveId, setInternalActiveId] = useState<string | undefined>(
    defaultActiveItemId || groups[0]?.items[0]?.id,
  );
  const activeId = isControlledActive ? controlledActiveId : internalActiveId;

  // ----- Expanded groups state -----
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    groups.forEach((group, index) => {
      if (group.defaultExpanded !== false) {
        initial.add(`group-${index}`);
      }
    });
    return initial;
  });

  // ----- Expanded sub-items state -----
  const [expandedSubItems, setExpandedSubItems] = useState<Set<string>>(
    new Set(),
  );

  // ----- RTL detection (using useRef to avoid hydration mismatches) -----
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);

  // ----- Toggle collapse -----
  const toggleCollapse = useCallback(() => {
    if (!collapsible) return;
    const newState = !isCollapsed;
    if (!isControlledCollapse) {
      setInternalCollapsed(newState);
    }
    onCollapseChange?.(newState);
  }, [collapsible, isCollapsed, isControlledCollapse, onCollapseChange]);

  // ----- Toggle group expansion -----
  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  }, []);

  // ----- Toggle sub-items expansion -----
  const toggleSubItems = useCallback((key: string) => {
    setExpandedSubItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  // ----- Handle item click -----
  const handleItemClick = useCallback(
    (itemId: string, onClick?: () => void) => {
      if (!isControlledActive) {
        setInternalActiveId(itemId);
      }
      onItemClick?.(itemId);
      onClick?.();
    },
    [isControlledActive, onItemClick],
  );

  // ----- Render a single item -----
  const renderItem = (
    item: SidebarItem,
    depth: number = 0,
    parentId?: string,
  ) => {
    const isActive = activeId === item.id;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const subKey = `${parentId || item.id}-sub`;
    const isSubExpanded = expandedSubItems.has(subKey);

    const depthPadding = isIconOnly ? 0 : depth * 16;

    // Icon-only mode: hide labels, show only icons
    if (isIconOnly) {
      return (
        <div key={item.id} className="relative">
          <button
            onClick={() => handleItemClick(item.id, item.onClick)}
            disabled={item.disabled}
            className={`
              w-full flex items-center justify-center
              px-2 py-3 rounded-[var(--radius-md)]
              transition-all duration-180
              relative
              ${
                item.disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[var(--color-bg-elevated)]/40 cursor-pointer"
              }
              ${isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}
              ${isActive ? "bg-[var(--color-primary-light)]" : ""}
              group
            `}
            title={item.label}
            aria-current={isActive ? "page" : undefined}
            aria-disabled={item.disabled}
          >
            {item.icon && (
              <span className="flex-shrink-0 text-current w-5 h-5">
                {item.icon}
              </span>
            )}
            {item.badge && (
              <span
                className={`
                  absolute -top-0.5 ${isRTL ? "-left-0.5" : "-right-0.5"}
                  flex items-center justify-center
                  min-w-[18px] h-[18px] px-1
                  text-[9px] font-bold
                  rounded-full
                  bg-[var(--color-danger)]
                  text-white
                `}
              >
                {item.badge}
              </span>
            )}
            {/* Active indicator - only show when active */}
            {isActive && (
              <span
                className={`
                  absolute
                  ${isRTL ? "right-0" : "left-0"}
                  top-1/2 -translate-y-1/2
                  w-0.5 h-6
                  rounded-full
                  bg-[var(--color-primary)]
                  shadow-[var(--shadow-glow-primary)]
                `}
              />
            )}
          </button>
        </div>
      );
    }

    // Full mode with labels
    return (
      <div key={item.id} className="relative">
        <button
          onClick={() => {
            if (hasSubItems) {
              toggleSubItems(subKey);
            } else {
              handleItemClick(item.id, item.onClick);
            }
          }}
          disabled={item.disabled}
          className={`
            w-full flex items-center gap-3
            px-3 py-2.5 rounded-[var(--radius-md)]
            transition-all duration-180
            text-sm font-medium
            relative
            ${
              item.disabled
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[var(--color-bg-elevated)]/40 cursor-pointer"
            }
            ${isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}
            ${isActive ? "bg-[var(--color-primary-light)]" : ""}
            group
          `}
          style={{
            paddingLeft: isRTL ? `${16}px` : `${16 + depthPadding}px`,
            paddingRight: isRTL ? `${16 + depthPadding}px` : `${16}px`,
          }}
          aria-current={isActive ? "page" : undefined}
          aria-disabled={item.disabled}
          aria-expanded={hasSubItems ? isSubExpanded : undefined}
        >
          {item.icon && (
            <span className="flex-shrink-0 text-current w-5 h-5">
              {item.icon}
            </span>
          )}
          <span
            className={`
              flex-1 truncate text-left
              ${isRTL ? "text-right" : "text-left"}
            `}
          >
            {item.label}
          </span>
          {item.badge && (
            <span
              className={`
                flex-shrink-0
                text-[10px] font-bold
                px-2 py-0.5 rounded-full
                ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"
                }
              `}
            >
              {item.badge}
            </span>
          )}
          {hasSubItems && (
            <span
              className={`
                flex-shrink-0
                transition-transform duration-250
                text-[var(--color-text-tertiary)]
                ${isSubExpanded ? (isRTL ? "-rotate-90" : "rotate-90") : "rotate-0"}
              `}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          )}
          {/* Active indicator - only show when active */}
          {isActive && (
            <span
              className={`
                absolute
                ${isRTL ? "right-0" : "left-0"}
                top-1/2 -translate-y-1/2
                w-0.5 h-6
                rounded-full
                bg-[var(--color-primary)]
                shadow-[var(--shadow-glow-primary)]
              `}
            />
          )}
        </button>

        {/* Sub-items */}
        {hasSubItems && isSubExpanded && !isIconOnly && (
          <div
            className={`
              relative
              ${isRTL ? "mr-4 pr-4 border-r" : "ml-4 pl-4 border-l"}
              border-[var(--color-border-secondary)]
              space-y-0.5
            `}
          >
            {item.subItems!.map((subItem) =>
              renderItem(subItem, depth + 1, item.id),
            )}
          </div>
        )}
      </div>
    );
  };

  // ----- Render a group -----
  const renderGroup = (group: SidebarGroup, index: number) => {
    const groupKey = `group-${index}`;
    const isExpanded = expandedGroups.has(groupKey);

    // Icon-only mode: show only group items, no group labels
    if (isIconOnly) {
      return (
        <div key={groupKey} className="space-y-1">
          {group.items.map((item) => renderItem(item))}
        </div>
      );
    }

    return (
      <div key={groupKey} className="mb-2">
        {/* Group header - collapsible */}
        {showGroupLabels && (
          <button
            onClick={() => toggleGroup(groupKey)}
            className={`
              w-full flex items-center gap-2
              px-3 py-2
              text-xs font-mono uppercase tracking-wider
              text-[var(--color-text-tertiary)]
              hover:text-[var(--color-text-secondary)]
              transition-colors duration-180
              rounded-[var(--radius-sm)]
              hover:bg-[var(--color-bg-elevated)]/20
              ${isRTL ? "flex-row-reverse" : ""}
            `}
          >
            {group.icon && (
              <span className="flex-shrink-0 w-4 h-4">{group.icon}</span>
            )}
            <span className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
              {group.label}
            </span>
            <span
              className={`
                transition-transform duration-250
                ${isExpanded ? "rotate-180" : "rotate-0"}
              `}
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>
        )}

        {/* Group items */}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-[var(--ease-in-out)]
            ${isExpanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="space-y-1 py-1">
            {group.items.map((item) => renderItem(item))}
          </div>
        </div>
      </div>
    );
  };

  // ----- Keyboard shortcut: Ctrl+B to toggle -----
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggleCollapse();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleCollapse]);

  // Get active item's content
  const getActiveContent = (): React.ReactNode => {
    for (const group of groups) {
      for (const item of group.items) {
        if (item.id === activeId) {
          return item.content;
        }
        if (item.subItems) {
          for (const subItem of item.subItems) {
            if (subItem.id === activeId) {
              return subItem.content;
            }
          }
        }
      }
    }
    return null;
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 z-40
          h-full
          bg-[var(--color-bg-secondary)]/95
          backdrop-blur-[20px]
          border-r border-[var(--color-border-primary)]
          transition-all duration-300 ease-[var(--ease-in-out)]
          flex flex-col
          ${isRTL ? "border-l border-r-0" : "border-r"}
          ${className}
        `}
        style={{
          width: isCollapsed ? collapsedWidth : expandedWidth,
          [isRTL ? "right" : "left"]: 0,
        }}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {/* ----- Brand ----- */}
        {brand && (
          <div
            className={`
              flex items-center gap-3
              px-4 py-4
              border-b border-[var(--color-border-primary)]
              min-h-[64px]
              ${isCollapsed ? "justify-center" : ""}
              ${isRTL ? "flex-row-reverse" : ""}
            `}
          >
            {brand}
          </div>
        )}

        {/* ----- Navigation with custom scrollbar ----- */}
        <nav
          className="flex-1 overflow-y-auto p-3 space-y-2"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--color-border-primary) transparent",
          }}
        >
          <style>{`
            .sidebar-scroll::-webkit-scrollbar {
              width: 4px;
            }
            .sidebar-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .sidebar-scroll::-webkit-scrollbar-thumb {
              background: var(--color-border-primary);
              border-radius: 4px;
            }
            .sidebar-scroll::-webkit-scrollbar-thumb:hover {
              background: var(--color-text-tertiary);
            }
          `}</style>
          <div className="sidebar-scroll h-full">
            {groups.map((group, index) => renderGroup(group, index))}
          </div>
        </nav>

        {/* ----- Footer ----- */}
        {footer && (
          <div
            className={`
              border-t border-[var(--color-border-primary)]
              p-3
              ${isCollapsed ? "flex justify-center" : ""}
              ${isRTL ? "flex-row-reverse" : ""}
            `}
          >
            {footer}
          </div>
        )}

        {/* ----- Collapse Toggle Button ----- */}
        {collapsible && (
          <button
            onClick={toggleCollapse}
            className={`
              absolute bottom-4
              ${isRTL ? "left-3" : "right-3"}
              w-8 h-8
              rounded-full
              glass
              flex items-center justify-center
              text-[var(--color-text-secondary)]
              hover:text-[var(--color-text-primary)]
              hover:bg-[var(--color-bg-elevated)]/40
              transition-all duration-180
              z-10
              group
            `}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={`${isCollapsed ? "Expand" : "Collapse"} (Ctrl+B)`}
          >
            <svg
              className={`
                h-4 w-4
                transition-transform duration-300
                ${isCollapsed ? (isRTL ? "rotate-180" : "rotate-0") : isRTL ? "rotate-0" : "rotate-180"}
              `}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              />
            </svg>
          </button>
        )}
      </aside>

      {/* ----- Content Area ----- */}
      <div
        className="transition-all duration-300 ease-[var(--ease-in-out)] p-8"
        style={{
          marginLeft: isRTL
            ? "0"
            : isCollapsed
              ? collapsedWidth
              : expandedWidth,
          marginRight: isRTL
            ? isCollapsed
              ? collapsedWidth
              : expandedWidth
            : "0",
        }}
      >
        {getActiveContent() || (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <p className="text-[var(--color-text-tertiary)] text-center">
              Select an item from the sidebar to see its content.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

Sidebar.displayName = "Sidebar";
export default Sidebar;
