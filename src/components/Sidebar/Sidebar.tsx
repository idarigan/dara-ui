import React, { useState, useEffect, useCallback } from "react";

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
   * Content to render when this item is selected
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
   * Whether the group is expanded
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
   * Icon-only mode
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
   * Width when expanded
   * @default "260px"
   */
  expandedWidth?: string;
  /**
   * Width when collapsed
   * @default "64px"
   */
  collapsedWidth?: string;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Footer content (e.g. logout button).
   * When collapsed, text labels are auto-hidden and only icons remain centered.
   */
  footer?: React.ReactNode;
  /**
   * Whether the sidebar is fixed to the viewport
   * @default false
   */
  fixed?: boolean;
  /**
   * Height of the sidebar container
   * @default "100%"
   */
  height?: string;
}

/**
 * Dara UI Sidebar - Collapsible navigation with groups and sub-menus
 *
 * Features:
 * - Collapse / expand with Ctrl+B
 * - Icon-only mode when collapsed (labels + group headers hide cleanly)
 * - Footer (logout etc.) keeps only the icon when collapsed
 * - Smooth fade when switching content panels
 * - Animated group + nested sub-menu expand/collapse
 * - Full RTL support (items, chevrons, active bar, brand, footer, borders)
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
  fixed = false,
  height = "100%",
}) => {
  const isControlledCollapse = controlledCollapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = isControlledCollapse
    ? controlledCollapsed
    : internalCollapsed;
  const isIconOnly = iconOnly || isCollapsed;

  const isControlledActive = controlledActiveId !== undefined;
  const [internalActiveId, setInternalActiveId] = useState<string | undefined>(
    defaultActiveItemId || groups[0]?.items[0]?.id,
  );
  const activeId = isControlledActive ? controlledActiveId : internalActiveId;

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    groups.forEach((group, index) => {
      if (group.defaultExpanded !== false) {
        initial.add(`group-${index}`);
      }
    });
    return initial;
  });

  const [expandedSubItems, setExpandedSubItems] = useState<Set<string>>(
    new Set(),
  );

  // Live RTL detection (updates when language changes)
  const [isRTL, setIsRTL] = useState(false);
  useEffect(() => {
    const updateDir = () => {
      setIsRTL(document.documentElement.dir === "rtl");
    };
    updateDir();
    const observer = new MutationObserver(updateDir);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
    return () => observer.disconnect();
  }, []);

  // Content fade animation
  const getActiveContent = useCallback((): React.ReactNode => {
    for (const group of groups) {
      for (const item of group.items) {
        if (item.id === activeId) return item.content;
        if (item.subItems) {
          for (const subItem of item.subItems) {
            if (subItem.id === activeId) return subItem.content;
          }
        }
      }
    }
    return null;
  }, [groups, activeId]);

  const activeContent = getActiveContent();
  const [displayedContent, setDisplayedContent] =
    useState<React.ReactNode>(activeContent);
  const [contentVisible, setContentVisible] = useState(true);

  useEffect(() => {
    if (activeContent === displayedContent) return;
    setContentVisible(false);
    const timer = setTimeout(() => {
      setDisplayedContent(activeContent);
      requestAnimationFrame(() => setContentVisible(true));
    }, 160);
    return () => clearTimeout(timer);
  }, [activeContent, displayedContent]);

  // Collapse / expand
  const toggleCollapse = useCallback(() => {
    if (!collapsible) return;
    const newState = !isCollapsed;
    if (!isControlledCollapse) setInternalCollapsed(newState);
    onCollapseChange?.(newState);
  }, [collapsible, isCollapsed, isControlledCollapse, onCollapseChange]);

  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  }, []);

  const toggleSubItems = useCallback((key: string) => {
    setExpandedSubItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleItemClick = useCallback(
    (itemId: string, onClick?: () => void) => {
      if (!isControlledActive) setInternalActiveId(itemId);
      onItemClick?.(itemId);
      onClick?.();
    },
    [isControlledActive, onItemClick],
  );

  // Ctrl+B shortcut
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

  // Render helpers
  const renderItem = (
    item: SidebarItem,
    depth: number = 0,
    parentId?: string,
  ) => {
    const isActive = activeId === item.id;
    const hasSubItems = !!(item.subItems && item.subItems.length > 0);
    const subKey = `${parentId || item.id}-sub`;
    const isSubExpanded = expandedSubItems.has(subKey);
    const depthPadding = isIconOnly ? 0 : depth * 16;

    // Icon-only (collapsed) mode
    if (isIconOnly) {
      return (
        <div key={item.id} className="relative">
          <button
            onClick={() => handleItemClick(item.id, item.onClick)}
            disabled={item.disabled}
            className={`
              w-full flex items-center justify-center
              px-2 py-3 rounded-[var(--radius-md)]
              transition-all duration-180 relative
              ${
                item.disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[var(--color-bg-elevated)]/40 cursor-pointer"
              }
              ${
                isActive
                  ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                  : "text-[var(--color-text-secondary)]"
              }
              group
            `}
            title={item.label}
            aria-current={isActive ? "page" : undefined}
            aria-disabled={item.disabled}
          >
            {item.icon && (
              <span className="flex-shrink-0 text-current w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
            )}
            {item.badge && (
              <span
                className={`
                  absolute -top-0.5 ${isRTL ? "-left-0.5" : "-right-0.5"}
                  flex items-center justify-center
                  min-w-[18px] h-[18px] px-1
                  text-[9px] font-bold rounded-full
                  bg-[var(--color-danger)] text-white
                `}
              >
                {item.badge}
              </span>
            )}
            {isActive && (
              <span
                className={`
                  absolute ${isRTL ? "right-0" : "left-0"}
                  top-1/2 -translate-y-1/2
                  w-0.5 h-6 rounded-full
                  bg-[var(--color-primary)] shadow-[var(--shadow-glow-primary)]
                `}
              />
            )}
          </button>
        </div>
      );
    }

    // Expanded mode
    return (
      <div key={item.id} className="relative">
        <button
          onClick={() => {
            if (hasSubItems) toggleSubItems(subKey);
            else handleItemClick(item.id, item.onClick);
          }}
          disabled={item.disabled}
          className={`
            w-full flex items-center gap-3
            ${isRTL ? "flex-row-reverse" : ""}
            px-3 py-2.5 rounded-[var(--radius-md)]
            transition-all duration-180
            text-sm font-medium relative
            ${
              item.disabled
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[var(--color-bg-elevated)]/40 cursor-pointer"
            }
            ${
              isActive
                ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                : "text-[var(--color-text-secondary)]"
            }
            group
          `}
          style={{
            paddingInlineStart: `${16 + depthPadding}px`,
            paddingInlineEnd: "12px",
          }}
          aria-current={isActive ? "page" : undefined}
          aria-disabled={item.disabled}
          aria-expanded={hasSubItems ? isSubExpanded : undefined}
        >
          {item.icon && (
            <span className="flex-shrink-0 text-current w-5 h-5 flex items-center justify-center">
              {item.icon}
            </span>
          )}
          <span
            className={`flex-1 truncate ${isRTL ? "text-right" : "text-left"}`}
          >
            {item.label}
          </span>
          {item.badge && (
            <span
              className={`
                flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full
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
                flex-shrink-0 transition-transform duration-250
                text-[var(--color-text-tertiary)]
                ${
                  isSubExpanded
                    ? "rotate-90"
                    : isRTL
                      ? "rotate-180"
                      : "rotate-0"
                }
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
          {isActive && (
            <span
              className={`
                absolute ${isRTL ? "right-0" : "left-0"}
                top-1/2 -translate-y-1/2
                w-0.5 h-6 rounded-full
                bg-[var(--color-primary)] shadow-[var(--shadow-glow-primary)]
              `}
            />
          )}
        </button>

        {/* Nested sub-items – same open/close animation as groups */}
        {hasSubItems && !isIconOnly && (
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-[var(--ease-in-out)]
              ${isSubExpanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div
              className={`
                relative space-y-0.5 py-1
                ${
                  isRTL
                    ? "mr-4 pr-4 border-r border-[var(--color-border-secondary)]"
                    : "ml-4 pl-4 border-l border-[var(--color-border-secondary)]"
                }
              `}
            >
              {item.subItems!.map((subItem) =>
                renderItem(subItem, depth + 1, item.id),
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGroup = (group: SidebarGroup, index: number) => {
    const groupKey = `group-${index}`;
    const isExpanded = expandedGroups.has(groupKey);

    if (isIconOnly) {
      return (
        <div key={groupKey} className="space-y-1">
          {group.items.map((item) => renderItem(item))}
        </div>
      );
    }

    return (
      <div key={groupKey} className="mb-2">
        {showGroupLabels && (
          <button
            onClick={() => toggleGroup(groupKey)}
            className={`
              w-full flex items-center gap-2 px-3 py-2
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
              className={`transition-transform duration-250 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
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

  // Outer radius: only the edge that faces the content is rounded
  const radiusClass = fixed
    ? ""
    : isRTL
      ? "rounded-l-[var(--radius-large)]"
      : "rounded-r-[var(--radius-large)]";

  const positionClasses = fixed
    ? "fixed top-0 z-40"
    : `relative overflow-hidden ${radiusClass}`;

  // direction style forces nested flex (logo+text, icon+label) to mirror
  const rtlDirection =
    isRTL && !isCollapsed
      ? ({ direction: "rtl" } as const)
      : ({ direction: "ltr" } as const);

  return (
    <div
      className={`
        flex transition-all duration-300 ease-[var(--ease-in-out)]
        ${fixed ? "min-h-screen" : ""}
        ${className}
      `}
      style={{
        height: fixed ? "100%" : height,
        maxHeight: fixed ? "100%" : height,
      }}
    >
      {/* Sidebar */}
      <aside
        className={`
          ${positionClasses}
          h-full
          bg-[var(--color-bg-secondary)]/95
          backdrop-blur-[20px]
          transition-all duration-300 ease-[var(--ease-in-out)]
          flex flex-col
          ${isRTL ? "border-l" : "border-r"}
          border-[var(--color-border-primary)]
          ${fixed ? "" : "shadow-[var(--shadow-float)]"}
        `}
        style={{
          width: isCollapsed ? collapsedWidth : expandedWidth,
          [isRTL ? "right" : "left"]: fixed ? 0 : "auto",
          flexShrink: 0,
          height: "100%",
          maxHeight: "100%",
        }}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {/* Brand / logo – direction:rtl mirrors nested flex content */}
        {brand && (
          <div
            className={`
              flex items-center gap-3 px-4 py-4
              border-b border-[var(--color-border-primary)]
              min-h-[64px] flex-shrink-0
              ${isCollapsed ? "justify-center px-2" : ""}
            `}
            style={rtlDirection}
            dir={isRTL && !isCollapsed ? "rtl" : "ltr"}
          >
            {brand}
          </div>
        )}

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 sidebar-scroll"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--color-border-primary) transparent",
          }}
        >
          <style>{`
            .sidebar-scroll::-webkit-scrollbar { width: 4px; }
            .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
            .sidebar-scroll::-webkit-scrollbar-thumb {
              background: var(--color-border-primary);
              border-radius: 4px;
            }
            .sidebar-scroll::-webkit-scrollbar-thumb:hover {
              background: var(--color-text-tertiary);
            }
          `}</style>
          {groups.map((group, index) => renderGroup(group, index))}
        </nav>

        {/* Footer + collapse toggle */}
        <div className="border-t border-[var(--color-border-primary)] flex-shrink-0">
          {footer && (
            <div className={`p-3 ${isCollapsed ? "flex justify-center" : ""}`}>
              <div
                className={`
                  w-full
                  ${
                    isCollapsed
                      ? `
                        flex justify-center
                        [&>button]:!w-10 [&>button]:!h-10 [&>button]:!px-0 [&>button]:!gap-0 [&>button]:justify-center
                        [&>button>span:not(:first-child)]:hidden
                        [&>button>svg+span]:hidden
                        [&>a]:!w-10 [&>a]:!h-10 [&>a]:!px-0 [&>a]:!gap-0 [&>a]:justify-center
                        [&>a>span:not(:first-child)]:hidden
                      `
                      : ""
                  }
                `}
                style={rtlDirection}
                dir={isRTL && !isCollapsed ? "rtl" : "ltr"}
              >
                {footer}
              </div>
            </div>
          )}

          {collapsible && (
            <div
              className={`px-3 pb-3 ${isCollapsed ? "flex justify-center" : ""}`}
            >
              <button
                onClick={toggleCollapse}
                className={`
                  flex items-center justify-center
                  rounded-[var(--radius-md)] glass
                  text-[var(--color-text-secondary)]
                  hover:text-[var(--color-text-primary)]
                  hover:bg-[var(--color-bg-elevated)]/40
                  transition-all duration-180 text-sm gap-2
                  ${isCollapsed ? "w-10 h-10 px-0" : "w-full px-3 py-2"}
                  ${!isCollapsed && isRTL ? "flex-row-reverse" : ""}
                `}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={`${isCollapsed ? "Expand" : "Collapse"} (Ctrl+B)`}
              >
                <svg
                  className={`
                    h-4 w-4 flex-shrink-0 transition-transform duration-300
                    ${
                      isCollapsed
                        ? isRTL
                          ? "rotate-180"
                          : "rotate-0"
                        : isRTL
                          ? "rotate-0"
                          : "rotate-180"
                    }
                  `}
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
                {!isCollapsed && (
                  <span className="text-xs font-mono text-[var(--color-text-tertiary)]">
                    Ctrl+B
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Content area with smooth fade */}
      {displayedContent != null && (
        <div
          className="flex-1 p-6 overflow-y-auto transition-all duration-300 ease-[var(--ease-in-out)]"
          style={{
            height: "100%",
            maxHeight: "100%",
            minHeight: 0,
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0)" : "translateY(6px)",
            transition:
              "opacity 160ms cubic-bezier(0.4, 0, 0.2, 1), transform 160ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {displayedContent}
        </div>
      )}
    </div>
  );
};

Sidebar.displayName = "Sidebar";
export default Sidebar;
